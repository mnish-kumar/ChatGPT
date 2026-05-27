export default function NavbarSkeleton() {
  return (
    <div className="fixed top-3 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between rounded-full border border-white/60 bg-white/10 px-4 py-3 shadow-xl shadow-black/5 backdrop-blur-xl sm:px-6">
          {/* Logo Skeleton */}
          <div className="h-6 w-24 bg-gray-300 rounded-full animate-pulse" />

          {/* Desktop Menu Skeleton */}
          <div className="hidden items-center gap-1 md:flex">
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-gray-300 rounded-full animate-pulse"
                />
              ))}
            </div>

            {/* Auth Button Skeleton */}
            <div className="ml-2">
              <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Mobile Toggle Skeleton */}
          <div className="inline-flex h-10 w-10 rounded-full border border-white/60 bg-white/25 md:hidden">
            <div className="h-5 w-5 bg-gray-300 rounded animate-pulse m-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
