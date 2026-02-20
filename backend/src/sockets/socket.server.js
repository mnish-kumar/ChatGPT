const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createVector, queryVectors } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    /* options */
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

      console.log("Received ai-message:", messagePayload.content);

      // Store user message in DB
      const userMessage = await messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: messagePayload.content,
          role: 'user'
      });

      const vectors = await aiService.generateEmbedding(messagePayload.content);


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

        console.log("Supabase memory created successfully");
      } catch (error) {
        console.error("Supabase memory error", error);
      }


      const memory = await queryVectors({
        queryVector: vectors,
        limit: 3,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      console.log("Memory retrieved from Supabase:", memory);


      // Retrieve last 20 messages from chat history [Short term memory for AI]
      const chatHistory = (await messageModel.find(
        {chat: messagePayload.chat,}
      ).sort({ createdAt: -1 }).limit(20).lean()).reverse();

      // Generate AI response
      const Response = await aiService.generateResponse(chatHistory.map(item => {
          return{
              role: item.role,
              parts: [{
                  text: item.content,
              }]
          }
      }));

      console.log("Generated AI response:", Response);

      // Store AI response in DB
      const aiResponseMessage = await messageModel.create({
          user: socket.user._id,
          chat: messagePayload.chat,
          content: Response,
          role: 'model'
      });


      const responseVectors = await aiService.generateEmbedding(Response);

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

        console.log("Supabase memory created successfully");
      }catch (error) {
        console.error("Supabase memory error", error);
      }

      // Emit AI response back to client
      socket.emit("ai-response", {
        content: Response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
