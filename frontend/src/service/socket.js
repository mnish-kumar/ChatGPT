import { io } from "socket.io-client";

let socket = null;

const getSocketBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL?.trim();
  const socketUrl = import.meta.env.VITE_SOCKET_URL?.trim();

  if (apiUrl && apiUrl !== "undefined") return apiUrl;
  if (socketUrl && socketUrl !== "undefined") return socketUrl;
  if (typeof window !== "undefined") return window.location.origin;

  return undefined;
};

export const getSocket = () => {
  if (!socket) {
    socket = io(getSocketBaseUrl(), {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (token) => {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { token };
    s.connect();
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};