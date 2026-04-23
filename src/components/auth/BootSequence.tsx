import { motion } from "framer-motion";
import { BOOT_SUBSTATES } from "@/lib/authExperience";
import { cn } from "@/lib/cn";

type BootSequenceProps = {
  substateIndex: number;
  reducedMotion: boolean;
};

export function BootSequence({ substateIndex, reducedMotion }: BootSequenceProps) {
  const activeNode = substateIndex % 4;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(3px)" }}
      transition={{ duration: reducedMotion ? 0.12 : 0.45 }}
      className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-6"
    >
      <div className="auth-grid absolute inset-0 opacity-80" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_35%_at_50%_40%,rgba(37,99,235,0.13),transparent_70%)]" aria-hidden />
      <div className="absolute inset-0 bg-linear-to-b from-white via-slate-50/90 to-slate-100" aria-hidden />

      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-xs font-black tracking-tight text-white">
            CL
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Carga LMS</p>
            <p className="text-sm font-semibold text-slate-900">Academic Operating System</p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">Inicializando entorno academico</h1>
        <p className="mt-2 text-sm text-slate-600">Activando modulos esenciales para abrir tu workspace operativo.</p>

        <div className="mt-8 space-y-4">
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="absolute left-0 top-0 h-full bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-500"
              initial={{ width: "14%" }}
              animate={{ width: ["14%", "42%", "71%", "100%"] }}
              transition={{ duration: reducedMotion ? 0.45 : 1.9, ease: "easeInOut" }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-600">{BOOT_SUBSTATES[substateIndex % BOOT_SUBSTATES.length]}</p>
            <div className="flex items-center gap-2" aria-hidden>
              {[0, 1, 2, 3].map((node) => (
                <motion.span
                  key={node}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full border border-blue-300/70 bg-white",
                    node <= activeNode ? "shadow-[0_0_14px_rgba(59,130,246,0.35)]" : "",
                  )}
                  animate={{
                    scale: node === activeNode ? 1.12 : 1,
                    opacity: node <= activeNode ? 1 : 0.42,
                    backgroundColor: node <= activeNode ? "rgb(96 165 250)" : "rgb(255 255 255)",
                  }}
                  transition={{ duration: reducedMotion ? 0.08 : 0.24 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
