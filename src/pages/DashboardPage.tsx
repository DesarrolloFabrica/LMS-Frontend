import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActiveProcessesSection } from "@/components/dashboard/ActiveProcessesSection";
import { DashboardEntryTransition } from "@/components/dashboard/DashboardEntryTransition";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { FlowExplanationSection } from "@/components/dashboard/FlowExplanationSection";
import type { AuthNavigationState, AuthProfile } from "@/lib/authExperience";
import { AUTH_EXPERIENCE_INTENSITY } from "@/lib/authExperience";
import {
  DASHBOARD_SECTION_ID_TO_NAV,
  dashboardSectionIdFromHash,
  scrollToDashboardSection,
} from "@/lib/dashboardSectionIds";
import { activityFeed, processes } from "@/data/mockProcesses";
import { useUIStore } from "@/store/uiStore";

const NAV_SWITCH_PX = 80;

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const heroDarkRef = useRef<HTMLElement | null>(null);
  const setDashboardNavOverLight = useUIStore((s) => s.setDashboardNavOverLight);
  const setDashboardNavScrollActiveTo = useUIStore((s) => s.setDashboardNavScrollActiveTo);
  const navState = (location.state ?? null) as AuthNavigationState | null;
  const fromAuthTransition = navState?.fromAuthTransition === true;
  const entryProfile: AuthProfile = navState?.authProfile === "full" ? "full" : "reduced";
  const [showEntryTransition, setShowEntryTransition] = useState(fromAuthTransition);
  const intensity =
    entryProfile === "full" ? AUTH_EXPERIENCE_INTENSITY.full : AUTH_EXPERIENCE_INTENSITY.reduced;

  const activeQueue = processes.filter((p) => p.status !== "Completed");
  const inReviewCount = processes.filter((p) => p.status === "In Review").length;
  const statsLine = `${activeQueue.length} procesos activos · ${inReviewCount} en revisión · ${activityFeed.length} eventos hoy`;

  useEffect(() => {
    const tick = () => {
      const el = heroDarkRef.current;
      if (!el) return;
      const bottom = el.getBoundingClientRect().bottom;
      setDashboardNavOverLight(bottom < NAV_SWITCH_PX);
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      setDashboardNavOverLight(false);
    };
  }, [setDashboardNavOverLight]);

  useEffect(() => {
    if (!fromAuthTransition) return;
    navigate(`${location.pathname}${location.hash}`, { replace: true, state: null });
  }, [fromAuthTransition, location.hash, location.pathname, navigate]);

  useLayoutEffect(() => {
    if (location.pathname !== "/dashboard") return;
    const sectionId = dashboardSectionIdFromHash(location.hash);
    if (!sectionId) return;
    scrollToDashboardSection(sectionId);
    const tab = DASHBOARD_SECTION_ID_TO_NAV[sectionId];
    if (tab) setDashboardNavScrollActiveTo(tab);
  }, [location.pathname, location.hash, setDashboardNavScrollActiveTo]);

  useEffect(() => {
    const ids = Object.keys(DASHBOARD_SECTION_ID_TO_NAV);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio > 0.12)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const best = intersecting[0];
        const id = best?.target.id;
        if (id) {
          const to = DASHBOARD_SECTION_ID_TO_NAV[id];
          if (to) setDashboardNavScrollActiveTo(to);
        }
      },
      { threshold: [0.08, 0.14, 0.22, 0.35, 0.5], rootMargin: "-12% 0px -52% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [setDashboardNavScrollActiveTo]);

  return (
    <>
      <DashboardEntryTransition
        active={showEntryTransition}
        profile={entryProfile}
        onComplete={() => setShowEntryTransition(false)}
      />
      <motion.div
        initial={
          fromAuthTransition
            ? { opacity: 0.7, scale: intensity.scaleFrom, filter: `blur(${intensity.blurPx}px)` }
            : false
        }
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: entryProfile === "full" ? 0.9 : 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
      <DashboardHero ref={heroDarkRef} statsLine={statsLine} />
      <FlowExplanationSection />
      <ActiveProcessesSection />
      </motion.div>
    </>
  );
}
