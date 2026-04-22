import { Badge } from "@/components/ui/Badge";
import { StatusPill } from "@/components/shared/StatusPill";
import { cn } from "@/lib/cn";

export function ActivityFeedItem({
  type,
  text,
  at,
  time,
  actor,
  linkedStatus,
  isLast,
  highlighted,
}: {
  type: string;
  text: string;
  at: string;
  time?: string;
  actor?: string;
  linkedStatus?: string;
  isLast?: boolean;
  highlighted?: boolean;
}) {
  const typeTone =
    type === "Review"
      ? "bg-violet-600 text-white ring-0"
      : type === "Submission"
        ? "bg-blue-600 text-white ring-0"
        : type === "Finalization"
          ? "bg-amber-600 text-white ring-0"
          : type === "Export"
            ? "bg-emerald-700 text-white ring-0"
            : type === "Comment"
              ? "bg-slate-700 text-white ring-0"
              : "bg-slate-800 text-white ring-0";

  return (
    <div className="flex gap-4">
      <div className="flex w-9 shrink-0 flex-col items-center pt-1">
        <span
          className={cn(
            "z-1 h-2.5 w-2.5 rounded-full border-2 border-[#f1f5f9] bg-linear-to-br from-blue-600 to-indigo-600 shadow-md ring-2 ring-blue-100/80",
            highlighted && "h-3 w-3 ring-4 ring-blue-200/60",
          )}
          aria-hidden
        />
        {!isLast ? (
          <div
            className="mt-2 w-px flex-1 min-h-[1.5rem] bg-linear-to-b from-slate-300/80 to-slate-200/30"
            aria-hidden
          />
        ) : null}
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 rounded-2xl border bg-white/95 p-4 shadow-sm",
          highlighted
            ? "border-blue-200/80 shadow-[0_12px_40px_-24px_rgba(37,99,235,0.2)] ring-1 ring-blue-100/60"
            : "border-slate-200/50",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Badge className={cn(typeTone)}>{type}</Badge>
          {actor ? <span className="text-xs font-semibold text-slate-600">{actor}</span> : null}
          {actor && time ? (
            <span className="text-slate-300" aria-hidden>
              ·
            </span>
          ) : null}
          {time ? (
            <span className="font-mono text-[11px] font-semibold tabular-nums text-slate-500">{time}</span>
          ) : null}
        </div>
        <p className={cn("mt-2 text-sm font-medium leading-relaxed text-slate-800", highlighted && "text-[15px]")}>
          {text}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{at}</span>
          {linkedStatus ? <StatusPill status={linkedStatus} /> : null}
        </div>
      </div>
    </div>
  );
}
