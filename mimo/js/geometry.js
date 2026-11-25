/* MIMO VELOCITY — procedural geometry builders */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';
const G = {};
M.geo = G;

// ---------------- mesh builder with per-material groups + smooth normals ----------------
function Builder() {
  this.pos = []; this.nrm = []; this.uv = []; this.col = []; this.ext = []; this.idx = [];
  this._map = new Map(); this._gid = -1;
}
Builder.prototype.beginGroup = function (id) { this._gid = id; this._map.clear(); return this; };
Builder.prototype._vert = function (p, uv, col, ext) {
  const key = this._gid + '|' + Math.round(p[0] * 2000) + ',' + Math.round(p[1] * 2000) + ',' + Math.round(p[2] * 2000);
  let i = this._map.get(key);
  if (i !== undefined) {
    // accumulate normal
    this.nrm[i * 3] += this._fn[0]; this.nrm[i * 3 + 1] += this._fn[1]; this.nrm[i * 3 + 2] += this._fn[2];
    return i;
  }
  i = this.pos.length / 3;
  this.pos.push(p[0], p[1], p[2]);
  this.nrm.push(this._fn[0], this._fn[1], this._fn[2]);
  this.uv.push(uv[0], uv[1]);
  this.col.push(col[0], col[1], col[2], col[3]);
  this.ext.push(ext[0], ext[1], ext[2], ext[3]);
  this._map.set(key, i);
  return i;
};
// face: 4 points CCW seen from outside
Builder.prototype.face = function (pts, uvs, col, ext) {
  col = col || [1, 1, 1, 1];
  ext = ext || [0, 0, 0, 0];
  uvs = uvs || [[0, 0], [1, 0], [1, 1], [0, 1]];
  // two triangle normals accumulated
  const a = pts[0], b = pts[1], c = pts[2], d = pts[3];
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const e3 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
  const n1 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const n2 = [e2[1] * e3[2] - e2[2] * e3[1], e2[2] * e3[0] - e2[0] * e3[2], e2[0] * e3[1] - e2[1] * e3[0]];
  const n = [n1[0] + n2[0], n1[1] + n2[1], n1[2] + n2[2]];
  const l = Math.hypot(n[0], n[1], n[2]) || 1;
  this._fn = [n[0] / l, n[1] / l, n[2] / l];
  const i0 = this._vert(a, uvs[0], col, ext);
  const i1 = this._vert(b, uvs[1], col, ext);
  const i2 = this._vert(c, uvs[2], col, ext);
  const i3 = this._vert(d, uvs[3], col, ext);
  this.idx.push(i0, i1, i2, i0, i2, i3);
  return this;
};
Builder.prototype.tri = function (p0, p1, p2, uv0, uv1, uv2, col, ext) {
  col = col || [1, 1, 1, 1];
  ext = ext || [0, 0, 0, 0];
  const e1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
  const e2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const l = Math.hypot(n[0], n[1], n[2]) || 1;
  this._fn = [n[0] / l, n[1] / l, n[2] / l];
  const i0 = this._vert(p0, uv0 || [0, 0], col, ext);
  const i1 = this._vert(p1, uv1 || [1, 0], col, ext);
  const i2 = this._vert(p2, uv2 || [1, 1], col, ext);
  this.idx.push(i0, i1, i2);
  return this;
};
Builder.prototype.finalizeNormals = function () {
  for (let i = 0; i < this.nrm.length; i += 3) {
    const l = Math.hypot(this.nrm[i], this.nrm[i + 1], this.nrm[i + 2]) || 1;
    this.nrm[i] /= l; this.nrm[i + 1] /= l; this.nrm[i + 2] /= l;
  }
  return this;
};
Builder.prototype.build = function (gl) {
  this.finalizeNormals();
  const mesh = new M.gl.Mesh(gl, {
    positions: new Float32Array(this.pos),
    normals: new Float32Array(this.nrm),
    uvs: new Float32Array(this.uv),
    colors: new Float32Array(this.col),
    extras: new Float32Array(this.ext),
    indices: this.pos.length / 3 > 65000 ? new Uint32Array(this.idx) : new Uint16Array(this.idx)
  });
  // raw copies kept for tooling/debug probes
  mesh.raw = { positions: new Float32Array(this.pos), colors: new Float32Array(this.col), indices: new Uint32Array(this.idx) };
  return mesh;
};
G.Builder = Builder;

