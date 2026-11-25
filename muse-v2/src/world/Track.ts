import * as THREE from 'three';
import { TextureSet } from '../core/Textures';
import { clamp, lerp, mulberry32 } from '../core/Math';

export const ROAD_HALF = 8.5;
const CURB = 1.25;
const RUNOFF = 2.6;
export const WALL_LAT = 12.3;
const SEGMENTS = 1200;

const UP = new THREE.Vector3(0, 1, 0);

export interface TrackFrame {
  pos: THREE.Vector3;
  tangent: THREE.Vector3;
  right: THREE.Vector3;
  up: THREE.Vector3;
  bank: number;
  curvature: number;
  s: number;
}

export interface TrackHit {
  index: number;
  s: number;
  lateral: number;
  height: number;
  distSq: number;
  tangent: THREE.Vector3;
  right: THREE.Vector3;
  bank: number;
  onRoad: boolean;
}

interface Sample {
  pos: THREE.Vector3;
  tangent: THREE.Vector3;
  right: THREE.Vector3;
  bank: number;
  curvature: number;
  s: number;
  segLen: number;
}

/**
 * Closed coastal circuit: spline -> banked ribbon + curbs + runoff + walls
 * + start gantry + terrain + ocean. Query API (frameAt / nearest / gridSlot)
 * mirrors the proven deepseek layout so physics behaves identically.
 */
export class Track {
  readonly group = new THREE.Group();
  readonly samples: Sample[] = [];
  readonly length: number;
  readonly minimapPoints: THREE.Vector2[] = [];
  readonly minimapBounds = new THREE.Box2(
    new THREE.Vector2(Infinity, Infinity),
    new THREE.Vector2(-Infinity, -Infinity),
  );
  readonly startLine: THREE.Vector3;
  private readonly roadMat: THREE.MeshStandardMaterial;
  private terrainFn: ((x: number, z: number) => number) | null = null;

  constructor(private textures: TextureSet) {
    this.group.name = 'circuit';
    const control: Array<[number, number, number]> = [
      [-45, 8, 300], [140, 7, 300], [300, 5, 260], [402, 3, 158],
      [390, 1.5, 38], [298, 2, -24], [248, 5, -102], [300, 8, -208],
      [220, 10.5, -304], [82, 10, -314], [8, 7, -232], [42, 4.5, -118],
      [-44, 3.5, -70], [-162, 4.5, -102], [-262, 6.5, -30], [-304, 5, 102],
      [-242, 6.5, 212], [-142, 8, 262],
    ];
    const points = control.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
    const raw = curve.getSpacedPoints(SEGMENTS);
    raw.pop();

    const n = raw.length;
    let total = 0;
    for (let i = 0; i < n; i++) {
      const next = raw[(i + 1) % n];
      const prev = raw[(i - 1 + n) % n];
      const tangent = next.clone().sub(prev).normalize();
      const right = tangent.clone().cross(UP).normalize();
      this.samples.push({
        pos: raw[i].clone(), tangent, right,
        bank: 0, curvature: 0, s: total,
        segLen: raw[i].distanceTo(next),
      });
      total += raw[i].distanceTo(next);
    }
    this.length = total;

    const rawCurv = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = this.samples[i].tangent;
      const b = this.samples[(i + 1) % n].tangent;
      const crossY = a.z * b.x - a.x * b.z;
      rawCurv[i] = Math.asin(clamp(crossY, -1, 1)) / Math.max(0.001, this.samples[i].segLen);
    }
    for (let i = 0; i < n; i++) {
      let sum = 0;
      let wsum = 0;
      for (let o = -6; o <= 6; o++) {
        const w = 1 - Math.abs(o) / 7;
        sum += rawCurv[(i + o + n) % n] * w;
        wsum += w;
      }
      const curv = sum / wsum;
      this.samples[i].curvature = curv;
      this.samples[i].bank = clamp(curv * 7.5, -0.085, 0.085);
    }

