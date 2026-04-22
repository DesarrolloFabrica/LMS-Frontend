import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function FilterBar() {
  return (
    <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <div className="flex items-center gap-2 text-slate-500">
        <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filtros</span>
      </div>
      <div className="grid flex-1 gap-3 sm:grid-cols-3">
        <Input placeholder="Buscar materia o código" />
        <Input placeholder="Estado" />
        <Input placeholder="Prioridad" />
      </div>
    </div>
  );
}
