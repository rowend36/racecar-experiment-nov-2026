import { expect, test, type Page } from '@playwright/test';

/**
 * Reproduces the real user path: programmatic focus is deliberately disabled
 * (as happens when the window is not yet focused during boot), so the only way
 * into the game is the browser's own Tab order and real key events.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    HTMLElement.prototype.focus = function () { /* simulate ignored focus() */ };
  });
});

async function active(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el ? `${el.tagName.toLowerCase()}#${el.id || ''}` : 'none';
  });
}

async function tabToStart(page: Page): Promise<number> {
  for (let i = 0; i < 50; i += 1) {
    if (await active(page) === 'button#start-btn') return i;
    await page.keyboard.press('Tab');
  }
  return -1;
}

test('real Tab order from a fresh load never starts on the invisible canvas', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('/');
  await page.waitForFunction(() => !!(window as any).__redline, { timeout: 60000 });

  // Before the fix this was "canvas#game"; Space there did nothing but handbrake.
  const first = await active(page);
  expect(first).not.toBe('canvas#game');
  expect(first).toMatch(/^button#/);
  await page.keyboard.press('Tab');
  expect(await active(page)).not.toBe('canvas#game');

  // Real Tab traversal from that point, no locator.focus() anywhere.
  const tabs = await tabToStart(page);
  expect(tabs).toBeGreaterThan(0);
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => (window as any).__redline.debugState().mode === 'racing', { timeout: 20000 });

  await page.keyboard.down('w');
  await page.waitForTimeout(1400);
  await page.keyboard.up('w');
  expect(await page.evaluate(() => (window as any).__redline.debugState().player.speed)).toBeGreaterThan(5);

  // Both Escape directions work without relying on programmatic focus.
  await page.keyboard.press('Escape');
  await expect(page.locator('#pause')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#pause')).toBeHidden();
  await page.waitForFunction(() => (window as any).__redline.debugState().mode === 'racing');

  await page.evaluate(() => {
    const g = (window as any).__redline;
    g.debugAutopilot = true;
    for (let i = 0; i < 120 * 200 && g.mode === 'racing'; i += 1) g.stepPhysics(1 / 120);
  });
  await expect(page.locator('#results')).toBeVisible({ timeout: 20000 });
  await page.keyboard.press('Enter');
  await expect(page.locator('#results')).toBeHidden();

  expect(errors).toEqual([]);
});
