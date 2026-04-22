import type { LucideIcon } from "lucide-react";
import type { MutableRefObject, Ref } from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { Activity, FilePlus, GitBranch, History, Sparkles } from "lucide-react";
import { activityFeed, processes } from "@/data/mockProcesses";
import {
  DASHBOARD_SCROLL_TAB_IDS,
  DASHBOARD_SECTION_IDS,
  scrollToDashboardSection,
} from "@/lib/dashboardSectionIds";
import {
  floatingLoopSubtle,
  motionDuration,
  motionEase,
  reducedStaggerContainer,
  scaleTap,
  staggerItem,
} from "@/lib/animations";
import { useMediaMotionProfile } from "@/hooks/useMediaMotionProfile";
import { useParallaxMouse } from "@/hooks/useParallaxMouse";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/cn";

export type DashboardHeroProps = {
  statsLine: string;
};

function assignRef<T>(instanceRef: Ref<T> | undefined, node: T | null) {
  if (!instanceRef) return;
  if (typeof instanceRef === "function") instanceRef(node);
  else (instanceRef as MutableRefObject<T | null>).current = node;
}

function priorityOrder(p: "High" | "Medium" | "Low") {
  return p === "High" ? 0 : p === "Medium" ? 1 : 2;
}

function computeHeroOperational() {
  const inReview = processes
    .filter((p) => p.status === "In Review")
    .sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));

  const spotlight = inReview[0];
  const lastMovementTitle = spotlight
    ? `${spotlight.code} en revisión editorial`
    : (() => {
        const sorted = [...activityFeed].sort(
          (a, b) => b.at.localeCompare(a.at) || (b.time ?? "").localeCompare(a.time ?? ""),
        );
        return sorted[0]?.text ?? "Sin eventos recientes";
      })();

  const total = processes.length || 1;
  const completed = processes.filter((p) => p.status === "Completed").length;
  const inReviewCount = processes.filter((p) => p.status === "In Review").length;
  const pipelineHealth = Math.min(
    96,
    Math.max(68, Math.round(62 + (completed / total) * 28 + Math.max(0, 8 - inReviewCount * 3))),
  );

  const active = processes.filter((p) => p.status !== "Completed");
  const t = active.length || 1;
  const submitted = active.filter((p) => p.status === "Submitted").length;
  const rev = active.filter((p) => p.status === "In Review").length;
  const fin = active.filter((p) => p.status === "Requires Finalization").length;
  const other = Math.max(0, active.length - submitted - rev - fin);

  const rawSegments = [
    { key: "submitted", pct: (submitted / t) * 100, className: "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" },
    { key: "review", pct: (rev / t) * 100, className: "bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" },
    { key: "fin", pct: (fin / t) * 100, className: "bg-white/40" },
    { key: "other", pct: (other / t) * 100, className: "bg-white/10" },
  ].filter((s) => s.pct > 0.5);

  const segments =
    rawSegments.length > 0 ? rawSegments : [{ key: "idle", pct: 100, className: "bg-white/10" }];

  return { lastMovementTitle, pipelineHealth, segments };
}

const HERO_VIDEO_SRC = "/videos/192779-893446888.mp4";
const HERO_VIDEO_POSTER = "/images/hero-tech.jpg";

const FLOW_LEGEND: { title: string; description: string; icon: LucideIcon; featured?: boolean }[] = [
  {
    title: "Pipeline",
    description: "Resumen de etapas y volumen de trabajo por fase en el tablero.",
    icon: GitBranch,
    featured: true,
  },
  {
    title: "Revisión editorial",
    description: "Cola priorizada, QA y comentarios en un solo hilo de trabajo.",
    icon: Sparkles,
  },
  {
    title: "Altas de materia",
    description: "Registro de entregas, enlaces y material base con trazabilidad.",
    icon: FilePlus,
  },
  {
    title: "Actividad en vivo",
    description: "Línea de tiempo de movimientos y avisos recientes del workspace.",
    icon: Activity,
  },
  {
    title: "Historial y cierres",
    description: "Procesos finalizados y documentación lista para auditoría.",
    icon: History,
  },
];

