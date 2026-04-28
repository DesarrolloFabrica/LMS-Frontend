import type { RequestStatus } from "@/types";

import { useRequestsStore } from "@/store/requestsStore";

import { useState } from "react";



export function CoordinatorRequestsSection() {

  const requests = useRequestsStore((state) => state.requests);

  const setRequestInReview = useRequestsStore((state) => state.setRequestInReview);

  const approveRequest = useRequestsStore((state) => state.approveRequest);

  const rejectRequest = useRequestsStore((state) => state.rejectRequest);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<RequestStatus | "todas">("todas");

  const filteredRequests =
    statusFilter === "todas"
      ? requests
      : requests.filter((request) => request.status === statusFilter);



  const statusStyles: Record<RequestStatus, string> = {

    pendiente: "bg-amber-50 text-amber-700",

    en_revision: "bg-blue-50 text-blue-700",

    aprobada: "bg-emerald-50 text-emerald-700",

    rechazada: "bg-rose-50 text-rose-700",

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

    <section className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFA]">

      {/* Fondo visual de la sección */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] rounded-full bg-blue-300/20 blur-[120px]" />

        <div className="absolute -right-[5%] top-[20%] h-[35rem] w-[35rem] rounded-full bg-indigo-300/20 blur-[100px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      </div>



      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-28 sm:px-6 sm:pt-32">

        {/* Encabezado de la sección */}

        <div className="mb-6 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">

            Panel de coordinación

          </p>



          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">

            Solicitudes recibidas

          </h2>



          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">

            Aquí aparecerán las solicitudes creadas por los GIF para que el coordinador pueda revisarlas, hacer seguimiento y gestionar su estado.

          </p>

        </div>



        {/* Lista real de solicitudes compartidas por Zustand entre GIF y Coordinador */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          {filteredRequests.length === 0 ? (

            <p className="text-sm text-slate-500">
  No hay solicitudes para este filtro.
</p>

          ) : (


            <div className="grid gap-4">

              {/* Filtro de solicitudes por estado */}
              <div className="mb-5 flex flex-wrap gap-2">
                {[
                  { value: "todas", label: "Todas" },
                  { value: "en_revision", label: "En revisión" },
                  { value: "aprobada", label: "Aprobada" },
                  { value: "rechazada", label: "Rechazada" },
                ].map((option) => {
                  const isActive = statusFilter === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatusFilter(option.value as RequestStatus | "todas")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {filteredRequests.map((request) => {

                const isExpanded = expandedId === request.id;



                return (

                  <article key={request.id} className="...">



                    {/* 🔹 HEADER RESUMIDO */}

                    <div className="flex items-center justify-between">

                      <h3 className="font-semibold text-gray-900">

                        {request.subject}

                      </h3>



                      <span className={statusStyles[request.status]}>

                        {statusLabel[request.status]}

                      </span>

                    </div>



                    {/* 🔹 BOTÓN TOGGLE */}

                    <button

                      onClick={() => toggleExpand(request.id)}

                      className="mt-2 text-sm text-blue-600 hover:underline"

                    >

                      {isExpanded ? "Ocultar detalles ▲" : "Ver detalles ▼"}

                    </button>



                    {/* 🔻 CONTENIDO EXPANDIDO */}

                    {isExpanded && (

                      <div className="mt-4 space-y-2 text-sm text-gray-600">



                        <p>

                          <strong>Drive:</strong>{" "}

                          <a

                            href={request.source}

                            target="_blank"

                            className="text-blue-600 underline"

                          >

                            Ver enlace

                          </a>

                        </p>



                        <p><strong>Descripción:</strong> {request.summary}</p>

                        <p><strong>Creada:</strong> {request.createdAt}</p>

                        <p>

                          <strong>Creada por:</strong> {request.createdByName} ({request.createdByRole})

                        </p>



                        {/* 🔹 ACCIONES */}

                        <div className="flex gap-2 pt-2">

                          <button onClick={() => setRequestInReview(request.id)}>

                            Marcar en revisión

                          </button>



                          <button onClick={() => approveRequest(request.id)}>

                            Aprobar

                          </button>



                          <button onClick={() => rejectRequest(request.id)}>

                            Rechazar

                          </button>

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