// ---------------- box helper ----------------
G.box = function (b, x0, y0, z0, x1, y1, z1, col, ext, uvs) {
  const u = uvs || [[0, 0], [1, 0], [1, 1], [0, 1]];
  b.face([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], u, col, ext);
  b.face([[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], u, col, ext);
  b.face([[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], u, col, ext);
  b.face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], u, col, ext);
  b.face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], u, col, ext);
  b.face([[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], u, col, ext);
};

// ---------------- ROAD RIBBON ----------------
// samples: spline samples (with banked r/n), halfW: road half width
G.buildRoad = function (gl, samples, halfW, shoulder) {
  const b = new Builder();
  b.beginGroup(0);
  const n = samples.length;
  shoulder = shoulder || 1.6;
  const cols = [-(halfW + shoulder), -halfW, halfW, halfW + shoulder];
  const drop = [0.14, 0, 0, 0.14];
  for (let i = 0; i < n; i++) {
    const s = samples[i];
    const nx = samples[(i + 1) % n];
    const uEnd = (i === n - 1) ? nx.u + Math.hypot(nx.x - s.x, nx.z - s.z) : s.u;
    const A = [];
    for (let c = 0; c < 4; c++) {
      A.push([
        s.x + s.rx * cols[c],
        s.y + s.ry * cols[c] - drop[c],
        s.z + s.rz * cols[c]
      ]);
    }
    const B = [];
    for (let c = 0; c < 4; c++) {
      B.push([
        nx.x + nx.rx * cols[c],
        nx.y + nx.ry * cols[c] - drop[c],
        nx.z + nx.rz * cols[c]
      ]);
    }
    const uvA = [[s.u, cols[0]], [s.u, cols[1]], [s.u, cols[2]], [s.u, cols[3]]];
    const uvB = [[uEnd, cols[0]], [uEnd, cols[1]], [uEnd, cols[2]], [uEnd, cols[3]]];
    // shoulder left: cols0->1, road: 1->2, shoulder right: 2->3
    b.face([A[0], A[1], B[1], B[0]], [uvA[0], uvA[1], uvB[1], uvB[0]]);
    b.face([A[1], A[2], B[2], B[1]], [uvA[1], uvA[2], uvB[2], uvB[1]]);
    b.face([A[2], A[3], B[3], B[2]], [uvA[2], uvA[3], uvB[3], uvB[2]]);
  }
  return b.build(gl);
};

// ---------------- KERBS ----------------
G.buildKerbs = function (gl, samples, halfW) {
  const b = new Builder();
  const n = samples.length;
  const inset = 0.42, outer = 0.3, h = 0.055;
  for (let side = -1; side <= 1; side += 2) {
    b.beginGroup(0);
    for (let i = 0; i < n; i++) {
      const s = samples[i], nx = samples[(i + 1) % n];
      const uEnd = (i === n - 1) ? nx.u + Math.hypot(nx.x - s.x, nx.z - s.z) : s.u;
      // order by r-value ascending so winding faces up
      const latA = side < 0 ? -(halfW + outer) : (halfW - inset);
      const latB = side < 0 ? -(halfW - inset) : (halfW + outer);
      const uvScale = 0.5;
      const A = [s.x + s.rx * latA, s.y + h + s.ry * latA, s.z + s.rz * latA];
      const B = [s.x + s.rx * latB, s.y + h + s.ry * latB, s.z + s.rz * latB];
      const A2 = [nx.x + nx.rx * latA, nx.y + h + nx.ry * latA, nx.z + nx.rz * latA];
      const B2 = [nx.x + nx.rx * latB, nx.y + h + nx.ry * latB, nx.z + nx.rz * latB];
      b.face([A, B, B2, A2],
        [[s.u * uvScale, latA * uvScale], [s.u * uvScale, latB * uvScale],
         [uEnd * uvScale, latB * uvScale], [uEnd * uvScale, latA * uvScale]]);
    }
  }
  return b.build(gl);
};

