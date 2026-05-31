const ResumeHomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex font-sans">

      {/* ── Sidebar Skeleton ── */}
      <aside className="sticky top-0 h-screen w-64 border-r border-[#1e2130] flex flex-col bg-[#0d0f14] p-4 gap-3 shrink-0">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e2130]">
          <div className="h-3 w-36 rounded bg-[#1e2130] animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-[#1e2130] animate-pulse" />
        </div>

        {/* Nav button */}
        <div className="flex items-center gap-3 border border-[#1e2130] rounded-xl p-3">
          <div className="h-9 w-9 rounded-lg bg-[#1e2130] animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3 w-24 rounded bg-[#1e2130] animate-pulse" />
            <div className="h-2 w-32 rounded bg-[#1e2130] animate-pulse" />
          </div>
        </div>

        <div className="flex-1" />

        {/* User */}
        <div className="flex items-center gap-3 p-2 border-t border-[#1e2130]">
          <div className="h-8 w-8 rounded-full bg-[#1e2130] animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="h-3 w-20 rounded bg-[#1e2130] animate-pulse" />
            <div className="h-2 w-28 rounded bg-[#1e2130] animate-pulse" />
          </div>
        </div>
      </aside>

      {/* ── Main Content Skeleton ── */}
      <div className="flex-1 flex flex-col items-center px-6 py-8 gap-6 overflow-y-auto">

        {/* Topbar */}
        <div className="w-full max-w-5xl flex justify-end">
          <div className="h-9 w-9 rounded-lg bg-[#1e2130] animate-pulse" />
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-80 rounded-lg bg-[#1e2130] animate-pulse" />
          <div className="h-4 w-52 rounded bg-[#1e2130] animate-pulse" />
        </div>

        {/* Card */}
        <div className="w-full max-w-5xl bg-[#13161d] border border-[#1e2130] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left: Job Description */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-44 rounded bg-[#1e2130] animate-pulse" />
              <div className="h-5 w-16 rounded-full bg-[#1e2130] animate-pulse" />
            </div>
            <div className="h-80 w-full rounded-xl bg-[#1e2130] animate-pulse" />
            <div className="h-3 w-20 rounded bg-[#1e2130] animate-pulse self-end" />
          </div>

          {/* Right: Profile */}
          <div className="flex flex-col gap-4">
            <div className="h-4 w-24 rounded bg-[#1e2130] animate-pulse" />

            {/* Upload label */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-28 rounded bg-[#1e2130] animate-pulse" />
              <div className="h-5 w-24 rounded-full bg-[#1e2130] animate-pulse" />
            </div>

            {/* Upload box */}
            <div className="border-2 border-dashed border-[#1e2130] rounded-xl p-6 flex flex-col items-center justify-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#1e2130] animate-pulse" />
              <div className="h-3 w-40 rounded bg-[#1e2130] animate-pulse" />
              <div className="h-2 w-24 rounded bg-[#1e2130] animate-pulse" />
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1e2130]" />
              <div className="h-3 w-5 rounded bg-[#1e2130] animate-pulse" />
              <div className="flex-1 h-px bg-[#1e2130]" />
            </div>

            {/* Self description */}
            <div className="h-3 w-36 rounded bg-[#1e2130] animate-pulse" />
            <div className="h-24 w-full rounded-xl bg-[#1e2130] animate-pulse" />
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-5xl flex items-center justify-between px-1">
          <div className="h-3 w-56 rounded bg-[#1e2130] animate-pulse" />
          <div className="h-11 w-52 rounded-xl bg-[#1e2130] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ResumeHomeSkeleton;