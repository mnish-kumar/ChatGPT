import { motion } from "framer-motion";
import {
  BadgeCheck,
  Crown,
  FileScan,
  MessageSquareText,
  Sparkles,
  Upload,
} from "lucide-react";
import MotionSection, { fadeUp, stagger } from "./MotionSection";

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FeatureSplit() {
  return (
    <MotionSection id="features" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          variants={fadeUp}
          className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
        >
          Built for momentum — free to start, premium to win
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base"
        >
          Everything you need to practice, iterate, and show up confident.
        </motion.p>
      </div>

      <motion.div
        variants={stagger(0.14, 0.05)}
        className="mt-10 grid gap-6 md:grid-cols-2"
      >
        {/* Free */}
        <motion.div
          variants={item}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="rounded-3xl border border-white/60 bg-white/35 p-6 shadow-xl shadow-black/5 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E5E1DA]/70 px-3 py-1 text-xs font-semibold text-slate-800">
                <BadgeCheck className="h-4 w-4" />
                Free
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
                AI Chat Workspace
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                A focused, ChatGPT-like experience designed for job prep.
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/35 p-3 shadow-sm backdrop-blur-xl">
              <MessageSquareText className="h-5 w-5 text-slate-800" />
            </div>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-700" /> Chat rooms
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-700" /> ChatGPT-like experience
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-700" /> Fast, distraction-free UI
            </li>
          </ul>
        </motion.div>

        {/* Premium */}
        <motion.div variants={item} className="relative">
          <div className="absolute -inset-0.5 rounded-[28px] bg-linear-to-br from-[#89A8B2] via-[#B3C8CF] to-[#E5E1DA] opacity-65 blur" />
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative rounded-3xl border border-white/70 bg-white/30 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#89A8B2]/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <Crown className="h-4 w-4" /> Premium
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
                  AI Resume Analyzer
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Upload your resume and get actionable, role-specific guidance.
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/35 p-3 shadow-sm backdrop-blur-xl">
                <FileScan className="h-5 w-5 text-slate-900" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-slate-700">
              {[
                { label: "Resume upload", icon: Upload },
                { label: "Skill gap analysis", icon: Sparkles },
                { label: "Interview questions", icon: Sparkles },
                { label: "Company suggestions", icon: Sparkles },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/25 px-4 py-3 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-800" />
                    <span>{label}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Included</span>
                </div>
              ))}
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/25 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              Premium features stand out by design
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionSection>
  );
}
