import { motion } from "framer-motion";
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
        <div className="relative flex items-center justify-center">
          <motion.span
            animate={{ 
              boxShadow: highlighted ? ["0 0 10px rgba(99,102,241,0.4)", "0 0 20px rgba(99,102,241,0.6)", "0 0 10px rgba(99,102,241,0.4)"] : "none" 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn(
              "z-10 h-3 w-3 rounded-full border-2 border-white transition-all duration-300",
              highlighted ? "bg-indigo-600 scale-125" : "bg-slate-300 group-hover:bg-indigo-400"
            )}
            aria-hidden
          />
        </div>
        {!isLast ? (
          <div
            className="mt-2 w-[1px] flex-1 min-h-[3rem] bg-linear-to-b from-slate-200 via-slate-100 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>
      <motion.div
        whileHover={{ x: 4, y: -2 }}
        className={cn(
          "min-w-0 flex-1 rounded-2xl border p-5 transition-all duration-300",
          highlighted
            ? "border-indigo-100 bg-white shadow-lg ring-1 ring-indigo-50/50"
            : "border-slate-100 bg-white/50 hover:border-indigo-200 hover:bg-white hover:shadow-md",
        )}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className={cn("rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest", typeTone)}>
              {type}
            </Badge>
            {actor && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                {actor}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] font-black tabular-nums text-slate-400">
            <span>{at}</span>
            <span className="h-1 w-1 rounded-full bg-slate-200" />
            <span className="text-indigo-500">{time}</span>
          </div>
        </div>

        <p className={cn(
          "text-sm font-bold leading-relaxed tracking-tight transition-colors",
          highlighted ? "text-slate-900" : "text-slate-700"
        )}>
          {text}
        </p>

        {linkedStatus && (
          <div className="mt-4 flex items-center gap-3 border-t border-slate-50 pt-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Linked Status</span>
            <StatusPill status={linkedStatus} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
