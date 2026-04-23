import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccessPanel } from "@/components/auth/AccessPanel";
import { AuthTransitionOverlay } from "@/components/auth/AuthTransitionOverlay";
import { BootSequence } from "@/components/auth/BootSequence";
import { LoginVisualPane } from "@/components/auth/LoginVisualPane";
import { useMediaMotionProfile } from "@/hooks/useMediaMotionProfile";
import type { AuthProfile, AuthProgressStep, LoginExperiencePhase } from "@/lib/authExperience";
import { AUTH_EXPERIENCE_TIMINGS } from "@/lib/authExperience";

export function LoginExperience() {
  const navigate = useNavigate();
  const { reducedMotion, isMobileLayout } = useMediaMotionProfile();
  const [phase, setPhase] = useState<LoginExperiencePhase>("booting");
  const [substateIndex, setSubstateIndex] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [progressStep, setProgressStep] = useState<AuthProgressStep>("validating");

  const authProfile: AuthProfile = reducedMotion || isMobileLayout ? "reduced" : "full";

  const bootDuration = useMemo(() => {
    if (reducedMotion) return AUTH_EXPERIENCE_TIMINGS.boot.reduced;
    if (isMobileLayout) return AUTH_EXPERIENCE_TIMINGS.boot.mobile;
    return AUTH_EXPERIENCE_TIMINGS.boot.desktop;
  }, [isMobileLayout, reducedMotion]);

  useEffect(() => {
    if (phase !== "booting") return undefined;
    const stateRotation = window.setInterval(() => setSubstateIndex((prev) => prev + 1), reducedMotion ? 220 : 360);
    const toLogin = window.setTimeout(() => setPhase("readyForLogin"), bootDuration);
    return () => {
      window.clearInterval(stateRotation);
      window.clearTimeout(toLogin);
    };
  }, [bootDuration, phase, reducedMotion]);

  useEffect(() => {
    if (phase !== "authenticating") return undefined;
    setProgressStep("validating");
    const t1 = window.setTimeout(() => setProgressStep("syncing"), reducedMotion ? 120 : 430);
    const t2 = window.setTimeout(() => setProgressStep("loading"), reducedMotion ? 220 : 870);
    const complete = window.setTimeout(() => {
      setPhase("enteringDashboard");
      navigate("/dashboard", { state: { fromAuthTransition: true, authProfile } });
    }, authProfile === "reduced" ? AUTH_EXPERIENCE_TIMINGS.auth.reduced : AUTH_EXPERIENCE_TIMINGS.auth.full);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(complete);
    };
  }, [authProfile, navigate, phase, reducedMotion]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-linear-to-b from-slate-50 via-[#f8fbff] to-slate-100 px-4 py-4 sm:px-6 sm:py-6">
      <AnimatePresence mode="wait">
        {phase === "booting" ? (
          <BootSequence key="boot-sequence" substateIndex={substateIndex} reducedMotion={reducedMotion} />
        ) : (
          <motion.section
            key="access-panel"
            initial={{ opacity: 0, scale: 1.012, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: reducedMotion ? 0.1 : 0.5 }}
            className="relative z-10 mx-auto grid min-h-[calc(100dvh-2rem)] w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-[1.05fr_0.95fr]"
          >
            <LoginVisualPane energyLevel={energyLevel} reducedMotion={reducedMotion} />

            <div className="relative flex items-center justify-center">
              <AuthTransitionOverlay active={phase === "authenticating"} step={progressStep} reducedMotion={reducedMotion} />
              <AccessPanel
                disabled={phase !== "readyForLogin"}
                isAuthenticating={phase === "authenticating"}
                progressStep={progressStep}
                reducedMotion={reducedMotion}
                onInteract={() => setEnergyLevel((prev) => Math.min(prev + 1, 3))}
                onSubmitAccess={() => setPhase("authenticating")}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
