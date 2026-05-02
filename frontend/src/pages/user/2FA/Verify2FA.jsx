import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { verify2FALogin } from "../store/userAction";
import { clearError } from "../store/reducers/userSlice";

const Verify2FA = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, tempToken, twoFactorRequired } =
    useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm();


  useEffect(() => {
    if (!twoFactorRequired && !isAuthenticated) {
      navigate("/login");
    }
  }, [twoFactorRequired]);

  // Verified
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(verify2FALogin({
      tempToken,
      otp: data.otp,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Two Factor Authentication
          </h1>
          <p className="text-gray-500 text-sm">
            Open your authenticator app and enter the 6-digit code
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              autoFocus
              {...register("otp", {
                required: "OTP is required",
                minLength: { value: 6, message: "OTP must be 6 digits" },
                maxLength: { value: 6, message: "OTP must be 6 digits" },
                pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" },
              })}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.otp ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-gray-500 text-sm hover:underline"
          >
            ← Back to Login
          </button>
        </form>

        {/* Expires info */}
        <p className="text-center text-xs text-gray-400 mt-4">
          ⏱ OTP session expires in 5 minutes
        </p>
      </div>
    </div>
  );
};

export default Verify2FA;