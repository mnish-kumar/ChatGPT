import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const easeOut = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const stagger = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

export default function MotionSection({
  children,
  className,
  id,
  ...props
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}
