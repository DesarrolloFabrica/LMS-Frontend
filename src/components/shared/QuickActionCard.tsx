import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function QuickActionCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="group rounded-2xl border-dashed border-slate-300/70 bg-linear-to-br from-white via-white to-slate-50/90 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-white shadow-lg transition group-hover:scale-105">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Card>
  );
}
