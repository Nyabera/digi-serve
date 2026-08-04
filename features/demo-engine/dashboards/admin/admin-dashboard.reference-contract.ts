export const ADMIN_DASHBOARD_REFERENCE_CONTRACT = {
  stage: "D31-10",
  route: "/demo/admin",
  sourceBundleSha256:
    "bfcebb4334456890a9125ae5c91602b33d8948ec6d2782b202bc3be751aa7f46",
  designReference: {
    file:
      "public/demo/references/dashboards/admin-dashboard-bundle-reference.png",
    width: 864,
    height: 1821,
    sha256:
      "4bf810f6d7d443e719f4536073df5dac6bdfd4612268b6d2a24e5828aee3ae96",
  },
  implementationPreview: {
    file:
      "public/demo/references/dashboards/admin-dashboard-bundle-implementation-preview.png",
    width: 1536,
    height: 3327,
    sha256:
      "6f709a64dafc9a88d8e7ddf6399002076ac004b3d927e99e268fac9f8511458a",
  },
  mobilePreview: {
    file:
      "public/demo/references/dashboards/admin-dashboard-bundle-mobile-preview.png",
    width: 390,
    height: 7624,
    sha256:
      "7e5f7d406dd10ee4f63f7a8263c375576e8257dc2222fa5e5513f9d2cdf242c4",
  },
  rootSelector:
    '[data-dashboard-role="admin"]',
  dashboardVersion:
    "d31-admin-zones-v1",
  embeddedMode: true,
  zones: [
    {
      id: "admin-zone-one",
      number: 1,
      title: "Institution-wide health",
    },
    {
      id: "admin-zone-two",
      number: 2,
      title: "Operational visibility",
    },
    {
      id: "admin-zone-three",
      number: 3,
      title: "Financial and document control",
    },
    {
      id: "admin-zone-five",
      number: 5,
      title: "Governance and institutional insight",
    },
  ],
  typography: {
    headings: "Plus Jakarta Sans",
    interface: "Inter",
  },
  responsiveBreakpoints: [
    1200,
    840,
    560,
  ],
  prohibitedProductionFeatures: [
    "standalone reference sidebar",
    "duplicate Admin shell",
    "CSS zoom",
    "transform scale",
    "fixed viewport-height dashboard canvas",
    "screenshot backgrounds",
  ],
} as const;

export type AdminDashboardReferenceContract =
  typeof ADMIN_DASHBOARD_REFERENCE_CONTRACT;
