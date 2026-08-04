import {
  expect,
  test,
  type Page,
} from "@playwright/test";
import {
  mkdir,
} from "node:fs/promises";
import {
  readFileSync,
} from "node:fs";
import path from "node:path";

type DemoRole =
  | "public"
  | "applicant"
  | "officer"
  | "supervisor"
  | "admin";

type RouteRecord = {
  readonly path: string;
  readonly source: string;
  readonly dynamic: boolean;
  readonly expectedRole:
    DemoRole;
  readonly category: string;
  readonly captureEvidence:
    boolean;
};

type RouteManifest = {
  readonly defaults: {
    readonly requestId:
      string;
    readonly route:
      string;
    readonly role:
      string;
  };
  readonly requiredJourneys:
    Record<string, boolean>;
  readonly targetedRoutes: {
    readonly referral:
      string | null;
    readonly reports:
      readonly string[];
    readonly sla:
      readonly string[];
    readonly tracking:
      string | null;
  };
  readonly routes:
    readonly RouteRecord[];
};

const manifestPath = path.resolve(
  "docs/demo-engine-base/d30-freeze/"
    + "D30-12-ROUTE-MANIFEST.json",
);

const screenshotDirectory =
  path.resolve(
    "docs/demo-engine-base/d30-freeze/"
      + "screenshots/acceptance",
  );

const manifest =
  JSON.parse(
    readFileSync(
      manifestPath,
      "utf8",
    ),
  ) as RouteManifest;

type ResetAudit = {
  readonly storageKeysUnderContract:
    readonly string[];
};

const resetAudit =
  JSON.parse(
    readFileSync(
      path.resolve(
        "docs/demo-engine-base/d30-freeze/"
          + "D30-11-RESET-IMPLEMENTATION-AUDIT.json",
      ),
      "utf8",
    ),
  ) as ResetAudit;

const roleSelectors: Readonly<
  Record<
    Exclude<
      DemoRole,
      "public"
    >,
    string
  >
> = {
  applicant:
    '[data-dashboard-role="applicant"], [data-demo-role="applicant"], .applicant-workspace',
  officer:
    '[data-dashboard-role="officer"], [data-demo-role="officer"], .officer-dashboard',
  supervisor:
    '[data-dashboard-role="supervisor"], [data-demo-role="supervisor"]',
  admin:
    '[data-dashboard-role="admin"], [data-demo-role="admin"]',
};

async function expectRoleWorkspace(
  page: Page,
  role: Exclude<
    DemoRole,
    "public"
  >,
  route: string,
): Promise<void> {
  const workspaces =
    page.locator(
      roleSelectors[role],
    );

  const count =
    await workspaces.count();

  expect(
    count,
    `${route} did not expose its expected ${role} workspace.`,
  ).toBeGreaterThan(0);

  await expect(
    workspaces.first(),
    `${route} did not expose a visible ${role} workspace.`,
  ).toBeVisible();
}

test.describe.configure({
  mode:
    "serial",
});

async function stabilize(
  page: Page,
): Promise<void> {
  await page.evaluate(
    async () => {
      await document.fonts.ready;
    },
  );

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

  await page.waitForTimeout(
    200,
  );
}

async function openRoute(
  page: Page,
  route: string,
): Promise<void> {
  const errors: string[] = [];

  page.on(
    "pageerror",
    (error) => {
      errors.push(
        error.message,
      );
    },
  );

  const response =
    await page.goto(
      route,
      {
        waitUntil:
          "domcontentloaded",
      },
    );

  await page.waitForLoadState(
    "networkidle",
  ).catch(
    () => undefined,
  );

  await stabilize(page);

  if (response) {
    expect(
      response.status(),
      `${route} returned a non-success route response.`,
    ).toBeLessThan(400);
  }

  await expect(
    page.locator("body"),
  ).toBeVisible();

  await expect(
    page.locator("body"),
  ).not.toContainText(
    /Internal Server Error|Application error: a client-side exception has occurred/i,
  );

  expect(
    errors,
    `${route} emitted an uncaught browser error.`,
  ).toEqual([]);
}

function screenshotName(
  route: string,
): string {
  if (
    route.startsWith(
      "/demo/track/",
    )
  ) {
    return "track.png";
  }

  const name = route
    .replace(/^\/demo\/?/, "")
    .replace(
      /[^a-z0-9]+/gi,
      "-",
    )
    .replace(
      /^-|-$/g,
      "",
    )
    || "home";

  return `${name}.png`;
}

test(
  "required D30 journeys are represented in the route manifest",
  async () => {
    const missing =
      Object.entries(
        manifest.requiredJourneys,
      )
        .filter(
          (
            [, present],
          ) => !present,
        )
        .map(
          ([name]) => name,
        );

    expect(
      missing,
      "Required Demo journeys are missing from the route manifest.",
    ).toEqual([]);
  },
);

for (
  const route
  of manifest.routes
) {
  test(
    `route loads: ${route.path}`,
    async ({
      page,
    }) => {
      await page.setViewportSize({
        width:
          1440,
        height:
          1000,
      });

      await openRoute(
        page,
        route.path,
      );

      if (
        route.expectedRole
        !== "public"
      ) {
        if (
          route.expectedRole
          === "applicant"
          && route.path.startsWith(
            "/demo/track/",
          )
        ) {
          await expect(
            page.locator(
              '[data-track-request-ui="service-workflow"], main',
            ).first(),
            `${route.path} did not expose its Applicant tracking workspace.`,
          ).toBeVisible();
        } else {
          await expectRoleWorkspace(
            page,
            route.expectedRole,
            route.path,
          );
        }
      }

      if (
        route.captureEvidence
      ) {
        await mkdir(
          screenshotDirectory,
          {
            recursive:
              true,
          },
        );

        await page.screenshot({
          path:
            path.join(
              screenshotDirectory,
              screenshotName(
                route.path,
              ),
            ),
          animations:
            "disabled",
          caret:
            "hide",
          fullPage:
            false,
        });
      }
    },
  );
}

