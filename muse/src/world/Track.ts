import * as THREE from 'three';
import { makeAsphalt, makeCurb, makeGlowStrip } from '../graphics/Materials';

// Closed-loop coastal GP circuit: spline -> ribbon road + curbs + walls + start gantry.
// Also provides fast arcade collision: project car onto centerline.
export class Track {
  curve: THREE.CatmullRomCurve3;
  group = new THREE.Group();
  centerPoints: THREE.Vector3[] = [];
  leftPoints: THREE.Vector3[] = [];
  rightPoints: THREE.Vector3[] = [];
  widths: number[] = [];
  totalLength = 0;
  roadWidth = 16;
  private samples = 900;

  constructor() {
    const pts: Array<[number, number, number]> = [
      [0, 0, -220], [90, 1, -205], [170, 2, -160], [210, 3, -80],
      [190, 4, 10], [120, 5, 60], [130, 6, 140], [200, 4, 190],
      [170, 2, 270], [70, 1, 290], [-30, 2, 260], [-90, 6, 180],
      [-60, 10, 90], [-130, 12, 20], [-210, 8, -20], [-230, 4, -120],
      [-150, 1, -190], [-70, 0, -215],
    ];
    this.curve = new THREE.CatmullRomCurve3(
      pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)), true, 'catmullrom', 0.6
    );
    this.build();
  }

  private build() {
    const N = this.samples;
    const centers = this.curve.getSpacedPoints(N);
    centers.pop(); // closed loop duplicate
    const n = centers.length;
    this.totalLength = this.curve.getLength();

    const up = new THREE.Vector3(0, 1, 0);
    const roadGeoPos: number[] = []; const roadUV: number[] = []; const roadIdx: number[] = [];
    const curbLPos: number[] = []; const curbRPos: number[] = [];
    const wallLPos: number[] = []; const wallRPos: number[] = [];

    for (let i = 0; i < n; i++) {
      const p = centers[i];
      const pNext = centers[(i + 1) % n];
      const pPrev = centers[(i - 1 + n) % n];
      const tangent = pNext.clone().sub(pPrev).normalize();
      const side = new THREE.Vector3().crossVectors(up, tangent).normalize();
      // widen on corners: estimate curvature
      const turn = pNext.clone().sub(p).normalize().angleTo(p.clone().sub(pPrev).normalize());
      const w = this.roadWidth * (1 + Math.min(0.35, turn * 2.2));
      const left = p.clone().addScaledVector(side, w / 2);
      const right = p.clone().addScaledVector(side, -w / 2);
      left.y += 0.02; right.y += 0.02;
      this.centerPoints.push(p.clone()); this.leftPoints.push(left); this.rightPoints.push(right); this.widths.push(w);

      const v = (i / n) * this.totalLength / 14; // asphalt repeat
      roadGeoPos.push(left.x, left.y, left.z, right.x, right.y, right.z);
      roadUV.push(0, v, 1, v);
      if (i < n - 1) { const a = i * 2; roadIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      else { roadIdx.push(i * 2, i * 2 + 1, 0, i * 2 + 1, 1, 0); }

      // curbs slightly outside
      const cl = p.clone().addScaledVector(side, w / 2 + 0.9); cl.y += 0.06;
      const cr = p.clone().addScaledVector(side, -w / 2 - 0.9); cr.y += 0.06;
      curbLPos.push(left.x, left.y + 0.02, left.z, cl.x, cl.y, cl.z);
      curbRPos.push(right.x, right.y + 0.02, right.z, cr.x, cr.y, cr.z);

      // walls
      const wl = p.clone().addScaledVector(side, w / 2 + 1.6); wl.y += 0.55;
      const wlB = wl.clone(); wlB.y -= 1.1;
      const wr = p.clone().addScaledVector(side, -w / 2 - 1.6); wr.y += 0.55;
      const wrB = wr.clone(); wrB.y -= 1.1;
      wallLPos.push(wlB.x, wlB.y, wlB.z, wl.x, wl.y, wl.z);
      wallRPos.push(wrB.x, wrB.y, wrB.z, wr.x, wr.y, wr.z);
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadGeoPos, 3));
    roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(roadUV, 2));
    roadGeo.setIndex(roadIdx);
    roadGeo.computeVertexNormals();
    const roadMat = makeAsphalt();
    roadMat.map!.repeat.set(1, 1);
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.receiveShadow = true;
    this.group.add(road);

    // center dashes: thin emissive-less white strips via instancing
    const dashGeo = new THREE.PlaneGeometry(0.35, 4);
    dashGeo.rotateX(-Math.PI / 2);
    const dashMat = new THREE.MeshStandardMaterial({ color: 0xdfe6f2, roughness: 0.6 });
    const dashCount = 160;
    const dashes = new THREE.InstancedMesh(dashGeo, dashMat, dashCount);
    const m4 = new THREE.Matrix4(); const q = new THREE.Quaternion(); const upV = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < dashCount; i++) {
      const idx = Math.floor((i / dashCount) * n);
      const p = this.centerPoints[idx]; const p2 = this.centerPoints[(idx + 5) % n];
      const dir = p2.clone().sub(p); dir.y = 0; dir.normalize();
      q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().negate());
      m4.compose(new THREE.Vector3(p.x, p.y + 0.05, p.z), q, new THREE.Vector3(1, 1, 1));
      dashes.setMatrixAt(i, m4);
    }
    dashes.instanceMatrix.needsUpdate = true;
    this.group.add(dashes);

    const curbMat = makeCurb();
    const mkStrip = (arr: number[], mat: THREE.Material) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      const idx: number[] = [];
      const quads = arr.length / 6 / 2;
      for (let i = 0; i < quads - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      const a = (quads - 1) * 2; idx.push(a, a + 1, 0, a + 1, 1, 0);
      g.setIndex(idx); g.computeVertexNormals();
      const uv = new Float32Array((arr.length / 3) * 2);
      for (let i = 0; i < uv.length; i += 2) { uv[i] = (i / 2) % 2; uv[i + 1] = Math.floor(i / 4) / 4; }
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      const mesh = new THREE.Mesh(g, mat);
      mesh.receiveShadow = true;
      return mesh;
    };
    this.group.add(mkStrip(curbLPos, curbMat));
    this.group.add(mkStrip(curbRPos, curbMat.clone()));

    // neon walls: dark base + emissive top strip
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x11151f, roughness: 0.5, metalness: 0.6 });
    const stripMat = makeGlowStrip('#00e5ff');
    const mkWall = (arr: number[]) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      const idx: number[] = []; const quads = arr.length / 6 / 2;
      for (let i = 0; i < quads - 1; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
      const a = (quads - 1) * 2; idx.push(a, 0, a + 1, a + 1, 0, 1);
      g.setIndex(idx); g.computeVertexNormals();
      return new THREE.Mesh(g, wallMat);
    };
    this.group.add(mkWall(wallLPos)); this.group.add(mkWall(wallRPos));

    // neon top strips
    const stripGeoL: number[] = [];
    for (let i = 0; i < n; i++) {
      const p = this.centerPoints[i];
      const pN = this.centerPoints[(i + 1) % n];
      const t = pN.clone().sub(p); t.y = 0; t.normalize();
      const side = new THREE.Vector3().crossVectors(up, t).normalize();
      const a = p.clone().addScaledVector(side, this.widths[i] / 2 + 1.6); a.y += 1.12;
      const b = pN.clone().addScaledVector(side, this.widths[(i + 1) % n] / 2 + 1.6); b.y += 1.12;
      stripGeoL.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const stripGeo = new THREE.BufferGeometry();
    stripGeo.setAttribute('position', new THREE.Float32BufferAttribute(stripGeoL, 3));
    this.group.add(new THREE.LineSegments(stripGeo, new THREE.LineBasicMaterial({ color: 0x00e5ff })));

    this.buildGantry(n, stripMat);
    this.buildStartLine();
  }

  private buildGantry(n: number, mat: THREE.Material) {
    const i = 0;
    const c = this.centerPoints[i];
    const c2 = this.centerPoints[10];
    const dir = c2.clone().sub(c).normalize();
    const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
    const w = this.widths[i] / 2 + 3;
    const h = 8;
    const post = new THREE.BoxGeometry(0.8, h, 0.8);
    const pm = new THREE.MeshStandardMaterial({ color: 0x0c1018, metalness: 0.8, roughness: 0.35 });
    const l = new THREE.Mesh(post, pm); l.position.copy(c).addScaledVector(side, w); l.position.y += h / 2; l.castShadow = true;
    const r = new THREE.Mesh(post, pm); r.position.copy(c).addScaledVector(side, -w); r.position.y += h / 2; r.castShadow = true;
    const beam = new THREE.Mesh(new THREE.BoxGeometry(w * 2 + 1, 1.6, 1.2), pm);
    beam.position.copy(c); beam.position.y += h;
    beam.lookAt(c.clone().add(dir));
    beam.rotateY(Math.PI / 2);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(w * 2, 0.5, 1.3), mat);
    glow.position.copy(beam.position); glow.position.y -= 0.4;
    glow.rotation.copy(beam.rotation);
    const bannerC = document.createElement('canvas'); bannerC.width = 1024; bannerC.height = 96;
    const bg = bannerC.getContext('2d')!;
    const grad = bg.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, '#00e5ff'); grad.addColorStop(0.5, '#7c4dff'); grad.addColorStop(1, '#ff2d78');
    bg.fillStyle = grad; bg.fillRect(0, 0, 1024, 96);
    bg.fillStyle = '#04060b'; bg.font = 'italic 900 62px system-ui'; bg.textAlign = 'center'; bg.textBaseline = 'middle';
    bg.fillText('MUSE  •  APEX PROTOCOL', 512, 52);
    const btex = new THREE.CanvasTexture(bannerC); btex.colorSpace = THREE.SRGBColorSpace; btex.anisotropy = 8;
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(w * 2, 1.5), new THREE.MeshBasicMaterial({ map: btex, side: THREE.DoubleSide }));
    banner.position.copy(beam.position); banner.position.y += 0.1;
    banner.rotation.copy(beam.rotation);
    this.group.add(l, r, beam, glow, banner);
    void n;
  }

  private buildStartLine() {
    const c = this.centerPoints[0]; const c2 = this.centerPoints[6];
    const dir = c2.clone().sub(c).normalize();
    const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
    const w = this.widths[0] / 2;
    const cnv = document.createElement('canvas'); cnv.width = 128; cnv.height = 16;
    const g = cnv.getContext('2d')!;
    for (let x = 0; x < 16; x++) for (let y = 0; y < 2; y++) { g.fillStyle = (x + y) % 2 ? '#0a0a0a' : '#f5f5f5'; g.fillRect(x * 8, y * 8, 8, 8); }
    const tex = new THREE.CanvasTexture(cnv); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w * 2, 3), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }));
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = Math.atan2(dir.x, dir.z) + Math.PI;
    m.position.copy(c); m.position.y += 0.045;
    // offset plane so its local X spans across track
    m.rotateY(Math.PI / 2);
    m.position.addScaledVector(side, 0);
    this.group.add(m);
  }

  // --- arcade query: nearest centerline index in a local window (O(window)) ---
  nearestIndex(pos: THREE.Vector3, hint: number, window = 40): { index: number; dist: number; lateral: number } {
    const n = this.centerPoints.length;
    let best = hint, bestD = Infinity;
    for (let k = -window; k <= window; k++) {
      const i = (hint + k + n) % n;
      const d = this.centerPoints[i].distanceToSquared(pos);
      if (d < bestD) { bestD = d; best = i; }
    }
    const c = this.centerPoints[best];
    const c2 = this.centerPoints[(best + 1) % n];
    const dir = c2.clone().sub(c); dir.y = 0; dir.normalize();
    const side = new THREE.Vector3(-dir.z, 0, dir.x);
    const rel = pos.clone().sub(c);
    const lateral = rel.dot(side);
    return { index: best, dist: Math.sqrt(bestD), lateral };
  }

  frameAt(index: number, out: { pos: THREE.Vector3; dir: THREE.Vector3; side: THREE.Vector3 }) {
    const n = this.centerPoints.length;
    out.pos.copy(this.centerPoints[index]);
    out.dir.copy(this.centerPoints[(index + 3) % n]).sub(this.centerPoints[index]).normalize();
    out.side.set(-out.dir.z, 0, out.dir.x);
  }
}
