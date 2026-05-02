import { Link } from "react-router-dom";
import { Globe, Mail, MessageCircle } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Benefits", href: "#benefits" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Start chatting", href: "#get-started" },
      { label: "Analyze resume", href: "#get-started" },
      { label: "Sign in", to: "/login" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Create account", to: "/register" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Back to top", href: "#top" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/55 bg-white/20 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <a href="#top" className="inline-flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-900">JarviSync</span>
              <span className="rounded-full border border-white/60 bg-white/30 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur-xl">
                Premium
              </span>
            </a>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-700">
              A modern AI workspace to chat, sharpen your resume, and prepare for interviews with confidence.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-slate-900/90"
              >
                Start for free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white/30 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-black/5 backdrop-blur-xl transition-colors hover:bg-white/45"
              >
                Sign in
              </Link>

              <div className="flex items-center gap-2 sm:ml-auto">
                {[
                  { Icon: Globe, label: "Website" },
                  { Icon: Mail, label: "Email" },
                  { Icon: MessageCircle, label: "Community" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#top"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/30 text-slate-800 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-0.5"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                  {col.title}
                </div>
                <div className="mt-4 space-y-3">
                  {col.links.map((l) => {
                    const className =
                      "block text-sm text-slate-700 transition-colors hover:text-slate-900";

                    if (l.to) {
                      return (
                        <Link key={l.label} to={l.to} className={className}>
                          {l.label}
                        </Link>
                      );
                    }

                    return (
                      <a key={l.label} href={l.href} className={className}>
                        {l.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-linear-to-r from-transparent via-white/70 to-transparent" />

        <div className="mt-6 flex flex-col gap-2 text-xs text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} JarviSync. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-slate-900">
              Privacy
            </a>
            <a href="#top" className="hover:text-slate-900">
              Terms
            </a>
            <a href="#top" className="hover:text-slate-900">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
