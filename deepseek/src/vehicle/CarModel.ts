import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TextureSet } from '../core/Textures';

export interface CarSpec {
  id: string;
  name: string;
  tagline: string;
  color: number;
  accent: number;
  accel: number;
  topSpeed: number;
  grip: number;
  brake: number;
  nitro: number;
  stats: { speed: number; accel: number; handling: number };
}

export const CARS: CarSpec[] = [
  {
    id: 'vxr',
    name: 'VXR-01',
    tagline: 'The all-round weapon',
    color: 0xd2102f,
    accent: 0x39e6ff,
    accel: 12.6,
    topSpeed: 91,
    grip: 1.35,
    brake: 35,
    nitro: 1.0,
    stats: { speed: 84, accel: 82, handling: 84 },
  },
  {
    id: 'phantom',
    name: 'PHANTOM X',
    tagline: 'Straight-line ballistic',
    color: 0x4b27d8,
    accent: 0xff2d7a,
    accel: 11.9,
    topSpeed: 97,
    grip: 1.22,
    brake: 32,
    nitro: 1.12,
    stats: { speed: 97, accel: 78, handling: 70 },
  },
  {
    id: 'apex',
    name: 'RS APEX',
    tagline: 'Corner-carving prototype',
    color: 0xf0a008,
    accent: 0xffe14a,
    accel: 13.5,
    topSpeed: 87,
    grip: 1.52,
    brake: 38,
    nitro: 0.92,
    stats: { speed: 77, accel: 93, handling: 98 },
  },
];

export const PAINTS: Array<{ name: string; color: number; accent: number }> = [
  { name: 'Inferno', color: 0xd2102f, accent: 0x39e6ff },
  { name: 'Azure', color: 0x0a8ed6, accent: 0x9ef4ff },
  { name: 'Violet', color: 0x5b2bff, accent: 0xff2d7a },
  { name: 'Solar', color: 0xf0a008, accent: 0xffef9a },
  { name: 'Frost', color: 0xe7ecf5, accent: 0x2fe8ff },
  { name: 'Onyx', color: 0x14161d, accent: 0xff3a4e },
  { name: 'Acid', color: 0x27c96b, accent: 0xd8ff3c },
  { name: 'Magenta', color: 0xff2f6d, accent: 0xffc2e2 },
];

interface Station {
  z: number;
  w: number;
  yb: number;
  yt: number;
}

function loft(stations: Station[], ring = 18, exponent = 3.0): THREE.BufferGeometry {
  const R = ring;
  const verts: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const front = stations[0].z;
  const rear = stations[stations.length - 1].z;
  for (let i = 0; i < stations.length; i++) {
    const st = stations[i];
    const cy = (st.yb + st.yt) * 0.5;
    const hh = (st.yt - st.yb) * 0.5;
    for (let t = 0; t < R; t++) {
      const a = (t / R) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const x = st.w * Math.sign(ca) * Math.pow(Math.abs(ca), 2 / exponent);
      const y = cy + hh * Math.sign(sa) * Math.pow(Math.abs(sa), 2 / exponent);
      verts.push(x, y, st.z);
      uvs.push(t / R, (front - st.z) / (front - rear));
    }
  }
  for (let i = 0; i < stations.length - 1; i++) {
    for (let t = 0; t < R; t++) {
      const a = i * R + t;
      const b = (i + 1) * R + t;
      const c = i * R + ((t + 1) % R);
      const d = (i + 1) * R + ((t + 1) % R);
      indices.push(a, b, c, c, b, d);
    }
  }
  // End caps.
  const addCap = (station: Station, flip: boolean): void => {
    const cy = (station.yb + station.yt) * 0.5;
    const center = verts.length / 3;
    verts.push(0, cy, station.z);
    uvs.push(0.5, 0.5);
    const start = (flip ? stations.length - 1 : 0) * R;
    for (let t = 0; t < R; t++) {
      const a = start + t;
      const b = start + ((t + 1) % R);
      if (flip) indices.push(center, b, a);
      else indices.push(center, a, b);
    }
  };
  addCap(stations[stations.length - 1], true);
  addCap(stations[0], false);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

let wheelCache: {
  tire: THREE.BufferGeometry;
  rim: THREE.BufferGeometry;
  caliper: THREE.BufferGeometry;
  tireMat: THREE.MeshStandardMaterial;
  rimMat: THREE.MeshStandardMaterial;
} | null = null;

function getWheel(r: number): NonNullable<typeof wheelCache> {
  if (wheelCache) return wheelCache;
  const tire = new THREE.CylinderGeometry(r, r, 0.35, 28, 1);
  tire.rotateZ(Math.PI / 2);

  const parts: THREE.BufferGeometry[] = [];
  const disc = new THREE.CylinderGeometry(r * 0.67, r * 0.67, 0.33, 24);
  disc.rotateZ(Math.PI / 2);
  parts.push(disc);
  const hub = new THREE.CylinderGeometry(r * 0.2, r * 0.2, 0.37, 16);
  hub.rotateZ(Math.PI / 2);
  parts.push(hub);
  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.BoxGeometry(0.36, 0.055, r * 0.58);
    spoke.translate(0, 0, r * 0.3);
    spoke.rotateX((i / 5) * Math.PI * 2);
    spoke.translate(0, 0, 0.01);
    parts.push(spoke);
  }
  const rim = mergeGeometries(parts, false);
  if (!rim) throw new Error('wheel merge failed');

  const caliper = new THREE.BoxGeometry(0.34, 0.16, 0.12);
  caliper.translate(0, r * 0.45, 0);

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x07080a,
    roughness: 0.82,
    metalness: 0.05,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xaab2bf,
    roughness: 0.2,
    metalness: 1,
    envMapIntensity: 1.5,
  });
  wheelCache = { tire, rim, caliper, tireMat, rimMat };
  return wheelCache;
}