test(
  "role navigation keeps Applicant, Officer, Supervisor and Admin routes distinct",
  async ({
    page,
  }) => {
    const applicantPath =
      manifest.targetedRoutes.tracking;

    expect(
      applicantPath,
      "No seeded Applicant tracking route is available.",
    ).not.toBeNull();

    const roleRoutes = [
      {
        role:
          "applicant",
        path:
          applicantPath!,
      },
      {
        role:
          "officer",
        path:
          "/demo/officer",
      },
      {
        role:
          "supervisor",
        path:
          "/demo/supervisor",
      },
      {
        role:
          "admin",
        path:
          "/demo/admin",
      },
    ] as const;

    for (
      const entry
      of roleRoutes
    ) {
      await openRoute(
        page,
        entry.path,
      );

      if (
        entry.role
        === "applicant"
      ) {
        await expect(
          page.locator(
            '[data-track-request-ui="service-workflow"], main',
          ).first(),
        ).toBeVisible();
      } else {
        await expectRoleWorkspace(
          page,
          entry.role,
          entry.path,
        );
      }

      expect(
        new URL(
          page.url(),
        ).pathname,
      ).toBe(
        entry.path,
      );
    }
  },
);

test(
  "workflow builder route exposes working controls",
  async ({
    page,
  }) => {
    await openRoute(
      page,
      "/demo/admin/workflows/builder",
    );

    await expectRoleWorkspace(
      page,
      "admin",
      "/demo/admin/workflows/builder",
    );

    expect(
      await page.getByRole(
        "button",
      ).count(),
      "Workflow builder must expose at least one working control.",
    ).toBeGreaterThan(0);
  },
);

test(
  "referral journey opens for the seeded request",
  async ({
    page,
  }) => {
    const referralRoute =
      manifest.targetedRoutes.referral;

    expect(
      referralRoute,
      "No seeded Officer request route is available for referral acceptance.",
    ).not.toBeNull();

    await openRoute(
      page,
      referralRoute!,
    );

    await expectRoleWorkspace(
      page,
      "officer",
      referralRoute!,
    );

    await expect(
      page.locator("body"),
    ).toContainText(
      /Share Workflow|Refer Case|Share \/ Refer Workflow|Department or Officer|Email or Phone Number/i,
    );
  },
);

test(
  "SLA routes render chart or progress evidence",
  async ({
    page,
  }) => {
    expect(
      manifest.targetedRoutes.sla.length,
      "No SLA route was discovered.",
    ).toBeGreaterThan(0);

    for (
      const route
      of manifest.targetedRoutes.sla
    ) {
      await openRoute(
        page,
        route,
      );

      const visualCount =
        await page.locator(
          "svg, canvas, [role='progressbar']",
        ).count();

      expect(
        visualCount,
        `${route} did not render chart or progress evidence.`,
      ).toBeGreaterThan(0);
    }
  },
);

test(
  "report routes load from Demo configuration",
  async ({
    page,
  }) => {
    expect(
      manifest.targetedRoutes.reports.length,
      "No report route was discovered.",
    ).toBeGreaterThan(0);

    for (
      const route
      of manifest.targetedRoutes.reports
    ) {
      await openRoute(
        page,
        route,
      );

      await expect(
        page.locator("body"),
      ).toContainText(
        /Report|Performance|Insight|Metric/i,
      );
    }
  },
);

test(
  "Reset demo clears mutated presentation state and restores configured defaults",
  async ({
    page,
  }) => {
    await openRoute(
      page,
      "/demo",
    );

    const resetButton =
      page.getByRole(
        "button",
        {
          name:
            /Reset demo/i,
        },
      );

    await expect(
      resetButton,
      "D30-11 Reset demo control is missing.",
    ).toBeVisible();

    const keys = [
      ...resetAudit
        .storageKeysUnderContract,
    ];

    if (
      keys.length > 0
    ) {
      await page.evaluate(
        (storageKeys) => {
          for (
            const key
            of storageKeys
          ) {
            sessionStorage.setItem(
              key,
              "__d30_12_mutated__",
            );
            localStorage.setItem(
              key,
              "__d30_12_mutated__",
            );
          }
        },
        keys,
      );
    }

    await resetButton.click();

    await page.waitForTimeout(
      500,
    );

    const values =
      await page.evaluate(
        (storageKeys) =>
          storageKeys.map(
            (key) => ({
              key,
              session:
                sessionStorage.getItem(
                  key,
                ),
              local:
                localStorage.getItem(
                  key,
                ),
            }),
          ),
        keys,
      );

    for (
      const value
      of values
    ) {
      expect(
        value.session,
        `${value.key} remained mutated in sessionStorage.`,
      ).not.toBe(
        "__d30_12_mutated__",
      );

      expect(
        value.local,
        `${value.key} remained mutated in localStorage.`,
      ).not.toBe(
        "__d30_12_mutated__",
      );
    }

    await expect(
      page.locator("body"),
    ).toContainText(
      /Savannah Technical College|Savannah Tech/i,
    );

    const trackingRouteExists =
      manifest.routes.some(
        (route) =>
          route.path
          === "/demo/track",
      );

    if (
      trackingRouteExists
    ) {
      await openRoute(
        page,
        "/demo/track",
      );

      await expect(
        page.locator("body"),
      ).toContainText(
        manifest.defaults.requestId,
      );
    }
  },
);
