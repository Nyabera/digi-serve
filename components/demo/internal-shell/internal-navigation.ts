import {
  Files,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquareText,
  Settings,
  ShieldCheck,
  StickyNote,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type InternalShellRole =
  | "APPLICANT"
  | "OFFICER"
  | "DEPARTMENT"
  | "SUPERVISOR"
  | "ADMIN";

export type InternalNavigationItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly exact?: boolean;
  readonly activePrefixes?: readonly string[];
  readonly badge?: string;
};

export type InternalNavigationGroup = {
  readonly label: string;
  readonly items: readonly InternalNavigationItem[];
};

function account(base: string): InternalNavigationGroup {
  return {
    label: "Account",
    items: [
      { label: "My profile", href: `${base}#profile`, icon: UserRound },
      { label: "Settings", href: `${base}#settings`, icon: Settings },
      { label: "Help centre", href: "/demo#faq", icon: CircleHelp },
      { label: "Log out", href: "/demo", icon: LogOut },
    ],
  };
}

const applicantNavigation: readonly InternalNavigationGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/demo", icon: LayoutDashboard },
      {
        label: "Start new request",
        href: "/demo/services/transcript-request",
        icon: ClipboardCheck,
      },
      { label: "Service catalogue", href: "/demo#services", icon: ListChecks },
      {
        label: "Notifications",
        href: "/demo/track/REQ-DEMO-001#activity",
        icon: Bell,
      },
    ],
  },
  {
    label: "My activity",
    items: [
      {
        label: "My requests",
        href: "/demo/track/REQ-DEMO-001",
        icon: Inbox,
      },
      {
        label: "Documents",
        href: "/demo/outcomes/REQ-DEMO-001",
        icon: FileText,
      },
      {
        label: "Payments",
        href: "/demo/track/REQ-DEMO-001#payments",
        icon: FileCheck2,
      },
      { label: "Support", href: "/demo#faq", icon: CircleHelp },
    ],
  },
  account("/demo"),
];

const officerNavigation: readonly InternalNavigationGroup[] = [
  {
    label: "Operations",
    items: [
      {
        label: "Dashboard",
        href: "/demo/officer",
        icon: LayoutDashboard,
        exact: true,
      },
      { label: "My tasks", href: "/demo/officer/tasks", icon: ListChecks },
      {
        label: "Documents Hub",
        href: "/demo/officer/documents",
        icon: Files,
      },
      {
        label: "Application queue",
        href: "/demo/officer#application-queue",
        icon: ClipboardCheck,
        activePrefixes: ["/demo/officer/requests/"],
        badge: "4",
      },
    ],
  },
  {
    label: "Workflow",
    items: [
      { label: "Workflow inbox", href: "/demo/department", icon: Inbox },
      {
        label: "Approval queue",
        href: "/demo/officer#approval-queue",
        icon: ShieldCheck,
      },
      {
        label: "Returned to applicant",
        href: "/demo/officer#returned-to-applicant",
        icon: Clock3,
      },
      {
        label: "Shared workflows",
        href: "/demo/department",
        icon: UsersRound,
      },
      {
        label: "Review invitations",
        href: "/demo/officer#review-invitations",
        icon: Bell,
      },
      {
        label: "Ask for feedback",
        href: "/demo/officer#feedback",
        icon: MessageSquareText,
      },
    ],
  },
  {
    label: "Documents",
    items: [
      {
        label: "Document review",
        href: "/demo/officer/requests/REQ-DEMO-001",
        icon: FileText,
      },
      {
        label: "Uploaded documents",
        href: "/demo/officer#uploaded-documents",
        icon: FileText,
      },
      {
        label: "Generated PDFs",
        href: "/demo/officer#generated-pdfs",
        icon: FileCheck2,
      },
      {
        label: "Issued documents",
        href: "/demo/outcomes/REQ-DEMO-001",
        icon: FileCheck2,
      },
    ],
  },
  {
    label: "SLA",
    items: [
      { label: "SLA monitor", href: "/demo/officer/sla-monitor", icon: Clock3 },
      { label: "Due soon tasks", href: "/demo/officer#due-soon", icon: Clock3 },
      { label: "Overdue tasks", href: "/demo/officer#overdue", icon: Clock3 },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        label: "Applicant messages",
        href: "/demo/officer#applicant-messages",
        icon: MessageSquareText,
      },
      {
        label: "Internal notes",
        href: "/demo/officer/requests/REQ-DEMO-001",
        icon: StickyNote,
      },
      {
        label: "Notification log",
        href: "/demo/officer#notification-log",
        icon: Bell,
      },
    ],
  },
  account("/demo/officer"),
];

const departmentNavigation: readonly InternalNavigationGroup[] = [
  {
    label: "Operations",
    items: [
      {
        label: "Dashboard",
        href: "/demo/department",
        icon: LayoutDashboard,
        exact: true,
      },
      { label: "My tasks", href: "/demo/department#my-tasks", icon: ListChecks },
      {
        label: "Department queue",
        href: "/demo/department#department-queue",
        icon: Building2,
        badge: "1",
      },
    ],
  },
  {
    label: "Workflow",
    items: [
      { label: "Incoming", href: "/demo/department", icon: Inbox, exact: true },
      {
        label: "In progress",
        href: "/demo/department#in-progress",
        icon: Clock3,
      },
      {
        label: "Completed",
        href: "/demo/department#completed",
        icon: CheckCircle2,
      },
    ],
  },
  account("/demo/department"),
];

