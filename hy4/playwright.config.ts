import { defineConfig } from '@playwright/test';

const PORT = 43822;
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/browser',
  timeout: 180000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: BASE,
    headless: true,
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      args: ['--use-gl=angle', '--use-angle=metal', '--enable-webgl', '--ignore-gpu-blocklist'],
    },
  },
  webServer: {
    command: `npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE,
    timeout: 120000,
    reuseExistingServer: true,
  },
});
