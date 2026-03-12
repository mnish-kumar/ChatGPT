import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../pages/Logout";
import {
  Plus,
  MessageSquare,
  Settings,
  Search,
  Trash2,
  PanelRight,
  LogIn,
} from "lucide-react";
import { useAuth } from "../auth/hooks/useauth";
import { getChats, deleteChat } from "../auth/API/chat.api";

const Sidebar = ({
  setMessages,
  setChatId,
  sidebarOpen,
  setSidebarOpen,
  setShowLoginPopup,
}) => {
  const [activeConversation, setActiveConversation] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [newChatName, setNewChatName] = useState("");
  const [showNewChatInput, setShowNewChatInput] = useState(false);

  const navigate = useNavigate();
  const { user, handleCreateChat, handleGetMessages } = useAuth();

  const createNewConversation = () => {
    // Check if user is logged in
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    setNewChatName("");
    setShowNewChatInput(true);
    
  };

  const confirmNewChat = async () => {
    const title = newChatName.trim() || `New conversation`;

    const chat = await handleCreateChat({ title });

    setConversations([{ id: chat._id, title: chat.title }, ...conversations]);
    setActiveConversation(chat._id);
    setChatId(chat._id);
    setMessages([]);
    setShowNewChatInput(false);
    setNewChatName("");
  };


  useEffect(() => {
    if (!user) {
      setConversations([]);
      return;
    }
    getChats()
      .then((data) => {
        const chats = Array.isArray(data) ? data : data?.chats ?? [];
        setConversations(
          chats.map((chat) => ({ id: chat._id, title: chat.title }))
        );
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }, [user]);

  const cancelNewChat = () => {
    setShowNewChatInput(false);
    setNewChatName("");
  };

  const deleteConversation = (id) => {
    deleteChat(id)
      .then(() => {
        setConversations(conversations.filter((c) => c.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
      });
    if (activeConversation === id) {
      setActiveConversation(conversations[0]?.id || 1);
      setMessages([]);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );


  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <button
            className="new-chat-btn"
            onClick={createNewConversation}
            title="New conversation"
          >
            <Plus size={20} />
            <span>New chat</span>
          </button>

          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
          >
            <PanelRight size={20} />
          </button>
        </div>

        <div className="sidebar-search">
          <Search size={18} />
          <input
            onChange={(filteredConversations) =>
              setSearchTerm(filteredConversations.target.value)
            }
            type="text"
            placeholder="Search conversations..."
          />
        </div>

        <div className="conversations-list">
          <div className="conversations-header">Recent</div>
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeConversation === conv.id ? "active" : ""}`}
              onClick={() => {
              setActiveConversation(conv.id);
              setChatId(conv.id);
              setMessages([]);
              handleGetMessages(conv.id)
                .then((data) => {
                  const msgs = Array.isArray(data) ? data : data?.messages ?? [];
                  setMessages(
                    [...msgs].reverse().map((m, i) => ({
                      id: m._id ?? i,
                      type: m.role ?? m.type ?? "assistant",
                      content: m.content ?? m.text ?? "",
                    }))
                  );
                })
                .catch((err) => console.error("Error loading messages:", err));
            }}
            >
              <MessageSquare size={16} />
              <span>{conv.title}</span>
              <button
                className="delete-conv-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
                title="Delete conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          {user ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="sidebar-footer-btn"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <Logout />
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="sidebar-footer-btn"
            >
              <LogIn size={18} />
              <span>Log in</span>
            </button>
          )}
        </div>
      </aside>

      {showNewChatInput && (
        <div className="new-chat-modal-overlay" onClick={cancelNewChat}>
          <div className="new-chat-modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Chat</h3>
            <p>Enter a name for your new chat</p>
            <input
              type="text"
              autoFocus
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmNewChat();
                if (e.key === "Escape") cancelNewChat();
              }}
              placeholder="Chat name..."
              className="new-chat-modal-input"
            />
            <div className="new-chat-modal-actions">
              <button className="new-chat-modal-cancel" onClick={cancelNewChat}>
                Cancel
              </button>
              <button
                className="new-chat-modal-confirm"
                onClick={confirmNewChat}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
