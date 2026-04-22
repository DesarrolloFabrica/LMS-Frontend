import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { MainContentContainer } from "@/components/layout/MainContentContainer";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/shared/FilterBar";
import { StatusPill } from "@/components/shared/StatusPill";
import { motionDuration, motionEase } from "@/lib/animations";
import { historyItems } from "@/data/historyItems";

export function HistoryPage() {
  const reducedMotion = useReducedMotion() === true;

  return (
    <MainContentContainer className="space-y-8">
      <RevealOnScroll viewportAmount={0.25}>
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">Archivo de cierres</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Procesos finalizados con responsable, fecha de cierre y enlace a material archivado (mock).
            </p>
          </div>
          <Button type="button" className="shrink-0 px-5">
            Exportar
          </Button>
        </div>
      </RevealOnScroll>

      <RevealOnScroll viewportAmount={0.15}>
        <FilterBar />
      </RevealOnScroll>

      <RevealOnScroll viewportAmount={0.12} className="overflow-hidden rounded-[28px] border border-slate-200/50 bg-white/90 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Materia</th>
                <th className="px-4 py-4">Código</th>
                <th className="px-4 py-4">Cierre</th>
                <th className="px-4 py-4">Responsable</th>
                <th className="px-4 py-4">Estado final</th>
                <th className="px-5 py-4">Archivo</th>
              </tr>
            </thead>
            <tbody>
              {historyItems.map((p, i) => (
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
                  <td className="px-5 py-4 font-semibold text-slate-900">{p.subject}</td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-600">{p.code}</td>
                  <td className="px-4 py-4 text-xs text-slate-600">{p.closedAt ?? p.updatedAt}</td>
                  <td className="px-4 py-4 text-slate-700">{p.owner}</td>
                  <td className="px-4 py-4">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-5 py-4">
                    {p.archiveUrl ? (
                      <a
                        href={p.archiveUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir enlace
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealOnScroll>
    </MainContentContainer>
  );
}
