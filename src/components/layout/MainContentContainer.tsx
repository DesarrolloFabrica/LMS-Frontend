import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Ancho máximo y padding horizontal del producto.
 * El hero full-bleed vive fuera de este contenedor.
 */
export function MainContentContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[min(1280px,calc(100%-2rem))] px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10",
        className,
      )}
      {...props}
    />
  );
}
