export type LoginExperiencePhase =
  | "booting"
  | "readyForLogin"
  | "authenticating"
  | "enteringDashboard";

export type AuthProgressStep = "validating" | "syncing" | "loading";

export type AuthProfile = "reduced" | "full";

export type AuthNavigationState = {
  fromAuthTransition?: boolean;
  authProfile?: AuthProfile;
};

export const BOOT_SUBSTATES = [
  "Validando componentes",
  "Sincronizando entorno",
  "Cargando modulos del sistema",
  "Preparando panel editorial",
] as const;

export const AUTH_PROGRESS_MESSAGES: Record<AuthProgressStep, string> = {
  validating: "Validando acceso",
  syncing: "Sincronizando espacio",
  loading: "Cargando dashboard",
};

export const AUTH_EXPERIENCE_TIMINGS = {
  boot: {
    reduced: 750,
    mobile: 1500,
    desktop: 1900,
  },
  auth: {
    reduced: 400,
    full: 1300,
  },
  dashboardEntry: {
    reduced: 200,
    full: 900,
  },
} as const;

export const AUTH_EXPERIENCE_INTENSITY = {
  reduced: {
    blurPx: 1,
    glowOpacity: 0.08,
    scaleFrom: 0.996,
  },
  full: {
    blurPx: 7,
    glowOpacity: 0.24,
    scaleFrom: 0.986,
  },
} as const;
