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

const DASHBOARD_ROUTE = "/demo/supervisor";
const DASHBOARD_ROOT =
  '[data-dashboard-role="supervisor"]';

const comparisonDirectory = path.resolve(
  "docs/demo-engine-base/d31-dashboard-redesign/"
    + "supervisor-visual-comparison",
);

const designReferencePath = path.resolve(
  "public/demo/references/dashboards/"
    + "supervisor-dashboard-bundle-reference.png",
);

const bundlePreviewPath = path.resolve(
  "public/demo/references/dashboards/"
    + "supervisor-dashboard-bundle-implementation-preview.png",
);

type ComparisonResult = {
  readonly targetWidth: number;
  readonly targetHeight: number;
  readonly currentWidth: number;
  readonly currentHeight: number;
  readonly parityScore: number;
  readonly overlayDataUrl: string;
  readonly normalizedCurrentDataUrl: string;
};

async function prepareDashboard(
  page: Page,
): Promise<Locator> {
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

  const heading = dashboard.getByRole(
    "heading",
    {
      level: 1,
    },
  );

  await expect(heading).toHaveCount(1);

  const headerTime = dashboard
    .locator("header time")
    .first();

  if (await headerTime.count()) {
    await headerTime.evaluate(
      (element) => {
        element.textContent =
          "May 12, 2026";
      },
    );
  }

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

  await page.waitForTimeout(350);

  return dashboard;
}

async function compareAgainstTarget(
  page: Page,
  current: Buffer,
  target: Buffer,
): Promise<ComparisonResult> {
  return page.evaluate(
    async ({
      currentBase64,
      targetBase64,
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

      const width =
        targetImage.naturalWidth;
      const height =
        targetImage.naturalHeight;

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
        targetImage,
        0,
        0,
        width,
        height,
      );

      overlayContext.globalAlpha = 0.5;
      overlayContext.drawImage(
        currentImage,
        0,
        0,
        width,
        height,
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
        targetWidth: width,
        targetHeight: height,
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
      };
    },
    {
      currentBase64:
        current.toString("base64"),
      targetBase64:
        target.toString("base64"),
    },
  );
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

async function createComparisonArtifacts(
  page: Page,
  current: Buffer,
): Promise<void> {
  const designReference =
    await readFile(
      designReferencePath,
    );

  const bundlePreview =
    await readFile(
      bundlePreviewPath,
    );

  const designComparison =
    await compareAgainstTarget(
      page,
      current,
      designReference,
    );

  const bundleComparison =
    await compareAgainstTarget(
      page,
      current,
      bundlePreview,
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
      "supervisor-current-full-page.png",
    ),
    current,
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      "supervisor-current-normalized-to-design.png",
    ),
    dataUrlToBuffer(
      designComparison
        .normalizedCurrentDataUrl,
    ),
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      "supervisor-design-overlay-50.png",
    ),
    dataUrlToBuffer(
      designComparison.overlayDataUrl,
    ),
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      "supervisor-current-normalized-to-bundle-preview.png",
    ),
    dataUrlToBuffer(
      bundleComparison
        .normalizedCurrentDataUrl,
    ),
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      "supervisor-bundle-preview-overlay-50.png",
    ),
    dataUrlToBuffer(
      bundleComparison.overlayDataUrl,
    ),
  );

  await writeFile(
    path.join(
      comparisonDirectory,
      "SUPERVISOR-VISUAL-METRICS.json",
    ),
    JSON.stringify(
      {
        stage: "D31-9",
        route: DASHBOARD_ROUTE,
        method:
          "Mean sampled RGB similarity after normalization; manual overlay review remains required.",
        overlayOpacity: 0.5,
        currentCapture: {
          width:
            designComparison.currentWidth,
          height:
            designComparison.currentHeight,
        },
        designReference: {
          width:
            designComparison.targetWidth,
          height:
            designComparison.targetHeight,
          parityScore:
            designComparison.parityScore,
        },
        bundleImplementationPreview: {
          width:
            bundleComparison.targetWidth,
          height:
            bundleComparison.targetHeight,
          parityScore:
            bundleComparison.parityScore,
        },
      },
      null,
      2,
    ) + "\n",
  );
}

test(
  "Supervisor desktop baseline and supplied-reference comparison",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1536,
      height: 1000,
    });

    const dashboard =
      await prepareDashboard(page);

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "supervisor-body-desktop-1536.png",
    );

    const fullPage =
      await page.screenshot({
        animations: "disabled",
        caret: "hide",
        fullPage: true,
      });

    await createComparisonArtifacts(
      page,
      fullPage,
    );
  },
);

test(
  "Supervisor 1440 desktop baseline",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1440,
      height: 1000,
    });

    const dashboard =
      await prepareDashboard(page);

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "supervisor-body-desktop-1440.png",
    );
  },
);

test(
  "Supervisor source-reference-width baseline",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 864,
      height: 1000,
    });

    const dashboard =
      await prepareDashboard(page);

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "supervisor-body-reference-width-864.png",
    );
  },
);

test(
  "Supervisor tablet baseline",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1024,
      height: 900,
    });

    const dashboard =
      await prepareDashboard(page);

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "supervisor-body-tablet-1024.png",
    );
  },
);

test(
  "Supervisor mobile baseline",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const dashboard =
      await prepareDashboard(page);

    await expect(
      dashboard,
    ).toHaveScreenshot(
      "supervisor-body-mobile-390.png",
    );
  },
);

test(
  "Supervisor four-zone semantic structure remains stable",
  async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1440,
      height: 1000,
    });

    const dashboard =
      await prepareDashboard(page);

    for (const id of [
      "supervisor-zone-one",
      "supervisor-zone-two",
      "supervisor-zone-three",
      "supervisor-zone-four",
    ]) {
      await expect(
        page.locator(`#${id}`),
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

    const approvalRows =
      dashboard.locator(
        'table[aria-label="Requests ready for supervisor approval"] tbody tr',
      );

    const approvalRowCount =
      await approvalRows.count();

    expect(
      approvalRowCount,
      "Approval lane must render configured Demo Pack records.",
    ).toBeGreaterThan(0);

    const queueRows =
      dashboard.locator(
        'table[aria-label="Department work queue summary"] tbody tr',
      );

    const queueRowCount =
      await queueRows.count();

    expect(
      queueRowCount,
      "Department queue must render configured Demo Pack records.",
    ).toBeGreaterThan(0);

    for (const title of [
      "Approval lane",
      "Officer workload and capacity",
      "Service flow performance",
      "Reports and exports",
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
  },
);
