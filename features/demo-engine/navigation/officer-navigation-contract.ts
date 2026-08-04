import {
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquareText,
  QrCode,
  ShieldCheck,
  StickyNote,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export const OFFICER_NAVIGATION_GROUP_IDS = [
  "operations",
  "workflow",
  "documents",
  "communication-account",
] as const;

export type OfficerNavigationGroupId =
  (typeof OFFICER_NAVIGATION_GROUP_IDS)[number];

export const OFFICER_ROUTE_KEYS = [
  "home",
  "tasks",
  "queue",
  "sla",
  "overdueTasks",
  "workflowInbox",
  "sharedWork",
  "approvalQueue",
  "returnedToApplicant",
  "documentReview",
  "generatedPdfs",
  "issuedDocuments",
  "qrVerification",
  "applicantMessages",
  "internalNotes",
] as const;

export type OfficerRouteKey = (typeof OFFICER_ROUTE_KEYS)[number];

export type OfficerCanonicalHref = `/demo/officer${string}`;

export const OFFICER_ROUTE_HREFS = {
  home: "/demo/officer",
  tasks: "/demo/officer/tasks",
  queue: "/demo/officer/queue",
  sla: "/demo/officer/sla-monitor",
  overdueTasks: "/demo/officer/tasks/overdue",
  workflowInbox: "/demo/officer/workflow",
  sharedWork: "/demo/officer/shared-work",
  approvalQueue: "/demo/officer/workflow/approvals",
  returnedToApplicant: "/demo/officer/workflow/returned",
  documentReview: "/demo/officer/documents/review",
  generatedPdfs: "/demo/officer/documents/generated",
  issuedDocuments: "/demo/officer/documents/issued",
  qrVerification: "/demo/officer/documents/verification",
  applicantMessages: "/demo/officer/communications/applicant",
  internalNotes: "/demo/officer/communications/internal",
} as const satisfies Readonly<Record<OfficerRouteKey, OfficerCanonicalHref>>;

/**
 * Existing officer-owned routes that are not canonical navigation
 * destinations. These remain available to compatibility consumers while
 * D32 moves the visible navigation in later stages.
 */
export const OFFICER_NON_NAVIGATION_ROUTES = {
  documentsHub: "/demo/officer/documents",
} as const satisfies Readonly<Record<string, OfficerCanonicalHref>>;

export type OfficerLegacyAlias =
  "/demo/officer/sla" | "/demo/officer/reports/sla";

export const OFFICER_LEGACY_ROUTE_ALIASES = {
  "/demo/officer/sla": OFFICER_ROUTE_HREFS.sla,
  "/demo/officer/reports/sla": OFFICER_ROUTE_HREFS.sla,
} as const satisfies Readonly<Record<OfficerLegacyAlias, OfficerCanonicalHref>>;

export function resolveOfficerLegacyAlias(
  pathname: string,
): OfficerCanonicalHref | null {
  return OFFICER_LEGACY_ROUTE_ALIASES[pathname as OfficerLegacyAlias] ?? null;
}

export type OfficerNavigationIconSymbol =
  | "ClipboardCheck"
  | "Clock3"
  | "FileCheck2"
  | "FileText"
  | "Inbox"
  | "LayoutDashboard"
  | "ListChecks"
  | "LogOut"
  | "MessageSquareText"
  | "QrCode"
  | "ShieldCheck"
  | "StickyNote"
  | "UsersRound";

type OfficerNavigationItemBase = {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly iconSymbol: OfficerNavigationIconSymbol;
};

export type OfficerNavigationRouteItem = OfficerNavigationItemBase & {
  readonly kind: "route";
  readonly routeKey: OfficerRouteKey;
  readonly href: OfficerCanonicalHref;
  readonly exactMatch: boolean;
  readonly activePrefixes: readonly OfficerCanonicalHref[];
  readonly legacyAliases: readonly OfficerLegacyAlias[];
};

export type OfficerNavigationActionItem = OfficerNavigationItemBase & {
  readonly kind: "action";
  readonly action: "logout";
};

export type OfficerNavigationItem =
  OfficerNavigationRouteItem | OfficerNavigationActionItem;

export type OfficerNavigationGroup = {
  readonly id: OfficerNavigationGroupId;
  readonly label: string;
  readonly items: readonly OfficerNavigationItem[];
};

const NO_ACTIVE_PREFIXES =
  [] as const satisfies readonly OfficerCanonicalHref[];
const NO_LEGACY_ALIASES = [] as const satisfies readonly OfficerLegacyAlias[];
const SLA_LEGACY_ALIASES = [
  "/demo/officer/sla",
  "/demo/officer/reports/sla",
] as const satisfies readonly OfficerLegacyAlias[];

export const OFFICER_NAVIGATION_CONTRACT = [
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        kind: "route",
        routeKey: "home",
        href: OFFICER_ROUTE_HREFS.home,
        icon: LayoutDashboard,
        iconSymbol: "LayoutDashboard",
        exactMatch: true,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "my-tasks",
        label: "My Tasks",
        kind: "route",
        routeKey: "tasks",
        href: OFFICER_ROUTE_HREFS.tasks,
        icon: ListChecks,
        iconSymbol: "ListChecks",
        exactMatch: true,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "application-queue",
        label: "Application Queue",
        kind: "route",
        routeKey: "queue",
        href: OFFICER_ROUTE_HREFS.queue,
        icon: ClipboardCheck,
        iconSymbol: "ClipboardCheck",
        exactMatch: false,
        activePrefixes: ["/demo/officer/requests/"],
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "sla-monitor",
        label: "SLA Monitor",
        kind: "route",
        routeKey: "sla",
        href: OFFICER_ROUTE_HREFS.sla,
        icon: Clock3,
        iconSymbol: "Clock3",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: SLA_LEGACY_ALIASES,
      },
      {
        id: "overdue-tasks",
        label: "Overdue Tasks",
        kind: "route",
        routeKey: "overdueTasks",
        href: OFFICER_ROUTE_HREFS.overdueTasks,
        icon: Clock3,
        iconSymbol: "Clock3",
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
        id: "workflow-inbox",
        label: "Workflow Inbox",
        kind: "route",
        routeKey: "workflowInbox",
        href: OFFICER_ROUTE_HREFS.workflowInbox,
        icon: Inbox,
        iconSymbol: "Inbox",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "shared-work",
        label: "Shared Work",
        kind: "route",
        routeKey: "sharedWork",
        href: OFFICER_ROUTE_HREFS.sharedWork,
        icon: UsersRound,
        iconSymbol: "UsersRound",
        exactMatch: true,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "approval-queue",
        label: "Approval Queue",
        kind: "route",
        routeKey: "approvalQueue",
        href: OFFICER_ROUTE_HREFS.approvalQueue,
        icon: ShieldCheck,
        iconSymbol: "ShieldCheck",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "returned-to-applicant",
        label: "Returned to Applicant",
        kind: "route",
        routeKey: "returnedToApplicant",
        href: OFFICER_ROUTE_HREFS.returnedToApplicant,
        icon: Clock3,
        iconSymbol: "Clock3",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    items: [
      {
        id: "document-review",
        label: "Document Review",
        kind: "route",
        routeKey: "documentReview",
        href: OFFICER_ROUTE_HREFS.documentReview,
        icon: FileText,
        iconSymbol: "FileText",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "generated-pdfs",
        label: "Generated PDFs",
        kind: "route",
        routeKey: "generatedPdfs",
        href: OFFICER_ROUTE_HREFS.generatedPdfs,
        icon: FileCheck2,
        iconSymbol: "FileCheck2",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "issued-documents",
        label: "Issued Documents",
        kind: "route",
        routeKey: "issuedDocuments",
        href: OFFICER_ROUTE_HREFS.issuedDocuments,
        icon: FileCheck2,
        iconSymbol: "FileCheck2",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "qr-verification",
        label: "QR Verification",
        kind: "route",
        routeKey: "qrVerification",
        href: OFFICER_ROUTE_HREFS.qrVerification,
        icon: QrCode,
        iconSymbol: "QrCode",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
    ],
  },
  {
    id: "communication-account",
    label: "Communication & Account",
    items: [
      {
        id: "applicant-messages",
        label: "Applicant Messages",
        kind: "route",
        routeKey: "applicantMessages",
        href: OFFICER_ROUTE_HREFS.applicantMessages,
        icon: MessageSquareText,
        iconSymbol: "MessageSquareText",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
      {
        id: "internal-notes",
        label: "Internal Notes",
        kind: "route",
        routeKey: "internalNotes",
        href: OFFICER_ROUTE_HREFS.internalNotes,
        icon: StickyNote,
        iconSymbol: "StickyNote",
        exactMatch: false,
        activePrefixes: NO_ACTIVE_PREFIXES,
        legacyAliases: NO_LEGACY_ALIASES,
      },
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
] as const satisfies readonly OfficerNavigationGroup[];

export const OFFICER_NAVIGATION_ITEMS: readonly OfficerNavigationItem[] = (
  OFFICER_NAVIGATION_CONTRACT as readonly OfficerNavigationGroup[]
).flatMap((group) => group.items);

export const OFFICER_NAVIGATION_ROUTE_ITEMS: readonly OfficerNavigationRouteItem[] =
  OFFICER_NAVIGATION_ITEMS.filter(
    (item): item is OfficerNavigationRouteItem => item.kind === "route",
  );

export const OFFICER_NAVIGATION_ACTION_ITEMS: readonly OfficerNavigationActionItem[] =
  OFFICER_NAVIGATION_ITEMS.filter(
    (item): item is OfficerNavigationActionItem => item.kind === "action",
  );
