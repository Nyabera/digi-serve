import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  OFFICER_NAVIGATION_CONTRACT,
  OFFICER_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/officer-navigation-contract";

const repositoryRoot = fileURLToPath(
  new URL("../../../", import.meta.url),
);
const source = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), "utf8");

const layoutSource = source("app/demo/officer/layout.tsx");
const requestPageSource = source(
  "app/demo/officer/requests/[requestId]/page.tsx",
);
const referralPageSource = source(
  "app/demo/officer/requests/[requestId]/share-workflow-referral-page.tsx",
);
const individualCaseSource = source(
  "components/demo/officer/individual-case/officer-individual-case-shell.tsx",
);
const reviewSource = source(
  "components/demo/officer/officer-request-review.tsx",
);

const forbiddenShellImports = [
  "InternalAppShell",
  "RoleWorkspaceShell",
  "OperationalWorkspaceShell",
  "InternalSidebar",
  "InternalTopbar",
] as const;

const protectedPaths = [
  "app/demo/officer/layout.tsx",
  "features/demo-engine/navigation/officer-navigation-contract.ts",
  "features/demo-engine/navigation/demo-route-registry.ts",
  "components/demo/internal-shell/internal-navigation.ts",
  "components/demo/internal-shell/internal-sidebar.tsx",
  "components/demo/internal-shell/internal-app-shell.tsx",
  "components/demo/internal-shell/internal-topbar.tsx",
  "components/demo/internal-shell/internal-shell-boundary.tsx",
  "components/demo/internal-shell/role-workspace-shell.tsx",
  "components/demo/workspace-shells/operational-workspace-shell.tsx",
  "app/demo/officer/shared-work/page.tsx",
] as const;

describe("D32-4 officer shell ownership", () => {
  it("keeps the officer layout as the complete shell owner", () => {
    expect(layoutSource).toContain("OperationalWorkspaceShell");
    expect(layoutSource).toContain('role="officer"');
    expect(layoutSource).not.toContain("InternalAppShell");
  });

  it("routes request-detail and referral views to body-only components", () => {
    expect(requestPageSource).toContain("OfficerIndividualCaseWorkspace");
    expect(requestPageSource).toContain('view === "refer"');
    expect(referralPageSource).toContain("ExternalRecipientSharePanel");
    expect(referralPageSource).toContain("OfficerRequestReview");

    for (const pageSource of [requestPageSource, referralPageSource]) {
      for (const forbiddenImport of forbiddenShellImports) {
        expect(pageSource).not.toContain(forbiddenImport);
      }
    }
  });

  it("removes complete shell imports from the individual-case and review bodies", () => {
    for (const bodySource of [individualCaseSource, reviewSource]) {
      for (const forbiddenImport of forbiddenShellImports) {
        expect(bodySource).not.toContain(forbiddenImport);
      }
    }

    expect(individualCaseSource).toContain("OfficerIndividualCaseWorkspace");
    expect(individualCaseSource).toContain("data-officer-individual-case");
    expect(individualCaseSource).toContain("Case management record");
    expect(individualCaseSource).toContain("Share Workflow / Refer Case");
    expect(reviewSource).toContain("OfficerReviewReferralBody");
    expect(reviewSource).toContain("Restoring officer workspace");
  });

  it("uses the canonical queue href for case breadcrumbs", () => {
    expect(individualCaseSource).toContain("OFFICER_ROUTE_HREFS");
    expect(individualCaseSource).toContain("OFFICER_ROUTE_HREFS.queue");
    expect(individualCaseSource).not.toContain(
      "/demo/officer#application-queue",
    );
  });

  it("preserves Application Queue ownership and the D32-3A navigation inventory", () => {
    const operations = OFFICER_NAVIGATION_CONTRACT[0];
    const workflow = OFFICER_NAVIGATION_CONTRACT[1];
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
    const queue = operations.items.find(
      (item) => item.id === "application-queue",
    );
    const sharedWork = workflow.items.find(
      (item) => item.id === "shared-work",
    );

    expect(queue).toMatchObject({
      href: OFFICER_ROUTE_HREFS.queue,
      activePrefixes: ["/demo/officer/requests/"],
    });
    expect(sharedWork).toMatchObject({
      label: "Shared Work",
      href: OFFICER_ROUTE_HREFS.sharedWork,
    });
    expect(OFFICER_NAVIGATION_CONTRACT).toHaveLength(4);
    expect(itemCount).toBe(16);
    expect(routeCount).toBe(15);
    expect(actionCount).toBe(1);
  });

  it("does not modify protected shell, navigation, or canonical route files", () => {
    const changedPaths = execFileSync(
      "git",
      ["diff", "--name-only", "--", ...protectedPaths],
      { cwd: repositoryRoot, encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean);

    expect(changedPaths).toEqual([]);
  });
});
