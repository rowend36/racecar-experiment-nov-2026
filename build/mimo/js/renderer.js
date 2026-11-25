/* MIMO VELOCITY — renderer: forward+ pipeline with CSM shadows, IBL, SSR, bloom, post */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';
const M4 = M.mat4;

function Renderer(gl, canvas) {
  this.gl = gl;
  this.canvas = canvas;
  this.time = 0;

  const S = M.shaders;
  const P = M.gl.Program;
  const mk = (name, vs, fs) => { try { return new P(gl, vs, fs, name); } catch (e) { console.error(e); throw e; } };

  this.progs = {
    sky: mk('sky', S.skyVS, S.skyFS),
    irr: mk('irr', S.postVS, S.irradianceFS),
    pbr: mk('pbr', S.pbrVS(false), S.pbrFS),
    pbrInst: mk('pbrInst', S.pbrVS(true), S.pbrFS),
    road: mk('road', S.roadVS, S.roadFS),
    car: mk('car', S.carVS, S.carFS),
    building: mk('building', S.buildingVS, S.buildingFS),
    depth: mk('depth', S.depthVS(false), S.depthFS),
    depthInst: mk('depthInst', S.depthVS(true), S.depthFS),
    particle: mk('particle', S.particleVS, S.particleFS),
    pool: mk('pool', S.poolVS, S.poolFS),
    bloomBright: mk('bloomBright', S.postVS, S.bloomBrightFS),
    bloomDown: mk('bloomDown', S.postVS, S.bloomDownFS),
    bloomUp: mk('bloomUp', S.postVS, S.bloomUpFS),
    streak: mk('streak', S.postVS, S.streakFS),
    ssr: mk('ssr', S.postVS, S.ssrFS),
    motion: mk('motion', S.postVS, S.motionBlurFS),
    composite: mk('composite', S.postVS, S.compositeFS),
    fxaa: mk('fxaa', S.postVS, S.fxaaFS),
    copy: mk('copy', S.postVS, S.copyFS)
  };

  // ---- IBL environment ----
  this.env = M.sky.build(gl, this.progs.sky, this.progs.irr);

  // ---- MRT scene FBO ----
  this.scene = this.makeSceneFBO(4, 4);
  this.particlesFBO = this.makeSceneFBO(4, 4);   // color + depth (for soft particles)
  this.motionFBO = this.makeHDR(4, 4);
  this.ldr = new M.gl.Framebuffer(gl, 4, 4, {});

  // cascaded shadow maps
  this.shadow0 = new M.gl.ShadowFBO(gl, 2048);
  this.shadow1 = new M.gl.ShadowFBO(gl, 1024);

  // bloom chain
  this.bloom = [];
  for (let i = 0; i < 6; i++) this.bloom.push(new M.gl.Framebuffer(gl, 4, 4, { float: true }));
  this.streakA = new M.gl.Framebuffer(gl, 4, 4, { float: true });
  this.streakB = new M.gl.Framebuffer(gl, 4, 4, { float: true });
  this.ssrFBO = new M.gl.Framebuffer(gl, 4, 4, { float: true });

  // reusable matrices
  this._m = { a: M4.make(), b: M4.make(), c: M4.make(), d: M4.make(), e: M4.make() };
  this._spotPos = new Float32Array(6 * 4);
  this._spotDir = new Float32Array(6 * 4);
  this._spotIn = new Float32Array(6);
  this._spotCol = new Float32Array(6 * 3);
  this._nrm3 = new Float32Array(9);

  this.width = 0; this.height = 0;
}

