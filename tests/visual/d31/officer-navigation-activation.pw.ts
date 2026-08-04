import {
  expect,
  test,
  type Page,
} from "@playwright/test";

import {
  OFFICER_NAVIGATION_CONTRACT,
  OFFICER_NAVIGATION_ROUTE_ITEMS,
} from "../../../features/demo-engine/navigation/officer-navigation-contract";

const roleSwitcherLabel =
  "Switch Applicant, Officer, Supervisor or Admin workspace";

async function expectOfficerShell(
  page: Page,
  activeLabel: string,
) {
  const sidebar = page.getByRole("navigation", {
    name: "officer navigation",
  });

  await expect(
    page.locator('[data-internal-shell-role="OFFICER"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-internal-shell-role="OFFICER"] header').first(),
  ).toBeVisible();
  await expect(sidebar).toBeVisible();
  await expect(page.getByLabel(roleSwitcherLabel)).toHaveValue("OFFICER");
  await expect(sidebar.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(sidebar.locator('[aria-current="page"]')).toHaveText(
    activeLabel,
  );
}

test.describe.configure({ mode: "serial" });

test("canonical officer links retain the shell and one active item", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/demo/officer", { waitUntil: "networkidle" });

  const sidebar = page.getByRole("navigation", {
    name: "officer navigation",
  });

  await expect(
    sidebar.locator(".nav-item-label"),
  ).toHaveText(
    OFFICER_NAVIGATION_CONTRACT.flatMap((group) =>
      group.items.map((item) => item.label),
    ),
  );

  for (const item of OFFICER_NAVIGATION_ROUTE_ITEMS) {
    await sidebar.locator(`a[href="${item.href}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${item.href}$`));
    await expectOfficerShell(page, item.label);

    await page.reload({ waitUntil: "networkidle" });
    await expectOfficerShell(page, item.label);
  }
});

test("history and the mobile drawer preserve canonical navigation behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/demo/officer/tasks", { waitUntil: "networkidle" });
  await page.goto("/demo/officer/tasks/overdue", { waitUntil: "networkidle" });

  await page.goBack({ waitUntil: "networkidle" });
  await expectOfficerShell(page, "My Tasks");
  await page.goForward({ waitUntil: "networkidle" });
  await expectOfficerShell(page, "Overdue Tasks");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo/officer", { waitUntil: "networkidle" });
  await page.getByLabel("Open navigation").click();

  const closeNavigation = page
    .getByLabel("Close navigation")
    .first();
  const sidebar = page.getByRole("navigation", {
    name: "officer navigation",
  });

  await expect(closeNavigation).toBeEnabled();
  await sidebar.getByRole("link", { name: "My Tasks" }).click();
  await expect(page).toHaveURL(/\/demo\/officer\/tasks$/);
  await expect(closeNavigation).toBeDisabled();
  await expectOfficerShell(page, "My Tasks");

  await page.getByLabel("Open navigation").click();
  await expect(closeNavigation).toBeEnabled();
  await sidebar.getByRole("button", { name: "Log Out" }).click();
  await expect(page).toHaveURL(/\/demo$/);
});
