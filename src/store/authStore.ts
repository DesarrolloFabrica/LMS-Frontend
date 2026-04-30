import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ApiUser, AuthSession, BackendUserRole, UserRole } from "@/types";

interface AuthState {
  lastActivityAt: number | null;
  user: ApiUser | null;
  setSession: (session: AuthSession) => void;
  setUser: (user: ApiUser) => void;
  touchSession: (at?: number) => void;
  clearSession: () => void;
}

type PersistedAuthState = Pick<AuthState, "lastActivityAt" | "user">;

export const mapBackendRoleToUiRole = (role: BackendUserRole): UserRole =>
  role === "FABRICA" ? "gif" : "coordinador";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      lastActivityAt: null,
      user: null,
      setSession: (session) => set({ lastActivityAt: Date.now(), user: session.user }),
      setUser: (user) => set({ lastActivityAt: Date.now(), user }),
      touchSession: (at = Date.now()) => set({ lastActivityAt: at }),
      clearSession: () => set({ lastActivityAt: null, user: null }),
    }),
    {
      name: "carga-lms-auth",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lastActivityAt: state.lastActivityAt, user: state.user }),
      migrate: (persistedState, version): PersistedAuthState => {
        if (version < 2) {
          return { lastActivityAt: null, user: null };
        }

        return persistedState as PersistedAuthState;
      },
    },
  ),
);
