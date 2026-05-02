import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradients + blurred shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B3C8CF]/55 via-[#F1F0E8] to-[#89A8B2]/35" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#89A8B2]/45 blur-3xl" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-[#B3C8CF]/55 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#E5E1DA]/70 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: easeOut }}
          className="mx-auto max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/35 px-3 py-1 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-slate-700" />
            Premium AI workspace for job seekers
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            AI That Helps You Get Hired Faster
          </h1>

          <p className="mt-5 text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
            Chat with AI, analyze your resume, and prepare for your dream job — all in one place.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#89A8B2] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/5 transition-colors hover:bg-[#89A8B2]/90 sm:w-auto"
              >
                Start Chatting
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">Free</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/40 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/5 backdrop-blur-xl transition-colors hover:bg-white/55 sm:w-auto"
              >
                Analyze Resume
                <span className="ml-1 rounded-full bg-[#E5E1DA]/70 px-2 py-0.5 text-[10px] font-semibold text-slate-800">
                  Premium
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { k: "Instant insights", v: "resume + interviews" },
              { k: "Private", v: "secure sessions" },
              { k: "Fast", v: "minimal friction" },
            ].map((item) => (
              <div
                key={item.k}
                className="rounded-2xl border border-white/50 bg-white/30 px-4 py-3 text-left shadow-sm backdrop-blur-xl"
              >
                <div className="text-sm font-semibold text-slate-900">{item.k}</div>
                <div className="mt-1 text-xs text-slate-700">{item.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
