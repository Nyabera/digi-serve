export const REQUIRED_DASHBOARD_CSS_TOKENS = [
  "--d31-dashboard-font-display",
  "--d31-dashboard-font-body",
  "--d31-dashboard-canvas",
  "--d31-dashboard-surface",
  "--d31-dashboard-text-strong",
  "--d31-dashboard-text-muted",
  "--d31-dashboard-border",
  "--d31-dashboard-primary",
  "--d31-dashboard-success",
  "--d31-dashboard-warning",
  "--d31-dashboard-danger",
  "--d31-dashboard-purple",
  "--d31-dashboard-grid-gap",
  "--d31-dashboard-zone-gap",
  "--d31-dashboard-card-padding",
  "--d31-dashboard-page-max",
  "--d31-dashboard-title-size",
  "--d31-dashboard-kpi-size",
  "--d31-dashboard-table-row-height",
  "--d31-dashboard-touch-target",
] as const;

export type RequiredDashboardCssToken =
  (typeof REQUIRED_DASHBOARD_CSS_TOKENS)[number];

export const DASHBOARD_THEME_CLASS_CONTRACT = {
  module:
    "features/demo-engine/dashboards/shared/dashboard-tokens.module.css",
  className: "theme",
  roleAttribute: "data-dashboard-role",
  supportedRoles: [
    "officer",
    "supervisor",
    "admin",
  ],
  globalRootMutationAllowed: false,
} as const;
