import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../store/reducers/chatSlice";
import {
  createChatAction,
  deleteChatAction,
  getChatMessagesAction,
  getUserChatsAction,
} from "../../store/chatAction";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MessageIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function Sidebar({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chats, activeChatId, isLoadingChats } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.user);

  const [hoveredId, setHoveredId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  

  useEffect(() => {
    if (activeChatId) {
      dispatch(getChatMessagesAction({ chatId: activeChatId }));
    }
  }, [activeChatId, dispatch]);

  // ─── Create Chat
  const handleCreateChat = async () => {
  if (!chatTitle.trim()) return;

  const res = await dispatch(createChatAction({ title: chatTitle }));

  if (res.payload?._id) {
    await dispatch(getUserChatsAction()); // ✅ list refresh
    dispatch(setActiveChat(res.payload._id));
  }

  setIsModalOpen(false);
  setChatTitle("");
};

  // ─── Select Chat
  const handleSelectChat = (chatId) => {
    if (!chatId || chatId === activeChatId) return;
    dispatch(setActiveChat(chatId));
    dispatch(getChatMessagesAction({ chatId }));
  };

  // ─── Delete Chat
  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    await dispatch(deleteChatAction({ chatId }));
    await dispatch(getUserChatsAction());

    if (chatId === activeChatId) {
      dispatch(setActiveChat(null));
    }
  };

  return (
    <>
      <aside className="w-64 min-w-[256px] bg-[#111318] border-r border-white/5 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-[18px] border-b border-white/5">
          <div className="text-[15px] font-semibold text-white">JarviSync</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-[30px] h-[30px] rounded-md border border-white/10 text-white/50 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all"
            >
              <PlusIcon />
            </button>
            <X
              className="w-5 h-5 text-white/50 cursor-pointer hover:text-white transition"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Chat List */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {isLoadingChats ? (
            <div className="flex flex-col gap-4 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 rounded-lg bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-white/40">No chats yet</p>
            </div>
          ) : (
            chats.map((chat, index) => (
              <div
                key={chat._id ?? index}
                onClick={() => handleSelectChat(chat._id)}
                onMouseEnter={() => setHoveredId(chat._id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex mt-2 items-center gap-2 px-4 py-3 rounded-lg cursor-pointer group
                  ${
                    activeChatId === chat._id
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <MessageIcon />
                <span className="text-[13px] truncate flex-1">
                  {chat.title || "Untitled"}
                </span>
                {(hoveredId === chat._id || activeChatId === chat._id) && (
                  <button
                    onClick={(e) => handleDelete(e, chat._id)}
                    className="text-white/30 hover:text-red-400 cursor-pointer hover:bg-red-500/10 p-1 rounded transition"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t  border-white/5 flex items-center gap-3 cursor-pointer rounded m-1"
        onClick={() => navigate("/profile")}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold ">
            {user?.fullname?.firstname?.charAt(0)?.toUpperCase() || "U"}{" "}
          </div>
          <div>
            <p className="text-sm text-white">
              {user?.fullname?.firstname || "User"} {/* ✅ fix */}
            </p>
            <p className="text-xs text-white/30">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1d24]/80 border border-white/10 rounded-2xl p-6 w-[90%] max-w-sm">
            <h2 className="text-white text-lg font-semibold mb-4">
              Create New Chat
            </h2>
            <input
              type="text"
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
              placeholder="Enter chat name..."
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleCreateChat()}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setChatTitle("");
                }}
                className="text-sm text-white/60"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChat}
                className="px-4 py-2 bg-[#89A8B2] text-white rounded-lg hover:scale-105 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
