import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  SUPERVISOR_NAVIGATION_CONTRACT,
  SUPERVISOR_NAVIGATION_ITEMS,
  SUPERVISOR_NAVIGATION_ROUTE_ITEMS,
  SUPERVISOR_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/supervisor-navigation-contract";
import {
  getInternalNavigation,
  isInternalNavigationItemActive,
  type InternalNavigationItem,
} from "../../../components/demo/internal-shell/internal-navigation";

const repositoryRoot = process.cwd();

function supervisorNavigation() {
  return getInternalNavigation("SUPERVISOR");
}

function flattenedSupervisorItems() {
  return supervisorNavigation().flatMap((group) => group.items);
}

function navigationItem(id: string): InternalNavigationItem {
  const item = flattenedSupervisorItems().find(
    (candidate) => candidate.id === id,
  );

  if (!item) {
    throw new Error(`Missing supervisor navigation item: ${id}`);
  }

  return item;
}

describe("D33-4 supervisor navigation activation", () => {
  it("makes the live sidebar consume the canonical supervisor contract", () => {
    expect(
      supervisorNavigation().map((group) => ({
        label: group.label,
        items: group.items.map((item) => item.label),
      })),
    ).toEqual(
      SUPERVISOR_NAVIGATION_CONTRACT.map((group) => ({
        label: group.label,
        items: group.items.map((item) => item.label),
      })),
    );
  });

  it("exposes exactly five groups and fourteen visible items", () => {
    expect(supervisorNavigation()).toHaveLength(5);
    expect(flattenedSupervisorItems()).toHaveLength(14);
    expect(
      flattenedSupervisorItems().filter((item) => item.kind === "route"),
    ).toHaveLength(13);
    expect(
      flattenedSupervisorItems().filter((item) => item.kind === "action"),
    ).toHaveLength(1);
  });

  it("preserves stable IDs, icons, routes, and active metadata", () => {
    const liveItems = flattenedSupervisorItems();

    expect(liveItems).toHaveLength(SUPERVISOR_NAVIGATION_ITEMS.length);

    for (const contractItem of SUPERVISOR_NAVIGATION_ITEMS) {
      const liveItem = liveItems.find(
        (candidate) => candidate.id === contractItem.id,
      );

      expect(liveItem).toBeDefined();
      expect(liveItem?.label).toBe(contractItem.label);
      expect(liveItem?.icon).toBe(contractItem.icon);
      expect(liveItem?.kind).toBe(contractItem.kind);

      if (contractItem.kind === "route") {
        expect(liveItem?.href).toBe(contractItem.href);
        expect(liveItem?.exact).toBe(contractItem.exactMatch);
        expect(liveItem?.activePrefixes).toEqual(contractItem.activePrefixes);
        expect(liveItem?.legacyAliases).toEqual(contractItem.legacyAliases);
      } else {
        expect(liveItem?.action).toBe("logout");
        expect(liveItem?.href).toBeUndefined();
      }
    }
  });

  it("keeps all thirteen route destinations inside the supervisor namespace", () => {
    expect(SUPERVISOR_NAVIGATION_ROUTE_ITEMS).toHaveLength(13);

    for (const item of flattenedSupervisorItems()) {
      if (item.kind !== "route") {
        continue;
      }

      expect(item.href?.startsWith("/demo/supervisor")).toBe(true);
      expect(item.href).not.toContain("#");
      expect(item.href).not.toContain("?");
      expect(item.href).not.toContain("/demo/officer");
      expect(item.href).not.toContain("/demo/department");
      expect(item.href).not.toContain("/demo/reports");
      expect(item.href).not.toContain("/demo/outcomes");
    }
  });

  it("keeps Department Dashboard exact and inactive on descendants", () => {
    const dashboard = navigationItem("department-dashboard");

    expect(
      isInternalNavigationItemActive({
        pathname: SUPERVISOR_ROUTE_HREFS.home,
        item: dashboard,
      }),
    ).toBe(true);

    expect(
      isInternalNavigationItemActive({
        pathname: SUPERVISOR_ROUTE_HREFS.departmentQueue,
        item: dashboard,
      }),
    ).toBe(false);
  });

  it("activates every canonical route on its own path", () => {
    for (const item of flattenedSupervisorItems()) {
      if (item.kind !== "route" || !item.href) {
        continue;
      }

      expect(
        isInternalNavigationItemActive({
          pathname: item.href,
          item,
        }),
      ).toBe(true);
    }
  });

  it("assigns the legacy approval route and descendants to Approval Queue", () => {
    const approvalQueue = navigationItem("approval-queue");

    expect(
      isInternalNavigationItemActive({
        pathname: "/demo/supervisor/approvals",
        item: approvalQueue,
      }),
    ).toBe(true);

    expect(
      isInternalNavigationItemActive({
        pathname: "/demo/supervisor/approvals/REQ-DEMO-001",
        item: approvalQueue,
      }),
    ).toBe(true);

    expect(
      isInternalNavigationItemActive({
        pathname: "/demo/supervisor/escalations",
        item: approvalQueue,
      }),
    ).toBe(false);
  });

  it("treats Log Out as an action with no active route", () => {
    const logout = navigationItem("log-out");

    expect(logout.kind).toBe("action");
    expect(logout.action).toBe("logout");
    expect(logout.href).toBeUndefined();

    expect(
      isInternalNavigationItemActive({
        pathname: "/demo",
        item: logout,
      }),
    ).toBe(false);
  });

  it("uses the same live navigation source for desktop and mobile", () => {
    const sidebar = fs.readFileSync(
      path.join(
        repositoryRoot,
        "components/demo/internal-shell/internal-sidebar.tsx",
      ),
      "utf8",
    );

    expect(sidebar).toContain(
      "const navigation = getInternalNavigation(role);",
    );
    expect(sidebar).toContain("readonly mobileOpen: boolean;");
    expect(sidebar).toContain("mobileOpen,");
    expect(sidebar).toContain("mobileOpen ? styles.sidebarMobileOpen :");
    expect(sidebar).toContain("onMobileClose");
    expect(sidebar).not.toContain("getMobileInternalNavigation");
  });

  it("removes the old hard-coded supervisor navigation block", () => {
    const source = fs.readFileSync(
      path.join(
        repositoryRoot,
        "components/demo/internal-shell/internal-navigation.ts",
      ),
      "utf8",
    );

    const supervisorStart = source.indexOf("const supervisorNavigation:");
    const adminStart = source.indexOf(
      "const adminNavigation:",
      supervisorStart,
    );

    expect(supervisorStart).toBeGreaterThanOrEqual(0);
    expect(adminStart).toBeGreaterThan(supervisorStart);

    const supervisorBlock = source.slice(supervisorStart, adminStart);

    expect(supervisorBlock).toContain("SUPERVISOR_NAVIGATION_CONTRACT.map");
    expect(supervisorBlock).not.toContain('href: "/demo/supervisor#my-tasks"');
    expect(supervisorBlock).not.toContain(
      'href: "/demo/officer/requests/REQ-DEMO-001"',
    );
    expect(supervisorBlock).not.toContain(
      'href: "/demo/outcomes/REQ-DEMO-001"',
    );
    expect(supervisorBlock).not.toContain(
      'href: "/demo/reports?scope=department"',
    );
    expect(supervisorBlock).not.toContain('href: "/demo/department"');
  });
});
