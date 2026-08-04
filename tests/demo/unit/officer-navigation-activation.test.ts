import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  OFFICER_NAVIGATION_CONTRACT,
  OFFICER_NAVIGATION_ROUTE_ITEMS,
  OFFICER_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/officer-navigation-contract";
import {
  getInternalNavigation,
  isInternalNavigationItemActive,
} from "../../../components/demo/internal-shell/internal-navigation";

const repositoryRoot = fileURLToPath(
  new URL("../../../", import.meta.url),
);
const officerAppRoot = resolve(repositoryRoot, "app/demo/officer");
const navigationSource = readFileSync(
  resolve(
    repositoryRoot,
    "components/demo/internal-shell/internal-navigation.ts",
  ),
  "utf8",
);
const sidebarSource = readFileSync(
  resolve(
    repositoryRoot,
    "components/demo/internal-shell/internal-sidebar.tsx",
  ),
  "utf8",
);

const obsoleteOfficerLabels = [
  "Shared workflows",
  "Review invitations",
  "Ask for feedback",
  "Uploaded documents",
  "Due soon tasks",
  "Correspondence",
  "Notification log",
  "Workflow invites",
  "Feedback requests",
  "Knowledge base",
  "Bulk actions",
  "Service rules",
  "My profile",
  "Settings",
  "Help centre",
] as const;

function officerNavigation() {
  return getInternalNavigation("OFFICER");
}

function officerItems() {
  return officerNavigation().flatMap((group) => group.items);
}

function activeOfficerItemIds(pathname: string) {
  return officerItems()
    .filter((item) =>
      isInternalNavigationItemActive({ pathname, item }),
    )
    .map((item) => item.id);
}

function containsLogoutPage(directory: string): boolean {
  return readdirSync(directory, { withFileTypes: true }).some((entry) => {
    const path = resolve(directory, entry.name);

    return entry.isDirectory()
      ? entry.name === "logout" || containsLogoutPage(path)
      : false;
  });
}

describe("D32-3 officer navigation activation", () => {
  it("adapts the live officer sidebar directly from the canonical contract", () => {
    const visible = officerNavigation().map((group) => ({
      label: group.label,
      items: group.items.map((item) => ({
        id: item.id,
        kind: item.kind,
        action: item.action,
        label: item.label,
        href: item.href,
        icon: item.icon,
        exact: item.exact,
        activePrefixes: item.activePrefixes,
        legacyAliases: item.legacyAliases,
      })),
    }));
    const expected = OFFICER_NAVIGATION_CONTRACT.map((group) => ({
      label: group.label,
      items: group.items.map((item) =>
        item.kind === "route"
          ? {
              id: item.id,
              kind: item.kind,
              action: undefined,
              label: item.label,
              href: item.href,
              icon: item.icon,
              exact: item.exactMatch,
              activePrefixes: item.activePrefixes,
              legacyAliases: item.legacyAliases,
            }
          : {
              id: item.id,
              kind: item.kind,
              action: item.action,
              label: item.label,
              href: undefined,
              icon: item.icon,
              exact: undefined,
              activePrefixes: undefined,
              legacyAliases: undefined,
            },
      ),
    }));

    expect(visible).toEqual(expected);
    expect(navigationSource).toContain("OFFICER_NAVIGATION_CONTRACT");
    expect(navigationSource).not.toContain("Documents Hub");
  });

  it("contains four groups, fifteen links, and one logout action in contract order", () => {
    const groups = officerNavigation();
    const items = officerItems();
    const routeItems = items.filter((item) => item.kind === "route");
    const actionItems = items.filter((item) => item.kind === "action");

    expect(groups).toHaveLength(4);
    expect(items).toHaveLength(16);
    expect(routeItems).toHaveLength(15);
    expect(actionItems).toHaveLength(1);
    expect(actionItems[0]).toMatchObject({
      id: "log-out",
      action: "logout",
      label: "Log Out",
    });
    expect(actionItems[0]?.href).toBeUndefined();
  });

  it("keeps all officer link destinations clean and officer-owned", () => {
    const hardCodedRequestId = /\/(?:REQ|REQUEST|CASE|APP)-[A-Z0-9-]+(?:\/|$)/i;
    const routeItems = officerItems().filter(
      (item) => item.kind === "route",
    );

    for (const item of routeItems) {
      expect(item.href?.startsWith("/demo/officer/") || item.href === "/demo/officer").toBe(true);
      expect(item.href).not.toContain("#");
      expect(item.href).not.toContain("?");
      expect(item.href).not.toMatch(hardCodedRequestId);
    }
  });

  it("renders logout as the only navigation action and keeps it out of the active state", () => {
    expect(sidebarSource).toContain('if (item.kind === "action")');
    expect(sidebarSource).toContain("<button");
    expect(sidebarSource).toContain("handleDemoLogout");
    expect(sidebarSource).toContain("onMobileClose();");
    expect(sidebarSource).toContain('router.push("/demo")');
    expect(activeOfficerItemIds("/demo/officer")).not.toContain("log-out");
    expect(containsLogoutPage(officerAppRoot)).toBe(false);
  });

  it("removes all obsolete officer-only sidebar labels", () => {
    const labels = officerItems().map((item) => item.label);

    for (const label of obsoleteOfficerLabels) {
      expect(labels).not.toContain(label);
    }
  });

  it("assigns exactly one active item to every canonical route", () => {
    for (const item of OFFICER_NAVIGATION_ROUTE_ITEMS) {
      expect(activeOfficerItemIds(item.href)).toEqual([item.id]);
    }
  });

  it("keeps queue request descendants and compatibility aliases with their intended owners", () => {
    expect(activeOfficerItemIds("/demo/officer/requests/REQ-DEMO-001")).toEqual([
      "application-queue",
    ]);
    expect(activeOfficerItemIds(OFFICER_ROUTE_HREFS.overdueTasks)).toEqual([
      "overdue-tasks",
    ]);
    expect(activeOfficerItemIds(OFFICER_ROUTE_HREFS.sharedWork)).toEqual([
      "shared-work",
    ]);
    expect(activeOfficerItemIds("/demo/officer/sla")).toEqual([
      "sla-monitor",
    ]);
    expect(activeOfficerItemIds("/demo/officer/reports/sla")).toEqual([
      "sla-monitor",
    ]);
  });

  it("uses one navigation source for the desktop sidebar and mobile drawer", () => {
    expect(sidebarSource.match(/getInternalNavigation\(role\)/g)).toHaveLength(1);
    expect(sidebarSource).not.toContain("mobileOfficerNavigation");
    expect(sidebarSource).not.toContain("officerMobileItems");
  });

  it("leaves the other role navigation results available", () => {
    expect(getInternalNavigation("APPLICANT").map((group) => group.label)).toEqual([
      "Main",
      "My activity",
      "Account",
    ]);
    expect(getInternalNavigation("DEPARTMENT").map((group) => group.label)).toEqual([
      "Operations",
      "Workflow",
      "Account",
    ]);
    expect(getInternalNavigation("SUPERVISOR")[0]?.label).toBe("Operations");
    expect(getInternalNavigation("ADMIN")[0]?.label).toBe("Main");
  });
});
