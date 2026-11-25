/* MIMO VELOCITY — pooled billboard particles (instanced, soft, atlas sprites) */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';

const TILE = {           // uv offsets into the 4x2 atlas (after flipY upload)
  smoke: [0.00, 0.50],
  glow:  [0.25, 0.50],
  spark: [0.50, 0.50],
  flame: [0.75, 0.50],
  streak:[0.00, 0.00],
  soft:  [0.25, 0.00]
};

function Particles(gl, atlasTex, max) {
  this.gl = gl;
  this.max = max || 1400;
  this.n = 0;
  this.atlas = atlasTex;
  // SoA pools
  const N = this.max;
  this.px = new Float32Array(N); this.py = new Float32Array(N); this.pz = new Float32Array(N);
  this.vx = new Float32Array(N); this.vy = new Float32Array(N); this.vz = new Float32Array(N);
  this.age = new Float32Array(N); this.life = new Float32Array(N);
  this.s0 = new Float32Array(N); this.s1 = new Float32Array(N);
  this.rot = new Float32Array(N); this.rotV = new Float32Array(N);
  this.cr = new Float32Array(N); this.cg = new Float32Array(N); this.cb = new Float32Array(N);
  this.a0 = new Float32Array(N);
  this.stretch = new Float32Array(N); this.soft = new Float32Array(N);
  this.additive = new Uint8Array(N);
  this.tile = new Uint8Array(N);       // index into TILE keys
  this.drag = new Float32Array(N);
  this.grav = new Float32Array(N);

  // instance attribute buffers (4 x vec4)
  this.cols = [
    new Float32Array(N * 4), new Float32Array(N * 4),
    new Float32Array(N * 4), new Float32Array(N * 4)
  ];
  const quad = new Float32Array([
    -1, -1, 1, -1, 1, 1,
    -1, -1, 1, 1, -1, 1
  ]);
  this.bufs = [];
  this.vao = gl.createVertexArray();
  gl.bindVertexArray(this.vao);
  const qb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, qb);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  for (let c = 0; c < 4; c++) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, this.cols[c], gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(5 + c);
    gl.vertexAttribPointer(5 + c, 4, gl.FLOAT, false, 16, 0);
    gl.vertexAttribDivisor(5 + c, 1);
    this.bufs.push(b);
  }
  gl.bindVertexArray(null);

  // counts
  this.smokeCount = 0;
  this.fxCount = 0;
}

const TKEYS = Object.keys(TILE);
const FIELDS = ['px','py','pz','vx','vy','vz','age','life','s0','s1','rot','rotV',
                'cr','cg','cb','a0','stretch','soft','drag','grav'];

Particles.prototype.spawn = function (o) {
  if (this.n >= this.max) return -1;
  const i = this.n++;
  this.px[i] = o.x; this.py[i] = o.y; this.pz[i] = o.z;
  this.vx[i] = o.vx || 0; this.vy[i] = o.vy || 0; this.vz[i] = o.vz || 0;
  this.age[i] = 0; this.life[i] = o.life;
  this.s0[i] = o.s0; this.s1[i] = o.s1 !== undefined ? o.s1 : o.s0;
  this.rot[i] = o.rot !== undefined ? o.rot : Math.random() * 6.283;
  this.rotV[i] = o.rotV || 0;
  this.cr[i] = o.r; this.cg[i] = o.g; this.cb[i] = o.b;
  this.a0[i] = o.a !== undefined ? o.a : 1;
  this.stretch[i] = o.stretch || 0;
  this.soft[i] = o.soft !== undefined ? o.soft : 1;
  this.additive[i] = o.add ? 1 : 0;
  this.tile[i] = TKEYS.indexOf(o.tile || 'smoke');
  this.drag[i] = o.drag !== undefined ? o.drag : 1.2;
  this.grav[i] = o.grav || 0;
  return i;
};

Particles.prototype.update = function (dt) {
  let w = 0;
  for (let i = 0; i < this.n; i++) {
    this.age[i] += dt;
    if (this.age[i] >= this.life[i]) continue;   // swap-remove
    if (w !== i) {
      for (let f = 0; f < FIELDS.length; f++) { const k = FIELDS[f]; this[k][w] = this[k][i]; }
      this.additive[w] = this.additive[i];
      this.tile[w] = this.tile[i];
    }
    const k = w;
    // integrate
    const dr = Math.exp(-this.drag[k] * dt);
    this.vx[k] *= dr; this.vz[k] *= dr;
    this.vy[k] = this.vy[k] * dr + this.grav[k] * dt;
    this.px[k] += this.vx[k] * dt;
    this.py[k] += this.vy[k] * dt;
    this.pz[k] += this.vz[k] * dt;
    this.rot[k] += this.rotV[k] * dt;
    w++;
  }
  this.n = w;
};

