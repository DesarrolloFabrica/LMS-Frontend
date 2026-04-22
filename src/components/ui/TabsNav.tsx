import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

export function TabsNav({ items }: { items: { label: string; to: string }[] }) {
  return (
    <nav className="flex gap-2">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => cn("rounded-full px-3 py-1 text-sm", isActive ? "bg-slate-900 text-white" : "bg-white text-slate-700")}>{item.label}</NavLink>
      ))}
    </nav>
  );
}

