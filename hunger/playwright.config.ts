import { defineConfig } from '@playwright/test';

const bravePath = process.env.BRAVE_PATH ?? '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:43821',
    viewport: { width: 1440, height: 900 },
    headless: true,
    launchOptions: {
      executablePath: bravePath,
      args: ['--use-angle=metal', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 43821',
    url: 'http://127.0.0.1:43821',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
