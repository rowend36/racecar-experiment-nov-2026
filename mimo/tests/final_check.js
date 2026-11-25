const { chromium } = require('playwright-core');
const BRAVE = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const OUT = './out/';

(async () => {
  const browser = await chromium.launch({
    executablePath: BRAVE, headless: true,
    args: ['--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--use-angle=metal', '--no-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto('file:///Users/fresh/Work/racecar/mimo/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.MIMO_GAME && window.MIMO_GAME.scene, { timeout: 25000 });
  await page.waitForTimeout(1000);

  const check = (name, ok, extra) => console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? ' :: ' + extra : ''));

  // 1. boot state
  let s = await page.evaluate(() => ({
    state: window.MIMO_GAME.state,
    fps: 0
  }));
  check('boot -> menu', s.state === 'menu', s.state);

  // 2. fps sample
  const fps = await page.evaluate(() => new Promise(res => {
    let n = 0; const t0 = performance.now();
    const loop = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(loop); else res(Math.round(n / ((performance.now() - t0) / 1000))); };
    requestAnimationFrame(loop);
  }));
  check('fps >= 30', fps >= 30, fps + ' fps');

  // 3. settings: quality low + res 50 then restore
  await page.evaluate(() => {
    const q = document.getElementById('set-quality'); q.value = 'low';
    q.dispatchEvent(new Event('change'));
    const r = document.getElementById('set-res'); r.value = '50';
    r.dispatchEvent(new Event('input'));
  });
  await page.waitForTimeout(700);
  s = await page.evaluate(() => ({ q: window.MIMO_GAME.qualityName, res: window.MIMO_GAME.userRes, cw: document.getElementById('gl').width }));
  check('settings applied', s.q === 'low' && s.res === 0.5, JSON.stringify(s));
  await page.evaluate(() => {
    const q = document.getElementById('set-quality'); q.value = 'high';
    q.dispatchEvent(new Event('change'));
    const r = document.getElementById('set-res'); r.value = '100';
    r.dispatchEvent(new Event('input'));
  });

  // 4. garage select different car
  await page.evaluate(() => {
    document.getElementById('btn-garage').click();
    document.querySelectorAll('.car-chip')[2].click();
  });
  await page.waitForTimeout(400);
  s = await page.evaluate(() => ({
    sel: window.MIMO_GAME.selectedCar,
    open: !document.getElementById('menu-garage').classList.contains('hidden')
  }));
  check('garage pick', s.sel === 2 && s.open, JSON.stringify(s));
  await page.evaluate(() => document.getElementById('btn-garage-back').click());

  // 5. start race
  await page.evaluate(() => document.getElementById('btn-start').click());
  await page.waitForTimeout(4500);
  s = await page.evaluate(() => ({ state: window.MIMO_GAME.state, t: window.MIMO_GAME.raceTime }));
  check('countdown -> racing', s.state === 'racing', JSON.stringify(s));

  // 6. drive + camera modes + respawn
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(3000);
  for (let i = 0; i < 3; i++) { await page.keyboard.press('KeyC'); await page.waitForTimeout(300); }
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(1500);
  s = await page.evaluate(() => ({
    mode: window.MIMO_GAME.camMode,
    kmh: Math.round(Math.abs(window.MIMO_GAME.player.vF) * 3.6),
    lat: +window.MIMO_GAME.player.lat.toFixed(1)
  }));
  check('drive/camera/respawn', s.kmh > 30 && Math.abs(s.lat) < 6, JSON.stringify(s));

  // 7. pause / resume
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  s = await page.evaluate(() => window.MIMO_GAME.state);
  check('escape pauses', s === 'paused', s);
  await page.evaluate(() => document.getElementById('btn-resume').click());
  await page.waitForTimeout(400);
  s = await page.evaluate(() => window.MIMO_GAME.state);
  check('resume', s === 'racing', s);

  // 8. nitro drains & refills
  const n0 = await page.evaluate(() => window.MIMO_GAME.player.nitro);
  await page.keyboard.down('ShiftLeft');
  await page.waitForTimeout(900);
  const n1 = await page.evaluate(() => window.MIMO_GAME.player.nitro);
  await page.keyboard.up('ShiftLeft');
  check('nitro drains', n1 < n0, n0.toFixed(0) + ' -> ' + n1.toFixed(0));

  // 9. keep racing to ~35s, verify AI laps/positions evolve, player moving
  await page.waitForTimeout(15000);
  s = await page.evaluate(() => {
    const g = window.MIMO_GAME;
    return {
      t: Math.round(g.raceTime),
      laps: g.cars.map(c => c.lap),
      positions: g.cars.map(c => c.position).sort().join(''),
      playerKmh: Math.round(Math.abs(g.player.vF) * 3.6),
      playerLap: g.player.lap
    };
  });
  check('mid-race progress', s.t > 18 && s.positions === '123456', JSON.stringify(s));
  await page.keyboard.up('KeyW');

  // 10. finish -> results -> race again -> quit
  await page.evaluate(() => window.MIMO_GAME.finishRace());
  await page.waitForTimeout(2300);
  s = await page.evaluate(() => ({
    open: !document.getElementById('menu-results').classList.contains('hidden'),
    rows: document.querySelectorAll('#results-list .res-row').length
  }));
  check('results visible', s.open && s.rows === 6, JSON.stringify(s));
  await page.evaluate(() => document.getElementById('btn-again').click());
  await page.waitForTimeout(600);
  s = await page.evaluate(() => window.MIMO_GAME.state);
  check('race again -> countdown', s === 'countdown', s);
  await page.evaluate(() => { window.MIMO_GAME.pause(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => document.getElementById('btn-quit').click());
  await page.waitForTimeout(700);
  s = await page.evaluate(() => ({
    state: window.MIMO_GAME.state,
    title: !document.getElementById('menu-title').classList.contains('hidden'),
    hudHidden: document.getElementById('hud').classList.contains('hidden')
  }));
  check('quit -> menu', s.state === 'menu' && s.title && s.hudHidden, JSON.stringify(s));

  // 11. final scene brightness probe (canvas capture avg luminance)
  const stats = await page.evaluate(() => {
    const g = window.MIMO_GAME;
    g.updateCamera(0.016); g.renderFrame();
    const src = document.getElementById('gl');
    const c = document.createElement('canvas');
    c.width = 160; c.height = 90;
    const x = c.getContext('2d');
    x.drawImage(src, 0, 0, 160, 90);
    const d = x.getImageData(0, 0, 160, 90).data;
    let sum = 0, blown = 0;
    for (let i = 0; i < d.length; i += 4) {
      const l = (d[i] * .2126 + d[i+1] * .7152 + d[i+2] * .0722);
      sum += l;
      if (l > 250) blown++;
    }
    return { avg: +(sum / (d.length / 4)).toFixed(1), blownPct: +(100 * blown / (d.length / 4)).toFixed(2) };
  });
  check('exposure sane', stats.avg > 12 && stats.avg < 140 && stats.blownPct < 25, JSON.stringify(stats));

  console.log('ERRORS:', errors.length);
  errors.slice(0, 6).forEach(e => console.log('  ! ' + e));
  await browser.close();
  process.exit(errors.length ? 2 : 0);
})().catch(e => { console.error('HARNESS FAILURE', e); process.exit(1); });