export class CarModel {
  readonly root = new THREE.Group();
  readonly bodyPivot = new THREE.Group();
  readonly wheels: THREE.Group[] = [];
  readonly steerPivots: THREE.Group[] = [];
  readonly tailMat: THREE.MeshStandardMaterial;
  readonly accentMat: THREE.MeshStandardMaterial;
  private glow: THREE.Mesh;
  private paintMat: THREE.MeshPhysicalMaterial;
  private brakeGlow = 3;
  private ownedMaterials: THREE.Material[] = [];
  private ownedGeometries: THREE.BufferGeometry[] = [];

  constructor(spec: CarSpec, textures: TextureSet) {
    textures.carbon.repeat.set(3, 3);
    textures.carbonNormal.repeat.set(3, 3);
    const paint = new THREE.MeshPhysicalMaterial({
      color: spec.color,
      metalness: 0.38,
      roughness: 0.3,
      clearcoat: 0.85,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.05,
      iridescence: 0.06,
      iridescenceIOR: 1.5,
    });
    this.paintMat = paint;
    this.ownedMaterials.push(paint);
    const carbon = new THREE.MeshStandardMaterial({
      color: 0x9aa0aa,
      map: textures.carbon,
      normalMap: textures.carbonNormal,
      roughness: 0.33,
      metalness: 0.55,
      envMapIntensity: 1.2,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x0a1018,
      metalness: 0.55,
      roughness: 0.045,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.4,
    });
    const chrome = new THREE.MeshStandardMaterial({
      color: 0xd7dde8,
      metalness: 1,
      roughness: 0.12,
      envMapIntensity: 1.8,
    });
    const trim = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      roughness: 0.55,
      metalness: 0.4,
    });
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      emissive: 0xe4f4ff,
      emissiveIntensity: 2.9,
      roughness: 0.2,
    });
    this.tailMat = new THREE.MeshStandardMaterial({
      color: 0x1a0005,
      emissive: 0xff0a24,
      emissiveIntensity: 2.0,
      roughness: 0.25,
    });
    this.accentMat = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      emissive: spec.accent,
      emissiveIntensity: 4,
      roughness: 0.3,
    });
    this.ownedMaterials.push(carbon, glass, chrome, trim, headMat, this.tailMat, this.accentMat);

    const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
    const add = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      x = 0,
      y = 0,
      z = 0,
      rx = 0,
      ry = 0,
      rz = 0,
    ): void => {
      const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz));
      m.setPosition(x, y, z);
      geo.applyMatrix4(m);
      const arr = buckets.get(mat) ?? [];
      arr.push(geo);
      buckets.set(mat, arr);
    };

    const body = loft([
      { z: 2.31, w: 0.6, yb: 0.4, yt: 0.54 },
      { z: 2.16, w: 0.8, yb: 0.33, yt: 0.62 },
      { z: 1.9, w: 0.93, yb: 0.28, yt: 0.71 },
      { z: 1.5, w: 1.0, yb: 0.26, yt: 0.81 },
      { z: 1.0, w: 1.025, yb: 0.25, yt: 0.89 },
      { z: 0.55, w: 1.035, yb: 0.25, yt: 0.925 },
      { z: 0.0, w: 1.04, yb: 0.25, yt: 0.945 },
      { z: -0.6, w: 1.04, yb: 0.25, yt: 0.965 },
      { z: -1.15, w: 1.03, yb: 0.26, yt: 0.975 },
      { z: -1.6, w: 1.0, yb: 0.27, yt: 0.985 },
      { z: -1.98, w: 0.94, yb: 0.29, yt: 0.95 },
      { z: -2.22, w: 0.82, yb: 0.34, yt: 0.86 },
      { z: -2.34, w: 0.66, yb: 0.42, yt: 0.74 },
    ]);
    add(body, paint);

    // Cabin / canopy.
    const canopy = loft([
      { z: 0.78, w: 0.66, yb: 0.9, yt: 0.96 },
      { z: 0.3, w: 0.6, yb: 0.92, yt: 1.235 },
      { z: -0.45, w: 0.585, yb: 0.94, yt: 1.3 },
      { z: -1.02, w: 0.62, yb: 0.94, yt: 1.12 },
      { z: -1.28, w: 0.6, yb: 0.94, yt: 0.99 },
    ], 16, 2.6);
    add(canopy, glass);
    // Body-colour targa roof strip.
    add(new THREE.BoxGeometry(0.86, 0.035, 0.9), paint, 0, 1.297, -0.16);

    // Aero: splitter, skirts, diffuser, wing.
    add(new THREE.BoxGeometry(1.94, 0.06, 0.54), carbon, 0, 0.21, 2.09);
    add(new THREE.BoxGeometry(1.55, 0.05, 0.3), carbon, 0, 0.16, 2.26);
    for (const s of [-1, 1]) {
      add(new THREE.BoxGeometry(0.16, 0.07, 2.4), carbon, s * 1.0, 0.28, -0.1, 0, 0, s * 0.05);
      add(new THREE.BoxGeometry(0.1, 0.03, 1.9), carbon, s * 1.055, 0.31, -0.15, 0, 0, s * 0.12);
      // Canards.
      add(new THREE.BoxGeometry(0.28, 0.02, 0.22), carbon, s * 0.98, 0.36, 1.95, 0, 0, s * 0.25);
      // Side intake.
      add(new THREE.BoxGeometry(0.04, 0.2, 0.72), trim, s * 1.02, 0.68, -0.72, 0, 0, s * 0.06);
    }
    for (let i = 0; i < 5; i++) {
      add(new THREE.BoxGeometry(0.035, 0.2, 0.62), carbon, -0.42 + i * 0.21, 0.3, -2.22);
    }
    // Rear wing.
    add(new THREE.BoxGeometry(1.72, 0.045, 0.42), carbon, 0, 1.13, -2.03, -0.08, 0, 0);
    add(new THREE.BoxGeometry(0.075, 0.26, 0.32), carbon, -0.62, 1.0, -2.02);
    add(new THREE.BoxGeometry(0.075, 0.26, 0.32), carbon, 0.62, 1.0, -2.02);
    // Hood and deck vents.
    add(new THREE.BoxGeometry(0.52, 0.02, 0.4), carbon, 0, 0.905, 1.02);
    for (let i = 0; i < 3; i++) {
      add(new THREE.BoxGeometry(0.72, 0.02, 0.08), carbon, 0, 0.99, -1.35 - i * 0.18);
    }
    // Mirrors.
    for (const s of [-1, 1]) {
      add(new THREE.BoxGeometry(0.2, 0.055, 0.11), paint, s * 1.03, 0.96, 0.54);
      add(new THREE.BoxGeometry(0.06, 0.06, 0.16), carbon, s * 0.96, 0.92, 0.56);
    }
    // Wheel-arch trims.
    for (const s of [-1, 1]) {
      for (const z of [1.48, -1.5]) {
        const arch = new THREE.TorusGeometry(0.45, 0.045, 6, 18, Math.PI);
        add(arch, carbon, s * 1.015, 0.36, z, 0, Math.PI / 2, 0);
      }
    }
    // Exhausts.
    for (const s of [-1, 1]) {
      const exhaust = new THREE.CylinderGeometry(0.075, 0.085, 0.25, 12);
      exhaust.rotateX(Math.PI / 2);
      add(exhaust, chrome, s * 0.27, 0.37, -2.36);
    }
    // Lights.
    add(new THREE.BoxGeometry(0.4, 0.05, 0.08), headMat, -0.62, 0.63, 2.24, 0, -0.16, 0);
    add(new THREE.BoxGeometry(0.4, 0.05, 0.08), headMat, 0.62, 0.63, 2.24, 0, 0.16, 0);
    add(new THREE.BoxGeometry(0.05, 0.22, 0.08), headMat, -0.9, 0.56, 2.08, 0, -0.35, 0);
    add(new THREE.BoxGeometry(0.05, 0.22, 0.08), headMat, 0.9, 0.56, 2.08, 0, 0.35, 0);
    add(new THREE.BoxGeometry(1.56, 0.055, 0.06), this.tailMat, 0, 0.83, -2.35);
    add(new THREE.BoxGeometry(0.05, 0.16, 0.06), this.tailMat, -0.79, 0.75, -2.35);
    add(new THREE.BoxGeometry(0.05, 0.16, 0.06), this.tailMat, 0.79, 0.75, -2.35);
    // Side neon signature.
    for (const s of [-1, 1]) {
      add(new THREE.BoxGeometry(0.012, 0.02, 2.3), this.accentMat, s * 1.06, 0.315, -0.1);
    }

    const meshes: THREE.Mesh[] = [];
    for (const [mat, geos] of buckets) {
      const merged = mergeGeometries(geos, false);
      if (!merged) continue;
      const mesh = new THREE.Mesh(merged, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.bodyPivot.add(mesh);
      meshes.push(mesh);
      this.ownedGeometries.push(merged);
    }
    this.root.add(this.bodyPivot);

    const shadowGeo = new THREE.PlaneGeometry(3.2, 5.7);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: textures.shadow,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
      toneMapped: false,
    });
    const contact = new THREE.Mesh(shadowGeo, shadowMat);
    contact.position.y = 0.028;
    contact.renderOrder = 1;
    this.root.add(contact);
    this.ownedGeometries.push(shadowGeo);
    this.ownedMaterials.push(shadowMat);

    // Wheels (shared geometry, per-car accent calipers).
    const wheel = getWheel(0.36);
    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0x141519,
      metalness: 0.7,
      roughness: 0.3,
      emissive: spec.accent,
      emissiveIntensity: 0.7,
    });
    this.ownedMaterials.push(caliperMat);
    for (let i = 0; i < 4; i++) {
      const front = i < 2;
      const side = i % 2 === 0 ? -1 : 1;
      const z = front ? 1.5 : -1.55;
      const steer = new THREE.Group();
      steer.position.set(side * 1.02, 0.36, z);
      const spin = new THREE.Group();
      const tire = new THREE.Mesh(wheel.tire, wheel.tireMat);
      tire.castShadow = true;
      const rim = new THREE.Mesh(wheel.rim, wheel.rimMat);
      rim.castShadow = true;
      const caliper = new THREE.Mesh(wheel.caliper, caliperMat);
      spin.add(tire, rim);
      steer.add(spin, caliper);
      this.root.add(steer);
      this.wheels.push(spin);
      this.steerPivots.push(steer);
    }

    // Underglow.
    const glowGeo = new THREE.PlaneGeometry(2.2, 4.0);
    glowGeo.rotateX(-Math.PI / 2);
    const glowMat = new THREE.MeshBasicMaterial({
      map: textures.glowCyan,
      color: new THREE.Color(spec.accent),
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.glow = new THREE.Mesh(glowGeo, glowMat);
    this.glow.position.y = 0.045;
    this.glow.renderOrder = 3;
    this.root.add(this.glow);
    this.ownedGeometries.push(glowGeo);
    this.ownedMaterials.push(glowMat);
  }

  setPaint(color: number, accent: number): void {
    this.paintMat.color.setHex(color);
    this.accentMat.emissive.setHex(accent);
    const glowMat = this.glow.material as THREE.MeshBasicMaterial;
    glowMat.color.setHex(accent).multiplyScalar(1.0);
  }

  dispose(): void {
    this.root.removeFromParent();
    for (const m of this.ownedMaterials) m.dispose();
    for (const g of this.ownedGeometries) g.dispose();
    this.ownedMaterials.length = 0;
    this.ownedGeometries.length = 0;
  }

  setBrake(on: boolean): void {
    this.brakeGlow = on ? 9 : 3;
  }

  setGlow(on: boolean): void {
    (this.glow.material as THREE.MeshBasicMaterial).opacity = on ? 0.24 : 0.12;
  }

  updateVisual(dt: number, speed: number, steer: number, slip: number, braking: boolean): void {
    for (const w of this.wheels) w.rotation.x += (speed / 0.36) * dt;
    for (let i = 0; i < 2; i++) {
      this.steerPivots[i].rotation.y = -steer * 0.4;
    }
    this.tailMat.emissiveIntensity = THREE.MathUtils.damp(
      this.tailMat.emissiveIntensity,
      braking ? 8.5 : 2.2,
      14,
      dt,
    );
    this.accentMat.emissiveIntensity = 3.5 + Math.sin(performance.now() * 0.004) * 0.8 + slip * 2;
    this.glow.position.y = 0.045;
  }

  setBodyTilt(roll: number, pitch: number): void {
    this.bodyPivot.rotation.z = roll;
    this.bodyPivot.rotation.x = pitch;
  }
}