// ---------------- GUARDRAIL ----------------
G.buildGuardrail = function (gl, samples, halfW) {
  const b = new Builder();
  const n = samples.length;
  const lat = halfW + 0.75;
  const y0 = 0.38, y1 = 0.82;
  const col = [0.62, 0.65, 0.7, 1];
  for (let side = -1; side <= 1; side += 2) {
    b.beginGroup(0);
    for (let i = 0; i < n; i++) {
      const s = samples[i], nx = samples[(i + 1) % n];
      const uEnd = (i === n - 1) ? nx.u + Math.hypot(nx.x - s.x, nx.z - s.z) : s.u;
      const L = lat * side;
      const p = (sm, y) => [sm.x + sm.rx * L, y + sm.ry * L, sm.z + sm.rz * L];
      const a0 = p(s, y0), a1 = p(s, y1), b0 = p(nx, y0), b1 = p(nx, y1);
      const uvs = [[s.u, 0], [s.u, 1], [uEnd, 1], [uEnd, 0]];
      if (side > 0) b.face([a0, a1, b1, b0], uvs, col);        // inward (-r)
      else b.face([a0, b0, b1, a1], uvs, col);                  // inward (+r)
      // top face
      const off = side * 0.1;
      const t0 = [a1[0] + s.rx * off, a1[1], a1[2] + s.rz * off];
      const t1 = [b1[0] + nx.rx * off, b1[1], b1[2] + nx.rz * off];
      const in0 = [a1[0] - s.rx * off, a1[1], a1[2] - s.rz * off];
      const in1 = [b1[0] - nx.rx * off, b1[1], b1[2] - nx.rz * off];
      if (side > 0) b.face([in0, t0, t1, in1], uvs, col);
      else b.face([t0, in0, in1, t1], uvs, col);
      // outer face
      const o0 = p(s, y0), o1 = p(s, y1);
      const o0b = p(nx, y0), o1b = p(nx, y1);
      const ex = side * 0.1;
      const q0 = [o0[0] + s.rx * ex, o0[1], o0[2] + s.rz * ex];
      const q1 = [o1[0] + s.rx * ex, o1[1], o1[2] + s.rz * ex];
      const q0b = [o0b[0] + nx.rx * ex, o0b[1], o0b[2] + nx.rz * ex];
      const q1b = [o1b[0] + nx.rx * ex, o1b[1], o1b[2] + nx.rz * ex];
      if (side > 0) b.face([q0, q0b, q1b, q1], uvs, col);
      else b.face([q0b, q0, q1, q1b], uvs, col);
    }
    // posts
    b.beginGroup(1);
    for (let i = 0; i < n; i += 14) {
      const s = samples[i];
      const px = s.x + s.rx * (lat + 0.12) * side;
      const pz = s.z + s.rz * (lat + 0.12) * side;
      const py = s.y + s.ry * (lat + 0.12) * side;
      const w = 0.07, h = 0.95;
      G.box(b, px - w, py, pz - w, px + w, py + h, pz + w, [0.3, 0.32, 0.36, 1], [0, 0, 0, 0]);
    }
  }
  return b.build(gl);
};

// ---------------- GROUND (base plane below all terrain) ----------------
G.buildGround = function (gl, size) {
  const b = new Builder();
  b.beginGroup(0);
  const s = size, uv = 10, y = PLANE_Y;
  b.face([[-s, y, -s], [-s, y, s], [s, y, s], [s, y, -s]],
    [[0, 0], [0, uv], [uv, uv], [uv, 0]], [1, 1, 1, 1]);
  return b.build(gl);
};

// ---------------- START GATE ----------------
G.buildStartGate = function (gl, halfW) {
  const pillars = new Builder();
  pillars.beginGroup(0);
  const ext = halfW + 2.2;
  for (let side = -1; side <= 1; side += 2) {
    const x = side * ext;
    G.box(pillars, x - 0.35, 0, -0.35, x + 0.35, 6.2, 0.35, [0.24, 0.26, 0.3, 1], [0, 0, 0, 0]);
    G.box(pillars, x - 0.5, 0, -0.5, x + 0.5, 0.4, 0.5, [0.16, 0.17, 0.2, 1], [0, 0, 0, 0]);
  }
  // cross beam
  G.box(pillars, -ext - 0.35, 5.4, -0.3, ext + 0.35, 6.2, 0.3, [0.2, 0.22, 0.26, 1], [0, 0, 0, 0]);
  const pillarMesh = pillars.build(gl);

  // banner (textured)
  const ban = new Builder();
  ban.beginGroup(0);
  const y0 = 3.9, y1 = 5.35, z0 = -0.22, z1 = 0.22;
  ban.face([[-ext, y0, z1], [ext, y0, z1], [ext, y1, z1], [-ext, y1, z1]], [[0, 1], [1, 1], [1, 0], [0, 0]]);
  ban.face([[ext, y0, z0], [-ext, y0, z0], [-ext, y1, z0], [ext, y1, z0]], [[0, 1], [1, 1], [1, 0], [0, 0]]);
  const bannerMesh = ban.build(gl);
  return { pillars: pillarMesh, banner: bannerMesh, width: ext };
};

