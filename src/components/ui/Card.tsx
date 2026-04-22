import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { hoverLiftSubtle, scaleTap } from "@/lib/animations";
import { cn } from "@/lib/cn";

export function Card({ className, whileHover, whileTap, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      whileHover={whileHover ?? hoverLiftSubtle}
      whileTap={whileTap ?? scaleTap}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={cn(
        "rounded-2xl border border-slate-200/50 bg-white/95 p-5 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_40px_-24px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-[0_1px_0_rgba(15,23,42,0.05),0_20px_50px_-20px_rgba(15,23,42,0.14)]",
        className,
      )}
      {...props}
    />
  );
}
