import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AuthProgressStep } from "@/lib/authExperience";
import { AUTH_PROGRESS_MESSAGES } from "@/lib/authExperience";

const schema = z.object({ email: z.email(), password: z.string().min(6) });
type FormData = z.infer<typeof schema>;

type AccessPanelProps = {
  disabled: boolean;
  isAuthenticating: boolean;
  progressStep: AuthProgressStep;
  reducedMotion: boolean;
  onSubmitAccess: () => void;
  onInteract: () => void;
};

export function AccessPanel({
  disabled,
  isAuthenticating,
  progressStep,
  reducedMotion,
  onSubmitAccess,
  onInteract,
}: AccessPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <motion.section
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
      transition={{ duration: reducedMotion ? 0.08 : 0.42 }}
      className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-7 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.35)] sm:p-9"
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/40 via-transparent to-violet-50/40" aria-hidden />

      <form
        className="relative z-10 space-y-5"
        onSubmit={handleSubmit(() => onSubmitAccess())}
        onFocus={onInteract}
        onChange={onInteract}
      >
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Accede a tu entorno</h1>
          <p className="text-sm text-slate-600">Inicia sesion para abrir tu espacio operativo en Carga LMS.</p>
        </header>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Correo institucional
          </label>
          <Input
            id="email"
            placeholder="correo@carga.com"
            autoComplete="email"
            disabled={disabled}
            {...register("email")}
          />
          {errors.email ? <p className="text-xs text-rose-500">Ingresa un correo valido.</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Contrasena
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••"
            autoComplete="current-password"
            disabled={disabled}
            {...register("password")}
          />
          {errors.password ? <p className="text-xs text-rose-500">Minimo 6 caracteres.</p> : null}
        </div>

        <Button type="submit" className="group relative mt-1 w-full" disabled={disabled}>
          <span className="relative z-10">{isAuthenticating ? AUTH_PROGRESS_MESSAGES[progressStep] : "Acceder al sistema"}</span>
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </Button>

        <p className="text-center text-xs text-slate-500">Acceso institucional protegido para operaciones editoriales.</p>
      </form>
    </motion.section>
  );
}
