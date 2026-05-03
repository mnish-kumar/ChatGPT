import { useState } from "react";

const formatContent = (text) => {
  if (!text) return [{ type: "text", content: "" }];
  const parts = [];
  const regex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex)
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    parts.push({ type: "code", lang: match[1] || "text", content: match[2].trim() });
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
    <div className="rounded-xl overflow-hidden border border-white/10 my-2 bg-[#13151c]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="text-[11px] font-mono text-white/30">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/70 transition-colors px-2 py-1 rounded hover:bg-white/5"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-[13px] font-mono text-[#c9d1d9] leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
};

const TextPart = ({ content, isUser }) => {
  const html = content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-[12.5px] font-mono">$1</code>')
    .replace(/\n/g, "<br/>");
  return (
    <p
      className={`text-[14px] leading-relaxed ${isUser ? "text-white" : "text-white/85"}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default function MessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === "user";
  const parts = formatContent(message.content);

  return (
    <div className={`flex gap-3 py-1.5 ${isUser ? "justify-end" : "justify-start items-start"}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-600/20 text-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0.9"/>
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[72%] px-4 py-2.5 ${
          isUser
            ? "bg-blue-600 rounded-[18px] rounded-br-[4px]"
            : "bg-white/5 border border-white/8 rounded-[4px] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px] max-w-[80%]"
        }`}
      >
        {parts.map((part, i) =>
          part.type === "code" ? (
            <CodeBlock key={i} lang={part.lang} content={part.content} />
          ) : (
            <TextPart key={i} content={part.content} isUser={isUser} />
          )
        )}

        {/* Streaming cursor */}
        {isStreaming && (
          <span className="inline-block w-0.5 h-3.5 bg-blue-400 ml-0.5 align-middle animate-[blink_0.8s_steps(2)_infinite] rounded-sm" />
        )}
      </div>
    </div>
  );
}
