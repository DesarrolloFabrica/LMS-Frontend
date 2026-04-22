import { useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  DASHBOARD_NAV_SCROLL_TABS,
  DASHBOARD_SCROLL_TAB_IDS,
  DASHBOARD_SECTION_IDS,
  scrollToDashboardSection,
} from "@/lib/dashboardSectionIds";
import { scaleTap } from "@/lib/animations";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/cn";

export type TopNavigationVariant = "solid" | "glass";

const barGlassOnHero =
  "rounded-full border border-white/10 bg-[#050505]/20 px-3 py-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 ease-out";

const barGlassOnLight =
  "rounded-full border border-slate-800/30 bg-slate-900/60 px-3 py-2 shadow-xl backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 ease-out";

const barSolid =
  "rounded-full border border-black/[0.04] bg-white/80 px-3 py-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all duration-300 sm:px-4 sm:py-2";

const tabBaseClass =
  "relative z-1 flex items-center justify-center rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight outline-none transition-colors duration-200";

const LAYOUT_ID = "dashboard-nav-indicator";

export function TopNavigation({ variant = "solid" }: { variant?: TopNavigationVariant }) {
  const isGlass = variant === "glass";
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";
  const dashboardNavOverLight = useUIStore((s) => s.dashboardNavOverLight);
  const dashboardNavScrollActiveTo = useUIStore((s) => s.dashboardNavScrollActiveTo);
  const setDashboardNavScrollActiveTo = useUIStore((s) => s.setDashboardNavScrollActiveTo);
  const darkNav = isGlass && dashboardNavOverLight;

  const scrollToInicio = useCallback(() => {
    setDashboardNavScrollActiveTo(DASHBOARD_SCROLL_TAB_IDS.inicio);
    scrollToDashboardSection(DASHBOARD_SECTION_IDS.hero);
  }, [setDashboardNavScrollActiveTo]);

  const barClass = !isGlass ? barSolid : darkNav ? barGlassOnLight : barGlassOnHero;
  const logoScrollHome = isDashboard && isGlass;

  const getLinkStyles = (isActive: boolean) => {
    if (!isGlass) {
      return isActive ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900";
    }
    if (darkNav) {
      return isActive ? "text-white font-semibold" : "text-slate-400 hover:text-white";
    }
    return isActive ? "text-white font-semibold" : "text-white/60 hover:text-white";
  };

  const newCtaBase =
    "relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-1.5 text-[12.5px] font-semibold tracking-tight transition-[box-shadow,transform,background-color] duration-200 sm:px-3.5";
  const newCtaGlass = darkNav
    ? "bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-[0_6px_22px_-6px_rgba(37,99,235,0.55)] ring-1 ring-white/10"
    : "bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-[0_8px_28px_-6px_rgba(37,99,235,0.55)] ring-1 ring-white/15";
  const newCtaSolid =
    "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-500/20";

  return (
    <header className={cn("z-50", isGlass ? "px-4 pt-4 sm:px-6 sm:pt-6" : "sticky top-4 px-4 sm:px-6")}>
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-2 sm:gap-4",
          isGlass ? "max-w-[min(1024px,calc(100%-1rem))]" : "max-w-[min(1280px,calc(100%-1rem))]",
          barClass,
        )}
      >
        <div className="flex shrink-0 items-center gap-2.5 pl-1">
          {logoScrollHome ? (
            <button
              type="button"
              onClick={scrollToInicio}
              className="flex shrink-0 items-center gap-2.5 rounded-full text-left outline-none transition hover:opacity-80"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-blue-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <span className="text-[10px] font-bold tracking-wider text-white">CL</span>
              </span>
              <span className="text-[14px] font-semibold tracking-tight text-white transition-colors duration-300">
                Carga LMS
              </span>
            </button>
          ) : (
            <NavLink
              to="/dashboard"
              className="flex shrink-0 items-center gap-2.5 rounded-full outline-none transition hover:opacity-90"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-blue-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <span className="text-[10px] font-bold tracking-wider text-white">CL</span>
              </div>
              <span
                className={cn(
                  "text-[14px] font-semibold tracking-tight transition-colors duration-300",
                  !isGlass ? "text-slate-900" : "text-white",
                )}
              >
                Carga LMS
              </span>
            </NavLink>
          )}
        </div>

        <nav
          className="mx-auto hidden min-w-0 flex-1 justify-center px-1 md:flex"
          aria-label="Secciones del dashboard"
        >
          <div
            className={cn(
              "relative inline-flex items-center gap-0.5 rounded-full p-0.5",
              isGlass && !darkNav && "bg-white/6 ring-1 ring-white/8",
              isGlass && darkNav && "bg-black/25 ring-1 ring-white/10",
              !isGlass && "bg-slate-100/80 ring-1 ring-slate-200/60",
            )}
          >
            {DASHBOARD_NAV_SCROLL_TABS.map((tab) => {
              if (isDashboard) {
                const isActive = dashboardNavScrollActiveTo === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setDashboardNavScrollActiveTo(tab.id);
                      scrollToDashboardSection(tab.sectionId);
                    }}
                    className={cn(tabBaseClass, "relative min-w-18", getLinkStyles(isActive))}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId={isGlass ? LAYOUT_ID : undefined}
                        className={cn(
                          "absolute inset-0 z-0 rounded-full shadow-sm",
                          !isGlass && "bg-white shadow-[0_1px_0_rgba(15,23,42,0.06)] ring-1 ring-slate-200/80",
                          isGlass &&
                            !darkNav &&
                            "bg-white/12 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_8px_22px_-8px_rgba(0,0,0,0.45)]",
                          isGlass && darkNav && "bg-white/10 ring-1 ring-white/15",
                        )}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        aria-hidden
                      />
                    ) : null}
                    <span className="relative z-1">{tab.label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={tab.id}
                  to={`/dashboard#${tab.sectionId}`}
                  className={({ isActive }) =>
                    cn(tabBaseClass, "relative min-w-18", getLinkStyles(isActive))
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <motion.span
                          layoutId={!isGlass ? LAYOUT_ID : undefined}
                          className="absolute inset-0 z-0 rounded-full bg-white shadow-[0_1px_0_rgba(15,23,42,0.06)] ring-1 ring-slate-200/80"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative z-1">{tab.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 pr-0.5 sm:gap-2.5">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={scaleTap}>
            <Link
              to="/submissions/new"
              className={cn(newCtaBase, isGlass ? newCtaGlass : newCtaSolid)}
              title="Registrar nueva entrega"
            >
              <Plus className="h-3.5 w-3.5 opacity-95" strokeWidth={2.5} aria-hidden />
              <span className="max-sm:sr-only">Nueva carga</span>
            </Link>
          </motion.div>

          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={scaleTap}
            className="relative inline-flex shrink-0 rounded-full ring-1 ring-transparent transition-[box-shadow,ring-color] duration-300 hover:ring-white/35 focus-within:ring-white/45"
          >
            <button
              type="button"
              className={cn(
                "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tracking-tight transition-all",
                !isGlass
                  ? "bg-slate-100 text-slate-600 shadow-inner shadow-slate-900/5 hover:bg-slate-200"
                  : "bg-white/10 text-white ring-1 ring-inset ring-white/10 hover:bg-white/20 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]",
              )}
              aria-label="Cuenta de usuario"
            >
              LM
              <span
                className={cn(
                  "absolute bottom-0 right-0 block h-2 w-2 rounded-full border-2",
                  !isGlass ? "border-white bg-emerald-500" : darkNav ? "border-slate-900 bg-emerald-400" : "border-[#050505] bg-emerald-400",
                )}
              />
            </button>
          </motion.span>
        </div>
      </div>
    </header>
  );
}
