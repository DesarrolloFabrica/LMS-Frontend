import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--btn-offset,#f8fafc)]";

const variantClass: Record<ButtonVariant, string> = {
  primary: cn(
    "rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white",
    "shadow-md shadow-blue-600/25 ring-1 ring-blue-500/20",
    "transition-[transform,box-shadow,opacity,filter] duration-200",
    "hover:shadow-lg hover:shadow-blue-600/35 hover:brightness-[1.03]",
    "active:scale-[0.98]",
    focusRing,
  ),
  ghost: cn(
    "rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-inner backdrop-blur-sm",
    "transition-[background-color,box-shadow,transform] duration-200",
    "hover:border-white/30 hover:bg-white/12 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
    "active:scale-[0.98]",
    "focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/80",
  ),
  outline: cn(
    "rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm",
    "transition-[border-color,box-shadow,transform,background-color] duration-200",
    "hover:border-blue-200/90 hover:bg-slate-50/90 hover:shadow-[0_8px_28px_-12px_rgba(37,99,235,0.12)]",
    "active:scale-[0.98]",
    focusRing,
  ),
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(variantClass[variant], className)} {...props} />;
}