// pack into draw order: smoke batch first (alpha), fx batch second (additive)
Particles.prototype.pack = function () {
  const cols = this.cols;
  let si = 0, fi = 0;
  // counts computed after partition; partition in-place by additive flag
  let a = 0;
  while (a < this.n) {
    if (this.additive[a]) a++;
    else {
      // find a fx particle after a to swap
      let b = a + 1;
      while (b < this.n && !this.additive[b]) b++;
      if (b < this.n) {
        for (let f = 0; f < FIELDS.length; f++) {
          const k = FIELDS[f]; const t = this[k][a]; this[k][a] = this[k][b]; this[k][b] = t;
        }
        const t = this.additive[a]; this.additive[a] = this.additive[b]; this.additive[b] = t;
        const t2 = this.tile[a]; this.tile[a] = this.tile[b]; this.tile[b] = t2;
      } else break;
      a++;
    }
  }
  this.smokeCount = 0; this.fxCount = 0;
  for (let i = 0; i < this.n; i++) {
    const t = TKEYS[this.tile[i]] || 'smoke';
    const off = TILE[t];
    const u = this.age[i] / this.life[i];
    const size = this.s0[i] + (this.s1[i] - this.s0[i]) * u;
    let alpha = this.a0[i];
    // fade: quick in, smooth out
    const fin = Math.min(1, this.age[i] * 12);
    alpha *= fin * (1 - u * u * (3 - 2 * u));
    const o = i * 4;
    cols[0][o] = this.px[i]; cols[0][o + 1] = this.py[i]; cols[0][o + 2] = this.pz[i]; cols[0][o + 3] = size;
    cols[1][o] = this.rot[i]; cols[1][o + 1] = alpha; cols[1][o + 2] = off[0]; cols[1][o + 3] = off[1];
    cols[2][o] = this.cr[i]; cols[2][o + 1] = this.cg[i]; cols[2][o + 2] = this.cb[i]; cols[2][o + 3] = 1;
    cols[3][o] = this.stretch[i]; cols[3][o + 1] = 0; cols[3][o + 2] = this.soft[i]; cols[3][o + 3] = 0;
    if (this.additive[i]) this.fxCount++; else this.smokeCount++;
  }
  const gl = this.gl;
  gl.bindVertexArray(this.vao);
  for (let c = 0; c < 4; c++) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufs[c]);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, cols[c]);
  }
  gl.bindVertexArray(null);
};

Particles.prototype.drawBatch = function (count) {
  if (count <= 0) return;
  const gl = this.gl;
  gl.bindVertexArray(this.vao);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
  gl.bindVertexArray(null);
};

// ---------- emitters ----------
Particles.prototype.tireSmoke = function (x, y, z, vx, vy, vz, amount) {
  const n = Math.random() < amount ? 1 : 0;
  for (let i = 0; i < n; i++) {
    this.spawn({
      x, y: y + 0.06 + Math.random() * 0.1, z,
      vx: vx * 0.25 + (Math.random() - .5) * 1.6,
      vy: 0.4 + Math.random() * 0.9,
      vz: vz * 0.25 + (Math.random() - .5) * 1.6,
      life: 0.7 + Math.random() * 0.7,
      s0: 0.5 + Math.random() * 0.4, s1: 3.2 + Math.random() * 1.8,
      r: 0.72, g: 0.75, b: 0.8, a: 0.34,
      rotV: (Math.random() - .5) * 2.4,
      drag: 1.6, tile: 'smoke', soft: 1
    });
  }
};

Particles.prototype.nitroFlame = function (x, y, z, dx, dy, dz) {
  this.spawn({
    x, y, z,
    vx: dx * 16 + (Math.random() - .5) * 2,
    vy: dy * 16 + (Math.random() - .5) * 1,
    vz: dz * 16 + (Math.random() - .5) * 2,
    life: 0.16 + Math.random() * 0.12,
    s0: 0.42, s1: 0.1,
    r: 0.45, g: 0.75, b: 1.0, a: 0.9,
    rotV: 0, drag: 5, tile: 'flame', add: 1, soft: 0, stretch: 0.9
  });
};

Particles.prototype.sparks = function (x, y, z, nx, nz, count) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 3 + Math.random() * 9;
    this.spawn({
      x, y: y + Math.random() * 0.4, z,
      vx: nx * sp * 0.6 + Math.cos(a) * sp * 0.7,
      vy: 1.5 + Math.random() * 4,
      vz: nz * sp * 0.6 + Math.sin(a) * sp * 0.7,
      life: 0.35 + Math.random() * 0.5,
      s0: 0.13, s1: 0.03,
      r: 1.0, g: 0.82, b: 0.4, a: 1,
      grav: -14, drag: 0.6, tile: 'spark', add: 1, soft: 0, stretch: 1.6
    });
  }
};

Particles.prototype.exhaustGlow = function (x, y, z, dx, dz, on) {
  if (!on || Math.random() > 0.55) return;
  this.spawn({
    x, y, z,
    vx: dx * 2, vy: 0.3, vz: dz * 2,
    life: 0.18, s0: 0.3, s1: 0.6,
    r: 1.0, g: 0.5, b: 0.15, a: 0.5,
    drag: 4, tile: 'glow', add: 1, soft: 0
  });
};

Particles.prototype.boostTrail = function (x, y, z, vx, vz) {
  if (Math.random() > 0.4) return;
  this.spawn({
    x, y, z,
    vx: vx * 0.4, vy: 0.5, vz: vz * 0.4,
    life: 0.3, s0: 0.6, s1: 0.15,
    r: 0.3, g: 0.7, b: 1.0, a: 0.7,
    drag: 3, tile: 'streak', add: 1, soft: 0, stretch: 2.4
  });
};

Particles.prototype.crashBurst = function (x, y, z, n) {
  this.sparks(x, y, z, 0, 0, n || 18);
  for (let i = 0; i < 6; i++) {
    this.spawn({
      x, y: y + 0.3, z,
      vx: (Math.random() - .5) * 6, vy: 1 + Math.random() * 3, vz: (Math.random() - .5) * 6,
      life: 0.5, s0: 0.5, s1: 2.4,
      r: 0.9, g: 0.7, b: 0.4, a: 0.5,
      drag: 2, tile: 'smoke', soft: 1
    });
  }
};

M.Particles = Particles;

})(window.MIMO);
