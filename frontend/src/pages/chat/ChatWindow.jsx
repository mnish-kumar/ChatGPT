import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, MoreVertical, Share2, SlidersHorizontal } from "lucide-react";

import { clearError } from "../../store/reducers/chatSlice";
import { getChatMessagesAction } from "@/store/chatAction";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const WelcomeScreen = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center max-w-md px-6 animate-[fadeUp_0.4s_ease]">
      <div className="w-16 h-16 rounded-2xl bg-[#89A8B2]/15 border border-[#89A8B2]/30 flex items-center justify-center mx-auto mb-5 text-[#89A8B2]">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-white mb-3">
        How can I help you?
      </h1>
      <p className="text-sm text-[#B3C8CF]/60 leading-relaxed mb-6">
        Ask me anything — I remember our past conversations.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          "Explain a concept",
          "Write some code",
          "Summarize a topic",
          "Give me ideas",
        ].map((s) => (
          <span
            key={s}
            className="text-[13px] px-4 py-2 rounded-full border border-[#89A8B2]/30 text-[#B3C8CF]/70 bg-[#89A8B2]/10 hover:border-[#89A8B2]/60 hover:text-[#B3C8CF] hover:bg-[#89A8B2]/20 cursor-pointer transition-all"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function ChatWindow({ sidebarOpen = true, onOpenSidebar }) {
  const dispatch = useDispatch();
  const {
    chats,
    activeChatId,
    messages,
    streamingMessage,
    isStreaming,
    isLoadingMessages,
    error,
  } = useSelector((s) => s.chat);

  const msgs = messages?.[activeChatId] || [];
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const activeChatTitle = chats?.find((c) => c?._id === activeChatId)?.title;

  useEffect(() => {
    if (!activeChatId) return;
    dispatch(getChatMessagesAction({ chatId: activeChatId }));
    shouldAutoScrollRef.current = true;
  }, [activeChatId, dispatch]);

  const updateAutoScrollFlag = () => {
    const el = scrollRef.current;
    if (!el) return;
    const thresholdPx = 80;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < thresholdPx;
  };

  useEffect(() => {
    if (msgs.length === 0) return;

    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [activeChatId]);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;
    bottomRef.current?.scrollIntoView({
      behavior: isStreaming ? "auto" : "smooth",
    });
  }, [msgs.length, streamingMessage, isStreaming]);

  return (
    <main className="h-full w-full flex flex-col overflow-hidden bg-transparent">
      {/* Top bar */}
      <div className="shrink-0 border-b border-[#89A8B2]/15 bg-[#0f1219]/35 backdrop-blur">
        <div className="h-12 flex items-center px-3 md:px-4">
          <div className="flex items-center gap-2 min-w-0">
            {!sidebarOpen && typeof onOpenSidebar === "function" && (
              <button
                type="button"
                aria-label="Open sidebar"
                onClick={onOpenSidebar}
                className="md:hidden w-9 h-9 rounded-xl border border-[#89A8B2]/20 bg-white/[0.02] text-[#B3C8CF]/80 flex items-center justify-center hover:bg-[#89A8B2]/10 hover:text-[#B3C8CF] transition"
              >
                <Menu size={16} />
              </button>
            )}

            <div className="min-w-0">
              <div className="text-[13px] font-medium text-white truncate">
                {activeChatId
                  ? activeChatTitle || "Untitled Chat"
                  : "NexusAI Studio"}
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Preferences"
              className="w-9 h-9 rounded-xl border border-[#89A8B2]/20 bg-white/[0.02] text-[#B3C8CF]/60 hover:text-[#B3C8CF] hover:bg-[#89A8B2]/10 transition flex items-center justify-center"
            >
              <SlidersHorizontal size={16} />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="w-9 h-9 rounded-xl border border-[#89A8B2]/20 bg-white/[0.02] text-[#B3C8CF]/60 hover:text-[#B3C8CF] hover:bg-[#89A8B2]/10 transition flex items-center justify-center"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              aria-label="More"
              className="w-9 h-9 rounded-xl border border-[#89A8B2]/20 bg-white/[0.02] text-[#B3C8CF]/60 hover:text-[#B3C8CF] hover:bg-[#89A8B2]/10 transition flex items-center justify-center"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={updateAutoScrollFlag}
        className="flex-1 overflow-y-auto no-scrollbar"
      >
        {!activeChatId ? (
          <div className="h-full flex">
            <WelcomeScreen />
          </div>
        ) : isLoadingMessages ? (
          <div className="max-w-3xl mx-auto px-5 pt-6 flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-16 rounded-2xl bg-[#89A8B2]/10 animate-pulse max-w-[60%] ${
                  i % 2 === 0 ? "self-end ml-auto" : "self-start"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        ) : msgs.length === 0 ? (
          <div className="h-full flex">
            <WelcomeScreen />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-5 pt-6 pb-2 flex flex-col gap-1">
            <div className="flex justify-center pb-5">
              <span className="text-[10px] tracking-wider uppercase px-3 py-1 rounded-full border border-[#89A8B2]/15 bg-[#0f1219]/35 text-[#B3C8CF]/40">
                Today
              </span>
            </div>

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
        <div className="shrink-0 max-w-md mx-auto mb-2 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-[13px] flex items-center gap-2 shadow-lg shadow-red-500/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
          <button
            type="button"
            onClick={() => dispatch(clearError())}
            className="ml-auto text-red-300/60 hover:text-red-300 transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-[#89A8B2]/15 bg-[#0f1219]/35 backdrop-blur">
        <MessageInput />
      </div>
    </main>
  );
}
