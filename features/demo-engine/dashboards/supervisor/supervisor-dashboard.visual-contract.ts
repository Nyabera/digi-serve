export const SUPERVISOR_DASHBOARD_VISUAL_CONTRACT = {
  stage: "D31-9",
  approvedImplementation: "D31-8",
  dashboardVersion: "d31-supervisor-zones-v1",
  route: "/demo/supervisor",
  rootSelector: '[data-dashboard-role="supervisor"]',
  sourceBundleSha256:
    "5bfe7aba52eb8f3cc78079c7442fc37101df84d6c8ff842f5dfbd25911fc0694",
  designReference: {
    file:
      "public/demo/references/dashboards/supervisor-dashboard-bundle-reference.png",
    width: 864,
    height: 1821,
    sha256:
      "10d6c51289bb10f8bbf9ad804ff5bc7fb42cc537d8f4cd5accf61b662fb38ab0",
    includesOperationalShell: true,
  },
  runnableBundlePreview: {
    file:
      "public/demo/references/dashboards/supervisor-dashboard-bundle-implementation-preview.png",
    width: 1536,
    height: 2842,
    sha256:
      "3587424a66b54c147d12b490a2dcdc52d33d059a6acad2685f50cfb013a55088",
  },
  typography: {
    headingFont: "Plus Jakarta Sans",
    interfaceFont: "Inter",
  },
  geometry: {
    standaloneSidebarWidth: 218,
    standaloneBodyMaxWidth: 1440,
  },
  requiredZones: [
    "supervisor-zone-one",
    "supervisor-zone-two",
    "supervisor-zone-three",
    "supervisor-zone-four",
  ],
  requiredSections: [
    "Approval lane",
    "Critical attention",
    "Unassigned work",
    "Officer workload and capacity",
    "Assignment centre",
    "Department work queue",
    "Handoff control",
    "Escalations and exceptions",
    "Document & payment exceptions",
    "Service flow performance",
    "SLA trend",
    "Officer performance",
    "Service performance",
    "Department throughput",
    "Applicant experience (CSAT)",
    "Performance insights",
    "Recent decisions",
    "Department activity",
    "Audit highlights",
    "Team notifications",
    "Reports and exports",
  ],
  viewports: {
    bundleDesktop: {
      width: 1536,
      height: 1000,
    },
    desktop1440: {
      width: 1440,
      height: 1000,
    },
    referenceWidth864: {
      width: 864,
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
  comparison: {
    overlayOpacity: 0.5,
    scorePurpose:
      "Diagnostic parity measurement, not a substitute for manual overlay review.",
  },
  prohibitedImplementationTechniques: [
    "screenshot backgrounds",
    "CSS zoom in production styles",
    "transform scale for production layout",
    "duplicate operational shell",
    "hard-coded viewport-height dashboard body",
  ],
} as const;

export type SupervisorDashboardVisualContract =
  typeof SUPERVISOR_DASHBOARD_VISUAL_CONTRACT;
