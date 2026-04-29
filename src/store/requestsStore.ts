import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LmsRequest } from "@/types";

interface CreateRequestInput {
  subject: string;
  level: string;
  source: string;
  summary: string;
  semester: string;
  program: string;
  createdByName?: string;
}

interface RequestsState {
  /** Estado compartido entre GIF y Coordinador. */
  requests: LmsRequest[];
  /** Crea una nueva solicitud con metadatos mínimos de trazabilidad. */
  createRequest: (input: CreateRequestInput) => void;
  /** Marca una solicitud como "en_revision". */
  setRequestInReview: (id: string) => void;
  /** Marca una solicitud como "aprobada". */
  approveRequest: (id: string) => void;
  /** Marca una solicitud como "rechazada" (requiere ajustes) y guarda las observaciones del coordinador. */
  rejectRequest: (id: string, adjustmentNotes: string) => void;
  /**
   * Acción del GIF: notifica que corrigió la solicitud rechazada.
   * Cambia el estado de "rechazada" → "en_revision" para que el coordinador
   * pueda volver a revisarla en su bandeja.
   */
  notifyCorrectionsReady: (id: string) => void;
}

const createRequestId = () => `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set) => ({
      requests: [],
      createRequest: (input) =>
        set((state) => ({
          requests: [
            {
              id: createRequestId(),
              subject: input.subject,
              level: input.level,
              source: input.source,
              summary: input.summary,
              semester: input.semester,
              program: input.program,
              status: "pendiente",
              createdAt: new Date().toISOString(),
              createdByRole: "gif",
              createdByName: input.createdByName,
            },
            ...state.requests,
          ],
        })),
      setRequestInReview: (id) =>
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id ? { ...request, status: "en_revision" } : request,
          ),
        })),
      approveRequest: (id) =>
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id ? { ...request, status: "aprobada" } : request,
          ),
        })),
      // Guarda las observaciones junto al estado para que el GIF pueda ver qué debe corregir.
      rejectRequest: (id, adjustmentNotes) =>
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? { ...request, status: "rechazada", adjustmentNotes }
              : request,
          ),
        })),
      // El GIF notifica que hizo correcciones → la solicitud vuelve a "en_revision"
      // para que el coordinador la encuentre de nuevo en su bandeja de revisión.
      notifyCorrectionsReady: (id) =>
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id ? { ...request, status: "en_revision" } : request,
          ),
        })),
    }),
    {
      name: "carga-lms-requests",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ requests: state.requests }),
    },
  ),
);
