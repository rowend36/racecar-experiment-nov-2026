import { expect, test, type Page } from '@playwright/test';

/** Tab until the given element owns focus — every step is a real keyboard press. */
async function tabTo(page: Page, selector: string): Promise<void> {
  for (let i = 0; i < 48; i += 1) {
    if (await page.locator(selector).evaluate((el) => document.activeElement === el)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Could not Tab to ${selector}`);
}

async function focused(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el ? `${el.tagName.toLowerCase()}#${el.id}${el.dataset.car ? `[data-car=${el.dataset.car}]` : ''}` : 'none';
  });
}

test('keyboard-only: garage -> race -> pause -> resume -> results', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('/');
  await page.waitForFunction(() => !!(window as any).__redline, { timeout: 60000 });
  await expect(page.locator('#menu')).toBeVisible();

  // Initial focus is placed in the garage, and it has a visible ring.
  expect(await focused(page)).toContain('data-car=vortex');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');

  // Vertical arrows move through the car list; Enter selects.
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  expect(await focused(page)).toContain('data-car=helix');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => (window as any).__redline.settings.carId)).toBe('helix');

  // Horizontal arrows select finishes and settings.
  await tabTo(page, '[data-paint="0"]');
  await page.keyboard.press('ArrowRight');
  expect(await page.evaluate(() => (window as any).__redline.settings.paint)).toBe(1);

  await tabTo(page, '[data-quality="high"]');
  await page.keyboard.press('ArrowRight');
  expect(await page.evaluate(() => (window as any).__redline.settings.quality)).toBe('ultra');
  const ultra = await page.evaluate(() => (window as any).__redline.debugState());
  await tabTo(page, '[data-quality="ultra"]');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  expect(await page.evaluate(() => (window as any).__redline.settings.quality)).toBe('low');
  const low = await page.evaluate(() => (window as any).__redline.debugState());
  // Higher fidelity must instantiate more scenery, not fewer.
  expect(ultra.sceneryInstances).toBeGreaterThan(low.sceneryInstances);
  expect(ultra.quality.dpr).toBeGreaterThan(low.quality.dpr);
  expect(ultra.quality.shadows).toBe(true);
  expect(low.quality.shadows).toBe(false);
  expect(ultra.quality.fxaa).toBe(true);
  expect(ultra.quality.bloom).toBe(true);
  expect(low.quality.bloom).toBe(true);
  await tabTo(page, '[data-quality="low"]');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  // Start with Enter, then drive with W only.
  await tabTo(page, '#start-btn');
  await page.keyboard.press('Enter');
  await expect(page.locator('#hud')).toBeVisible();
  await page.waitForFunction(() => (window as any).__redline.mode === 'racing', { timeout: 20000 });
  expect(await focused(page)).toContain('canvas#game');
  await page.keyboard.down('w');
  await page.waitForTimeout(1100);
  await page.keyboard.up('w');
  expect(await page.evaluate(() => (window as any).__redline.debugState().player.speed)).toBeGreaterThan(5);

  // Escape pauses; focus lands on RESUME and Enter resumes.
  await page.keyboard.press('Escape');
  await expect(page.locator('#pause')).toBeVisible();
  expect(await focused(page)).toContain('button#resume-btn');
  await page.keyboard.press('Enter');
  await expect(page.locator('#pause')).toBeHidden();
  await page.waitForFunction(() => (window as any).__redline.mode === 'racing');
  expect(await focused(page)).toContain('canvas#game');

  // Advance the real race simulation to the results screen without a click.
  await page.evaluate(() => {
    const g = (window as any).__redline;
    g.debugAutopilot = true;
    for (let i = 0; i < 120 * 200 && g.mode === 'racing'; i += 1) g.stepPhysics(1 / 120);
  });
  await expect(page.locator('#results')).toBeVisible({ timeout: 20000 });
  expect(await focused(page)).toContain('button#result-restart');
  await page.keyboard.press('Tab');
  expect(await focused(page)).toContain('button#result-menu');
  await page.keyboard.press('Shift+Tab');
  expect(await focused(page)).toContain('button#result-restart');
  await page.keyboard.press('Enter');
  await expect(page.locator('#results')).toBeHidden();
  await expect(page.locator('#hud')).toBeVisible();

  expect(errors).toEqual([]);
});
