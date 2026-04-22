import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3">
      {icon ? (
        <div className="flex items-start justify-between">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-slate-50 to-slate-100 text-slate-600 ring-1 ring-slate-200/60">
            {icon}
          </div>
        </div>
      ) : null}
      <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-500">{title}</p>
    </Card>
  );
}
