import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type LoginVisualPaneProps = {
  energyLevel: number;
  reducedMotion: boolean;
};

const bulletPoints = [
  "Controla tu flujo academico en un solo entorno.",
  "Revision, seguimiento y cierre con visibilidad total.",
  "Accede a tu espacio operativo con continuidad.",
];

export function LoginVisualPane({ energyLevel, reducedMotion }: LoginVisualPaneProps) {
  return (
    <aside className="relative hidden overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)] backdrop-blur-xl md:block lg:p-10">
      <div className="auth-grid absolute inset-0 opacity-70" aria-hidden />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: 0.12 + Math.min(energyLevel * 0.08, 0.18) }}
        transition={{ duration: reducedMotion ? 0.1 : 0.35 }}
        style={{
          background:
            "radial-gradient(ellipse 48% 30% at 28% 24%, rgba(99,102,241,0.25), transparent 72%), radial-gradient(ellipse 40% 32% at 78% 62%, rgba(14,165,233,0.2), transparent 74%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500">Workspace Access</p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">
            Controla tu operacion academica en un entorno premium
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
            Carga LMS integra visibilidad, seguimiento editorial y activacion operativa en una experiencia limpia, moderna y
            enfocada en productividad.
          </p>
        </div>

        <ul className="space-y-4">
          {bulletPoints.map((item, index) => (
            <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
              <motion.span
                className={cn("mt-1.5 h-2.5 w-2.5 rounded-full border border-blue-200", energyLevel > index ? "bg-blue-400" : "bg-white")}
                animate={{
                  boxShadow: energyLevel > index ? "0 0 14px rgba(59,130,246,0.45)" : "0 0 0 rgba(0,0,0,0)",
                  opacity: energyLevel > index ? 1 : 0.5,
                }}
                transition={{ duration: reducedMotion ? 0.08 : 0.3 }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
