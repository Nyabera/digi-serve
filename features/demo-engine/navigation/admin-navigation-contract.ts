/**
 * D34-1 — Canonical admin navigation contract.
 *
 * Contract-only stage:
 * - Do not import this file into the visible admin shell until D34-4.
 * - Do not create route pages from this file until D34-2.
 * - Do not change the admin layout until D34-3.
 * - Preserve the currently approved icon components and visual treatment.
 */

export const ADMIN_WORKSPACE_PREFIX = "/demo/admin" as const;

export const ADMIN_ROUTE_HREFS = {
  dashboard: "/demo/admin",

  serviceCatalogue: "/demo/admin/services",
  serviceBuilder: "/demo/admin/services/builder",
  formsRequirements: "/demo/admin/forms-requirements",

  workflowBuilder: "/demo/admin/workflows",
  assignmentRules: "/demo/admin/assignment-rules",
  approvalRules: "/demo/admin/approval-rules",
  slaRules: "/demo/admin/sla-rules",

  users: "/demo/admin/users",
  departments: "/demo/admin/departments",
  rolesPermissions: "/demo/admin/roles-permissions",

  allApplications: "/demo/admin/applications",
  unassignedWork: "/demo/admin/unassigned-work",
  auditTrail: "/demo/admin/audit-trail",

  documentTemplates: "/demo/admin/document-templates",
  issuedDocuments: "/demo/admin/issued-documents",
  qrVerification: "/demo/admin/qr-verification",

  reportsDashboard: "/demo/admin/reports",

  institutionProfile: "/demo/admin/institution-profile",
  branding: "/demo/admin/branding",
  portalSettings: "/demo/admin/portal-settings",
} as const;

export type AdminRouteKey = keyof typeof ADMIN_ROUTE_HREFS;
export type AdminRouteHref = (typeof ADMIN_ROUTE_HREFS)[AdminRouteKey];

export type AdminNavigationSectionKey =
  | "overview"
  | "services"
  | "workflows"
  | "peopleAccess"
  | "operations"
  | "documents"
  | "reports"
  | "organization"
  | "account";

export type AdminNavigationMatchMode = "exact" | "prefix";

/**
 * Stable semantic slot only.
 *
 * D34-4 must resolve each slot to the icon component already used by the
 * existing admin navigation. This contract deliberately does not import or
 * replace icon components.
 */
export type AdminNavigationIconSlot =
  | "dashboard"
  | "serviceCatalogue"
  | "serviceBuilder"
  | "formsRequirements"
  | "workflowBuilder"
  | "assignmentRules"
  | "approvalRules"
  | "slaRules"
  | "users"
  | "departments"
  | "rolesPermissions"
  | "allApplications"
  | "unassignedWork"
  | "auditTrail"
  | "documentTemplates"
  | "issuedDocuments"
  | "qrVerification"
  | "reportsDashboard"
  | "institutionProfile"
  | "branding"
  | "portalSettings"
  | "logout";

export type AdminNavigationRouteItem = Readonly<{
  kind: "route";
  key: AdminRouteKey;
  label: string;
  href: AdminRouteHref;
  iconSlot: AdminNavigationIconSlot;
  match: AdminNavigationMatchMode;
}>;

export type AdminNavigationActionItem = Readonly<{
  kind: "action";
  key: "logout";
  label: "Log Out";
  action: "logout";
  iconSlot: "logout";
}>;

export type AdminNavigationItem =
  | AdminNavigationRouteItem
  | AdminNavigationActionItem;

export type AdminNavigationSection = Readonly<{
  key: AdminNavigationSectionKey;
  label: string;
  items: readonly AdminNavigationItem[];
}>;

