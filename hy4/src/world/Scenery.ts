import * as THREE from 'three';
import {
  Track, ROAD_HALF, CURB_OUTER, RUNOFF_OUTER, WALL_LAT, SCENERY_MIN, GRANDSTAND_MIN,
} from './Track';
import { surfaceMaterials } from './EnvironmentMaterials';
import { mulberry32 } from '../core/Math';

interface RibbonOptions {
  from: number;
  to: number;
  y: number;
  color: number;
  repeat: number;
  vertexColors?: number[];
}

/** Builds a strip following the centreline, respecting banking. */
function ribbon(track: Track, opts: RibbonOptions): THREE.BufferGeometry {
  const s = track.samples;
  const n = s.length;
  const positions = new Float32Array((n + 1) * 2 * 3);
  const uvs = new Float32Array((n + 1) * 2 * 2);
  const indices: number[] = [];
  const colors = opts.vertexColors ? new Float32Array((n + 1) * 2 * 3) : null;
  const c = new THREE.Color(opts.color);
  for (let i = 0; i <= n; i += 1) {
    const sample = s[i % n];
    for (let side = 0; side < 2; side += 1) {
      const lat = side === 0 ? opts.from : opts.to;
      const idx = (i * 2 + side);
      positions[idx * 3] = sample.position.x + sample.right.x * lat;
      positions[idx * 3 + 1] = sample.position.y + lat * sample.bank + opts.y;
      positions[idx * 3 + 2] = sample.position.z + sample.right.z * lat;
      uvs[idx * 2] = side;
      uvs[idx * 2 + 1] = (i / n) * opts.repeat;
      if (colors) {
        const col = colors[idx] ? new THREE.Color(colors[idx]) : c;
        colors[idx * 3] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;
      }
    }
    if (i < n) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  if (colors) geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function wallRibbon(track: Track, lat: number): THREE.BufferGeometry {
  const s = track.samples;
  const n = s.length;
  const positions = new Float32Array((n + 1) * 2 * 3);
  const indices: number[] = [];
  for (let i = 0; i <= n; i += 1) {
    const p = s[i % n];
    const x = p.position.x + p.right.x * lat;
    const z = p.position.z + p.right.z * lat;
    const base = p.position.y + lat * p.bank;
    const a = i * 2;
    positions[a * 3] = x; positions[a * 3 + 1] = base; positions[a * 3 + 2] = z;
    positions[(a + 1) * 3] = x; positions[(a + 1) * 3 + 1] = base + 1.05; positions[(a + 1) * 3 + 2] = z;
    if (i < n) indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export class RoadBuilder {
  readonly group = new THREE.Group();
  readonly asphaltMaterial: THREE.MeshStandardMaterial;
  readonly startLights: THREE.InstancedMesh;

  constructor(track: Track, wet: number) {
    const m = surfaceMaterials(wet);
    this.asphaltMaterial = m.asphalt;
    const road = new THREE.Mesh(ribbon(track, {
      from: -ROAD_HALF, to: ROAD_HALF, y: 0.015, color: 0xffffff, repeat: Math.round(track.length / 16),
    }), m.asphalt);
    road.name = 'road-surface';
    this.group.add(road);

    // Run-off apron either side.
    for (const sign of [-1, 1]) {
      this.group.add(new THREE.Mesh(ribbon(track, {
        from: sign * ROAD_HALF, to: sign * RUNOFF_OUTER, y: 0.008, color: 0x6a6b68, repeat: Math.round(track.length / 12),
      }), m.runoff));
    }

    // Alternating red / white kerbs.
    for (const sign of [-1, 1]) {
      const colors: number[] = [];
      const count = track.samples.length + 1;
      for (let i = 0; i < count; i += 1) {
        const red = Math.floor(i / 5) % 2 === 0 ? 0xe42332 : 0xf4f6f8;
        colors[i * 2] = red;
        colors[i * 2 + 1] = red;
      }
      const geo = ribbon(track, {
        from: sign * ROAD_HALF, to: sign * CURB_OUTER, y: 0.03, color: 0xffffff, repeat: 1, vertexColors: colors,
      });
      this.group.add(new THREE.Mesh(geo, m.curb));
    }

    // Continuous edge lines and dashed centre line.
    for (const sign of [-1, 1]) {
      this.group.add(new THREE.Mesh(ribbon(track, {
        from: sign * (ROAD_HALF - 0.48), to: sign * (ROAD_HALF - 0.28), y: 0.038,
        color: 0xffffff, repeat: 1,
      }), m.line));
    }
    const dashGeo = new THREE.BoxGeometry(0.16, 0.02, 2.6);
    const dashCount = Math.floor(track.length / 9);
    const dashes = new THREE.InstancedMesh(dashGeo, m.line, dashCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < dashCount; i += 1) {
      const f = track.frameAt(i * 9 + 4.5);
      dummy.position.set(f.position.x, f.position.y + 0.042, f.position.z);
      dummy.rotation.set(0, Math.atan2(f.tangent.x, f.tangent.z), 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      dashes.setMatrixAt(i, dummy.matrix);
    }
    dashes.instanceMatrix.needsUpdate = true;
    dashes.frustumCulled = false;
    this.group.add(dashes);

    // Barriers both sides (solid + luminous top rail).
    for (const sign of [-1, 1]) {
      this.group.add(new THREE.Mesh(wallRibbon(track, sign * WALL_LAT), m.barrier));
      this.group.add(new THREE.Mesh(ribbon(track, {
        from: sign * (WALL_LAT - 0.06), to: sign * (WALL_LAT + 0.06), y: 1.08, color: 0xffffff, repeat: 1,
      }), m.neon[sign < 0 ? 0 : 1]));
    }
    const postGeo = new THREE.BoxGeometry(0.16, 1.15, 0.16);
    const postCount = Math.floor(track.length / 6) * 2;
    const posts = new THREE.InstancedMesh(postGeo, m.barrierPost, postCount);
    let p = 0;
    for (let d = 0; d < track.length && p < postCount; d += 6) {
      for (const sign of [-1, 1]) {
        const f = track.frameAt(d);
        dummy.position.set(
          f.position.x + f.right.x * sign * WALL_LAT,
          f.position.y + f.bank * sign * WALL_LAT + 0.58,
          f.position.z + f.right.z * sign * WALL_LAT,
        );
        dummy.rotation.set(0, Math.atan2(f.tangent.x, f.tangent.z), 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        posts.setMatrixAt(p++, dummy.matrix);
      }
    }
    posts.count = p;
    posts.instanceMatrix.needsUpdate = true;
    posts.frustumCulled = false;
    this.group.add(posts);

    // Checkered start line.
    const start = track.frameAt(0);
    const checkGeo = new THREE.PlaneGeometry(ROAD_HALF * 2, 3.2);
    checkGeo.rotateX(-Math.PI / 2);
    const check = new THREE.Mesh(checkGeo, m.checker.clone());
    (check.material as THREE.MeshStandardMaterial).map = (m.checker.map as THREE.Texture).clone();
    (check.material as THREE.MeshStandardMaterial).map!.repeat.set(8, 1);
    (check.material as THREE.MeshStandardMaterial).map!.needsUpdate = true;
    check.position.set(start.position.x, start.position.y + 0.055, start.position.z);
    check.rotation.y = Math.atan2(start.tangent.x, start.tangent.z);
    this.group.add(check);

    const gantry = buildGantry(track, m);
    this.startLights = gantry.userData.lights as THREE.InstancedMesh;
    this.group.add(gantry);
  }
}

function buildGantry(track: Track, m: ReturnType<typeof surfaceMaterials>): THREE.Group {
  const g = new THREE.Group();
  const f = track.frameAt(0);
  const yaw = Math.atan2(f.tangent.x, f.tangent.z);
  const dummy = new THREE.Object3D();
  const pillars = new THREE.InstancedMesh(new THREE.BoxGeometry(0.9, 9, 0.9), m.gantry, 2);
  for (const [i, sign] of [-1, 1].entries()) {
    dummy.position.set(
      f.position.x + f.right.x * sign * (ROAD_HALF + 2.2),
      f.position.y + 4.5,
      f.position.z + f.right.z * sign * (ROAD_HALF + 2.2),
    );
    dummy.rotation.set(0, yaw, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    pillars.setMatrixAt(i, dummy.matrix);
  }
  pillars.instanceMatrix.needsUpdate = true;
  g.add(pillars);
  const beam = new THREE.Mesh(new THREE.BoxGeometry((ROAD_HALF + 2.6) * 2, 1.3, 1.0), m.gantry);
  beam.position.copy(f.position).add(new THREE.Vector3(0, 9, 0));
  beam.rotation.y = yaw;
  g.add(beam);
  const banner = new THREE.Mesh(new THREE.PlaneGeometry((ROAD_HALF + 2.6) * 2, 1.15), m.banner);
  banner.position.copy(beam.position).addScaledVector(f.tangent, 0.55);
  banner.rotation.y = yaw;
  g.add(banner);
  const lightGeo = new THREE.SphereGeometry(0.34, 12, 8);
  const lights = new THREE.InstancedMesh(lightGeo, m.lightOff, 5);
  for (let i = 0; i < 5; i += 1) {
    dummy.position.copy(beam.position).addScaledVector(f.right, (i - 2) * 2.0);
    dummy.position.y -= 0.95;
    dummy.position.addScaledVector(f.tangent, 0.6);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    lights.setMatrixAt(i, dummy.matrix);
  }
  lights.instanceMatrix.needsUpdate = true;
  g.add(lights);
  g.userData.lights = lights;
  return g;
}

export interface SceneryResult {
  group: THREE.Group;
  pointLights: THREE.PointLight[];
}

/** All decorative geometry. Every solid is checked against SCENERY_MIN. */
export function buildScenery(track: Track, seed = 8432, density = 1, maxLights = 8): SceneryResult {
  const m = surfaceMaterials(0);
  const rng = mulberry32(seed);
  const group = new THREE.Group();
  const dummy = new THREE.Object3D();
  const pointLights: THREE.PointLight[] = [];
  const q = density;

  // Ocean + ground plate.
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), m.ocean);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = -7;
  group.add(ocean);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), m.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3.6;
  group.add(ground);

  // Distant mountain ring — integer frequencies keep the seam closed.
  const segments = 180;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const h = 46 + Math.sin(a * 3) * 24 + Math.sin(a * 7 + 1.2) * 15 + Math.sin(a * 13 + 0.4) * 9;
    const r = 1150 + Math.sin(a * 5) * 40;
    pos.push(Math.cos(a) * r, -6, Math.sin(a) * r);
    pos.push(Math.cos(a) * r, h, Math.sin(a) * r);
    if (i < segments) {
      const b = i * 2;
      idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
    }
  }
  const mountainGeo = new THREE.BufferGeometry();
  mountainGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  mountainGeo.setIndex(idx);
  mountainGeo.computeVertexNormals();
  group.add(new THREE.Mesh(mountainGeo, m.mountain));

  // Collect instanced transforms, then allocate exact counts (no buffer overflow).
  const buildings: Array<{ x: number; z: number; y: number; h: number; yaw: number }> = [];
  const palms: Array<{ x: number; z: number; y: number; s: number; yaw: number }> = [];
  const lamps: Array<{ x: number; z: number; y: number; yaw: number }> = [];
  const stands: Array<{ x: number; z: number; y: number; yaw: number; sign: number }> = [];
  const boards: Array<{ x: number; z: number; y: number; yaw: number }> = [];

  const clear = (x: number, z: number, min: number): boolean => track.clearance(x, z) >= min;
  const step = Math.max(7, Math.round(11 / Math.max(0.25, q)));
  for (let d = 0; d < track.length; d += step) {
    const f = track.frameAt(d);
    const yaw = Math.atan2(f.tangent.x, f.tangent.z);
    // City towers on alternating sides, well beyond the barriers.
    if (rng() < 0.72 * q) {
      const sign = rng() < 0.5 ? -1 : 1;
      const lateral = sign * (42 + rng() * 68);
      const x = f.position.x + f.right.x * lateral;
      const z = f.position.z + f.right.z * lateral;
      if (clear(x, z, SCENERY_MIN + 8)) {
        const h = 16 + rng() * 82;
        buildings.push({ x, z, y: h / 2 - 3, h, yaw: yaw + (rng() - 0.5) * 0.3 });
      }
    }
    // Palms closer in but still outside the barrier.
    if (rng() < 0.62 * q) {
      const sign = rng() < 0.5 ? -1 : 1;
      const lateral = sign * (SCENERY_MIN + 2 + rng() * 10);
      const x = f.position.x + f.right.x * lateral;
      const z = f.position.z + f.right.z * lateral;
      if (clear(x, z, SCENERY_MIN)) palms.push({ x, z, y: f.position.y, s: 0.8 + rng() * 0.6, yaw: rng() * 6.28 });
    }
    // Floodlight masts.
    if (Math.round(d / step) % 9 === 0) {
      const sign = Math.round(d / step) % 18 === 0 ? -1 : 1;
      const lateral = sign * (SCENERY_MIN + 5);
      const x = f.position.x + f.right.x * lateral;
      const z = f.position.z + f.right.z * lateral;
      if (clear(x, z, SCENERY_MIN)) {
        lamps.push({ x, z, y: f.position.y, yaw });
        if (pointLights.length < maxLights && Math.round(d / step) % 27 === 0) {
          const light = new THREE.PointLight(0x9ec8ff, 26, 95, 2);
          light.position.set(x, f.position.y + 13, z);
          pointLights.push(light);
          group.add(light);
        }
      }
    }
    // Grandstands on the outside of the two main straights.
    if (Math.round(d / step) % 21 === 0) {
      const sign = rng() < 0.5 ? -1 : 1;
      const lateral = sign * (GRANDSTAND_MIN + rng() * 10);
      const x = f.position.x + f.right.x * lateral;
      const z = f.position.z + f.right.z * lateral;
      if (clear(x, z, GRANDSTAND_MIN - 0.5)) stands.push({ x, z, y: f.position.y, yaw, sign });
    }
    // Trackside sponsor boards.
    if (Math.round(d / step) % 13 === 0) {
      const sign = rng() < 0.5 ? -1 : 1;
      const lateral = sign * (SCENERY_MIN + 1.5);
      const x = f.position.x + f.right.x * lateral;
      const z = f.position.z + f.right.z * lateral;
      if (clear(x, z, SCENERY_MIN)) boards.push({ x, z, y: f.position.y, yaw: yaw + (sign < 0 ? Math.PI : 0) });
    }
  }

  // Buildings: one instanced box with a window emissive material.
  const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
  const buildingMesh = new THREE.InstancedMesh(buildingGeo, m.building, buildings.length);
  for (let i = 0; i < buildings.length; i += 1) {
    const b = buildings[i];
    dummy.position.set(b.x, b.y, b.z);
    dummy.rotation.set(0, b.yaw, 0);
    dummy.scale.set(12 + rng() * 12, b.h, 12 + rng() * 12);
    dummy.updateMatrix();
    buildingMesh.setMatrixAt(i, dummy.matrix);
  }
  buildingMesh.instanceMatrix.needsUpdate = true;
  buildingMesh.frustumCulled = false;
  group.add(buildingMesh);

  // Palms: trunk + canopy instanced separately.
  const trunkMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.38, 6.4, 7), m.trunk, palms.length);
  const canopyMesh = new THREE.InstancedMesh(new THREE.ConeGeometry(2.5, 3.4, 8), m.palm, palms.length);
  for (let i = 0; i < palms.length; i += 1) {
    const p = palms[i];
    dummy.position.set(p.x, p.y + 3.2 * p.s, p.z);
    dummy.rotation.set(0, p.yaw, 0);
    dummy.scale.setScalar(p.s);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(i, dummy.matrix);
    dummy.position.y = p.y + 7.0 * p.s;
    dummy.updateMatrix();
    canopyMesh.setMatrixAt(i, dummy.matrix);
  }
  trunkMesh.instanceMatrix.needsUpdate = true;
  canopyMesh.instanceMatrix.needsUpdate = true;
  trunkMesh.frustumCulled = false;
  canopyMesh.frustumCulled = false;
  group.add(trunkMesh, canopyMesh);

  // Lamp masts + emissive heads.
  const mastMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.14, 0.22, 13, 7), m.mast, lamps.length);
  const headMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(2.2, 0.24, 0.7), m.lampHead, lamps.length);
  for (let i = 0; i < lamps.length; i += 1) {
    const l = lamps[i];
    dummy.position.set(l.x, l.y + 6.5, l.z);
    dummy.rotation.set(0, l.yaw, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    mastMesh.setMatrixAt(i, dummy.matrix);
    dummy.position.y = l.y + 13;
    dummy.updateMatrix();
    headMesh.setMatrixAt(i, dummy.matrix);
  }
  mastMesh.instanceMatrix.needsUpdate = true;
  headMesh.instanceMatrix.needsUpdate = true;
  mastMesh.frustumCulled = false;
  headMesh.frustumCulled = false;
  group.add(mastMesh, headMesh);

  // Grandstand: base + stepped seating facing the road.
  if (stands.length) {
    const baseMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), m.standBase, stands.length);
    const seatMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), m.standSeats, stands.length);
    for (let i = 0; i < stands.length; i += 1) {
      const st = stands[i];
      dummy.position.set(st.x, st.y + 2.4, st.z);
      dummy.rotation.set(0, st.yaw, 0);
      dummy.scale.set(26, 4.8, 9);
      dummy.updateMatrix();
      baseMesh.setMatrixAt(i, dummy.matrix);
      dummy.position.y = st.y + 5.6;
      dummy.scale.set(24, 1.8, 7);
      dummy.updateMatrix();
      seatMesh.setMatrixAt(i, dummy.matrix);
    }
    baseMesh.instanceMatrix.needsUpdate = true;
    seatMesh.instanceMatrix.needsUpdate = true;
    baseMesh.frustumCulled = false;
    seatMesh.frustumCulled = false;
    group.add(baseMesh, seatMesh);
  }

  // Sponsor boards, always beyond SCENERY_MIN.
  if (boards.length) {
    const boardMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(5.6, 2.2, 0.16), m.billboard, boards.length);
    for (let i = 0; i < boards.length; i += 1) {
      const b = boards[i];
      dummy.position.set(b.x, b.y + 2.6, b.z);
      dummy.rotation.set(0, b.yaw, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      boardMesh.setMatrixAt(i, dummy.matrix);
    }
    boardMesh.instanceMatrix.needsUpdate = true;
    boardMesh.frustumCulled = false;
    group.add(boardMesh);
  }

  return { group, pointLights };
}

/** Materials are shared and cached; only per-instance geometry is disposable. */
export function disposeScenery(group: THREE.Group): void {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) obj.geometry.dispose();
  });
}

export { ROAD_HALF, WALL_LAT, SCENERY_MIN, GRANDSTAND_MIN };
