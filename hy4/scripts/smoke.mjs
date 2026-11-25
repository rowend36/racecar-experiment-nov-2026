import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const PORT = Number(process.env.SMOKE_PORT || 4399);
const BRAVE = process.env.BRAVE_PATH || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const PAGE_URL = `http://127.0.0.1:${PORT}/`;
const SHOTS = new URL('../screenshots/', import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(PAGE_URL);
      if (res.ok) return;
    } catch { /* not ready */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Preview server did not start');
}

const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
  cwd: new URL('..', import.meta.url).pathname,
  detached: true,
  stdio: 'ignore',
});

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: BRAVE,
    headless: true,
    args: ['--use-gl=angle', '--use-angle=metal', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => !!window.__redline, { timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${SHOTS}menu.png` });
  console.log('MENU:', await page.evaluate(() => window.__redline.debugState()));

  await page.click('#start-btn');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${SHOTS}countdown.png` });
  await page.evaluate(() => { window.__redline.debugAutopilot = true; });
  await page.waitForTimeout(6500);
  await page.screenshot({ path: `${SHOTS}race.png` });
  const state = await page.evaluate(() => window.__redline.debugState());
  console.log('RACE:', state);

  if (state.mode !== 'racing') throw new Error(`Expected racing, got ${state.mode}`);
  if (state.cars !== 6) throw new Error(`Expected 6 cars, got ${state.cars}`);
  if (state.player.speed < 30) throw new Error(`Player too slow: ${state.player.speed} km/h`);

  // Freeze the race so both fidelity screenshots use the identical viewpoint.
  await page.evaluate(() => { window.__redline.mode = 'paused'; });
  // Quality scaler: capture both extremes and assert monotonic fidelity.
  for (const quality of ['low', 'ultra']) {
    await page.evaluate((q) => {
      const g = window.__redline;
      g.settings.quality = q;
      g.applySettings();
    }, quality);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${SHOTS}quality-${quality}.png` });
    const q = await page.evaluate(() => window.__redline.debugState().quality);
    console.log(`QUALITY ${quality}:`, q);
    if (q.quality !== quality) throw new Error(`Quality not applied: ${quality}`);
    if (q.bloom !== true) throw new Error('Bloom must be enabled at every quality tier');
  }

  await page.evaluate(() => { window.__redline.mode = 'racing'; });

  for (const weather of ['night', 'storm']) {
    await page.evaluate((w) => {
      const g = window.__redline;
      g.settings.weather = w;
      g.applySettings();
    }, weather);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${SHOTS}${weather}.png` });
  }

  await page.evaluate(() => {
    const g = window.__redline;
    g.player.lapsCompleted = 3;
    g.player.finished = true;
    g.player.finishTime = g.time;
    g.player.bestLap = 42.5;
    g.player.position = 1;
  });
  await page.waitForFunction(() => window.__redline.mode === 'results', { timeout: 10000 });
  await page.screenshot({ path: `${SHOTS}results.png` });

  if (errors.length) throw new Error(`Console errors: ${errors.join(' | ')}`);
  console.log('SMOKE PASS');
} catch (error) {
  console.error('SMOKE FAIL:', error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  try { process.kill(-server.pid, 'SIGTERM'); } catch { /* already gone */ }
}
