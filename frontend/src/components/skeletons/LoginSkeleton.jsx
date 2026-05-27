export default function LoginSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chart-1 px-4">
      <div className="relative mx-4 w-full max-w-89 overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8">
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

        {/* Title */}
        <div className="sk mx-auto mb-8 h-8 w-20 rounded-md" />

        {/* Username */}
        <div className="sk my-4 h-11 w-full rounded-full" />

        {/* Email */}
        <div className="sk my-4 h-11 w-full rounded-full" />

        {/* Password */}
        <div className="sk mt-2 h-11 w-full rounded-full" />

        {/* Forgot password */}
        <div className="sk ml-auto mt-5 mb-5 h-3 w-28 rounded-md" />

        {/* Login button */}
        <div className="sk h-10 w-full rounded-lg" />

        {/* OR divider */}
        <div className="my-6 flex items-center gap-2">
          <div className="sk h-px flex-1" />
          <div className="sk h-3 w-5 rounded-md" />
          <div className="sk h-px flex-1" />
        </div>

        {/* Google button */}
        <div className="sk h-10 w-full rounded-lg" />

        {/* Register link */}
        <div className="sk mx-auto mt-5 h-3 w-40 rounded-md" />
      </div>
    </div>
  );
}
