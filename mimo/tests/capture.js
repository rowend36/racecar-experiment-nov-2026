const { chromium } = require('playwright-core');
const fs = require('fs');
const BRAVE = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const OUT = './out/';
const TAG = 'cap' + Date.now().toString(36);

function saveDataUrl(dataUrl, path) {
  const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(path, Buffer.from(b64, 'base64'));
}

(async () => {
  const browser = await chromium.launch({
    executablePath: BRAVE, headless: true,
    args: ['--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--use-angle=metal', '--no-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  page.on('console', m => { if (m.type() === 'error') console.log('[err]', m.text()); });
  await page.goto('file:///Users/fresh/Work/racecar/mimo/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.MIMO_GAME && window.MIMO_GAME.scene, { timeout: 25000 });
  await page.waitForTimeout(1000);

  const TOKENS = { menu: '#ff0000', countdown: '#00ff00', chase: '#0000ff', nitro: '#ff00ff' };
  const grab = async (name) => {
    const url = await page.evaluate(({ name, token }) => {
      const g = window.MIMO_GAME;
      g.updateCamera(0.016);
      g.renderFrame();
      const src = document.getElementById('gl');
      const c = document.createElement('canvas');
      c.width = src.width; c.height = src.height;
      const x = c.getContext('2d');
      x.drawImage(src, 0, 0);
      // unique verification token: colored bar + label
      x.fillStyle = token;
      x.fillRect(0, c.height - 40, 300, 40);
      x.fillStyle = '#000';
      x.font = 'bold 26px monospace';
      x.fillText(name.toUpperCase(), 12, c.height - 10);
      return c.toDataURL('image/png');
    }, { name, token: TOKENS[name] });
    saveDataUrl(url, OUT + TAG + '_' + name + '.png');
    console.log('saved', name);
  };

  // menu scene
  await page.evaluate(() => document.getElementById('menu-title').classList.add('hidden'));
  await page.waitForTimeout(600);
  await grab('menu');
  await page.evaluate(() => document.getElementById('menu-title').classList.remove('hidden'));

  // start + countdown
  await page.evaluate(() => document.getElementById('btn-start').click());
  await page.waitForTimeout(2100);
  await grab('countdown');

  // racing
  await page.waitForTimeout(2600);
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(3500);
  await page.evaluate(() => window.MIMO_GAME.player.respawn(window.MIMO_GAME.track));
  await page.waitForTimeout(3000);
  await grab('chase');

  // nitro
  await page.keyboard.down('ShiftLeft');
  await page.waitForTimeout(800);
  await grab('nitro');
  await page.keyboard.up('ShiftLeft');
  await page.keyboard.up('KeyW');

  // structural checks for overlays
  const checks = await page.evaluate(() => {
    const g = window.MIMO_GAME;
    g.finishRace();
    return { state: g.state };
  });
  await page.waitForTimeout(2300);
  const overlay = await page.evaluate(() => {
    const el = document.getElementById('menu-results');
    const cs = getComputedStyle(el);
    return {
      visible: !el.classList.contains('hidden') && cs.display !== 'none',
      rows: document.querySelectorAll('#results-list .res-row').length,
      title: document.getElementById('results-title').textContent
    };
  });
  console.log('results overlay:', JSON.stringify(overlay), 'pre:', JSON.stringify(checks));
  console.log('TAG', TAG);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
