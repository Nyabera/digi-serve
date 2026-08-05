import {
  ADMIN_ROUTE_HREFS,
} from "./admin-navigation-contract";

export type DemoWorkspaceRole =
  | "applicant"
  | "officer"
  | "supervisor"
  | "admin";

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
    home: "/demo/officer",
    queue: "/demo/officer/queue",
    tasks: "/demo/officer/tasks",
    documents: "/demo/officer/documents",
    sla: "/demo/officer/sla-monitor",
  },
  supervisor: {
    home: "/demo/supervisor",
    approvals: "/demo/supervisor/approvals",
    audit: "/demo/supervisor/audit-trail",
    sla: "/demo/supervisor/sla-monitor",
  },
  admin: {
    /**
     * Compatibility aliases used by existing role-switch and D30 consumers.
     * All normal destinations now resolve from the D34-1 source of truth.
     */
    home: ADMIN_ROUTE_HREFS.dashboard,
    workflows: ADMIN_ROUTE_HREFS.workflowBuilder,

    ...ADMIN_ROUTE_HREFS,

    /**
     * D34-6 owns the legacy-route decision. Keeping the old route explicit
     * here prevents it from being mistaken for a canonical destination.
     */
    legacyWorkflowBuilder: "/demo/admin/workflows/builder",
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

function matchesPrefix(
  pathname: string,
  prefix: string,
): boolean {
  return (
    pathname === prefix ||
    pathname.startsWith(`${prefix}/`)
  );
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

  if (matchesPrefix(normalized, "/demo/officer")) {
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
