import { expect, test, type Page } from '@playwright/test';

/** Mean absolute channel difference in a static road ROI, two frames 150 ms apart. */
async function grain(page: Page): Promise<number> {
  const shots = [(await page.screenshot()).toString('base64')];
  await page.waitForTimeout(150);
  shots.push((await page.screenshot()).toString('base64'));
  return page.evaluate(async (images) => {
    const load = (b64: string): Promise<HTMLImageElement> => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = `data:image/png;base64,${b64}`;
    });
    const [a, b] = await Promise.all(images.map(load));
    const cv = document.createElement('canvas');
    cv.width = a.width;
    cv.height = a.height;
    const ctx = cv.getContext('2d')!;
    ctx.drawImage(a, 0, 0);
    const da = ctx.getImageData(0, 0, a.width, a.height).data;
    ctx.clearRect(0, 0, a.width, a.height);
    ctx.drawImage(b, 0, 0);
    const db = ctx.getImageData(0, 0, a.width, a.height).data;
    let sum = 0;
    let count = 0;
    for (let y = 380; y < 500; y += 1) {
      for (let x = 600; x < 840; x += 1) {
        const i = (y * a.width + x) * 4;
        sum += Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]);
        count += 3;
      }
    }
    return sum / count;
  }, shots);
}

async function frozenFrame(page: Page): Promise<void> {
  await page.evaluate(() => { (window as any).__redline.mode = 'paused'; });
  await page.waitForTimeout(350);
}

test('Ultra grain stays quiet at the line and at race speed', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!(window as any).__redline, { timeout: 60000 });
  await page.evaluate(() => {
    const g = (window as any).__redline;
    g.settings.quality = 'ultra';
    g.settings.weather = 'sunset';
    g.applySettings();
    g.startRace();
  });
  await page.waitForFunction(() => (window as any).__redline.debugState().mode === 'racing', { timeout: 20000 });

  await frozenFrame(page);
  const atLine = await grain(page);
  await page.evaluate(() => { (window as any).__redline.mode = 'racing'; (window as any).__redline.debugAutopilot = true; });
  await page.waitForTimeout(4500);
  const speed = await page.evaluate(() => (window as any).__redline.debugState().player.speed);
  await frozenFrame(page);
  const atSpeed = await grain(page);

  console.log(`GRAIN start-line MAD=${atLine.toFixed(3)} race-speed MAD=${atSpeed.toFixed(3)} at ${speed.toFixed(0)} km/h`);
  // Old amplitude 0.022 at 37 Hz measured 5.14; the new grade is ~0.0045 at 12 Hz.
  expect(atLine).toBeLessThan(1.5);
  expect(atSpeed).toBeLessThan(1.5);
  expect(speed).toBeGreaterThan(40);
});
