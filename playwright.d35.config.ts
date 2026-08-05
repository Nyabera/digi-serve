import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.D35_BASE_URL;
const baseURL =
  externalBaseURL ?? "http://127.0.0.1:3105";

export default defineConfig({
  testDir: "./tests/acceptance/d35",
  testMatch: /.*\.pw\.ts/,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["line"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command:
          "npm run dev -- --hostname 127.0.0.1 --port 3105",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
