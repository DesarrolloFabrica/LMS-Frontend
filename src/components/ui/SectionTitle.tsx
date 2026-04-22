import { cn } from "@/lib/cn";

export function SectionTitle({
  title,
  subtitle,
  size = "default",
}: {
  title: string;
  subtitle?: string;
  size?: "default" | "editorial";
}) {
  return (
    <div className={cn(size === "editorial" ? "mb-3" : "mb-1")}>
      <h2
        className={cn(
          "font-semibold tracking-tight text-slate-900",
          size === "editorial" ? "text-3xl sm:text-[2rem] leading-tight" : "text-2xl",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("mt-2 text-slate-600", size === "editorial" ? "max-w-2xl text-base" : "text-sm")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
