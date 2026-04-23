import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { AuthProfile } from "@/lib/authExperience";
import { AUTH_EXPERIENCE_TIMINGS } from "@/lib/authExperience";

type DashboardEntryTransitionProps = {
  active: boolean;
  profile: AuthProfile;
  onComplete: () => void;
};

export function DashboardEntryTransition({ active, profile, onComplete }: DashboardEntryTransitionProps) {
  useEffect(() => {
    if (!active) return undefined;
    const duration =
      profile === "reduced" ? AUTH_EXPERIENCE_TIMINGS.dashboardEntry.reduced : AUTH_EXPERIENCE_TIMINGS.dashboardEntry.full;
    const timer = window.setTimeout(() => onComplete(), duration);
    return () => window.clearTimeout(timer);
  }, [active, onComplete, profile]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: profile === "reduced" ? 0.1 : 0.4 }}
        >
          <motion.div
            className="auth-grid absolute inset-0 bg-[#f8fbff]"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 0.55, 0] }}
            transition={{ duration: profile === "reduced" ? 0.2 : 0.9, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 45% 25% at 50% 56%, rgba(59,130,246,0.35), transparent 70%), radial-gradient(circle at 70% 20%, rgba(167,139,250,0.2), transparent 33%)",
            }}
            initial={{ opacity: 0.4, scale: 1.02 }}
            animate={{ opacity: [0.42, 0.16, 0], scale: [1.02, 1, 0.995] }}
            transition={{ duration: profile === "reduced" ? 0.22 : 0.88, ease: "easeOut" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
