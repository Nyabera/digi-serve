export type DashboardRole =
  | "officer"
  | "supervisor"
  | "admin";

export type DashboardReferenceGeometry = {
  readonly canvas: {
    readonly width: number;
    readonly height: number;
  };
  readonly shellIncluded: boolean;
  readonly shell: {
    readonly sidebarWidth: number | null;
    readonly contentWidth: number;
  };
  readonly page: {
    readonly maxWidth: number;
    readonly inlineInset: number;
  };
  readonly grid: {
    readonly columns: 12;
    readonly gap: number;
  };
};

export const DASHBOARD_REFERENCE_GEOMETRY = {
  officer: {
    canvas: {
      width: 1568,
      height: 1003,
    },
    shellIncluded: false,
    shell: {
      sidebarWidth: null,
      contentWidth: 1512,
    },
    page: {
      maxWidth: 1512,
      inlineInset: 20,
    },
    grid: {
      columns: 12,
      gap: 14,
    },
  },
  supervisor: {
    canvas: {
      width: 864,
      height: 1821,
    },
    shellIncluded: true,
    shell: {
      sidebarWidth: 118,
      contentWidth: 680,
    },
    page: {
      maxWidth: 680,
      inlineInset: 16,
    },
    grid: {
      columns: 12,
      gap: 12,
    },
  },
  admin: {
    canvas: {
      width: 864,
      height: 1821,
    },
    shellIncluded: true,
    shell: {
      sidebarWidth: 118,
      contentWidth: 683,
    },
    page: {
      maxWidth: 683,
      inlineInset: 16,
    },
    grid: {
      columns: 12,
      gap: 12,
    },
  },
} as const satisfies Readonly<
  Record<DashboardRole, DashboardReferenceGeometry>
>;

export const DASHBOARD_BREAKPOINTS = {
  mobile: 390,
  compact: 720,
  tablet: 1024,
  desktop: 1440,
} as const;

export const DASHBOARD_GRID_SPANS = {
  officer: {
    workloadPulse: 8,
    caseSignals: 4,
    workPlan: 8,
    recentHandoffs: 4,
    recentActivity: 3,
    upNext: 3,
    actionRequired: 3,
    rhythm: 3,
  },
  supervisor: {
    dominantTable: 8,
    sideRail: 4,
    threeUp: 4,
    twoUp: 6,
  },
  admin: {
    dominantChart: 7,
    sideRail: 5,
    threeUp: 4,
    twoUp: 6,
  },
} as const;

export const DASHBOARD_REFERENCE_ZONE_RANGES = {
  supervisor: [
    {
      id: "zone-1",
      label: "Department health",
      start: 69,
      end: 448,
    },
    {
      id: "zone-2",
      label: "Work distribution and control",
      start: 467,
      end: 917,
    },
    {
      id: "zone-3",
      label: "Department performance",
      start: 936,
      end: 1350,
    },
    {
      id: "zone-4",
      label: "Oversight and governance",
      start: 1370,
      end: 1795,
    },
  ],
  admin: [
    {
      id: "zone-1",
      label: "Institution-wide health",
      start: 20,
      end: 613,
    },
    {
      id: "zone-2",
      label: "Operational visibility",
      start: 622,
      end: 1110,
    },
    {
      id: "zone-3",
      label: "Financial and document control",
      start: 1118,
      end: 1436,
    },
    {
      id: "zone-5",
      label: "Governance and institutional insight",
      start: 1444,
      end: 1797,
    },
  ],
} as const;

export const DASHBOARD_DENSITY = {
  cardPadding: {
    compact: 12,
    default: 16,
    officer: 18,
  },
  gridGap: {
    compact: 10,
    longDashboard: 12,
    officer: 14,
  },
  tableRowHeight: {
    longDashboard: 42,
    officer: 48,
  },
  controlHeight: 36,
  minimumTouchTarget: 44,
} as const;
