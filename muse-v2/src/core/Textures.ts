import * as THREE from 'three';
import { mulberry32 } from './Math';

export interface TextureSet {
  asphalt: THREE.CanvasTexture;
  asphaltNormal: THREE.CanvasTexture;
  asphaltRough: THREE.CanvasTexture;
  windows: THREE.CanvasTexture;
  checker: THREE.CanvasTexture;
  glow: THREE.CanvasTexture;
  banner: THREE.CanvasTexture;
}

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function asphaltTextures(): { map: THREE.CanvasTexture; normal: THREE.CanvasTexture; rough: THREE.CanvasTexture } {
  const rand = mulberry32(1337);
  const [c, g] = canvas(512, 512);
  g.fillStyle = '#3f434b';
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) {
    const v = 52 + rand() * 42;
    g.fillStyle = `rgb(${v | 0},${(v + 3) | 0},${(v + 8) | 0})`;
    g.fillRect(rand() * 512, rand() * 512, 1 + rand() * 2, 1 + rand() * 2);
  }
  // Tire wear: two darker bands along the driving direction.
  for (const x of [150, 362]) {
    const grad = g.createLinearGradient(x - 46, 0, x + 46, 0);
    grad.addColorStop(0, 'rgba(18,18,22,0)');
    grad.addColorStop(0.5, 'rgba(18,18,22,0.42)');
    grad.addColorStop(1, 'rgba(18,18,22,0)');
    g.fillStyle = grad;
    g.fillRect(x - 46, 0, 92, 512);
  }
  const map = new THREE.CanvasTexture(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const [nc, ng] = canvas(256, 256);
  ng.fillStyle = '#8080ff';
  ng.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    const v = 110 + rand() * 40;
    ng.fillStyle = `rgb(${(v - 20) | 0},${(v - 20) | 0},${v | 0})`;
    ng.fillRect(rand() * 256, rand() * 256, 1 + rand() * 2, 1 + rand() * 2);
  }
  const normal = new THREE.CanvasTexture(nc);
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;

  const [rc, rg] = canvas(128, 128);
  rg.fillStyle = '#b4b4b4';
  rg.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 500; i++) {
    const v = 150 + rand() * 60;
    rg.fillStyle = `rgb(${v | 0},${v | 0},${v | 0})`;
    rg.fillRect(rand() * 128, rand() * 128, 2, 2);
  }
  const rough = new THREE.CanvasTexture(rc);
  rough.wrapS = rough.wrapT = THREE.RepeatWrapping;
  return { map, normal, rough };
}

function windowsTexture(): THREE.CanvasTexture {
  const rand = mulberry32(777);
  const [c, g] = canvas(128, 256);
  g.fillStyle = '#0b0e14';
  g.fillRect(0, 0, 128, 256);
  for (let y = 6; y < 250; y += 12) {
    for (let x = 6; x < 122; x += 10) {
      const lit = rand() > 0.45;
      if (lit) {
        const warm = rand() > 0.35;
        g.fillStyle = warm ? `rgba(255,${190 + (rand() * 40) | 0},120,0.95)` : 'rgba(150,210,255,0.9)';
      } else {
        g.fillStyle = 'rgba(22,28,38,1)';
      }
      g.fillRect(x, y, 6, 7);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function checkerTexture(): THREE.CanvasTexture {
  const [c, g] = canvas(128, 16);
  for (let i = 0; i < 16; i++) {
    g.fillStyle = i % 2 ? '#0a0a0a' : '#f4f4f4';
    g.fillRect(i * 8, 0, 8, 16);
    g.fillStyle = i % 2 ? '#f4f4f4' : '#0a0a0a';
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function glowTexture(): THREE.CanvasTexture {
  const [c, g] = canvas(64, 64);
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.4)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function bannerTexture(): THREE.CanvasTexture {
  const [c, g] = canvas(1024, 96);
  const grad = g.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, '#0d0f16');
  grad.addColorStop(0.5, '#1a2030');
  grad.addColorStop(1, '#0d0f16');
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 96);
  g.fillStyle = '#c8ff2e';
  g.font = '900 56px system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('APEX VELOCITY GP', 512, 50);
  g.fillStyle = 'rgba(200,255,46,0.85)';
  g.fillRect(0, 4, 1024, 3);
  g.fillRect(0, 89, 1024, 3);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function createTextures(): TextureSet {
  const a = asphaltTextures();
  return {
    asphalt: a.map,
    asphaltNormal: a.normal,
    asphaltRough: a.rough,
    windows: windowsTexture(),
    checker: checkerTexture(),
    glow: glowTexture(),
    banner: bannerTexture(),
  };
}

/** Headless-safe stub textures for unit tests (no canvas needed). */
export function stubTextures(): TextureSet {
  const t = () => new THREE.Texture();
  return {
    asphalt: t(), asphaltNormal: t(), asphaltRough: t(),
    windows: t(), checker: t(), glow: t(), banner: t(),
  } as TextureSet;
}
