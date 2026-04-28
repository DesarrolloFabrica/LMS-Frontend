import type { RequestStatus } from "@/types";
import { useRequestsStore } from "@/store/requestsStore";
import { useState } from "react";

export function CoordinatorRequestsSection() {
  const requests = useRequestsStore((state) => state.requests);
  const setRequestInReview = useRequestsStore((state) => state.setRequestInReview);
  const approveRequest = useRequestsStore((state) => state.approveRequest);
  const rejectRequest = useRequestsStore((state) => state.rejectRequest);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusStyles: Record<RequestStatus, string> = {
    pendiente: "bg-amber-50 text-amber-700 border-amber-100",
    en_revision: "bg-blue-50 text-blue-700 border-blue-100",
    aprobada: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rechazada: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const statusLabel: Record<RequestStatus, string> = {
    pendiente: "Pendiente",
    en_revision: "En revisión",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
  };

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-50/50 font-sans">
      {/* Background Decorativo - Glassmorphism effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-blue-200/20 to-transparent blur-[120px]" />
        <div className="absolute -right-[5%] top-[20%] h-[35rem] w-[35rem] rounded-full bg-gradient-to-tr from-indigo-200/20 to-transparent blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-24">
        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 px-3 py-1 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
              Panel de Control
            </span>
          </div>
          
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
            Solicitudes <span className="text-slate-400 font-light">Recibidas</span>
          </h2>
          <p className="max-w-xl text-slate-500 leading-relaxed">
            Gestión centralizada de requerimientos. Revisa, aprueba o rechaza las solicitudes enviadas por los equipos GIF.
          </p>
        </header>

        {/* Content Area */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 mb-4 flex items-center justify-center text-slate-400">∅</div>
              <p className="text-slate-500 font-medium">Bandeja de entrada vacía</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => {
                const isExpanded = expandedId === request.id;

                return (
                  <article 
                    key={request.id} 
                    className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 ${
                      isExpanded ? "border-blue-200 ring-1 ring-blue-50" : "border-slate-200"
                    }`}
                  >
                    {/* Header Item */}
                    <div 
                      onClick={() => toggleExpand(request.id)}
                      className="flex cursor-pointer items-center justify-between p-5 sm:px-6"
                    >
                      <div className="flex flex-col space-y-1">
                        <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-wide">
                          {request.subject}
                        </h3>
                        <span className="text-xs text-slate-400">{request.createdAt}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[request.status]}`}>
                          {statusLabel[request.status]}
                        </span>
                        <div className={`transition-transform duration-200 text-slate-300 ${isExpanded ? "rotate-180" : ""}`}>
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Content expanded */}
                    {isExpanded && (
                      <div className="border-t border-slate-50 bg-slate-50/30 p-6 pt-5">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Descripción</span>
                              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{request.summary}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Documentación</span>
                              <a
                                href={request.source}
                                target="_blank"
                                className="mt-1 flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Acceder al Drive 
                                <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between space-y-4 border-l border-slate-100 pl-6">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Solicitante</span>
                              <div className="mt-1 flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                  {request.createdByName.charAt(0)}
                                </div>
                                <p className="text-sm text-slate-700 font-medium">
                                  {request.createdByName} <span className="text-slate-400 font-normal ml-1">({request.createdByRole})</span>
                                </p>
                              </div>
                            </div>

                            {/* Actions Group */}
                            <div className="flex flex-wrap gap-2 pt-4">
                              <button 
                                onClick={() => setRequestInReview(request.id)}
                                className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 active:scale-95"
                              >
                                Revisar
                              </button>
                              <button 
                                onClick={() => approveRequest(request.id)}
                                className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                              >
                                Aprobar
                              </button>
                              <button 
                                onClick={() => rejectRequest(request.id)}
                                className="flex-1 rounded-lg border border-rose-100 bg-white px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 active:scale-95"
                              >
                                Rechazar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}