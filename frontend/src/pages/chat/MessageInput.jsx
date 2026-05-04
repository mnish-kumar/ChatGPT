import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserMessage, clearError } from "../../store/reducers/chatSlice";
import { getSocket } from "../../service/socket";

export default function MessageInput() {
  const dispatch = useDispatch();
  const { activeChatId, isStreaming } = useSelector((s) => s.chat);
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  const handleSend = () => {
    const content = input.trim();
    if (!content || isStreaming || !activeChatId) return;
    dispatch(clearError());
    dispatch(addUserMessage({ chatId: activeChatId, content }));
    getSocket().emit("ai-message", { content, chat: activeChatId });
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 && !isStreaming && !!activeChatId;

  return (
    <div className="px-5 pb-4 pt-2 max-w-3xl mx-auto w-full">
      <div
        className={`flex items-end gap-3 bg-white/[0.04] border rounded-[22px] px-4 py-2.5 transition-colors
          ${isStreaming ? "border-[#89A8B2]/50 bg-[#89A8B2]/10" : "border-[#89A8B2]/20 focus-within:border-[#89A8B2]/60 focus-within:bg-white/[0.08]"}`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!activeChatId || isStreaming}
          placeholder={
            !activeChatId
              ? "Select or create a chat to begin..."
              : isStreaming
              ? "Waiting for response..."
              : "Message NexusAI... (Shift+Enter for new line)"
          }
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] text-white placeholder:text-[#B3C8CF]/40 leading-[1.55] max-h-[200px] overflow-y-auto scrollbar-none disabled:cursor-not-allowed py-1"
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all
            ${canSend
              ? "bg-[#89A8B2] text-[#0f1219] hover:bg-[#B3C8CF] hover:scale-105 cursor-pointer shadow-lg shadow-[#89A8B2]/20"
              : "bg-white/5 text-[#B3C8CF]/30 cursor-not-allowed"
            }`}
        >
          {isStreaming ? (
            <div className="flex gap-[3px] items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-white/30 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-[#B3C8CF]/30 mt-2">
        NexusAI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
