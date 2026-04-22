import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { MainContentContainer } from "@/components/layout/MainContentContainer";
import { FilterBar } from "@/components/shared/FilterBar";
import { StatusPill } from "@/components/shared/StatusPill";
import { motionDuration, motionEase } from "@/lib/animations";
import { PRIORITY_STYLES } from "@/lib/constants";
import { reviewQueue } from "@/data/reviewQueue";

export function ReviewPage() {
  const pending = reviewQueue.length;
  const reducedMotion = useReducedMotion() === true;

  return (
    <MainContentContainer className="space-y-6">
      <RevealOnScroll viewportAmount={0.25} className="will-change-transform">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">Cola de revisión</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Vista operativa densa: materia, ownership y estado en una sola pasada visual.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-full border border-violet-200/60 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-900">
              {pending} pendientes
            </span>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll viewportAmount={0.15}>
        <FilterBar />
      </RevealOnScroll>

      <RevealOnScroll viewportAmount={0.12} className="overflow-hidden rounded-[28px] border border-slate-200/50 bg-white/90 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-[880px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Materia</th>
                <th className="px-4 py-4">Código</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4">Prioridad</th>
                <th className="px-4 py-4">Owner</th>
                <th className="px-4 py-4">Actualizado</th>
                <th className="px-5 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {reviewQueue.map((p, i) => {
                const prio = PRIORITY_STYLES[p.priority] ?? "bg-slate-100 text-slate-700";
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{
                      delay: reducedMotion ? 0 : i * 0.04,
                      duration: reducedMotion ? 0.01 : motionDuration.sm,
                      ease: motionEase.out,
                    }}
                    className="border-b border-slate-100/90 transition-colors duration-200 hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{p.subject}</p>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-600">{p.code}</td>
                    <td className="px-4 py-4">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${prio}`}>{p.priority}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{p.owner}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{p.timeLabel ?? p.updatedAt}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/review/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-500/15 transition-[transform,box-shadow,opacity] duration-200 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
                      >
                        Abrir
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </RevealOnScroll>
    </MainContentContainer>
  );
}
