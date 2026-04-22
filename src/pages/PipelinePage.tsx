import { motion, useReducedMotion } from "framer-motion";
import { Calendar, ChevronRight, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { MainContentContainer } from "@/components/layout/MainContentContainer";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/shared/StatusPill";
import { motionDuration, motionEase } from "@/lib/animations";
import { PIPELINE_COLUMN_ACCENT, PRIORITY_STYLES } from "@/lib/constants";
import { processes } from "@/data/mockProcesses";
import type { Status } from "@/types";

const columns: Status[] = ["Submitted", "In Review", "Requires Finalization", "Completed"];

function PipelineCard({ item }: { item: (typeof processes)[0] }) {
  const prio = PRIORITY_STYLES[item.priority] ?? "bg-slate-100 text-slate-700";

  return (
    <Card className="rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold leading-snug text-slate-900">{item.subject}</p>
          <p className="mt-0.5 font-mono text-[11px] text-slate-500">{item.code}</p>
        </div>
        <StatusPill status={item.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${prio}`}>{item.priority}</span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <UserRound className="h-3 w-3" aria-hidden />
          {item.owner}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <Calendar className="h-3 w-3" aria-hidden />
          {item.timeLabel ?? item.updatedAt}
        </span>
      </div>
      <Link
        to={`/review/${item.id}`}
        className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-700 transition-[border-color,background-color,color,transform] duration-200 hover:border-blue-200 hover:bg-white hover:text-blue-700 active:scale-[0.99]"
      >
        Ver detalle
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  );
}

export function PipelinePage() {
  const reducedMotion = useReducedMotion() === true;

  return (
    <MainContentContainer className="space-y-8">
      <RevealOnScroll viewportAmount={0.35}>
        <PageHeader
          title="Pipeline"
          description="Tablero por etapa con densidad operativa y contexto por tarjeta."
        />
      </RevealOnScroll>

      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column, colIndex) => {
          const items = processes.filter((p) => p.status === column);
          const accent = PIPELINE_COLUMN_ACCENT[column] ?? "from-slate-400 to-slate-300";

          return (
            <motion.div
              key={column}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: reducedMotion ? 0 : colIndex * 0.06,
                duration: reducedMotion ? 0.01 : motionDuration.md,
                ease: motionEase.out,
              }}
              className="flex flex-col rounded-[28px] border border-slate-200/40 bg-linear-to-b from-slate-100/40 to-white/50 p-4 shadow-inner"
            >
              <div className={`h-1 rounded-full bg-linear-to-r ${accent}`} />
              <div className="mt-4 flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">{column}</h2>
                <span className="rounded-full bg-white/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600 shadow-sm">
                  {items.length}
                </span>
              </div>
              <div className="mt-4 flex flex-1 flex-col gap-3">
                {items.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      delay: reducedMotion ? 0 : colIndex * 0.05 + i * 0.04,
                      duration: reducedMotion ? 0.01 : motionDuration.sm,
                      ease: motionEase.out,
                    }}
                  >
                    <PipelineCard item={p} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </MainContentContainer>
  );
}
