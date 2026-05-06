import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { logoutUser } from "../../store/userAction";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/api/auth.api";
import BorderGlow from "@/components/BorderGlow";
import { MenuIcon } from "lucide-react/dist/cjs/lucide-react";
import Dropdown from "./Dropdown";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.user);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch Profile ────────────────────────────────────
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMe();
      setProfileData(data);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ─── Logout Handler ───────────────────────────────────
  const handleLogout = async () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Loading ──────────────────────────────────────────
  if (loading) {
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
  const plan = profile?.plan;

  return (
    <div className="min-h-screen bg-background px-4 py-10 font-sans text-foreground">
      <div ref={menuRef} className="absolute top-6 left-6">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-card transition hover:bg-muted"
          >
            <MenuIcon className="text-black" size={18} />
          </button>
          {menuOpen && <Dropdown onClose={() => setMenuOpen(false)} />}
        </div>
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
                <span className="w-24 text-sm text-muted-foreground">
                  Email
                </span>
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
                <span className="w-24 text-sm text-muted-foreground">
                  Joined
                </span>
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

          {plan?.type ? (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-4">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {plan.type}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Started:{" "}
                  {plan?.startDate &&
                  !Number.isNaN(new Date(plan.startDate).getTime())
                    ? new Date(plan.startDate).toLocaleDateString()
                    : "-"}
                </p>
                {plan?.expiry && (
                  <p className="text-xs text-muted-foreground">
                    Expires:{" "}
                    {!Number.isNaN(new Date(plan.expiry).getTime())
                      ? new Date(plan.expiry).toLocaleDateString()
                      : "-"}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  plan.type === "PREMIUM"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground border border-border"
                }`}
              >
                {plan.type === "PREMIUM" ? "⭐ Premium" : "Free"}
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
            className="w-full cursor-pointer flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <span className="text-sm text-gray-700 font-medium">
              🔒 Two Factor Authentication
            </span>
            {/* profileData se live status */}
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                profileData?.twoFactorAuth?.enabled
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {profileData?.twoFactorAuth?.enabled
                ? "✅ Enabled"
                : "❌ Disabled"}
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
