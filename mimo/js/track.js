/* MIMO VELOCITY — circuit definition, banking, racing line, props */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';
const U = M.util;

// ---- circuit control points (closed loop): x, y(elevation), z ----
// Clean oval circuit: start/finish on the south straight (heading +X).
const CTRL = [
  [   0, 0.0, -177],   // start/finish (on a straight)
  [ 100, 0.6, -152],
  [ 187, 2.5, -106],
  [ 250, 5.6,  -12],   // east side, climbing
  [ 232, 8.1,   94],
  [ 150, 7.5,  172],
  [  25, 5.6,  194],   // north straight
  [ -88, 3.8,  170],
  [-187, 2.5,  119],
  [-245, 1.3,   19],   // west side, descending
  [-232, 0.0,  -94],
  [-175, -0.6, -156]   // final corner onto the main straight
];

function Track() {
  this.halfWidth = 7.5;
  this.spline = new M.Spline(CTRL.map(p => ({ x: p[0], y: p[1], z: p[2] })));
  this.spline.build(40);            // 12 control points × 40 = 480 samples
  this.N = this.spline.samples.length;
  this.length = this.spline.length;
  this.uArr = Float64Array.from(this.spline.samples, s => s.u);
  this.applyBanking();
  this.computeRacingLine();
  this.gridSlots = this.makeGrid(6);
}

Track.prototype.applyBanking = function () {
  const S = this.spline.samples, n = this.N;
  // smooth curvature first
  const raw = S.map(s => s.curv);
  const sm = new Float32Array(n);
  const W = 8;
  for (let i = 0; i < n; i++) {
    let acc = 0;
    for (let k = -W; k <= W; k++) acc += raw[(i + k + n * 2) % n];
    sm[i] = acc / (W * 2 + 1);
  }
  this.curv = sm;
  // bank = curvature-driven, smoothed
  const bank = new Float32Array(n);
  for (let i = 0; i < n; i++) bank[i] = U.clamp(sm[i] * 30, -0.13, 0.13);
  const bankSm = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let acc = 0;
    for (let k = -6; k <= 6; k++) acc += bank[(i + k + n * 2) % n];
    bankSm[i] = acc / 13;
  }
  this.bank = bankSm;
  // rotate right/normal around tangent (Rodrigues)
  for (let i = 0; i < n; i++) {
    const s = S[i], a = bankSm[i];
    const ca = Math.cos(a), sa = Math.sin(a);
    // t × r
    const cx = s.ty * s.rz - s.tz * s.ry;
    const cy = s.tz * s.rx - s.tx * s.rz;
    const cz = s.tx * s.ry - s.ty * s.rx;
    const rx = s.rx * ca + cx * sa, ry = s.ry * ca + cy * sa, rz = s.rz * ca + cz * sa;
    const nx = s.nx * ca + (s.ty * s.nz - s.tz * s.ny) * sa;
    const ny = s.ny * ca + (s.tz * s.nx - s.tx * s.nz) * sa;
    const nz = s.nz * ca + (s.tx * s.ny - s.ty * s.nx) * sa;
    s.rx = rx; s.ry = ry; s.rz = rz;
    s.nx = nx; s.ny = ny; s.nz = nz;
  }
};

Track.prototype.computeRacingLine = function () {
  // lateral offset toward inside of corner (out-in-out approximated)
  const n = this.N, S = this.spline.samples;
  const off = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    // look ahead curvature to position apex
    let c = 0;
    for (let k = 0; k < 10; k++) c += this.curv[(i + k) % n];
    c /= 10;
    off[i] = U.clamp(c * 240, -3.4, 3.4);
  }
  const sm = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let acc = 0;
    for (let k = -14; k <= 14; k++) acc += off[(i + k + n * 2) % n];
    sm[i] = acc / 29;
  }
  this.lineOff = sm;
  // top speed per sample: sqrt(aLat / |curv|), aLat ~ 13
  const spd = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const c = Math.abs(this.curv[i]);
    spd[i] = c < 1e-5 ? 999 : Math.min(92, Math.sqrt(13.5 / c));
  }
  // forward smoothing so cars brake BEFORE the corner
  const sm2 = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let m = spd[i];
    for (let k = 1; k <= 34; k++) {
      const j = (i + k) % n;
      // braking distance allowance grows with k
      const allow = Math.sqrt(Math.max(0, spd[j] * spd[j] + 2 * 11 * (k * (this.length / n))));
      if (allow < m) m = allow;
    }
    sm2[i] = Math.min(m, spd[i]);
  }
  this.lineSpeed = sm2;
};

