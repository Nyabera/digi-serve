import {
  defineConfig,
  devices,
} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual/d31",
  testMatch: "**/*.pw.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.02,
    },
  },
  reporter: [
    ["line"],
    [
      "html",
      {
        open: "never",
        outputFolder:
          "artifacts/d31-visual/playwright-report",
      },
    ],
  ],
  outputDir:
    "artifacts/d31-visual/test-results",
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{arg}{ext}",
  use: {
    baseURL: "http://127.0.0.1:3107",
    channel: "chrome",
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "Africa/Nairobi",
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "NEXT_TELEMETRY_DISABLED=1 npm run dev -- --hostname 127.0.0.1 --port 3107",
    url:
      "http://127.0.0.1:3107/demo/officer",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
});
