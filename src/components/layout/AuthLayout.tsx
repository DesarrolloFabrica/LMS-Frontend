import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f8fbff] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_38%_at_50%_-8%,rgba(37,99,235,0.12),transparent_65%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_16%,rgba(56,189,248,0.16),transparent_30%)]" aria-hidden />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}

