import { Badge } from "@/components/ui/Badge";
import { STATUS_COLORS } from "@/lib/constants";

export function StatusPill({ status }: { status: string }) {
  return (
    <Badge
      className={
        STATUS_COLORS[status] ?? "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200/80"
      }
    >
      {status}
    </Badge>
  );
}
