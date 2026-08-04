import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  getOfficerRequestHref,
  getOfficerRequestReferralHref,
  isOfficerRoutePath,
  OFFICER_NAVIGATION_CONTRACT,
  OFFICER_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/officer-navigation-contract";
import {
  resolveDemoRoleFromPath,
} from "../../../features/demo-engine/navigation/demo-route-registry";
import { getInternalSidebarBrandHref } from "../../../components/demo/internal-shell/internal-sidebar";

const repositoryRoot = fileURLToPath(
  new URL("../../../", import.meta.url),
);
const source = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), "utf8");

const officerLinkSources = [
  "features/demo-engine/fixtures/officer-dashboard.reference.ts",
  "features/demo/view-models/officer-dashboard-view-model.ts",
  "features/demo-engine/dashboards/data/officer-dashboard.adapter.ts",
  "features/demo-engine/dashboards/officer/officer-dashboard.tsx",
  "features/demo-engine/dashboards/officer/high-fidelity/OfficerDashboardHighFidelity.tsx",
  "features/demo-operations/components/officer-shared-work-workspace.tsx",
  "features/demo-operations/components/officer-sla-workspace-fixed.tsx",
  "components/demo/officer/individual-case/officer-individual-case-shell.tsx",
  "features/officer-review/components/officer-review-referral-body.tsx",
] as const;

const forbiddenOfficerDestinations = [
  "/demo/department",
  "/demo/outcomes",
  "/demo/reports",
  "/demo/verify-certificate",
  "/demo/officer#",
  "/demo/officer/department-inbox",
  "/demo/officer/reports",
] as const;

function hasLogoutPage(directory: string): boolean {
  return readdirSync(directory, { withFileTypes: true }).some((entry) => {
    const entryPath = resolve(directory, entry.name);

    return entry.isDirectory()
      ? entry.name === "logout" || hasLogoutPage(entryPath)
      : false;
  });
}

describe("D32-5 officer link consolidation", () => {
  it("keeps the canonical navigation inventory unchanged", () => {
    const workflowItems = OFFICER_NAVIGATION_CONTRACT[1].items;
    const itemCount = OFFICER_NAVIGATION_CONTRACT.reduce(
      (total, group) => total + group.items.length,
      0,
    );
    const routeCount = OFFICER_NAVIGATION_CONTRACT.reduce(
      (total, group) =>
        total + group.items.filter((item) => item.kind === "route").length,
      0,
    );
    const actionCount = OFFICER_NAVIGATION_CONTRACT.reduce(
      (total, group) =>
        total + group.items.filter((item) => item.kind === "action").length,
      0,
    );

    expect(OFFICER_NAVIGATION_CONTRACT).toHaveLength(4);
    expect(itemCount).toBe(16);
    expect(routeCount).toBe(15);
    expect(actionCount).toBe(1);
    expect(workflowItems.find((item) => item.id === "shared-work")).toMatchObject({
      label: "Shared Work",
      href: OFFICER_ROUTE_HREFS.sharedWork,
    });
  });

  it("builds encoded officer request and referral hrefs", () => {
    expect(getOfficerRequestHref("REQ DEMO/001")).toBe(
      "/demo/officer/requests/REQ%20DEMO%2F001",
    );
    expect(getOfficerRequestReferralHref("REQ DEMO/001")).toBe(
      "/demo/officer/requests/REQ%20DEMO%2F001?view=refer",
    );
  });

  it("keeps ordinary officer sources contract-backed and inside the officer tree", () => {
    for (const path of officerLinkSources) {
      const fileSource = source(path);

      for (const destination of forbiddenOfficerDestinations) {
        expect(fileSource).not.toContain(destination);
      }
    }

    expect(source("features/demo-operations/components/operational-workspaces.tsx")).toContain(
      "getOfficerRequestReferralHref",
    );
    expect(source("features/demo-operations/components/operational-workspaces.tsx")).toContain(
      "OFFICER_ROUTE_HREFS.workflowInbox",
    );
    expect(source("features/demo-engine/dashboards/data/officer-dashboard.adapter.ts")).not.toContain(
      "requestHref(",
    );
  });

  it("classifies the remaining external role and action exceptions explicitly", () => {
    const legacyOfficerDashboard = source(
      "components/demo/officer/officer-dashboard.tsx",
    );
    const sidebarSource = source(
      "components/demo/internal-shell/internal-sidebar.tsx",
    );
    const operationalSource = source(
      "features/demo-operations/components/operational-workspaces.tsx",
    );

    expect(legacyOfficerDashboard).toContain('value="/demo/department"');
    expect(legacyOfficerDashboard).toContain('value="/demo/supervisor"');
    expect(sidebarSource).toContain('router.push("/demo")');
    expect(operationalSource).toContain('href="/demo/supervisor"');
    expect(operationalSource).toContain('href="/demo/supervisor/audit-trail"');
  });

  it("keeps the officer brand in its workspace and other brand behavior unchanged", () => {
    expect(getInternalSidebarBrandHref("OFFICER")).toBe(
      OFFICER_ROUTE_HREFS.home,
    );
    expect(getInternalSidebarBrandHref("SUPERVISOR")).toBe("/demo");
    expect(getInternalSidebarBrandHref("ADMIN")).toBe("/demo");
  });

  it("resolves every officer route to Officer in both route systems", () => {
    const paths = [
      ...Object.values(OFFICER_ROUTE_HREFS),
      "/demo/officer/requests/REQ-DEMO-001",
      "/demo/officer/requests/REQ-DEMO-001?view=refer",
      "/demo/officer/documents",
      "/demo/officer/sla",
      "/demo/officer/reports/sla",
    ];
    const workspaceRoleSource = source(
      "features/demo/roles/demo-workspace-role.tsx",
    );

    expect(workspaceRoleSource).toContain("isOfficerRoutePath");

    for (const path of paths) {
      expect(isOfficerRoutePath(path)).toBe(true);
      expect(resolveDemoRoleFromPath(path)).toBe("officer");
    }
  });

  it("retains compatibility routes without reintroducing a logout route", () => {
    expect(source("app/demo/officer/sla/page.tsx")).toContain(
      'redirect("/demo/officer/sla-monitor")',
    );
    expect(source("app/demo/officer/reports/sla/page.tsx")).toContain(
      'redirect("/demo/officer/sla-monitor")',
    );
    expect(source("app/demo/officer/documents/page.tsx")).toContain(
      "OfficerDocumentHub",
    );
    expect(hasLogoutPage(resolve(repositoryRoot, "app/demo/officer"))).toBe(false);
  });
});
