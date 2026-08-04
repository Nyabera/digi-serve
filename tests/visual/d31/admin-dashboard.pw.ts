import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";
import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const DASHBOARD_ROUTE = "/demo/admin";
const DASHBOARD_ROOT =
  '[data-dashboard-role="admin"]';

const comparisonDirectory = path.resolve(
  "docs/demo-engine-base/d31-dashboard-redesign/"
    + "admin-visual-comparison",
);

const designReferencePath = path.resolve(
  "public/demo/references/dashboards/"
    + "admin-dashboard-bundle-reference.png",
);

const implementationPreviewPath = path.resolve(
  "public/demo/references/dashboards/"
    + "admin-dashboard-bundle-implementation-preview.png",
);

const mobilePreviewPath = path.resolve(
  "public/demo/references/dashboards/"
    + "admin-dashboard-bundle-mobile-preview.png",
);

type Crop = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

type ComparisonResult = {
  readonly targetOriginalWidth: number;
  readonly targetOriginalHeight: number;
  readonly targetCrop: Crop;
  readonly currentWidth: number;
  readonly currentHeight: number;
  readonly parityScore: number;
  readonly overlayDataUrl: string;
  readonly normalizedCurrentDataUrl: string;
  readonly croppedTargetDataUrl: string;
};

test.describe.configure({
  mode: "serial",
});

async function prepareAdminDashboard(
  page: Page,
): Promise<Locator> {
  await page.emulateMedia({
    reducedMotion: "reduce",
  });

  await page.goto(DASHBOARD_ROUTE, {
    waitUntil: "networkidle",
  });

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const dashboard = page.locator(
    DASHBOARD_ROOT,
  );

  await expect(dashboard).toBeVisible();

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

  await expect(
    dashboard.locator(
      ".adm-chart-box svg",
    ),
  ).toHaveCount(3);

  await page.waitForTimeout(450);

  return dashboard;
}

function dataUrlToBuffer(
  value: string,
): Buffer {
  return Buffer.from(
    value.replace(
      /^data:image\/png;base64,/,
      "",
    ),
    "base64",
  );
}

async function compareAgainstTargetCrop(
  page: Page,
  current: Buffer,
  target: Buffer,
  crop: Crop,
): Promise<ComparisonResult> {
  return page.evaluate(
    async ({
      currentBase64,
      targetBase64,
      cropValue,
    }) => {
      function loadImage(
        source: string,
      ): Promise<HTMLImageElement> {
        return new Promise(
          (resolve, reject) => {
            const image = new Image();

            image.onload = () =>
              resolve(image);

            image.onerror = () =>
              reject(
                new Error(
                  "Unable to load visual-comparison image.",
                ),
              );

            image.src = source;
          },
        );
      }

      const currentImage =
        await loadImage(
          `data:image/png;base64,${currentBase64}`,
        );

      const targetImage =
        await loadImage(
          `data:image/png;base64,${targetBase64}`,
        );

      const width = cropValue.width;
      const height = cropValue.height;

      const targetCanvas =
        document.createElement("canvas");
      const currentCanvas =
        document.createElement("canvas");
      const overlayCanvas =
        document.createElement("canvas");

      for (const canvas of [
        targetCanvas,
        currentCanvas,
        overlayCanvas,
      ]) {
        canvas.width = width;
        canvas.height = height;
      }

      const targetContext =
        targetCanvas.getContext("2d");
      const currentContext =
        currentCanvas.getContext("2d");
      const overlayContext =
        overlayCanvas.getContext("2d");

      if (
        !targetContext
        || !currentContext
        || !overlayContext
      ) {
        throw new Error(
          "Canvas 2D context is unavailable.",
        );
      }

      targetContext.drawImage(
        targetImage,
        cropValue.x,
        cropValue.y,
        cropValue.width,
        cropValue.height,
        0,
        0,
        width,
        height,
      );

      currentContext.drawImage(
        currentImage,
        0,
        0,
        width,
        height,
      );

      overlayContext.drawImage(
        targetCanvas,
        0,
        0,
      );

      overlayContext.globalAlpha = 0.5;
      overlayContext.drawImage(
        currentCanvas,
        0,
        0,
      );
      overlayContext.globalAlpha = 1;

      const targetPixels =
        targetContext.getImageData(
          0,
          0,
          width,
          height,
        ).data;

      const currentPixels =
        currentContext.getImageData(
          0,
          0,
          width,
          height,
        ).data;

      let difference = 0;
      let samples = 0;
      const stride = 8;

      for (
        let y = 0;
        y < height;
        y += stride
      ) {
        for (
          let x = 0;
          x < width;
          x += stride
        ) {
          const index =
            (y * width + x) * 4;

          difference +=
            Math.abs(
              targetPixels[index]
                - currentPixels[index],
            )
            + Math.abs(
              targetPixels[index + 1]
                - currentPixels[index + 1],
            )
            + Math.abs(
              targetPixels[index + 2]
                - currentPixels[index + 2],
            );

          samples += 3;
        }
      }

      const normalizedDifference =
        difference
        / Math.max(1, samples)
        / 255;

      const parityScore =
        Math.max(
          0,
          Math.min(
            100,
            (1 - normalizedDifference)
              * 100,
          ),
        );

      return {
        targetOriginalWidth:
          targetImage.naturalWidth,
        targetOriginalHeight:
          targetImage.naturalHeight,
        targetCrop: cropValue,
        currentWidth:
          currentImage.naturalWidth,
        currentHeight:
          currentImage.naturalHeight,
        parityScore:
          Number(
            parityScore.toFixed(2),
          ),
        overlayDataUrl:
          overlayCanvas.toDataURL(
            "image/png",
          ),
        normalizedCurrentDataUrl:
          currentCanvas.toDataURL(
            "image/png",
          ),
        croppedTargetDataUrl:
          targetCanvas.toDataURL(
            "image/png",
          ),
      };
    },
    {
      currentBase64:
        current.toString("base64"),
      targetBase64:
        target.toString("base64"),
      cropValue: crop,
    },
  );
}

