import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  tone?: "default" | "dark";
};

export function SearchInput({ className, tone = "default", ...props }: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
          tone === "dark" ? "text-white/45" : "text-slate-400",
        )}
      />
      <Input
        className={cn(
          "pl-9",
          tone === "dark" &&
            "border-white/15 bg-white/10 text-white placeholder:text-white/45 focus:border-white/40 focus:ring-2 focus:ring-white/25",
          className,
        )}
        {...props}
      />
    </div>
  );
}
