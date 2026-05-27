export default function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-3 mt-2 px-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-2 h-10 rounded-xl bg-white/5 animate-pulse p-2"
        >
          {/* Avatar skeleton */}
          <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
          
          {/* Title and preview skeleton */}
          <div className="flex-1 space-y-1">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-2 w-32 bg-white/5 rounded animate-pulse" />
          </div>
          
          {/* Timestamp skeleton */}
          <div className="h-2 w-12 bg-white/5 rounded animate-pulse flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
