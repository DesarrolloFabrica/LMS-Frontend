import { Outlet } from "react-router-dom";

export function AuthLayout() { return <div className="grid min-h-screen place-items-center bg-slate-950 p-6"><div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white md:grid-cols-2"><section className="hidden bg-linear-to-br from-blue-700 to-violet-700 p-8 text-white md:block"><h2 className="text-3xl font-semibold">Carga LMS</h2><p className="mt-3 text-sm text-white/80">Operaciones de contenido, en un solo workspace.</p></section><section className="p-8"><Outlet /></section></div></div>; }

