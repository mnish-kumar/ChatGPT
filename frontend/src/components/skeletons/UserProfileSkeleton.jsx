import React from "react";

const UserProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-10 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <style>{`
          @keyframes shimmer {
            0% { background-position: -600px 0; }
            100% { background-position: 600px 0; }
          }
          .sk {
            background: linear-gradient(90deg, #e2e2e2 25%, #efefef 50%, #e2e2e2 75%);
            background-size: 1200px 100%;
            animation: shimmer 1.6s infinite linear;
          }
          .dark .sk {
            background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
            background-size: 1200px 100%;
          }
        `}</style>

        {/* ── Profile Card ── */}
        <div className="rounded-xl border border-border bg-card p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="sk h-16 w-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="sk h-5 w-40 rounded-md" />
              <div className="sk h-4 w-24 rounded-md" />
            </div>
            {/* Verified badge */}
            <div className="sk ml-auto h-6 w-20 rounded-full" />
          </div>

          {/* Info rows */}
          <div className="grid grid-cols-1 gap-4">
            {["Email", "Username", "Role", "Joined", "Login via"].map(
              (_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-muted p-3"
                >
                  <div className="sk h-4 w-20 rounded-md flex-shrink-0" />
                  <div className="sk h-4 w-40 rounded-md" />
                </div>
              ),
            )}
          </div>
        </div>

        {/* ── Plan Card ── */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="sk mb-4 h-6 w-32 rounded-md" />
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-4">
            <div className="space-y-2">
              <div className="sk h-5 w-24 rounded-md" />
              <div className="sk h-3 w-36 rounded-md" />
              <div className="sk h-3 w-28 rounded-md" />
            </div>
            <div className="sk h-7 w-16 rounded-full" />
          </div>
        </div>

        {/* ── Actions Card ── */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="sk mb-4 h-6 w-36 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
              >
                <div className="sk h-4 w-40 rounded-md" />
                <div className="sk h-4 w-4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
