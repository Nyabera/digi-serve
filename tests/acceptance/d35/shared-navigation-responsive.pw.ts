import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

type StyleSnapshot = {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  letterSpacing: number;
  borderRadius: string;
  strokeWidth: string;
};

async function styles(locator: Locator): Promise<StyleSnapshot> {
  return locator.evaluate((element) => {
    const computed = window.getComputedStyle(element);

    return {
      color: computed.color,
      fontFamily: computed.fontFamily,
      fontSize: Number.parseFloat(computed.fontSize),
      fontWeight: computed.fontWeight,
      letterSpacing: Number.parseFloat(computed.letterSpacing),
      borderRadius: computed.borderRadius,
      strokeWidth: computed.strokeWidth,
    };
  });
}

async function expectApprox(
  value: number,
  target: number,
  tolerance = 0.35,
) {
  expect(Math.abs(value - target)).toBeLessThanOrEqual(tolerance);
}

const internalRoles = [
  { role: "OFFICER", path: "/demo/officer" },
  { role: "SUPERVISOR", path: "/demo/supervisor" },
  { role: "ADMIN", path: "/demo/admin" },
] as const;

for (const entry of internalRoles) {
  test(`${entry.role} desktop navigation matches D35`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(entry.path);

    const root = page
      .locator(`[data-internal-shell-role="${entry.role}"]`)
      .first();

    await expect(root).toBeVisible();

    const sidebar = root.locator(
      'aside[aria-label="Internal workspace navigation"]',
    );
    const inactive = sidebar
      .locator(".nav-item:not([aria-current='page'])")
      .first();
    const label = inactive.locator(".nav-item-label");
    const icon = inactive.locator("svg.nav-item-icon");
    const active = sidebar
      .locator(".nav-item[aria-current='page']")
      .first();

    await expect(inactive).toBeVisible();
    await expect(active).toBeVisible();

    const labelStyle = await styles(label);
    const iconStyle = await styles(icon);
    const activeStyle = await styles(active);
    const inactiveBox = await inactive.boundingBox();
    const iconBox = await icon.boundingBox();
    const sidebarBox = await sidebar.boundingBox();

    expect(labelStyle.fontFamily).toContain("Source Code Pro");
    await expectApprox(labelStyle.fontSize, 11.4);
    expect(labelStyle.fontWeight).toBe("400");
    await expectApprox(labelStyle.letterSpacing, 0.05, 0.1);
    expect(labelStyle.color).toBe("rgb(102, 102, 102)");

    expect(iconStyle.color).not.toBe("rgb(102, 102, 102)");
    expect(iconStyle.strokeWidth).toBe("1px");

    expect(activeStyle.borderRadius).toBe("0px");
    expect(activeStyle.color).not.toBe("rgb(102, 102, 102)");

    expect(inactiveBox).not.toBeNull();
    expect(iconBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();

    await expectApprox(inactiveBox!.height, 32.4, 0.7);
    await expectApprox(iconBox!.width, 21.6, 0.7);
    await expectApprox(iconBox!.height, 21.6, 0.7);
    await expectApprox(sidebarBox!.width, 224.4, 1);
  });
}

test("Applicant desktop navigation has proportional D35 parity", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/demo/applicant/profile");

  const navigation = page.locator(
    'nav[aria-label="Applicant navigation"]',
  );
  const inactive = navigation
    .locator("a:not([aria-current='page'])")
    .first();
  const label = inactive.locator("span");
  const icon = inactive.locator("svg");
  const active = navigation
    .locator("a[aria-current='page']")
    .first();
  const sidebar = navigation.locator("xpath=ancestor::aside");

  await expect(navigation).toBeVisible();
  await expect(active).toBeVisible();

  const labelStyle = await styles(label);
  const iconStyle = await styles(icon);
  const activeStyle = await styles(active);
  const inactiveBox = await inactive.boundingBox();
  const iconBox = await icon.boundingBox();
  const sidebarBox = await sidebar.boundingBox();

  expect(labelStyle.fontFamily).toContain("Source Code Pro");
  await expectApprox(labelStyle.fontSize, 11.4);
  expect(labelStyle.fontWeight).toBe("400");
  await expectApprox(labelStyle.letterSpacing, 0.05, 0.1);
  expect(labelStyle.color).toBe("rgb(102, 102, 102)");

  expect(iconStyle.color).not.toBe("rgb(102, 102, 102)");
  expect(iconStyle.strokeWidth).toBe("1px");
  expect(activeStyle.borderRadius).toBe("0px");

  expect(inactiveBox).not.toBeNull();
  expect(iconBox).not.toBeNull();
  expect(sidebarBox).not.toBeNull();

  await expectApprox(inactiveBox!.height, 35.64, 0.8);
  await expectApprox(iconBox!.width, 17.1, 0.8);
  await expectApprox(iconBox!.height, 17.1, 0.8);
  await expectApprox(sidebarBox!.width, 214.2, 1);
});

test("Department remains outside D35", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/demo/department");

  const root = page
    .locator('[data-internal-shell-role="DEPARTMENT"]')
    .first();
  await expect(root).toBeVisible();

  const sidebar = root.locator(
    'aside[aria-label="Internal workspace navigation"]',
  );
  const inactive = sidebar
    .locator(".nav-item:not([aria-current='page'])")
    .first();
  const label = inactive.locator(".nav-item-label");
  const icon = inactive.locator("svg.nav-item-icon");

  const labelStyle = await styles(label);
  const inactiveBox = await inactive.boundingBox();
  const iconBox = await icon.boundingBox();

  expect(labelStyle.fontFamily).not.toContain("Source Code Pro");
  expect(labelStyle.color).not.toBe("rgb(102, 102, 102)");

  expect(inactiveBox).not.toBeNull();
  expect(iconBox).not.toBeNull();

  await expectApprox(inactiveBox!.height, 40, 0.8);
  await expectApprox(iconBox!.width, 24, 0.8);
});

test("Internal collapsed width remains unchanged", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/demo/admin");

  const root = page
    .locator('[data-internal-shell-role="ADMIN"]')
    .first();
  const sidebar = root.locator(
    'aside[aria-label="Internal workspace navigation"]',
  );

  await page
    .getByRole("button", { name: "Collapse navigation" })
    .click();

  const sidebarBox = await sidebar.boundingBox();
  expect(sidebarBox).not.toBeNull();
  await expectApprox(sidebarBox!.width, 72, 1);
});

test("Internal mobile drawer width remains unchanged", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo/admin");

  await page
    .getByRole("button", { name: "Open navigation" })
    .click();

  const sidebar = page.locator(
    'aside[aria-label="Internal workspace navigation"]',
  );
  await expect(sidebar).toBeVisible();

  const box = await sidebar.boundingBox();
  expect(box).not.toBeNull();
  await expectApprox(box!.width, 320, 1);
});

test("Applicant mobile drawer width remains unchanged", async ({
  page,
}) => {
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

  const box = await sidebar.boundingBox();
  expect(box).not.toBeNull();
  await expectApprox(box!.width, 286, 1);
});
