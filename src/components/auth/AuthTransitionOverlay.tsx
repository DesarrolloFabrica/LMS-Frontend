import { AnimatePresence, motion } from "framer-motion";
import type { AuthProgressStep } from "@/lib/authExperience";
import { AUTH_PROGRESS_MESSAGES } from "@/lib/authExperience";

type AuthTransitionOverlayProps = {
  active: boolean;
  step: AuthProgressStep;
  reducedMotion: boolean;
};

export function AuthTransitionOverlay({ active, step, reducedMotion }: AuthTransitionOverlayProps) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.08 : 0.3 }}
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[2rem]"
        >
          <div className="absolute inset-0 bg-white/65 backdrop-blur-[2px]" />
          <div className="auth-grid absolute inset-0 opacity-80" />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.2, 0.42, 0.2] }}
            transition={{ duration: reducedMotion ? 0.25 : 0.9, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(ellipse 50% 28% at 50% 55%, rgba(37,99,235,0.32), transparent 72%), radial-gradient(circle at 20% 30%, rgba(139,92,246,0.2), transparent 30%)",
            }}
          />
          <div className="absolute inset-x-8 bottom-8 top-8 flex flex-col justify-end gap-3">
            <div className="h-[2px] overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-400"
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "45%", "86%", "100%"] }}
                transition={{ duration: reducedMotion ? 0.35 : 1.25, ease: "easeInOut" }}
              />
            </div>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              {AUTH_PROGRESS_MESSAGES[step]}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
