import * as THREE from 'three';
import { mulberry32 } from './Math';

type Ctx = CanvasRenderingContext2D;

function makeCanvas(w: number, h: number): [HTMLCanvasElement, Ctx] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  return [c, ctx];
}

function hash2(x: number, y: number, seed: number): number {
  let h = x * 374761393 + y * 668265263 + seed * 1442695041;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967296;
}

/** Tileable value noise. Coordinates are in lattice units. */
function vnoise(x: number, y: number, period: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const wrap = (n: number): number => ((n % period) + period) % period;
  const a = hash2(wrap(xi), wrap(yi), seed);
  const b = hash2(wrap(xi + 1), wrap(yi), seed);
  const c = hash2(wrap(xi), wrap(yi + 1), seed);
  const d = hash2(wrap(xi + 1), wrap(yi + 1), seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(
  x: number,
  y: number,
  period: number,
  octaves: number,
  seed: number,
): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let per = period;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(x * freq, y * freq, per, seed + i * 71) * amp;
    amp *= 0.5;
    freq *= 2;
    per *= 2;
  }
  return sum;
}

function toTexture(canvas: HTMLCanvasElement, srgb = false): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.needsUpdate = true;
  return t;
}

function puddleMask(u: number, v: number): number {
  const n = fbm(u * 3, v * 3, 3, 4, 991);
  const n2 = fbm(u * 7, v * 7, 7, 3, 313);
  return n * 0.78 + n2 * 0.22;
}