Renderer.prototype.makeSceneFBO = function (w, h) {
  const gl = this.gl;
  const o = { fbo: gl.createFramebuffer() };
  const mk = (internal, format, type) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  o.color = mk(gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
  o.data = mk(gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
  o.depth = mk(gl.DEPTH_COMPONENT24, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  o.resize = (nw, nh) => {
    gl.bindTexture(gl.TEXTURE_2D, o.color);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, nw, nh, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.bindTexture(gl.TEXTURE_2D, o.data);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, nw, nh, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.bindTexture(gl.TEXTURE_2D, o.depth);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, nw, nh, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
    o.w = nw; o.h = nh;
  };
  gl.bindFramebuffer(gl.FRAMEBUFFER, o.fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, o.color, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, o.data, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, o.depth, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  o.resize(w, h);
  return o;
};

Renderer.prototype.makeHDR = function (w, h) {
  const gl = this.gl;
  const o = { fbo: gl.createFramebuffer() };
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  o.color = t;
  gl.bindFramebuffer(gl.FRAMEBUFFER, o.fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  o.resize = (nw, nh) => {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, nw, nh, 0, gl.RGBA, gl.HALF_FLOAT, null);
    o.w = nw; o.h = nh;
  };
  o.resize(w, h);
  return o;
};

Renderer.prototype.resize = function (w, h) {
  w = Math.max(2, Math.round(w));
  h = Math.max(2, Math.round(h));
  if (w === this.width && h === this.height) return;
  this.width = w; this.height = h;
  this.scene.resize(w, h);
  this.particlesFBO.resize(w, h);
  this.motionFBO.resize(w, h);
  this.ldr.resize(w, h);
  this.ssrFBO.resize(Math.max(2, w >> 1), Math.max(2, h >> 1));
  let bw = Math.max(2, w >> 1), bh = Math.max(2, h >> 1);
  for (let i = 0; i < 6; i++) {
    this.bloom[i].resize(Math.max(2, bw), Math.max(2, bh));
    bw >>= 1; bh >>= 1;
  }
  this.streakA.resize(Math.max(2, w >> 2), Math.max(2, h >> 2));
  this.streakB.resize(Math.max(2, w >> 2), Math.max(2, h >> 2));
};

// ---------------- shadow cascades ----------------
const _xc = [0, 0, 0], _yc = [0, 0, 0], _zc = [0, 0, 0];
function norm3(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; v[0] /= l; v[1] /= l; v[2] /= l; return v; }
function cross3(o, a, b) {
  o[0] = a[1] * b[2] - a[2] * b[1]; o[1] = a[2] * b[0] - a[0] * b[2]; o[2] = a[0] * b[1] - a[1] * b[0];
  return o;
}

Renderer.prototype.fitCascade = function (out, camPos, fwd, near, far, size, L) {
  const t = (near + far) * 0.5;
  const radius = far * 0.62;
  const cx = camPos.x + fwd.x * t, cy = camPos.y + fwd.y * t, cz = camPos.z + fwd.z * t;
  // light basis: z = toward sun
  _zc[0] = L[0]; _zc[1] = L[1]; _zc[2] = L[2];
  const up = Math.abs(_zc[1]) > 0.95 ? [1, 0, 0] : [0, 1, 0];
  norm3(cross3(_xc, up, _zc));
  cross3(_yc, _zc, _xc);
  const texel = (2 * radius) / size;
  const snap = (v) => Math.round(v / texel) * texel;
  const dotx = _xc[0] * cx + _xc[1] * cy + _xc[2] * cz;
  const doty = _yc[0] * cx + _yc[1] * cy + _yc[2] * cz;
  const dotz = _zc[0] * cx + _zc[1] * cy + _zc[2] * cz;
  const d = radius + 80;
  // view matrix rows = basis, translation snapped
  out[0] = _xc[0]; out[1] = _yc[0]; out[2] = _zc[0]; out[3] = 0;
  out[4] = _xc[1]; out[5] = _yc[1]; out[6] = _zc[1]; out[7] = 0;
  out[8] = _xc[2]; out[9] = _yc[2]; out[10] = _zc[2]; out[11] = 0;
  out[12] = -snap(dotx); out[13] = -snap(doty); out[14] = -(dotz + d); out[15] = 1;
  // ortho projection
  const o = this._m.a;
  M4.ortho(o, -radius, radius, -radius, radius, 1, 2 * d);
  M4.mul(out, o, out);
  return out;
};

// ---------------- scene uniform helper ----------------
Renderer.prototype.setSceneUniforms = function (prog, cam, state) {
  const gl = this.gl;
  prog.use();
  prog.m4('uProj', cam.proj);
  prog.m4('uView', cam.view);
  prog.v3('uCamPos', cam.pos.x, cam.pos.y, cam.pos.z);
  const E = M.env;
  prog.v3('uSunDir', E.sunDir[0], E.sunDir[1], E.sunDir[2]);
  prog.v3('uSunColor', E.sunColor[0], E.sunColor[1], E.sunColor[2]);
  prog.v3('uAmbSky', E.ambSky[0], E.ambSky[1], E.ambSky[2]);
  prog.v3('uAmbGround', E.ambGround[0], E.ambGround[1], E.ambGround[2]);
  prog.v3('uFogColor', E.fogColor[0], E.fogColor[1], E.fogColor[2]);
  prog.f('uFogDensity', E.fogDensity);
  prog.m4('uShadowMat0', this._shadowMat0);
  prog.m4('uShadowMat1', this._shadowMat1);
  prog.v2('uShadowTexel', 1 / this.shadow0.size, 1 / this.shadow0.size);
  prog.f('uCascadeDist', 50);
  prog.cube('uEnv', 0, this.env.env);
  prog.cube('uIrr', 1, this.env.irr);
  prog.f('uEnvMaxMip', this.env.maxMip);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, this.shadow0.depth);
  prog.i('uShadow0', 2);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, this.shadow1.depth);
  prog.i('uShadow1', 3);
  // spots
  prog.i('uSpotCount', state.spotCount || 0);
  if (state.spotCount) {
    prog.v4a('uSpotPos', this._spotPos);
    prog.v4a('uSpotDir', this._spotDir);
    prog.fv('uSpotIn', this._spotIn);
    prog.v3a('uSpotCol', this._spotCol);
  }
};

// gather headlight spotlights (player + nearest rivals)
Renderer.prototype.gatherSpots = function (cars, player) {
  const list = [player];
  for (const c of cars) {
    if (c === player) continue;
    const d = Math.hypot(c.pos.x - player.pos.x, c.pos.z - player.pos.z);
    if (d < 90) list.push(c);
  }
  let n = 0;
  for (const c of list) {
    if (n >= 3) break;
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw);
    const rx = -fz, rz = fx;
    for (const side of [-0.62, 0.62]) {
      if (n >= 6) break;
      const o = n * 4;
      this._spotPos[o] = c.pos.x + fx * 2.05 + rx * side;
      this._spotPos[o + 1] = c.pos.y + 0.52;
      this._spotPos[o + 2] = c.pos.z + fz * 2.05 + rz * side;
      this._spotPos[o + 3] = 34; // range
      const dx = fx, dy = -0.10, dz = fz;
      const l = Math.hypot(dx, dy, dz);
      this._spotDir[o] = dx / l; this._spotDir[o + 1] = dy / l; this._spotDir[o + 2] = dz / l;
      this._spotDir[o + 3] = 0.912; // cosOuter ~24°
      this._spotIn[n] = 0.966;      // cosInner ~15°
      const co = n * 3;
      this._spotCol[co] = 0.95; this._spotCol[co + 1] = 0.87; this._spotCol[co + 2] = 0.7;
      n++;
    }
  }
  return n;
};

// ---------------- model matrix helpers ----------------
Renderer.prototype.carModel = function (out, car) {
  // T * Ryaw * Rz(roll) * Rx(pitch) with bounce
  const q = { x: 0, y: 0, z: 0, w: 1 };
  M.quat.fromYawPitchRoll(q, car.yaw, car.pitch, car.roll);
  const s = { x: 1, y: 1, z: 1 };
  const v = { x: car.pos.x, y: car.pos.y + car.bounce, z: car.pos.z };
  M4.fromRotationTranslationScale(out, q, v, s);
  return out;
};

// ---------------- main render ----------------
Renderer.prototype.render = function (scene, state) {
  const gl = this.gl;
  const cam = state.cam;
  this.time = state.time;

  // ---------- shadow passes ----------
  const fwd = cam.fwd;
  const L = M.env.sunDir;
  this._shadowMat0 = this._shadowMat0 || M4.make();
  this._shadowMat1 = this._shadowMat1 || M4.make();
  this.fitCascade(this._shadowMat0, cam.pos, fwd, 0.5, 50, this.shadow0.size, L);
  this.fitCascade(this._shadowMat1, cam.pos, fwd, 50, 180, this.shadow1.size, L);

  const drawCasters = (lightVP) => {
    const d = this.progs.depth;
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(2.0, 4.0);
    const id = M4.make();
    M4.identity(id);
    d.use();
    d.m4('uLightVP', lightVP);
    d.m4('uModel', id);
    for (const m of scene.casters) {
      if (m.inst) continue;
      d.m4('uModel', id);
      m.mesh.draw();
    }
    // cars
    for (const car of state.cars) {
      if (car.__noDraw) continue;
      d.m4('uModel', this.carModel(this._m.b, car));
      scene.carBody.draw();
      this.drawWheels(d, scene, car, 'uModel');
    }
    // instanced casters (buildings)
    const di = this.progs.depthInst;
    di.use();
    di.m4('uLightVP', lightVP);
    for (const m of scene.casters) {
      if (m.inst) m.mesh.drawInstanced();
    }
    gl.disable(gl.POLYGON_OFFSET_FILL);
  };

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadow0.fbo);
  gl.viewport(0, 0, this.shadow0.size, this.shadow0.size);
  gl.clear(gl.DEPTH_BUFFER_BIT);
  drawCasters(this._shadowMat0);

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadow1.fbo);
  gl.viewport(0, 0, this.shadow1.size, this.shadow1.size);
  gl.clear(gl.DEPTH_BUFFER_BIT);
  drawCasters(this._shadowMat1);

  // ---------- scene pass (MRT) ----------
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene.fbo);
  gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
  gl.viewport(0, 0, this.scene.w, this.scene.h);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.disable(gl.BLEND);
  gl.depthMask(true);
  gl.enable(gl.DEPTH_TEST);

  // sky first (no depth write)
  {
    const p = this.progs.sky;
    this.setSceneUniforms(p, cam, state);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    p.i('uFace', -1).f('uTime', state.time).f('uNight', M.env.night);
    const invVP = this._m.c;
    M4.mul(invVP, cam.proj, cam.view);
    M4.invert(invVP, invVP);
    p.m4('uInvViewProj', invVP);
    M.gl.getFullscreen(gl).draw();
    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
  }

  const P = this.progs;
  // ground
  {
    const p = P.pbr;
    this.setSceneUniforms(p, cam, state);
    p.m4('uModel', this._mIdentity || (this._mIdentity = M4.identity(M4.make())));
    p.m3('uNormalMat', this._nrm3Identity || (this._nrm3Identity = new Float32Array([1,0,0,0,1,0,0,0,1])));
    p.f('uUseTex', 1).tex('uAlbedo', 4, scene.tex.concrete).tex('uNormalTex', 5, scene.tex.asphaltNormal);
    p.v3('uTint', 0.34, 0.37, 0.44);
    p.f('uMetal', 0.0).f('uRough', 0.92).f('uEmissive', 0.0);
    scene.ground.draw();
  }
  // kerbs (textured)
  {
    const p = P.pbr;
    this.setSceneUniforms(p, cam, state);
    p.m4('uModel', this._mIdentity);
    p.m3('uNormalMat', this._nrm3Identity);
    p.f('uUseTex', 1).tex('uAlbedo', 4, scene.tex.kerb).tex('uNormalTex', 5, scene.tex.asphaltNormal);
    p.v3('uTint', 1, 1, 1);
    p.f('uMetal', 0.0).f('uRough', 0.55).f('uEmissive', 0.0);
    scene.kerbs.draw();
  }
  // guardrail (metal)
  {
    const p = P.pbr;
    this.setSceneUniforms(p, cam, state);
    p.m4('uModel', this._mIdentity);
    p.m3('uNormalMat', this._nrm3Identity);
    p.f('uUseTex', 0).tex('uAlbedo', 4, scene.tex.concrete).tex('uNormalTex', 5, scene.tex.asphaltNormal);
    p.v3('uTint', 1, 1, 1);
    p.f('uMetal', 0.92).f('uRough', 0.38).f('uEmissive', 0.0);
    scene.rail.draw();
  }
  // road
  {
    const p = P.road;
    this.setSceneUniforms(p, cam, state);
    p.tex('uAsphalt', 4, scene.tex.asphaltAlbedo);
    p.tex('uAsphaltN', 5, scene.tex.asphaltNormal);
    p.f('uHalfWidth', scene.halfWidth);
    p.f('uWetness', state.wetness);
    p.f('uTime', state.time);
    scene.road.draw();
  }
  // banner (textured)
  {
    const p = P.pbr;
    this.setSceneUniforms(p, cam, state);
    p.m4('uModel', this._mIdentity);
    p.m3('uNormalMat', this._nrm3Identity);
    p.f('uUseTex', 1).tex('uAlbedo', 4, scene.bannerTex).tex('uNormalTex', 5, scene.tex.asphaltNormal);
    p.v3('uTint', 1, 1, 1);
    p.f('uMetal', 0.1).f('uRough', 0.5).f('uEmissive', 0.55);
    scene.gate.banner.draw();
  }
  // gate pillars / cones / lamps — material-id program
  const drawIdMesh = (mesh, flake) => {
    const p = P.car;
    this.setSceneUniforms(p, cam, state);
    p.m4('uModel', this._mIdentity);
    p.m3('uNormalMat', this._nrm3Identity);
    p.f('uBrake', 0).f('uHeadlights', 1).f('uFlake', flake || 0).f('uTime', state.time);
    p.v3('uPaint', 1, 1, 1);
    mesh.draw();
  };
  drawIdMesh(scene.gate.pillars);
  drawIdMesh(scene.cones);
  drawIdMesh(scene.lamps);
  // buildings (instanced)
  {
    const p = P.building;
    this.setSceneUniforms(p, cam, state);
    p.f('uTime', state.time);
    scene.buildings.drawInstanced(scene.buildingCount);
  }
  // cars
  for (const car of state.cars) {
    if (car.__noDraw) continue;
    const p = P.car;
    this.setSceneUniforms(p, cam, state);
    p.m4('uModel', this.carModel(this._m.b, car));
    p.m3('uNormalMat', this._nrm3FromMat(this._m.b));
    p.f('uBrake', car.brakeLight);
    p.f('uHeadlights', car.headlights);
    p.f('uFlake', car.def.flake);
    p.f('uTime', state.time);
    const pc = car.def.paint;
    p.v3('uPaint', pc[0], pc[1], pc[2]);
    scene.carBody.draw();
    this.drawWheels(p, scene, car, 'uModel');
  }

  // ---------- light pools (additive) ----------
  {
    const p = P.pool;
    this.setSceneUniforms(p, cam, state);
    p.f('uIntensity', 0.5);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.depthMask(false);
    scene.pools.draw();
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }

  // ---------- SSR (reads intact G-buffer) ----------
  if (state.quality.ssr) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssrFBO.fbo);
    gl.viewport(0, 0, this.ssrFBO.w, this.ssrFBO.h);
    const p = P.ssr;
    p.use();
    p.tex('uScene', 0, this.scene.color);
    p.tex('uDepth', 1, this.scene.depth);
    p.tex('uNormalRough', 2, this.scene.data);
    M4.invert(this._m.d, cam.proj);
    p.m4('uInvProj', this._m.d);
    p.m4('uProj', cam.proj);
    p.m4('uView', cam.view);
    p.v2('uResolution', this.ssrFBO.w, this.ssrFBO.h);
    p.f('uNear', cam.near); p.f('uFar', cam.far);
    p.v3('uCamPos', cam.pos.x, cam.pos.y, cam.pos.z);
    p.f('uIntensity', state.quality.ssrStrength);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    M.gl.getFullscreen(gl).draw();
    // additive merge into scene (color attachment only)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene.fbo);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    gl.viewport(0, 0, this.scene.w, this.scene.h);
    p2copy(this, this.ssrFBO.color, gl.ONE, gl.ONE);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
  }

  // ---------- soft particles into particle FBO ----------
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.particlesFBO.fbo);
  gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
  gl.viewport(0, 0, this.particlesFBO.w, this.particlesFBO.h);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // blit scene depth for soft particles
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.scene.fbo);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.particlesFBO.fbo);
  gl.blitFramebuffer(0, 0, this.scene.w, this.scene.h, 0, 0, this.particlesFBO.w, this.particlesFBO.h,
    gl.DEPTH_BUFFER_BIT, gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.particlesFBO.fbo);
  if (state.particles && state.particles.n > 0) {
    state.particles.pack();
    const p = P.particle;
    p.use();
    p.m4('uProj', cam.proj);
    p.m4('uView', cam.view);
    p.v2('uTileScale', 0.25, 0.5);
    p.tex('uSprite', 0, state.particles.atlas);
    p.tex('uSceneDepth', 1, this.scene.depth);
    p.v2('uResolution', this.scene.w, this.scene.h);
    p.f('uNear', cam.near); p.f('uFar', cam.far);
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    gl.depthFunc(gl.LEQUAL);
    // smoke (premultiplied over)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    state.particles.drawBatch(state.particles.smokeCount);
    // fx (additive)
    gl.blendFunc(gl.ONE, gl.ONE);
    state.particles.drawBatch(state.particles.fxCount);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
  // merge particles into scene (premultiplied, color attachment only)
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene.fbo);
  gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
  gl.viewport(0, 0, this.scene.w, this.scene.h);
  {
    const p = P.copy;
    p.use();
    p.tex('uTex', 0, this.particlesFBO.color);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.disable(gl.DEPTH_TEST);
    M.gl.getFullscreen(gl).draw();
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
  gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

  // ---------- motion blur ----------
  {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.motionFBO.fbo);
    gl.viewport(0, 0, this.motionFBO.w, this.motionFBO.h);
    const p = P.motion;
    p.use();
    p.tex('uTex', 0, this.scene.color);
    p.v2('uCenter', 0.5, 0.5);
    p.f('uStrength', state.motionStrength || 0);
    gl.disable(gl.DEPTH_TEST);
    M.gl.getFullscreen(gl).draw();
    gl.enable(gl.DEPTH_TEST);
  }

  // ---------- bloom ----------
  const srcTex = this.motionFBO.color;
  if (state.quality.bloom) {
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    // bright pass -> bloom[0]
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloom[0].fbo);
    gl.viewport(0, 0, this.bloom[0].w, this.bloom[0].h);
    const pb = P.bloomBright;
    pb.use();
    pb.tex('uTex', 0, srcTex);
    pb.f('uThreshold', 1.3);
    pb.f('uKnee', 0.7);
    M.gl.getFullscreen(gl).draw();
    // downsample
    for (let i = 1; i < 6; i++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloom[i].fbo);
      gl.viewport(0, 0, this.bloom[i].w, this.bloom[i].h);
      const pd = P.bloomDown;
      pd.use();
      pd.tex('uTex', 0, this.bloom[i - 1].color);
      pd.v2('uTexel', 1 / this.bloom[i - 1].w, 1 / this.bloom[i - 1].h);
      M.gl.getFullscreen(gl).draw();
    }
    // upsample accumulate
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    for (let i = 4; i >= 0; i--) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloom[i].fbo);
      gl.viewport(0, 0, this.bloom[i].w, this.bloom[i].h);
      const pu = P.bloomUp;
      pu.use();
      pu.tex('uTex', 0, this.bloom[i + 1].color);
      pu.v2('uTexel', 1 / this.bloom[i + 1].w, 1 / this.bloom[i + 1].h);
      pu.f('uRadius', 1.4);
      M.gl.getFullscreen(gl).draw();
    }
    gl.disable(gl.BLEND);

    // anamorphic streak (horizontal, twice)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.streakA.fbo);
    gl.viewport(0, 0, this.streakA.w, this.streakA.h);
    const ps = P.streak;
    ps.use();
    ps.tex('uTex', 0, this.bloom[1].color);
    ps.v2('uDir', 1.6 / this.streakA.w, 0);
    ps.f('uAtt', 1.0);
    M.gl.getFullscreen(gl).draw();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.streakB.fbo);
    gl.viewport(0, 0, this.streakB.w, this.streakB.h);
    ps.use();
    ps.tex('uTex', 0, this.streakA.color);
    ps.v2('uDir', 5.0 / this.streakA.w, 0);
    ps.f('uAtt', 0.75);
    M.gl.getFullscreen(gl).draw();
    gl.enable(gl.DEPTH_TEST);
  }

  // ---------- composite ----------
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.ldr.fbo);
  gl.viewport(0, 0, this.ldr.w, this.ldr.h);
  {
    const p = P.composite;
    p.use();
    p.tex('uScene', 0, srcTex);
    p.tex('uBloom', 1, this.bloom[0].color);
    p.tex('uStreak', 2, this.streakB.color);
    p.v2('uResolution', this.ldr.w, this.ldr.h);
    p.f('uTime', state.time);
    p.f('uBloomIntensity', state.quality.bloom ? 0.85 : 0);
    p.f('uExposure', M.env.exposure);
    p.f('uSpeed', state.speed01 || 0);
    p.f('uNitro', state.nitro01 || 0);
    p.f('uVignette', 0.42);
    p.f('uGrain', 0.028);
    p.f('uAberration', 0.0016);
    p.v3('uGradeLift', 0.004, 0.006, 0.014);
    p.v3('uGradeGain', 1.03, 1.01, 1.05);
    p.f('uSaturation', 1.08);
    gl.disable(gl.DEPTH_TEST);
    M.gl.getFullscreen(gl).draw();
  }

  // ---------- FXAA -> screen ----------
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  {
    const p = P.fxaa;
    p.use();
    p.tex('uTex', 0, this.ldr.color);
    p.v2('uTexel', 1 / this.ldr.w, 1 / this.ldr.h);
    M.gl.getFullscreen(gl).draw();
  }
  gl.enable(gl.DEPTH_TEST);
};

