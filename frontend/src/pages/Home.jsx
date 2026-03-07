import { useEffect, useRef, useState } from "react";
import { Menu, Send, User2Icon } from "lucide-react";
import PopUp from "../components/PopUp";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useauth";
import { io } from "socket.io-client";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [socket, setSocket] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  

  const bottomRef = useRef(null);
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

    if (!socket) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
    };

    socket.emit("ai-message", {
      chat: chatId,
      role: "user",
      content: userMessage.content,
    });

    setMessages([...messages, userMessage]);
    setInputValue("");
  };

  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      setShowLoginPopup(true);
    }
  };

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  useEffect(() => {

    const tempSocket = io(BASE_URL, { withCredentials: true });
    tempSocket.on("ai-response", (message) => {
    console.log("Recieved AI response:", message);

      setMessages((prev) => [
        ...prev,
        {
          id: message._id ?? prev.length + 1,
          type: message.role ?? message.type ?? "assistant",
          content: message.content ?? message.text ?? "",
        },
      ]);
    });
    

    setSocket(tempSocket);

    return () => tempSocket.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            <button onClick={handleUserIconClick} title="Settings">
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
          <div ref={bottomRef} />
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
