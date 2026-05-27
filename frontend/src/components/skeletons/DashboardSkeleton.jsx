export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-10 w-40 bg-gray-300 rounded-lg animate-pulse mb-2" />
          <div className="h-6 w-72 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              {/* Card header skeleton */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
              </div>

              {/* Card content skeleton */}
              <div className="space-y-3">
                <div className="h-8 w-16 bg-gray-300 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Card footer skeleton */}
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
