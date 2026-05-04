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
      <aside className="h-full w-[280px] min-w-[280px] bg-[#0f1219] border-r border-[#89A8B2]/15 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex flex-col leading-tight">
            <div className="text-[15px] font-semibold text-white">JarviSync</div>
            <div className="text-[11px] mt-2 tracking-wide uppercase text-[#B3C8CF]/40">
              AI Get Hired Faster
            </div>
          </div>
          <X
            className="w-5 h-5 text-[#B3C8CF]/60 cursor-pointer hover:text-[#B3C8CF] transition md:hidden"
            onClick={onClose}
          />
        </div>

        {/* Primary action */}
        <div className="px-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full h-10 rounded-xl bg-[#89A8B2] text-[#0f1219] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#B3C8CF] hover:shadow-lg hover:shadow-[#89A8B2]/25 transition-all"
          >
            <PlusIcon />
            New Chat
          </button>
        </div>

        {/* Nav */}
        <div className="px-4 mt-5">
          <div className="text-[10px] tracking-wider uppercase text-[#B3C8CF]/30 mb-2">
            Main navigation
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#B3C8CF]/70 hover:bg-[#89A8B2]/10 hover:text-[#B3C8CF] transition"
          >
            <MessageIcon />
            <span className="text-[13px]">New Chat</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#B3C8CF]/70 hover:bg-[#89A8B2]/10 hover:text-[#B3C8CF] transition"
          >
            <span className="w-[14px] h-[14px] rounded-full border border-[#89A8B2]/35 inline-flex items-center justify-center text-[10px] text-[#B3C8CF]/60">
              U
            </span>
            <span className="text-[13px]">Profile</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="flex-1 overflow-y-auto px-2 pt-4 pb-2">
          <div className="px-2 text-[10px] tracking-wider uppercase text-[#B3C8CF]/30 mb-2">
            Recent activity
          </div>
          {isLoadingChats ? (
            <div className="flex flex-col gap-3 mt-2 px-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[#B3C8CF]/50">No chats yet</p>
            </div>
          ) : (
            chats.map((chat, index) => (
              <div
                key={chat._id ?? index}
                onClick={() => handleSelectChat(chat._id)}
                onMouseEnter={() => setHoveredId(chat._id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer group transition-all
                  ${
                    activeChatId === chat._id
                      ? "bg-[#89A8B2]/20 text-white"
                      : "text-[#B3C8CF]/70 hover:bg-[#89A8B2]/10 hover:text-[#B3C8CF]"
                  }`}
              >
                <span className="w-5 h-5 rounded-lg bg-[#89A8B2]/10 border border-[#89A8B2]/20 flex items-center justify-center text-[#B3C8CF]/70">
                  <MessageIcon />
                </span>
                <span className="text-[13px] truncate flex-1">
                  {chat.title || "Untitled"}
                </span>
                {(hoveredId === chat._id || activeChatId === chat._id) && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, chat._id)}
                    className="text-[#B3C8CF]/40 hover:text-red-400 cursor-pointer hover:bg-red-500/15 p-1 rounded transition"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-[#89A8B2]/15 flex items-center gap-3 cursor-pointer rounded m-1 hover:bg-[#89A8B2]/10 transition-all"
        onClick={() => navigate("/profile")}>
          <div className="w-8 h-8 rounded-full bg-[#89A8B2] flex items-center justify-center text-sm font-semibold text-[#0f1219]">
            {user?.fullname?.firstname?.charAt(0)?.toUpperCase() || "U"}{" "}
          </div>
          <div>
            <p className="text-sm text-white font-medium">
              {user?.fullname?.firstname || "User"}
            </p>
            <p className="text-xs text-[#B3C8CF]/50">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#0f1219]/95 border border-[#89A8B2]/20 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl">
            <h2 className="text-white text-lg font-semibold mb-4">
              Create New Chat
            </h2>
            <input
              type="text"
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
              placeholder="Enter chat name..."
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-[#89A8B2]/30 text-white placeholder:text-[#B3C8CF]/40 focus:border-[#89A8B2]/60 focus:bg-white/10 outline-none transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleCreateChat()}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setChatTitle("");
                }}
                className="text-sm text-[#B3C8CF]/60 hover:text-[#B3C8CF] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChat}
                className="px-4 py-2 bg-[#89A8B2] text-[#0f1219] rounded-lg font-medium hover:bg-[#B3C8CF] hover:shadow-lg hover:shadow-[#89A8B2]/30 transition-all"
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
