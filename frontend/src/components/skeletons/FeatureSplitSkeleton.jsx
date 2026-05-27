export default function FeatureSplitSkeleton() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        {/* Title Skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-full bg-gray-300 rounded-lg animate-pulse" />
          <div className="h-10 w-2/3 bg-gray-300 rounded-lg animate-pulse mx-auto" />
        </div>

        {/* Description Skeleton */}
        <div className="mt-3 space-y-2">
          <div className="h-6 w-full bg-gray-300 rounded-lg animate-pulse" />
          <div className="h-6 w-4/5 bg-gray-300 rounded-lg animate-pulse mx-auto" />
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Free Card */}
        <div className="rounded-3xl border border-white/60 bg-white/35 p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Badge */}
              <div className="h-8 w-20 bg-gray-300 rounded-full animate-pulse inline-block" />
              
              {/* Title */}
              <div className="mt-4 h-7 w-48 bg-gray-300 rounded-lg animate-pulse" />
              
              {/* Description */}
              <div className="mt-2 space-y-2">
                <div className="h-5 w-full bg-gray-300 rounded animate-pulse" />
                <div className="h-5 w-4/5 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
            
            {/* Icon */}
            <div className="rounded-2xl border border-white/60 bg-white/35 p-3 w-16 h-16 flex items-center justify-center">
              <div className="h-6 w-6 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>

          {/* Feature List */}
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-300 rounded animate-pulse" />
                <div className="h-5 w-40 bg-gray-300 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Premium Card */}
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-[28px] bg-linear-to-br from-[#89A8B2] via-[#B3C8CF] to-[#E5E1DA] opacity-65 blur" />
          <div className="relative rounded-3xl border border-white/70 bg-white/30 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Badge */}
                <div className="h-8 w-24 bg-gray-300 rounded-full animate-pulse inline-block" />
                
                {/* Title */}
                <div className="mt-4 h-7 w-48 bg-gray-300 rounded-lg animate-pulse" />
                
                {/* Description */}
                <div className="mt-2 space-y-2">
                  <div className="h-5 w-full bg-gray-300 rounded animate-pulse" />
                  <div className="h-5 w-4/5 bg-gray-300 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Icon */}
              <div className="rounded-2xl border border-white/60 bg-white/35 p-3 w-16 h-16 flex items-center justify-center">
                <div className="h-6 w-6 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>

            {/* Feature Items */}
            <div className="mt-6 grid gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/25 px-4 py-3 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
                    <div className="h-5 w-32 bg-gray-300 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Bottom Badge */}
            <div className="mt-6 h-8 w-56 bg-gray-300 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
