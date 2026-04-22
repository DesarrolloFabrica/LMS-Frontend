import { create } from "zustand";

interface UIState {
  currentUserId: string;
  globalSearch: string;
  activeFilter: string;
  selectedProcessId?: string;
  /** Dashboard: true cuando el hero oscuro ya no queda detrás del navbar (fondo claro). */
  dashboardNavOverLight: boolean;
  /** Pestaña activa del navbar en `/dashboard` (`inicio` | `procesos`). */
  dashboardNavScrollActiveTo: string;
  setSearch: (value: string) => void;
  setFilter: (value: string) => void;
  setSelectedProcess: (value?: string) => void;
  setDashboardNavOverLight: (value: boolean) => void;
  setDashboardNavScrollActiveTo: (to: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentUserId: "u1",
  globalSearch: "",
  activeFilter: "all",
  selectedProcessId: undefined,
  dashboardNavOverLight: false,
  dashboardNavScrollActiveTo: "inicio",
  setSearch: (globalSearch) => set({ globalSearch }),
  setFilter: (activeFilter) => set({ activeFilter }),
  setSelectedProcess: (selectedProcessId) => set({ selectedProcessId }),
  setDashboardNavOverLight: (dashboardNavOverLight) => set({ dashboardNavOverLight }),
  setDashboardNavScrollActiveTo: (dashboardNavScrollActiveTo) => set({ dashboardNavScrollActiveTo }),
}));

