export default function HeroSkeleton() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background gradients + blurred shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-[#B3C8CF]/55 via-[#F1F0E8] to-[#89A8B2]/35" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#89A8B2]/45 blur-3xl" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-[#B3C8CF]/55 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#E5E1DA]/70 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-4xl">
          {/* Badge Skeleton */}
          <div className="h-8 w-48 bg-gray-300 rounded-full animate-pulse mx-auto" />

          {/* Title Skeleton */}
          <div className="mt-6 space-y-3">
            <div className="h-12 w-full bg-gray-300 rounded-lg animate-pulse" />
            <div className="h-12 w-3/4 bg-gray-300 rounded-lg animate-pulse" />
          </div>

          {/* Description Skeleton */}
          <div className="mt-5 space-y-2">
            <div className="h-6 w-full bg-gray-300 rounded-lg animate-pulse" />
            <div className="h-6 w-5/6 bg-gray-300 rounded-lg animate-pulse" />
          </div>

          {/* Buttons Skeleton */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="h-12 w-full sm:w-48 bg-gray-300 rounded-2xl animate-pulse" />
            <div className="h-12 w-full sm:w-48 bg-gray-300 rounded-2xl animate-pulse" />
          </div>

          {/* Info Cards Skeleton */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/50 bg-white/30 px-4 py-3 backdrop-blur-xl"
              >
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="mt-2 h-4 w-20 bg-gray-300 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
