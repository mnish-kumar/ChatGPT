import api from "../api/axios";

// ─── Create Chats ───────────────────────────────
export const createChat = async ({ title }) => {
  try {
    const response = await api.post("/api/chat", { title });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create chat" };
  }
};

// ─── Get User Chats ───────────────────────────────
export const getUserChats = async () => {
    try {
        const response = await api.get("/api/chat");
        return response.data.chats;
    }catch (error) {
        throw error.response?.data || { message: "Failed to fetch chats" };
    }
}

// ─── Get Chat Messages ───────────────────────────────
export const getChatMessages = async (chatId, page = 1, limit = 20) => {
    try {
        const response = await api.get(`/api/chat/${chatId}/messages`, {
            params: { page, limit }
        });
        return response.data;
    }catch (error) {
        throw error.response?.data || { message: "Failed to fetch messages" };
    }
}

// ─── Delete Chat ───────────────────────────────
export const deleteChat = async (chatId) => {
    try {
        await api.delete(`/api/chat/deleteChat/chatID/${chatId}`);
    }catch (error) {
        throw error.response?.data || { message: "Failed to delete chat" };
    }
}
