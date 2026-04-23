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

  const veilMs = profile === "reduced" ? AUTH_EXPERIENCE_TIMINGS.dashboardEntry.reduced : AUTH_EXPERIENCE_TIMINGS.dashboardEntry.full;
  const baseEase = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-70"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: profile === "reduced" ? 0.12 : 0.45, ease: baseEase }}
        >
          {/* Misma familia cromática que MainLayout (#f1f5f9) para evitar parpadeo entre rutas */}
          <motion.div
            className="auth-grid absolute inset-0 bg-[#f1f5f9]"
            initial={{ opacity: 0.92 }}
            animate={{ opacity: [0.92, 0.45, 0] }}
            transition={{ duration: profile === "reduced" ? 0.18 : veilMs / 1000, ease: baseEase }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 48% 28% at 50% 48%, rgba(59,130,246,0.14), transparent 72%), radial-gradient(circle at 78% 18%, rgba(167,139,250,0.1), transparent 38%)",
            }}
            initial={{ opacity: 0.55 }}
            animate={{ opacity: [0.55, 0.22, 0], scale: [1.008, 1, 1] }}
            transition={{ duration: profile === "reduced" ? 0.2 : veilMs / 1000, ease: baseEase }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
