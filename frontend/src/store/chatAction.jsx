import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createChat,
  getChatMessages,
  getUserChats,
  deleteChat,
} from "../api/chat.api";

export const createChatAction = createAsyncThunk(
  "chat/createChat",
  async ({ title }, { rejectWithValue }) => {
    try {
      const response = await createChat({ title });
      return response.chat;
    } catch (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || error?.errors?.[0]?.msg || "Chat creation failed";
      return rejectWithValue(errorMsg);
    }
  },
);

export const getUserChatsAction = createAsyncThunk(
  "chat/getUserChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserChats();
      return response;
    } catch (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to fetch chats";
      return rejectWithValue(errorMsg);
    }
  },
);

export const getChatMessagesAction = createAsyncThunk(
  "chat/getChatMessages",
  async ({ chatId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await getChatMessages(chatId, page, limit);
      return { chatId, messages: response.messages || [] };
    } catch (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to fetch messages";
      return rejectWithValue(errorMsg);
    }
  },
);

export const deleteChatAction = createAsyncThunk(
  "chat/deleteChat",
  async ({ chatId }, { rejectWithValue }) => {
    try {
      await deleteChat(chatId);
      return chatId;
    } catch (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to delete chat";
      return rejectWithValue(errorMsg);
    }
  },
);
