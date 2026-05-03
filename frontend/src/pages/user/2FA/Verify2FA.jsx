import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { verify2FALogin } from "@/store/userAction";
import {
  cancelTwoFactor,
  clearError,
} from "@/store/reducers/userSlice";

const Verify2FA = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated, tempToken, twoFactorRequired } =
    useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleCancel = () => {
    dispatch(clearError());
    dispatch(cancelTwoFactor());
    onCancel?.();
  };

  const onSubmit = (data) => {
    dispatch(verify2FALogin({
      tempToken,
      otp: data.otp,
    }));
  };

  if (!twoFactorRequired) return null;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-4 text-left text-sm text-muted-foreground shadow-sm md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Two Factor Authentication
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          aria-label="Close"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted"
        >
          ×
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Enter OTP</label>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            autoFocus
            inputMode="numeric"
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
              pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" },
            })}
            className={`mt-1 w-full rounded-full border bg-background px-4 py-2.5 text-center text-lg tracking-widest text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
              errors.otp ? "border-destructive" : "border-input"
            }`}
          />
          {errors.otp && (
            <p className="mt-1 text-xs text-destructive">{errors.otp.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default Verify2FA;