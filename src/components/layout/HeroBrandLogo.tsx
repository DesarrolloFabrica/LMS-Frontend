import { cn } from "@/lib/cn";

/** Marca centrada bajo el titular (sustituible por `public` logo). */
export function HeroBrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 52"
      className={cn("mx-auto h-11 w-auto sm:h-12", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2" y="2" width="48" height="48" rx="14" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
      <path
        d="M18 38V14h8c7 0 11 4.2 11 10.2 0 6-4 10-11 10h-8Zm8-8.2c3.2 0 5-1.7 5-4.5 0-2.8-1.8-4.5-5-4.5h-2v9h2Z"
        fill="currentColor"
        fillOpacity="0.92"
      />
      <text
        x="62"
        y="35"
        fill="currentColor"
        fillOpacity="0.95"
        className="font-sans text-[24px] font-semibold tracking-[0.18em]"
      >
        CARGA
      </text>
      <text
        x="168"
        y="35"
        fill="currentColor"
        fillOpacity="0.45"
        className="font-sans text-[24px] font-medium tracking-[0.32em]"
      >
        LMS
      </text>
    </svg>
  );
}
