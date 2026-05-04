import { useState } from "react";

const formatContent = (text) => {
  if (!text) return [{ type: "text", content: "" }];
  const parts = [];
  const regex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0,
    match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex)
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    parts.push({
      type: "code",
      lang: match[1] || "text",
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length)
    parts.push({ type: "text", content: text.slice(lastIndex) });
  return parts.length > 0 ? parts : [{ type: "text", content: text }];
};

const CodeBlock = ({ lang, content }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#89A8B2]/20 my-2 bg-[#0f1219]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#89A8B2]/15">
        <span className="text-[11px] font-mono text-[#B3C8CF]/40">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-[#B3C8CF]/40 hover:text-[#B3C8CF]/80 transition-colors px-2 py-1 rounded hover:bg-[#89A8B2]/10"
        >
          {copied ? (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-[13px] font-mono text-[#E5E1DA]/90 leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
};

const TextPart = ({ content, isUser }) => {
  const html = content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-[#89A8B2]/15 px-1.5 py-0.5 rounded text-[12.5px] font-mono text-[#E5E1DA]">$1</code>',
    )
    .replace(/\n/g, "<br/>");
  return (
    <p
      className={`text-[14px] leading-relaxed ${isUser ? "text-white" : "text-[#E5E1DA]/90"}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default function MessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === "user";
  const parts = formatContent(message.content);
  const [msgCopied, setMsgCopied] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setMsgCopied(true);
    setTimeout(() => setMsgCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 py-1.5 ${isUser ? "justify-end" : "justify-start items-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-[#89A8B2]/20 border border-[#89A8B2]/40 text-[#89A8B2] flex items-center justify-center flex-shrink-0 mt-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              opacity="0.9"
            />
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"} max-w-[80%]`}
      >
        <div
          className={`px-4 py-2.5 w-full ${
            isUser
              ? "bg-[#89A8B2] text-[#0f1219] rounded-[18px] rounded-br-[4px] font-medium shadow-lg shadow-[#89A8B2]/20"
              : "bg-white/[0.08] border border-[#89A8B2]/20 rounded-[4px] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px]"
          }`}
        >
          {parts.map((part, i) =>
            part.type === "code" ? (
              <CodeBlock key={i} lang={part.lang} content={part.content} />
            ) : (
              <TextPart key={i} content={part.content} isUser={isUser} />
            ),
          )}

          {isStreaming && (
            <span className="inline-block w-0.5 h-3.5 bg-[#B3C8CF]/80 ml-0.5 align-middle animate-[blink_0.8s_steps(2)_infinite] rounded-sm" />
          )}
        </div>

        {!isUser && !isStreaming && (
          <button
            onClick={handleCopyMessage}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[11px] text-[#B3C8CF]/40 hover:text-[#B3C8CF]/80 px-2 py-1 rounded hover:bg-[#89A8B2]/10"
          >
            {msgCopied ? (
              <>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
