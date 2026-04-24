import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Archive, Inbox, Sparkles, Cpu, Workflow } from "lucide-react";

import { DASHBOARD_SECTION_IDS } from "@/lib/dashboardSectionIds";
import { reducedStaggerContainer } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";


const pillars: {
  step: string;
  title: string;
  body: string;
  icon: LucideIcon;
  tag: string;
}[] = [
  {
    step: "01",
    title: "Ingesta de contenido",
    body: "Alta de materia, resumen y material base con enlace fuente. Trazabilidad absoluta desde el primer registro del sistema.",
    icon: Inbox,
    tag: "DATA_INPUT",
  },
  {
    step: "02",
    title: "Revisión editorial",
    body: "Validación académica, QA y feedback técnico en un solo hilo. Confirma calidad antes de liberar al pipeline principal.",
    icon: Sparkles,
    tag: "QUALITY_ASSURANCE",
  },
  {
    step: "03",
    title: "Finalización y cierre",
    body: "Sincronización con Drive y LMS. Cierre de ciclo con documentación técnica lista para auditoría y exportación.",
    icon: Archive,
    tag: "SYSTEM_CLOSE",
  },
];

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FlowExplanationSection() {
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion() === true;
  const containerVariants = reducedStaggerContainer(reducedMotion);

  return (
    <section
      id={DASHBOARD_SECTION_IDS.flow}
      className="relative scroll-mt-28 overflow-hidden border-y border-slate-200/40 bg-white py-20 sm:scroll-mt-32 sm:py-28 lg:py-32"
    >
      {/* Fondo Tecnológico con Cuadrícula y Orbes */}
      {/* Fondo de Estrellas Fugaces y Destellos Impactantes (Modo Claro) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
        {/* Destellos de Energía (Más notables) */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? "#60a5fa" : "#818cf8", // Blue and Indigo
              boxShadow: "0 0 12px rgba(96, 165, 250, 0.6)",
            }}
            animate={{
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 2.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Estrellas Fugaces de Alto Impacto (Cayendo desde arriba) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`shooting-streak-${i}`}
            className="absolute w-[2px] h-[180px] bg-linear-to-b from-blue-500 via-indigo-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            style={{
              top: `-20%`,
              left: `${Math.random() * 100}%`,
              rotate: "-15deg",
            }}
            animate={{
              top: ["-20%", "130%"],
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`], // Movimiento diagonal suave
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}

        {/* Efecto de "Cometa" ocasional en color Ámbar (Cayendo) */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`amber-streak-${i}`}
            className="absolute w-[3px] h-[200px] bg-linear-to-b from-amber-400 to-transparent shadow-[0_0_20px_rgba(251,191,36,0.5)]"
            style={{
              top: `-30%`,
              left: `${Math.random() * 100}%`,
              rotate: "5deg",
            }}
            animate={{
              top: ["-30%", "140%"],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
              delay: 10 + Math.random() * 15,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(59,130,246,0.06),transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center lg:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-2 shadow-sm backdrop-blur-xl">
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]">
              <Workflow className="h-3 w-3 text-white" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Protocolo de Operación</p>
          </div>

          <h2 className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            Pensado para tu siguiente <br />
            <span className="text-blue-600">etapa operativa</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
            Estandarización enterprise con la agilidad de un equipo de alto rendimiento. Tres módulos diseñados para eliminar la fricción técnica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Lado Izquierdo: Animación Interactiva */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Efecto de Brillo dinámico */}
              <div className={cn(
                "absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full transition-all duration-700",
                isHovered ? "scale-110 opacity-100" : "scale-90 opacity-0"
              )} />
              
              <div className="relative rounded-[2.5rem] border border-blue-100 bg-white/40 p-6 shadow-2xl backdrop-blur-3xl transition-all duration-500 group-hover:border-blue-400 group-hover:shadow-blue-500/10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interactive Simulator</span>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all duration-500",
                    isHovered ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-100 border-slate-200 text-slate-500"
                  )}>
                    {isHovered ? "SYNC_ACTIVE" : "STANDBY"}
                  </span>
                </div>

                <div className="aspect -square w-full">
                  <DotLottieReact
                    src="/videos/Web%20Development.lottie"
                    loop
                    autoplay
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600"
                      initial={{ width: "30%" }}
                      animate={{ width: isHovered ? "100%" : "30%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 text-center italic">
                    {isHovered ? "Simulando carga de arquitectura en tiempo real..." : "Pasa el cursor para inicializar simulador técnico"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lado Derecho: Pilares */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-6 h-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.step}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }
                }}
                className="group relative flex-1"
              >
                {/* Efecto de brillo de fondo en hover */}
                <div className="absolute -inset-2 rounded-[2rem] bg-linear-to-br from-blue-500/10 to-indigo-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className={cn(
                  "relative flex h-full items-center gap-6 overflow-hidden rounded-[2rem] border bg-white/40 p-6 shadow-sm transition-all duration-500 backdrop-blur-3xl",
                  "border-slate-200/60 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10"
                )}>
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-white shadow-lg ring-1 ring-slate-100 transition-all duration-500 group-hover:scale-110 group-hover:shadow-blue-500/20 group-hover:ring-blue-200">
                    <Icon className="h-7 w-7 text-blue-600" strokeWidth={2} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[9px] font-bold text-blue-600/70 uppercase tracking-widest">{pillar.tag}</span>
                      <div className="h-px w-8 bg-slate-100" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-[13px] font-medium leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors">
                      {pillar.body}
                    </p>
                  </div>

                  <div className="ml-auto hidden sm:block">
                    <span className="font-mono text-[14px] font-black text-slate-100 transition-colors group-hover:text-blue-100">
                      {pillar.step}
                    </span>
                  </div>

                  {/* Efecto de escaneo al pasar el mouse */}
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div 
                      className="absolute inset-x-0 h-[1px] bg-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Detalle decorativo inferior */}
        <div className="mt-20 flex justify-center lg:mt-28">
          <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/50 px-6 py-2 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-blue-100">
            <Cpu className="h-4 w-4 text-blue-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Arquitectura de Flujo Operativo 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
