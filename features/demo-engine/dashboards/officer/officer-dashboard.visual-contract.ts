export const OFFICER_DASHBOARD_VISUAL_CONTRACT = {
  stage: "D31-7",
  approvedImplementation: "D31-6R5B",
  dashboardVersion: "spacious-v3.1",
  route: "/demo/officer",
  rootSelector: ".d31-officer-reference",
  reference: {
    file:
      "public/demo/references/dashboards/officer-dashboard.png",
    width: 1568,
    height: 1003,
    includesShell: false,
  },
  typography: {
    headingFont: "Plus Jakarta Sans",
    interfaceFont: "Inter",
    identifierFont: "Source Code Pro",
  },
  requiredRegions: [
    "dashboard-header",
    "workload-pulse",
    "work-plan",
    "case-signals",
    "recent-handoffs",
    "recent-activity",
    "up-next",
    "action-required",
    "my-rhythm",
  ],
  workPlanColumns: [
    ["service", 16.5],
    ["applicant", 10.5],
    ["requestId", 11.5],
    ["nextAction", 20],
    ["stage", 12],
    ["sla", 11],
    ["status", 9.5],
    ["action", 9],
  ],
  viewports: {
    referenceDesktop: {
      width: 1920,
      height: 1200,
    },
    browserZoom80: {
      width: 1536,
      height: 1000,
      cssZoom: 0.8,
    },
    desktop1440: {
      width: 1440,
      height: 1000,
    },
    tablet1024: {
      width: 1024,
      height: 900,
    },
    mobile390: {
      width: 390,
      height: 844,
    },
  },
  prohibitedImplementationTechniques: [
    "body screenshot backgrounds",
    "transform scale for dashboard layout",
    "CSS zoom in production dashboard styles",
    "duplicated sidebar",
    "duplicated topbar",
  ],
} as const;

export type OfficerDashboardVisualContract =
  typeof OFFICER_DASHBOARD_VISUAL_CONTRACT;
