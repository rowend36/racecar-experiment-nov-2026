import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { carbonMaterial, carPaint, emissiveMaterial, glassMaterial } from '../render/Materials';
import { clamp } from '../core/Math';

export interface CarSpec {
  id: string;
  name: string;
  tagline: string;
  topSpeed: number;
  accel: number;
  grip: number;
  brake: number;
  nitro: number;
  stats: { speed: number; accel: number; handling: number };
}

export const CARS: CarSpec[] = [
  {
    id: 'vortex', name: 'VORTEX R', tagline: 'Balanced. Brutal. Unforgiving.',
    topSpeed: 93, accel: 12.8, grip: 1.36, brake: 35, nitro: 1.0,
    stats: { speed: 84, accel: 83, handling: 85 },
  },
  {
    id: 'spectre', name: 'SPECTRE V12', tagline: 'Straight-line ballistic',
    topSpeed: 99, accel: 12.0, grip: 1.22, brake: 32, nitro: 1.14,
    stats: { speed: 98, accel: 78, handling: 70 },
  },
  {
    id: 'helix', name: 'HELIX GT', tagline: 'Corner-carving prototype',
    topSpeed: 88, accel: 13.7, grip: 1.55, brake: 38, nitro: 0.92,
    stats: { speed: 77, accel: 94, handling: 98 },
  },
];

export const PAINTS: Array<{ name: string; color: number; accent: number }> = [
  { name: 'IGNITION', color: 0xd81034, accent: 0x37e6ff },
  { name: 'AZURE', color: 0x0a8ed6, accent: 0xa6f4ff },
  { name: 'VOLTAGE', color: 0x6330ff, accent: 0xff3ba8 },
  { name: 'SOLAR', color: 0xf0a008, accent: 0xfff09a },
  { name: 'ARCTIC', color: 0xe7ecf5, accent: 0x2fe8ff },
  { name: 'OBSIDIAN', color: 0x15171e, accent: 0xff3a4e },
  { name: 'TOXIC', color: 0x27c96b, accent: 0xd8ff3c },
  { name: 'MAGENTA', color: 0xff2f6d, accent: 0xffc2e2 },
];

interface Station { z: number; w: number; yb: number; yt: number }

/** Lofted superbody. Stations run rear (-Z) to front (+Z); outward winding. */
function loft(stations: Station[], ring = 20): THREE.BufferGeometry {
  const verts: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const rear = stations[0].z;
  const front = stations[stations.length - 1].z;
  for (const st of stations) {
    const cy = (st.yb + st.yt) * 0.5;
    const hh = Math.max(0.02, (st.yt - st.yb) * 0.5);
    for (let t = 0; t < ring; t += 1) {
      const a = (t / ring) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const x = st.w * Math.sign(ca) * Math.pow(Math.abs(ca), 0.72);
      const y = cy + hh * Math.sign(sa) * Math.pow(Math.abs(sa), 0.72);
      verts.push(x, y, st.z);
      uvs.push(t / ring, (st.z - rear) / (front - rear));
    }
  }
  for (let i = 0; i < stations.length - 1; i += 1) {
    for (let t = 0; t < ring; t += 1) {
      const a = i * ring + t;
      const b = (i + 1) * ring + t;
      const c = i * ring + ((t + 1) % ring);
      const d = (i + 1) * ring + ((t + 1) % ring);
      // a,c,b / c,d,b gives outward normals for increasing Z.
      indices.push(a, c, b, c, d, b);
    }
  }
  const cap = (station: Station, atFront: boolean): void => {
    const cy = (station.yb + station.yt) * 0.5;
    const center = verts.length / 3;
    verts.push(0, cy, station.z);
    uvs.push(0.5, 0.5);
    const base = (atFront ? stations.length - 1 : 0) * ring;
    for (let t = 0; t < ring; t += 1) {
      const a = base + t;
      const b = base + ((t + 1) % ring);
      if (atFront) indices.push(center, a, b);
      else indices.push(center, b, a);
    }
  };
  cap(stations[stations.length - 1], true);
  cap(stations[0], false);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function box(w: number, h: number, d: number, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rx) g.rotateX(rx);
  if (ry) g.rotateY(ry);
  if (rz) g.rotateZ(rz);
  g.translate(x, y, z);
  return g;
}

