import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  SUPERVISOR_NAVIGATION_ROUTE_ITEMS,
  SUPERVISOR_ROUTE_HREFS,
  SUPERVISOR_ROUTE_KEYS,
} from "../../../features/demo-engine/navigation/supervisor-navigation-contract";

const repositoryRoot = process.cwd();

function routePagePath(href: string) {
  const suffix = href.replace(/^\/demo\/supervisor\/?/, "");

  return suffix
    ? path.join(repositoryRoot, "app", "demo", "supervisor", suffix, "page.tsx")
    : path.join(repositoryRoot, "app", "demo", "supervisor", "page.tsx");
}

const canonicalPagePaths = SUPERVISOR_NAVIGATION_ROUTE_ITEMS.map((item) => ({
  href: item.href,
  pagePath: routePagePath(item.href),
}));

const existingBodyPages = [
  "app/demo/supervisor/page.tsx",
  "app/demo/supervisor/sla-monitor/page.tsx",
  "app/demo/supervisor/audit-trail/page.tsx",
] as const;

const newBodyPages = [
  "app/demo/supervisor/department-queue/page.tsx",
  "app/demo/supervisor/unassigned-work/page.tsx",
  "app/demo/supervisor/team-workload/page.tsx",
  "app/demo/supervisor/approval-queue/page.tsx",
  "app/demo/supervisor/escalations/page.tsx",
  "app/demo/supervisor/department-handoffs/page.tsx",
  "app/demo/supervisor/shared-work/page.tsx",
  "app/demo/supervisor/overdue-work/page.tsx",
  "app/demo/supervisor/officer-performance/page.tsx",
  "app/demo/supervisor/department-reports/page.tsx",
] as const;

const forbiddenShellMarkers = [
  "OperationalWorkspaceShell",
  "InternalAppShell",
  "InternalWorkspaceShell",
  "InternalSidebar",
  "InternalTopbar",
  "OfficerWorkspaceShell",
  "DepartmentWorkspaceShell",
] as const;

describe("D33-2 canonical supervisor route surface", () => {
  it("maps all 13 canonical route items to App Router pages", () => {
    expect(SUPERVISOR_ROUTE_KEYS).toHaveLength(13);
    expect(SUPERVISOR_NAVIGATION_ROUTE_ITEMS).toHaveLength(13);
    expect(canonicalPagePaths).toHaveLength(13);

    for (const { pagePath } of canonicalPagePaths) {
      expect(fs.existsSync(pagePath)).toBe(true);
    }
  });

  it("keeps all canonical pages beneath app/demo/supervisor", () => {
    for (const { href, pagePath } of canonicalPagePaths) {
      expect(href.startsWith("/demo/supervisor")).toBe(true);
      expect(
        path
          .relative(repositoryRoot, pagePath)
          .startsWith("app/demo/supervisor"),
      ).toBe(true);
    }
  });

  it("preserves the three existing canonical page bodies", () => {
    expect(existingBodyPages).toHaveLength(3);

    for (const pagePath of existingBodyPages) {
      expect(fs.existsSync(path.join(repositoryRoot, pagePath))).toBe(true);
    }
  });

  it("creates ten body-only route pages from the shared surface", () => {
    expect(newBodyPages).toHaveLength(10);

    for (const pagePath of newBodyPages) {
      const content = fs.readFileSync(
        path.join(repositoryRoot, pagePath),
        "utf8",
      );

      expect(content).toContain("SupervisorRouteSurface");
      expect(content).toContain("SUPERVISOR_ROUTE_HREFS");

      for (const marker of forbiddenShellMarkers) {
        expect(content).not.toContain(marker);
      }
    }
  });

  it("keeps the supervisor layout as the route-tree shell owner", () => {
    const layoutPath = path.join(
      repositoryRoot,
      "app/demo/supervisor/layout.tsx",
    );
    const layout = fs.readFileSync(layoutPath, "utf8");

    expect(layout).toContain("OperationalWorkspaceShell");
    expect(layout).toContain('role="supervisor"');
  });

  it("does not mount a second shell inside canonical page bodies", () => {
    for (const { pagePath } of canonicalPagePaths) {
      const content = fs.readFileSync(pagePath, "utf8");

      for (const marker of forbiddenShellMarkers) {
        expect(content).not.toContain(marker);
      }
    }
  });

  it("preserves the legacy request approval detail route", () => {
    expect(
      fs.existsSync(
        path.join(
          repositoryRoot,
          "app/demo/supervisor/approvals/[requestId]/page.tsx",
        ),
      ),
    ).toBe(true);
  });

  it("keeps every contract href represented by one unique page", () => {
    expect(new Set(canonicalPagePaths.map(({ href }) => href)).size).toBe(13);
    expect(
      new Set(
        canonicalPagePaths.map(({ pagePath }) =>
          path.relative(repositoryRoot, pagePath),
        ),
      ).size,
    ).toBe(13);

    for (const routeKey of SUPERVISOR_ROUTE_KEYS) {
      expect(SUPERVISOR_ROUTE_HREFS[routeKey]).toBeTruthy();
    }
  });
});
