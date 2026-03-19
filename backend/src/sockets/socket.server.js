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
    
      if (!messagePayload.content?.trim()) {
        socket.emit("ai-error", { message: "Content cannot be empty" });
        return;
      }
      
      if (messagePayload.content.length > 5000) {
        socket.emit("ai-error", { message: "Message too long" });
        return;
      }

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
          userId: socket.user._id,
          chatId: messagePayload.chat,
          messageId: userMessage._id, // Use the messageId from the user message
          vectors,
          metadata: {
            text: messagePayload.content,
            role: "user",
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

      const chunkingCallback = (chunk) => {
        socket.emit("ai-chunk", {
          content: chunk,
          chat: messagePayload.chat,
        });
      }

      // Generate AI response and stream chunks to client
      const Response = await aiService.GenerateContentStream([...LTM, ...STM],chunkingCallback);

      // Signal streaming is complete
      socket.emit("ai-response", {
        content: Response,
        chat: messagePayload.chat,
      });

      const [aiResponseMessage, responseVectors] = await Promise.all([
        // Store AI response in DB
        messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: Response,
          role: "model",
        }),

        aiService.generateEmbedding(Response),
      ]);

      // Save AI response in Supabase -> vectors, metadata (user, chat), messageId(unique id for each message)
      try {
        await createVector({
          userId: socket.user._id,
          chatId: messagePayload.chat,
          vectors: responseVectors,
          messageId: aiResponseMessage._id,
          metadata: {
            text: Response,
            role: "model",
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
