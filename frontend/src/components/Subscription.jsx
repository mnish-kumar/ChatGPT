import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRazorpay } from "@/hooks/useRazorpay";
import {
  Star,
  MessageCircle,
  FileText,
  Zap,
  Shield,
  BarChart2,
  Users,
  Clock,
  CheckCircle,
  BookOpen,
} from "lucide-react/dist/cjs/lucide-react";

const FREE_FEATURES = [
  { icon: FileText,      text: "3 resume analyses per month" },
  { icon: MessageCircle, text: "Basic interview Q&A (5 questions each)" },
  { icon: BarChart2,     text: "Basic match score" },
  { icon: Clock,         text: "Standard response speed" },
  { icon: Users,         text: "Community support" },
];

const PRO_FEATURES = [
  { icon: FileText,      text: "Unlimited resume analyses" },
  { icon: MessageCircle, text: "Full interview Q&A (10+ questions each)" },
  { icon: BarChart2,     text: "Advanced match score & skill gap analysis" },
  { icon: Zap,           text: "Real-time job suggestions (matching your role)" },
  { icon: BookOpen,      text: "Curated learning resources per skill gap" },
  { icon: Shield,        text: "Resume improvement tips" },
  { icon: Star,          text: "Priority AI model & faster responses" },
  { icon: Clock,         text: "Analysis history (unlimited)" },
  { icon: Users,         text: "Priority support" },
];

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.user);
  const [tab, setTab] = useState("personal");
  const { openCheckout } = useRazorpay();

  const isPro = user?.plan?.type === "PREMIUM";
  const proPrice = tab === "personal" ? "399" : "999";

  return (
    <div className="min-h-screen bg-background px-4 py-7 font-sans text-foreground">

      {/* Close */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#1e2130] bg-card text-muted-foreground transition hover:bg-muted"
      >
        ✕
      </button>

      {/* Title */}
      <h1 className="mb-5 text-center text-2xl font-medium text-foreground">
        {isPro ? "Your plan" : "Upgrade your plan"}
      </h1>

      {/* Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="flex gap-1 rounded-full border border-border bg-muted p-1">
          {["personal", "business"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`cursor-pointer rounded-full px-5 py-1.5 text-sm font-medium capitalize transition ${
                tab === t
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-4">

        {/* FREE */}
        <div className="flex w-80 flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-2 text-lg font-medium text-foreground">Free</p>

          <div className="mb-1 flex items-baseline gap-1">
            <span className="text-sm font-medium text-foreground">₹</span>
            <span className="text-4xl font-semibold text-foreground">0</span>
            <span className="text-xs leading-tight text-muted-foreground">
              INR /<br />month
            </span>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            Get started with basic access
          </p>

          <button
            disabled
            className="mb-4 w-full cursor-not-allowed rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground"
          >
            {isPro ? "Previous plan" : "Your current plan"}
          </button>

          <hr className="mb-4 border-border" />

          <div className="flex flex-col gap-3">
            {FREE_FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-foreground">
                <Icon size={14} className="shrink-0 text-muted-foreground" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* PRO */}
        <div className="flex w-80 flex-col rounded-xl border-2 bg-card p-6 shadow-sm"
          style={{ borderColor: "#534AB7" }}>

          <div className="mb-2 flex items-center gap-2">
            <p className="text-lg font-medium text-foreground">Pro</p>
            <span className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: "#EEEDFE", color: "#3C3489" }}>
              Popular
            </span>
          </div>

          <div className="mb-1 flex items-baseline gap-1">
            <span className="text-sm font-medium text-foreground">₹</span>
            <span className="text-4xl font-semibold text-foreground">{proPrice}</span>
            <span className="text-xs leading-tight text-muted-foreground">
              INR /<br />month
            </span>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            Unlock the full experience
          </p>

          <button
            onClick={() => openCheckout({ plan: tab })}
            disabled={isPro}
            className="mb-4 w-full cursor-pointer rounded-lg py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "#534AB7" }}
          >
            {isPro ? (
              <span className="flex items-center justify-center gap-1.5">
                <CheckCircle size={14} /> Current Plan
              </span>
            ) : (
              "Upgrade to Pro"
            )}
          </button>

          <hr className="mb-4 border-border" />

          <div className="flex flex-col gap-3">
            {PRO_FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-foreground">
                <Icon size={14} className="shrink-0" style={{ color: "#534AB7" }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Need more capabilities for your team?{" "}
        <a href="mailto:support@example.com"
          className="hover:underline" style={{ color: "#534AB7" }}>
          Contact us for Enterprise
        </a>
      </p>
    </div>
  );
};

export default Subscription;