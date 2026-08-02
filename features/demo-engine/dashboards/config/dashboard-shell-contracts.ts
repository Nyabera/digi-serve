export type DashboardShellContract = {
  readonly id:
    | "operational"
    | "organization-admin";
  readonly roles: readonly string[];
  readonly layoutOwners: readonly string[];
  readonly stableBoundary: string;
  readonly currentImplementation: string;
  readonly dashboardBodyMayOwnShell: false;
  readonly dashboardBodyMayOwnTopbar: false;
  readonly dashboardBodyMayOwnSidebar: false;
  readonly dashboardBodyMayOwnRoleSelector: false;
  readonly notes: readonly string[];
};

export const OPERATIONAL_SHELL_CONTRACT = {
  id: "operational",
  roles: [
    "officer",
    "supervisor",
  ],
  layoutOwners: [
    "app/demo/officer/layout.tsx",
    "app/demo/supervisor/layout.tsx",
  ],
  stableBoundary:
    "components/demo/workspace-shells/operational-workspace-shell.tsx",
  currentImplementation:
    "components/demo/internal-shell/role-workspace-shell.tsx",
  dashboardBodyMayOwnShell: false,
  dashboardBodyMayOwnTopbar: false,
  dashboardBodyMayOwnSidebar: false,
  dashboardBodyMayOwnRoleSelector: false,
  notes: [
    "Officer and Supervisor use one operational shell.",
    "Role-specific navigation remains configuration-driven.",
    "D31-3 through D31-7 must not alter operational shell geometry.",
    "Dashboard bodies begin inside the shell content region.",
  ],
} as const satisfies DashboardShellContract;

export const ADMIN_SHELL_CONTRACT = {
  id: "organization-admin",
  roles: [
    "admin",
  ],
  layoutOwners: [
    "app/demo/admin/layout.tsx",
  ],
  stableBoundary:
    "components/demo/workspace-shells/admin-workspace-shell.tsx",
  currentImplementation:
    "Transitional delegation to RoleWorkspaceShell until D31-8",
  dashboardBodyMayOwnShell: false,
  dashboardBodyMayOwnTopbar: false,
  dashboardBodyMayOwnSidebar: false,
  dashboardBodyMayOwnRoleSelector: false,
  notes: [
    "Admin has a separate stable shell boundary.",
    "D31-8 may replace the boundary internals with the dark organization shell.",
    "The Admin route layout must not change when that visual implementation changes.",
    "Admin dashboard sections must never mount their own sidebar or top bar.",
  ],
} as const satisfies DashboardShellContract;

export const DASHBOARD_SHELL_CONTRACTS = {
  operational: OPERATIONAL_SHELL_CONTRACT,
  admin: ADMIN_SHELL_CONTRACT,
} as const;
