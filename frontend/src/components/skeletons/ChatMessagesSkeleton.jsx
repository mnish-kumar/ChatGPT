export default function ChatMessagesSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0c10] p-4 space-y-4">
      {/* Messages loading skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 space-y-2 ${
              i % 2 === 0
                ? "bg-blue/20 border border-blue/10"
                : "bg-white/5 border border-white/10"
            }`}
          >
            {/* Message lines skeleton */}
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className={`h-4 rounded animate-pulse ${
                  i % 2 === 0
                    ? "bg-blue/30"
                    : "bg-white/10"
                } ${j === 3 ? "w-3/4" : "w-full"}`}
              />
            ))}
            
            {/* Timestamp skeleton */}
            <div className="h-3 w-16 rounded animate-pulse mt-2 bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
