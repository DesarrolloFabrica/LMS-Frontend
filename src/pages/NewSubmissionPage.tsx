import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Sparkles, Send, Box, FileText, Link as LinkIcon, Activity } from "lucide-react";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

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
  const { register, handleSubmit, watch } = useForm<SubmissionForm>({ resolver: zodResolver(schema) });
  const formValues = watch();
  
  // Calculate progress
  let completedCount = 0;
  if (formValues.subject) completedCount++;
  if (formValues.summary && formValues.summary.length >= 20) completedCount++;
  if (formValues.source && formValues.source.includes("http")) completedCount++;
  
  const progressPercent = Math.round((completedCount / 3) * 100);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden bg-[#FAFAFA]">
      {/* Decorative Background Mesh - Futuristic Light */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] animate-[spin_40s_linear_infinite] rounded-full bg-blue-300/20 blur-[120px]" />
        <div className="absolute -right-[5%] top-[20%] h-[35rem] w-[35rem] animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-indigo-300/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[30rem] w-[30rem] animate-[spin_50s_linear_infinite_reverse] rounded-full bg-cyan-300/20 blur-[120px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[min(1280px,calc(100%-2rem))] px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
        <RevealOnScroll viewportAmount={0.3}>
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] backdrop-blur-3xl transition-all duration-500 hover:bg-white/60">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                  <div className="flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-blue-50/50 px-3 py-1 text-blue-600 backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    Creation Hub
                  </div>
                  <span>/ Submissions / Nueva</span>
                </div>
                <h1 className="bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                  Nueva Submission
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">
                  Workspace de creación inteligente. Complete los parámetros requeridos para establecer el nuevo ecosistema educativo.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-amber-200/50 bg-amber-50/80 px-4 py-2 shadow-sm backdrop-blur-md">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                </div>
                <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">Borrador</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <form
          onSubmit={handleSubmit(() => toast.success("Submission enviada"))}
          className="mt-8 grid gap-8 lg:grid-cols-12"
        >
          <div className="space-y-6 lg:col-span-8">
            <RevealOnScroll as="section" viewportAmount={0.18} className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shadow-inner">
                  <Box className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Información base</h2>
              </div>
              <div className="mt-6">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Materia</label>
                <Select className="h-12 border-white/60 bg-white/60 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10" {...register("subject")}>
                  <option value="">Selecciona materia</option>
                  <option>Matematicas Financieras</option>
                  <option>Analitica de Datos</option>
                </Select>
              </div>
            </RevealOnScroll>

            <RevealOnScroll as="section" viewportAmount={0.18} className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 shadow-inner">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Resumen académico</h2>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resumen</label>
                  <span className="text-[10px] font-medium text-slate-400">MÍN. 20 CARACTERES</span>
                </div>
                <Textarea className="resize-none border-white/60 bg-white/60 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 focus:border-indigo-500/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" rows={5} placeholder="Objetivos, unidades y expectativas del ecosistema..." {...register("summary")} />
              </div>
            </RevealOnScroll>

            <RevealOnScroll as="section" viewportAmount={0.18} className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-600 shadow-inner">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Material fuente</h2>
              </div>
              <div className="mt-6">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Enlace verificable</label>
                <Input className="h-12 border-white/60 bg-white/60 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 focus:border-cyan-500/50 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" placeholder="https://drive.google.com/..." {...register("source")} />
              </div>
            </RevealOnScroll>

            <RevealOnScroll as="section" viewportAmount={0.18} className="relative overflow-hidden rounded-[2rem] border border-blue-200/50 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 p-6 shadow-inner sm:p-8">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />
              <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900">Revisión previa al envío</h2>
                  <p className="mt-2 max-w-md text-sm text-blue-800/70">
                    Confirma que el resumen y el enlace son correctos. Tras enviar, el proceso entra en pipeline automatizado como <span className="font-semibold text-blue-900">Submitted</span>.
                  </p>
                </div>
                <Button type="submit" className="group relative overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgb(37,99,235,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgb(37,99,235,0.5)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Enviar submission
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll as="aside" viewportAmount={0.15} className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Progress Card */}
              <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">Estado</h3>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200/50 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-4 text-xs font-medium text-slate-500">
                  <span className="font-bold text-slate-700">{completedCount} de 3</span> parámetros completados
                </p>
              </div>

              {/* Checklist Card */}
              <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">Guía de Validación</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Asegúrate de cumplir con los criterios para una revisión acelerada por parte del sistema.
                </p>
                <ul className="mt-6 space-y-4">
                  {checklist.map((line, i) => {
                    const isChecked = i === 0 ? !!formValues.subject : (i === 1 ? !!(formValues.summary && formValues.summary.length >= 20) : !!(formValues.source && formValues.source.includes("http")));
                    
                    return (
                      <li key={line} className="group flex items-start gap-3">
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${isChecked ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'bg-slate-100 text-slate-400 shadow-inner group-hover:bg-slate-200'}`}>
                          {isChecked ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                          )}
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${isChecked ? 'font-medium text-slate-700' : 'text-slate-500 group-hover:text-slate-700'}`}>
                          {line}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </RevealOnScroll>
        </form>
      </div>
    </div>
  );
}
