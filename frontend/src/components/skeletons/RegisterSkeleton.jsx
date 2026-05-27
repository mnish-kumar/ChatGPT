export default function RegisterSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chart-1 px-4">
      <div className="relative mx-4 w-full max-w-97 overflow-hidden rounded-xl bg-white p-6 shadow-[0px_0px_10px_0px] shadow-black/10 md:p-8">
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
        `}</style>

        {/* Title */}
        <div className="sk mx-auto mb-8 h-8 w-36 rounded-md" />

        {/* Firstname + Lastname side by side */}
        <div className="flex gap-1 my-4">
          <div className="sk h-11 w-1/2 rounded-full" />
          <div className="sk h-11 w-1/2 rounded-full" />
        </div>

        {/* Username */}
        <div className="sk my-4 h-11 w-full rounded-full" />

        {/* Email */}
        <div className="sk my-4 h-11 w-full rounded-full" />

        {/* Password */}
        <div className="sk mt-2 h-11 w-full rounded-full" />

        {/* Create Account button */}
        <div className="sk mt-6 mb-2.5 h-10 w-full rounded-lg" />

        {/* OR divider */}
        <div className="flex items-center gap-2 my-2">
          <div className="sk h-px flex-1" />
          <div className="sk h-3 w-5 rounded-md" />
          <div className="sk h-px flex-1" />
        </div>

        {/* Google button */}
        <div className="sk mt-2 h-10 w-full rounded-lg" />

        {/* Login link */}
        <div className="sk mx-auto mt-4 h-3 w-44 rounded-md" />
      </div>
    </div>
  );
}
