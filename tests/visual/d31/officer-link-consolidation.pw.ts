import {
  expect,
  test,
  type Page,
} from "@playwright/test";

import {
  OFFICER_NAVIGATION_ROUTE_ITEMS,
} from "../../../features/demo-engine/navigation/officer-navigation-contract";

const roleSwitcherLabel =
  "Switch Applicant, Officer, Supervisor or Admin workspace";

async function expectOfficerRoute(
  page: Page,
  expectedPathname: string,
) {
  const sidebar = page.getByRole("navigation", {
    name: "officer navigation",
  });

  await expect(page).toHaveURL(
    new RegExp(`${expectedPathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\?.*)?$`),
  );
  await expect(
    page.locator('[data-internal-shell-role="OFFICER"]'),
  ).toHaveCount(1);
  await expect(sidebar).toBeVisible();
  await expect(page.getByLabel(roleSwitcherLabel)).toHaveValue("OFFICER");
  await expect(page.locator("html")).toHaveAttribute(
    "data-demo-role",
    "officer",
  );
  await expect(sidebar.locator('[aria-current="page"]')).toHaveCount(1);
}

test("officer link audit retains route ownership and brand safety", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const dashboardResponse = await page.goto("/demo/officer", {
    waitUntil: "networkidle",
  });

  expect(dashboardResponse?.status()).toBe(200);
  await expectOfficerRoute(page, "/demo/officer");

  await page.getByRole("button", { name: "Review" }).first().click();
  await expectOfficerRoute(
    page,
    "/demo/officer/requests/REQ-2026-0715",
  );

  await page.goBack({ waitUntil: "networkidle" });
  await expectOfficerRoute(page, "/demo/officer");

  const discoveredLinks = await page.locator("main a[href]").evaluateAll(
    (anchors) =>
      [...new Set(
        anchors.reduce<string[]>((hrefs, anchor) => {
          const href = anchor.getAttribute("href");

          if (
            href?.startsWith("/demo/officer") &&
            !href.includes("#")
          ) {
            hrefs.push(href);
          }

          return hrefs;
        }, []),
      )],
  );

  for (const href of discoveredLinks) {
    const response = await page.goto(href, {
      waitUntil: "networkidle",
    });

    expect(response?.status()).toBe(200);
    await expectOfficerRoute(page, href.split("?")[0] ?? href);
  }

  for (const item of OFFICER_NAVIGATION_ROUTE_ITEMS) {
    const response = await page.goto(item.href, {
      waitUntil: "networkidle",
    });

    expect(response?.status()).toBe(200);
    await expectOfficerRoute(page, item.href);
  }

  await page.getByRole("link", {
    name: /Savannah Technical College/i,
  }).click();
  await expectOfficerRoute(page, "/demo/officer");

  await page.reload({ waitUntil: "networkidle" });
  await expectOfficerRoute(page, "/demo/officer");
});