// ---------------- TRAFFIC CONE ----------------
G.buildCones = function (gl, positions) {
  const b = new Builder();
  const seg = 8;
  for (let ci = 0; ci < positions.length; ci++) {
    const P = positions[ci];
    b.beginGroup(ci);
    const orange = [1.0, 0.32, 0.05, 2], white = [0.95, 0.95, 0.95, 2], base = [0.12, 0.12, 0.13, 2];
    // base
    G.box(b, P.x - 0.24, P.y, P.z - 0.24, P.x + 0.24, P.y + 0.05, P.z + 0.24, base, [0, 0, 0, 0]);
    const H = 0.62, R = 0.16;
    for (let i = 0; i < seg; i++) {
      const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
      const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      // two bands
      const bands = [
        { y0: 0.05, y1: 0.26, col: orange },
        { y0: 0.26, y1: 0.40, col: white },
        { y0: 0.40, y1: H, col: orange }
      ];
      for (const bd of bands) {
        const r0 = R * (1 - bd.y0 / H), r1 = R * (1 - bd.y1 / H);
        const p0 = [P.x + c0 * r0, P.y + bd.y0, P.z + s0 * r0];
        const p1 = [P.x + c1 * r0, P.y + bd.y0, P.z + s1 * r0];
        const p2 = [P.x + c1 * r1, P.y + bd.y1, P.z + s1 * r1];
        const p3 = [P.x + c0 * r1, P.y + bd.y1, P.z + s0 * r1];
        b.face([p0, p1, p2, p3], [[0, 0], [1, 0], [1, 1], [0, 1]], bd.col, [0, 0, 0, 0]);
      }
    }
  }
  return b.build(gl);
};

// box with transform function applied to corners (rotation-safe winding)
G.boxT = function (b, x0, y0, z0, x1, y1, z1, tf, col, ext) {
  const p = (x, y, z) => tf(x, y, z);
  const u = [[0, 0], [1, 0], [1, 1], [0, 1]];
  b.face([p(x1, y0, z0), p(x1, y1, z0), p(x1, y1, z1), p(x1, y0, z1)], u, col, ext);
  b.face([p(x0, y0, z1), p(x0, y1, z1), p(x0, y1, z0), p(x0, y0, z0)], u, col, ext);
  b.face([p(x0, y1, z0), p(x0, y1, z1), p(x1, y1, z1), p(x1, y1, z0)], u, col, ext);
  b.face([p(x0, y0, z0), p(x1, y0, z0), p(x1, y0, z1), p(x0, y0, z1)], u, col, ext);
  b.face([p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)], u, col, ext);
  b.face([p(x1, y0, z0), p(x0, y0, z0), p(x0, y1, z0), p(x1, y1, z0)], u, col, ext);
};

// ---------------- STREET LAMPS (all baked into one mesh) ----------------
// positions: {x,y,z,rot,side}; local +x = outward from road, arm extends toward -x
G.buildLamps = function (gl, positions) {
  const b = new Builder();
  for (let i = 0; i < positions.length; i++) {
    const P = positions[i];
    b.beginGroup(i);
    const c = Math.cos(P.rot), s = Math.sin(P.rot);
    const tf = (lx, ly, lz) => [P.x + lx * c + lz * s, P.y + ly, P.z - lx * s + lz * c];
    const poleCol = [0.16, 0.17, 0.2, 1];
    const w = 0.09;
    G.boxT(b, -w, 0, -w, w, 7.4, w, tf, poleCol, [0, 0, 0, 0]);
    // arm toward road (-x local)
    G.boxT(b, -2.0, 7.26, -0.07, 0.0, 7.4, 0.07, tf, poleCol, [0, 0, 0, 0]);
    // head (emissive id 7)
    G.boxT(b, -2.35, 7.16, -0.17, -1.6, 7.34, 0.17, tf, [1, 0.87, 0.62, 7], [0, 0, 0, 0]);
    // small control box on pole
    G.boxT(b, -0.14, 1.1, -0.14, 0.14, 1.5, 0.14, tf, [0.3, 0.32, 0.34, 2], [0, 0, 0, 0]);
  }
  return b.build(gl);
};