    for (const s of this.samples) {
      this.minimapBounds.expandByPoint(new THREE.Vector2(s.pos.x, s.pos.z));
    }
    for (let i = 0; i < n; i += 5) {
      this.minimapPoints.push(new THREE.Vector2(this.samples[i].pos.x, this.samples[i].pos.z));
    }

    this.roadMat = new THREE.MeshStandardMaterial({
      map: textures.asphalt,
      normalMap: textures.asphaltNormal,
      roughnessMap: textures.asphaltRough,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughness: 1.0,
      metalness: 0.04,
      envMapIntensity: 0.5,
      color: 0xcfd4de,
    });
    textures.asphalt.repeat.set(2, 240);

    this.buildRoad();
    this.buildCurbs();
    this.buildRunoff();
    this.buildWalls();
    this.buildStartLine();
    this.buildMarkings();
    this.buildTerrain();
    this.buildOcean();

    this.startLine = this.frameAt(0).pos.clone();
    this.group.matrixAutoUpdate = false;
    this.group.updateMatrixWorld(true);
  }

  frameAt(s: number, out?: TrackFrame): TrackFrame {
    const n = this.samples.length;
    let ss = s % this.length;
    if (ss < 0) ss += this.length;
    const fi = (ss / this.length) * n;
    const i = Math.floor(fi) % n;
    const j = (i + 1) % n;
    const t = fi - Math.floor(fi);
    const a = this.samples[i];
    const b = this.samples[j];
    const pos = new THREE.Vector3().lerpVectors(a.pos, b.pos, t);
    const tangent = new THREE.Vector3().lerpVectors(a.tangent, b.tangent, t).normalize();
    const right = new THREE.Vector3().lerpVectors(a.right, b.right, t).normalize();
    const bank = lerp(a.bank, b.bank, t);
    const up = new THREE.Vector3(0, 1, 0).addScaledVector(right, -Math.tan(bank)).normalize();
    if (out) {
      out.pos.copy(pos); out.tangent.copy(tangent); out.right.copy(right);
      out.up.copy(up); out.bank = bank;
      out.curvature = lerp(a.curvature, b.curvature, t); out.s = ss;
      return out;
    }
    return { pos, tangent, right, up, bank, curvature: lerp(a.curvature, b.curvature, t), s: ss };
  }

  /** Project a world position onto the spline. Pass the previous index as hint. */
  nearest(pos: THREE.Vector3, hint = -1, out?: TrackHit): TrackHit {
    const n = this.samples.length;
    let best = -1;
    let bestD = Infinity;
    let bestT = 0;
    if (hint >= 0) {
      for (let o = 0; o <= 24; o++) {
        const i = (((hint - 12 + o) % n) + n) % n;
        const hit = this.segmentDistance(pos, i);
        if (hit.d2 < bestD) { bestD = hit.d2; best = i; bestT = hit.t; }
      }
    } else {
      for (let i = 0; i < n; i += 4) {
        const hit = this.segmentDistance(pos, i);
        if (hit.d2 < bestD) { bestD = hit.d2; best = i; bestT = hit.t; }
      }
      const coarse = best;
      for (let o = -5; o <= 5; o++) {
        const i = (((coarse + o) % n) + n) % n;
        const hit = this.segmentDistance(pos, i);
        if (hit.d2 < bestD) { bestD = hit.d2; best = i; bestT = hit.t; }
      }
    }
    const a = this.samples[best];
    const b = this.samples[(best + 1) % n];
    const cx = lerp(a.pos.x, b.pos.x, bestT);
    const cz = lerp(a.pos.z, b.pos.z, bestT);
    const cy = lerp(a.pos.y, b.pos.y, bestT);
    const right = new THREE.Vector3().lerpVectors(a.right, b.right, bestT).normalize();
    const tangent = new THREE.Vector3().lerpVectors(a.tangent, b.tangent, bestT).normalize();
    const bank = lerp(a.bank, b.bank, bestT);
    const lateral = (pos.x - cx) * right.x + (pos.z - cz) * right.z;
    const height = cy + lateral * Math.tan(bank);
    const s = (a.s + bestT * a.segLen + this.length) % this.length;
    const hit: TrackHit = out ?? {
      index: best, s, lateral, height, distSq: bestD,
      tangent, right, bank, onRoad: true,
    };
    hit.index = best; hit.s = s; hit.lateral = lateral; hit.height = height;
    hit.distSq = bestD; hit.tangent.copy(tangent); hit.right.copy(right);
    hit.bank = bank; hit.onRoad = Math.abs(lateral) <= ROAD_HALF + CURB;
    return hit;
  }

  private segmentDistance(pos: THREE.Vector3, i: number): { d2: number; t: number } {
    const n = this.samples.length;
    const a = this.samples[i].pos;
    const b = this.samples[(i + 1) % n].pos;
    const abx = b.x - a.x;
    const abz = b.z - a.z;
    const len2 = abx * abx + abz * abz;
    let t = 0;
    if (len2 > 1e-6) {
      t = clamp(((pos.x - a.x) * abx + (pos.z - a.z) * abz) / len2, 0, 1);
    }
    const dx = pos.x - (a.x + abx * t);
    const dz = pos.z - (a.z + abz * t);
    return { d2: dx * dx + dz * dz, t };
  }

  terrainHeightAt(x: number, z: number): number {
    return this.terrainFn ? this.terrainFn(x, z) : 0;
  }

  basisAt(frame: TrackFrame): { x: THREE.Vector3; y: THREE.Vector3; z: THREE.Vector3 } {
    const up = new THREE.Vector3(0, 1, 0)
      .addScaledVector(frame.right, -Math.tan(frame.bank)).normalize();
    const z = frame.tangent.clone().normalize();
    const x = new THREE.Vector3().crossVectors(up, z).normalize();
    const y = new THREE.Vector3().crossVectors(z, x).normalize();
    return { x, y, z };
  }

  gridSlot(index: number): { position: THREE.Vector3; yaw: number; s: number; lateral: number } {
    const row = Math.floor(index / 2);
    const side = index % 2 === 0 ? -1 : 1;
    const lateral = side * 2.55;
    const s = (this.length - 20 - row * 11 + this.length) % this.length;
    const f = this.frameAt(s);
    const y = f.pos.y + lateral * Math.tan(f.bank);
    return {
      position: new THREE.Vector3(f.pos.x + f.right.x * lateral, y + 0.02, f.pos.z + f.right.z * lateral),
      yaw: Math.atan2(f.tangent.x, f.tangent.z),
      s, lateral,
    };
  }

  private ribbon(
    latA: number, latB: number, yOff: number,
    uRepeat: number, vRepeat: number,
    material: THREE.Material, uvScale = 1,
  ): THREE.Mesh {
    const n = this.samples.length;
    const step = 4;
    const count = Math.ceil(n / step);
    const positions = new Float32Array((count + 1) * 2 * 3);
    const uvs = new Float32Array((count + 1) * 2 * 2);
    const idx: number[] = [];
    for (let k = 0; k <= count; k++) {
      const s = this.samples[(k * step) % n];
      const bank = s.bank;
      const yA = s.pos.y + latA * Math.tan(bank) + yOff;
      const yB = s.pos.y + latB * Math.tan(bank) + yOff;
      positions.set(
        [s.pos.x + s.right.x * latA, yA, s.pos.z + s.right.z * latA,
         s.pos.x + s.right.x * latB, yB, s.pos.z + s.right.z * latB],
        k * 6,
      );
      const v = (k / count) * vRepeat * uvScale;
      uvs.set([uRepeat, v, 0, v], k * 4);
      if (k < count) {
        const r = k * 2;
        idx.push(r, r + 1, r + 2, r + 1, r + 3, r + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, material);
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }

  private buildRoad(): void {
    this.ribbon(-ROAD_HALF, ROAD_HALF, 0, 1, 300, this.roadMat);
  }

  private buildCurbs(): void {
    const curbMat = (color: number) => new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
    // Alternating red/white curb blocks on both edges.
    const n = this.samples.length;
    const step = 6;
    const geoRed = new THREE.BoxGeometry(1, 1, 1);
    const mats = [curbMat(0xc02020), curbMat(0xe8e8e8)];
    void geoRed; void mats;
    const blockLen = 4;
    const positions: Array<{ p: THREE.Vector3; yaw: number; right: THREE.Vector3; bank: number; red: boolean }> = [];
    let toggle = false;
    for (let i = 0; i < n; i += step) {
      const s = this.samples[i];
      if (Math.floor(i / (blockLen * 2)) % 2 === 0) toggle = !toggle;
      for (const side of [-1, 1]) {
        const lat = side * (ROAD_HALF + CURB / 2);
        positions.push({
          p: new THREE.Vector3(
            s.pos.x + s.right.x * lat, s.pos.y + lat * Math.tan(s.bank) + 0.02, s.pos.z + s.right.z * lat),
          yaw: Math.atan2(s.tangent.x, s.tangent.z),
          right: s.right.clone(), bank: s.bank,
          red: (Math.floor(i / 8) % 2 === 0) !== (side < 0),
        });
      }
      void toggle;
    }
    const redMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(CURB, 0.09, 4.2), curbMat(0xc02020), Math.ceil(positions.length / 2) + 2);
    const whiteMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(CURB, 0.09, 4.2), curbMat(0xe8e8e8), Math.ceil(positions.length / 2) + 2);
    const dummy = new THREE.Object3D();
    let ri = 0;
    let wi = 0;
    for (const b of positions) {
      dummy.position.copy(b.p);
      dummy.rotation.set(0, b.yaw, 0);
      dummy.updateMatrix();
      if (b.red) { if (ri < redMesh.count) redMesh.setMatrixAt(ri++, dummy.matrix); }
      else { if (wi < whiteMesh.count) whiteMesh.setMatrixAt(wi++, dummy.matrix); }
    }
    redMesh.count = ri; whiteMesh.count = wi;
    redMesh.instanceMatrix.needsUpdate = true;
    whiteMesh.instanceMatrix.needsUpdate = true;
    redMesh.receiveShadow = true; whiteMesh.receiveShadow = true;
    this.group.add(redMesh, whiteMesh);
  }

  private buildRunoff(): void {
    const mat = new THREE.MeshStandardMaterial({ color: 0x3d4a43, roughness: 1 });
    this.ribbon(ROAD_HALF + CURB, ROAD_HALF + CURB + RUNOFF, -0.02, 1, 200, mat);
    this.ribbon(-ROAD_HALF - CURB - RUNOFF, -ROAD_HALF - CURB, -0.02, 1, 200, mat);
  }

  private buildWalls(): void {
    // Barrier posts (instanced) + glowing top rail ribbon on both sides.
    const n = this.samples.length;
    const step = 10;
    const spots: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    for (let i = 0; i < n; i += step) {
      const s = this.samples[i];
      for (const side of [-1, 1]) {
        const lat = side * WALL_LAT;
        dummy.position.set(
          s.pos.x + s.right.x * lat, s.pos.y + lat * Math.tan(s.bank) + 0.55, s.pos.z + s.right.z * lat);
        dummy.rotation.set(0, Math.atan2(s.tangent.x, s.tangent.z), 0);
        dummy.updateMatrix();
        spots.push(dummy.matrix.clone());
      }
    }
    const postGeo = new THREE.BoxGeometry(0.28, 1.1, 0.28);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x2a2e38, roughness: 0.7, metalness: 0.4 });
    const posts = new THREE.InstancedMesh(postGeo, postMat, spots.length);
    spots.forEach((m, i) => posts.setMatrixAt(i, m));
    posts.instanceMatrix.needsUpdate = true;
    this.group.add(posts);

    const railMat = new THREE.MeshStandardMaterial({
      color: 0x181c24, roughness: 0.5, metalness: 0.6,
      emissive: 0x27e0ff, emissiveIntensity: 0.55,
    });
    for (const side of [-1, 1]) {
      const lat = side * WALL_LAT;
      this.ribbon(lat - 0.15, lat + 0.15, 1.0, 1, 200, railMat, 0.2);
    }
  }

  private buildStartLine(): void {
    const mat = new THREE.MeshBasicMaterial({ map: this.textures.checker });
    const mesh = new THREE.PlaneGeometry(ROAD_HALF * 2, 2.2);
    const f = this.frameAt(0);
    const m = new THREE.Mesh(mesh, mat);
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = -Math.atan2(f.tangent.x, f.tangent.z);
    m.position.set(f.pos.x, f.pos.y + 0.03, f.pos.z);
    this.group.add(m);
  }

  private buildMarkings(): void {
    // White edge lines + dashed centerline.
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xdfe4ee });
    this.ribbon(ROAD_HALF - 0.55, ROAD_HALF - 0.15, 0.015, 1, 300, edgeMat, 0.2);
    this.ribbon(-ROAD_HALF + 0.15, -ROAD_HALF + 0.55, 0.015, 1, 300, edgeMat, 0.2);

    const n = this.samples.length;
    const dashGeo = new THREE.PlaneGeometry(0.35, 3);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xe8ecf4 });
    const count = Math.floor(n / 24);
    const dashes = new THREE.InstancedMesh(dashGeo, dashMat, count);
    const dummy = new THREE.Object3D();
    let di = 0;
    for (let i = 0; i < n && di < count; i += 24) {
      const s = this.samples[i];
      dummy.position.set(s.pos.x, s.pos.y + 0.02, s.pos.z);
      dummy.rotation.set(-Math.PI / 2, 0, -Math.atan2(s.tangent.x, s.tangent.z));
      dummy.updateMatrix();
      dashes.setMatrixAt(di++, dummy.matrix);
    }
    dashes.count = di;
    dashes.instanceMatrix.needsUpdate = true;
    this.group.add(dashes);
  }

  private buildTerrain(): void {
    // Converged height field: follows the circuit, falls away outside.
    const rand = mulberry32(42);
    const peaks: Array<{ x: number; z: number; h: number; r: number }> = [];
    for (let i = 0; i < 14; i++) {
      peaks.push({ x: (rand() - 0.5) * 1400, z: (rand() - 0.5) * 1400, h: 20 + rand() * 60, r: 180 + rand() * 260 });
    }
    const tmp = new THREE.Vector3();
    this.terrainFn = (x: number, z: number) => {
      tmp.set(x, 0, z);
      const hit = this.nearest(tmp, -1);
      const d = Math.sqrt(hit.distSq);
      let h = hit.height - 0.35;
      const fall = clamp((d - 30) / 220, 0, 1);
      for (const p of peaks) {
        const dx = x - p.x;
        const dz = z - p.z;
        const dist2 = dx * dx + dz * dz;
        h += p.h * Math.exp(-dist2 / (p.r * p.r)) * fall;
      }
      h -= fall * 6;
      return h;
    };
    const size = 1600;
    const seg = 96;
    const geo = new THREE.PlaneGeometry(size, size, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      posAttr.setY(i, this.terrainFn(x, z) - 0.6);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: 0x44523f, roughness: 1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.group.add(mesh);
  }

  private buildOcean(): void {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0a2a44, roughness: 0.25, metalness: 0.1,
      emissive: 0x06223a, emissiveIntensity: 0.7,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.5;
    this.group.add(mesh);
  }
}
