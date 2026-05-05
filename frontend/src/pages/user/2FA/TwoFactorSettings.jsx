import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setup2FA, enable2FA, disable2FA, getMe } from "../../../api/auth.api";
import { useForm } from "react-hook-form";

const TwoFactorSettings = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [step, setStep] = useState("idle");
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(
    user?.twoFactorAuth?.enabled || false,
  );

  useEffect(() => {
    let isMounted = true;

    const sync2FAStatus = async () => {
      try {
        const me = await getMe();
        if (!isMounted) return;
        setIs2FAEnabled(!!me?.twoFactorAuth?.enabled);
      } catch {}
    };

    // If redux user isn't ready (e.g. hard refresh), fetch server truth.
    if (!user) {
      sync2FAStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  // const { isLoading } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ─── Setup 2FA ────────────────────────────────────────
  const handleSetup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await setup2FA();
      setQrCode(data.qrCodeUrl);
      setSecret(data.secret);
      setStep("enable");
    } catch (err) {
      setError(err.message || "Failed to setup 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Enable 2FA ───────────────────────────────────────
  const onEnable = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await enable2FA({ otp: data.otp });
      setBackupCodes(response.backupCodes);
      setIs2FAEnabled(true);
      setStep("backup");
      reset();
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Disable 2FA ──────────────────────────────────────
  const onDisable = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await disable2FA({ otp: data.otp });
      setIs2FAEnabled(false);
      setStep("idle");
      setSuccess("2FA disabled successfully");
      reset();
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Idle Screen ──────────────────────────────────────
  const IdleScreen = () => (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <p className="font-medium text-gray-800">Two Factor Authentication</p>
          <p className="text-sm text-gray-500 mt-1">
            {is2FAEnabled
              ? "Your account is protected with 2FA"
              : "Add extra security to your account"}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            is2FAEnabled
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {is2FAEnabled ? "✅ Enabled" : "❌ Disabled"}
        </span>
      </div>

      {/* Action Button */}
      {is2FAEnabled ? (
        <button
          onClick={() => {
            setStep("disable");
            setError(null);
          }}
          className="w-full cursor-pointer border border-red-300 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
        >
          Disable 2FA
        </button>
      ) : (
        <button
          onClick={handleSetup}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isLoading ? "Setting up..." : "Enable 2FA"}
        </button>
      )}
    </div>
  );

  // ─── QR Code + Enable Screen ──────────────────────────
  const EnableScreen = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-bold text-gray-800 mb-2">Scan QR Code</h3>
        <p className="text-sm text-gray-500 mb-4">
          Open <strong>Google Authenticator</strong> or <strong>Authy</strong>{" "}
          and scan this QR code
        </p>

        {/* QR Code */}
        {qrCode && (
          <img
            src={qrCode}
            alt="QR Code"
            className="w-48 h-48 mx-auto border-2 border-gray-200 rounded-lg p-2"
          />
        )}

        {/* Manual Entry */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">
            Can't scan? Enter manually:
          </p>
          <p className="text-xs font-mono text-gray-700 break-all">{secret}</p>
        </div>
      </div>

      {/* OTP Input */}
      <form onSubmit={handleSubmit(onEnable)} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Enter 6-digit OTP from app
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
              pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" },
            })}
            className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
          {isLoading ? "Verifying..." : "Verify & Enable 2FA"}
        </button>

        <button
          type="button"
          onClick={() => setStep("idle")}
          className="w-full text-gray-500 text-sm hover:underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );

  // ─── Backup Codes Screen ──────────────────────────────
  const BackupCodesScreen = () => (
    <div className="space-y-4">
      {/* Success */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-600 font-bold text-lg">
          🎉 2FA Enabled Successfully!
        </p>
        <p className="text-green-600 text-sm mt-1">
          Save these backup codes in a safe place
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-yellow-700 text-xs">
          ⚠️ These codes will only be shown <strong>once</strong>. If you lose
          your authenticator app, use these to login.
        </p>
      </div>

      {/* Backup Codes Grid */}
      <div className="grid grid-cols-2 gap-2">
        {backupCodes.map((code, index) => (
          <div
            key={index}
            className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg text-center text-gray-800 border border-gray-200"
          >
            {code}
          </div>
        ))}
      </div>

      {/* Copy Button */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(backupCodes.join("\n"));
          setSuccess("Backup codes copied!");
        }}
        className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
      >
        📋 Copy All Codes
      </button>

      {/* Done Button */}
      <button
        onClick={() => setStep("idle")}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
      >
        Done
      </button>
    </div>
  );

  // ─── Disable Screen ───────────────────────────────────
  const DisableScreen = () => (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-medium">Disable 2FA?</p>
        <p className="text-red-600 text-sm mt-1">
          Your account will be less secure without 2FA.
        </p>
      </div>

      <form onSubmit={handleSubmit(onDisable)} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Enter OTP to confirm
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
              pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" },
            })}
            className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500 ${
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
          className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
        >
          {isLoading ? "Disabling..." : "Confirm Disable 2FA"}
        </button>

        <button
          type="button"
          onClick={() => {
            setStep("idle");
            setError(null);
            reset();
          }}
          className="w-full text-gray-500 text-sm hover:underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );

  if (isLoading) {
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
  }

  // ─── Main Render ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-indigo-600 hover:underline text-sm"
          >
            ← Back to Profile
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">
            🔒 Two Factor Authentication
          </h1>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4 border border-green-200">
              {success}
            </div>
          )}

          {/* Steps */}
          {step === "idle" && <IdleScreen />}
          {step === "enable" && <EnableScreen />}
          {step === "backup" && <BackupCodesScreen />}
          {step === "disable" && <DisableScreen />}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSettings;
