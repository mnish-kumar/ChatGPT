import { useState } from "react";
import { Menu, Send, User2Icon } from "lucide-react";

import PopUp from "../components/PopUp";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useauth";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Check if user is logged in
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
    };
    setMessages([...messages, userMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: "assistant",
        content:
          "This is a simulated response. Connect your backend to get real responses!",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInputValue("");
  };

  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      setShowLoginPopup(true);
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar Toggle Button (visible when closed) */}
      {!sidebarOpen && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(true)}
          title="Open sidebar"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        setMessages={setMessages}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowLoginPopup={setShowLoginPopup} 
      />

      {/* Main Chat Area */}
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-gray-700">ChatGPT</h1>
          <div className="header-actions">
            <button 
              onClick={handleUserIconClick} 
              title="Settings">
              <User2Icon size={20} />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <h2>Start a new conversation</h2>
                <p>Ask me anything or help me with a task</p>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.type === "user" ? "user-message" : "assistant-message"}`}
                >
                  <div className="message-content">
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <form onSubmit={handleSendMessage} className="message-input-form">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message ChatGPT..."
                className="message-input"
              />
              <button
                type="submit"
                className="send-btn"
                title="Send message"
                disabled={!inputValue.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Login Popup */}
      <PopUp
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        title="Login Required"
        message="Please log in to send messages and create new conversations."
      />
    </div>
  );
};

export default Home;