async function recordComparison(
  key: string,
  page: Page,
  currentBody: Buffer,
  currentPage: Buffer,
  targetPath: string,
  crop: Crop,
  filePrefix: string,
): Promise<void> {
  const target = await readFile(
    targetPath,
  );

  const result =
    await compareAgainstTargetCrop(
      page,
      currentBody,
      target,
      crop,
    );

  await mkdir(
    comparisonDirectory,
    {
      recursive: true,
    },
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      `${filePrefix}-current-body.png`,
    ),
    currentBody,
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      `${filePrefix}-current-page.png`,
    ),
    currentPage,
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      `${filePrefix}-target-body-crop.png`,
    ),
    dataUrlToBuffer(
      result.croppedTargetDataUrl,
    ),
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      `${filePrefix}-current-normalized.png`,
    ),
    dataUrlToBuffer(
      result.normalizedCurrentDataUrl,
    ),
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      `${filePrefix}-overlay-50.png`,
    ),
    dataUrlToBuffer(
      result.overlayDataUrl,
    ),
  );

  const metricsPath = path.join(
    comparisonDirectory,
    "ADMIN-VISUAL-METRICS.json",
  );

  let existing: Record<
    string,
    unknown
  > = {};

  try {
    existing = JSON.parse(
      await readFile(
        metricsPath,
        "utf8",
      ),
    ) as Record<string, unknown>;
  } catch {
    existing = {};
  }

  const next = {
    ...existing,
    stage: "D31-11",
    route: DASHBOARD_ROUTE,
    method:
      "Mean sampled RGB similarity after normalizing the production dashboard body to the supplied reference body crop.",
    overlayOpacity: 0.5,
    [key]: {
      targetOriginalWidth:
        result.targetOriginalWidth,
      targetOriginalHeight:
        result.targetOriginalHeight,
      targetCrop:
        result.targetCrop,
      currentWidth:
        result.currentWidth,
      currentHeight:
        result.currentHeight,
      parityScore:
        result.parityScore,
    },
  };

  await writeFile(
    metricsPath,
    JSON.stringify(
      next,
      null,
      2,
    ) + "\n",
  );
}

test(
  "Admin 1536 desktop baseline and implementation-preview comparison",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1536,
      height: 1000,
    });

    const dashboard =
      await prepareAdminDashboard(
        page,
      );

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "admin-body-desktop-1536.png",
    );

    const currentBody =
      await dashboard.screenshot({
        animations: "disabled",
        caret: "hide",
      });

    const currentPage =
      await page.screenshot({
        animations: "disabled",
        caret: "hide",
        fullPage: true,
      });

    await recordComparison(
      "implementationPreview",
      page,
      currentBody,
      currentPage,
      implementationPreviewPath,
      {
        x: 216,
        y: 0,
        width: 1320,
        height: 3327,
      },
      "admin-implementation",
    );
  },
);

