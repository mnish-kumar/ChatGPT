import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "@/service/socket";
import { appendChunk, finalizeResponse, setError } from "../../store/reducers/chatSlice";
import { getUserChatsAction } from "../../store/chatAction";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { Menu } from "lucide-react/dist/cjs/lucide-react";

export default function ChatPage() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((s) => s.user);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(getUserChatsAction());

    const socket = connectSocket(accessToken);

    socket.on("ai-chunk", (data) => dispatch(appendChunk(data)));
    socket.on("ai-response", (data) => dispatch(finalizeResponse(data)));
    socket.on("ai-error", (data) => dispatch(setError(data.message)));

    return () => {
      socket.off("ai-chunk");
      socket.off("ai-response");
      socket.off("ai-error");
      disconnectSocket();
    };
  }, [dispatch, accessToken]);

  return (
    <div className="flex h-screen overflow-hidden relative">
    {/* Sidebar toggle button */}
    {!sidebarOpen && (
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 z-50 w-8 h-8 flex items-center justify-center rounded-md border border-white/10 text-white/50 hover:bg-white/5 hover:text-white transition-all bg-[#111318]"
      >
        <Menu size={16} />
      </button>
    )}

    {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

    {/* ✅ flex-1 add karo taaki poori remaining width le */}
    <div className="flex-1 min-w-0 overflow-hidden">
      <ChatWindow />
    </div>
  </div>
  );
}