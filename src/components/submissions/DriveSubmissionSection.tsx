import { useEffect, useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { catalogsApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRequestsStore } from "@/store/requestsStore";
import type { AcademicLevel, ApiContentType, ApiProgram, ApiSemester, ContentTypeCode, RequestStatus } from "@/types";

const academicLevels: AcademicLevel[] = ["PREGRADO", "POSGRADO", "ESPECIALIZACION", "DIPLOMADO"];

const schema = z.object({
    subject: z.string().min(1, "La materia es obligatoria"),
    level: z.string().min(1, "El nivel o tipo es obligatorio"),
    summary: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    source: z.string().url("Debe ser una URL válida (ej: https://drive.google.com/...)"),
    contentTypeCodes: z.array(z.string()).min(1, "Selecciona al menos un tipo de contenido"),
});

type SubmissionForm = z.infer<typeof schema>;

export function DriveSubmissionSection() {
    const [view, setView] = useState<"new" | "list">("new");
    const createRequest = useRequestsStore((state) => state.createRequest);
    const loadMyRequests = useRequestsStore((state) => state.loadMyRequests);
    const requests = useRequestsStore((state) => state.requests);
    const isLoading = useRequestsStore((state) => state.isLoading);
    // Accion para que Fabrica notifique que corrigio una solicitud con ajustes.
    const notifyCorrectionsReady = useRequestsStore((state) => state.notifyCorrectionsReady);
    const accessToken = useAuthStore((state) => state.accessToken);
    const { register, handleSubmit, reset } = useForm<SubmissionForm>({
        resolver: zodResolver(schema),
        defaultValues: { contentTypeCodes: [] },
    });
    const [semester, setSemester] = useState("");
    const [program, setProgram] = useState("");
    const [contentTypes, setContentTypes] = useState<ApiContentType[]>([]);
    const [semesters, setSemesters] = useState<ApiSemester[]>([]);
    const [programs, setPrograms] = useState<ApiProgram[]>([]);
    const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

    // Estilos visuales por estado (misma paleta que el panel de coordinador).
    // "requiere_ajustes" usa naranja porque representa ajustes pendientes, no un rechazo definitivo.
    const statusStyles: Record<RequestStatus, string> = {
        pendiente: "bg-amber-50 text-amber-700 border border-amber-200",
        aprobado: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        requiere_ajustes: "bg-orange-50 text-orange-700 border border-orange-200",
    };

    // Etiquetas legibles para el GIF.
    // "requiere_ajustes" indica que Fabrica debe corregir y notificar al revisor.
    const statusLabel: Record<RequestStatus, string> = {
        pendiente: "PENDIENTE",
        aprobado: "APROBADO",
        requiere_ajustes: "REQUIERE AJUSTES",
    };

    const myRequests = requests.filter((request) => request.createdByRole === "gif");

    useEffect(() => {
        if (!accessToken) return;
        void catalogsApi.contentTypes().then(setContentTypes).catch((error) => toast.error(readError(error)));
        void catalogsApi.semesters().then(setSemesters).catch((error) => toast.error(readError(error)));
        void catalogsApi.programs().then(setPrograms).catch((error) => toast.error(readError(error)));
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) return;
        void loadMyRequests().catch((error) => toast.error(readError(error)));
    }, [accessToken, loadMyRequests]);

    const onSubmit = async (data: SubmissionForm) => {
        /**
         * Persistimos en Zustand para compartir la data con la vista de Coordinador
         * y también reutilizarla en "Mis solicitudes".
         */
        try {
        await createRequest({
            subject: data.subject,
            level: data.level as AcademicLevel,
            source: data.source,
            summary: data.summary,
            semester,
            program,
            contentTypeCodes: data.contentTypeCodes as ContentTypeCode[],
        });
        toast.success("Solicitud enviada");
        reset({ subject: "", level: "", source: "", summary: "", contentTypeCodes: [] });
        setSemester("");
        setProgram("");
        setView("list");
        } catch (error) {
            toast.error(readError(error));
        }
    };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFA]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] animate-[spin_40s_linear_infinite] rounded-full bg-blue-300/20 blur-[120px]" />
        <div className="absolute -right-[5%] top-[20%] h-[35rem] w-[35rem] animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-indigo-300/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[30rem] w-[30rem] animate-[spin_50s_linear_infinite_reverse] rounded-full bg-cyan-300/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[min(1280px,calc(100%-2rem))] flex-col px-4 pb-12 pt-36 sm:px-6 sm:pb-16 sm:pt-50">
        <div className="mb-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setView("new")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              view === "new" ? "bg-teal-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Nueva solicitud
          </button>

          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              view === "list" ? "bg-teal-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Mis solicitudes
          </button>
        </div>

                {/* Formulario principal de carga */}
                {view === "new" && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mx-auto mt-10 w-full max-w-4xl px-4"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            {/* Campo de materia */}
                            {/* Fila inicial: materia y nivel/tipo */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Campo de materia */}
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                                        Materia
                                    </label>

                                    <Input
                                        className="h-12 border-slate-200 bg-slate-50 text-slate-700 shadow-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                                        placeholder="Nombre..."
                                        {...register("subject")}
                                    />
                                </div>

                                {/* Campo de nivel o tipo */}
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                                        Nivel / Tipo
                                    </label>

                                    <Select
                                        className="h-12 border-slate-200 bg-slate-50 text-slate-700 shadow-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                                        {...register("level")}
                                    >
                                        <option value="">Seleccione...</option>
                                        {academicLevels.map((level) => (
                                          <option key={level} value={level}>
                                            {labelForContentType(level)}
                                          </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Semestre
                                    </label>

                                    <select
                                        value={semester}
                                        onChange={(event) => setSemester(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                                        required
                                    >
                                        <option value="">Selecciona un semestre</option>
                                        {semesters.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Campo para seleccionar programa */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Programa
                                    </label>

                                    <select
                                        value={program}
                                        onChange={(event) => setProgram(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                                        required
                                    >
                                        <option value="">Selecciona un programa</option>
                                        {programs.map((item) => (
                                            <option key={item.code} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

              <Field label="URL de Google Drive" className="mt-5">
                <Input
                  className="h-12 border-slate-200 bg-slate-50 text-slate-700 shadow-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  placeholder="Enlace de la carpeta..."
                  {...register("source")}
                />
              </Field>

              <Field label="Tipos de contenido" className="mt-5">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {contentTypes.map((contentType) => (
                    <label
                      key={contentType.code}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600"
                    >
                      <input
                        type="checkbox"
                        value={contentType.code}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        {...register("contentTypeCodes")}
                      />
                      {contentType.name}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Descripción" className="mt-5">
                <Textarea
                  className="resize-none border-slate-200 bg-slate-50 text-slate-700 shadow-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  rows={4}
                  placeholder="Breve detalle del material..."
                  {...register("summary")}
                />
              </Field>

              <RevealOnScroll
                as="section"
                viewportAmount={0.18}
                className="relative mt-6 overflow-hidden rounded-[2rem] border border-blue-200/50 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 p-6 shadow-inner sm:p-8"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />

                <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900">
                      Revisión previa al envío
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-blue-800/70">
                                            Confirma que el resumen y el enlace son correctos. Tras enviar, el proceso entra en pipeline automatizado como{" "}
                                            <span className="font-semibold text-blue-900">Pendiente</span>.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="group relative overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgb(37,99,235,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgb(37,99,235,0.5)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? "Enviando..." : "Enviar solicitud"}
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>

                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </Button>
                                </div>
                            </RevealOnScroll>
                        </div>
                    </form>

                )}
                {view === "list" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-700 mb-4">
                            Mis solicitudes
                        </h2>
                        {myRequests.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                Aún no tienes solicitudes creadas.
                            </p>
                        ) : (
                            <div className="grid gap-3">
                                {myRequests.map((request) => {
                                    const isExpanded = expandedRequestId === request.id;
                                    return (
                                        <article
                                            key={request.id}
                                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                        >
                                            {/* Resumen inicial de la solicitud */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-base font-semibold text-slate-800">
                                                        {request.subject}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Creada: {new Date(request.createdAt).toLocaleString()}
                                                    </p>
                                                </div>

                                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {statusLabel[request.status]}
                                                </span>
                                            </div>

                                            {/* Botón para desplegar información */}
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setExpandedRequestId((currentId) =>
                                                            currentId === request.id ? null : request.id
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-95"
                                                >
                                                    <span>{isExpanded ? "Ocultar información" : "Ver información"}</span>

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

                                            {/* Información desplegada */}
                                            {isExpanded && (
                                                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                                Nivel/Tipo
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                                {request.level}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                                Programa
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                                {request.program}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                                Semestre
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                                {request.semester}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                                Material
                                                            </p>

                                                            <a
                                                                href={request.source}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                                            >
                                                                Ver Google Drive
                                                                <span aria-hidden="true">↗</span>
                                                            </a>
                                                        </div>

                                                        <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200 md:col-span-2">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                                Descripción
                                                            </p>

                                                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                                                {request.summary}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Bloque de observaciones del coordinador:
                                                        Se muestra cuando la solicitud requiere ajustes.
                                                        El GIF ve aquí qué debe corregir antes de reenviar. */}
                                                    {request.status === "requiere_ajustes" && (
                                                        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
                                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                                                                Observaciones del coordinador
                                                            </p>

                                                            {/* Muestra las observaciones guardadas, o un aviso si no hay */}
                                                            {request.adjustmentNotes ? (
                                                                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                                                                    {request.adjustmentNotes}
                                                                </p>
                                                            ) : (
                                                                <p className="mt-1 text-sm italic text-slate-400">
                                                                    El coordinador no dejó observaciones adicionales.
                                                                </p>
                                                            )}

                                                            {/* Botón para que el GIF notifique que ya hizo las correcciones */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    void notifyCorrectionsReady(request.id)
                                                                        .then(() => toast.success("Correcciones notificadas"))
                                                                        .catch((error) => toast.error(readError(error)))
                                                                }
                                                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 active:scale-95"
                                                            >
                                                                Notificar correcciones
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function labelForContentType(code: string) {
  return code
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readError(error: unknown) {
  return error instanceof Error ? error.message : "No fue posible conectar con el backend.";
}

