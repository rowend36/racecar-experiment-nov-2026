#!/usr/bin/env node
/**
 * macOS development smoke test.
 * Launches the installed Brave build (never a bundled Chromium), starts the
 * built game, enables the autopilot and verifies the physics/render loop.
 *
 * Usage: npm run smoke
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';

const BRAVE =
  process.env.BRAVE_PATH ?? '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const PORT = Number(process.env.SMOKE_PORT ?? 4173);

let browser;
let server;
const hardTimeout = setTimeout(() => {
  console.error('SMOKE TIMEOUT');
  process.exit(2);
}, 120000);

try {
  server = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'],
    { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32' },
  );
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('preview server timeout')), 20000);
    server.stdout.on('data', (chunk) => {
      if (String(chunk).includes('Local:')) {
        clearTimeout(timer);
        setTimeout(resolve, 400);
      }
    });
    server.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`preview server exited (${code}); run npm run build first`));
    });
  });

  const args =
    process.platform === 'darwin'
      ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-frame-rate-limit']
      : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

  browser = await chromium.launch({ executablePath: BRAVE, headless: true, args });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(30000);

  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.addInitScript(() => {
    localStorage.setItem(
      'vanta-gp-config-v1',
      JSON.stringify({
        carId: 'vxr',
        color: 0xd2102f,
        accent: 0x39e6ff,
        weather: 'sunset',
        quality: 'high',
      }),
    );
  });

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__vanta?.game?.state === 'menu', { timeout: 60000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.__vanta.ui.onStart());
  await page.waitForFunction(() => window.__vanta.game.state === 'racing', { timeout: 25000 });
  await page.evaluate(() => {
    window.__vanta.game.debugAutopilot = true;
  });
  await page.waitForTimeout(5000);

  const result = await page.evaluate(() => {
    const v = window.__vanta;
    const g = v.game;
    return {
      state: g.state,
      cars: g.cars.length,
      kmh: Math.round(g.player.speedKmh),
      lateral: Number(g.player.lateral.toFixed(2)),
      fps: Math.round(v.engine.fps),
      hud: document.getElementById('hud').classList.contains('visible'),
      calls: v.engine.rendererInfo.calls,
    };
  });

  if (errors.length) {
    console.error('CONSOLE ERRORS', errors.slice(0, 5));
    process.exitCode = 1;
  } else if (result.state !== 'racing' || result.cars !== 6 || result.kmh < 30 || !result.hud) {
    console.error('SMOKE FAILED', result);
    process.exitCode = 1;
  } else {
    console.log('SMOKE OK', result);
  }
} catch (err) {
  console.error('SMOKE FAILED', err);
  process.exitCode = 1;
} finally {
  clearTimeout(hardTimeout);
  try {
    await Promise.race([browser?.close(), new Promise((r) => setTimeout(r, 2000))]);
  } catch {
    /* ignore */
  }
  try {
    if (process.platform !== 'win32' && server?.pid) process.kill(-server.pid, 'SIGKILL');
    else server?.kill('SIGKILL');
  } catch {
    /* ignore */
  }
  process.exit(process.exitCode ?? 0);
}
