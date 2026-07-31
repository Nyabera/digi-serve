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

const DASHBOARD_ROUTE = "/demo/officer";
const DASHBOARD_ROOT = ".d31-officer-reference";
const FROZEN_HEADER =
  "This is what your day looks like today • Friday, July 31, 2026";

const overlayDirectory = path.resolve(
  "docs/demo-engine-base/d31-dashboard-redesign/visual-overlays",
);
const referenceFile = path.resolve(
  "public/demo/references/dashboards/officer-dashboard.png",
);

async function prepareDashboard(
  page: Page,
): Promise<Locator> {
  await page.goto(DASHBOARD_ROUTE, {
    waitUntil: "networkidle",
  });

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const dashboard = page.locator(DASHBOARD_ROOT);
  await expect(dashboard).toBeVisible();

  await page
    .locator(".dashboard-header p")
    .evaluate((element, text) => {
      element.textContent = text;
    }, FROZEN_HEADER);

  await page.addStyleTag({
    content: `

      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  });

  return dashboard;
}

async function createOverlay(
  page: Page,
  implementation: Buffer,
): Promise<void> {
  const reference = await readFile(referenceFile);

  const dataUrl = await page.evaluate(
    async ({
      implementationBase64,
      referenceBase64,
    }) => {
      function loadImage(source: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(
            new Error("Unable to load overlay image."),
          );
          image.src = source;
        });
      }

      const implementationImage = await loadImage(
        `data:image/png;base64,${implementationBase64}`,
      );
      const referenceImage = await loadImage(
        `data:image/png;base64,${referenceBase64}`,
      );

      const canvas = document.createElement("canvas");
      canvas.width = implementationImage.naturalWidth;
      canvas.height = implementationImage.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas 2D context is unavailable.");
      }

      context.drawImage(
        referenceImage,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      context.globalAlpha = 0.5;
      context.drawImage(
        implementationImage,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      context.globalAlpha = 1;

      return canvas.toDataURL("image/png");
    },
    {
      implementationBase64:
        implementation.toString("base64"),
      referenceBase64:
        reference.toString("base64"),
    },
  );

  await mkdir(overlayDirectory, {
    recursive: true,
  });

  await writeFile(
    path.join(
      overlayDirectory,
      "officer-reference-overlay.png",
    ),
    Buffer.from(
      dataUrl.replace(
        /^data:image\/png;base64,/,
        "",
      ),
      "base64",
    ),
  );

  await writeFile(
    path.join(
      overlayDirectory,
      "officer-implementation-reference.png",
    ),
    implementation,
  );
}

test.describe.configure({
  mode: "serial",
});

test("reference desktop visual baseline", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 1920,
    height: 1200,
  });

  const dashboard = await prepareDashboard(page);

  await expect(dashboard).toHaveScreenshot(
    "officer-reference-desktop.png",
  );

  const implementation =
    await dashboard.screenshot({
      animations: "disabled",
      caret: "hide",
    });

  await createOverlay(
    page,
    implementation,
  );
});

test("80 percent browser zoom baseline", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 1536,
    height: 1000,
  });

  const dashboard = await prepareDashboard(page);

  await page.evaluate(() => {
    document.documentElement.style.zoom = "0.8";
  });

  await expect(dashboard).toHaveScreenshot(
    "officer-browser-zoom-80.png",
  );
});

test("1440 desktop baseline", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 1440,
    height: 1000,
  });

  const dashboard = await prepareDashboard(page);

  await expect(dashboard).toHaveScreenshot(
    "officer-desktop-1440.png",
  );
});

test("1024 tablet baseline", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 1024,
    height: 900,
  });

  const dashboard = await prepareDashboard(page);

  await expect(dashboard).toHaveScreenshot(
    "officer-tablet-1024.png",
  );
});

test("390 mobile baseline", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 390,
    height: 844,
  });

  const dashboard = await prepareDashboard(page);

  await expect(dashboard).toHaveScreenshot(
    "officer-mobile-390.png",
  );
});

test("Officer controls remain interactive", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 1440,
    height: 1000,
  });

  await prepareDashboard(page);

  const waitingTab = page.getByRole("tab", {
    name: /Waiting on others/,
  });

  await waitingTab.click();
  await expect(waitingTab).toHaveAttribute(
    "aria-selected",
    "true",
  );

  const assignmentTab = page.getByRole("tab", {
    name: "Assignments",
  });

  await assignmentTab.click();
  await expect(assignmentTab).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page
    .getByLabel("Chart period")
    .selectOption("Last 14 days");

  await expect(
    page.getByLabel("Chart period"),
  ).toHaveValue("Last 14 days");

  await page
    .getByRole("button", {
      name: "Mark all read",
    })
    .click();

  await expect(
    page.getByRole("status"),
  ).toContainText(
    "All case signals marked as read",
  );
});

test("Officer semantic structure remains stable", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 1440,
    height: 1000,
  });

  await prepareDashboard(page);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Good afternoon, Grace",
    }),
  ).toHaveCount(1);

  await expect(
    page.locator(".work-table thead th"),
  ).toHaveCount(8);

  await expect(
    page.locator(".work-table tbody tr"),
  ).toHaveCount(6);

  await expect(
    page.locator(".rhythm-card .rhythm-chart"),
  ).toHaveCount(1);

  await expect(
    page.locator(".rhythm-card .sla-ring"),
  ).toHaveCount(1);
});
