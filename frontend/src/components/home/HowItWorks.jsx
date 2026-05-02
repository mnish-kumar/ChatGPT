import { motion } from "framer-motion";
import { FileUp, MessagesSquare, Wand2 } from "lucide-react";
import MotionSection, { stagger } from "./MotionSection";

const step = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};

export default function HowItWorks() {
  const steps = [
    {
      title: "Start a focused chat",
      body: "Ask questions, practice answers, and refine your story with AI guidance.",
      icon: MessagesSquare,
    },
    {
      title: "Upload your resume",
      body: "Get premium feedback that’s tailored to the roles you want.",
      icon: FileUp,
    },
    {
      title: "Improve with clear next steps",
      body: "Turn insights into action: skills to build, questions to prep, companies to target.",
      icon: Wand2,
    },
  ];

  return (
    <MotionSection id="how-it-works" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
          A simple loop that keeps you moving forward.
        </p>
      </div>

      <motion.div
        variants={stagger(0.14, 0.06)}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              variants={step}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="rounded-3xl border border-white/60 bg-white/35 p-6 shadow-xl shadow-black/5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/35 shadow-sm backdrop-blur-xl">
                  <Icon className="h-5 w-5 text-slate-900" />
                </div>
                <div className="text-[11px] font-semibold tracking-wide text-slate-700">
                  Step {idx + 1}
                </div>
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-900 sm:text-lg">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{s.body}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </MotionSection>
  );
}
