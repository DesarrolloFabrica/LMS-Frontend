import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { MainContentContainer } from "@/components/layout/MainContentContainer";
import { processes } from "@/data/mockProcesses";
import { StatusPill } from "@/components/shared/StatusPill";
import { TimelineItem } from "@/components/shared/TimelineItem";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motionDuration, motionEase, scaleTap } from "@/lib/animations";

export function ReviewDetailPage() {
  const { id } = useParams();
  const item = processes.find((p) => p.id === id) ?? processes[0];

  return (
    <MainContentContainer>
      <div className="grid gap-4 lg:grid-cols-3">
        <RevealOnScroll as="section" viewportAmount={0.2} className="space-y-4 lg:col-span-2">
          <Card className="rounded-2xl border-slate-200/70 p-5 sm:p-6" whileHover={{ y: -2 }}>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{item.subject}</h1>
            <div className="mt-3">
              <StatusPill status={item.status} />
            </div>
            <div className="mt-6 space-y-0">
              <TimelineItem title="Submission creada" date="18 Abr 2026" />
              <TimelineItem title="Validacion editorial" date="19 Abr 2026" />
              <TimelineItem title="Asignada a review" date="20 Abr 2026" />
            </div>
            <motion.div className="mt-6" whileTap={scaleTap}>
              <Button className="px-6">Continuar / Finalizar</Button>
            </motion.div>
          </Card>
        </RevealOnScroll>

        <RevealOnScroll
          as="aside"
          viewportAmount={0.18}
          transition={{ delay: 0.05, duration: motionDuration.md, ease: motionEase.out }}
        >
          <Card className="rounded-2xl border-slate-200/70 p-5 sm:p-6">
            <p className="font-semibold text-slate-900">Metadatos</p>
            <p className="mt-3 text-sm text-slate-600">
              <span className="text-slate-500">Responsable:</span> {item.owner}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="text-slate-500">Código:</span>{" "}
              <span className="font-mono text-slate-800">{item.code}</span>
            </p>
            <a
              className="mt-4 inline-flex text-sm font-medium text-blue-600 transition hover:text-blue-700"
              href="#"
            >
              Material adjunto (mock)
            </a>
          </Card>
        </RevealOnScroll>
      </div>
    </MainContentContainer>
  );
}
