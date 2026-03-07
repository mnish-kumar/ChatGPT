import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export async function createChat({ title }) {
  try {
    const response = await api.post("/api/chat", { title });
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export async function getChats() {
  try {
    const response = await api.get("/api/chat");
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
}

export async function deleteChat(chatId) {
  try {
    const response = await api.delete(`/api/chat/${chatId}`);
    return response.data;
  }
  catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}