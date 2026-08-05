import {
  BarChart3,
  Building2,
  Clock3,
  Inbox,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { describe, expect, it } from "vitest";

import { DEMO_ROUTES } from "../../../features/demo-engine/navigation/demo-route-registry";
import {
  SUPERVISOR_LEGACY_ROUTE_ALIASES,
  SUPERVISOR_LEGACY_ROUTE_HREFS,
  SUPERVISOR_NAVIGATION_ACTION_ITEMS,
  SUPERVISOR_NAVIGATION_CONTRACT,
  SUPERVISOR_NAVIGATION_GROUP_IDS,
  SUPERVISOR_NAVIGATION_ITEMS,
  SUPERVISOR_NAVIGATION_ROUTE_ITEMS,
  SUPERVISOR_ROUTE_HREFS,
  SUPERVISOR_ROUTE_KEYS,
  isSupervisorRoutePath,
  resolveSupervisorLegacyAlias,
} from "../../../features/demo-engine/navigation/supervisor-navigation-contract";

const expectedGroups = [
  {
    id: "operations",
    label: "Operations",
    items: [
      "Department Dashboard",
      "Department Queue",
      "Unassigned Work",
      "Team Workload",
    ],
  },
  {
    id: "workflow",
    label: "Workflow",
    items: [
      "Approval Queue",
      "Escalations",
      "Department Handoffs",
      "Shared Work",
    ],
  },
  {
    id: "performance",
    label: "Performance",
    items: [
      "SLA Monitor",
      "Overdue Work",
      "Officer Performance",
      "Department Reports",
    ],
  },
  {
    id: "oversight",
    label: "Oversight",
    items: ["Audit Trail"],
  },
  {
    id: "account",
    label: "Account",
    items: ["Log Out"],
  },
] as const;

function expectUnique(values: readonly string[]) {
  expect(new Set(values).size).toBe(values.length);
}

describe("D33-1 supervisor navigation contract", () => {
  it("locks the exact group and item order", () => {
    expect(SUPERVISOR_NAVIGATION_CONTRACT).toHaveLength(5);
    expect(SUPERVISOR_NAVIGATION_ITEMS).toHaveLength(14);
    expect(
      SUPERVISOR_NAVIGATION_CONTRACT.map(({ id, label, items }) => ({
        id,
        label,
        items: items.map((item) => item.label),
      })),
    ).toEqual(expectedGroups);
  });

  it("keeps group IDs, item IDs, route keys, and hrefs unique", () => {
    expectUnique([...SUPERVISOR_NAVIGATION_GROUP_IDS]);
    expectUnique(SUPERVISOR_NAVIGATION_CONTRACT.map((group) => group.id));
    expectUnique(SUPERVISOR_NAVIGATION_ITEMS.map((item) => item.id));
    expectUnique([...SUPERVISOR_ROUTE_KEYS]);
    expectUnique(
      SUPERVISOR_NAVIGATION_ROUTE_ITEMS.map((item) => item.routeKey),
    );
    expectUnique(SUPERVISOR_NAVIGATION_ROUTE_ITEMS.map((item) => item.href));
  });

  it("contains 13 canonical routes and one logout action", () => {
    expect(SUPERVISOR_NAVIGATION_ROUTE_ITEMS).toHaveLength(13);
    expect(SUPERVISOR_NAVIGATION_ACTION_ITEMS).toHaveLength(1);
    expect(SUPERVISOR_NAVIGATION_ACTION_ITEMS[0]).toMatchObject({
      id: "log-out",
      label: "Log Out",
      kind: "action",
      action: "logout",
    });
    expect("href" in SUPERVISOR_NAVIGATION_ACTION_ITEMS[0]).toBe(false);
  });

  it("allows only clean canonical supervisor-owned routes", () => {
    const forbiddenSegments = [
      "/demo/officer",
      "/demo/department",
      "/demo/admin",
      "/demo/applicant",
      "/demo/reports",
      "/demo/outcomes",
      "/demo/verify-certificate",
    ];
    const hardCodedRequestId = /\/(?:REQ|REQUEST|CASE|APP)-[A-Z0-9-]+(?:\/|$)/i;

    for (const item of SUPERVISOR_NAVIGATION_ROUTE_ITEMS) {
      expect(item.href.startsWith("/demo/supervisor")).toBe(true);
      expect(item.href).not.toContain("#");
      expect(item.href).not.toContain("?");
      expect(item.href).not.toMatch(hardCodedRequestId);
      expect(item.href).not.toBe("/demo");

      for (const forbidden of forbiddenSegments) {
        expect(item.href.startsWith(forbidden)).toBe(false);
      }
    }
  });

  it("locks preserved and assigned Lucide icons", () => {
    const expectedIcons = {
      "department-dashboard": LayoutDashboard,
      "department-queue": Building2,
      "unassigned-work": Inbox,
      "team-workload": UsersRound,
      "approval-queue": ShieldCheck,
      escalations: Clock3,
      "department-handoffs": Building2,
      "shared-work": UsersRound,
      "sla-monitor": LayoutDashboard,
      "overdue-work": Clock3,
      "officer-performance": BarChart3,
      "department-reports": BarChart3,
      "audit-trail": LayoutDashboard,
      "log-out": LogOut,
    } as const;

    for (const item of SUPERVISOR_NAVIGATION_ITEMS) {
      expect(item.icon).toBe(
        expectedIcons[item.id as keyof typeof expectedIcons],
      );
    }
  });

  it("makes DEMO_ROUTES.supervisor consume canonical constants", () => {
    for (const routeKey of SUPERVISOR_ROUTE_KEYS) {
      expect(DEMO_ROUTES.supervisor[routeKey]).toBe(
        SUPERVISOR_ROUTE_HREFS[routeKey],
      );
    }

    expect(DEMO_ROUTES.supervisor.approvals).toBe(
      SUPERVISOR_LEGACY_ROUTE_HREFS.approvals,
    );
    expect(DEMO_ROUTES.supervisor.audit).toBe(
      SUPERVISOR_ROUTE_HREFS.auditTrail,
    );
    expect(DEMO_ROUTES.supervisor.sla).toBe(SUPERVISOR_ROUTE_HREFS.slaMonitor);
  });

  it("records the existing approvals route as a legacy alias", () => {
    expect(SUPERVISOR_LEGACY_ROUTE_ALIASES).toEqual({
      "/demo/supervisor/approvals": SUPERVISOR_ROUTE_HREFS.approvalQueue,
    });
    expect(resolveSupervisorLegacyAlias("/demo/supervisor/approvals")).toBe(
      SUPERVISOR_ROUTE_HREFS.approvalQueue,
    );
    expect(
      resolveSupervisorLegacyAlias("/demo/supervisor/department-queue"),
    ).toBeNull();
  });

  it("recognizes only the supervisor route namespace", () => {
    expect(isSupervisorRoutePath("/demo/supervisor")).toBe(true);
    expect(
      isSupervisorRoutePath("/demo/supervisor/department-queue?filter=open"),
    ).toBe(true);
    expect(isSupervisorRoutePath("/demo/supervisor/audit-trail#latest")).toBe(
      true,
    );
    expect(isSupervisorRoutePath("/demo/officer")).toBe(false);
    expect(isSupervisorRoutePath("/demo/department")).toBe(false);
  });

  it("assigns legacy approval descendants to Approval Queue", () => {
    const approvalQueue = SUPERVISOR_NAVIGATION_ROUTE_ITEMS.find(
      (item) => item.id === "approval-queue",
    );

    expect(approvalQueue?.activePrefixes).toEqual([
      "/demo/supervisor/approvals/",
    ]);
    expect(approvalQueue?.legacyAliases).toEqual([
      "/demo/supervisor/approvals",
    ]);
  });

  it("uses exact matching only for Department Dashboard", () => {
    expect(
      SUPERVISOR_NAVIGATION_ROUTE_ITEMS.filter((item) => item.exactMatch).map(
        (item) => item.id,
      ),
    ).toEqual(["department-dashboard"]);
  });
});
