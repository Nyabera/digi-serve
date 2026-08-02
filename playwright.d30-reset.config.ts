import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.D30_RESET_PORT ?? 3111);

export default defineConfig({
  testDir: "./tests/acceptance/d30",
  testMatch: "demo-reset-behaviour.pw.ts",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  workers: 1,
  fullyParallel: false,
  retries: 0,
  outputDir: "artifacts/d30-reset/test-results",
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/d30-reset/playwright-results.json" }],
    ["html", { outputFolder: "artifacts/d30-reset/playwright-report", open: "never" }],
  ],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}/demo`,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
