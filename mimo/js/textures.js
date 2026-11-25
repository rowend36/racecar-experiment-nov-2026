/* MIMO VELOCITY — procedural texture synthesis (canvas-based, zero assets) */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';

// periodic value noise (tileable)
function hash2i(x, y, seed) {
  let n = x * 374761393 + y * 668265263 + seed * 144665;
  n = (n ^ (n >> 13)) >>> 0;
  n = Math.imul(n, 1274126177) >>> 0;
  return ((n ^ (n >> 16)) >>> 0) / 4294967296;
}
function smooth(t) { return t * t * (3 - 2 * t); }
function pnoise(x, y, period, seed) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const w = (a, p) => ((a % p) + p) % p;
  const x0 = w(ix, period), x1 = w(ix + 1, period);
  const y0 = w(iy, period), y1 = w(iy + 1, period);
  const a = hash2i(x0, y0, seed), b = hash2i(x1, y0, seed);
  const c = hash2i(x0, y1, seed), d = hash2i(x1, y1, seed);
  const sx = smooth(fx), sy = smooth(fy);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
function pfbm(x, y, period, octaves, seed, gain, lac) {
  gain = gain || .5; lac = lac || 2;
  let v = 0, amp = .5, p = period, f = 1, norm = 0;
  for (let i = 0; i < octaves; i++) {
    v += amp * pnoise(x * f, y * f, p * f, seed + i * 31);
    norm += amp;
    amp *= gain; f *= lac;
  }
  return v / norm;
}

