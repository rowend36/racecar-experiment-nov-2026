/* MIMO VELOCITY — math & utilities */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';

// ---------------- scalar ----------------
const U = {};
M.util = U;
U.clamp = (x, a, b) => x < a ? a : (x > b ? b : x);
U.lerp = (a, b, t) => a + (b - a) * t;
U.invLerp = (a, b, x) => (x - a) / (b - a);
U.smoothstep = (a, b, x) => { const t = U.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
U.damp = (a, b, lambda, dt) => U.lerp(a, b, 1 - Math.exp(-lambda * dt));
U.sign = x => x < 0 ? -1 : (x > 0 ? 1 : 0);
U.moveTowards = (a, b, maxDelta) => { const d = b - a; return Math.abs(d) <= maxDelta ? b : a + U.sign(d) * maxDelta; };
U.wrapPi = a => { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; };
U.deg = r => r * 180 / Math.PI;
U.rad = d => d * Math.PI / 180;
U.TAU = Math.PI * 2;

// deterministic RNG (mulberry32)
U.rng = function (seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

// ---------------- vec3 (objects {x,y,z}) ----------------
const V3 = {};
M.v3 = V3;
V3.make = (x = 0, y = 0, z = 0) => ({ x, y, z });
V3.set = (o, x, y, z) => { o.x = x; o.y = y; o.z = z; return o; };
V3.copy = (o, a) => { o.x = a.x; o.y = a.y; o.z = a.z; return o; };
V3.add = (o, a, b) => { o.x = a.x + b.x; o.y = a.y + b.y; o.z = a.z + b.z; return o; };
V3.sub = (o, a, b) => { o.x = a.x - b.x; o.y = a.y - b.y; o.z = a.z - b.z; return o; };
V3.scale = (o, a, s) => { o.x = a.x * s; o.y = a.y * s; o.z = a.z * s; return o; };
V3.addScaled = (o, a, b, s) => { o.x = a.x + b.x * s; o.y = a.y + b.y * s; o.z = a.z + b.z * s; return o; };
V3.dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
V3.cross = (o, a, b) => {
  const x = a.y * b.z - a.z * b.y, y = a.z * b.x - a.x * b.z, z = a.x * b.y - a.y * b.x;
  o.x = x; o.y = y; o.z = z; return o;
};
V3.len = a => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
V3.len2 = a => a.x * a.x + a.y * a.y + a.z * a.z;
V3.dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
V3.normalize = (o, a) => { const l = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) || 1; o.x = a.x / l; o.y = a.y / l; o.z = a.z / l; return o; };
V3.lerp = (o, a, b, t) => { o.x = a.x + (b.x - a.x) * t; o.y = a.y + (b.y - a.y) * t; o.z = a.z + (b.z - a.z) * t; return o; };
V3.transformMat4 = (o, a, m) => {
  const x = a.x, y = a.y, z = a.z;
  const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
  o.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  o.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  o.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return o;
};
V3.transformQuat = (o, a, q) => {
  const x = a.x, y = a.y, z = a.z, qx = q.x, qy = q.y, qz = q.z, qw = q.w;
  const ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
  o.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  o.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  o.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return o;
};

// ---------------- quat ----------------
const Q = {};
M.quat = Q;
Q.make = () => ({ x: 0, y: 0, z: 0, w: 1 });
Q.identity = o => { o.x = 0; o.y = 0; o.z = 0; o.w = 1; return o; };
Q.copy = (o, a) => { o.x = a.x; o.y = a.y; o.z = a.z; o.w = a.w; return o; };
Q.fromYawPitchRoll = (o, yaw, pitch, roll) => {
  // order: Ry(yaw) * Rx(pitch) * Rz(roll)
  const cy = Math.cos(yaw * .5), sy = Math.sin(yaw * .5);
  const cp = Math.cos(pitch * .5), sp = Math.sin(pitch * .5);
  const cr = Math.cos(roll * .5), sr = Math.sin(roll * .5);
  o.x = cy * sp * cr + sy * cp * sr;
  o.y = sy * cp * cr - cy * sp * sr;
  o.z = cy * cp * sr - sy * sp * cr;
  o.w = cy * cp * cr + sy * sp * sr;
  return o;
};
Q.mul = (o, a, b) => {
  const ax = a.x, ay = a.y, az = a.z, aw = a.w, bx = b.x, by = b.y, bz = b.z, bw = b.w;
  o.x = ax * bw + aw * bx + ay * bz - az * by;
  o.y = ay * bw + aw * by + az * bx - ax * bz;
  o.z = az * bw + aw * bz + ax * by - ay * bx;
  o.w = aw * bw - ax * bx - ay * by - az * bz;
  return o;
};
Q.slerp = (o, a, b, t) => {
  let ax = a.x, ay = a.y, az = a.z, aw = a.w, bx = b.x, by = b.y, bz = b.z, bw = b.w;
  let cos = ax * bx + ay * by + az * bz + aw * bw;
  if (cos < 0) { cos = -cos; bx = -bx; by = -by; bz = -bz; bw = -bw; }
  let s0, s1;
  if (cos > .9995) { s0 = 1 - t; s1 = t; }
  else {
    const th = Math.acos(cos), sn = Math.sin(th);
    s0 = Math.sin((1 - t) * th) / sn; s1 = Math.sin(t * th) / sn;
  }
  o.x = ax * s0 + bx * s1; o.y = ay * s0 + by * s1; o.z = az * s0 + bz * s1; o.w = aw * s0 + bw * s1;
  return o;
};

// ---------------- mat4 (Float32Array 16, column-major, out-param style) ----------------
const M4 = {};
M.mat4 = M4;
M4.make = () => new Float32Array(16);
M4.identity = o => { o.fill(0); o[0] = o[5] = o[10] = o[15] = 1; return o; };
M4.copy = (o, a) => { o.set(a); return o; };
M4.mul = (o, a, b) => {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  o[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  o[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  o[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  o[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  o[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  o[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  o[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  o[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  o[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  o[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  o[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  o[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  o[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  o[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  o[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  o[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return o;
};
M4.perspective = (o, fovy, aspect, near, far) => {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  o.fill(0);
  o[0] = f / aspect; o[5] = f; o[10] = (far + near) * nf; o[11] = -1; o[14] = 2 * far * near * nf;
  return o;
};
M4.ortho = (o, l, r, b, t, n, f) => {
  o.fill(0);
  o[0] = 2 / (r - l); o[5] = 2 / (t - b); o[10] = -2 / (f - n);
  o[12] = -(r + l) / (r - l); o[13] = -(t + b) / (t - b); o[14] = -(f + n) / (f - n); o[15] = 1;
  return o;
};
M4.lookAt = (o, eye, center, up) => {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  z0 = eye.x - center.x; z1 = eye.y - center.y; z2 = eye.z - center.z;
  len = Math.hypot(z0, z1, z2); if (len) { z0 /= len; z1 /= len; z2 /= len; }
  x0 = up.y * z2 - up.z * z1; x1 = up.z * z0 - up.x * z2; x2 = up.x * z1 - up.y * z0;
  len = Math.hypot(x0, x1, x2); if (len) { x0 /= len; x1 /= len; x2 /= len; }
  y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
  o[0] = x0; o[1] = y0; o[2] = z0; o[3] = 0;
  o[4] = x1; o[5] = y1; o[6] = z1; o[7] = 0;
  o[8] = x2; o[9] = y2; o[10] = z2; o[11] = 0;
  o[12] = -(x0 * eye.x + x1 * eye.y + x2 * eye.z);
  o[13] = -(y0 * eye.x + y1 * eye.y + y2 * eye.z);
  o[14] = -(z0 * eye.x + z1 * eye.y + z2 * eye.z);
  o[15] = 1;
  return o;
};
M4.invert = (o, a) => {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) return null;
  det = 1 / det;
  o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return o;
};
M4.fromRotationTranslationScale = (o, q, v, s) => {
  const x = q.x, y = q.y, z = q.z, w = q.w, x2 = x + x, y2 = y + y, z2 = z + z,
        xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2,
        wx = w * x2, wy = w * y2, wz = w * z2, sx = s.x, sy = s.y, sz = s.z;
  o[0] = (1 - (yy + zz)) * sx; o[1] = (xy + wz) * sx; o[2] = (xz - wy) * sx; o[3] = 0;
  o[4] = (xy - wz) * sy; o[5] = (1 - (xx + zz)) * sy; o[6] = (yz + wx) * sy; o[7] = 0;
  o[8] = (xz + wy) * sz; o[9] = (yz - wx) * sz; o[10] = (1 - (xx + yy)) * sz; o[11] = 0;
  o[12] = v.x; o[13] = v.y; o[14] = v.z; o[15] = 1;
  return o;
};
M4.getTranslation = (o, m) => { o.x = m[12]; o.y = m[13]; o.z = m[14]; return o; };

// ---------------- Catmull-Rom closed spline sampler ----------------
// pts: [{x,y,z}] control points (closed loop). Samples uniformly by dense subdivision.
function Spline(pts) {
  this.pts = pts;
  this.samples = [];   // {p:{x,y,z}, t:{x,y,z} tangent, r:{x,y,z} right, u:arcLength}
  this.length = 0;
}
Spline.prototype.evaluate = function (i, t, out) {
  const n = this.pts.length;
  const p0 = this.pts[(i - 1 + n) % n], p1 = this.pts[i % n],
        p2 = this.pts[(i + 1) % n], p3 = this.pts[(i + 2) % n];
  const t2 = t * t, t3 = t2 * t;
  out.x = .5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
  out.y = .5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
  out.z = .5 * ((2 * p1.z) + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);
  return out;
};
// densify into arc-length parameterized samples
Spline.prototype.build = function (perSeg) {
  perSeg = perSeg || 24;
  const tmp = { x: 0, y: 0, z: 0 }, prev = { x: 0, y: 0, z: 0 };
  const n = this.pts.length;
  this.samples.length = 0;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < perSeg; j++) {
      const t = j / perSeg;
      this.evaluate(i, t, tmp);
      if (this.samples.length) acc += Math.hypot(tmp.x - prev.x, tmp.y - prev.y, tmp.z - prev.z);
      prev.x = tmp.x; prev.y = tmp.y; prev.z = tmp.z;
      this.samples.push({ x: tmp.x, y: tmp.y, z: tmp.z, u: acc, tx: 0, ty: 0, tz: 0, rx: 0, ry: 0, rz: 0, nx: 0, ny: 1, nz: 0, curv: 0 });
    }
  }
  // close the loop length
  const first = this.samples[0], last = this.samples[this.samples.length - 1];
  acc += Math.hypot(first.x - last.x, first.y - last.y, first.z - last.z);
  this.length = acc;
  // tangents (central differences)
  const S = this.samples, m = S.length;
  for (let i = 0; i < m; i++) {
    const a = S[(i - 1 + m) % m], b = S[(i + 1) % m];
    let dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
    const l = Math.hypot(dx, dy, dz) || 1;
    S[i].tx = dx / l; S[i].ty = dy / l; S[i].tz = dz / l;
  }
  // right = tangent x up ; normal(up) = right x tangent
  for (let i = 0; i < m; i++) {
    const s = S[i];
    let rx = s.tz * 1 - 0, ry = 0, rz = -s.tx;      // t x up(0,1,0) = (tz*1-0*0, 0*0-tx*1... ) compute properly:
    // t × up = (ty*0 - tz*1, tz*0 - tx*0, tx*1 - ty*0) = (-tz, 0, tx)
    rx = -s.tz; ry = 0; rz = s.tx;
    const rl = Math.hypot(rx, ry, rz) || 1;
    s.rx = rx / rl; s.ry = ry / rl; s.rz = rz / rl;
    // normal = right × tangent
    let nx = s.ry * s.tz - s.rz * s.ty, ny = s.rz * s.tx - s.rx * s.tz, nz = s.rx * s.ty - s.ry * s.tx;
    const nl = Math.hypot(nx, ny, nz) || 1;
    s.nx = nx / nl; s.ny = ny / nl; s.nz = nz / nl;
  }
  // curvature (signed, via change in tangent along arc)
  for (let i = 0; i < m; i++) {
    const a = S[(i - 4 + m) % m], b = S[(i + 4) % m];
    let du = b.u - a.u; if (du < 0) du += this.length;
    const dtx = b.tx - a.tx, dtz = b.tz - a.tz;
    // signed curvature ~ |dT/ds| with sign from right-vector rotation
    const mag = Math.hypot(dtx, dtz) / Math.max(.001, du);
    const sign = (dtx * S[i].rx + dtz * S[i].rz) > 0 ? 1 : -1;
    S[i].curv = mag * sign;
  }
  return this;
};
// find nearest sample index near hint (fast local search), full search if needed
Spline.prototype.nearest = function (x, z, hint) {
  const S = this.samples, m = S.length;
  let best = -1, bd = Infinity;
  if (hint !== undefined && hint >= 0) {
    const R = 40;
    for (let k = -R; k <= R; k++) {
      const i = (hint + k + m * 2) % m;
      const d = (S[i].x - x) ** 2 + (S[i].z - z) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    if (bd < 900) return { index: best, dist2: bd }; // within 30m, confident
  }
  bd = Infinity; best = 0;
  for (let i = 0; i < m; i++) {
    const d = (S[i].x - x) ** 2 + (S[i].z - z) ** 2;
    if (d < bd) { bd = d; best = i; }
  }
  return { index: best, dist2: bd };
};
// lateral offset + arc pos given world x,z (uses nearest sample then projection)
Spline.prototype.toLocal = function (x, z, hint) {
  const S = this.samples, m = S.length;
  const n = this.nearest(x, z, hint);
  let i = n.index;
  // refine with neighbor projection
  const a = S[i], b = S[(i + 1) % m];
  let dx = b.x - a.x, dz = b.z - a.z;
  const ll = dx * dx + dz * dz || 1;
  let t = ((x - a.x) * dx + (z - a.z) * dz) / ll;
  t = U.clamp(t, -0.5, 1.5);
  const px = a.x + dx * t, pz = a.z + dz * t;
  const off = Math.hypot(x - px, z - pz);
  // sign: right side positive
  const side = ((x - a.x) * -a.tz + (z - a.z) * a.tx) >= 0 ? 1 : -1;
  let u = a.u + (dx * dx + dz * dz ? t * Math.hypot(dx, dz) : 0);
  if (u > this.length) u -= this.length;
  if (u < 0) u += this.length;
  return { s: u, lat: off * side, index: i < 0 ? 0 : ((t > .5) ? (i + 1) % m : i) };
};

M.Spline = Spline;

// ---------------- misc ----------------
U.fmtTime = function (ms) {
  if (ms == null || !isFinite(ms)) return '--:--.---';
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), f = Math.floor(ms % 1000);
  return m + ':' + String(s).padStart(2, '0') + '.' + String(f).padStart(3, '0');
};
U.ordinal = function (n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};
// frame-rate independent exponential approach
U.dampAngle = function (a, b, lambda, dt) {
  let d = U.wrapPi(b - a);
  return a + d * (1 - Math.exp(-lambda * dt));
};

})(window.MIMO);
