import { Outlet, useLocation } from "react-router-dom";
import { TopNavigation } from "@/components/layout/TopNavigation";

export function MainLayout() {
  const { pathname } = useLocation();
  const isDashboardHero = pathname === "/dashboard";

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#f1f5f9] text-slate-900">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-6%,rgba(37,99,235,0.055),transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-[min(520px,50vh)] w-[min(520px,45vw)] rounded-full bg-violet-200/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-sky-200/12 blur-3xl"
        aria-hidden
      />
      <div className="relative z-10">
        {!isDashboardHero ? <TopNavigation variant="solid" /> : null}
        <main className="w-full">
          <Outlet />
        </main>
        {isDashboardHero ? (
          <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
            <div className="pointer-events-auto">
              <TopNavigation variant="glass" />
            </div>
          </header>
        ) : null}
      </div>
    </div>
  );
}
