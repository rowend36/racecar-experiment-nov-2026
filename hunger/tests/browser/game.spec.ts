import { expect, test } from '@playwright/test';

test('renders the menu and completes a playable race smoke test in Brave', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');
  await page.waitForFunction(() => window.hungerGame?.phase === 'menu', undefined, { timeout: 90_000 });
  await expect(page.locator('#loading-screen')).toBeHidden();
  await expect(page.locator('#game-canvas')).toBeVisible();
  await expect(page.locator('[data-action="start"]').first()).toBeVisible();
  await page.screenshot({ path: 'test-results/menu.png', fullPage: true });

  await page.locator('[data-action="start"]').first().click();
  await page.waitForFunction(() => window.hungerGame?.phase === 'racing', undefined, { timeout: 15_000 });
  await page.keyboard.down('KeyW');
  await page.waitForFunction(() => {
    const game = window.hungerGame as unknown as { playerPhysics: { speed: number } };
    return game.playerPhysics.speed > 5;
  }, undefined, { timeout: 25_000 });
  const speedSample = await page.evaluate(() => ({
    speed: (window.hungerGame as unknown as { playerPhysics: { speed: number } }).playerPhysics.speed,
    displayed: Number(document.querySelector('[data-role="speed"]')?.textContent),
  }));
  expect(speedSample.speed).toBeGreaterThan(5);
  // The HUD intentionally updates at 24 Hz, so allow latency under heavy GPU load.
  expect(Math.abs(speedSample.displayed - speedSample.speed * 3.6)).toBeLessThan(30);
  const framing = await page.evaluate(() => {
    const game = window.hungerGame as unknown as {
      camera: { position: { toArray(): number[] } };
      playerVisual: { root: { visible: boolean; position: { clone(): { project(camera: unknown): { x: number; y: number; z: number } } } } };
      renderer: { info: { render: { calls: number; triangles: number } } };
    };
    const projected = game.playerVisual.root.position.clone().project(game.camera);
    return { projected, camera: game.camera.position.toArray(), visible: game.playerVisual.root.visible, render: game.renderer.info.render };
  });
  expect(framing.visible).toBe(true);
  expect(Math.abs(framing.projected.x)).toBeLessThan(1);
  expect(Math.abs(framing.projected.y)).toBeLessThan(1);
  expect(framing.projected.z).toBeGreaterThan(-1);
  expect(framing.projected.z).toBeLessThan(1);
  expect(framing.render.calls).toBeLessThan(300);
  await page.keyboard.up('KeyW');
  await page.screenshot({ path: 'test-results/race.png', fullPage: true });

  await page.keyboard.press('KeyP');
  await page.waitForFunction(() => window.hungerGame?.phase === 'paused');
  await page.keyboard.press('KeyP');
  await page.waitForFunction(() => window.hungerGame?.phase === 'racing');
  await page.keyboard.press('KeyC');
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(200);
  const recoveredSpeed = await page.evaluate(() => Math.abs((window.hungerGame as unknown as { playerPhysics: { speed: number } }).playerPhysics.speed));
  expect(recoveredSpeed).toBeLessThan(1);

  await page.keyboard.press('KeyP');
  await page.waitForFunction(() => window.hungerGame?.phase === 'paused');
  await page.locator('[data-role="pause-panel"] [data-action="back"]').click();
  await page.waitForFunction(() => window.hungerGame?.phase === 'menu');
  await expect(page.locator('[data-action="start"]').first()).toBeVisible();

  expect(errors).toEqual([]);
});

test('garage and graphics settings update the live game and persist', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 960, height: 600 });
  await page.goto('/');
  await page.waitForFunction(() => window.hungerGame?.phase === 'menu', undefined, { timeout: 90_000 });

  await page.locator('[data-action="garage"]').first().click();
  await expect(page.locator('[data-screen-panel="garage"]')).toBeVisible();
  await page.locator('[data-color="#39d6ff"]').click();
  await page.locator('[data-finish="pearl"]').click();
  await page.locator('[data-screen-panel="garage"] [data-action="back"]').click();

  await page.locator('[data-action="settings"]').first().click();
  await expect(page.locator('[data-screen-panel="settings"]')).toBeVisible();
  await page.locator('[data-quality="ultra"]').click();
  await page.locator('#setting-steering-sensitivity').evaluate((input) => {
    const range = input as HTMLInputElement;
    range.value = '0.5';
    range.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(750);
  const settings = await page.evaluate(() => JSON.parse(localStorage.getItem('hunger-apex-settings-v1') ?? '{}'));
  expect(settings.paintColor).toBe('#39d6ff');
  expect(settings.paintFinish).toBe('pearl');
  expect(settings.quality).toBe('ultra');
  expect(settings.steeringSensitivity).toBe(0.5);
  const live = await page.evaluate(() => ({
    color: (window.hungerGame as unknown as { settings: { paintColor: string } }).settings.paintColor,
    quality: (window.hungerGame as unknown as { settings: { quality: string } }).settings.quality,
    steeringSensitivity: (window.hungerGame as unknown as { settings: { steeringSensitivity: number } }).settings.steeringSensitivity,
  }));
  expect(live).toEqual({ color: '#39d6ff', quality: 'ultra', steeringSensitivity: 0.5 });
  expect(errors).toEqual([]);
});

test.describe('touch layout', () => {
  test.use({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });

  test('remains usable on a phone-sized landscape viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.hungerGame?.phase === 'menu', undefined, { timeout: 90_000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBe(false);
    await page.locator('[data-action="start"]').first().click();
    await page.waitForFunction(() => window.hungerGame?.phase === 'racing', undefined, { timeout: 15_000 });
    const throttle = page.locator('[data-control="throttle"]');
    await expect(throttle).toBeVisible();
    const box = await throttle.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForFunction(() => {
        const game = window.hungerGame as unknown as { playerPhysics: { speed: number } };
        return game.playerPhysics.speed > 3;
      }, undefined, { timeout: 25_000 });
      await page.mouse.up();
    }
    const speed = await page.evaluate(() => (window.hungerGame as unknown as { playerPhysics: { speed: number } }).playerPhysics.speed);
    expect(speed).toBeGreaterThan(3);
  });
});
