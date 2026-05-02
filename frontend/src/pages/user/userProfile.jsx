import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logoutUser } from "../../store/userAction";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/api/auth.api";
import BorderGlow from "@/components/BorderGlow";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.user);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch Profile ────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setProfileData(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ─── Logout Handler ───────────────────────────────────
  const handleLogout = async () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // ─── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chart-1 font-sans text-foreground">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chart-1 font-sans text-foreground">
        <div className="text-center">
          <p className="mb-4 text-sm text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer text-sm text-primary underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const profile = profileData || user;

  return (
    <div className="min-h-screen bg-background px-4 py-10 font-sans text-foreground">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* ── Profile Card ── */}
        <BorderGlow
          edgeSensitivity={30}
          glowColor="40 80 80"
          backgroundColor="hsl(var(--card))"
          borderRadius={16}
          glowRadius={40}
          glowIntensity={1.5}
          coneSpread={25}
          animated={false}
          colors={["#c084fc", "#f472b6", "#38bdf8"]}
        >
          <div className="p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {profile?.fullname?.firstname?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {profile?.fullname?.firstname} {profile?.fullname?.lastname}
              </h1>
              <p className="text-sm text-muted-foreground">
                @{profile?.username}
              </p>
            </div>

            {/* Email Verified Badge */}
            <div className="ml-auto">
              {profile?.isEmailVerified ? (
                <span className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs text-destructive">
                  ⚠️ Not Verified
                </span>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <span className="w-24 text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">
                {profile?.email}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <span className="w-24 text-sm text-muted-foreground">
                Username
              </span>
              <span className="text-sm font-medium text-foreground">
                @{profile?.username}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <span className="w-24 text-sm text-muted-foreground">Role</span>
              <span className="text-sm font-medium capitalize text-foreground">
                {profile?.role || "user"}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <span className="w-24 text-sm text-muted-foreground">Joined</span>
              <span className="text-sm font-medium text-foreground">
                {profile?.createdAt &&
                !Number.isNaN(new Date(profile.createdAt).getTime())
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <span className="w-24 text-sm text-muted-foreground">
                Login via
              </span>
              <span className="text-sm font-medium text-foreground">
                {profile?.googleId ? "🌐 Google" : "📧 Email"}
              </span>
            </div>
          </div>
        </div>
        </BorderGlow>

        {/* ── Plan Card ── */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Current Plan
          </h2>

          {profile?.plan?.length > 0 ? (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-4">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {profile.plan[0].type}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Started:{" "}
                  {new Date(profile.plan[0].startDate).toLocaleDateString()}
                </p>
                {profile.plan[0].expiry && (
                  <p className="text-xs text-muted-foreground">
                    Expires:{" "}
                    {new Date(profile.plan[0].expiry).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  profile.plan[0].type === "PREMIUM"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground border border-border"
                }`}
              >
                {profile.plan[0].type === "PREMIUM" ? "⭐ Premium" : "Free"}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active plan</p>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Account Actions
          </h2>

          {/* Change Password */}
          <button
            onClick={() => navigate("/change-password")}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition hover:bg-muted"
          >
            <span className="text-sm font-medium text-foreground">
              🔑 Change Password
            </span>
            <span className="text-muted-foreground">→</span>
          </button>

          {/* 2FA Settings */}
          <button
            onClick={() => navigate("/settings/2fa")}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition hover:bg-muted"
          >
            <span className="text-sm font-medium text-foreground">
              🔒 Two Factor Authentication
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                profile?.twoFactorAuth?.enabled
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {profile?.twoFactorAuth?.enabled ? "Enabled" : "Disabled"}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-destructive/20 bg-background px-4 py-3 transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-sm font-medium text-destructive">
              🚪 Logout
            </span>
            <span className="text-destructive/70">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