test(
  "Admin 1440 desktop baseline",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1440,
      height: 1000,
    });

    const dashboard =
      await prepareAdminDashboard(
        page,
      );

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "admin-body-desktop-1440.png",
    );
  },
);

test(
  "Admin 864 reference-width baseline and design comparison",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 864,
      height: 1000,
    });

    const dashboard =
      await prepareAdminDashboard(
        page,
      );

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "admin-body-reference-width-864.png",
    );

    const currentBody =
      await dashboard.screenshot({
        animations: "disabled",
        caret: "hide",
      });

    const currentPage =
      await page.screenshot({
        animations: "disabled",
        caret: "hide",
        fullPage: true,
      });

    await recordComparison(
      "designReference",
      page,
      currentBody,
      currentPage,
      designReferencePath,
      {
        x: 184,
        y: 0,
        width: 680,
        height: 1821,
      },
      "admin-design",
    );
  },
);

test(
  "Admin 1024 tablet baseline",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1024,
      height: 900,
    });

    const dashboard =
      await prepareAdminDashboard(
        page,
      );

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "admin-body-tablet-1024.png",
    );
  },
);

test(
  "Admin 390 mobile baseline and mobile-preview comparison",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const dashboard =
      await prepareAdminDashboard(
        page,
      );

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "admin-body-mobile-390.png",
    );

    const currentBody =
      await dashboard.screenshot({
        animations: "disabled",
        caret: "hide",
      });

    const currentPage =
      await page.screenshot({
        animations: "disabled",
        caret: "hide",
        fullPage: true,
      });

    await recordComparison(
      "mobilePreview",
      page,
      currentBody,
      currentPage,
      mobilePreviewPath,
      {
        x: 0,
        y: 64,
        width: 390,
        height: 7560,
      },
      "admin-mobile",
    );

    const hasRootOverflow =
      await dashboard.evaluate(
        (element) =>
          element.scrollWidth
          > element.clientWidth + 1,
      );

    expect(
      hasRootOverflow,
      "Admin dashboard root must not create page-level horizontal overflow.",
    ).toBe(false);
  },
);

test(
  "Admin semantic structure and controls remain stable",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1440,
      height: 1000,
    });

    const dashboard =
      await prepareAdminDashboard(
        page,
      );

    for (const id of [
      "admin-zone-one",
      "admin-zone-two",
      "admin-zone-three",
      "admin-zone-five",
    ]) {
      await expect(
        dashboard.locator(`#${id}`),
      ).toBeVisible();
    }

    await expect(
      dashboard.getByRole(
        "heading",
        {
          level: 1,
        },
      ),
    ).toHaveCount(1);

    const departmentRows =
      dashboard.locator(
        ".adm-department-table tbody tr",
      );

    expect(
      await departmentRows.count(),
      "Department performance table must render configured records.",
    ).toBeGreaterThan(0);

    const approvalRows =
      dashboard.locator(
        ".adm-approvals-table tbody tr",
      );

    expect(
      await approvalRows.count(),
      "Approvals and escalations table must render configured records.",
    ).toBeGreaterThan(0);

    for (const title of [
      "Executive brief",
      "Institution-wide SLA Monitor",
      "Certificate & Verification Activity",
      "Scheduled Reports",
    ]) {
      await expect(
        dashboard.getByText(
          title,
          {
            exact: true,
          },
        ),
      ).toBeVisible();
    }

    const search =
      dashboard.getByPlaceholder(
        "Search requests, services, departments...",
      );

    await search.fill(
      "Student Affairs",
    );
    await search.press("Enter");

    await expect(
      page.getByRole("status"),
    ).toContainText(
      "Searching for",
    );

    const reportToggle =
      dashboard.getByRole(
        "button",
        {
          name: /^Toggle /,
        },
      ).first();

    await reportToggle.click();

    await expect(
      page.getByRole("status"),
    ).toContainText(
      /enabled|disabled/,
    );
  },
);
