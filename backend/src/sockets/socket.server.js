const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createVector, queryVectors } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    }
  });

  // Middleware to authenticate socket connection
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(
        new Error("Authentication error ! Token not found in cookies"),
      );
    }

    try {
      const decode = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decode.id);

      if (!user) {
        return next(new Error("Authentication error ! User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      return next(new Error("Authentication error ! Invalid Token"));
    }
  });

  io.on("connection", (socket) => {
    // console.log("Socket connected with id:", socket.id);
    console.log("A user connection");

    // disconnection event fire when user disconnects
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    socket.on("ai-message", async (messagePayload) => {
      /*
      messagePayload = {
        content: "Hello, how are you?",
        Chat: chatId
      }
      */
      try {
    
      const [userMessage, vectors] = await Promise.all([
        // Store user message in DB and generate embedding in parallel
        messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: messagePayload.content,
          role: "user",
        }),

        aiService.generateEmbedding(messagePayload.content),
      ]);

      
      // Save user input in Supabase -> vectors, metadata (user, chat), messageId(unique id for each message)
      try {
        await createVector({
          vectors,
          messageId: userMessage._id, // Use the messageId from the user message
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: messagePayload.content,
          },
        });
      } catch (error) {
        console.error("Supabase memory error", error);
      }

      const [memory, chatHistory] = await Promise.all([
        // Query Supabase to get relevant past messages based on the current message vectors
        queryVectors({
          queryVector: vectors,
          limit: 3,
          metadata: {
            user: socket.user._id,
          },
        }).catch((err) => {
          console.error("Supabase query error", err);
          return [];
        }),

        // Retrieve last 20 messages from chat history [Short term memory for AI]
        messageModel
          .find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
          .then((result) => result.reverse()),
      ]);

      
      const STM = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [
            {
              text: item.content,
            },
          ],
        };
      });

      const LTM = [
        {
          role: "user",
          parts: [
            {
              text: `These are the some previous messagge from the chat, use them generate response.
            ${memory.map((item) => item.metadata.text).join("\n")}
            `,
            },
          ],
        },
      ];

      // Generate AI response
      const Response = await aiService.generateResponse([...LTM, ...STM]);

      // Emit AI response back to client
      socket.emit("ai-response", {
        content: Response,
        chat: messagePayload.chat,
      });

      const [aiResponseMessage, responseVectors] = await Promise.all([
        // Store AI response in DB
        await messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: Response,
          role: "model",
        }),

        await aiService.generateEmbedding(Response),
      ]);

      // Save AI response in Supabase -> vectors, metadata (user, chat), messageId(unique id for each message)
      try {
        await createVector({
          vectors: responseVectors,
          messageId: aiResponseMessage._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: Response,
          },
        });
      } catch (error) {
        console.error("Supabase memory error", error);
      }
      } catch (error) {
        console.error("ai-message handler error", error);
        socket.emit("ai-error", { message: "Something went wrong. Please try again." });
      }
    });
  });
}

module.exports = initSocketServer;
