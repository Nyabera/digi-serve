export const ADMIN_DASHBOARD_VISUAL_CONTRACT = {
  stage: "D31-11",
  approvedImplementation: "D31-10",
  dashboardVersion: "d31-admin-zones-v1",
  route: "/demo/admin",
  rootSelector:
    '[data-dashboard-role="admin"]',
  sourceBundleSha256:
    "bfcebb4334456890a9125ae5c91602b33d8948ec6d2782b202bc3be751aa7f46",
  designReference: {
    file:
      "public/demo/references/dashboards/admin-dashboard-bundle-reference.png",
    width: 864,
    height: 1821,
    sha256:
      "4bf810f6d7d443e719f4536073df5dac6bdfd4612268b6d2a24e5828aee3ae96",
    bodyCrop: {
      x: 184,
      y: 0,
      width: 680,
      height: 1821,
    },
  },
  implementationPreview: {
    file:
      "public/demo/references/dashboards/admin-dashboard-bundle-implementation-preview.png",
    width: 1536,
    height: 3327,
    sha256:
      "6f709a64dafc9a88d8e7ddf6399002076ac004b3d927e99e268fac9f8511458a",
    bodyCrop: {
      x: 216,
      y: 0,
      width: 1320,
      height: 3327,
    },
  },
  mobilePreview: {
    file:
      "public/demo/references/dashboards/admin-dashboard-bundle-mobile-preview.png",
    width: 390,
    height: 7624,
    sha256:
      "7e5f7d406dd10ee4f63f7a8263c375576e8257dc2222fa5e5513f9d2cdf242c4",
    bodyCrop: {
      x: 0,
      y: 64,
      width: 390,
      height: 7560,
    },
  },
  viewports: {
    desktop1536: {
      width: 1536,
      height: 1000,
    },
    desktop1440: {
      width: 1440,
      height: 1000,
    },
    reference864: {
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
  requiredZones: [
    "admin-zone-one",
    "admin-zone-two",
    "admin-zone-three",
    "admin-zone-five",
  ],
  requiredSections: [
    "Executive brief",
    "Service Delivery Trend",
    "Institutional Alerts",
    "Department Performance Comparison",
    "Institution-wide SLA Monitor",
    "Requests by Status",
    "Requests by Service",
    "Workflow Bottlenecks",
    "Handoff Network",
    "Approvals and Escalations",
    "Payment Overview",
    "Document Operations",
    "Certificate & Verification Activity",
    "Renewals and Expiries",
    "Audit & Compliance Risk Feed",
    "Applicant Experience Funnel",
    "Platform Adoption",
    "External Coordination Leakage",
    "Institutional Outcomes",
    "System Health",
    "Recent Administrative Activity",
    "Scheduled Reports",
  ],
  comparison: {
    overlayOpacity: 0.5,
    scorePurpose:
      "Diagnostic normalized RGB similarity. Manual overlay review remains authoritative.",
  },
  testRunnerIsolation: {
    playwrightPattern: "**/*.pw.ts",
    vitestPatternCollision: false,
  },
} as const;

export type AdminDashboardVisualContract =
  typeof ADMIN_DASHBOARD_VISUAL_CONTRACT;