// ---------------- LIGHT POOLS (additive quads on ground) ----------------
G.buildLightPools = function (gl, positions, size, color) {
  const b = new Builder();
  b.beginGroup(0);
  for (const P of positions) {
    const s = size / 2;
    const y = P.y + 0.045;
    b.face([[P.x - s, y, P.z - s], [P.x - s, y, P.z + s], [P.x + s, y, P.z + s], [P.x + s, y, P.z - s]],
      [[0, 0], [0, 1], [1, 1], [1, 0]], color, [0, 0, 0, 0]);
  }
  return b.build(gl);
};

// ---------------- TERRAIN SHELL (follows track elevation, fades to base plane) ----------------
const PLANE_Y = -3;
G.buildTerrain = function (gl, samples, halfW) {
  const b = new Builder();
  const n = samples.length;
  const shoulder = 1.6;
  // lateral offsets and fade toward the base plane
  const cols = [
    { lat: halfW + shoulder, fade: 0.0, add: -0.14 },
    { lat: halfW + 16, fade: 0.15, add: 0 },
    { lat: halfW + 34, fade: 0.40, add: 0 },
    { lat: halfW + 60, fade: 0.75, add: 0 },
    { lat: halfW + 100, fade: 1.0, add: -0.02 }
  ];
  for (const side of [-1, 1]) {
    b.beginGroup(side + 1);
    for (let i = 0; i < n; i++) {
      const s = samples[i], nx = samples[(i + 1) % n];
      const uEnd = (i === n - 1) ? nx.u + Math.hypot(nx.x - s.x, nx.z - s.z) : s.u;
      const A = [], B = [], uvA = [], uvB = [];
      const order = side < 0 ? [...cols].reverse() : cols;
      const edgeLat = (halfW + shoulder) * side;
      const edgeY = s.y + s.ry * edgeLat;
      const edgeYNx = nx.y + nx.ry * edgeLat;
      for (let ci = 0; ci < order.length; ci++) {
        const c = order[ci];
        const lat = c.lat * side;
        const yA = edgeY * (1 - c.fade) + PLANE_Y * c.fade + c.add;
        const yB = edgeYNx * (1 - c.fade) + PLANE_Y * c.fade + c.add;
        A.push([s.x + s.rx * lat, yA, s.z + s.rz * lat]);
        B.push([nx.x + nx.rx * lat, yB, nx.z + nx.rz * lat]);
        const uu = s.u * 0.11, vv = lat * 0.11;
        uvA.push([uu, vv]); uvB.push([uEnd * 0.11, vv]);
      }
      for (let ci = 0; ci < A.length - 1; ci++) {
        b.face([A[ci], A[ci + 1], B[ci + 1], B[ci]],
          [uvA[ci], uvA[ci + 1], uvB[ci + 1], uvB[ci]]);
      }
    }
  }
  return b.build(gl);
};

// ---------------- BUILDINGS (instanced unit box, base at y=0) ----------------
G.buildUnitBoxInstanced = function (gl, matrices, extra) {
  const b = new Builder();
  b.beginGroup(0);
  const col = [1, 1, 1, 1];
  b.face([[0.5, 0, -0.5], [0.5, 1, -0.5], [0.5, 1, 0.5], [0.5, 0, 0.5]], null, col);
  b.face([[-0.5, 0, 0.5], [-0.5, 1, 0.5], [-0.5, 1, -0.5], [-0.5, 0, -0.5]], null, col);
  b.face([[-0.5, 1, -0.5], [-0.5, 1, 0.5], [0.5, 1, 0.5], [0.5, 1, -0.5]], null, col);
  b.face([[-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5]], null, col);
  b.face([[-0.5, 0, 0.5], [0.5, 0, 0.5], [0.5, 1, 0.5], [-0.5, 1, 0.5]], null, col);
  b.face([[0.5, 0, -0.5], [-0.5, 0, -0.5], [-0.5, 1, -0.5], [0.5, 1, -0.5]], null, col);
  b.finalizeNormals();
  return new M.gl.Mesh(gl, {
    positions: new Float32Array(b.pos),
    normals: new Float32Array(b.nrm),
    uvs: new Float32Array(b.uv),
    indices: new Uint16Array(b.idx),
    instMatrices: matrices,
    instExtra: extra
  });
};