// arc-length -> sample index (binary search over actual u values)
Track.prototype.indexAt = function (s) {
  const L = this.length;
  s = ((s % L) + L) % L;
  const u = this.uArr;
  let lo = 0, hi = u.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (u[mid] <= s) lo = mid; else hi = mid - 1;
  }
  const i = lo;
  const u0 = u[i];
  const u1 = (i === u.length - 1) ? L : u[i + 1];
  const t = u1 > u0 ? (s - u0) / (u1 - u0) : 0;
  return { i, t };
};

// interpolate sample data at arc length s (wraps)
Track.prototype.sampleAt = function (s) {
  const n = this.N, L = this.length;
  const loc = this.indexAt(s);
  const i = loc.i, t = loc.t;
  const a = this.spline.samples[i], b = this.spline.samples[(i + 1) % n];
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
    rx: a.rx + (b.rx - a.rx) * t, ry: a.ry + (b.ry - a.ry) * t, rz: a.rz + (b.rz - a.rz) * t,
    tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t, tz: a.tz + (b.tz - a.tz) * t,
    curv: a.curv + (b.curv - a.curv) * t
  };
};

// world -> (s, lat) using hint index for speed
Track.prototype.localize = function (x, z, hint) {
  return this.spline.toLocal(x, z, hint);
};

// position on track at arc s with lateral offset (returns world point)
Track.prototype.pointAt = function (s, lat) {
  const p = this.sampleAt(s);
  return { x: p.x + p.rx * lat, y: p.y + p.ry * lat, z: p.z + p.rz * lat, p };
};

// grid slots behind start line, staggered
Track.prototype.makeGrid = function (count) {
  const slots = [];
  const L = this.length;
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 2);
    const side = (i % 2) === 0 ? -1 : 1;
    const s = L - 12 - row * 9;
    const lat = side * 3.1;
    const pt = this.pointAt(s, lat);
    const yaw = Math.atan2(pt.p.tx, pt.p.tz); // forward = +Z local
    slots.push({ x: pt.x, y: pt.y, z: pt.z, s, lat, yaw });
  }
  return slots;
};

