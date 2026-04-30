import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ApiUser, AuthSession, BackendUserRole, UserRole } from "@/types";

interface AuthState {
  accessToken: string | null;
  user: ApiUser | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const mapBackendRoleToUiRole = (role: BackendUserRole): UserRole =>
  role === "FABRICA" ? "gif" : "coordinador";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: (session) => set({ accessToken: session.accessToken, user: session.user }),
      clearSession: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "carga-lms-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
