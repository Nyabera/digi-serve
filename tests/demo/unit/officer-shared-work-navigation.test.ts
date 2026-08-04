import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { UsersRound } from "lucide-react";
import { describe, expect, it } from "vitest";

import {
  OFFICER_NAVIGATION_CONTRACT,
  OFFICER_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/officer-navigation-contract";
import { DEMO_ROUTES } from "../../../features/demo-engine/navigation/demo-route-registry";
import {
  getInternalNavigation,
  isInternalNavigationItemActive,
} from "../../../components/demo/internal-shell/internal-navigation";

const repositoryRoot = fileURLToPath(
  new URL("../../../", import.meta.url),
);
const sharedWorkPage = resolve(
  repositoryRoot,
  "app/demo/officer/shared-work/page.tsx",
);
const sharedWorkBody = resolve(
  repositoryRoot,
  "features/demo-operations/components/officer-shared-work-workspace.tsx",
);

const forbiddenShellImports = [
  "InternalAppShell",
  "RoleWorkspaceShell",
  "OperationalWorkspaceShell",
  "InternalSidebar",
  "InternalTopbar",
  "DepartmentInboxWorkspace",
];

describe("D32-3A Shared Work navigation amendment", () => {
  it("adds Shared Work once to the canonical Workflow group in the required order", () => {
    const workflow = OFFICER_NAVIGATION_CONTRACT.find(
      (group) => group.id === "workflow",
    );
    const sharedWork = workflow?.items.find(
      (item) => item.id === "shared-work",
    );

    expect(workflow?.items.map((item) => item.id)).toEqual([
      "workflow-inbox",
      "shared-work",
      "approval-queue",
      "returned-to-applicant",
    ]);
    expect(sharedWork).toMatchObject({
      id: "shared-work",
      label: "Shared Work",
      kind: "route",
      routeKey: "sharedWork",
      href: "/demo/officer/shared-work",
      exactMatch: true,
    });
    expect(sharedWork?.kind === "route" && sharedWork.icon).toBe(UsersRound);
    expect(sharedWork?.kind === "route" && sharedWork.iconSymbol).toBe(
      "UsersRound",
    );
  });

  it("derives the shared-work registry route and visible sidebar item from the contract", () => {
    const visibleItems = getInternalNavigation("OFFICER").flatMap(
      (group) => group.items,
    );
    const sharedItems = visibleItems.filter(
      (item) => item.id === "shared-work",
    );

    expect(DEMO_ROUTES.officer.sharedWork).toBe(
      OFFICER_ROUTE_HREFS.sharedWork,
    );
    expect(visibleItems).toHaveLength(16);
    expect(visibleItems.filter((item) => item.kind === "route")).toHaveLength(
      15,
    );
    expect(sharedItems).toHaveLength(1);
    expect(sharedItems[0]).toMatchObject({
      label: "Shared Work",
      href: OFFICER_ROUTE_HREFS.sharedWork,
    });
    expect(visibleItems.map((item) => item.label)).not.toContain(
      "Shared Workflows",
    );
  });

  it("limits Shared Work active ownership to its canonical route", () => {
    const sharedWork = getInternalNavigation("OFFICER")
      .flatMap((group) => group.items)
      .find((item) => item.id === "shared-work");

    expect(
      isInternalNavigationItemActive({
        pathname: OFFICER_ROUTE_HREFS.sharedWork,
        item: sharedWork!,
      }),
    ).toBe(true);

    for (const pathname of [
      "/demo/officer",
      OFFICER_ROUTE_HREFS.workflowInbox,
      "/demo/officer/requests/REQ-DEMO-001",
      "/demo/department",
    ]) {
      expect(
        isInternalNavigationItemActive({ pathname, item: sharedWork! }),
      ).toBe(false);
    }
  });

  it("provides a body-only officer route with meaningful shared-work content", () => {
    const pageSource = readFileSync(sharedWorkPage, "utf8");
    const bodySource = readFileSync(sharedWorkBody, "utf8");

    expect(existsSync(sharedWorkPage)).toBe(true);
    expect(sharedWorkPage).toContain("app/demo/officer/shared-work/page.tsx");
    expect(pageSource).toContain("OFFICER_ROUTE_HREFS.sharedWork");
    expect(pageSource).not.toMatch(/\bredirect\s*\(/);
    expect(pageSource).not.toContain("/demo/department");

    for (const forbiddenImport of forbiddenShellImports) {
      expect(pageSource).not.toContain(forbiddenImport);
    }

    expect(bodySource).toContain("Shared with you");
    expect(bodySource).toContain("Shared by you");
    expect(bodySource).toContain("Open request");
    expect(bodySource).toContain("getOfficerRequestHref");
    expect(bodySource).not.toMatch(/coming soon|work in progress|todo/i);
  });
});