// ---- props ----
Track.prototype.buildProps = function () {
  const rng = U.rng(1337);
  const S = this.spline.samples, n = this.N, hw = this.halfWidth;

  // lamps: alternate sides every ~30m
  this.lampPos = [];
  const step = Math.max(6, Math.round(30 / (this.length / n)));
  for (let i = 0, side = 1; i < n; i += step, side = -side) {
    const s = S[i];
    const lat = side * (hw + 2.6);
    const px = s.x + s.rx * lat, pz = s.z + s.rz * lat, py = s.y + s.ry * lat;
    const outwardX = s.rx * side, outwardZ = s.rz * side;
    this.lampPos.push({
      x: px, y: py - 0.1, z: pz, side,
      rot: Math.atan2(-outwardZ, outwardX), pool: { x: s.x + s.rx * side * (hw - 2.5), y: s.y, z: s.z + s.rz * side * (hw - 2.5) }
    });
  }

  // cones: apex markers just outside the road edge
  this.conePos = [];
  for (let i = 0; i < n; i += 3) {
    if (Math.abs(this.curv[i]) > 0.016 && rng() < 0.5) {
      const s = S[i];
      const side = this.curv[i] > 0 ? 1 : -1;   // inside of corner
      const lat = side * (hw + 1.45);
      this.conePos.push({ x: s.x + s.rx * lat, y: s.y + s.ry * lat, z: s.z + s.rz * lat });
      if (this.conePos.length > 40) break;
    }
  }

  // buildings: ring around track
  this.buildingList = [];
  const tryPlace = (cx, cz, w, d, h, neon) => {
    // avoid track overlap
    for (let i = 0; i < n; i += 4) {
      const s = S[i];
      const dx = s.x - cx, dz = s.z - cz;
      if (dx * dx + dz * dz < (26 + Math.max(w, d) * .5) ** 2) return false;
    }
    this.buildingList.push({ x: cx, z: cz, w, d, h, neon });
    return true;
  };
  let placed = 0;
  for (let i = 0; i < n && placed < 90; i += 7) {
    const s = S[i];
    for (const side of [1, -1]) {
      if (rng() < 0.42) continue;
      const dist = 34 + rng() * 60;
      const lat = side * dist;
      const cx = s.x + s.rx * lat + (rng() - .5) * 16;
      const cz = s.z + s.rz * lat + (rng() - .5) * 16;
      const w = 14 + rng() * 22, d = 14 + rng() * 22;
      const h = 16 + rng() * 46 + (dist > 60 ? rng() * 40 : 0);
      if (tryPlace(cx, cz, w, d, h, rng() < 0.32)) placed++;
    }
  }
  // distant skyline — must also keep clear of the circuit
  for (let i = 0; i < 60; i++) {
    const a = rng() * Math.PI * 2;
    const r = 280 + rng() * 320;
    const cx = Math.cos(a) * r, cz = Math.sin(a) * r;
    const w = 24 + rng() * 40, d = 24 + rng() * 40;
    const h = 70 + rng() * 170;
    if (tryPlace(cx, cz, w, d, h, true)) placed++;
  }

  // light pools
  this.poolPos = this.lampPos.map(l => l.pool);
};

// instanced matrices for buildings
Track.prototype.buildingMatrices = function () {
  const n = this.buildingList.length;
  const mat = new Float32Array(n * 16);
  const extra = new Float32Array(n * 4);
  const rng = U.rng(9001);
  for (let i = 0; i < n; i++) {
    const B = this.buildingList[i];
    const o = i * 16;
    // scale columns (x=w, y=h, z=d), translation
    mat[o + 0] = B.w; mat[o + 1] = 0; mat[o + 2] = 0; mat[o + 3] = 0;
    mat[o + 4] = 0; mat[o + 5] = B.h; mat[o + 6] = 0; mat[o + 7] = 0;
    mat[o + 8] = 0; mat[o + 9] = 0; mat[o + 10] = B.d; mat[o + 11] = 0;
    mat[o + 12] = B.x; mat[o + 13] = B.y || 0; mat[o + 14] = B.z; mat[o + 15] = 1;
    extra[i * 4 + 0] = rng() * 100;      // seed
    extra[i * 4 + 1] = B.neon ? 1 : 0;   // neon strip
    extra[i * 4 + 2] = B.far ? 0.35 : (0.45 + rng() * 0.4); // window density
    extra[i * 4 + 3] = B.h;
  }
  return { mat, extra, count: n };
};

// minimap path (scaled to canvas)
Track.prototype.minimapPath = function (size, pad) {
  const S = this.spline.samples, n = this.N;
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
  for (const s of S) {
    minX = Math.min(minX, s.x); maxX = Math.max(maxX, s.x);
    minZ = Math.min(minZ, s.z); maxZ = Math.max(maxZ, s.z);
  }
  const w = maxX - minX, h = maxZ - minZ;
  const sc = Math.min((size - pad * 2) / w, (size - pad * 2) / h);
  const ox = (size - w * sc) / 2, oz = (size - h * sc) / 2;
  return {
    to: (x, z) => [(x - minX) * sc + ox, (z - minZ) * sc + oz],
    scale: sc
  };
};

M.Track = Track;

})(window.MIMO);
