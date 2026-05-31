import React from "react";

const TwoFactorSettingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
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

        {/* Back button */}
        <div className="flex items-center gap-3 mb-6">
          <div className="sk h-4 w-28 rounded-md" />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Title */}
          <div className="sk mb-6 h-6 w-52 rounded-md" />

          {/* Status row */}
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 mb-4">
            <div className="space-y-2">
              <div className="sk h-4 w-32 rounded-md" />
              <div className="sk h-3 w-24 rounded-md" />
            </div>
            <div className="sk h-6 w-16 rounded-full" />
          </div>

          {/* Description lines */}
          <div className="space-y-2 mb-6">
            <div className="sk h-3 w-full rounded-md" />
            <div className="sk h-3 w-4/5 rounded-md" />
          </div>

          {/* Action button */}
          <div className="sk h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSettingSkeleton;