const supervisorNavigation: readonly InternalNavigationGroup[] = [
  {
    label: "Operations",
    items: [
      { label: "Audit trail", href: "/demo/supervisor/audit-trail", icon: LayoutDashboard },
      { label: "SLA monitor", href: "/demo/supervisor/sla-monitor", icon: LayoutDashboard },
      {
        label: "Dashboard",
        href: "/demo/supervisor",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "My tasks",
        href: "/demo/supervisor#my-tasks",
        icon: ListChecks,
      },
      {
        label: "Approval queue",
        href: "/demo/supervisor#approval-queue",
        icon: ShieldCheck,
        activePrefixes: ["/demo/supervisor/approvals/"],
        badge: "1",
      },
    ],
  },
  {
    label: "Department workflow",
    items: [
      { label: "Workflow inbox", href: "/demo/department", icon: Inbox },
      {
        label: "Returned for clarification",
        href: "/demo/supervisor#returned",
        icon: Clock3,
      },
      {
        label: "Shared workflows",
        href: "/demo/department",
        icon: UsersRound,
      },
    ],
  },
  {
    label: "Documents",
    items: [
      {
        label: "Document review",
        href: "/demo/officer/requests/REQ-DEMO-001",
        icon: FileText,
      },
      {
        label: "Issued documents",
        href: "/demo/outcomes/REQ-DEMO-001",
        icon: FileCheck2,
      },
    ],
  },
  {
    label: "Reporting",
    items: [
      {
        label: "Department reports",
        href: "/demo/reports?scope=department",
        icon: BarChart3,
      },
    ],
  },
  account("/demo/supervisor"),
];

const adminNavigation: readonly InternalNavigationGroup[] = [
  {
    label: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/demo/reports?scope=institution",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Institution setup",
    items: [
      {
        label: "Institution profile",
        href: "/demo/reports?scope=institution#institution",
        icon: Building2,
      },
      {
        label: "Branding",
        href: "/demo/reports?scope=institution#branding",
        icon: FileText,
      },
      {
        label: "Campuses / branches",
        href: "/demo/reports?scope=institution#campuses",
        icon: Building2,
      },
    ],
  },
  {
    label: "Services",
    items: [
      {
        label: "Service builder",
        href: "/demo/reports?scope=institution#service-builder",
        icon: ClipboardCheck,
      },
      { label: "Service catalogue", href: "/demo#services", icon: ListChecks },
      {
        label: "Requirements & fees",
        href: "/demo/reports?scope=institution#requirements",
        icon: FileText,
      },
      {
        label: "SLA rules",
        href: "/demo/reports?scope=institution#sla-rules",
        icon: Clock3,
      },
    ],
  },
  {
    label: "Users & roles",
    items: [
      {
        label: "Users",
        href: "/demo/reports?scope=institution#users",
        icon: UsersRound,
      },
      {
        label: "Departments",
        href: "/demo/reports?scope=institution#departments",
        icon: Building2,
      },
      {
        label: "Access control",
        href: "/demo/reports?scope=institution#access",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Workflows",
    items: [
      {
        label: "Workflow templates",
        href: "/demo/department",
        icon: Inbox,
      },
      {
        label: "Approval chains",
        href: "/demo/supervisor",
        icon: ShieldCheck,
      },
      {
        label: "Escalation rules",
        href: "/demo/reports?scope=institution#escalation",
        icon: Clock3,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Reports dashboard",
        href: "/demo/reports?scope=institution",
        icon: BarChart3,
      },
      {
        label: "SLA reports",
        href: "/demo/reports?scope=institution#sla-reports",
        icon: Clock3,
      },
      {
        label: "Service reports",
        href: "/demo/reports?scope=institution#service-reports",
        icon: FileText,
      },
      {
        label: "Officer reports",
        href: "/demo/reports?scope=institution#officer-reports",
        icon: UsersRound,
      },
      {
        label: "Export centre",
        href: "/demo/reports?scope=institution#export",
        icon: FileCheck2,
      },
    ],
  },
  {
    label: "Data",
    items: [
      {
        label: "Records",
        href: "/demo/reports?scope=institution#records",
        icon: FileText,
      },
      {
        label: "Audit logs",
        href: "/demo/reports?scope=institution#audit",
        icon: StickyNote,
      },
      {
        label: "Activity logs",
        href: "/demo/reports?scope=institution#activity",
        icon: ListChecks,
      },
    ],
  },
  account("/demo/reports?scope=institution"),
];

export function getInternalNavigation(
  role: InternalShellRole,
): readonly InternalNavigationGroup[] {
  if (role === "APPLICANT") return applicantNavigation;
  if (role === "DEPARTMENT") return departmentNavigation;
  if (role === "SUPERVISOR") return supervisorNavigation;
  if (role === "ADMIN") return adminNavigation;
  return officerNavigation;
}

function hrefPath(href: string) {
  return href.split(/[?#]/, 1)[0] ?? href;
}

export function isInternalNavigationItemActive({
  pathname,
  item,
}: {
  readonly pathname: string;
  readonly item: InternalNavigationItem;
}): boolean {
  if (item.href.includes("#")) return false;

  const itemPath = hrefPath(item.href);

  if (item.exact) return pathname === itemPath;
  if (pathname === itemPath) return true;

  return Boolean(
    item.activePrefixes?.some((prefix) =>
      pathname.startsWith(prefix),
    ),
  );
}