function p2copy(R, tex, srcFactor, dstFactor) {
  const gl = R.gl;
  const p = R.progs.copy;
  p.use();
  p.tex('uTex', 0, tex);
  gl.enable(gl.BLEND);
  gl.blendFunc(srcFactor, dstFactor);
  gl.depthMask(false);
  gl.disable(gl.DEPTH_TEST);
  M.gl.getFullscreen(gl).draw();
  gl.enable(gl.DEPTH_TEST);
  gl.depthMask(true);
  gl.disable(gl.BLEND);
}

Renderer.prototype._nrm3FromMat = function (m) {
  const n = this._nrm3;
  n[0] = m[0]; n[1] = m[1]; n[2] = m[2];
  n[3] = m[4]; n[4] = m[5]; n[5] = m[6];
  n[6] = m[8]; n[7] = m[9]; n[8] = m[10];
  return n;
};

// wheel transforms (uses program with uModel; sets model per wheel)
const WHEEL_POS = [
  [-0.94, 0.345, 1.42, 1],   // front-left  (local -X = left? see note: local +X = left)
  [ 0.94, 0.345, 1.42, 1],
  [-0.94, 0.345, -1.45, 0],
  [ 0.94, 0.345, -1.45, 0]
];
Renderer.prototype.drawWheels = function (prog, scene, car, modelUniform) {
  const gl = this.gl;
  const base = this._m.c;
  // base car model already set by caller in _m.b — rebuild per wheel
  const tmp = this._m.e;
  for (let i = 0; i < 4; i++) {
    const W = WHEEL_POS[i];
    const front = W[3] === 1;
    const q = { x: 0, y: 0, z: 0, w: 1 };
    const steerA = front ? car.wheelSteer : 0;
    // yaw = car.yaw + steer, spin about local X, left wheels flip 180°
    const flip = W[0] < 0 ? Math.PI : 0;
    M.quat.fromYawPitchRoll(q, car.yaw + steerA, car.wheelSpin, flip);
    // position offset rotated by car yaw
    const c = Math.cos(car.yaw), s = Math.sin(car.yaw);
    const lx = W[0], lz = W[2];
    const wx = car.pos.x + lx * c + lz * s;
    const wz = car.pos.z - lx * s + lz * c;
    const wy = car.pos.y + W[1] - 0.02;
    M4.fromRotationTranslationScale(tmp, q, { x: wx, y: wy, z: wz }, { x: 1, y: 1, z: 1 });
    prog.m4(modelUniform, tmp);
    if (prog._u.has('uNormalMat')) prog.m3('uNormalMat', this._nrm3FromMat(tmp));
    scene.carWheel.draw();
  }
  void base; void gl;
};

M.Renderer = Renderer;

})(window.MIMO);