G.buildUnitBox = function (gl) {
  const b = new Builder();
  b.beginGroup(0);
  const col = [1, 1, 1, 1];
  // unit box: x,z in [-0.5,0.5], y in [0,1]
  b.face([[0.5, 0, -0.5], [0.5, 1, -0.5], [0.5, 1, 0.5], [0.5, 0, 0.5]], null, col);
  b.face([[-0.5, 0, 0.5], [-0.5, 1, 0.5], [-0.5, 1, -0.5], [-0.5, 0, -0.5]], null, col);
  b.face([[-0.5, 1, -0.5], [-0.5, 1, 0.5], [0.5, 1, 0.5], [0.5, 1, -0.5]], null, col);
  b.face([[-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5]], null, col);
  b.face([[-0.5, 0, 0.5], [0.5, 0, 0.5], [0.5, 1, 0.5], [-0.5, 1, 0.5]], null, col);
  b.face([[0.5, 0, -0.5], [-0.5, 0, -0.5], [-0.5, 1, -0.5], [0.5, 1, -0.5]], null, col);
  return b.build(gl);
};

// ---------------- CAR BODY ----------------
const STATIONS = [
  // z,     halfW, yBot, yTop, wTop
  [-2.26, 0.74, 0.30, 0.84, 0.60],   // tail
  [-2.05, 0.93, 0.16, 0.90, 0.76],   // rear fender
  [-1.60, 1.00, 0.13, 0.92, 0.86],
  [-1.10, 0.99, 0.13, 0.90, 0.88],   // rear deck (low, for contrast)
  [-0.62, 0.96, 0.13, 1.02, 0.86],   // cabin base / rear glass
  [-0.20, 0.94, 0.13, 1.24, 0.80],   // roof
  [ 0.35, 0.94, 0.13, 1.26, 0.79],   // roof peak
  [ 0.85, 0.95, 0.13, 1.14, 0.83],   // windshield top
  [ 1.25, 0.96, 0.13, 0.90, 0.87],   // cowl
  [ 1.60, 0.97, 0.13, 0.78, 0.89],   // hood
  [ 1.98, 0.93, 0.14, 0.68, 0.80],   // front fenders
  [ 2.26, 0.76, 0.24, 0.56, 0.58]    // nose
];
const RING = 14;

function sectionPoint(st, th) {
  const [z, wBot, yBot, yTop, wTop] = st;
  const yc = (yBot + yTop) / 2, h = (yTop - yBot) / 2;
  const sn = Math.sin(th), cs = Math.cos(th);
  const w = wBot + (wTop - wBot) * M.util.smoothstep(0, 0.4, Math.abs(sn));
  const nTop = 3.0, nBot = 5.5;
  const n = sn >= 0 ? nTop : nBot;
  const x = w * Math.sign(cs) * Math.pow(Math.abs(cs), 2 / n);
  const y = yc + Math.sign(sn) * h * Math.pow(Math.abs(sn), 2 / n);
  return [x, y, z];
}

function carMaterial(cx, cy, cz) {
  if (cy < 0.175) return 2;                                  // underbody / splitter / diffuser
  if (cz > 1.98 && cy > 0.30 && cy < 0.72) return 5;         // headlights
  if (cz < -2.14 && cy > 0.34) return 6;                     // tail light bar
  if (cy > 0.86) {
    if (cz > 0.40 && cz < 1.30 && cy > 0.90) return 1;       // windshield
    if (cz > -1.10 && cz < -0.58 && cy > 0.96) return 1;     // rear glass
    if (cz > -0.58 && cz < 0.42 && Math.abs(cx) > 0.44) return 1;  // side glass
    if (cz > -1.10 && cz <= -0.58 && Math.abs(cx) > 0.55 && cy > 0.90) return 1; // rear quarter glass
  }
  return 0;
}

