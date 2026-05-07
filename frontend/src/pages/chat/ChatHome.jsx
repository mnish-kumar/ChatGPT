import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "@/service/socket";
import { appendChunk, finalizeResponse, setError } from "../../store/reducers/chatSlice";
import { getUserChatsAction } from "../../store/chatAction";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function ChatPage() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((s) => s.user);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { isLoading } = useSelector((state) => state.user);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-chart-4 text-gray-300">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex h-dvh overflow-hidden bg-[#0a0c10] p-1 gap-1">
      {/* Sidebar: inline on desktop, overlay on mobile */}
      {sidebarOpen && (
        <div className="hidden md:flex md:flex-none">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main area */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="h-full w-full">
          <div className="h-full w-full overflow-hidden rounded-2xl border border-[#89A8B2]/15 bg-[#0f1219]/35 backdrop-blur flex flex-col">
            <ChatWindow
              sidebarOpen={sidebarOpen}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}