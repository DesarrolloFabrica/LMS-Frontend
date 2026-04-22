/** Anclas del dashboard principal (scroll interno). */
export const DASHBOARD_SECTION_IDS = {
  hero: "dashboard-hero",
  flow: "flow-explanation",
  processes: "active-processes",
} as const;

export type DashboardSectionId = (typeof DASHBOARD_SECTION_IDS)[keyof typeof DASHBOARD_SECTION_IDS];

/** Identificadores de las pestañas del navbar en `/dashboard` (scroll interno). */
export const DASHBOARD_SCROLL_TAB_IDS = {
  inicio: "inicio",
  procesos: "procesos",
  analitica: "analitica",
  archivos: "archivos",
  auditoria: "auditoria",
} as const;

export type DashboardScrollTabId = (typeof DASHBOARD_SCROLL_TAB_IDS)[keyof typeof DASHBOARD_SCROLL_TAB_IDS];

/** Pestañas del navbar: subir al hero o bajar a procesos activos (misma ruta `/dashboard`). */
export const DASHBOARD_NAV_SCROLL_TABS = [
  {
    id: DASHBOARD_SCROLL_TAB_IDS.inicio,
    label: "Inicio",
    sectionId: DASHBOARD_SECTION_IDS.hero,
  },
  {
    id: DASHBOARD_SCROLL_TAB_IDS.procesos,
    label: "Procesos",
    sectionId: DASHBOARD_SECTION_IDS.processes,
  },
  {
    id: DASHBOARD_SCROLL_TAB_IDS.analitica,
    label: "Analítica",
    path: "/activity",
  },
  {
    id: DASHBOARD_SCROLL_TAB_IDS.archivos,
    label: "Archivos",
    path: "/history",
  },
  {
    id: DASHBOARD_SCROLL_TAB_IDS.auditoria,
    label: "Auditoría",
    path: "/review",
  },
] as const;

export function scrollToDashboardSection(id: DashboardSectionId | string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/** Scroll-spy: sección visible → pestaña activa del navbar en dashboard. */
export const DASHBOARD_SECTION_ID_TO_NAV: Record<string, DashboardScrollTabId> = {
  [DASHBOARD_SECTION_IDS.hero]: DASHBOARD_SCROLL_TAB_IDS.inicio,
  [DASHBOARD_SECTION_IDS.flow]: DASHBOARD_SCROLL_TAB_IDS.procesos,
  [DASHBOARD_SECTION_IDS.processes]: DASHBOARD_SCROLL_TAB_IDS.procesos,
};

export function dashboardSectionIdFromHash(hash: string): DashboardSectionId | null {
  const id = hash.replace(/^#/, "");
  const values = Object.values(DASHBOARD_SECTION_IDS) as string[];
  return values.includes(id) ? (id as DashboardSectionId) : null;
}
