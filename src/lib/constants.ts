export const STATUS_COLORS: Record<string, string> = {
  Submitted: "bg-sky-50/90 text-sky-800 ring-1 ring-inset ring-sky-200/60",
  "In Review": "bg-violet-50/90 text-violet-800 ring-1 ring-inset ring-violet-200/60",
  "Requires Finalization":
    "bg-amber-50/90 text-amber-900 ring-1 ring-inset ring-amber-200/50",
  Completed: "bg-emerald-50/90 text-emerald-800 ring-1 ring-inset ring-emerald-200/60",
};

export const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-rose-50 text-rose-800 ring-1 ring-rose-200/50",
  Medium: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/60",
  Low: "bg-slate-50 text-slate-600 ring-1 ring-slate-200/40",
};

export const PIPELINE_COLUMN_ACCENT: Record<string, string> = {
  Submitted: "from-sky-500 to-sky-400",
  "In Review": "from-violet-500 to-violet-400",
  "Requires Finalization": "from-amber-500 to-amber-400",
  Completed: "from-emerald-500 to-emerald-400",
};
