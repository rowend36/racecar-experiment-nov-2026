#!/usr/bin/env node
/** Capture menu + race screenshots for visual review. */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import path from 'node:path';

const BRAVE = process.env.BRAVE_PATH ?? '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const PORT = Number(process.env.SMOKE_PORT ?? 4175);
const OUT = process.argv[2] ?? 'screenshots';

let browser;
let server;
try {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'],
    { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32' });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('preview timeout')), 20000);
    server.stdout.on('data', (chunk) => {
      if (String(chunk).includes('Local:')) { clearTimeout(timer); setTimeout(resolve, 400); }
    });
    server.on('exit', () => { clearTimeout(timer); reject(new Error('preview exited')); });
  });
  const args = process.platform === 'darwin'
    ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-frame-rate-limit']
    : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
  browser = await chromium.launch({ executablePath: BRAVE, headless: true, args });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.setDefaultTimeout(60000);
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__apex?.race?.state === 'menu', { timeout: 90000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, 'menu.png') });
  await page.evaluate(() => window.__apex.race.startRace());
  await page.waitForFunction(() => window.__apex.race.state === 'racing', { timeout: 30000 });
  await page.evaluate(() => { window.__apex.race.debugAutopilot = true; });
  await page.waitForTimeout(9000);
  const info = await page.evaluate(() => ({
    kmh: Math.round(window.__apex.race.player.speedKmh),
    lap: window.__apex.race.player.lap,
    s: Math.round(window.__apex.race.player.s),
  }));
  console.log('race info', info);
  await page.screenshot({ path: path.join(OUT, 'race.png') });
} catch (err) {
  console.error('SHOTS FAILED', err);
  process.exitCode = 1;
} finally {
  try { await Promise.race([browser?.close(), new Promise((r) => setTimeout(r, 2000))]); } catch { /* ignore */ }
  try {
    if (process.platform !== 'win32' && server?.pid) process.kill(-server.pid, 'SIGKILL');
    else server?.kill('SIGKILL');
  } catch { /* ignore */ }
  process.exit(process.exitCode ?? 0);
}
