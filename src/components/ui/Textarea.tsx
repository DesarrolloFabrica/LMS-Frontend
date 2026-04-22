import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const focusRing =
  "focus:border-blue-500/80 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:ring-offset-0";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-slate-200/95 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-900/5 transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400",
        "hover:border-slate-300/90",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
