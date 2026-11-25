import * as THREE from 'three';
import { TextureSet } from '../core/Textures';
import { clamp, lerp, mulberry32, smoothstep } from '../core/Math';

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
 * A closed coastal city circuit. Everything is procedural: spline -> banked
 * ribbon geometry, runoff, barriers, a converged terrain field and a minimap.
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
  readonly textures: TextureSet;
  private readonly roadMat: THREE.MeshPhysicalMaterial;
  private terrainSampler: ((x: number, z: number) => number) | null = null;

  constructor(textures: TextureSet) {
    this.textures = textures;
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
        pos: raw[i].clone(),
        tangent,
        right,
        bank: 0,
        curvature: 0,
        s: total,
        segLen: raw[i].distanceTo(next),
      });
      total += raw[i].distanceTo(next);
    }
    this.length = total;

    // Signed curvature from the 2D heading change, then bank into corners.
    const rawCurv = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = this.samples[i].tangent;
      const b = this.samples[(i + 1) % n].tangent;
      const crossY = a.z * b.x - a.x * b.z;
      const ds = Math.max(0.001, this.samples[i].segLen);
      rawCurv[i] = Math.asin(clamp(crossY, -1, 1)) / ds;
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

    for (const sample of this.samples) {
      this.minimapBounds.expandByPoint(new THREE.Vector2(sample.pos.x, sample.pos.z));
    }
    for (let i = 0; i < n; i += 5) {
      this.minimapPoints.push(new THREE.Vector2(this.samples[i].pos.x, this.samples[i].pos.z));
    }

    this.roadMat = new THREE.MeshPhysicalMaterial({
      map: textures.asphalt,
      normalMap: textures.asphaltNormal,
      roughnessMap: textures.asphaltRough,
      normalScale: new THREE.Vector2(0.15, 0.15),
      roughness: 1.0,
      metalness: 0.03,
      envMapIntensity: 0.5,
      specularIntensity: 0.28,
      specularColor: 0xffffff,
      color: 0xd2d8e4,
      dithering: true,
    });

    this.buildRoad();
    this.buildCurbs();
    this.buildRunoff();
    this.buildBarriers();
    this.buildStartLine();
    this.buildMarkings();
    this.buildTerrain();
    this.buildOcean();

    this.startLine = this.frameAt(0).pos.clone();
    this.group.matrixAutoUpdate = false;
    this.group.updateMatrixWorld(true);
  }

  /** Total length in metres. */
  get totalLength(): number {
    return this.length;
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
      out.pos.copy(pos);
      out.tangent.copy(tangent);
      out.right.copy(right);
      out.up.copy(up);
      out.bank = bank;
      out.curvature = lerp(a.curvature, b.curvature, t);
      out.s = ss;
      return out;
    }
    return {
      pos,
      tangent,
      right,
      up,
      bank,
      curvature: lerp(a.curvature, b.curvature, t),
      s: ss,
    };
  }

  /** Project a world position onto the spline. Pass the previous index as a hint. */
  nearest(pos: THREE.Vector3, hint = -1, out?: TrackHit): TrackHit {
    const n = this.samples.length;
    let best = -1;
    let bestD = Infinity;
    let bestT = 0;
    if (hint >= 0) {
      const start = hint - 12;
      for (let o = 0; o <= 24; o++) {
        const i = ((start + o) % n + n) % n;
        const hit = this.segmentDistance(pos, i);
        if (hit.d2 < bestD) {
          bestD = hit.d2;
          best = i;
          bestT = hit.t;
        }
      }
    } else {
      for (let i = 0; i < n; i += 4) {
        const hit = this.segmentDistance(pos, i);
        if (hit.d2 < bestD) {
          bestD = hit.d2;
          best = i;
          bestT = hit.t;
        }
      }
      const coarse = best;
      for (let o = -5; o <= 5; o++) {
        const i = ((coarse + o) % n + n) % n;
        const hit = this.segmentDistance(pos, i);
        if (hit.d2 < bestD) {
          bestD = hit.d2;
          best = i;
          bestT = hit.t;
        }
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
      index: best,
      s,
      lateral,
      height,
      distSq: bestD,
      tangent,
      right,
      bank,
      onRoad: true,
    };
    hit.index = best;
    hit.s = s;
    hit.lateral = lateral;
    hit.height = height;
    hit.distSq = bestD;
    hit.tangent.copy(tangent);
    hit.right.copy(right);
    hit.bank = bank;
    hit.onRoad = Math.abs(lateral) <= ROAD_HALF + CURB;
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
      t = ((pos.x - a.x) * abx + (pos.z - a.z) * abz) / len2;
      t = clamp(t, 0, 1);
    }
    const dx = pos.x - (a.x + abx * t);
    const dz = pos.z - (a.z + abz * t);
    return { d2: dx * dx + dz * dz, t };
  }

  surfaceHeight(lateral: number, bank: number, centerY: number): number {
    return centerY + lateral * Math.tan(bank);
  }

  terrainHeightAt(x: number, z: number): number {
    return this.terrainSampler ? this.terrainSampler(x, z) : 0;
  }

  /** Wet-weather response for the asphalt: more mirror-like reflections. */
  setWet(wet: boolean): void {
    this.roadMat.roughness = wet ? 0.7 : 1.0;
    this.roadMat.envMapIntensity = wet ? 0.9 : 0.5;
    this.roadMat.normalScale.set(wet ? 0.4 : 0.55, wet ? 0.4 : 0.55);
  }

  /** Orthonormal ground basis at a spline frame (x = across, y = surface normal, z = forward). */
  basisAt(frame: TrackFrame): { x: THREE.Vector3; y: THREE.Vector3; z: THREE.Vector3 } {
    const up = new THREE.Vector3(0, 1, 0)
      .addScaledVector(frame.right, -Math.tan(frame.bank))
      .normalize();
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
      position: new THREE.Vector3(
        f.pos.x + f.right.x * lateral,
        y + 0.02,
        f.pos.z + f.right.z * lateral,
      ),
      yaw: Math.atan2(f.tangent.x, f.tangent.z),
      s,
      lateral,
    };
  }

  private ribbon(
    latA: number,
    latB: number,
    yA: number,
    yB: number,
    uA: number,
    uB: number,
    vScale: number,
    material: THREE.Material,
    receiveShadow = true,
  ): THREE.Mesh {
    const n = this.samples.length;
    const verts = new Float32Array(n * 2 * 3);
    const uvs = new Float32Array(n * 2 * 2);
    const idx = new Uint32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const s = this.samples[i];
      const yBase = s.pos.y + s.bank * 0; // pos already has elevation
      const y1 = yBase + Math.tan(s.bank) * latA + yA;
      const y2 = yBase + Math.tan(s.bank) * latB + yB;
      const o = i * 6;
      verts[o] = s.pos.x + s.right.x * latA;
      verts[o + 1] = y1;
      verts[o + 2] = s.pos.z + s.right.z * latA;
      verts[o + 3] = s.pos.x + s.right.x * latB;
      verts[o + 4] = y2;
      verts[o + 5] = s.pos.z + s.right.z * latB;
      const uo = i * 4;
      uvs[uo] = uA;
      uvs[uo + 1] = s.s / vScale;
      uvs[uo + 2] = uB;
      uvs[uo + 3] = s.s / vScale;
      const io = i * 6;
      const j = (i + 1) % n;
      idx[io] = i * 2;
      idx[io + 1] = i * 2 + 1;
      idx[io + 2] = j * 2;
      idx[io + 3] = i * 2 + 1;
      idx[io + 4] = j * 2 + 1;
      idx[io + 5] = j * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, material);
    mesh.receiveShadow = receiveShadow;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    this.group.add(mesh);
    return mesh;
  }

  private buildRoad(): void {
    this.ribbon(
      -ROAD_HALF, ROAD_HALF, 0, 0, 0, 2, 12, this.roadMat, true,
    );
    // Slightly lighter, polished racing line through the middle.
    const lineMat = new THREE.MeshStandardMaterial({
      map: this.textures.asphalt,
      normalMap: this.textures.asphaltNormal,
      color: 0x30343e,
      roughness: 0.55,
      metalness: 0.02,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      envMapIntensity: 1.2,
    });
    const wear = this.ribbon(-2.9, 2.9, 0.006, 0.006, 0, 1, 14, lineMat, false);
    wear.renderOrder = 1;
  }

  private buildCurbs(): void {
    const curbMat = new THREE.MeshStandardMaterial({
      map: this.textures.curb,
      roughness: 0.42,
      metalness: 0.02,
      envMapIntensity: 0.8,
    });
    for (const side of [-1, 1]) {
      const inner = side * ROAD_HALF;
      const outer = side * (ROAD_HALF + CURB);
      this.ribbon(inner, outer, 0.012, 0.085, 0, 1, 4, curbMat, true);
    }
  }

  private buildRunoff(): void {
    const mat = new THREE.MeshStandardMaterial({
      map: this.textures.asphalt,
      normalMap: this.textures.asphaltNormal,
      color: 0x5a6070,
      roughness: 0.78,
      metalness: 0.0,
      envMapIntensity: 0.75,
    });
    for (const side of [-1, 1]) {
      this.ribbon(
        side * (ROAD_HALF + CURB),
        side * (ROAD_HALF + CURB + RUNOFF),
        0.02,
        -0.05,
        0,
        1,
        12,
        mat,
        true,
      );
    }
  }

  private wall(
    lat: number,
    yBottom: number,
    yTop: number,
    material: THREE.Material,
  ): void {
    const n = this.samples.length;
    const verts = new Float32Array(n * 6);
    const uvs = new Float32Array(n * 4);
    const idx = new Uint32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const s = this.samples[i];
      const baseY = s.pos.y + Math.tan(s.bank) * lat;
      const o = i * 6;
      verts[o] = s.pos.x + s.right.x * lat;
      verts[o + 1] = baseY + yBottom;
      verts[o + 2] = s.pos.z + s.right.z * lat;
      verts[o + 3] = s.pos.x + s.right.x * lat;
      verts[o + 4] = baseY + yTop;
      verts[o + 5] = s.pos.z + s.right.z * lat;
      uvs[i * 4] = s.s / 8;
      uvs[i * 4 + 1] = 0;
      uvs[i * 4 + 2] = s.s / 8;
      uvs[i * 4 + 3] = 1;
      const j = (i + 1) % n;
      idx[i * 6] = i * 2;
      idx[i * 6 + 1] = i * 2 + 1;
      idx[i * 6 + 2] = j * 2;
      idx[i * 6 + 3] = i * 2 + 1;
      idx[i * 6 + 4] = j * 2 + 1;
      idx[i * 6 + 5] = j * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, material);
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    this.group.add(mesh);
  }

  private buildBarriers(): void {
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x171b24,
      roughness: 0.34,
      metalness: 0.8,
      side: THREE.DoubleSide,
      envMapIntensity: 1.3,
    });
    const postGeo = new THREE.BoxGeometry(0.14, 1.25, 0.14);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e13,
      roughness: 0.5,
      metalness: 0.7,
    });
    const count = Math.ceil(this.samples.length / 7) * 2;
    const posts = new THREE.InstancedMesh(postGeo, postMat, count);
    posts.castShadow = false;
    posts.receiveShadow = true;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
   let pi = 0;
    for (const side of [-1, 1]) {
      this.wall(side * WALL_LAT, 0, 0.95, wallMat);
      const neon = new THREE.MeshStandardMaterial({
        color: 0x05070a,
        emissive: side === 1 ? 0x2fe8ff : 0xff2b7a,
        emissiveIntensity: 4.2,
        roughness: 0.4,
      });
      this.wall(side * (WALL_LAT - 0.012), 0.58, 0.68, neon);
      for (let i = 0; i < this.samples.length; i += 7) {
        const s = this.samples[i];
        const y = s.pos.y + Math.tan(s.bank) * side * (WALL_LAT + 0.18);
        m.compose(
          new THREE.Vector3(
            s.pos.x + s.right.x * side * (WALL_LAT + 0.18),
            y + 0.62,
            s.pos.z + s.right.z * side * (WALL_LAT + 0.18),
          ),
          q.identity(),
          new THREE.Vector3(1, 1, 1),
        );
        posts.setMatrixAt(pi++, m);
      }
    }
    posts.count = pi;
    posts.instanceMatrix.needsUpdate = true;
    this.group.add(posts);
  }

  private buildStartLine(): void {
    const f = this.frameAt(0);
    const geo = new THREE.PlaneGeometry(ROAD_HALF * 2, 2.6);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      map: this.textures.checker,
      roughness: 0.42,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const basis = this.basisAt(f);
    mesh.position.copy(f.pos).addScaledVector(f.tangent, 1.3).addScaledVector(basis.y, 0.025);
    const mat4 = new THREE.Matrix4().makeBasis(basis.x, basis.y, basis.z);
    mesh.quaternion.setFromRotationMatrix(mat4);
    mesh.receiveShadow = true;
    this.group.add(mesh);
  }

  private buildMarkings(): void {
    const paint = new THREE.MeshStandardMaterial({
      color: 0xdde6f2,
      roughness: 0.52,
      metalness: 0.0,
      envMapIntensity: 0.5,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    for (const side of [-1, 1]) {
      const inner = side * (ROAD_HALF - 0.58);
      const outer = side * (ROAD_HALF - 0.36);
      this.ribbon(Math.min(inner, outer), Math.max(inner, outer), 0.008, 0.008, 0, 1, 8, paint, false);
    }

    // Centre dashes, rebuilt as one efficient mesh.
    const verts: number[] = [];
    const idx: number[] = [];
    let vcount = 0;
    const n = this.samples.length;
    const step = Math.max(2, Math.round(7 / (this.length / n)));
    for (let i = 0; i < n; i += step * 2) {
      const a = this.samples[i];
      const b = this.samples[(i + step) % n];
      if (Math.abs(a.tangent.x - b.tangent.x) + Math.abs(a.tangent.z - b.tangent.z) > 0.9) continue;
      const half = 0.085;
      const y = 0.008;
      const ax = a.pos.x;
      const az = a.pos.z;
      const bx = b.pos.x;
      const bz = b.pos.z;
      verts.push(
        ax - a.right.x * half, a.pos.y + y, az - a.right.z * half,
        ax + a.right.x * half, a.pos.y + y, az + a.right.z * half,
        bx - a.right.x * half, b.pos.y + y, bz - a.right.z * half,
        bx + a.right.x * half, b.pos.y + y, bz + a.right.z * half,
      );
      idx.push(vcount, vcount + 1, vcount + 2, vcount + 2, vcount + 1, vcount + 3);
      vcount += 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, paint);
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    this.group.add(mesh);
  }

  private buildTerrain(): void {
    const SIZE = 2200;
    const RES = 196;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, RES, RES);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);

    // Bucket the spline samples for fast nearest lookups during terrain baking.
    const cell = 40;
    const buckets = new Map<string, number[]>();
    for (let i = 0; i < this.samples.length; i++) {
      const p = this.samples[i].pos;
      const key = `${Math.floor(p.x / cell)},${Math.floor(p.z / cell)}`;
      let arr = buckets.get(key);
      if (!arr) {
        arr = [];
        buckets.set(key, arr);
      }
      arr.push(i);
    }
    const rng = mulberry32(2027);
    const noiseA = (x: number, z: number): number => {
      const ix = Math.floor(x);
      const iz = Math.floor(z);
      const fx = x - ix;
      const fz = z - iz;
      const sx = fx * fx * (3 - 2 * fx);
      const sz = fz * fz * (3 - 2 * fz);
      const h = (a: number, b: number): number => {
        let v = Math.sin(a * 127.1 + b * 311.7 + 19.3) * 43758.5453;
        v = v - Math.floor(v);
        return v;
      };
      const a = h(ix, iz);
      const b = h(ix + 1, iz);
      const c = h(ix, iz + 1);
      const d = h(ix + 1, iz + 1);
      return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
    };
    const hills = (x: number, z: number): number => {
      let v = 0;
      v += noiseA(x * 0.0032 + 11, z * 0.0032 - 7) * 17;
      v += noiseA(x * 0.009 - 3, z * 0.009 + 9) * 4.5;
      v += noiseA(x * 0.024, z * 0.024) * 1.3;
      return v - 6;
    };

    const nearestY = (x: number, z: number): { d: number; y: number } => {
      let best = Infinity;
      let bestY = 0;
      const cx = Math.floor(x / cell);
      const cz = Math.floor(z / cell);
      for (let oz = -1; oz <= 1; oz++) {
        for (let ox = -1; ox <= 1; ox++) {
          const arr = buckets.get(`${cx + ox},${cz + oz}`);
          if (!arr) continue;
          for (const i of arr) {
            const p = this.samples[i].pos;
            const dx = p.x - x;
            const dz = p.z - z;
            const d = dx * dx + dz * dz;
            if (d < best) {
              best = d;
              bestY = p.y;
            }
          }
        }
      }
      if (best === Infinity) {
        for (let k = 0; k < this.samples.length; k += 8) {
          const p = this.samples[k].pos;
          const dx = p.x - x;
          const dz = p.z - z;
          const d = dx * dx + dz * dz;
          if (d < best) {
            best = d;
            bestY = p.y;
          }
        }
      }
      return { d: Math.sqrt(best), y: bestY };
    };

    const heights = new Float32Array(pos.count);
    const terrainHeight = (x: number, z: number): number => {
      const near = nearestY(x, z);
      const hill = hills(x, z);
      const blend = smoothstep(16, 130, near.d);
      let h = lerp(near.y - 1.1, hill, blend);
      // Never poke through the circuit itself.
      if (near.d < 18) h = Math.min(h, near.y - 0.65);
      const radius = Math.hypot(x, z);
      return lerp(h, -6, smoothstep(760, 1080, radius));
    };
    this.terrainSampler = terrainHeight;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = terrainHeight(x, z);
      heights[i] = h;
      pos.setY(i, h);
    }
    geo.computeVertexNormals();

    const nrm = geo.attributes.normal as THREE.BufferAttribute;
    const grass = new THREE.Color(0x6b7b56);
    const dry = new THREE.Color(0x8b7a58);
    const rock = new THREE.Color(0x686b73);
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const near = nearestY(x, z);
      const slope = 1 - nrm.getY(i);
      const n = noiseA(x * 0.02, z * 0.02);
      tmp.copy(grass).lerp(dry, clamp(n * 0.7 + (1 - smoothstep(12, 45, near.d)) * 0.8, 0, 1));
      tmp.lerp(rock, smoothstep(0.16, 0.5, slope));
      tmp.multiplyScalar(0.72 + n * 0.38);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({
      map: this.textures.terrain,
      vertexColors: true,
      roughness: 0.97,
      metalness: 0.0,
      envMapIntensity: 0.55,
    });
    const terrain = new THREE.Mesh(geo, mat);
    terrain.receiveShadow = true;
    terrain.matrixAutoUpdate = false;
    this.group.add(terrain);

    // Scattered boulders for silhouette breaks.
    const rockGeo = new THREE.DodecahedronGeometry(1, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x35363b, roughness: 0.95 });
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, 90);
    const m = new THREE.Matrix4();
    let ri = 0;
    while (ri < 90) {
      const x = (rng() - 0.5) * 1400;
      const z = (rng() - 0.5) * 1400;
      if (Math.hypot(x, z) > 850) continue;
      const near = nearestY(x, z);
      if (near.d < 30) continue;
      const s = 0.8 + rng() * 3.4;
      m.compose(
        new THREE.Vector3(x, terrainHeight(x, z) + s * 0.25, z),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(rng() * 0.4, rng() * Math.PI, rng() * 0.4),
        ),
        new THREE.Vector3(s, s * (0.5 + rng() * 0.7), s),
      );
      rocks.setMatrixAt(ri++, m);
    }
    rocks.instanceMatrix.needsUpdate = true;
    rocks.castShadow = false;
    rocks.receiveShadow = false;
    this.group.add(rocks);
  }

  private buildOcean(): void {
    const geo = new THREE.PlaneGeometry(9000, 9000);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x071827,
      roughness: 0.14,
      metalness: 0.65,
      envMapIntensity: 1.7,
    });
    const ocean = new THREE.Mesh(geo, mat);
    ocean.position.y = -6.2;
    ocean.receiveShadow = false;
    ocean.matrixAutoUpdate = false;
    this.group.add(ocean);
  }
}
