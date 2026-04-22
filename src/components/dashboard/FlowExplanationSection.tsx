import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Archive, Inbox, Sparkles } from "lucide-react";
import { DASHBOARD_SECTION_IDS } from "@/lib/dashboardSectionIds";
import { reducedStaggerContainer } from "@/lib/animations";
import { cn } from "@/lib/cn";

const pillars: {
  step: string;
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    step: "01",
    title: "Ingesta de contenido",
    body: "Alta de materia, resumen y material base con enlace fuente. Inicia el flujo editorial con trazabilidad desde el primer registro.",
    icon: Inbox,
  },
  {
    step: "02",
    title: "Revisión editorial",
    body: "Validación académica, QA y comentarios en un solo hilo. Confirma calidad antes de liberar la siguiente etapa del pipeline.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Finalización y cierre",
    body: "Links LMS y Drive, observaciones finales y archivo del proceso. Cierra el ciclo con documentación lista para auditoría.",
    icon: Archive,
  },
];

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headerVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export function FlowExplanationSection() {
  const reducedMotion = useReducedMotion() === true;
  const containerVariants = reducedStaggerContainer(reducedMotion);
  const staggerChild = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.01 } } }
    : itemVariants;

  return (
    <section
      id={DASHBOARD_SECTION_IDS.flow}
      className="relative scroll-mt-28 overflow-hidden border-y border-slate-200/50 bg-[#fafcff] pb-16 pt-12 sm:scroll-mt-32 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-blue-100/60 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -left-32 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-100/50 blur-[100px]" aria-hidden />

      <div className="relative z-1 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <div className="relative flex h-2 w-2 items-center justify-center">
              {!reducedMotion ? (
                <div className="absolute h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
              ) : null}
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">El flujo de Carga LMS</p>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Pensado para tu siguiente{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              etapa operativa
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Legitimidad de un panel enterprise, con la agilidad de un equipo editorial. Tres pilares claros, sin scroll
            forzado: solo contexto y acción.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.step}
                variants={staggerChild}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white p-8 transition-all duration-500",
                  "border border-slate-200/80 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.05)]",
                  "hover:border-blue-200 hover:shadow-[0_20px_48px_-12px_rgba(37,99,235,0.12)] hover:ring-1 hover:ring-blue-100",
                )}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-blue-500/0 to-transparent transition-all duration-500 group-hover:via-blue-400/40" />

                <div className="mb-8 flex items-start justify-between">
                  <div
                    className={cn(
                      "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500",
                      "border border-blue-100 bg-linear-to-br from-blue-50 to-white text-blue-600 shadow-[0_4px_12px_-4px_rgba(37,99,235,0.15)]",
                      "group-hover:scale-110 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:shadow-[0_8px_24px_-6px_rgba(37,99,235,0.25)]",
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>

                  <div className="flex items-center rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50/50">
                    <span className="font-mono text-xs font-semibold text-slate-400 transition-colors group-hover:text-blue-600">
                      // {pillar.step}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-950">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{pillar.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
