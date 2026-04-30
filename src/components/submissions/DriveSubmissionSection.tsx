import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Send,
} from "lucide-react";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useRequestsStore } from "@/store/requestsStore";

/**
 * Esquema de validación del formulario.
 * Aquí se definen los campos obligatorios antes de enviar la carga.
 */
const schema = z.object({
    subject: z.string().min(1, "La materia es obligatoria"),
    level: z.string().min(1, "El nivel o tipo es obligatorio"),
    summary: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    source: z.string().url("Debe ser una URL válida (ej: https://drive.google.com/...)"),
});

type SubmissionForm = z.infer<typeof schema>;

export function DriveSubmissionSection() {
    type GifStatusFilter = "todas" | "pendiente" | "aprobada" | "rechazada";
    const [view, setView] = useState<"new" | "list">("new");
    const createRequest = useRequestsStore((state) => state.createRequest);
    const requests = useRequestsStore((state) => state.requests);
    // Acción para que el GIF notifique que corrigió una solicitud rechazada.
    const notifyCorrectionsReady = useRequestsStore((state) => state.notifyCorrectionsReady);
    const { register, handleSubmit, reset } = useForm<SubmissionForm>({
        resolver: zodResolver(schema),
    });
    const [semester, setSemester] = useState("");
    const [program, setProgram] = useState("");
    const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<GifStatusFilter>("todas");
    const [semesterFilter, setSemesterFilter] = useState("todos");
    const [programFilter, setProgramFilter] = useState("todos");
    const [showFilters, setShowFilters] = useState(false);

    // Estilos visuales por estado (misma paleta que el panel de coordinador).
    // "rechazada" usa naranja porque representa ajustes pendientes, no un rechazo definitivo.
    const statusStyles: Record<string, string> = {
        pendiente: "bg-amber-50 text-amber-700 border border-amber-200",
        aprobada: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        rechazada: "bg-orange-50 text-orange-700 border border-orange-200",
    };

    // Etiquetas legibles para el GIF.
    // "rechazada" se muestra como "Requiere ajustes" para que el GIF entienda que debe corregir.
    const statusLabel: Record<string, string> = {
        pendiente: "Pendiente",
        aprobada: "Aprobada",
        rechazada: "Requiere ajustes",
    };

    const myRequests = requests.filter((request) => request.createdByRole === "gif");
    const semesterOptions = Array.from(new Set(myRequests.map((request) => request.semester))).sort();
    const programOptions = Array.from(new Set(myRequests.map((request) => request.program))).sort();

    const filteredRequests = myRequests.filter((request) => {
        const matchesStatus =
            statusFilter === "todas" || request.status === statusFilter;

        const matchesSemester =
            semesterFilter === "todos" || request.semester === semesterFilter;

        const matchesProgram =
            programFilter === "todos" || request.program === programFilter;

        return matchesStatus && matchesSemester && matchesProgram;
    });

    const onSubmit = (data: SubmissionForm) => {
        /**
         * Persistimos en Zustand para compartir la data con la vista de Coordinador
         * y también reutilizarla en "Mis solicitudes".
         */
        createRequest({
            subject: data.subject,
            level: data.level,
            source: data.source,
            summary: data.summary,
            semester: semester,
            program: program,
        });
        toast.success("Solicitud enviada");
        reset();
        setView("list");
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFA]">
            {/* Fondo decorativo interno del bloque del formulario */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] animate-[spin_40s_linear_infinite] rounded-full bg-blue-300/20 blur-[120px]" />
                <div className="absolute -right-[5%] top-[20%] h-[35rem] w-[35rem] animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-indigo-300/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] h-[30rem] w-[30rem] animate-[spin_50s_linear_infinite_reverse] rounded-full bg-cyan-300/20 blur-[120px]" />

                {/* Patrón sutil de cuadrícula para dar textura tecnológica */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[min(1280px,calc(100%-2rem))] flex-col px-4 pb-12 pt-36 sm:px-6 sm:pb-16 sm:pt-50">

                <div className="mb-6 flex items-center justify-center gap-2">
                    {/* Nueva solicitud */}
                    <button
                        type="button"
                        onClick={() => setView("new")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${view === "new"
                            ? "bg-teal-600 text-white shadow"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        Nueva solicitud
                    </button>

                    {/* Mis solicitudes */}
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${view === "list"
                            ? "bg-teal-600 text-white shadow"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                                        <option value="pregrado">Pregrado</option>
                                        <option value="posgrado">Posgrado</option>
                                        <option value="diplomado">Diplomado</option>
                                        <option value="curso-corto">Curso corto</option>
                                        <option value="otro">Otro</option>
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
                                        <option value="2024-1">2024-1</option>
                                        <option value="2024-2">2024-2</option>
                                        <option value="2025-1">2025-1</option>
                                        <option value="2025-2">2025-2</option>
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

                            {/* Campo del enlace de Google Drive */}
                            <div className="mt-5">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                                    URL de Google Drive
                                </label>

                                <Input
                                    className="h-12 border-slate-200 bg-slate-50 text-slate-700 shadow-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                                    placeholder="Enlace de la carpeta..."
                                    {...register("source")}
                                />
                            </div>

                            {/* Campo de descripción del material */}
                            <div className="mt-5">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                                    Descripción
                                </label>

                                <Textarea
                                    className="resize-none border-slate-200 bg-slate-50 text-slate-700 shadow-none transition-colors focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                                    rows={4}
                                    placeholder="Breve detalle del material..."
                                    {...register("summary")}
                                />
                            </div>

                            {/* Bloque de envío */}
                            <RevealOnScroll
                                as="section"
                                viewportAmount={0.18}
                                className="relative overflow-hidden rounded-[2rem] border border-blue-200/50 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 p-6 shadow-inner sm:p-8"
                            >
                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />

                                <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                                    <div>
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900">
                                            Revisión previa al envío
                                        </h2>

                                        <p className="mt-2 max-w-md text-sm text-blue-800/70">
                                            Confirma que el resumen y el enlace son correctos. Tras enviar, el proceso entra en pipeline automatizado como{" "}
                                            <span className="font-semibold text-blue-900">Submitted</span>.
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="group relative overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgb(37,99,235,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgb(37,99,235,0.5)]"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Enviar submission
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
                                            className={`h-5 w-5 text-slate-500 transition-transform ${showFilters ? "rotate-180" : "rotate-0"}`}
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
                                                    onChange={(event) => setStatusFilter(event.target.value as GifStatusFilter)}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                                                >
                                                    <option value="todas">Todas</option>
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="aprobada">Aprobada</option>
                                                    <option value="rechazada">Requiere ajustes</option>
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
                                                    {semesterOptions.map((semesterValue) => (
                                                        <option key={semesterValue} value={semesterValue}>
                                                            {semesterValue}
                                                        </option>
                                                    ))}
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
                                                    {programOptions.map((programValue) => (
                                                        <option key={programValue} value={programValue}>
                                                            {programValue}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {filteredRequests.length === 0 ? (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                                        <p className="text-sm font-medium text-slate-700">
                                            No hay solicitudes para este filtro.
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Ajusta los filtros para ver más resultados.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                {filteredRequests.map((request) => {
                                    const isExpanded = expandedRequestId === request.id;
                                    return (
                                        <article
                                            key={request.id}
                                            className={`
                                                relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
                                                transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg
                                                before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-2xl before:transition-all before:duration-200 hover:before:w-1.5
                                                ${request.status === "pendiente" && "before:bg-amber-400"}
                                                ${request.status === "rechazada" && "before:bg-orange-500"}
                                                ${request.status === "aprobada" && "before:bg-emerald-500"}
                                            `}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Solicitud LMS
                                                    </p>
                                                    <h3 className="mt-1 text-lg font-semibold leading-tight text-slate-900">
                                                        {request.subject}
                                                    </h3>
                                                </div>

                                                <span className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {statusLabel[request.status]}
                                                </span>
                                            </div>

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
                                                    type="button"
                                                    onClick={() =>
                                                        setExpandedRequestId((currentId) =>
                                                            currentId === request.id ? null : request.id
                                                        )
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-95"
                                                >
                                                    <span>{isExpanded ? "Ocultar detalles" : "Ver detalles"}</span>
                                                    <svg
                                                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div
                                                className={`
                                                    overflow-hidden transition-all duration-300 ease-out
                                                    ${isExpanded ? "mt-5 max-h-[1000px] opacity-100" : "mt-0 max-h-0 opacity-0"}
                                                `}
                                            >
                                                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
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
                                                                {request.createdByName ?? "GIF"} · {request.createdByRole}
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
                                                    </div>

                                                    {request.status === "rechazada" && (
                                                        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
                                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                                                                Observaciones del coordinador
                                                            </p>
                                                            {request.adjustmentNotes ? (
                                                                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                                                                    {request.adjustmentNotes}
                                                                </p>
                                                            ) : (
                                                                <p className="mt-1 text-sm italic text-slate-400">
                                                                    El coordinador no dejó observaciones adicionales.
                                                                </p>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() => notifyCorrectionsReady(request.id)}
                                                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 active:scale-95"
                                                            >
                                                                Notificar correcciones
                                                            </button>
                                                        </div>
                                                    )}

                                                    {request.status === "aprobada" && request.approvalLink && (
                                                        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                                                Link de aprobación
                                                            </p>
                                                            <a
                                                                href={request.approvalLink}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                                                            >
                                                                Abrir link aprobado
                                                                <span aria-hidden="true">↗</span>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}