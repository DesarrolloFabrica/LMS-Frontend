import { create } from "zustand";
import type { LmsRequest } from "@/types";

interface CreateRequestInput {
  subject: string;
  level: string;
  source: string;
  summary: string;
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
  /** Marca una solicitud como "rechazada". */
  rejectRequest: (id: string) => void;
}

const createRequestId = () => `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const useRequestsStore = create<RequestsState>((set) => ({
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
  rejectRequest: (id) =>
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id ? { ...request, status: "rechazada" } : request,
      ),
    })),
}));
