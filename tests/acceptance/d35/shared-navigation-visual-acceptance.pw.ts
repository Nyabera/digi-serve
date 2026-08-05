import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const evidenceDirectory = resolve(
  process.cwd(),
  "docs/demo/d35-visual-acceptance",
);

async function prepareEvidenceDirectory() {
  await mkdir(evidenceDirectory, { recursive: true });
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
}

async function screenshot(
  locator: Locator,
  name: string,
) {
  await locator.screenshot({
    path: resolve(evidenceDirectory, name),
    animations: "disabled",
  });
}

test.beforeAll(async () => {
  await prepareEvidenceDirectory();
});

const internalRoles = [
  {
    role: "OFFICER",
    path: "/demo/officer",
    screenshot: "officer-desktop.png",
  },
  {
    role: "SUPERVISOR",
    path: "/demo/supervisor",
    screenshot: "supervisor-desktop.png",
  },
  {
    role: "ADMIN",
    path: "/demo/admin",
    screenshot: "admin-desktop.png",
  },
] as const;

for (const entry of internalRoles) {
  test(`${entry.role} desktop sidebar visual evidence`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto(entry.path);

    const root = page
      .locator(`[data-internal-shell-role="${entry.role}"]`)
      .first();

    const sidebar = root.locator(
      'aside[aria-label="Internal workspace navigation"]',
    );

    await expect(root).toBeVisible();
    await expect(sidebar).toBeVisible();
    await expect(
      sidebar.locator(".nav-item[aria-current='page']").first(),
    ).toBeVisible();

    await expectNoHorizontalOverflow(page);
    await screenshot(sidebar, entry.screenshot);
  });
}

test("Applicant desktop sidebar visual evidence", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/demo/applicant/profile");

  const navigation = page.locator(
    'nav[aria-label="Applicant navigation"]',
  );
  const sidebar = navigation.locator("xpath=ancestor::aside");

  await expect(sidebar).toBeVisible();
  await expect(
    navigation.locator("a[aria-current='page']").first(),
  ).toBeVisible();

  await expectNoHorizontalOverflow(page);
  await screenshot(sidebar, "applicant-desktop.png");
});

test("Department control desktop sidebar evidence", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/demo/department");

  const root = page
    .locator('[data-internal-shell-role="DEPARTMENT"]')
    .first();

  const sidebar = root.locator(
    'aside[aria-label="Internal workspace navigation"]',
  );

  await expect(root).toBeVisible();
  await expect(sidebar).toBeVisible();

  await expectNoHorizontalOverflow(page);
  await screenshot(sidebar, "department-control-desktop.png");
});

test("Admin mobile drawer visual evidence", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo/admin");

  await page
    .getByRole("button", { name: "Open navigation" })
    .click();

  const sidebar = page.locator(
    'aside[aria-label="Internal workspace navigation"]',
  );

  await expect(sidebar).toBeVisible();
  await screenshot(sidebar, "admin-mobile.png");
});

test("Applicant mobile drawer visual evidence", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo/applicant/profile");

  await page
    .getByRole("button", {
      name: "Toggle applicant navigation",
    })
    .click();

  const navigation = page.locator(
    'nav[aria-label="Applicant navigation"]',
  );
  const sidebar = navigation.locator("xpath=ancestor::aside");

  await expect(sidebar).toBeVisible();
  await screenshot(sidebar, "applicant-mobile.png");
});
