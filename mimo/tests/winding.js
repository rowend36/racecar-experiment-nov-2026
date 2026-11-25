const { chromium } = require('playwright-core');
const BRAVE = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
(async () => {
  const browser = await chromium.launch({
    executablePath: BRAVE, headless: true,
    args: ['--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--use-angle=metal', '--no-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto('file:///Users/fresh/Work/racecar/mimo/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.MIMO_GAME && window.MIMO_GAME.scene, { timeout: 25000 });

  const report = await page.evaluate(() => {
    const M = window.MIMO;
    const out = {};

    // ---- winding audit for a mesh (with index-range buckets) ----
    function audit(mesh, label, center, ranges, boxCenters) {
      const p = mesh.raw.positions, idx = mesh.raw.indices;
      const cols = mesh.raw.colors;
      let bad = 0, total = 0;
      const badById = {};
      const byRange = {};
      const samples = [];
      for (let t = 0; t < idx.length; t += 3) {
        const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
        const ax = p[a], ay = p[a + 1], az = p[a + 2];
        const bx = p[b], by = p[b + 1], bz = p[b + 2];
        const cx = p[c], cy = p[c + 1], cz = p[c + 2];
        const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
        const e2x = cx - ax, e2y = cy - ay, e2z = cz - az;
        const nx = e1y * e2z - e1z * e2y;
        const ny = e1z * e2x - e1x * e2z;
        const nz = e1x * e2y - e1y * e2x;
        const mx = (ax + bx + cx) / 3, my = (ay + by + cy) / 3, mz = (az + bz + cz) / 3;
        const tri = t / 3;
        let rname = 'other';
        if (ranges) for (const r of ranges) if (tri >= r[0] && tri < r[1]) rname = r[2];
        // accessory-box triangles are tested against the box that contains them
        let rc = center;
        if (rname === 'boxes' && boxCenters) {
          let owner = null;
          for (const bc of boxCenters) {
            if (mx >= bc[0] - 1e-3 && mx <= bc[3] + 1e-3 &&
                my >= bc[1] - 1e-3 && my <= bc[4] + 1e-3 &&
                mz >= bc[2] - 1e-3 && mz <= bc[5] + 1e-3) { owner = bc; break; }
          }
          if (owner) rc = [(owner[0] + owner[3]) / 2, (owner[1] + owner[4]) / 2, (owner[2] + owner[5]) / 2];
        }
        const dx = mx - rc[0], dy = my - rc[1], dz = mz - rc[2];
        const d = nx * dx + ny * dy + nz * dz;
        total++;
        if (d < -1e-6) {
          bad++;
          const mat = cols ? cols[idx[t] * 4 + 3] : -1;
          badById[mat] = (badById[mat] || 0) + 1;
          byRange[rname] = (byRange[rname] || 0) + 1;
          if (samples.length < 8) samples.push({ tri, rname, centroid: [+mx.toFixed(2), +my.toFixed(2), +mz.toFixed(2)] });
        }
      }
      out[label] = { total, bad, badById, byRange, samples };
    }

    // accessory boxes as AABB [minx,miny,minz,maxx,maxy,maxz] (must match geometry.js acc list)
    const BOXES = [
      [-1.04, 0.86, 0.66, -0.94, 0.98, 0.94],   // mirror L
      [ 0.94, 0.86, 0.66,  1.04, 0.98, 0.94],   // mirror R
      [-0.98, 0.96, -2.12, -0.88, 1.14, -1.96], // upright L
      [ 0.88, 0.96, -2.12,  0.98, 1.14, -1.96], // upright R
      [-1.02, 1.12, -2.18,  1.02, 1.20, -1.92], // wing blade
      [-0.62, 0.24, -2.34, -0.34, 0.42, -2.22], // exhaust L
      [ 0.34, 0.24, -2.34,  0.62, 0.42, -2.22], // exhaust R
      [-0.86, 0.10,  2.02,  0.86, 0.19,  2.30], // splitter
      [-0.80, 0.12, -2.36,  0.80, 0.24, -2.16]  // diffuser
    ];
    audit(MIMO_GAME.scene.carBody, 'carBody', [0, 0.6, 0],
      [[0, 308, 'loft'], [308, 336, 'caps'], [336, 444, 'boxes']], BOXES);
    audit(MIMO_GAME.scene.carWheel, 'carWheel', [0, 0, 0]);

    // ---- buildings vs track clearance ----
    const t = MIMO_GAME.track;
    const per = t.length / t.N;
    let worst = { dist: 1e9 };
    for (const b of t.buildingList) {
      // distance from building AABB to nearest track centerline sample
      for (let i = 0; i < t.N; i++) {
        const s = t.spline.samples[i];
        const dx = Math.max(0, Math.abs(s.x - b.x) - b.w / 2);
        const dz = Math.max(0, Math.abs(s.z - b.z) - b.d / 2);
        const d = Math.hypot(dx, dz);
        if (d < worst.dist) worst = { dist: d, b: { x: Math.round(b.x), z: Math.round(b.z), w: b.w, d: b.d, h: b.h, far: !!b.far }, sample: Math.round(i * per) };
      }
    }
    out.buildingClearance = worst;
    out.buildingCount = t.buildingList.length;
    void per;
    return out;
  });
  console.log(JSON.stringify(report, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