G.buildCarBody = function (gl, paintRGB) {
  const b = new Builder();
  // baked color per material (id 0 paint is overridden by uPaint uniform)
  const MAT = [
    [1, 1, 1],              // 0 paint
    [0.035, 0.045, 0.065],  // 1 glass
    [0.055, 0.055, 0.065],  // 2 trim
    [0.05, 0.05, 0.055],    // 3 tire
    [0.78, 0.80, 0.84],     // 4 rim
    [0.85, 0.90, 1.0],      // 5 headlight
    [0.60, 0.03, 0.04]      // 6 taillight
  ];
  const paint = [paintRGB[0], paintRGB[1], paintRGB[2], 0]; // alpha = material id, set per face
  // build faces grouped by material id (so smoothing is per-material)
  const faces = [];
  const S = STATIONS;
  for (let i = 0; i < S.length - 1; i++) {
    for (let j = 0; j < RING; j++) {
      const j2 = (j + 1) % RING;
      const p00 = sectionPoint(S[i], j / RING * Math.PI * 2);
      const p01 = sectionPoint(S[i], j2 / RING * Math.PI * 2);
      const p10 = sectionPoint(S[i + 1], j / RING * Math.PI * 2);
      const p11 = sectionPoint(S[i + 1], j2 / RING * Math.PI * 2);
      const cx = (p00[0] + p01[0] + p10[0] + p11[0]) / 4;
      const cy = (p00[1] + p01[1] + p10[1] + p11[1]) / 4;
      const cz = (p00[2] + p01[2] + p10[2] + p11[2]) / 4;
      const id = carMaterial(cx, cy, cz);
      faces.push({ id, pts: [p00, p01, p11, p10] });  // wound outward (verified by audit)
    }
  }
  // caps
  const rear = S[0], front = S[S.length - 1];
  const cRear = [0, (rear[2] + rear[3]) / 2, rear[0]];
  const cFront = [0, (front[2] + front[3]) / 2, front[0]];
  for (let j = 0; j < RING; j++) {
    const j2 = (j + 1) % RING;
    const p0 = sectionPoint(rear, j / RING * Math.PI * 2);
    const p1 = sectionPoint(rear, j2 / RING * Math.PI * 2);
    const idR = carMaterial((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, rear[0] - 0.01);
    faces.push({ id: idR, pts: [cRear, p1, p0], tri: true });
    const q0 = sectionPoint(front, j / RING * Math.PI * 2);
    const q1 = sectionPoint(front, j2 / RING * Math.PI * 2);
    const idF = carMaterial((q0[0] + q1[0]) / 2, (q0[1] + q1[1]) / 2, front[0] + 0.01);
    faces.push({ id: idF, pts: [cFront, q0, q1], tri: true });
  }
  // accessories: mirrors, wing, exhausts, splitter
  const acc = [
    { id: 0, box: [-1.04, 0.86, 0.66, -0.94, 0.98, 0.94] },   // mirror L
    { id: 0, box: [ 0.94, 0.86, 0.66,  1.04, 0.98, 0.94] },   // mirror R
    { id: 2, box: [-0.98, 0.96, -2.12, -0.88, 1.14, -1.96] }, // wing upright L
    { id: 2, box: [ 0.88, 0.96, -2.12,  0.98, 1.14, -1.96] }, // wing upright R
    { id: 2, box: [-1.02, 1.12, -2.18,  1.02, 1.20, -1.92] }, // wing blade
    { id: 4, box: [-0.62, 0.24, -2.34, -0.34, 0.42, -2.22] }, // exhaust L
    { id: 4, box: [ 0.34, 0.24, -2.34,  0.62, 0.42, -2.22] }, // exhaust R
    { id: 2, box: [-0.86, 0.10, 2.02,  0.86, 0.19, 2.30] },   // front splitter
    { id: 2, box: [-0.80, 0.12, -2.36,  0.80, 0.24, -2.16] }  // rear diffuser
  ];
  for (const a of acc) faces.push({ id: a.id, box: a.box });

  // emit grouped
  let curId = -1;
  for (const f of faces) {
    if (f.id !== curId) { b.beginGroup(f.id); curId = f.id; }
    const base = MAT[f.id] || MAT[0];
    const col = [base[0], base[1], base[2], f.id];
    if (f.tri) {
      b.tri(f.pts[0], f.pts[1], f.pts[2], [0, 0], [1, 0], [1, 1], col);
    } else if (f.box) {
      G.box(b, f.box[0], f.box[1], f.box[2], f.box[3], f.box[4], f.box[5], col, [0, 0, 0, 0]);
    } else {
      b.face(f.pts, null, col);
    }
  }
  return b.build(gl);
};

// ---------------- WHEEL ----------------
G.buildWheel = function (gl) {
  const b = new Builder();
  const R = 0.345, W = 0.135, rimR = 0.235;
  const seg = 18;
  const tireCol = [0.055, 0.055, 0.06, 3];
  const rimCol = [0.75, 0.77, 0.8, 4];
  const darkCol = [0.08, 0.08, 0.09, 2];
  // tread (outer circumference, axis = X)
  b.beginGroup(0);
  for (let i = 0; i < seg; i++) {
    const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
    const y0 = Math.cos(a0) * R, z0 = Math.sin(a0) * R;
    const y1 = Math.cos(a1) * R, z1 = Math.sin(a1) * R;
    b.face([[-W, y0, z0], [-W, y1, z1], [W, y1, z1], [W, y0, z0]],
      [[i / seg, 0], [(i + 1) / seg, 0], [(i + 1) / seg, 1], [i / seg, 1]], tireCol);
    // sidewalls
    const sy0 = Math.cos(a0) * rimR, sz0 = Math.sin(a0) * rimR;
    const sy1 = Math.cos(a1) * rimR, sz1 = Math.sin(a1) * rimR;
    b.face([[W, y0, z0], [W, y1, z1], [W, sy1, sz1], [W, sy0, sz0]], null, tireCol);
    b.face([[-W, sy0, sz0], [-W, sy1, sz1], [-W, y1, z1], [-W, y0, z0]], null, tireCol);
  }
  // rim face (+X side): barrel + spokes
  b.beginGroup(1);
  for (let i = 0; i < seg; i++) {
    const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
    const spoke = (Math.floor(i / (seg / 5)) % 2) === 0;
    const rr = spoke ? rimR : rimR * 0.98;
    const x = spoke ? W - 0.02 : W - 0.075;
    const y0 = Math.cos(a0) * rr, z0 = Math.sin(a0) * rr;
    const y1 = Math.cos(a1) * rr, z1 = Math.sin(a1) * rr;
    // spoke face points inward slightly for depth
    const iR = 0.075;
    const iy0 = Math.cos(a0) * iR, iz0 = Math.sin(a0) * iR;
    const iy1 = Math.cos(a1) * iR, iz1 = Math.sin(a1) * iR;
    if (spoke) {
      b.face([[x, y0, z0], [x, y1, z1], [x, iy1, iz1], [x, iy0, iz0]], null, rimCol);
    } else {
      // recessed floor (faces +X, toward viewer through the spoke gaps)
      b.face([[x, y0, z0], [x, y1, z1], [x, iy1, iz1], [x, iy0, iz0]], null, darkCol);
    }
    // inner side (backing plate)
    b.face([[-(W - 0.05), iy0, iz0], [-(W - 0.05), iy1, iz1], [-(W - 0.05), y1, z1], [-(W - 0.05), y0, z0]], null, darkCol);
  }
  // hub cap
  b.beginGroup(2);
  const hubR = 0.075, hubX = W - 0.005;
  for (let i = 0; i < seg; i++) {
    const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
    b.tri([hubX, 0, 0],
      [hubX, Math.cos(a0) * hubR, Math.sin(a0) * hubR],
      [hubX, Math.cos(a1) * hubR, Math.sin(a1) * hubR],
      [0.5, 0.5], [0, 0], [1, 0], [0.85, 0.2, 0.25, 4]);
  }
  return b.build(gl);
};

// ---------------- BANNER TEXTURE (canvas) ----------------
G.makeBannerCanvas = function () {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#071026'); g.addColorStop(1, '#0c1c40');
  x.fillStyle = g; x.fillRect(0, 0, 1024, 256);
  // checkered strip
  for (let i = 0; i < 64; i++) {
    x.fillStyle = (i % 2) ? '#e8f4ff' : '#0a1428';
    x.fillRect(i * 16, 0, 16, 28);
    x.fillStyle = (i % 2) ? '#0a1428' : '#e8f4ff';
    x.fillRect(i * 16, 228, 16, 28);
  }
  x.fillStyle = '#39d7ff';
  x.font = '900 italic 120px "Segoe UI", Arial, sans-serif';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.shadowColor = '#1b7dff'; x.shadowBlur = 40;
  x.fillText('VELOCITY', 512, 132);
  x.shadowBlur = 0;
  x.fillStyle = '#ff3d8b';
  x.font = '800 30px Arial';
  x.fillText('NEON  CIRCUIT', 512, 206);
  return c;
};

})(window.MIMO);
