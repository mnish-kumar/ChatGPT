import { requestPasswordReset } from "@/api/auth.api";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await requestPasswordReset({ email: data.email });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong !");
    } finally {
      setIsLoading(false);
    }
  };

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
            Check Your Email!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We've sent a password reset link to your email address. Please check
            your inbox and spam folder.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Link expires in <strong>15 minutes</strong>
          </p>

          {/* Back to Login */}
          <Link
            to="/login"
            className="w-full inline-block bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-chart-1">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/login"
            className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mb-4"
          >
            ← Back to Login
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your email address and we'll send you a reset link.
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
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