function mergeOrThrow(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  if (!merged) throw new Error('Car geometry merge failed');
  return merged;
}

function radialTexture(inner: string, outer: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

let wheelGeoCache: {
  tire: THREE.BufferGeometry;
  rim: THREE.BufferGeometry;
  disc: THREE.BufferGeometry;
} | null = null;

function wheelGeometries(radius: number): NonNullable<typeof wheelGeoCache> {
  if (wheelGeoCache) return wheelGeoCache;
  const tire = new THREE.CylinderGeometry(radius, radius, 0.36, 30, 1);
  tire.rotateZ(Math.PI / 2);
  const parts: THREE.BufferGeometry[] = [];
  const barrel = new THREE.CylinderGeometry(radius * 0.69, radius * 0.69, 0.34, 28);
  barrel.rotateZ(Math.PI / 2);
  parts.push(barrel);
  const hub = new THREE.CylinderGeometry(radius * 0.19, radius * 0.19, 0.38, 16);
  hub.rotateZ(Math.PI / 2);
  parts.push(hub);
  for (let i = 0; i < 10; i += 1) {
    const spoke = box(0.28, 0.045, radius * 0.55, 0, 0, radius * 0.3, (i / 10) * Math.PI * 2);
    parts.push(spoke);
  }
  const rim = mergeOrThrow(parts);
  const disc = new THREE.CylinderGeometry(radius * 0.46, radius * 0.46, 0.27, 20);
  disc.rotateZ(Math.PI / 2);
  wheelGeoCache = { tire, rim, disc };
  return wheelGeoCache;
}

interface Wheel {
  pivot: THREE.Group;
  spin: THREE.Group;
  radius: number;
  front: boolean;
}

export class CarModel {
  readonly root = new THREE.Group();
  readonly body = new THREE.Group();
  readonly spec: CarSpec;
  private paint: THREE.MeshPhysicalMaterial;
  private accentMat: THREE.MeshStandardMaterial;
  private tailMat: THREE.MeshStandardMaterial;
  private wheels: Wheel[] = [];
  private roll = 0;
  private pitch = 0;
  private disposed = false;

  constructor(spec: CarSpec, color: number, accent: number) {
    this.spec = spec;
    this.paint = carPaint({ color, accent });
    this.accentMat = emissiveMaterial(accent, 2.4);
    this.tailMat = emissiveMaterial(0xff2233, 1.2);
    this.root.add(this.body);
    this.buildBody(color);
    this.buildWheels();
    this.buildLights();
  }

  private buildBody(color: number): void {
    const paintParts: THREE.BufferGeometry[] = [];
    paintParts.push(loft([
      { z: -2.38, w: 0.72, yb: 0.30, yt: 0.72 },
      { z: -2.05, w: 0.98, yb: 0.24, yt: 0.90 },
      { z: -1.45, w: 1.08, yb: 0.22, yt: 0.94 },
      { z: -0.55, w: 1.10, yb: 0.22, yt: 0.98 },
      { z: 0.45, w: 1.06, yb: 0.23, yt: 0.96 },
      { z: 1.25, w: 1.00, yb: 0.24, yt: 0.86 },
      { z: 1.95, w: 0.86, yb: 0.26, yt: 0.72 },
      { z: 2.42, w: 0.64, yb: 0.30, yt: 0.58 },
    ]));
    // Front fenders and rear haunches.
    paintParts.push(box(0.34, 0.18, 1.5, -0.92, 0.74, 1.05, 0, 0, -0.18));
    paintParts.push(box(0.34, 0.18, 1.5, 0.92, 0.74, 1.05, 0, 0, 0.18));
    paintParts.push(box(0.32, 0.2, 1.4, -0.94, 0.76, -1.05, 0, 0, -0.14));
    paintParts.push(box(0.32, 0.2, 1.4, 0.94, 0.76, -1.05, 0, 0, 0.14));
    // Door blisters.
    paintParts.push(box(0.12, 0.30, 1.3, -1.06, 0.60, -0.12));
    paintParts.push(box(0.12, 0.30, 1.3, 1.06, 0.60, -0.12));
    this.body.add(new THREE.Mesh(mergeOrThrow(paintParts), this.paint));

    // Carbon aero: splitter, side skirts, diffuser, wing, mirrors.
    const carbonParts: THREE.BufferGeometry[] = [
      box(2.0, 0.07, 0.52, 0, 0.24, 2.42, 0, 0, 0),
      box(1.78, 0.08, 0.38, 0, 0.22, -2.42),
      box(0.12, 0.11, 4.0, -1.06, 0.25, -0.05),
      box(0.12, 0.11, 4.0, 1.06, 0.25, -0.05),
      box(1.9, 0.06, 0.46, 0, 1.20, -2.12, 0, 0, 0.06),
      box(0.10, 0.30, 0.42, -0.88, 1.04, -2.12),
      box(0.10, 0.30, 0.42, 0.88, 1.04, -2.12),
      box(0.26, 0.13, 0.34, -1.16, 0.94, 0.92, 0, 0.25, 0),
      box(0.26, 0.13, 0.34, 1.16, 0.94, 0.92, 0, -0.25, 0),
      box(0.44, 0.16, 0.16, -0.42, 0.52, 2.44),
      box(0.44, 0.16, 0.16, 0.42, 0.52, 2.44),
    ];
    for (let i = 0; i < 5; i += 1) {
      const x = -0.7 + i * 0.35;
      carbonParts.push(box(0.06, 0.34, 0.5, x, 0.42, -2.36));
    }
    this.body.add(new THREE.Mesh(mergeOrThrow(carbonParts), carbonMaterial()));

    // Canopy.
    const canopy = loft([
      { z: -1.05, w: 0.58, yb: 0.92, yt: 0.97 },
      { z: -0.70, w: 0.74, yb: 0.93, yt: 1.22 },
      { z: -0.12, w: 0.76, yb: 0.94, yt: 1.34 },
      { z: 0.55, w: 0.68, yb: 0.93, yt: 1.25 },
      { z: 1.12, w: 0.44, yb: 0.90, yt: 0.97 },
    ], 16);
    this.body.add(new THREE.Mesh(canopy, glassMaterial()));

    // Chrome exhausts and intake.
    const chrome = new THREE.MeshStandardMaterial({ color: 0xc8d0dc, metalness: 1, roughness: 0.18, envMapIntensity: 2 });
    const exhausts = new THREE.CylinderGeometry(0.10, 0.12, 0.26, 12);
    exhausts.rotateX(Math.PI / 2);
    const exParts: THREE.BufferGeometry[] = [];
    for (const x of [-0.34, 0.34]) {
      const e = exhausts.clone();
      e.translate(x, 0.45, -2.52);
      exParts.push(e);
    }
    exhausts.dispose();
    this.body.add(new THREE.Mesh(mergeOrThrow(exParts), chrome));

    // Contact shadow and underglow decals.
    const shadowMat = new THREE.MeshBasicMaterial({
      map: radialTexture('rgba(0,0,0,0.55)', 'rgba(0,0,0,0)'),
      transparent: true, depthWrite: false, toneMapped: false,
    });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 8.4), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.012;
    shadow.renderOrder = 1;
    this.root.add(shadow);
    const glowMat = new THREE.MeshBasicMaterial({
      map: radialTexture(`rgba(${hexR(color)},${hexG(color)},${hexB(color)},0.42)`, 'rgba(0,0,0,0)'),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 7.2), glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.02;
    glow.renderOrder = 2;
    this.root.add(glow);
  }

  private buildWheels(): void {
    const g = wheelGeometries(0.44);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x090a0c, roughness: 0.88, metalness: 0.02 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xb7c0cc, metalness: 1, roughness: 0.2, envMapIntensity: 1.6 });
    const discMat = new THREE.MeshStandardMaterial({ color: 0x8e9298, metalness: 0.9, roughness: 0.42 });
    const caliperMat = this.accentMat;
    const positions: Array<[number, number, number, boolean]> = [
      [-1.02, 0.45, 1.46, true],
      [1.02, 0.45, 1.46, true],
      [-1.04, 0.46, -1.48, false],
      [1.04, 0.46, -1.48, false],
    ];
    for (const [x, y, z, front] of positions) {
      const pivot = new THREE.Group();
      pivot.position.set(x, y, z);
      pivot.rotation.y = front ? 0 : Math.PI;
      const spin = new THREE.Group();
      spin.add(new THREE.Mesh(g.tire, tireMat));
      spin.add(new THREE.Mesh(g.rim, rimMat));
      spin.add(new THREE.Mesh(g.disc, discMat));
      const caliper = new THREE.Mesh(box(0.3, 0.16, 0.12, 0, 0.30, 0), caliperMat);
      spin.add(caliper);
      pivot.add(spin);
      this.body.add(pivot);
      this.wheels.push({ pivot, spin, radius: 0.44, front });
    }
  }

  private buildLights(): void {
    const headParts: THREE.BufferGeometry[] = [];
    for (const side of [-1, 1]) {
      headParts.push(box(0.44, 0.10, 0.12, side * 0.48, 0.63, 2.41, 0, side * 0.28, 0));
      headParts.push(box(0.12, 0.05, 0.5, side * 0.94, 0.60, 1.72, 0, 0, 0));
    }
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0b0b0d, emissive: 0xeaf6ff, emissiveIntensity: 3.2, toneMapped: false,
    });
    this.body.add(new THREE.Mesh(mergeOrThrow(headParts), headMat));
    const tail = box(1.62, 0.09, 0.10, 0, 0.70, -2.40);
    this.body.add(new THREE.Mesh(tail, this.tailMat));
    const accentParts: THREE.BufferGeometry[] = [
      box(0.09, 0.035, 3.1, -1.06, 0.29, 0),
      box(0.09, 0.035, 3.1, 1.06, 0.29, 0),
      box(0.62, 0.05, 0.09, 0, 0.98, -2.16),
    ];
    this.body.add(new THREE.Mesh(mergeOrThrow(accentParts), this.accentMat));
  }

  setPaint(color: number, accent: number): void {
    this.paint.color.set(color);
    this.accentMat.emissive.set(accent);
  }

  setBodyTilt(roll: number, pitch: number): void {
    this.roll = roll;
    this.pitch = pitch;
  }

  updateVisual(dt: number, speed: number, steer: number, slip: number, braking: boolean, nitro: boolean): void {
    const spin = (speed / this.wheels[0].radius) * dt;
    for (const w of this.wheels) {
      w.spin.rotation.x += spin;
      if (w.front) w.pivot.rotation.y = -steer * 0.42;
    }
    this.tailMat.emissiveIntensity = braking ? 5.2 : 1.2;
    this.accentMat.emissiveIntensity = nitro ? 4.6 : 2.4;
    const driftRoll = clamp(slip * 0.05, -0.09, 0.09);
    this.body.rotation.z += ((-this.roll + driftRoll) - this.body.rotation.z) * Math.min(1, dt * 8);
    this.body.rotation.x += (this.pitch - this.body.rotation.x) * Math.min(1, dt * 6);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m.dispose());
      }
    });
  }
}

function hexR(c: number): number { return (c >> 16) & 255; }
function hexG(c: number): number { return (c >> 8) & 255; }
function hexB(c: number): number { return c & 255; }
