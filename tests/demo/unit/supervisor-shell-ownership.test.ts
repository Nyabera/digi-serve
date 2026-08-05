import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { SUPERVISOR_NAVIGATION_ROUTE_ITEMS } from "../../../features/demo-engine/navigation/supervisor-navigation-contract";

const repositoryRoot = process.cwd();

function read(repositoryPath: string) {
  return fs.readFileSync(path.join(repositoryRoot, repositoryPath), "utf8");
}

function canonicalPagePath(href: string) {
  const suffix = href.replace(/^\/demo\/supervisor\/?/, "");

  return suffix
    ? `app/demo/supervisor/${suffix}/page.tsx`
    : "app/demo/supervisor/page.tsx";
}

const forbiddenPageShellMarkers = [
  "OperationalWorkspaceShell",
  "RoleWorkspaceShell",
  "InternalAppShell",
  "InternalSidebar",
  "InternalTopbar",
] as const;

describe("D33-3 supervisor shell ownership", () => {
  it("keeps the supervisor route layout as the sole route-tree shell owner", () => {
    const layout = read("app/demo/supervisor/layout.tsx");

    expect(layout).toContain(
      'import { OperationalWorkspaceShell } from "@/components/demo/workspace-shells";',
    );
    expect(layout).toContain('<OperationalWorkspaceShell role="supervisor">');
    expect(layout).toContain("</OperationalWorkspaceShell>");
    expect(layout).toContain('role="supervisor"');

    const nestedLayouts = fs
      .readdirSync(path.join(repositoryRoot, "app/demo/supervisor"), {
        recursive: true,
        withFileTypes: true,
      })
      .filter((entry) => entry.isFile() && entry.name === "layout.tsx");

    expect(nestedLayouts).toHaveLength(1);
  });

  it("keeps all 13 canonical pages body-only", () => {
    expect(SUPERVISOR_NAVIGATION_ROUTE_ITEMS).toHaveLength(13);

    for (const item of SUPERVISOR_NAVIGATION_ROUTE_ITEMS) {
      const pagePath = canonicalPagePath(item.href);
      const page = read(pagePath);

      for (const marker of forbiddenPageShellMarkers) {
        expect(page).not.toContain(marker);
      }
    }
  });

  it("routes the supervisor layout through one shared shell chain", () => {
    const operationalShell = read(
      "components/demo/workspace-shells/operational-workspace-shell.tsx",
    );
    const roleShell = read(
      "components/demo/internal-shell/role-workspace-shell.tsx",
    );

    expect(operationalShell).toContain("RoleWorkspaceShell");
    expect(operationalShell).toContain("role={role}");
    expect(roleShell).toContain("InternalAppShell");
    expect(roleShell).toContain('shellRole: "SUPERVISOR"');
    expect(roleShell).toContain('staffName: "Dr. Miriam Wekesa"');
    expect(roleShell).toContain('staffRoleLabel: "Registrar Supervisor"');
  });

  it("makes the internal app shell the single sidebar and top-bar renderer", () => {
    const shell = read("components/demo/internal-shell/internal-app-shell.tsx");

    expect(shell.match(/<InternalSidebar/g)).toHaveLength(1);
    expect(shell.match(/<InternalTopbar/g)).toHaveLength(1);
    expect(shell).toContain("role={role}");
    expect(shell).toContain("mobileOpen={mobileSidebarOpen}");
    expect(shell).toContain("onMobileMenuOpen");
    expect(shell).toContain("<DemoWorkspaceSwitcher />");
  });

  it("removes the nested shell from the legacy approval workspace", () => {
    const workspace = read(
      "components/demo/supervisor/supervisor-approval-workspace.tsx",
    );

    expect(workspace).toContain("<SupervisorApprovalBody");
    expect(workspace).not.toContain("InternalAppShell");
    expect(workspace).not.toContain("InternalSidebar");
    expect(workspace).not.toContain("InternalTopbar");
    expect(workspace).not.toContain("data-d29r3-officer-shell");
    expect(workspace).not.toContain("requestSelector=");
    expect(workspace).not.toContain("roleSelector=");
  });

  it("keeps the legacy approval detail page beneath the supervisor layout", () => {
    const pagePath = "app/demo/supervisor/approvals/[requestId]/page.tsx";
    const page = read(pagePath);

    expect(fs.existsSync(path.join(repositoryRoot, pagePath))).toBe(true);
    expect(page).toContain("SupervisorApprovalWorkspace");
    expect(page).not.toContain("organizationName=");
    expect(page).not.toContain("InternalAppShell");

    for (const marker of forbiddenPageShellMarkers) {
      expect(page).not.toContain(marker);
    }
  });

  it("keeps desktop and mobile navigation on the same supervisor role", () => {
    const layout = read("app/demo/supervisor/layout.tsx");
    const operationalShell = read(
      "components/demo/workspace-shells/operational-workspace-shell.tsx",
    );
    const internalShell = read(
      "components/demo/internal-shell/internal-app-shell.tsx",
    );

    expect(layout).toContain('role="supervisor"');
    expect(operationalShell).toContain("role={role}");
    expect(internalShell).toContain("role={role}");
    expect(internalShell).toContain("mobileOpen={mobileSidebarOpen}");
    expect(internalShell).toContain("onMobileClose={() =>");
  });
});
