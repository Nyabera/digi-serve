import {
  expect,
  test,
  type Page,
} from "@playwright/test";

type DashboardRole =
  | "officer"
  | "supervisor"
  | "admin";

const roles: readonly DashboardRole[] = [
  "officer",
  "supervisor",
  "admin",
];

const dashboardSelectors: Readonly<
  Record<DashboardRole, string>
> = {
  officer:
    '[data-dashboard-role="officer"], .officer-dashboard',
  supervisor:
    '[data-dashboard-role="supervisor"]',
  admin:
    '[data-dashboard-role="admin"]',
};

test.describe.configure({
  mode: "serial",
});

async function openDashboard(
  page: Page,
  role: DashboardRole,
): Promise<void> {
  await page.goto(
    `/demo/${role}`,
    {
      waitUntil: "networkidle",
    },
  );

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });

  await page.waitForTimeout(300);
}

for (const role of roles) {
  test(
    `${role} dashboard owns one role body and no foreign role body`,
    async ({
      page,
    }) => {
      await page.setViewportSize({
        width: 1440,
        height: 1000,
      });

      const pageErrors: string[] = [];

      page.on(
        "pageerror",
        (error) => {
          pageErrors.push(
            error.message,
          );
        },
      );

      await openDashboard(
        page,
        role,
      );

      const expectedBody =
        page.locator(
          dashboardSelectors[role],
        );

      await expect(
        expectedBody,
      ).toHaveCount(1);

      await expect(
        expectedBody,
      ).toBeVisible();

      await expect(
        expectedBody.locator("h1"),
      ).toHaveCount(1);

      for (const otherRole of roles) {
        if (otherRole === role) {
          continue;
        }

        await expect(
          page.locator(
            dashboardSelectors[
              otherRole
            ],
          ),
        ).toHaveCount(0);
      }

      const geometry =
        await expectedBody.evaluate(
          (element) => {
            const rect =
              element.getBoundingClientRect();

            return {
              width: rect.width,
              height: rect.height,
            };
          },
        );

      expect(
        geometry.width,
        `${role} dashboard must have measurable width.`,
      ).toBeGreaterThan(300);

      expect(
        geometry.height,
        `${role} dashboard must have measurable height.`,
      ).toBeGreaterThan(500);

      expect(
        pageErrors,
        `${role} dashboard emitted an uncaught page error.`,
      ).toEqual([]);
    },
  );
}

test(
  "role routes remain mutually distinct in one browser session",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1440,
      height: 1000,
    });

    for (const role of roles) {
      await openDashboard(
        page,
        role,
      );

      await expect(
        page.locator(
          dashboardSelectors[role],
        ),
      ).toBeVisible();

      expect(
        new URL(
          page.url(),
        ).pathname,
      ).toBe(
        `/demo/${role}`,
      );
    }
  },
);