export const DashboardHero = forwardRef<HTMLElement, DashboardHeroProps>(function DashboardHero(
  { statsLine },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { lastMovementTitle, pipelineHealth, segments } = computeHeroOperational();
  const setDashboardNavScrollActiveTo = useUIStore((s) => s.setDashboardNavScrollActiveTo);
  const reducedMotion = useReducedMotion() === true;
  const { allowRichMotion } = useMediaMotionProfile();
  const [parallaxRef, parallax] = useParallaxMouse<HTMLElement>({ disabled: !allowRichMotion });

  const metricsRef = useRef<HTMLDivElement | null>(null);
  const metricsInView = useInView(metricsRef, { once: true, amount: 0.35 });
  const countMv = useMotionValue(0);
  const [displayHealth, setDisplayHealth] = useState(0);
  const itemVariant = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } },
      }
    : staggerItem;
  const rounded = useTransform(countMv, (v) => Math.round(v));

  useMotionValueEvent(rounded, "change", (v) => {
    setDisplayHealth(v);
  });

  useEffect(() => {
    if (!metricsInView) return;
    const ctrl = animate(countMv, pipelineHealth, {
      duration: reducedMotion ? 0.05 : 1.05,
      ease: motionEase.outExpo,
    });
    return () => ctrl.stop();
  }, [metricsInView, pipelineHealth, countMv, reducedMotion]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;
    el.defaultMuted = true;
    const play = () => {
      const r = el.play();
      if (r !== undefined) void r.catch(() => {});
    };
    play();
    const onVis = () => {
      if (document.visibilityState === "visible") play();
      else el.pause();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const setMergedRef = useCallback(
    (node: HTMLElement | null) => {
      (parallaxRef as { current: HTMLElement | null }).current = node;
      assignRef(ref, node);
    },
    [ref, parallaxRef],
  );

  const goFlow = () => {
    setDashboardNavScrollActiveTo(DASHBOARD_SCROLL_TAB_IDS.procesos);
    scrollToDashboardSection(DASHBOARD_SECTION_IDS.flow);
  };

  const goNav = () => {
    setDashboardNavScrollActiveTo(DASHBOARD_SCROLL_TAB_IDS.procesos);
    scrollToDashboardSection(DASHBOARD_SECTION_IDS.processes);
  };

  const shiftX = parallax.enabled ? parallax.x * 10 : 0;
  const shiftY = parallax.enabled ? parallax.y * 8 : 0;
  const glowX = 50 + parallax.x * 12;
  const glowY = 42 + parallax.y * 10;
  const cardTiltX = parallax.enabled ? parallax.x * -5 : 0;
  const cardTiltY = parallax.enabled ? parallax.y * -4 : 0;

  const staggerParent = reducedStaggerContainer(reducedMotion);

  const primaryBtn =
    "inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-[13.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_18px_rgba(37,99,235,0.35)]";
  const secondaryBtn =
    "inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-6 text-[13.5px] font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md";

  return (
    <div className="w-full min-h-dvh shrink-0 bg-[#020617]">
      <motion.section
        id={DASHBOARD_SECTION_IDS.hero}
        ref={setMergedRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionDuration.xl, ease: motionEase.outExpo }}
        className="relative flex h-dvh min-h-0 w-full shrink-0 flex-col overflow-hidden bg-[#020617] text-white"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute inset-[-4%] h-[108%] w-[108%]"
            style={{
              x: shiftX,
              y: shiftY,
            }}
            transition={{ type: "spring", stiffness: 64, damping: 28 }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.82] contrast-[1.05] saturate-[0.96]"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={HERO_VIDEO_POSTER}
              aria-hidden
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-1 opacity-[0.14]"
          style={{
            background: `radial-gradient(ellipse 55% 45% at ${glowX}% ${glowY}%, rgba(59,130,246,0.35), transparent 62%)`,
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-1 bg-[#020617]/72" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-linear-to-t from-[#020617]/88 via-transparent to-[#020617]/38"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[min(1280px,calc(100%-2rem))] flex-1 flex-col justify-center py-14 pb-28 pt-23 sm:pt-16 sm:pb-32 md:pb-36 md:pt-28 lg:pb-40">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex max-w-xl flex-col justify-center text-left">
              <motion.div
                variants={staggerParent}
                initial="hidden"
                animate="visible"
                className="contents"
              >
                <motion.span
                  variants={itemVariant}
                  className="mb-4 inline-flex w-fit items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium tracking-wide text-blue-400 backdrop-blur-md"
                >
                  Workspace Operativo
                </motion.span>
                <motion.h1
                  variants={itemVariant}
                  className="mb-5 text-4xl font-semibold leading-[1.05] tracking-tight drop-shadow-lg sm:text-5xl md:text-[3.5rem]"
                >
                  Control académico <br className="hidden sm:block" />
                  en un solo flujo
                </motion.h1>
                <motion.p
                  variants={itemVariant}
                  className="mb-4 max-w-lg text-base font-light leading-relaxed text-slate-300 drop-shadow-md sm:text-lg"
                >
                  Orquesta entregas, revisiones y cierres con visibilidad total. Prioriza, ejecuta y finaliza sin
                  fricción.
                </motion.p>
                <motion.p variants={itemVariant} className="mb-8 text-sm font-medium text-slate-400">
                  {statsLine}
                </motion.p>

                <motion.div variants={itemVariant} className="flex flex-wrap gap-3.5">
                  <motion.button
                    type="button"
                    onClick={goFlow}
                    className={primaryBtn}
                    whileHover={{
                      y: -2,
                      scale: 1.02,
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.22), 0 10px 28px rgba(37,99,235,0.45), 0 0 0 1px rgba(147,197,253,0.25)",
                    }}
                    whileTap={scaleTap}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  >
                    Comenzar flujo
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={goNav}
                    className={secondaryBtn}
                    whileHover={{
                      y: -2,
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.12)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 12px 32px -8px rgba(0,0,0,0.35)",
                    }}
                    whileTap={scaleTap}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  >
                    Ver pipeline
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            <div className="flex justify-start lg:justify-end">
              <motion.div
                ref={metricsRef}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reducedMotion ? 0 : 0.12, duration: motionDuration.lg, ease: motionEase.outExpo }}
                className="w-full max-w-[360px] will-change-transform"
              >
                <div
                  className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-2xl transform-3d"
                  style={{
                    transform: `perspective(880px) translate3d(${cardTiltX}px, ${cardTiltY}px, 0) rotateX(${cardTiltY * 0.12}deg) rotateY(${cardTiltX * 0.15}deg)`,
                  }}
                >
                <motion.div
                  animate={
                    allowRichMotion && !reducedMotion ? floatingLoopSubtle.animate : { y: 0 }
                  }
                  transition={
                    allowRichMotion && !reducedMotion
                      ? floatingLoopSubtle.transition
                      : { duration: 0 }
                  }
                >
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Último movimiento
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-medium leading-snug text-slate-100">{lastMovementTitle}</h3>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-medium text-slate-400">Pipeline health</span>
                    <div className="text-3xl font-semibold tabular-nums tracking-tight text-white">
                      {displayHealth}
                      <span className="text-xl text-slate-500">%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-white/5">
                  {segments.map((s, i) => (
                    <motion.div
                      key={s.key}
                      className={cn("h-full min-w-1 origin-left rounded-full", s.className)}
                      style={{ flex: `${Math.max(s.pct, 4)} 1 0%` }}
                      initial={{ scaleX: 0 }}
                      animate={metricsInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{
                        duration: reducedMotion ? 0.02 : 0.9,
                        delay: reducedMotion ? 0 : i * 0.06,
                        ease: motionEase.outExpo,
                      }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-[11px] font-medium leading-relaxed text-slate-400">
                  Distribución aproximada por etapa en procesos activos.
                </p>
                </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-14 h-48 bg-linear-to-t from-[#010409] via-[#020617]/95 to-transparent sm:h-56 md:h-60"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4 sm:bottom-10 sm:px-6 md:px-8">
          <div className="pointer-events-auto w-full max-w-[min(1100px,calc(100%-0.5rem))]">
            <p className="sr-only">
              Resumen informativo de áreas del flujo operativo; la navegación real está en la barra superior.
            </p>
            <ul className="flex list-none flex-row gap-3 overflow-x-auto rounded-4xl border border-white/8 bg-[#020617]/40 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:gap-4 sm:p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {FLOW_LEGEND.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.title}
                    className={cn(
                      "group relative flex min-w-60 flex-1 shrink-0 items-start gap-3.5 rounded-2xl border px-4 py-4 transition-all duration-300 sm:min-w-0",
                      item.featured
                        ? "border-blue-500/30 bg-linear-to-b from-blue-500/10 to-transparent shadow-[inset_0_1px_0_rgba(96,165,250,0.2)]"
                        : "border-white/5 bg-linear-to-b from-white/2 to-transparent hover:border-white/10 hover:bg-white/6",
                    )}
                  >
                    {item.featured && (
                      <div className="absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-blue-400 to-transparent opacity-60" />
                    )}

                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                        item.featured
                          ? "bg-blue-500/20 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                          : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-300",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={item.featured ? 2 : 1.75} aria-hidden />
                    </span>

                    <div className="flex min-w-0 flex-col gap-1.5">
                      <p
                        className={cn(
                          "text-[13.5px] font-semibold leading-none tracking-tight transition-colors duration-300",
                          item.featured ? "text-blue-50" : "text-slate-200 group-hover:text-white",
                        )}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11.5px] font-normal leading-relaxed text-slate-400/90 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
});