export const ADMIN_NAVIGATION_SECTIONS = [
  {
    key: "overview",
    label: "OVERVIEW",
    items: [
      {
        kind: "route",
        key: "dashboard",
        label: "Admin Dashboard",
        href: ADMIN_ROUTE_HREFS.dashboard,
        iconSlot: "dashboard",
        match: "exact",
      },
    ],
  },
  {
    key: "services",
    label: "SERVICES",
    items: [
      {
        kind: "route",
        key: "serviceCatalogue",
        label: "Service Catalogue",
        href: ADMIN_ROUTE_HREFS.serviceCatalogue,
        iconSlot: "serviceCatalogue",
        match: "prefix",
      },
      {
        kind: "route",
        key: "serviceBuilder",
        label: "Service Builder",
        href: ADMIN_ROUTE_HREFS.serviceBuilder,
        iconSlot: "serviceBuilder",
        match: "prefix",
      },
      {
        kind: "route",
        key: "formsRequirements",
        label: "Forms & Requirements",
        href: ADMIN_ROUTE_HREFS.formsRequirements,
        iconSlot: "formsRequirements",
        match: "prefix",
      },
    ],
  },
  {
    key: "workflows",
    label: "WORKFLOWS",
    items: [
      {
        kind: "route",
        key: "workflowBuilder",
        label: "Workflow Builder",
        href: ADMIN_ROUTE_HREFS.workflowBuilder,
        iconSlot: "workflowBuilder",
        match: "prefix",
      },
      {
        kind: "route",
        key: "assignmentRules",
        label: "Assignment Rules",
        href: ADMIN_ROUTE_HREFS.assignmentRules,
        iconSlot: "assignmentRules",
        match: "prefix",
      },
      {
        kind: "route",
        key: "approvalRules",
        label: "Approval Rules",
        href: ADMIN_ROUTE_HREFS.approvalRules,
        iconSlot: "approvalRules",
        match: "prefix",
      },
      {
        kind: "route",
        key: "slaRules",
        label: "SLA Rules",
        href: ADMIN_ROUTE_HREFS.slaRules,
        iconSlot: "slaRules",
        match: "prefix",
      },
    ],
  },
  {
    key: "peopleAccess",
    label: "PEOPLE & ACCESS",
    items: [
      {
        kind: "route",
        key: "users",
        label: "Users",
        href: ADMIN_ROUTE_HREFS.users,
        iconSlot: "users",
        match: "prefix",
      },
      {
        kind: "route",
        key: "departments",
        label: "Departments",
        href: ADMIN_ROUTE_HREFS.departments,
        iconSlot: "departments",
        match: "prefix",
      },
      {
        kind: "route",
        key: "rolesPermissions",
        label: "Roles & Permissions",
        href: ADMIN_ROUTE_HREFS.rolesPermissions,
        iconSlot: "rolesPermissions",
        match: "prefix",
      },
    ],
  },
  {
    key: "operations",
    label: "OPERATIONS",
    items: [
      {
        kind: "route",
        key: "allApplications",
        label: "All Applications",
        href: ADMIN_ROUTE_HREFS.allApplications,
        iconSlot: "allApplications",
        match: "prefix",
      },
      {
        kind: "route",
        key: "unassignedWork",
        label: "Unassigned Work",
        href: ADMIN_ROUTE_HREFS.unassignedWork,
        iconSlot: "unassignedWork",
        match: "prefix",
      },
      {
        kind: "route",
        key: "auditTrail",
        label: "Audit Trail",
        href: ADMIN_ROUTE_HREFS.auditTrail,
        iconSlot: "auditTrail",
        match: "prefix",
      },
    ],
  },
  {
    key: "documents",
    label: "DOCUMENTS",
    items: [
      {
        kind: "route",
        key: "documentTemplates",
        label: "Document Templates",
        href: ADMIN_ROUTE_HREFS.documentTemplates,
        iconSlot: "documentTemplates",
        match: "prefix",
      },
      {
        kind: "route",
        key: "issuedDocuments",
        label: "Issued Documents",
        href: ADMIN_ROUTE_HREFS.issuedDocuments,
        iconSlot: "issuedDocuments",
        match: "prefix",
      },
      {
        kind: "route",
        key: "qrVerification",
        label: "QR Verification",
        href: ADMIN_ROUTE_HREFS.qrVerification,
        iconSlot: "qrVerification",
        match: "prefix",
      },
    ],
  },
  {
    key: "reports",
    label: "REPORTS",
    items: [
      {
        kind: "route",
        key: "reportsDashboard",
        label: "Reports Dashboard",
        href: ADMIN_ROUTE_HREFS.reportsDashboard,
        iconSlot: "reportsDashboard",
        match: "prefix",
      },
    ],
  },
  {
    key: "organization",
    label: "ORGANIZATION",
    items: [
      {
        kind: "route",
        key: "institutionProfile",
        label: "Institution Profile",
        href: ADMIN_ROUTE_HREFS.institutionProfile,
        iconSlot: "institutionProfile",
        match: "prefix",
      },
      {
        kind: "route",
        key: "branding",
        label: "Branding",
        href: ADMIN_ROUTE_HREFS.branding,
        iconSlot: "branding",
        match: "prefix",
      },
      {
        kind: "route",
        key: "portalSettings",
        label: "Portal Settings",
        href: ADMIN_ROUTE_HREFS.portalSettings,
        iconSlot: "portalSettings",
        match: "prefix",
      },
    ],
  },
  {
    key: "account",
    label: "ACCOUNT",
    items: [
      {
        kind: "action",
        key: "logout",
        label: "Log Out",
        action: "logout",
        iconSlot: "logout",
      },
    ],
  },
] as const satisfies readonly AdminNavigationSection[];

export const ADMIN_CANONICAL_ROUTE_HREFS = Object.values(
  ADMIN_ROUTE_HREFS,
) as readonly AdminRouteHref[];

export const ADMIN_NAVIGATION_ROUTE_COUNT =
  ADMIN_CANONICAL_ROUTE_HREFS.length;

export const ADMIN_PROHIBITED_WORKSPACE_PREFIXES = [
  "/demo/officer",
  "/demo/supervisor",
  "/demo/department",
  "/demo/applicant",
  "/demo/public",
] as const;

/**
 * Contract matching rule:
 * 1. The dashboard is exact-match only.
 * 2. Other routes may match descendants.
 * 3. Callers must evaluate longer hrefs before shorter hrefs.
 *
 * Example:
 * /demo/admin/services/builder must activate Service Builder, not Service Catalogue.
 */
export function adminNavigationItemMatchesPathname(
  item: AdminNavigationRouteItem,
  pathname: string,
): boolean {
  if (item.match === "exact") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getAdminNavigationRouteItems(): readonly AdminNavigationRouteItem[] {
  const routeItems: AdminNavigationRouteItem[] = [];

  for (const section of ADMIN_NAVIGATION_SECTIONS) {
    for (const item of section.items) {
      if (item.kind === "route") {
        routeItems.push(item);
      }
    }
  }

  return routeItems;
}

export function findActiveAdminNavigationItem(
  pathname: string,
): AdminNavigationRouteItem | undefined {
  return [...getAdminNavigationRouteItems()]
    .sort((left, right) => right.href.length - left.href.length)
    .find((item) => adminNavigationItemMatchesPathname(item, pathname));
}
