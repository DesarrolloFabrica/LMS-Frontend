import type { RequestStatus } from "@/types";
import { useRequestsStore } from "@/store/requestsStore";
import { useState } from "react";
export function CoordinatorRequestsSection() {

  const requests = useRequestsStore((state) => state.requests);
  const approveRequest = useRequestsStore((state) => state.approveRequest);
  const rejectRequest = useRequestsStore((state) => state.rejectRequest);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "todas">("todas");
  const [showFilters, setShowFilters] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState("todos");
  const [programFilter, setProgramFilter] = useState("todos");

  // --- Estado del chatbox de ajustes ---
  // adjustmentBoxId: ID de la solicitud que tiene el chatbox abierto (null = ninguno).
  const [adjustmentBoxId, setAdjustmentBoxId] = useState<string | null>(null);
  // adjustmentNotes: texto que el coordinador está escribiendo como observación.
  const [adjustmentNotes, setAdjustmentNotes] = useState("");
  // adjustmentError: mensaje de validación cuando el coordinador intenta confirmar sin texto.
  const [adjustmentError, setAdjustmentError] = useState("");


  // Aplica los tres filtros al mismo tiempo:
  // estado, semestre y programa.
  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "todas" || request.status === statusFilter;

    const matchesSemester =
      semesterFilter === "todos" || request.semester === semesterFilter;

    const matchesProgram =
      programFilter === "todos" || request.program === programFilter;

    return matchesStatus && matchesSemester && matchesProgram;
  });



  const statusStyles: Record<RequestStatus, string> = {
    pendiente: "bg-amber-50 text-amber-700 border border-amber-200",
    en_revision: "bg-blue-50 text-blue-700 border border-blue-200",
    aprobada: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    // "rechazada" significa que el coordinador pidió ajustes al GIF.
    // No es un rechazo definitivo: el GIF puede corregir y reenviar.
    rechazada: "bg-orange-50 text-orange-700 border border-orange-200",
  };


  const statusLabel: Record<RequestStatus, string> = {
    pendiente: "Pendiente",
    en_revision: "En revisión",
    aprobada: "Aprobada",
    // "rechazada" se muestra al GIF como "Requiere ajustes" para indicar que
    // debe hacer correcciones y notificar al coordinador.
    rechazada: "Requiere ajustes",
  };
  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    // Cierra el chatbox de ajustes si se colapsa la tarjeta correspondiente.
    if (adjustmentBoxId === id) {
      setAdjustmentBoxId(null);
      setAdjustmentNotes("");
      setAdjustmentError("");
    }
  }

  /**
   * Abre el chatbox de ajustes para una solicitud específica.
   * No cambia el estado de la solicitud hasta que el coordinador confirme.
   */
  function openAdjustmentBox(requestId: string) {
    setAdjustmentBoxId(requestId);
    setAdjustmentNotes("");
    setAdjustmentError("");
  }

  /** Cierra el chatbox sin hacer ningún cambio de estado. */
  function cancelAdjustmentBox() {
    setAdjustmentBoxId(null);
    setAdjustmentNotes("");
    setAdjustmentError("");
  }

  /**
   * Confirma los ajustes:
   * - Valida que el textarea no esté vacío (trim()).
   * - Llama a rejectRequest con el texto para guardar las observaciones.
   * - Limpia y cierra el chatbox.
   */
  function confirmAdjustments(requestId: string) {
    if (adjustmentNotes.trim() === "") {
      // Muestra el mensaje de validación si el campo está vacío.
      setAdjustmentError("Debes escribir una observación antes de solicitar ajustes.");
      return;
    }
    rejectRequest(requestId, adjustmentNotes.trim());
    setAdjustmentBoxId(null);
    setAdjustmentNotes("");
    setAdjustmentError("");
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

        <div className="space-y-5">

          {filteredRequests.length === 0 ? (

            <p className="text-sm text-slate-500">
              No hay solicitudes para este filtro.
            </p>

          ) : (


            <div className="grid gap-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="flex w-full items-center justify-between"
                >
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Filtros de solicitudes
                    </h3>
                    <p className="text-xs text-slate-500">
                      Filtra por estado, semestre o programa.
                    </p>
                  </div>

                  <svg
                    className={`h-5 w-5 text-slate-500 transition-transform ${showFilters ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showFilters && (
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Estado
                      </label>

                      <select
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(event.target.value as RequestStatus | "todas")
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                      >
                        <option value="todas">Todas</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Semestre
                      </label>

                      <select
                        value={semesterFilter}
                        onChange={(event) => setSemesterFilter(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                      >
                        <option value="todos">Todos</option>
                        <option value="2024-1">2024-1</option>
                        <option value="2024-2">2024-2</option>
                        <option value="2025-1">2025-1</option>
                        <option value="2025-2">2025-2</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Programa
                      </label>

                      <select
                        value={programFilter}
                        onChange={(event) => setProgramFilter(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                      >
                        <option value="todos">Todos</option>
                        <option value="Administración de Empresas">
                          Administración de Empresas
                        </option>
                        <option value="Ingeniería de Sistemas">
                          Ingeniería de Sistemas
                        </option>
                        <option value="Diseño Gráfico">Diseño Gráfico</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Solicitudes recibidas
                  </h2>
                  <p className="text-sm text-slate-500">
                    Revisa, valida y gestiona las solicitudes enviadas por los GIF.
                  </p>
                </div>
                {filteredRequests.map((request) => {
                  const isExpanded = expandedId === request.id;
                  return (
                    <article
                      key={request.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* 🔹 HEADER RESUMIDO */}
                      {/* Header principal de la tarjeta */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Solicitud LMS
                          </p>

                          <h3 className="mt-1 text-lg font-semibold leading-tight text-slate-900">
                            {request.subject}
                          </h3>
                        </div>

                        <span
                          className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {statusLabel[request.status]}
                        </span>
                      </div>

                      {/* Metadata + acción */}
                      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                            {request.level}
                          </span>

                          <span className="text-slate-300">•</span>

                          <span>{request.program}</span>

                          <span className="text-slate-300">•</span>

                          <span>{request.semester}</span>
                        </div>

                        <button
                          onClick={() => toggleExpand(request.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-95"
                        >
                          <span>{isExpanded ? "Ocultar detalles" : "Ver detalles"}</span>

                          <svg
                            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"
                              }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Drive
                              </p>

                              <a
                                href={request.source}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                              >
                                Ver enlace
                                <span aria-hidden="true">↗</span>
                              </a>
                            </div>

                            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Creación
                              </p>

                              <p className="mt-2 text-sm font-medium text-slate-700">
                                {request.createdAt}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {request.createdByName} · {request.createdByRole}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200 md:col-span-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Descripción
                              </p>

                              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                {request.summary}
                              </p>
                            </div>

                            {/* Observaciones del coordinador: se muestran solo cuando existe adjustmentNotes,
                                es decir, cuando el coordinador ya confirmó un "Solicitar ajustes" previo. */}
                            {request.adjustmentNotes && (
                              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 md:col-span-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                                  Observaciones solicitadas
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-orange-800">
                                  {request.adjustmentNotes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                            <button
                              onClick={() => approveRequest(request.id)}
                              className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              Aprobar
                            </button>

                            {/* Solicitar ajustes: abre el chatbox obligatorio.
                                No cambia el estado hasta que el coordinador confirme con observaciones. */}
                            <button
                              onClick={() => openAdjustmentBox(request.id)}
                              className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                            >
                              Solicitar ajustes
                            </button>
                          </div>

                          {/* --- CHATBOX DE AJUSTES ---
                              Se muestra solo cuando el coordinador hace clic en "Solicitar ajustes".
                              El coordinador debe escribir observaciones antes de confirmar. */}
                          {adjustmentBoxId === request.id && (
                            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
                              <p className="mb-2 text-sm font-semibold text-orange-800">
                                Observaciones para el GIF
                              </p>
                              <p className="mb-3 text-xs text-orange-600">
                                Explica qué debe corregir el GIF. Este texto será visible en su panel.
                              </p>

                              {/* Textarea de observaciones */}
                              <textarea
                                value={adjustmentNotes}
                                onChange={(e) => {
                                  setAdjustmentNotes(e.target.value);
                                  // Limpia el error en cuanto el coordinador empieza a escribir.
                                  if (adjustmentError) setAdjustmentError("");
                                }}
                                rows={4}
                                placeholder="Describe las correcciones necesarias..."
                                className="w-full resize-none rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-300/40"
                              />

                              {/* Mensaje de validación: aparece solo si se intenta confirmar sin texto */}
                              {adjustmentError && (
                                <p className="mt-2 text-xs font-medium text-red-600">
                                  {adjustmentError}
                                </p>
                              )}

                              {/* Botones del chatbox */}
                              <div className="mt-3 flex justify-end gap-2">
                                {/* Cancelar: cierra el chatbox sin cambiar el estado */}
                                <button
                                  type="button"
                                  onClick={cancelAdjustmentBox}
                                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                  Cancelar
                                </button>

                                {/* Confirmar: valida el textarea y llama a rejectRequest */}
                                <button
                                  type="button"
                                  onClick={() => confirmAdjustments(request.id)}
                                  className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 active:scale-95"
                                >
                                  Confirmar ajustes
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </article>

                  );

                })}
              </div>

            </div>

          )}

        </div>

      </div>

    </section>

  );

}