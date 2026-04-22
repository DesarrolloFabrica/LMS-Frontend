import { motion, useReducedMotion } from "framer-motion";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { MainContentContainer } from "@/components/layout/MainContentContainer";
import { activityFeed } from "@/data/mockProcesses";
import { ActivityFeedItem } from "@/components/shared/ActivityFeedItem";
import { Card } from "@/components/ui/Card";
import { motionDuration, motionEase } from "@/lib/animations";

function countByType() {
  const m: Record<string, number> = {};
  for (const e of activityFeed) {
    m[e.type] = (m[e.type] ?? 0) + 1;
  }
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

export function ActivityPage() {
  const byType = countByType();
  const latest = activityFeed[0];
  const reducedMotion = useReducedMotion() === true;

  return (
    <MainContentContainer className="space-y-8">
      <RevealOnScroll viewportAmount={0.22}>
        <div className="rounded-[28px] border border-slate-200/50 bg-linear-to-br from-white via-white to-slate-50/80 p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">Actividad del workspace</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Registro cronológico con actor, tipo y vínculo a estado. Panel lateral resume volumen por tipo de evento.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Eventos (24h)", "Tipos distintos", "Último actor"].map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  delay: reducedMotion ? 0 : i * 0.06,
                  duration: reducedMotion ? 0.01 : motionDuration.md,
                  ease: motionEase.out,
                }}
              >
                {i === 0 ? (
                  <Card className="rounded-2xl border-blue-100/60 bg-blue-50/30 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700/80">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{activityFeed.length}</p>
                  </Card>
                ) : i === 1 ? (
                  <Card className="rounded-2xl border-violet-100/60 bg-violet-50/30 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700/80">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{byType.length}</p>
                  </Card>
                ) : (
                  <Card className="rounded-2xl border-slate-200/60 bg-slate-50/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{latest?.actor ?? "—"}</p>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      <div className="grid gap-8 lg:grid-cols-12">
        <RevealOnScroll
          as="section"
          viewportAmount={0.15}
          className="rounded-[28px] border border-slate-200/40 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8 lg:col-span-7"
        >
          <h2 className="text-lg font-semibold text-slate-900">Línea de tiempo</h2>
          <p className="mt-1 text-sm text-slate-600">Hora, actor, tipo y estado vinculado por evento.</p>
          <div className="mt-8 flex flex-col gap-0">
            {activityFeed.map((a, i) => (
              <ActivityFeedItem
                key={a.id}
                type={a.type}
                text={a.text}
                at={a.at}
                time={a.time}
                actor={a.actor}
                linkedStatus={a.linkedStatus}
                isLast={i === activityFeed.length - 1}
              />
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll
          as="aside"
          viewportAmount={0.12}
          className="space-y-4 lg:col-span-5"
          transition={{ delay: reducedMotion ? 0 : 0.06 }}
        >
          <Card className="rounded-[28px] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Resumen por tipo</h2>
            <ul className="mt-4 space-y-3">
              {byType.map(([label, n]) => (
                <li
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-shadow duration-200 hover:shadow-sm"
                >
                  <span className="text-sm font-medium text-slate-800">{label}</span>
                  <span className="font-mono text-sm font-semibold text-slate-900">{n}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="rounded-2xl border-dashed border-slate-200/80 bg-linear-to-br from-slate-50 to-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Destacado</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{latest?.text}</p>
            <p className="mt-2 text-xs text-slate-500">
              {latest?.actor} · {latest?.time} · {latest?.at}
            </p>
          </Card>
        </RevealOnScroll>
      </div>
    </MainContentContainer>
  );
}
