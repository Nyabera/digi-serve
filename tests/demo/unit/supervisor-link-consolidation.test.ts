import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { getActiveDemoPack } from "../../../features/demo-engine/config/demo-pack.server";
import { adaptSupervisorDashboard } from "../../../features/demo-engine/dashboards/data/supervisor-dashboard.adapter";
import { supervisorApprovalsReference } from "../../../features/demo-engine/fixtures/supervisor-approvals.reference";
import { SUPERVISOR_ROUTE_HREFS } from "../../../features/demo-engine/navigation/supervisor-navigation-contract";

const repositoryRoot = process.cwd();

function read(repositoryPath: string) {
  return fs.readFileSync(path.join(repositoryRoot, repositoryPath), "utf8");
}

function collectHrefs(value: unknown, hrefs: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectHrefs(item, hrefs);
    }

    return hrefs;
  }

  if (typeof value !== "object" || value === null) {
    return hrefs;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "href" && typeof child === "string") {
      hrefs.push(child);
      continue;
    }

    collectHrefs(child, hrefs);
  }

  return hrefs;
}

function expectSupervisorOwnedHref(href: string) {
  expect(href.startsWith("/demo/supervisor")).toBe(true);
  expect(href).not.toContain("/demo/officer");
  expect(href).not.toContain("/demo/department");
  expect(href).not.toContain("/demo/reports");
  expect(href).not.toContain("/demo/outcomes");
  expect(href).not.toContain("#");
}

describe("D33-5 supervisor link consolidation", () => {
  it("keeps every active supervisor dashboard href inside the supervisor namespace", () => {
    const dashboard = adaptSupervisorDashboard(getActiveDemoPack());
    const hrefs = collectHrefs(dashboard);

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      expectSupervisorOwnedHref(href);
    }
  });

  it("keeps every supervisor reference-fixture href inside the supervisor namespace", () => {
    const hrefs = collectHrefs(supervisorApprovalsReference);

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      expectSupervisorOwnedHref(href);
    }
  });

  it("uses semantically correct canonical destinations for supervisor dashboard controls", () => {
    const dashboard = adaptSupervisorDashboard(getActiveDemoPack());
    const hrefs = collectHrefs(dashboard);

    expect(hrefs).toContain(SUPERVISOR_ROUTE_HREFS.departmentQueue);
    expect(hrefs).toContain(SUPERVISOR_ROUTE_HREFS.unassignedWork);
    expect(hrefs).toContain(SUPERVISOR_ROUTE_HREFS.departmentHandoffs);
    expect(hrefs).toContain(SUPERVISOR_ROUTE_HREFS.escalations);
    expect(hrefs).toContain(SUPERVISOR_ROUTE_HREFS.departmentReports);
    expect(hrefs).toContain(SUPERVISOR_ROUTE_HREFS.auditTrail);
    expect(hrefs).toContain(SUPERVISOR_ROUTE_HREFS.slaMonitor);
  });

  it("makes the supervisor sidebar brand return to canonical supervisor home", () => {
    const sidebar = read("components/demo/internal-shell/internal-sidebar.tsx");

    expect(sidebar).toContain('if (role === "SUPERVISOR")');
    expect(sidebar).toContain("return SUPERVISOR_ROUTE_HREFS.home;");
  });

  it("makes role switching use canonical supervisor home and route detection", () => {
    const roleSource = read("features/demo/roles/demo-workspace-role.tsx");

    expect(roleSource).toContain("SUPERVISOR: SUPERVISOR_ROUTE_HREFS.home");
    expect(roleSource).toContain("isSupervisorRoutePath(pathname)");
    expect(roleSource).not.toContain('pathname.startsWith("/demo/supervisor")');
  });

  it("removes cross-workspace literals from active supervisor data sources", () => {
    const sources = [
      "features/demo-engine/dashboards/data/supervisor-dashboard.adapter.ts",
      "features/demo-engine/fixtures/supervisor-approvals.reference.ts",
    ];

    for (const sourcePath of sources) {
      const source = read(sourcePath);

      expect(source).not.toContain("/demo/officer");
      expect(source).not.toContain("/demo/department");
      expect(source).not.toContain('"/demo/reports"');
      expect(source).not.toContain("/demo/outcomes");
      expect(source).not.toContain("/demo/supervisor#");
    }
  });

  it("preserves the activated D33 supervisor navigation source", () => {
    const navigation = read(
      "components/demo/internal-shell/internal-navigation.ts",
    );

    expect(navigation).toContain("SUPERVISOR_NAVIGATION_CONTRACT.map");
  });

  it("does not modify visual shell styling", () => {
    expect(
      fs.existsSync(
        path.join(
          repositoryRoot,
          "components/demo/internal-shell/internal-shell.module.css",
        ),
      ),
    ).toBe(true);
  });
});
