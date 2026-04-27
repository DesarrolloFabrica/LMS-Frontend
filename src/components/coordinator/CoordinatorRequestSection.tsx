import type { RequestStatus } from "@/types";
import { useRequestsStore } from "@/store/requestsStore";

export function CoordinatorRequestsSection() {
  const requests = useRequestsStore((state) => state.requests);
  const setRequestInReview = useRequestsStore((state) => state.setRequestInReview);
  const approveRequest = useRequestsStore((state) => state.approveRequest);
  const rejectRequest = useRequestsStore((state) => state.rejectRequest);

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
          {requests.length === 0 ? (
            <p className="text-sm text-slate-500">Aún no hay solicitudes recibidas.</p>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <article
                  key={request.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white hover:shadow-sm"
                >
                  {/* Resumen principal de la solicitud recibida */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{request.id}</p>
                      <h3 className="mt-1 text-base font-bold text-slate-800">{request.subject}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Nivel / Tipo: {request.level}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[request.status]}`}>
                      {statusLabel[request.status]}
                    </span>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-700">Drive:</span>{" "}
                      <a
                        href={request.source}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {request.source}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">Descripción:</span> {request.summary}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">Creada:</span>{" "}
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">Creada por:</span>{" "}
                      {request.createdByName ?? "Usuario GIF"} ({request.createdByRole})
                    </p>
                  </div>

                  {/* Acciones rápidas para prototipo sin backend */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setRequestInReview(request.id)}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      Marcar en revisión
                    </button>
                    <button
                      type="button"
                      onClick={() => approveRequest(request.id)}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectRequest(request.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Rechazar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}