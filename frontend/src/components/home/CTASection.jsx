import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MotionSection from "./MotionSection";

export default function CTASection() {
  return (
    <MotionSection className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-[#89A8B2]/65 via-white/35 to-[#B3C8CF]/65 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-10">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#E5E1DA]/70 blur-3xl" />

        <div className="relative">
          <h2 className="text-balance text-3xl font-semibold text-slate-900 sm:text-4xl">
            Ready to move faster than the job market?
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-800/80">
            Start chatting for free. Upgrade when you want deep resume insights and targeted prep.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-slate-900/90 sm:w-auto"
              >
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/70 bg-white/35 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/5 backdrop-blur-xl transition-colors hover:bg-white/50 sm:w-auto"
              >
                Sign in
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
