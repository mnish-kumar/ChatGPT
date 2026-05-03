import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../store/reducers/chatSlice";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { getChatMessagesAction } from "@/store/chatAction";

const WelcomeScreen = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center max-w-md px-6 animate-[fadeUp_0.4s_ease]">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mx-auto mb-5 text-blue-500">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-white mb-3">How can I help you?</h1>
      <p className="text-sm text-white/40 leading-relaxed mb-6">
        Ask me anything — I remember our past conversations.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {["Explain a concept", "Write some code", "Summarize a topic", "Give me ideas"].map((s) => (
          <span
            key={s}
            className="text-[13px] px-4 py-2 rounded-full border border-white/10 text-white/40 bg-white/5 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/10 cursor-pointer transition-all"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function ChatWindow() {
  const dispatch = useDispatch();
  const {
    activeChatId,
    messages,
    streamingMessage,
    isStreaming,
    isLoadingMessages,
    error,
  } = useSelector((s) => s.chat);

  const msgs = messages[activeChatId] || [];
  const bottomRef = useRef(null);

  useEffect(() => {
    if (activeChatId) {
      dispatch(getChatMessagesAction({ chatId: activeChatId }));
    }
  }, [activeChatId, dispatch]);

 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length, streamingMessage]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#0d0e11]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {!activeChatId ? (
          <div className="h-full flex"><WelcomeScreen /></div>
        ) : isLoadingMessages ? (
          <div className="max-w-3xl mx-auto px-5 pt-6 flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-16 rounded-2xl bg-white/5 animate-pulse max-w-[60%] ${
                  i % 2 === 0 ? "self-end ml-auto" : "self-start"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        ) : msgs.length === 0 ? (
          <div className="h-full flex"><WelcomeScreen /></div>
        ) : (
          <div className="max-w-3xl mx-auto px-5 pt-6 pb-2 flex flex-col gap-1">
            {msgs.map((msg) => (
              <MessageBubble key={msg._id} message={msg} />
            ))}
            {isStreaming && activeChatId && (
              <MessageBubble
                message={{ role: "model", content: streamingMessage || "" }}
                isStreaming
              />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto mb-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
          <button
            onClick={() => dispatch(clearError())}
            className="ml-auto text-red-400/50 hover:text-red-400"
          >
            ✕
          </button>
        </div>
      )}

      <MessageInput />
    </main>
  );
}