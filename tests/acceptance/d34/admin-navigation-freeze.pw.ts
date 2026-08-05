import {
  expect,
  test,
  type Page,
} from "@playwright/test";

import {
  ADMIN_CANONICAL_ROUTE_HREFS,
  ADMIN_ROUTE_HREFS,
} from "../../../features/demo-engine/navigation/admin-navigation-contract";

const ADMIN_SHELL =
  '[data-internal-shell-role="ADMIN"]';
const ADMIN_NAVIGATION =
  'nav[aria-label="admin navigation"]';

async function expectAdminShell(page: Page) {
  await expect(page.locator(ADMIN_SHELL)).toHaveCount(1);
  await expect(page.locator(ADMIN_NAVIGATION)).toHaveCount(1);
  await expect(
    page.getByRole("button", {
      name: "Open notifications",
    }),
  ).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute(
    "data-demo-role",
    "admin",
  );
}

for (const route of ADMIN_CANONICAL_ROUTE_HREFS) {
  test(`canonical route retains admin shell: ${route}`, async ({
    page,
  }) => {
    const runtimeErrors: string[] = [];

    page.on("pageerror", (error) => {
      runtimeErrors.push(error.message);
    });

    page.on("console", (message) => {
      if (message.type() === "error") {
        runtimeErrors.push(message.text());
      }
    });

    const response = await page.goto(route, {
      waitUntil: "networkidle",
    });

    expect(response).not.toBeNull();
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(
      new RegExp(`${route.replaceAll("/", "\\/")}/?$`),
    );
    await expectAdminShell(page);

    const activeLinks = page.locator(
      `${ADMIN_NAVIGATION} a[aria-current="page"]`,
    );

    await expect(activeLinks).toHaveCount(1);
    await expect(activeLinks).toHaveAttribute(
      "href",
      route,
    );

    expect(runtimeErrors).toEqual([]);
  });
}

test("visible navigation exposes exactly the 21 canonical destinations", async ({
  page,
}) => {
  await page.goto(ADMIN_ROUTE_HREFS.dashboard);
  await expectAdminShell(page);

  const adminHrefs = await page
    .locator(`${ADMIN_NAVIGATION} a`)
    .evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute("href"))
        .filter(
          (href): href is string =>
            href?.startsWith("/demo/admin") ?? false,
        ),
    );

  expect(adminHrefs).toHaveLength(21);
  expect(new Set(adminHrefs).size).toBe(21);
  expect([...adminHrefs].sort()).toEqual(
    [...ADMIN_CANONICAL_ROUTE_HREFS].sort(),
  );
});

test("desktop clicks, Back, and Forward retain the admin shell", async ({
  page,
}) => {
  await page.goto(ADMIN_ROUTE_HREFS.dashboard);
  await expectAdminShell(page);

  await page
    .locator(
      `${ADMIN_NAVIGATION} a[href="${ADMIN_ROUTE_HREFS.serviceCatalogue}"]`,
    )
    .click();
  await expect(page).toHaveURL(
    ADMIN_ROUTE_HREFS.serviceCatalogue,
  );
  await expectAdminShell(page);

  await page
    .locator(
      `${ADMIN_NAVIGATION} a[href="${ADMIN_ROUTE_HREFS.users}"]`,
    )
    .click();
  await expect(page).toHaveURL(
    ADMIN_ROUTE_HREFS.users,
  );
  await expectAdminShell(page);

  await page.goBack();
  await expect(page).toHaveURL(
    ADMIN_ROUTE_HREFS.serviceCatalogue,
  );
  await expectAdminShell(page);

  await page.goForward();
  await expect(page).toHaveURL(
    ADMIN_ROUTE_HREFS.users,
  );
  await expectAdminShell(page);
});

test("mobile drawer uses the same canonical navigation", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 390,
    height: 844,
  });

  await page.goto(ADMIN_ROUTE_HREFS.dashboard);
  await expectAdminShell(page);

  await page
    .getByRole("button", {
      name: "Open navigation",
    })
    .click();

  const navigation = page.locator(ADMIN_NAVIGATION);
  await expect(navigation).toBeVisible();

  await navigation
    .locator(
      `a[href="${ADMIN_ROUTE_HREFS.portalSettings}"]`,
    )
    .click();

  await expect(page).toHaveURL(
    ADMIN_ROUTE_HREFS.portalSettings,
  );
  await expectAdminShell(page);
});

test("legacy workflow-builder route redirects and preserves template selection", async ({
  page,
}) => {
  await page.goto(
    "/demo/admin/workflows/builder?template=course-application",
  );

  await expect(page).toHaveURL(
    `${ADMIN_ROUTE_HREFS.workflowBuilder}?template=course-application`,
  );
  await expectAdminShell(page);
});

test("workflow overview compatibility remains admin-owned", async ({
  page,
}) => {
  await page.goto(
    `${ADMIN_ROUTE_HREFS.workflowBuilder}?view=overview&tab=active`,
  );

  await expectAdminShell(page);
  await expect(
    page.getByRole("heading", {
      name: "Workflows",
      exact: true,
    }),
  ).toBeVisible();
});
