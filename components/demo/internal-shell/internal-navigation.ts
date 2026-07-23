import {
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
  | "OFFICER"
  | "DEPARTMENT"
  | "SUPERVISOR";

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

const accountNavigation: InternalNavigationGroup = {
  label: "Account",
  items: [
    {
      label: "My profile",
      href: "/demo/officer#profile",
      icon: UserRound,
    },
    {
      label: "Settings",
      href: "/demo/officer#settings",
      icon: Settings,
    },
    {
      label: "Help centre",
      href: "/demo",
      icon: CircleHelp,
    },
    {
      label: "Log out",
      href: "/demo",
      icon: LogOut,
    },
  ],
};

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
      {
        label: "My tasks",
        href: "/demo/officer#my-tasks",
        icon: ListChecks,
      },
      {
        label: "Application queue",
        href: "/demo/officer#application-queue",
        icon: ClipboardCheck,
        activePrefixes: [
          "/demo/officer/requests/",
        ],
        badge: "4",
      },
    ],
  },
  {
    label: "Workflow",
    items: [
      {
        label: "Workflow inbox",
        href: "/demo/department",
        icon: Inbox,
        badge: "1",
      },
      {
        label: "Approval queue",
        href: "/demo/supervisor#approval-queue",
        icon: ShieldCheck,
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
        label: "Notifications",
        href: "/demo/officer#notifications",
        icon: Bell,
        badge: "5",
      },
    ],
  },
  {
    label: "Reporting",
    items: [
      {
        label: "Operational reports",
        href: "/demo/reports",
        icon: BarChart3,
      },
    ],
  },
  accountNavigation,
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
      {
        label: "My tasks",
        href: "/demo/department#my-tasks",
        icon: ListChecks,
      },
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
      {
        label: "Incoming",
        href: "/demo/department",
        icon: Inbox,
        exact: true,
      },
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
  {
    label: "Communication",
    items: [
      {
        label: "Applicant messages",
        href: "/demo/department#applicant-messages",
        icon: MessageSquareText,
      },
      {
        label: "Internal notes",
        href: "/demo/department#internal-notes",
        icon: StickyNote,
      },
    ],
  },
  {
    label: "Reporting",
    items: [
      {
        label: "Operational reports",
        href: "/demo/reports",
        icon: BarChart3,
      },
    ],
  },
  accountNavigation,
];

const supervisorNavigation: readonly InternalNavigationGroup[] = [
  {
    label: "Operations",
    items: [
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
        activePrefixes: [
          "/demo/supervisor/approvals/",
        ],
        badge: "1",
      },
    ],
  },
  {
    label: "Workflow",
    items: [
      {
        label: "Workflow inbox",
        href: "/demo/department",
        icon: Inbox,
      },
      {
        label: "Returned for clarification",
        href: "/demo/supervisor#returned-for-clarification",
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
        label: "Operational reports",
        href: "/demo/reports",
        icon: BarChart3,
      },
    ],
  },
  accountNavigation,
];

export function getInternalNavigation(
  role: InternalShellRole,
): readonly InternalNavigationGroup[] {
  if (role === "DEPARTMENT") {
    return departmentNavigation;
  }

  if (role === "SUPERVISOR") {
    return supervisorNavigation;
  }

  return officerNavigation;
}

export function isInternalNavigationItemActive({
  pathname,
  item,
}: {
  readonly pathname: string;
  readonly item: InternalNavigationItem;
}): boolean {
  if (item.href.includes("#")) {
    return false;
  }

  if (item.exact) {
    return pathname === item.href;
  }

  if (pathname === item.href) {
    return true;
  }

  return Boolean(
    item.activePrefixes?.some((prefix) =>
      pathname.startsWith(prefix),
    ),
  );
}
