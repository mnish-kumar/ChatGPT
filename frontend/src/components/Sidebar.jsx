import { useState } from "react";
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


const Sidebar = ({setMessages, sidebarOpen, setSidebarOpen}) => {
    const [activeConversation, setActiveConversation] = useState(1);
    const [conversations, setConversations] = useState([
    { id: 1, title: "How to learn React?" },
    { id: 2, title: "Python best practices" },
    { id: 3, title: "Web design tips" },
  ]);

  const navigate = useNavigate();
  const { user } = useAuth();
  


    const createNewConversation = () => {
    // Check if user is logged in
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    const newId = Math.max(...conversations.map((c) => c.id), 0) + 1;
    setConversations([
      {
        id: newId,
        title: `New conversation ${newId}`,
      },
      ...conversations,
    ]);
    setActiveConversation(newId);
    setMessages([]);
  };


  const deleteConversation = (id) => {
    setConversations(conversations.filter((c) => c.id !== id));
    if (activeConversation === id) {
      setActiveConversation(conversations[0]?.id || 1);
      setMessages([]);
    }
  };
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
          <input type="text" placeholder="Search conversations..." />
        </div>

        <div className="conversations-list">
          <div className="conversations-header">Recent</div>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeConversation === conv.id ? "active" : ""}`}
              onClick={() => setActiveConversation(conv.id)}
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
    </>
  );
};

export default Sidebar;
