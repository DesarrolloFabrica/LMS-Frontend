import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ActiveProcessesSection } from "@/components/dashboard/ActiveProcessesSection";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { FlowExplanationSection } from "@/components/dashboard/FlowExplanationSection";
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
  const heroDarkRef = useRef<HTMLElement | null>(null);
  const setDashboardNavOverLight = useUIStore((s) => s.setDashboardNavOverLight);
  const setDashboardNavScrollActiveTo = useUIStore((s) => s.setDashboardNavScrollActiveTo);

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
      <DashboardHero ref={heroDarkRef} statsLine={statsLine} />
      <FlowExplanationSection />
      <ActiveProcessesSection />
    </>
  );
}
