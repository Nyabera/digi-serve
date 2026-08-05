import { expect, test, type Page } from "@playwright/test";

import {
  SUPERVISOR_NAVIGATION_CONTRACT,
  SUPERVISOR_NAVIGATION_ROUTE_ITEMS,
  SUPERVISOR_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/supervisor-navigation-contract";

const canonicalRoutes = SUPERVISOR_NAVIGATION_ROUTE_ITEMS.map((item) => ({
  href: item.href,
  label: item.label,
}));

const expectedGroups = SUPERVISOR_NAVIGATION_CONTRACT.map(
  (group) => group.label,
);

function supervisorNavigation(page: Page) {
  return page.getByRole("navigation", {
    name: "supervisor navigation",
  });
}

function supervisorSidebar(page: Page) {
  return page.getByRole("complementary", {
    name: "Internal workspace navigation",
  });
}

function supervisorTopbar(page: Page) {
  return page.locator("header").filter({
    has: page.getByRole("button", {
      name: "Open notifications",
    }),
  });
}

async function expectSupervisorShell(
  page: Page,
  {
    requireRoleSwitcher = true,
  }: {
    readonly requireRoleSwitcher?: boolean;
  } = {},
) {
  await expect(supervisorSidebar(page)).toHaveCount(1);
  await expect(supervisorTopbar(page)).toHaveCount(1);
  await expect(supervisorNavigation(page)).toHaveCount(1);

  if (requireRoleSwitcher) {
    await expect(
      page.getByRole("combobox", {
        name: "Switch Applicant, Officer, Supervisor or Admin workspace",
      }),
    ).toHaveValue("SUPERVISOR");
  }
}

async function expectNavigationInventory(page: Page) {
  const navigation = supervisorNavigation(page);

  await expect(navigation.locator("section > h2")).toHaveText(expectedGroups);

  await expect(navigation.locator(".nav-item")).toHaveCount(14);

  await expect(navigation.getByRole("link")).toHaveCount(13);

  await expect(
    navigation.getByRole("button", {
      name: "Log Out",
      exact: true,
    }),
  ).toHaveCount(1);
}

test.describe("D33-6 supervisor navigation and shell verification", () => {
  test("all canonical routes load, refresh, retain one shell, and activate the correct item", async ({
    page,
  }) => {
    expect(canonicalRoutes).toHaveLength(13);

    for (const route of canonicalRoutes) {
      const response = await page.goto(route.href);

      expect(
        response?.status(),
        `${route.href} should return a successful response`,
      ).toBeLessThan(400);

      await expectSupervisorShell(page);
      await expectNavigationInventory(page);

      await expect(
        supervisorNavigation(page).getByRole("link", {
          name: route.label,
          exact: true,
        }),
      ).toHaveAttribute("aria-current", "page");

      const refreshed = await page.reload();

      expect(
        refreshed?.status(),
        `${route.href} should refresh successfully`,
      ).toBeLessThan(400);

      await expectSupervisorShell(page);

      await expect(
        supervisorNavigation(page).getByRole("link", {
          name: route.label,
          exact: true,
        }),
      ).toHaveAttribute("aria-current", "page");
    }
  });

  test("legacy approval detail retains the supervisor shell and activates Approval Queue", async ({
    page,
  }) => {
    const response = await page.goto("/demo/supervisor/approvals/REQ-DEMO-001");

    expect(response?.status()).toBeLessThan(400);

    await expectSupervisorShell(page);

    await expect(
      supervisorNavigation(page).getByRole("link", {
        name: "Approval Queue",
        exact: true,
      }),
    ).toHaveAttribute("aria-current", "page");

    await page.reload();

    await expectSupervisorShell(page);

    await expect(
      supervisorNavigation(page).getByRole("link", {
        name: "Approval Queue",
        exact: true,
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("desktop navigation links remain supervisor-owned", async ({ page }) => {
    await page.goto(SUPERVISOR_ROUTE_HREFS.home);

    await expectSupervisorShell(page);
    await expectNavigationInventory(page);

    const hrefs = await supervisorNavigation(page)
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

    expect(hrefs).toHaveLength(13);

    for (const href of hrefs) {
      expect(href).not.toBeNull();
      expect(href?.startsWith("/demo/supervisor")).toBe(true);
      expect(href).not.toContain("#");
      expect(href).not.toContain("?");
    }
  });

  test("ordinary supervisor dashboard links remain supervisor-owned", async ({
    page,
  }) => {
    await page.goto(SUPERVISOR_ROUTE_HREFS.home);

    const hrefs = await page
      .locator("main a[href]")
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href"))
          .filter((href): href is string => Boolean(href?.startsWith("/demo"))),
      );

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      expect(href.startsWith("/demo/supervisor")).toBe(true);
      expect(href).not.toContain("/demo/officer");
      expect(href).not.toContain("/demo/department");
      expect(href).not.toContain("/demo/reports");
      expect(href).not.toContain("/demo/outcomes");
    }
  });

  test("sidebar brand and role switching resolve to canonical supervisor home", async ({
    page,
  }) => {
    await page.goto(SUPERVISOR_ROUTE_HREFS.auditTrail);

    const brand = supervisorSidebar(page).locator("a").first();

    await expect(brand).toHaveAttribute("href", SUPERVISOR_ROUTE_HREFS.home);

    await brand.click();

    await expect(page).toHaveURL(
      new RegExp(`${SUPERVISOR_ROUTE_HREFS.home}/?$`),
    );

    await page.goto("/demo/officer");

    await page
      .getByRole("combobox", {
        name: "Switch Applicant, Officer, Supervisor or Admin workspace",
      })
      .selectOption("SUPERVISOR");

    await expect(page).toHaveURL(
      new RegExp(`${SUPERVISOR_ROUTE_HREFS.home}/?$`),
    );

    await expectSupervisorShell(page);
  });

  test("mobile drawer uses the same five groups and fourteen items", async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    await page.goto(SUPERVISOR_ROUTE_HREFS.home);

    await page
      .getByRole("button", {
        name: "Open navigation",
      })
      .click();

    await expect(supervisorSidebar(page)).toBeVisible();
    await expectNavigationInventory(page);

    await supervisorNavigation(page)
      .getByRole("link", {
        name: "Shared Work",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(
      new RegExp(`${SUPERVISOR_ROUTE_HREFS.sharedWork}/?$`),
    );

    await expectSupervisorShell(page, {
      requireRoleSwitcher: false,
    });

    await expect(
      supervisorNavigation(page).getByRole("link", {
        name: "Shared Work",
        exact: true,
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("Log Out remains an action and returns to the demo entry point", async ({
    page,
  }) => {
    await page.goto(SUPERVISOR_ROUTE_HREFS.home);

    const navigation = supervisorNavigation(page);
    const logout = navigation.getByRole("button", {
      name: "Log Out",
      exact: true,
    });

    await expect(logout).toHaveCount(1);
    await expect(
      navigation.getByRole("link", {
        name: "Log Out",
        exact: true,
      }),
    ).toHaveCount(0);

    await logout.click();

    await expect(page).toHaveURL(/\/demo\/?$/);
  });
});
