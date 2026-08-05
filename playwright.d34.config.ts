import {
  defineConfig,
  devices,
} from "@playwright/test";

const artifactRoot =
  process.env.D34_ARTIFACT_DIR ??
  "/tmp/d34-admin-navigation-playwright";

export default defineConfig({
  testDir: "./tests/acceptance/d34",
  testMatch: "admin-navigation-freeze.pw.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [
    ["line"],
    [
      "html",
      {
        open: "never",
        outputFolder: `${artifactRoot}/report`,
      },
    ],
  ],
  outputDir: `${artifactRoot}/results`,
  use: {
    baseURL: "http://127.0.0.1:3417",
    channel: "chrome",
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "Africa/Nairobi",
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "NEXT_TELEMETRY_DISABLED=1 npm run dev -- --hostname 127.0.0.1 --port 3417",
    url: "http://127.0.0.1:3417/demo/admin",
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
});
