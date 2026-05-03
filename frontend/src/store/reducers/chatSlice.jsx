import { createSlice } from "@reduxjs/toolkit";
import {
  createChatAction,
  getUserChatsAction,
  getChatMessagesAction,
  deleteChatAction,
} from "../chatAction";

const initialState = {
  chats: [],
  activeChatId: null,
  messages: {}, // { [chatId]: [...messages] }
  streamingMessage: null,
  isStreaming: false,
  isLoadingChats: false,
  isLoadingMessages: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat(state, action) {
      state.activeChatId = action.payload;
      state.streamingMessage = null;
      state.isStreaming = false;
    },

    // Called on every "ai-chunk" socket event
    appendChunk(state, action) {
      const { content, chat } = action.payload;
      state.isStreaming = true;
      state.streamingMessage = (state.streamingMessage || "") + content;
      state.activeStreamingChat = chat; // ← konse chat ka stream hai
    },

    // Called on "ai-response" — streaming done, save full message
    finalizeResponse(state, action) {
      const { content, chat } = action.payload;
      state.isStreaming = false;

      const msg = {
        _id: Date.now().toString(),
        role: "model",
        content,
        createdAt: new Date().toISOString(),
      };

      if (!state.messages[chat]) state.messages[chat] = [];
      state.messages[chat].push(msg);
      state.streamingMessage = null;
    },

    // Optimistically add user message to UI
    addUserMessage(state, action) {
      const { chatId, content } = action.payload;
      if (!state.messages[chatId]) state.messages[chatId] = [];
      state.messages[chatId].push({
        _id: "temp-" + Date.now(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      });
    },

    clearError(state) {
      state.error = null;
    },

    setError(state, action) {
      state.error = action.payload;
      state.isStreaming = false;
      state.streamingMessage = null;
    },
  },
  extraReducers: (builder) => {
    // getUserChatsAction
    builder
      .addCase(getUserChatsAction.pending, (state) => {
        state.isLoadingChats = true;
      })
      .addCase(getUserChatsAction.fulfilled, (state, action) => {
        state.isLoadingChats = false;
        state.chats = action.payload;
      })
      .addCase(getUserChatsAction.rejected, (state, action) => {
        state.isLoadingChats = false;
        state.error = action.payload;
      });

    // createChatAction
    builder
      .addCase(createChatAction.fulfilled, (state, action) => {
        state.activeChatId = action.payload._id;
      })
      .addCase(createChatAction.rejected, (state, action) => {
        state.error = action.payload;
      });

    // getChatMessagesAction
    builder
      .addCase(getChatMessagesAction.pending, (state) => {
        state.isLoadingMessages = true;
      })
      .addCase(getChatMessagesAction.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(getChatMessagesAction.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload;
      });

    // deleteChatAction
    builder.addCase(deleteChatAction.fulfilled, (state, action) => {
      state.chats = state.chats.filter((c) => c._id !== action.payload);
      if (state.activeChatId === action.payload) {
        state.activeChatId = state.chats[0]?._id || null;
      }
      delete state.messages[action.payload];
    });
  },
});

export const {
  setActiveChat,
  appendChunk,
  finalizeResponse,
  addUserMessage,
  clearError,
  setError,
} = chatSlice.actions;
export default chatSlice.reducer;
