import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { resetPassword, verifyResetToken } from "@/api/auth.api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Retrive token or id from URL
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      try {
        if (!token || !id) {
          throw new Error("Reset link is missing required parameters.");
        }

        await verifyResetToken({ token, id });

        if (!isMounted) return;
        setIsTokenValid(true);
      } catch (err) {
        if (!isMounted) return;
        setIsTokenValid(false);
        setError(err?.message || "This link is invalid or has expired.");
      } finally {
        if (!isMounted) return;
        setIsVerifying(false);
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, id]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword({
        token,
        id,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Verifying Screen ─────────────────────────────────
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // ─── Invalid Token Screen ─────────────────────────────
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {error || "This link is invalid or has expired."}
          </p>

          <Link
            to="/forget-password"
            className="w-full inline-block bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition text-center"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  // ─── Success Screen ───────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Password Reset!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Your password has been reset successfully. You can now login with
            your new password.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your new password below.
          </p>
        </div>

        {/* API Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Min 6 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message:
                    "Must have uppercase, lowercase, number, special character",
                },
              })}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.newPassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.confirmPassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
