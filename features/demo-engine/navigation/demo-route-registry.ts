import {
  isOfficerRoutePath,
  OFFICER_NON_NAVIGATION_ROUTES,
  OFFICER_ROUTE_HREFS,
} from "./officer-navigation-contract";
import {
  SUPERVISOR_LEGACY_ROUTE_HREFS,
  SUPERVISOR_ROUTE_HREFS,
} from "./supervisor-navigation-contract";

export type DemoWorkspaceRole =
  "applicant" | "officer" | "supervisor" | "admin";

export const DEMO_ROUTES = {
  public: {
    home: "/demo",
    verifyCertificate: "/demo/verify-certificate",
  },
  applicant: {
    home: "/demo/track",
    workspace: "/demo/applicant",
    profile: "/demo/applicant/profile",
    documents: "/demo/applicant/documents",
    requests: "/demo/track",
  },
  officer: {
    ...OFFICER_ROUTE_HREFS,
    documents: OFFICER_NON_NAVIGATION_ROUTES.documentsHub,
  },
  supervisor: {
    ...SUPERVISOR_ROUTE_HREFS,
    approvals: SUPERVISOR_LEGACY_ROUTE_HREFS.approvals,
    audit: SUPERVISOR_ROUTE_HREFS.auditTrail,
    sla: SUPERVISOR_ROUTE_HREFS.slaMonitor,
  },
  admin: {
    home: "/demo/admin",
    workflows: "/demo/admin/workflows",
    workflowBuilder: "/demo/admin/workflows/builder",
  },
} as const;

export const DEMO_ROLE_HOME_ROUTES: Readonly<
  Record<DemoWorkspaceRole, string>
> = {
  applicant: DEMO_ROUTES.applicant.home,
  officer: DEMO_ROUTES.officer.home,
  supervisor: DEMO_ROUTES.supervisor.home,
  admin: DEMO_ROUTES.admin.home,
};

const APPLICANT_JOURNEY_PREFIXES = [
  "/demo/applicant",
  "/demo/track",
  "/demo/requests",
  "/demo/services",
  "/demo/sign-up",
  "/demo/outcomes",
] as const;

export function normalizeDemoPath(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] ?? pathname;
  const normalized = withoutQuery.replace(/\/+$/, "");

  return normalized || "/";
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function resolveDemoRoleFromPath(
  pathname: string,
): DemoWorkspaceRole | null {
  const normalized = normalizeDemoPath(pathname);

  if (matchesPrefix(normalized, "/demo/admin")) {
    return "admin";
  }

  if (matchesPrefix(normalized, "/demo/supervisor")) {
    return "supervisor";
  }

  if (isOfficerRoutePath(normalized)) {
    return "officer";
  }

  if (
    APPLICANT_JOURNEY_PREFIXES.some((prefix) =>
      matchesPrefix(normalized, prefix),
    )
  ) {
    return "applicant";
  }

  return null;
}

export function isDemoRouteForRole(
  pathname: string,
  role: DemoWorkspaceRole,
): boolean {
  return resolveDemoRoleFromPath(pathname) === role;
}

export const D30_10E_ROUTE_IDS = {
  publicVerification: DEMO_ROUTES.public.verifyCertificate,
  applicantProfile: DEMO_ROUTES.applicant.profile,
  applicantDocuments: DEMO_ROUTES.applicant.documents,
  officerDocuments: DEMO_ROUTES.officer.documents,
  adminWorkflows: DEMO_ROUTES.admin.workflows,
  adminWorkflowBuilder: DEMO_ROUTES.admin.workflowBuilder,
} as const;
