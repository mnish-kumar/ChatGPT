import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Plus, MessageSquare, Settings, Search, Send, Trash2 } from 'lucide-react';
import Logout from '../pages/Logout';



const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([
    { id: 1, title: 'How to learn React?' },
    { id: 2, title: 'Python best practices' },
    { id: 3, title: 'Web design tips' },
  ]);


  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', content: 'Hello! How can I help you today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeConversation, setActiveConversation] = useState(1);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
    };
    setMessages([...messages, userMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: 'This is a simulated response. Connect your backend to get real responses!',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInputValue('');
  };

  const createNewConversation = () => {
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
    <div className="app-container">
      {/* Sidebar */}
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
          <button
            onClick={() => navigate("/profile")}
            className="sidebar-footer-btn"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <Logout />
        </div>
      </aside>

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
          <h1 className='text-gray-700'>ChatGPT</h1>
          <div className="header-actions">
            <button title="Settings">
              <Settings size={20} />
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
            <p className="input-footer">
              Free Research Preview. ChatGPT may produce inaccurate information.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home