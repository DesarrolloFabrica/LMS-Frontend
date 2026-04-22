import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Circle } from "lucide-react";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { MainContentContainer } from "@/components/layout/MainContentContainer";

const schema = z.object({
  subject: z.string().min(1),
  summary: z.string().min(20),
  source: z.url(),
});
type SubmissionForm = z.infer<typeof schema>;

const checklist = [
  "Objetivo instruccional definido",
  "Unidades y alcance acordados",
  "Material fuente verificable",
];

export function NewSubmissionPage() {
  const { register, handleSubmit } = useForm<SubmissionForm>({ resolver: zodResolver(schema) });

  return (
    <MainContentContainer className="space-y-8">
      <RevealOnScroll viewportAmount={0.3}>
        <div className="rounded-[28px] border border-slate-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Dashboard / Submissions / <span className="text-slate-700">Nueva</span>
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Nueva submission</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Workspace de creación: completa las secciones y valida antes de enviar.
              </p>
            </div>
            <span className="rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
              Borrador
            </span>
          </div>
        </div>
      </RevealOnScroll>

      <form
        onSubmit={handleSubmit(() => toast.success("Submission enviada"))}
        className="grid gap-8 lg:grid-cols-12"
      >
        <div className="space-y-6 lg:col-span-8">
          <RevealOnScroll as="section" viewportAmount={0.18} className="rounded-[28px] border border-slate-200/40 bg-slate-50/40 p-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Información base</h2>
            <div className="mt-4 rounded-2xl border border-white/80 bg-white p-5 shadow-sm">
              <label className="text-xs font-medium text-slate-500">Materia</label>
              <Select className="mt-2" {...register("subject")}>
                <option value="">Selecciona materia</option>
                <option>Matematicas Financieras</option>
                <option>Analitica de Datos</option>
              </Select>
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="section" viewportAmount={0.18} className="rounded-[28px] border border-slate-200/40 bg-white/80 p-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Resumen académico</h2>
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <label className="text-xs font-medium text-slate-500">Resumen (mín. 20 caracteres)</label>
              <Textarea className="mt-2" rows={6} placeholder="Objetivos, unidades y expectativas..." {...register("summary")} />
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="section" viewportAmount={0.18} className="rounded-[28px] border border-slate-200/40 bg-slate-50/40 p-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Material fuente</h2>
            <div className="mt-4 rounded-2xl border border-white/80 bg-white p-5 shadow-sm">
              <label className="text-xs font-medium text-slate-500">Enlace verificable</label>
              <Input className="mt-2" placeholder="https://drive.google.com/..." {...register("source")} />
            </div>
          </RevealOnScroll>

          <RevealOnScroll as="section" viewportAmount={0.18} className="rounded-[28px] border border-blue-200/30 bg-linear-to-br from-blue-50/30 to-white p-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-800/70">Revisión previa al envío</h2>
            <p className="mt-2 text-sm text-slate-600">
              Confirma que el resumen y el enlace son correctos. Tras enviar, el proceso entra en pipeline como Submitted.
            </p>
            <Button type="submit" className="mt-6 px-8 py-2.5">
              Enviar submission
            </Button>
          </RevealOnScroll>
        </div>

        <RevealOnScroll as="aside" viewportAmount={0.15} className="space-y-4 lg:col-span-4">
          <Card className="sticky top-28 rounded-[28px] border-slate-200/50 p-6">
            <h3 className="text-sm font-semibold text-slate-900">Guía y checklist</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Incluye objetivo instruccional, material base y alcance esperado. Los revisores usan este bloque como contexto
              rápido.
            </p>
            <ul className="mt-6 space-y-3">
              {checklist.map((line, i) => (
                <li key={line} className="flex items-start gap-3 text-sm text-slate-700">
                  {i === 0 ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" aria-hidden />
                  )}
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs text-slate-500">
              Progreso estimado: <span className="font-semibold text-slate-800">3 / 4</span> secciones con contenido
            </div>
          </Card>
        </RevealOnScroll>
      </form>
    </MainContentContainer>
  );
}
