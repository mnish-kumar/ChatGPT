import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextType from "@/components/TextType";
import { MenuIcon, Zap, ArrowRight, MessageCircle, BriefcaseBusiness, Crown, Sparkles, Star } from "lucide-react/dist/cjs/lucide-react";
import { useEffect, useRef, useState } from "react";
import Dropdown from "./user/Dropdown";
import { setAccessToken } from "@/store/reducers/userSlice";
import { checkAuth } from "@/store/userAction";
import { DashboardSkeleton } from "@/components/skeletons";
import api from "@/api/axios";

// ── Premium Footer Banner ─────────────────────────────────────────────────────
function PremiumBanner({ plan, onUpgrade }) {
  const isPremium = plan?.type === "PREMIUM";

  if (isPremium) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 px-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#ff3e7f]/25 bg-gradient-to-r from-[#ff3e7f]/10 via-[#1a0a0f] to-[#ff3e7f]/5 px-6 py-4 flex items-center justify-between gap-4">
          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_#ff3e7f15_0%,_transparent_60%)] pointer-events-none" />
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ff3e7f]/20 border border-[#ff3e7f]/30">
              <Crown size={16} className="text-[#ff3e7f]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Premium Active</p>
              <p className="text-xs text-gray-500 truncate">Unlimited analyses · Priority AI · All features unlocked</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Star size={12} className="text-[#ff3e7f] fill-[#ff3e7f]" />
            <Star size={12} className="text-[#ff3e7f] fill-[#ff3e7f]" />
            <Star size={12} className="text-[#ff3e7f] fill-[#ff3e7f]" />
            <span className="text-xs text-[#ff3e7f] font-bold ml-1">PREMIUM</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#1e2130] bg-[#0d0f14] px-5 py-4">
        {/* Subtle animated gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_#ff3e7f08_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Features list */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#ff3e7f] shrink-0" />
              <span className="text-xs text-gray-400 font-medium">Upgrade to Premium</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                "Unlimited Analyses",
                "AI Job Matching",
                "Priority Support",
                "Mock Interviews",
              ].map((f) => (
                <span key={f} className="flex items-center gap-1 text-[10px] text-gray-600">
                  <span className="text-[#ff3e7f]">✦</span> {f}
                </span>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <button
            onClick={onUpgrade}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff3e7f] hover:bg-[#ff1a6a] text-white text-xs font-semibold transition-all shadow-lg shadow-[#ff3e7f]/20 hover:shadow-[#ff3e7f]/40 active:scale-95 cursor-pointer"
          >
            <Zap size={12} className="fill-white" />
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tool Card ─────────────────────────────────────────────────────────────────
function ToolCard({ tag, tagColor, title, description, cta, onClick, accentColor, icon: Icon, children }) {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col cursor-pointer rounded-2xl border border-[#1e2130] bg-[#0d0f14] overflow-hidden transition-all duration-300 hover:border-[#ff3e7f]/30 hover:shadow-xl hover:shadow-black/40 active:scale-[0.99]"
      style={{ minHeight: 320 }}
    >
      {/* Top glow on hover */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#ff3e7f08_0%,_transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Card inner */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Tag */}
        <div>
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border"
            style={{
              color: tagColor,
              borderColor: `${tagColor}30`,
              background: `${tagColor}10`,
            }}
          >
            {Icon && <Icon size={10} />}
            {tag}
          </span>
        </div>

        {/* Title */}
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>

        {/* Extra slot (for premium button etc.) */}
        {children}

        {/* CTA Button */}
        <button
          className="mt-auto flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border font-semibold text-sm transition-all group-hover:shadow-lg active:scale-95"
          style={{
            borderColor: `${accentColor}40`,
            color: accentColor,
            background: `${accentColor}10`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${accentColor}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${accentColor}10`;
          }}
        >
          {cta} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((s) => s.user);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const sessionId = params.get("sessionId");

    const init = async () => {
      if (token) {
        dispatch(setAccessToken(token));
        window.history.replaceState({}, "", "/dashboard");

        if (refreshToken && sessionId) {
          try {
            await api.post("/api/auth/google/exchange", {
              refreshToken,
              sessionId,
            });
          } catch (e) {
            console.error("Exchange failed", e);
          }
        }
      }
      dispatch(checkAuth());
    };

    init();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const firstname = user?.fullname?.firstname || "there";
  const initials =
    (user?.fullname?.firstname?.[0] ?? "") +
    (user?.fullname?.lastname?.[0] ?? "");
  const isPremium = user?.plan?.type === "PREMIUM";

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-sans flex flex-col">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 border-b border-[#1e2130] bg-[#0d0f14]/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Left: Hamburger + Brand */}
          <div className="flex items-center gap-3">
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#1e2130] bg-[#13161d] transition hover:border-[#ff3e7f]/40 hover:bg-[#1e2130]"
              >
                <MenuIcon size={16} className="text-gray-400" />
              </button>
              {menuOpen && (
                <div className="absolute top-11 left-0 z-50">
                  <Dropdown onClose={() => setMenuOpen(false)} />
                </div>
              )}
            </div>
            <span className="text-sm font-bold text-white tracking-tight">JarviSync</span>
          </div>

          {/* Right: Plan badge + Avatar */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#1e2130] text-gray-400">
              {isPremium ? (
                <>
                  <Crown size={11} className="text-[#ff3e7f]" /> Premium
                </>
              ) : (
                "Free plan"
              )}
            </span>
            <div
              className="w-8 h-8 rounded-full bg-[#89A8B2] flex items-center justify-center text-xs font-bold text-[#0f1219] cursor-pointer hover:ring-2 hover:ring-[#ff3e7f]/40 transition-all"
              onClick={() => navigate("/profile")}
              title="Profile"
            >
              {initials.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Text ── */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-6 text-center">
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-2 font-medium">
          Your AI Workspace
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">
          What's Your Today Plan's,{" "}
          <span className="text-[#ff3e7f]">{firstname}</span>?
        </h1>
        <p className="text-sm text-gray-600">Pick a tool and let's get to work</p>
      </div>

      {/* ── Cards Grid ── */}
      <div className="w-full max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-12">

        {/* Card 1: ChitChat */}
        <ToolCard
          tag="AI Chat"
          tagColor="#ff3e7f"
          icon={MessageCircle}
          title="Chit Chat"
          description="Real-time conversation with memory. Ask anything, anytime."
          cta="Start chatting"
          accentColor="#ff3e7f"
          onClick={() => navigate("/chat")}
        />

        {/* Card 2: Career Tools */}
        <ToolCard
          tag="Career Tools"
          tagColor="#f59e0b"
          icon={BriefcaseBusiness}
          title={
            <TextType
              text={[
                "Get Hired Fast",
                "AI Resume Intel",
                "Crack Dream Job",
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
            />
          }
          description="AI Powered resume analysis, job matching, and Interview Preparation plan."
          cta={isPremium ? "Now Analyse" : "Upgrade to Premium"}
          accentColor="#f59e0b"
          onClick={() => navigate(isPremium ? "/resume-analyzer" : "/subscription")}
        >
          {!isPremium && (
            <div className="flex items-center gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl px-3 py-2.5">
              <Zap size={12} className="text-[#f59e0b] shrink-0 fill-[#f59e0b]" />
              <p className="text-xs text-[#f59e0b]/80 leading-snug">
                Upgrade for unlimited access
              </p>
            </div>
          )}
          {isPremium && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
              <Crown size={12} className="text-green-400 shrink-0" />
              <p className="text-xs text-green-400 leading-snug">
                Unlimited access active 🚀
              </p>
            </div>
          )}
        </ToolCard>
      </div>

      {/* ── Premium Footer Banner ── */}
      <PremiumBanner
        plan={user?.plan}
        onUpgrade={() => navigate("/subscription")}
      />

      {/* ── Footer ── */}
      <footer className="mt-auto pt-10 pb-6 px-4 text-center">
        <p className="text-[10px] text-gray-700">
          © {new Date().getFullYear()} JarviSync · Built with AI
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;