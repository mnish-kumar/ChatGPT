export default function ChatPageSkeleton() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0a0c10] to-[#0f1419]">
      <div className="flex flex-col items-center gap-4">
        {/* Main loading skeleton */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#B3C8CF]/20 to-[#89A8B2]/20 animate-pulse" />
        
        {/* Loading text */}
        <div className="h-6 w-32 bg-gradient-to-r from-[#B3C8CF]/20 to-[#89A8B2]/20 rounded-full animate-pulse" />
        
        {/* Animated dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#B3C8CF]/40 animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