function asphaltCanvas(size: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const coarse = fbm(u * 6, v * 6, 6, 4, 17);
      const grain = hash2(x, y, 77);
      const fine = fbm(u * 26, v * 26, 26, 2, 41);
      let lum = 56 + coarse * 30 + fine * 14 + (grain - 0.5) * 8;
      const p = puddleMask(u, v);
      if (p > 0.57) lum -= (p - 0.57) * 22;
      const i = (y * size + x) * 4;
      d[i] = lum * 0.94;
      d[i + 1] = lum * 0.97;
      d[i + 2] = lum * 1.05;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Hairline cracks and tar seams.
  const rng = mulberry32(9001);
  ctx.strokeStyle = 'rgba(10,12,15,0.5)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 26; i++) {
    let px = rng() * size;
    let py = rng() * size;
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (let s = 0; s < 14; s++) {
      px += (rng() - 0.5) * 16;
      py += rng() * 10;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  return canvas;
}

function asphaltRoughnessCanvas(size: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const p = puddleMask(u, v);
      const grain = hash2(x, y, 91);
      let rough = 0.82 + (fbm(u * 14, v * 14, 14, 3, 8) - 0.5) * 0.12;
      rough += (grain - 0.5) * 0.04;
      // Puddles are mirror-smooth and slightly darker.
      rough = rough * (1 - Math.min(1, Math.max(0, (p - 0.56) / 0.12))) + 0.55;
      const c = Math.max(0, Math.min(255, rough * 255));
      const i = (y * size + x) * 4;
      d[i] = c;
      d[i + 1] = c;
      d[i + 2] = c;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function asphaltNormalCanvas(size: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const height = (u: number, v: number): number =>
    fbm(u * 9, v * 9, 9, 3, 5) * 0.75 + fbm(u * 26, v * 26, 26, 2, 9) * 0.25;
  const e = 1 / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const dx = height(u + e, v) - height(u - e, v);
      const dy = height(u, v + e) - height(u, v - e);
      const nx = -dx * 0.7;
      const ny = -dy * 0.7;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz);
      const i = (y * size + x) * 4;
      d[i] = ((nx / len) * 0.5 + 0.5) * 255;
      d[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      d[i + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function carbonCanvas(size: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const cell = 8;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.floor(x / cell);
      const cy = Math.floor(y / cell);
      const horizontal = (cx + cy) % 2 === 0;
      const local = horizontal ? (x % cell) / cell : (y % cell) / cell;
      const sheen = 0.5 + 0.5 * Math.sin(local * Math.PI);
      const base = horizontal ? 16 : 9;
      const lum = base + sheen * (horizontal ? 16 : 10);
      const i = (y * size + x) * 4;
      d[i] = lum;
      d[i + 1] = lum * 1.02;
      d[i + 2] = lum * 1.08;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function carbonNormalCanvas(size: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const cell = 8;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.floor(x / cell);
      const cy = Math.floor(y / cell);
      const horizontal = (cx + cy) % 2 === 0;
      const local = horizontal ? (x % cell) / cell : (y % cell) / cell;
      const slope = Math.cos(local * Math.PI * 2) * 0.5;
      const nx = horizontal ? 0 : slope;
      const ny = horizontal ? slope : 0;
      const len = Math.hypot(nx, ny, 1);
      const i = (y * size + x) * 4;
      d[i] = ((nx / len) * 0.5 + 0.5) * 255;
      d[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      d[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function windowsCanvas(w: number, h: number, lit: boolean): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(w, h);
  ctx.fillStyle = lit ? '#000000' : '#151a24';
  ctx.fillRect(0, 0, w, h);
  const rng = mulberry32(4242);
  const cols = 13;
  const rows = 30;
  const mx = w * 0.06;
  const my = h * 0.04;
  const cw = (w - mx * 2) / cols;
  const ch = (h - my * 2) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = rng() > (lit ? 0.58 : 0.8);
      const x = mx + c * cw + cw * 0.14;
      const y = my + r * ch + ch * 0.18;
      const ww = cw * 0.68;
      const hh = ch * 0.55;
      if (on) {
        const warm = rng() > 0.35;
        const a = lit ? 1 : 0.55;
        ctx.fillStyle = warm
          ? `rgba(${230 + rng() * 25},${160 + rng() * 50},${70 + rng() * 60},${a})`
          : `rgba(${90 + rng() * 40},${150 + rng() * 60},${220},${a})`;
      } else {
        ctx.fillStyle = lit ? 'rgba(0,0,0,0)' : 'rgba(30,40,58,0.9)';
      }
      ctx.fillRect(x, y, ww, hh);
      if (!lit) {
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(x, y, ww, hh * 0.18);
      }
    }
  }
  return canvas;
}

function crowdCanvas(w: number, h: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(w, h);
  ctx.fillStyle = '#0b0d14';
  ctx.fillRect(0, 0, w, h);
  const rng = mulberry32(717);
  const palette = ['#ffcf9e', '#e8f0ff', '#ff6b8a', '#5fd4ff', '#ffb347', '#c1a2ff'];
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = palette[Math.floor(rng() * palette.length)];
    ctx.globalAlpha = 0.25 + rng() * 0.6;
    const x = rng() * w;
    const y = rng() * h;
    ctx.fillRect(x, y, 2 + rng() * 2, 2 + rng() * 2);
  }
  ctx.globalAlpha = 1;
  return canvas;
}

function radialSprite(size: number, inner: string, outer: string): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

function palmFrondCanvas(w: number, h: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#243c22';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.5);
  ctx.quadraticCurveTo(w * 0.5, h * 0.42, w, h * 0.5);
  ctx.stroke();
  ctx.fillStyle = '#1f3a20';
  for (let i = 0; i < 26; i++) {
    const x = 10 + (i / 26) * (w - 20);
    const spread = 0.35 + Math.sin((i / 26) * Math.PI) * 0.5;
    const len = h * spread;
    ctx.save();
    ctx.translate(x, h * 0.5);
    ctx.rotate((i % 2 === 0 ? -1 : 1) * 0.45);
    ctx.beginPath();
    ctx.ellipse(0, -len * 0.45, 4.5, len * 0.55, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  return canvas;
}

function checkerCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(256, 64);
  const n = 16;
  const size = canvas.width / n;
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < n; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#eceff5' : '#0b0c10';
      ctx.fillRect(x * size, y * 32, size, 32);
    }
  }
  return canvas;
}

function curbCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(32, 128);
  ctx.fillStyle = '#d9dce4';
  ctx.fillRect(0, 0, 32, 128);
  ctx.fillStyle = '#c8203a';
  ctx.fillRect(0, 0, 32, 64);
  const grime = ctx.createLinearGradient(0, 0, 32, 0);
  grime.addColorStop(0, 'rgba(0,0,0,0.0)');
  grime.addColorStop(0.5, 'rgba(0,0,0,0.12)');
  grime.addColorStop(1, 'rgba(0,0,0,0.0)');
  ctx.fillStyle = grime;
  ctx.fillRect(0, 0, 32, 128);
  return canvas;
}

function billboardCanvas(title: string, subtitle: string, accent: string): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(512, 256);
  const g = ctx.createLinearGradient(0, 0, 512, 256);
  g.addColorStop(0, '#070a12');
  g.addColorStop(1, '#141a2a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 492, 236);
  ctx.fillStyle = accent;
  ctx.fillRect(28, 32, 68, 8);
  ctx.font = 'italic 900 78px "Arial Black", Arial, sans-serif';
  ctx.fillStyle = '#f4f7ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 28, 128);
  ctx.font = '600 28px Arial, sans-serif';
  ctx.fillStyle = accent;
  ctx.fillText(subtitle, 32, 196);
  return canvas;
}

function textCanvas(text: string, color: string): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(1024, 256);
  ctx.clearRect(0, 0, 1024, 256);
  ctx.font = 'italic 900 172px "Arial Black", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, 512, 132);
  return canvas;
}

function terrainCanvas(size: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const n = fbm(u * 7, v * 7, 7, 4, 613);
      const grit = hash2(x, y, 771);
      const green = 0.72 + n * 0.35;
      const lum = 150 + n * 70 + (grit - 0.5) * 24;
      const i = (y * size + x) * 4;
      d[i] = lum * green * 0.92;
      d[i + 1] = lum;
      d[i + 2] = lum * green * 0.78;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

export interface TextureSet {
  asphalt: THREE.CanvasTexture;
  asphaltRough: THREE.CanvasTexture;
  asphaltNormal: THREE.CanvasTexture;
  carbon: THREE.CanvasTexture;
  carbonNormal: THREE.CanvasTexture;
  windows: THREE.CanvasTexture;
  windowsLit: THREE.CanvasTexture;
  crowd: THREE.CanvasTexture;
  terrain: THREE.CanvasTexture;
  shadow: THREE.CanvasTexture;
  smoke: THREE.CanvasTexture;
  spark: THREE.CanvasTexture;
  glowCyan: THREE.CanvasTexture;
  glowMagenta: THREE.CanvasTexture;
  palmFrond: THREE.CanvasTexture;
  checker: THREE.CanvasTexture;
  curb: THREE.CanvasTexture;
  billboards: THREE.CanvasTexture[];
  startSign: THREE.CanvasTexture;
}

export function createTextures(maxAnisotropy: number): TextureSet {
  const asphalt = toTexture(asphaltCanvas(512), true);
  const asphaltRough = toTexture(asphaltRoughnessCanvas(512));
  const asphaltNormal = toTexture(asphaltNormalCanvas(512));
  const carbon = toTexture(carbonCanvas(256), true);
  const carbonNormal = toTexture(carbonNormalCanvas(256));
  const windows = toTexture(windowsCanvas(256, 512, false), true);
  const windowsLit = toTexture(windowsCanvas(256, 512, true), true);
  const crowd = toTexture(crowdCanvas(128, 128), true);
  const shadow = toTexture(radialSprite(128, 'rgba(0,0,0,0.78)', 'rgba(0,0,0,0)'), true);
  const terrain = toTexture(terrainCanvas(256), true);
  terrain.repeat.set(70, 70);
  const smoke = toTexture(radialSprite(128, 'rgba(220,225,235,0.85)', 'rgba(220,225,235,0)'), true);
  const spark = toTexture(radialSprite(64, 'rgba(255,240,190,1)', 'rgba(255,120,20,0)'), true);
  const glowCyan = toTexture(radialSprite(128, 'rgba(120,240,255,0.95)', 'rgba(40,180,255,0)'), true);
  const glowMagenta = toTexture(radialSprite(128, 'rgba(255,90,200,0.95)', 'rgba(120,20,160,0)'), true);
  const palmFrond = toTexture(palmFrondCanvas(256, 128), true);
  const checker = toTexture(checkerCanvas(), true);
  const curb = toTexture(curbCanvas(), true);
  const billboards = [
    toTexture(billboardCanvas('VANTA', 'SYNTHETIC FUEL', '#37e6ff'), true),
    toTexture(billboardCanvas('NITRO', 'BOOST THE NIGHT', '#ff2d73'), true),
    toTexture(billboardCanvas('APEX', 'PRECISION TYRES', '#ffb02e'), true),
    toTexture(billboardCanvas('VOLT', 'HYPERCARS', '#8d6bff'), true),
  ];
  const startSign = toTexture(textCanvas('VANTA GP', '#f5f8ff'), true);

  const all = [asphalt, asphaltRough, asphaltNormal, carbon, carbonNormal, windows,
    windowsLit, crowd, terrain, shadow, smoke, spark, glowCyan, glowMagenta, palmFrond, checker, curb,
    startSign, ...billboards];
  for (const t of all) {
    t.anisotropy = Math.min(8, maxAnisotropy);
    t.needsUpdate = true;
  }
  asphalt.repeat.set(1, 1);
  crowd.wrapS = crowd.wrapT = THREE.ClampToEdgeWrapping;
  shadow.wrapS = shadow.wrapT = THREE.ClampToEdgeWrapping;
  smoke.wrapS = smoke.wrapT = THREE.ClampToEdgeWrapping;
  spark.wrapS = spark.wrapT = THREE.ClampToEdgeWrapping;
  glowCyan.wrapS = glowCyan.wrapT = THREE.ClampToEdgeWrapping;
  glowMagenta.wrapS = glowMagenta.wrapT = THREE.ClampToEdgeWrapping;
  startSign.wrapS = startSign.wrapT = THREE.ClampToEdgeWrapping;

  return {
    asphalt,
    asphaltRough,
    asphaltNormal,
    carbon,
    carbonNormal,
    windows,
    windowsLit,
    crowd,
    terrain,
    shadow,
    smoke,
    spark,
    glowCyan,
    glowMagenta,
    palmFrond,
    checker,
    curb,
    billboards,
    startSign,
  };
}
