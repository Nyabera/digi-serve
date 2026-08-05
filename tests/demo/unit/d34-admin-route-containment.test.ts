import { describe, expect, it } from "vitest";

import {
  ADMIN_CANONICAL_ROUTE_HREFS,
  ADMIN_PROHIBITED_WORKSPACE_PREFIXES,
  ADMIN_ROUTE_HREFS,
  findActiveAdminNavigationItem,
} from "../../../features/demo-engine/navigation/admin-navigation-contract";
import {
  DEMO_ROLE_HOME_ROUTES,
  DEMO_ROUTES,
  resolveDemoRoleFromPath,
} from "../../../features/demo-engine/navigation/demo-route-registry";

describe("D34 admin route containment", () => {
  it("keeps exactly 21 unique canonical admin routes", () => {
    expect(ADMIN_CANONICAL_ROUTE_HREFS).toHaveLength(21);
    expect(new Set(ADMIN_CANONICAL_ROUTE_HREFS).size).toBe(21);
  });

  it("registers every canonical route through the shared demo registry", () => {
    const registeredAdminRoutes = new Set(
      Object.values(DEMO_ROUTES.admin),
    );

    for (const route of ADMIN_CANONICAL_ROUTE_HREFS) {
      expect(registeredAdminRoutes.has(route)).toBe(true);
    }
  });

  it("uses the canonical dashboard as the admin role home", () => {
    expect(DEMO_ROLE_HOME_ROUTES.admin).toBe(
      ADMIN_ROUTE_HREFS.dashboard,
    );
    expect(DEMO_ROUTES.admin.home).toBe(
      ADMIN_ROUTE_HREFS.dashboard,
    );
  });

  it("resolves every canonical route to the admin workspace", () => {
    for (const route of ADMIN_CANONICAL_ROUTE_HREFS) {
      expect(resolveDemoRoleFromPath(route)).toBe("admin");
      expect(resolveDemoRoleFromPath(`${route}/`)).toBe("admin");
      expect(resolveDemoRoleFromPath(`${route}?view=test`)).toBe(
        "admin",
      );
      expect(resolveDemoRoleFromPath(`${route}#section`)).toBe(
        "admin",
      );
    }
  });

  it("does not classify prohibited workspace prefixes as admin", () => {
    for (const prefix of ADMIN_PROHIBITED_WORKSPACE_PREFIXES) {
      expect(resolveDemoRoleFromPath(prefix)).not.toBe("admin");
      expect(
        resolveDemoRoleFromPath(`${prefix}/example`),
      ).not.toBe("admin");
    }
  });

  it("keeps the dashboard exact-match only", () => {
    expect(
      findActiveAdminNavigationItem(
        ADMIN_ROUTE_HREFS.dashboard,
      )?.key,
    ).toBe("dashboard");

    expect(
      findActiveAdminNavigationItem(
        ADMIN_ROUTE_HREFS.users,
      )?.key,
    ).toBe("users");
  });

  it("uses longest-match precedence for nested routes", () => {
    expect(
      findActiveAdminNavigationItem(
        ADMIN_ROUTE_HREFS.serviceBuilder,
      )?.key,
    ).toBe("serviceBuilder");

    expect(
      findActiveAdminNavigationItem(
        `${ADMIN_ROUTE_HREFS.serviceBuilder}/preview`,
      )?.key,
    ).toBe("serviceBuilder");
  });

  it("keeps the old workflow-builder URL explicitly non-canonical", () => {
    expect(DEMO_ROUTES.admin.legacyWorkflowBuilder).toBe(
      "/demo/admin/workflows/builder",
    );
    expect(
      new Set<string>(ADMIN_CANONICAL_ROUTE_HREFS).has(
        DEMO_ROUTES.admin.legacyWorkflowBuilder,
      ),
    ).toBe(false);
    expect(
      resolveDemoRoleFromPath(
        DEMO_ROUTES.admin.legacyWorkflowBuilder,
      ),
    ).toBe("admin");
  });
});
