import {
  defineConfig,
  devices,
} from "@playwright/test";

const port = Number(
  process.env.D30_ACCEPTANCE_PORT
    ?? 3112,
);

export default defineConfig({
  testDir:
    "./tests/acceptance/d30",
  testMatch:
    "**/*.pw.ts",
  timeout:
    30_000,
  expect: {
    timeout:
      10_000,
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
    "artifacts/d30-acceptance/test-results",
  reporter: [
    [
      "list",
    ],
    [
      "json",
      {
        outputFile:
          "artifacts/d30-acceptance/playwright-results.json",
      },
    ],
    [
      "html",
      {
        outputFolder:
          "artifacts/d30-acceptance/playwright-report",
        open:
          "never",
      },
    ],
  ],
  use: {
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
  projects: [
    {
      name:
        "chromium",
      use: {
        ...devices[
          "Desktop Chrome"
        ],
      },
    },
  ],
});
