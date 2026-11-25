import * as THREE from 'three';
import { mulberry32 } from '../core/Math';

/** Procedural, tileable textures and physically-based materials. No external assets. */

function canvas(size: number): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  return { c, ctx };
}

function texture(c: HTMLCanvasElement, repeat = 1, srgb = false): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export interface SurfaceTextures {
  asphalt: THREE.Texture;
  asphaltRough: THREE.Texture;
  asphaltNormal: THREE.Texture;
  carbon: THREE.Texture;
  windows: THREE.Texture;
  checker: THREE.Texture;
}

let cached: SurfaceTextures | null = null;

export function surfaces(): SurfaceTextures {
  if (cached) return cached;
  const rng = mulberry32(0xa11ce);

  // Asphalt albedo: fine aggregate + faint tyre polish.
  {
    const { c, ctx } = canvas(512);
    ctx.fillStyle = '#24282e';
    ctx.fillRect(0, 0, 512, 512);
    const img = ctx.getImageData(0, 0, 512, 512);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (rng() - 0.5) * 34;
      img.data[i] = Math.max(0, Math.min(255, 36 + n));
      img.data[i + 1] = Math.max(0, Math.min(255, 40 + n));
      img.data[i + 2] = Math.max(0, Math.min(255, 46 + n));
    }
    ctx.putImageData(img, 0, 0);
    for (let i = 0; i < 140; i += 1) {
      ctx.strokeStyle = `rgba(12,14,18,${0.02 + rng() * 0.05})`;
      ctx.lineWidth = 1 + rng() * 3;
      ctx.beginPath();
      const x = rng() * 512;
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + rng() * 20 - 10, 170, x + rng() * 20 - 10, 340, x, 512);
      ctx.stroke();
    }
    cached = {} as SurfaceTextures;
    cached.asphalt = texture(c, 1, true);
  }

  // Roughness map: wet-looking polished lines over rough aggregate.
  {
    const { c, ctx } = canvas(256);
    const img = ctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 175 + Math.floor(rng() * 70);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    cached!.asphaltRough = texture(c);
  }

  // Normal map derived from a small height field (Sobel).
  {
    const size = 256;
    const h = new Float32Array(size * size);
    for (let i = 0; i < h.length; i += 1) h[i] = rng();
    const { c, ctx } = canvas(size);
    const img = ctx.createImageData(size, size);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const l = h[y * size + ((x - 1 + size) % size)];
        const r = h[y * size + ((x + 1) % size)];
        const u = h[((y - 1 + size) % size) * size + x];
        const d = h[((y + 1) % size) * size + x];
        const nx = (l - r) * 1.4;
        const ny = (u - d) * 1.4;
        const nz = 1;
        const len = Math.hypot(nx, ny, nz);
        const idx = (y * size + x) * 4;
        img.data[idx] = (nx / len * 0.5 + 0.5) * 255;
        img.data[idx + 1] = (ny / len * 0.5 + 0.5) * 255;
        img.data[idx + 2] = (nz / len * 0.5 + 0.5) * 255;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    cached!.asphaltNormal = texture(c);
  }

  // Carbon fibre weave.
  {
    const { c, ctx } = canvas(128);
    ctx.fillStyle = '#101216';
    ctx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 8) {
      for (let x = 0; x < 128; x += 8) {
        const even = ((x / 8 + y / 8) % 2) === 0;
        const g = ctx.createLinearGradient(x, y, x + (even ? 8 : 0), y + (even ? 0 : 8));
        g.addColorStop(0, '#262b32');
        g.addColorStop(0.5, '#0b0d10');
        g.addColorStop(1, '#1e2228');
        ctx.fillStyle = g;
        ctx.fillRect(x, y, 8, 8);
      }
    }
    cached!.carbon = texture(c, 1, true);
  }

  // Building window grid with random lit cells.
  {
    const { c, ctx } = canvas(256);
    ctx.fillStyle = '#0c1018';
    ctx.fillRect(0, 0, 256, 256);
    const cols = 12;
    const rows = 22;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const lit = rng();
        const warm = rng() > 0.35;
        const px = x * (256 / cols) + 3;
        const py = y * (256 / rows) + 3;
        const w = 256 / cols - 6;
        const h = 256 / rows - 5;
        ctx.fillStyle = lit > 0.62
          ? (warm ? `rgba(255,196,110,${0.55 + rng() * 0.45})` : `rgba(120,210,255,${0.5 + rng() * 0.5})`)
          : 'rgba(14,20,30,0.9)';
        ctx.fillRect(px, py, w, h);
      }
    }
    cached!.windows = texture(c, 1, true);
  }

  // Start/finish checker.
  {
    const { c, ctx } = canvas(128);
    const cell = 16;
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#f2f5f8' : '#101216';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    cached!.checker = texture(c, 1, true);
  }

  return cached;
}

export interface PaintOptions {
  color: number;
  accent: number;
  flake?: number;
}

export function carPaint(opts: PaintOptions): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color: opts.color,
    metalness: 0.86,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
    envMapIntensity: 1.35,
  });
  const flake = opts.flake ?? 0.7;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uFlake = { value: flake };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vFlakePos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFlakePos = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uFlake;
        varying vec3 vFlakePos;
        float flakeHash(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        {
          float f = flakeHash(floor(vFlakePos * 190.0));
          float sparkle = smoothstep(0.90, 1.0, f) * uFlake;
          diffuseColor.rgb += vec3(sparkle * 0.42);
        }`);
  };
  mat.customProgramCacheKey = () => 'redline-paint';
  return mat;
}

export function carbonMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: surfaces().carbon,
    color: 0xffffff,
    roughness: 0.42,
    metalness: 0.35,
    envMapIntensity: 0.7,
  });
}

export function glassMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: 0x0b1420,
    metalness: 0.25,
    roughness: 0.09,
    transmission: 0.22,
    transparent: true,
    opacity: 0.86,
    clearcoat: 1,
    envMapIntensity: 2.4,
  });
}

export function emissiveMaterial(color: number, intensity = 2.2): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x0b0b0d,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.4,
    metalness: 0.1,
    toneMapped: false,
  });
}

/** Asphalt used by the road ribbon, with correct UV repeat along its length. */
export function roadMaterial(length: number, wet: number): THREE.MeshStandardMaterial {
  const s = surfaces();
  const rough = s.asphaltRough.clone();
  rough.needsUpdate = true;
  rough.repeat.set(3, Math.max(1, Math.round(length / 16)));
  const albedo = s.asphalt.clone();
  albedo.needsUpdate = true;
  albedo.repeat.copy(rough.repeat);
  const normal = s.asphaltNormal.clone();
  normal.needsUpdate = true;
  normal.repeat.copy(rough.repeat);
  const mat = new THREE.MeshStandardMaterial({
    map: albedo,
    roughnessMap: rough,
    normalMap: normal,
    normalScale: new THREE.Vector2(0.42, 0.42),
    color: new THREE.Color().setRGB(1 - wet * 0.32, 1 - wet * 0.3, 1 - wet * 0.26),
    roughness: 0.86 - wet * 0.42,
    metalness: 0.04 + wet * 0.12,
    envMapIntensity: 0.55 + wet * 1.2,
  });
  return mat;
}
