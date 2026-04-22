import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const focusRing =
  "focus:border-blue-500/80 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:ring-offset-0";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full cursor-pointer rounded-xl border border-slate-200/95 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-900/5 transition-[border-color,box-shadow] duration-200",
        "hover:border-slate-300/90",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
