import { defineConfig, devices } from "@playwright/test";
import { tmpdir } from "node:os";
import path from "node:path";

const port = 3113;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/acceptance/d33",
  testMatch: "**/*.pw.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 240_000,
  expect: {
    timeout: 15_000,
  },
  reporter: "line",
  outputDir: path.join(tmpdir(), "faidia-d33-6-playwright"),
  use: {
    baseURL,
    channel: "chrome",
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "Africa/Nairobi",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `NEXT_TELEMETRY_DISABLED=1 npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/demo/supervisor`,
    reuseExistingServer: true,
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
