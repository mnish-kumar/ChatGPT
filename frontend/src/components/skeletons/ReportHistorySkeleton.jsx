const ReportHistorySkeleton = () => (
  <div className="min-h-screen bg-[#0d0f14] text-white font-sans">
    {/* Desktop sidebar + content */}
    <div className="hidden sm:flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#1e2130] h-screen sticky top-0 p-4">
        <div className="h-4 w-32 rounded bg-[#1e2130] animate-pulse" />
      </aside>
      {/* Cards */}
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <div className="h-6 w-48 rounded bg-[#1e2130] animate-pulse mb-2" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0d0f14] border border-[#1e2130] rounded-xl p-4 animate-pulse"
            >
              <div className="h-3 bg-[#1e2130] rounded mb-2 w-3/4" />
              <div className="h-2 bg-[#1e2130] rounded mb-3 w-1/2" />
              <div className="h-1.5 bg-[#1e2130] rounded mb-2" />
              <div className="flex gap-1.5 mt-2">
                <div className="h-4 w-16 bg-[#1e2130] rounded-full" />
                <div className="h-4 w-12 bg-[#1e2130] rounded-full" />
                <div className="h-4 w-14 bg-[#1e2130] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
);

export default ReportHistorySkeleton;