function canvasTex(size, fn) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const px = x / size, py = y / size;
      const r = fn(px, py, x, y);
      if (r.length === 4) { d[i] = r[0]; d[i+1] = r[1]; d[i+2] = r[2]; d[i+3] = r[3]; }
      else { d[i] = d[i+1] = d[i+2] = r[0]; d[i+3] = 255; }
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function normalFromHeight(heightFn, size, strength) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const h = (x, y) => heightFn(((x % size) + size) % size / size, ((y % size) + size) % size / size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (h(x + 1, y) - h(x - 1, y)) * strength;
      const dy = (h(x, y + 1) - h(x, y - 1)) * strength;
      let nx = -dx, ny = -dy, nz = 1;
      const l = Math.hypot(nx, ny, nz);
      nx /= l; ny /= l; nz /= l;
      const i = (y * size + x) * 4;
      d[i] = (nx * .5 + .5) * 255;
      d[i+1] = (ny * .5 + .5) * 255;
      d[i+2] = (nz * .5 + .5) * 255;
      d[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

const TEX = {};
M.textures = TEX;

TEX.build = function (gl) {
  const out = {};

  // ---- asphalt albedo (tileable) ----
  const S = 512;
  const asph = canvasTex(S, (px, py) => {
    const n1 = pfbm(px * 24, py * 24, 24, 4, 11);
    const n2 = pfbm(px * 90, py * 90, 90, 2, 27);
    const grain = hash2i((px * S) | 0, (py * S) | 0, 5);
    // aggregate stones
    const stone = Math.max(0, pnoise(px * 60, py * 60, 60, 91) - .72) * 3.2;
    let v = 36 + n1 * 30 + n2 * 22 + (grain - .5) * 22;
    v += stone * 70;
    // occasional light stone
    if (grain > .985) v += 60;
    // oil / tar patches
    const patch = pfbm(px * 4, py * 4, 4, 3, 61);
    v *= (.82 + patch * .34);
    v = Math.max(14, Math.min(150, v));
    return [v * .97, v * .99, v * 1.06];
  });

  const asphN = normalFromHeight((px, py) => {
    const n1 = pfbm(px * 24, py * 24, 24, 4, 11);
    const n2 = pfbm(px * 90, py * 90, 90, 2, 27);
    const stone = Math.max(0, pnoise(px * 60, py * 60, 60, 91) - .72) * 3.2;
    return n1 * .5 + n2 * .35 + stone * .9;
  }, S, 26);

  // ---- concrete / pavement ----
  const concrete = canvasTex(256, (px, py) => {
    const n = pfbm(px * 18, py * 18, 18, 4, 7);
    const g = hash2i((px * 256) | 0, (py * 256) | 0, 3);
    let v = 70 + n * 40 + (g - .5) * 14;
    // subtle cracks
    const cr = Math.abs(pfbm(px * 6, py * 6, 6, 3, 17) - .5);
    if (cr < .01) v *= .82;
    return [v * .96, v * .98, v * 1.04];
  });

  // ---- kerb stripes (red/white tileable along u) ----
  const kerb = canvasTex(128, (px, py) => {
    const band = Math.floor(px * 4) % 2;
    const wear = pfbm(px * 30, py * 30, 30, 3, 44);
    const grime = pfbm(px * 8, py * 8, 8, 3, 55);
    let r, g, b;
    if (band === 0) { r = 175; g = 36; b = 44; } else { r = 205; g = 205; b = 210; }
    const f = .68 + wear * .5 + grime * .2;
    return [Math.min(255, r * f * .9), Math.min(255, g * f * .95), Math.min(255, b * f)];
  });

  // ---- smoke sprite (soft puff, alpha) ----
  const smoke = canvasTex(128, (px, py) => {
    const dx = px - .5, dy = py - .5;
    const d = Math.hypot(dx, dy) * 2;
    const n = pfbm(px * 6, py * 6, 6, 4, 101);
    const a = Math.max(0, 1 - d) ** 2.1 * (.55 + n * .85);
    const v = 200 + n * 55;
    return [v, v, v, Math.min(255, a * 255)];
  });

  // ---- glow sprite ----
  const glow = canvasTex(64, (px, py) => {
    const d = Math.hypot(px - .5, py - .5) * 2;
    const a = Math.max(0, 1 - d) ** 2.6;
    return [255, 255, 255, Math.min(255, a * 255)];
  });

  // ---- spark sprite (tiny bright core) ----
  const spark = canvasTex(32, (px, py) => {
    const d = Math.hypot(px - .5, py - .5) * 2;
    const a = Math.max(0, 1 - d) ** 3.2;
    return [255, 245, 210, Math.min(255, a * 255)];
  });

  // ---- flame sprite ----
  const flame = canvasTex(64, (px, py) => {
    const dx = px - .5, dy = py - .5;
    const d = Math.hypot(dx, dy * 1.5) * 2;
    const n = pfbm(px * 5, py * 9, 5, 3, 77);
    const a = Math.max(0, 1 - d) ** 1.8 * (.6 + n * .8);
    const t = Math.max(0, 1 - d);
    return [255, 140 + t * 100, 60 + t * 160, Math.min(255, a * 255)];
  });

  // ---- speed streak (for nitro trails) ----
  const streak = canvasTex(64, (px, py) => {
    const dy = Math.abs(py - .5) * 2;
    const along = Math.sin(px * Math.PI);
    const a = Math.max(0, 1 - dy) ** 2.4 * along;
    return [200, 235, 255, Math.min(255, a * 255)];
  });

  // ---- particle atlas: 4x2 tiles of 128px (smoke, glow, spark, flame / streak, soft) ----
  const atlas = document.createElement('canvas');
  atlas.width = 512; atlas.height = 256;
  {
    const ax = atlas.getContext('2d');
    ax.clearRect(0, 0, 512, 256);
    ax.drawImage(smoke, 0, 0);       // (0,0) -> uv(0, .5) after flipY
    ax.drawImage(glow, 128, 0);
    ax.drawImage(spark, 256, 0);
    ax.drawImage(flame, 384, 0);
    ax.drawImage(streak, 0, 128);
    ax.drawImage(glow, 128, 128);    // soft circle variant
  }

  const up = (canvas, opts) => M.gl.makeTexture2D(gl, canvas, opts || {});
  out.asphaltAlbedo = up(asph, { repeat: true, aniso: true });
  out.asphaltNormal = up(asphN, { repeat: true, aniso: true });
  out.concrete = up(concrete, { repeat: true, aniso: true });
  out.kerb = up(kerb, { repeat: true, aniso: true });
  out.smoke = up(smoke, { noMips: false });
  out.glow = up(glow, {});
  out.spark = up(spark, {});
  out.flame = up(flame, {});
  out.streak = up(streak, {});
  out.atlas = up(atlas, {});
  out.canvases = { asph, asphN, concrete, kerb };
  return out;
};

})(window.MIMO);
