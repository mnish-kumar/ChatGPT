const { chatModel } = require("../models/chat.model");
const messageModel = require("../models/message.model");

async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await chatModel.create({
    user: user._id,
    title,
  });

  res.status(201).json({
    message: "chat created successfully",

    chat: {
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      user: chat.user,
    },
  });
}

async function getUserChats(req, res) {
  const user = req.user;

  const chats = await chatModel
    .find({ user: user._id })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    chats: chats.map((chat) => ({
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      user: chat.user,
    })),
  });
}

async function getChatMessages(req, res) {
  const { chatId } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const messages = await messageModel
    .find({ chat: chatId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    messages: messages.map((message) => ({
      _id: message._id,
      content: message.content,
      role: message.role,
      chat: message.chat,
    }))
  });
}

async function deleteChat(req, res) {
  const user = req.user;
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: user._id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found or you don't have permission to delete it.",
    });
  }

  console.log("Deleting messages for chat:", chatId);
  await messageModel.deleteMany({ chat: chatId });

  res.status(200).json({
    message: "Chat deleted successfully.",
  });
}


module.exports = {
  createChat,
  getUserChats,
  getChatMessages,
  deleteChat,
};
