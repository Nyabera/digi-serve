import {
  expect,
  test,
  type Page,
} from "@playwright/test";

const requestPath = "/demo/officer/requests/REQ-DEMO-001";
const referralPath = `${requestPath}?view=refer`;

async function expectSingleOfficerShell(page: Page) {
  const sidebar = page.getByRole("navigation", {
    name: "officer navigation",
  });

  await expect(
    page.locator('[data-internal-shell-role="OFFICER"]'),
  ).toHaveCount(1);
  await expect(sidebar).toBeVisible();
  await expect(
    sidebar.locator('[aria-current="page"]'),
  ).toHaveText("Application Queue");
}

test("request-detail remains body-only beneath one officer shell", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto(requestPath, {
    waitUntil: "networkidle",
  });

  expect(response?.status()).toBe(200);
  await expectSingleOfficerShell(page);
  await expect(
    page.locator('[data-officer-individual-case="true"]'),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "My Queue" })).toHaveAttribute(
    "href",
    "/demo/officer/queue",
  );
  await expect(
    page.getByRole("link", { name: "Transcript Requests" }),
  ).toHaveAttribute("href", "/demo/officer/queue");

  await page.reload({ waitUntil: "networkidle" });
  await expectSingleOfficerShell(page);
  await expect(
    page.locator('[data-officer-individual-case="true"]'),
  ).toBeVisible();
});

test("referral view preserves one officer shell, review, and mobile drawer behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto(referralPath, {
    waitUntil: "networkidle",
  });

  expect(response?.status()).toBe(200);
  await expectSingleOfficerShell(page);
  await expect(
    page.locator('[data-external-recipient-panel="true"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-d29r4-officer-review-body="true"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start review" }).click();
  await expect(
    page.getByText("Review started and recorded."),
  ).toBeVisible();

  await page.reload({ waitUntil: "networkidle" });
  await expectSingleOfficerShell(page);
  await expect(
    page.locator('[data-d29r4-officer-review-body="true"]'),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("Open navigation").click();
  await expect(page.getByLabel("Close navigation").first()).toBeEnabled();
  await page.getByLabel("Close navigation").first().click();
  await expect(page.getByLabel("Close navigation").first()).toBeDisabled();
  await expectSingleOfficerShell(page);
});
