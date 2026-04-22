import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { SelectableCardPanel } from "@/components/dashboard/SelectableCardPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { StatusPill } from "@/components/shared/StatusPill";
import { DASHBOARD_SECTION_IDS } from "@/lib/dashboardSectionIds";
import { dashboardRouteShortcuts, processes } from "@/data/mockProcesses";
import { PRIORITY_STYLES } from "@/lib/constants";
import { techCoverImageForKey } from "@/lib/techCoverImages";
import { hoverLift, motionEase, motionDuration, scaleTap } from "@/lib/animations";
import type { DashboardActiveCard, Status } from "@/types";
import { cn } from "@/lib/cn";

function cardCoverUrl(p: DashboardActiveCard) {
  return p.coverImage ?? techCoverImageForKey(p.id);
}

function pipelineProgress(status: Status) {
  switch (status) {
    case "Submitted":
      return 28;
    case "In Review":
      return 52;
    case "Requires Finalization":
      return 78;
    case "Completed":
      return 100;
    default:
      return 20;
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AnimatedProgressTrack({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion() === true;
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div
      ref={ref}
      className="mt-auto h-[5px] overflow-hidden rounded-full bg-slate-200/80 shadow-inner"
      role="presentation"
      aria-hidden
    >
      <motion.div
        className="h-full rounded-full bg-linear-to-r from-sky-500 via-indigo-500 to-violet-600 shadow-[0_0_14px_rgba(99,102,241,0.45)]"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: value / 100 } : { scaleX: 0 }}
        style={{ transformOrigin: "left" }}
        transition={{
          duration: reduced ? 0.02 : motionDuration.lg,
          ease: motionEase.outExpo,
        }}
      />
    </div>
  );
}

function DetailProgress({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion() === true;
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="h-2 max-w-md overflow-hidden rounded-full bg-slate-200/90 shadow-inner" aria-hidden>
      <motion.div
        className="h-full rounded-full bg-linear-to-r from-sky-500 via-indigo-500 to-violet-600 shadow-[0_0_16px_rgba(99,102,241,0.4)]"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: value / 100 } : { scaleX: 0 }}
        style={{ transformOrigin: "left" }}
        transition={{ duration: reduced ? 0.02 : motionDuration.lg, ease: motionEase.outExpo }}
      />
    </div>
  );
}

const cardShell =
  "group relative flex w-full flex-col overflow-hidden rounded-[1.25rem] border text-left outline-none transition-colors duration-300 ease-out";

const cardShellIdle =
  "border-slate-200/70 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)] hover:border-slate-300/90";

const cardShellSelected =
  "border-indigo-300/80 bg-white shadow-[0_12px_40px_-16px_rgba(79,70,229,0.28)] ring-2 ring-indigo-500/35 ring-offset-2 ring-offset-[#f4f7fc]";

