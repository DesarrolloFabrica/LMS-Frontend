import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({ email: z.email(), password: z.string().min(6) });
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <RevealOnScroll viewportAmount={0.4} className="space-y-5">
      <form className="space-y-4" onSubmit={handleSubmit(() => navigate("/dashboard"))}>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Iniciar sesión</h1>
        <Input placeholder="correo@carga.com" autoComplete="email" {...register("email")} />
        {errors.email ? <p className="text-xs text-red-500">Email inválido</p> : null}
        <Input type="password" placeholder="••••••" autoComplete="current-password" {...register("password")} />
        {errors.password ? <p className="text-xs text-red-500">Mínimo 6 caracteres</p> : null}
        <Button type="submit" className="w-full">
          Entrar al dashboard
        </Button>
      </form>
    </RevealOnScroll>
  );
}
