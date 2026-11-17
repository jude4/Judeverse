import { defineConfig } from "@playwright/test";

// Start the development server, or serve out/ mounted at /Judeverse/, before running.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  outputDir: "/tmp/judeverse-playwright-results",
  reporter: "list",
  use: {
    baseURL: process.env.STUDIO_BASE_URL || "http://127.0.0.1:3001/Judeverse/",
    viewport: { width: 1440, height: 1000 },
    hasTouch: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: [
        "--no-sandbox",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    },
  },
});
