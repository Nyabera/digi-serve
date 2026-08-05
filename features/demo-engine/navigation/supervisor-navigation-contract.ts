import {
  BarChart3,
  Building2,
  Clock3,
  Inbox,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export const SUPERVISOR_NAVIGATION_GROUP_IDS = [
  "operations",
  "workflow",
  "performance",
  "oversight",
  "account",
] as const;

export type SupervisorNavigationGroupId =
  (typeof SUPERVISOR_NAVIGATION_GROUP_IDS)[number];

export const SUPERVISOR_ROUTE_KEYS = [
  "home",
  "departmentQueue",
  "unassignedWork",
  "teamWorkload",
  "approvalQueue",
  "escalations",
  "departmentHandoffs",
  "sharedWork",
  "slaMonitor",
  "overdueWork",
  "officerPerformance",
  "departmentReports",
  "auditTrail",
] as const;

export type SupervisorRouteKey = (typeof SUPERVISOR_ROUTE_KEYS)[number];

export type SupervisorCanonicalHref = `/demo/supervisor${string}`;

export const SUPERVISOR_ROUTE_HREFS = {
  home: "/demo/supervisor",
  departmentQueue: "/demo/supervisor/department-queue",
  unassignedWork: "/demo/supervisor/unassigned-work",
  teamWorkload: "/demo/supervisor/team-workload",
  approvalQueue: "/demo/supervisor/approval-queue",
  escalations: "/demo/supervisor/escalations",
  departmentHandoffs: "/demo/supervisor/department-handoffs",
  sharedWork: "/demo/supervisor/shared-work",
  slaMonitor: "/demo/supervisor/sla-monitor",
  overdueWork: "/demo/supervisor/overdue-work",
  officerPerformance: "/demo/supervisor/officer-performance",
  departmentReports: "/demo/supervisor/department-reports",
  auditTrail: "/demo/supervisor/audit-trail",
} as const satisfies Readonly<
  Record<SupervisorRouteKey, SupervisorCanonicalHref>
>;

export function isSupervisorRoutePath(pathname: string): boolean {
  const path = pathname.split(/[?#]/, 1)[0] ?? pathname;
  const normalized = path.replace(/\/+$/, "") || "/";

  return (
    normalized === SUPERVISOR_ROUTE_HREFS.home ||
    normalized.startsWith(`${SUPERVISOR_ROUTE_HREFS.home}/`)
  );
}

export const SUPERVISOR_LEGACY_ROUTE_HREFS = {
  approvals: "/demo/supervisor/approvals",
} as const satisfies Readonly<Record<string, SupervisorCanonicalHref>>;

export type SupervisorLegacyAlias =
  (typeof SUPERVISOR_LEGACY_ROUTE_HREFS)[keyof typeof SUPERVISOR_LEGACY_ROUTE_HREFS];

export const SUPERVISOR_LEGACY_ROUTE_ALIASES = {
  [SUPERVISOR_LEGACY_ROUTE_HREFS.approvals]:
    SUPERVISOR_ROUTE_HREFS.approvalQueue,
} as const satisfies Readonly<
  Record<SupervisorLegacyAlias, SupervisorCanonicalHref>
>;

export function resolveSupervisorLegacyAlias(
  pathname: string,
): SupervisorCanonicalHref | null {
  return (
    SUPERVISOR_LEGACY_ROUTE_ALIASES[pathname as SupervisorLegacyAlias] ?? null
  );
}

export type SupervisorNavigationIconSymbol =
  | "BarChart3"
  | "Building2"
  | "Clock3"
  | "Inbox"
  | "LayoutDashboard"
  | "LogOut"
  | "ShieldCheck"
  | "UsersRound";

type SupervisorNavigationItemBase = {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly iconSymbol: SupervisorNavigationIconSymbol;
};

export type SupervisorNavigationRouteItem = SupervisorNavigationItemBase & {
  readonly kind: "route";
  readonly routeKey: SupervisorRouteKey;
  readonly href: SupervisorCanonicalHref;
  readonly exactMatch: boolean;
  readonly activePrefixes: readonly SupervisorCanonicalHref[];
  readonly legacyAliases: readonly SupervisorLegacyAlias[];
};

export type SupervisorNavigationActionItem = SupervisorNavigationItemBase & {
  readonly kind: "action";
  readonly action: "logout";
};

export type SupervisorNavigationItem =
  SupervisorNavigationRouteItem | SupervisorNavigationActionItem;

export type SupervisorNavigationGroup = {
  readonly id: SupervisorNavigationGroupId;
  readonly label: string;
  readonly items: readonly SupervisorNavigationItem[];
};

const NO_ACTIVE_PREFIXES =
  [] as const satisfies readonly SupervisorCanonicalHref[];
const NO_LEGACY_ALIASES =
  [] as const satisfies readonly SupervisorLegacyAlias[];
const APPROVAL_ACTIVE_PREFIXES = [
  "/demo/supervisor/approvals/",
] as const satisfies readonly SupervisorCanonicalHref[];
const APPROVAL_LEGACY_ALIASES = [
  SUPERVISOR_LEGACY_ROUTE_HREFS.approvals,
] as const satisfies readonly SupervisorLegacyAlias[];

export const SUPERVISOR_NAVIGATION_CONTRACT = [
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "department-dashboard",
        label: "Department Dashboard",
        kind: "route",
        routeKey: "home",
        href: SUPERVISOR_ROUTE_HREFS.home,
        icon: LayoutDashboard,
        iconSymbol: "LayoutDashboard",
        exactMatch: true,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "department-queue",
        label: "Department Queue",
        kind: "route",
        routeKey: "departmentQueue",
        href: SUPERVISOR_ROUTE_HREFS.departmentQueue,
        icon: Building2,
        iconSymbol: "Building2",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "unassigned-work",
        label: "Unassigned Work",
        kind: "route",
        routeKey: "unassignedWork",
        href: SUPERVISOR_ROUTE_HREFS.unassignedWork,
        icon: Inbox,
        iconSymbol: "Inbox",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "team-workload",
        label: "Team Workload",
        kind: "route",
        routeKey: "teamWorkload",
        href: SUPERVISOR_ROUTE_HREFS.teamWorkload,
        icon: UsersRound,
        iconSymbol: "UsersRound",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
    ],
  },
  {
    id: "workflow",
    label: "Workflow",
    items: [
      {
        id: "approval-queue",
        label: "Approval Queue",
        kind: "route",
        routeKey: "approvalQueue",
        href: SUPERVISOR_ROUTE_HREFS.approvalQueue,
        icon: ShieldCheck,
        iconSymbol: "ShieldCheck",
        exactMatch: false,
        activePrefixes: APPROVAL_ACTIVE_PREFIXES,
        legacyAliases: APPROVAL_LEGACY_ALIASES,
      },
      {
        id: "escalations",
        label: "Escalations",
        kind: "route",
        routeKey: "escalations",
        href: SUPERVISOR_ROUTE_HREFS.escalations,
        icon: Clock3,
        iconSymbol: "Clock3",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "department-handoffs",
        label: "Department Handoffs",
        kind: "route",
        routeKey: "departmentHandoffs",
        href: SUPERVISOR_ROUTE_HREFS.departmentHandoffs,
        icon: Building2,
        iconSymbol: "Building2",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "shared-work",
        label: "Shared Work",
        kind: "route",
        routeKey: "sharedWork",
        href: SUPERVISOR_ROUTE_HREFS.sharedWork,
        icon: UsersRound,
        iconSymbol: "UsersRound",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    items: [
      {
        id: "sla-monitor",
        label: "SLA Monitor",
        kind: "route",
        routeKey: "slaMonitor",
        href: SUPERVISOR_ROUTE_HREFS.slaMonitor,
        icon: LayoutDashboard,
        iconSymbol: "LayoutDashboard",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "overdue-work",
        label: "Overdue Work",
        kind: "route",
        routeKey: "overdueWork",
        href: SUPERVISOR_ROUTE_HREFS.overdueWork,
        icon: Clock3,
        iconSymbol: "Clock3",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "officer-performance",
        label: "Officer Performance",
        kind: "route",
        routeKey: "officerPerformance",
        href: SUPERVISOR_ROUTE_HREFS.officerPerformance,
        icon: BarChart3,
        iconSymbol: "BarChart3",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "department-reports",
        label: "Department Reports",
        kind: "route",
        routeKey: "departmentReports",
        href: SUPERVISOR_ROUTE_HREFS.departmentReports,
        icon: BarChart3,
        iconSymbol: "BarChart3",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
    ],
  },
  {
    id: "oversight",
    label: "Oversight",
    items: [
      {
        id: "audit-trail",
        label: "Audit Trail",
        kind: "route",
        routeKey: "auditTrail",
        href: SUPERVISOR_ROUTE_HREFS.auditTrail,
        icon: LayoutDashboard,
        iconSymbol: "LayoutDashboard",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      {
        id: "log-out",
        label: "Log Out",
        kind: "action",
        action: "logout",
        icon: LogOut,
        iconSymbol: "LogOut",
      },
    ],
  },
] as const satisfies readonly SupervisorNavigationGroup[];

export const SUPERVISOR_NAVIGATION_ITEMS: readonly SupervisorNavigationItem[] =
  (
    SUPERVISOR_NAVIGATION_CONTRACT as readonly SupervisorNavigationGroup[]
  ).flatMap((group) => group.items);

export const SUPERVISOR_NAVIGATION_ROUTE_ITEMS: readonly SupervisorNavigationRouteItem[] =
  SUPERVISOR_NAVIGATION_ITEMS.filter(
    (item): item is SupervisorNavigationRouteItem => item.kind === "route",
  );

export const SUPERVISOR_NAVIGATION_ACTION_ITEMS: readonly SupervisorNavigationActionItem[] =
  SUPERVISOR_NAVIGATION_ITEMS.filter(
    (item): item is SupervisorNavigationActionItem => item.kind === "action",
  );
