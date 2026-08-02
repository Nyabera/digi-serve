import {
  defineConfig,
  devices,
} from "@playwright/test";

const port = Number(
  process.env.D30_RESPONSIVE_PORT
    ?? 3113,
);

export default defineConfig({
  testDir:
    "./tests/acceptance/d30",
  testMatch:
    "demo-responsive-acceptance.pw.ts",
  timeout:
    45_000,
  expect: {
    timeout:
      12_000,
  },
  fullyParallel:
    false,
  workers:
    1,
  forbidOnly:
    true,
  retries:
    0,
  outputDir:
    "artifacts/d30-responsive/test-results",
  reporter: [
    ["list"],
    [
      "json",
      {
        outputFile:
          "artifacts/d30-responsive/playwright-results.json",
      },
    ],
    [
      "html",
      {
        outputFolder:
          "artifacts/d30-responsive/playwright-report",
        open:
          "never",
      },
    ],
  ],
  use: {
    ...devices["Desktop Chrome"],
    baseURL:
      `http://127.0.0.1:${port}`,
    trace:
      "retain-on-failure",
    screenshot:
      "only-on-failure",
    video:
      "off",
  },
  webServer: {
    command:
      `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url:
      `http://127.0.0.1:${port}/demo`,
    reuseExistingServer:
      false,
    timeout:
      120_000,
    stdout:
      "pipe",
    stderr:
      "pipe",
  },
});
