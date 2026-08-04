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
} from "lucide-react";
import { describe, expect, it } from "vitest";

import {
  OFFICER_LEGACY_ROUTE_ALIASES,
  OFFICER_NAVIGATION_ACTION_ITEMS,
  OFFICER_NAVIGATION_CONTRACT,
  OFFICER_NAVIGATION_GROUP_IDS,
  OFFICER_NAVIGATION_ITEMS,
  OFFICER_NAVIGATION_ROUTE_ITEMS,
  OFFICER_ROUTE_HREFS,
  OFFICER_ROUTE_KEYS,
  resolveOfficerLegacyAlias,
} from "../../../features/demo-engine/navigation/officer-navigation-contract";
import { DEMO_ROUTES } from "../../../features/demo-engine/navigation/demo-route-registry";

const expectedGroups = [
  {
    id: "operations",
    label: "Operations",
    items: [
      "Dashboard",
      "My Tasks",
      "Application Queue",
      "SLA Monitor",
      "Overdue Tasks",
    ],
  },
  {
    id: "workflow",
    label: "Workflow",
    items: [
      "Workflow Inbox",
      "Shared Work",
      "Approval Queue",
      "Returned to Applicant",
    ],
  },
  {
    id: "documents",
    label: "Documents",
    items: [
      "Document Review",
      "Generated PDFs",
      "Issued Documents",
      "QR Verification",
    ],
  },
  {
    id: "communication-account",
    label: "Communication & Account",
    items: ["Applicant Messages", "Internal Notes", "Log Out"],
  },
] as const;

function expectUnique(values: readonly string[]) {
  expect(new Set(values).size).toBe(values.length);
}

describe("D32-1 officer navigation contract", () => {
  it("locks the exact group and item order", () => {
    expect(OFFICER_NAVIGATION_CONTRACT).toHaveLength(4);
    expect(OFFICER_NAVIGATION_ITEMS).toHaveLength(16);
    expect(
      OFFICER_NAVIGATION_CONTRACT.map(({ id, label, items }) => ({
        id,
        label,
        items: items.map((item) => item.label),
      })),
    ).toEqual(expectedGroups);
  });

  it("keeps group IDs, item IDs, route keys and hrefs unique", () => {
    expectUnique([...OFFICER_NAVIGATION_GROUP_IDS]);
    expectUnique(OFFICER_NAVIGATION_CONTRACT.map((group) => group.id));
    expectUnique(OFFICER_NAVIGATION_ITEMS.map((item) => item.id));
    expectUnique([...OFFICER_ROUTE_KEYS]);
    expectUnique(OFFICER_NAVIGATION_ROUTE_ITEMS.map((item) => item.routeKey));
    expectUnique(OFFICER_NAVIGATION_ROUTE_ITEMS.map((item) => item.href));
  });

  it("contains 15 canonical routes and one logout action", () => {
    expect(OFFICER_NAVIGATION_ROUTE_ITEMS).toHaveLength(15);
    expect(OFFICER_NAVIGATION_ACTION_ITEMS).toHaveLength(1);
    expect(OFFICER_NAVIGATION_ACTION_ITEMS[0]).toMatchObject({
      id: "log-out",
      label: "Log Out",
      kind: "action",
      action: "logout",
    });
    expect("href" in OFFICER_NAVIGATION_ACTION_ITEMS[0]).toBe(false);
  });

  it("allows only clean canonical officer-owned routes", () => {
    const forbiddenSegments = [
      "/demo/department",
      "/demo/supervisor",
      "/demo/admin",
      "/demo/applicant",
      "/demo/reports",
      "/demo/outcomes",
      "/demo/verify-certificate",
    ];
    const hardCodedRequestId = /\/(?:REQ|REQUEST|CASE|APP)-[A-Z0-9-]+(?:\/|$)/i;

    for (const item of OFFICER_NAVIGATION_ROUTE_ITEMS) {
      expect(item.href.startsWith("/demo/officer")).toBe(true);
      expect(item.href).not.toContain("#");
      expect(item.href).not.toContain("?");
      expect(item.href).not.toMatch(hardCodedRequestId);
      expect(item.href).not.toBe("/demo");

      for (const forbidden of forbiddenSegments) {
        expect(item.href.startsWith(forbidden)).toBe(false);
      }
    }
  });

  it("preserves matching live Lucide assignments and locks the new QR icon", () => {
    const expectedIcons = {
      dashboard: LayoutDashboard,
      "my-tasks": ListChecks,
      "application-queue": ClipboardCheck,
      "sla-monitor": Clock3,
      "overdue-tasks": Clock3,
      "workflow-inbox": Inbox,
      "shared-work": UsersRound,
      "approval-queue": ShieldCheck,
      "returned-to-applicant": Clock3,
      "document-review": FileText,
      "generated-pdfs": FileCheck2,
      "issued-documents": FileCheck2,
      "qr-verification": QrCode,
      "applicant-messages": MessageSquareText,
      "internal-notes": StickyNote,
      "log-out": LogOut,
    } as const;

    for (const item of OFFICER_NAVIGATION_ITEMS) {
      expect(item.icon).toBe(
        expectedIcons[item.id as keyof typeof expectedIcons],
      );
    }
  });

  it("makes DEMO_ROUTES.officer consume the canonical constants", () => {
    for (const routeKey of OFFICER_ROUTE_KEYS) {
      expect(DEMO_ROUTES.officer[routeKey]).toBe(OFFICER_ROUTE_HREFS[routeKey]);
    }
  });

  it("resolves both SLA aliases to the canonical SLA route", () => {
    expect(OFFICER_LEGACY_ROUTE_ALIASES).toEqual({
      "/demo/officer/sla": OFFICER_ROUTE_HREFS.sla,
      "/demo/officer/reports/sla": OFFICER_ROUTE_HREFS.sla,
    });
    expect(resolveOfficerLegacyAlias("/demo/officer/sla")).toBe(
      OFFICER_ROUTE_HREFS.sla,
    );
    expect(resolveOfficerLegacyAlias("/demo/officer/reports/sla")).toBe(
      OFFICER_ROUTE_HREFS.sla,
    );
    expect(resolveOfficerLegacyAlias("/demo/officer/tasks")).toBeNull();
  });

  it("assigns request descendants to Application Queue", () => {
    const applicationQueue = OFFICER_NAVIGATION_ROUTE_ITEMS.find(
      (item) => item.id === "application-queue",
    );

    expect(applicationQueue?.activePrefixes).toEqual([
      "/demo/officer/requests/",
    ]);
    expect(applicationQueue?.exactMatch).toBe(false);
  });

  it("locks exact matching to Dashboard, My Tasks and Shared Work", () => {
    expect(
      OFFICER_NAVIGATION_ROUTE_ITEMS.filter((item) => item.exactMatch).map(
        (item) => item.id,
      ),
    ).toEqual(["dashboard", "my-tasks", "shared-work"]);
  });
});
