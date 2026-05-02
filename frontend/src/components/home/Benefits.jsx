import { motion } from "framer-motion";
import {
  Brain,
  Gauge,
  Lock,
  Target,
  Zap,
  Sparkles,
} from "lucide-react";
import MotionSection, { stagger } from "./MotionSection";

const card = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Benefits() {
  const benefits = [
    {
      title: "Clarity in minutes",
      body: "Turn vague goals into a concrete plan for roles, skills, and prep.",
      icon: Target,
    },
    {
      title: "Faster iteration",
      body: "Refine resume bullets and interview answers with rapid feedback loops.",
      icon: Zap,
    },
    {
      title: "Smarter practice",
      body: "Practice questions that match your target role and level.",
      icon: Brain,
    },
    {
      title: "Clean, premium UX",
      body: "Glass UI, subtle motion, and hierarchy that stays out of your way.",
      icon: Sparkles,
    },
    {
      title: "Performance-first",
      body: "Lightweight, responsive layout built for everyday use.",
      icon: Gauge,
    },
    {
      title: "Private by default",
      body: "Your progress stays yours — designed for focus and trust.",
      icon: Lock,
    },
  ];

  return (
    <MotionSection className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-slate-900">Benefits that compound</h2>
        <p className="mt-3 text-base text-slate-700">
          Built to feel effortless — and make you measurably better.
        </p>
      </div>

      <motion.div
        variants={stagger(0.12, 0.06)}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              variants={card}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group rounded-3xl border border-white/60 bg-white/35 p-6 shadow-xl shadow-black/5 backdrop-blur-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/35 shadow-sm backdrop-blur-xl">
                  <Icon className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{b.body}</p>
                </div>
              </div>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <div className="mt-4 text-xs font-semibold text-slate-700">
                Hover for lift
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </MotionSection>
  );
}
