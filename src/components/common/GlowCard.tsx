import { motion, type HTMLMotionProps } from "framer-motion";
import { hoverLift, hoverLiftSubtle, scaleTap } from "@/lib/animations";
import { cn } from "@/lib/cn";

export type GlowCardVariant = "nav" | "process" | "insight" | "panel";

const variantClass: Record<GlowCardVariant, string> = {
  nav: cn(
    "rounded-[1.25rem] border border-slate-200/80 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]",
    "hover:border-blue-200/90 hover:shadow-[0_20px_48px_-16px_rgba(37,99,235,0.18)]",
    "focus-visible:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25",
  ),
  process: cn(
    "rounded-[1.25rem] border border-slate-200/70 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)]",
    "hover:border-indigo-300/80 hover:shadow-[0_20px_48px_-20px_rgba(79,70,229,0.2)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25",
  ),
  insight: cn(
    "rounded-2xl border border-slate-200/60 bg-linear-to-b from-white to-slate-50/95 shadow-[0_8px_32px_-16px_rgba(15,23,42,0.1)]",
    "hover:border-violet-200/80 hover:shadow-[0_22px_50px_-18px_rgba(124,58,237,0.14)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25",
  ),
  panel: cn(
    "rounded-2xl border border-slate-200/50 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_40px_-24px_rgba(15,23,42,0.12)]",
    "hover:border-slate-300/80 hover:shadow-[0_1px_0_rgba(15,23,42,0.05),0_20px_50px_-20px_rgba(15,23,42,0.14)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/25",
  ),
};

export type GlowCardProps = HTMLMotionProps<"div"> & {
  variant?: GlowCardVariant;
};

/**
 * Contenedor animado con microinteracción distinta por tipo de tarjeta.
 */
export function GlowCard({ variant = "panel", className, whileHover, whileTap, ...props }: GlowCardProps) {
  const hoverMotion =
    variant === "process"
      ? { x: 5, y: -3, transition: { type: "spring" as const, stiffness: 380, damping: 28 } }
      : variant === "nav"
        ? { ...hoverLift, boxShadow: "0 22px 50px -18px rgba(37, 99, 235, 0.22)" }
        : variant === "insight"
          ? {
              ...hoverLiftSubtle,
              boxShadow: "0 24px 56px -20px rgba(124, 58, 237, 0.16)",
            }
          : hoverLiftSubtle;

  return (
    <motion.div
      className={cn(variantClass[variant], "transition-colors duration-300", className)}
      whileHover={whileHover ?? hoverMotion}
      whileTap={whileTap ?? scaleTap}
      {...props}
    />
  );
}