export function ActiveProcessesSection() {
  const reducedMotion = useReducedMotion() === true;
  const panelItems = useMemo((): DashboardActiveCard[] => {
    const active = processes
      .filter((p) => p.status !== "Completed")
      .map((p) => ({ ...p, href: `/review/${p.id}` }));
    return [...dashboardRouteShortcuts, ...active];
  }, []);

  return (
    <AnimatedSection id={DASHBOARD_SECTION_IDS.processes} className="relative border-b border-slate-200/60 bg-[#f4f7fc] py-16 sm:py-20 lg:py-24" reveal={false}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(99,102,241,0.09),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[min(1280px,calc(100%-2rem))] px-4 sm:px-6">
        <RevealOnScroll viewportAmount={0.2} className="will-change-transform">
          <SectionTitle
            size="editorial"
            title="Procesos activos"
            subtitle="Selecciona una ficha para ver el detalle y abrir la vista completa en la plataforma."
          />
        </RevealOnScroll>

        {panelItems.length === 0 ? (
          <p className="mt-8 text-sm text-slate-600">No hay procesos en esta vista.</p>
        ) : (
          <div className="mt-10">
            <SelectableCardPanel
              items={panelItems}
              getItemId={(p) => p.id}
              gridClassName="gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7"
              renderCard={({ item: p, index, selected, onSelect, detailPanelId }) => {
                const prio = PRIORITY_STYLES[p.priority] ?? "bg-slate-100 text-slate-700";
                const cover = cardCoverUrl(p);
                const isShortcut = p.id.startsWith("route-");
                const progress = pipelineProgress(p.status);
                const hoverNav = {
                  ...hoverLift,
                  boxShadow: "0 22px 50px -18px rgba(37, 99, 235, 0.22)",
                  transition: { type: "spring" as const, stiffness: 400, damping: 28 },
                };
                const hoverProcess = {
                  x: 5,
                  y: -3,
                  boxShadow: "0 24px 52px -20px rgba(79, 70, 229, 0.2)",
                  transition: { type: "spring" as const, stiffness: 380, damping: 28 },
                };

                return (
                  <motion.div
                    className="min-w-0"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{
                      duration: reducedMotion ? 0.01 : motionDuration.md,
                      delay: reducedMotion ? 0 : index * 0.05,
                      ease: motionEase.out,
                    }}
                  >
                    <motion.div
                      className={cn(
                        cardShell,
                        selected ? cardShellSelected : cardShellIdle,
                        !selected && "shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)]",
                      )}
                      whileHover={!selected ? (isShortcut ? hoverNav : hoverProcess) : undefined}
                      whileTap={scaleTap}
                    >
                      <Link
                        to={p.href}
                        onClick={onSelect}
                        aria-controls={detailPanelId}
                        aria-label={`Abrir vista: ${p.subject}`}
                        className="flex min-h-0 flex-1 flex-col text-left text-inherit no-underline outline-none"
                      >
                        <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden sm:aspect-5/3">
                          <img
                            src={cover}
                            alt=""
                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                          />
                          <div
                            className="absolute inset-0 bg-linear-to-t from-slate-950/92 via-slate-950/40 to-slate-950/5"
                            aria-hidden
                          />
                          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-3.5">
                            <span className="rounded-lg border border-white/25 bg-white/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/95 shadow-sm backdrop-blur-md">
                              {p.code}
                            </span>
                          </div>
                          <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-3.5">
                            <p className="text-[15px] font-semibold leading-snug tracking-tight text-white drop-shadow-md sm:text-base">
                              {p.subject}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col gap-3.5 bg-linear-to-b from-white to-slate-50/95 p-4 pb-3.5 sm:p-4 sm:pb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusPill status={p.status} />
                            <span
                              className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight", prio)}
                            >
                              {p.priority}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">{p.timeLabel ?? p.updatedAt}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200/90 bg-white text-[11px] font-bold tracking-tight text-slate-700 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.12)] ring-2 ring-white">
                              {initials(p.owner)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Responsable
                              </p>
                              <p className="truncate text-sm font-semibold text-slate-800">{p.owner}</p>
                            </div>
                          </div>
                          <AnimatedProgressTrack value={progress} />
                        </div>
                      </Link>
                    </motion.div>
                  </motion.div>
                );
              }}
              renderDetail={(p) => {
                if (!p) return null;
                const prio = PRIORITY_STYLES[p.priority] ?? "bg-slate-100 text-slate-700";
                const progress = pipelineProgress(p.status);
                const cover = cardCoverUrl(p);
                return (
                  <Link
                    to={p.href}
                    className="group relative block overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_64px_-28px_rgba(15,23,42,0.22)] outline-none transition-colors duration-300 hover:border-indigo-200/80 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                  >
                    <motion.div
                      className="relative"
                      initial={false}
                      whileHover={{ y: -3 }}
                      whileTap={scaleTap}
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    >
                      <div className="relative h-[min(280px,42vw)] w-full min-h-[200px] sm:h-56 md:h-64">
                        <img
                          src={cover}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                        <div
                          className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/45 to-slate-950/10"
                          aria-hidden
                        />
                        <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="border border-white/25 bg-white/12 font-mono text-[11px] font-semibold text-white shadow-sm backdrop-blur-md">
                              {p.code}
                            </Badge>
                            <StatusPill status={p.status} />
                          </div>
                          <h3 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-md sm:text-3xl">
                            {p.subject}
                          </h3>
                        </div>
                      </div>
                      <div className="grid gap-5 border-t border-slate-100/90 bg-linear-to-b from-white to-slate-50/90 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:p-7">
                        <div className="space-y-3 text-sm text-slate-600">
                          <p>
                            <span className="text-slate-500">Responsable</span>{" "}
                            <span className="font-semibold text-slate-900">{p.owner}</span>
                          </p>
                          <p className="flex flex-wrap items-center gap-2">
                            <span className="text-slate-500">Prioridad</span>
                            <span
                              className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold", prio)}
                            >
                              {p.priority}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">Actualizado</span>{" "}
                            <span className="font-medium text-slate-800">{p.timeLabel ?? p.updatedAt}</span>
                          </p>
                          <DetailProgress value={progress} />
                        </div>
                        <span className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition group-hover:bg-indigo-950 sm:justify-self-end">
                          Abrir ficha
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                );
              }}
            />
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
