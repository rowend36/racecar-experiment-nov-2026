/* MIMO VELOCITY — game orchestration: states, camera, race logic */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';
const U = M.util, M4 = M.mat4;

const QUALITY = {
  ultra:  { ssr: true,  ssrStrength: 0.75, bloom: true, res: 1.0 },
  high:   { ssr: true,  ssrStrength: 0.55, bloom: true, res: 0.92 },
  medium: { ssr: false, ssrStrength: 0,    bloom: true, res: 0.8 },
  low:    { ssr: false, ssrStrength: 0,    bloom: true, res: 0.66 }
};

function Game(gl, canvas) {
  this.gl = gl;
  this.canvas = canvas;
  this.state = 'loading';
  this.time = 0;
  this.lapTotal = 3;
  this.selectedCar = 0;
  this.qualityName = 'high';
  this.userRes = 1.0;
  this.fov = 72;
  this.renderScale = 1;
  this.camMode = 0; // 0 chase, 1 far, 2 hood
  this.shake = 0;
  this.acc = 0;
  this.frameMs = 16;
  this.resCooldown = 0;

  this.cam = {
    proj: M4.make(), view: M4.make(),
    pos: { x: 0, y: 5, z: -10 }, fwd: { x: 0, y: 0, z: 1 },
    near: 0.25, far: 1500, fov: 72
  };
  this.menuAngle = 0;
  this.bestLap = null;
  this.lapStart = 0;
  this.countdown = 0;
  this.lastBeep = -1;
  this.finishDelay = 0;
  this.cars = [];
}

// ---------------- scene construction ----------------
Game.prototype.buildScene = function () {
  const gl = this.gl;
  const G = M.geo;
  const track = new M.Track();
  track.buildProps();
  this.track = track;

  const tex = M.textures.build(gl);
  this.tex = tex;

  const S = track.spline.samples;
  const hw = track.halfWidth;

  const scene = {
    halfWidth: hw,
    tex,
    road: G.buildRoad(gl, S, hw, 1.6),
    kerbs: G.buildKerbs(gl, S, hw),
    rail: G.buildGuardrail(gl, S, hw),
    terrain: G.buildTerrain(gl, S, hw),
    ground: G.buildGround(gl, 1800),
    gate: G.buildStartGate(gl, hw),
    cones: G.buildCones(gl, track.conePos),
    lamps: G.buildLamps(gl, track.lampPos),
    pools: G.buildLightPools(gl, track.poolPos, 8, [1.0, 0.82, 0.55, 1]),
    bannerTex: M.gl.makeTexture2D(gl, G.makeBannerCanvas(), {}),
    carBody: G.buildCarBody(gl, [1, 1, 1]),
    carWheel: G.buildWheel(gl)
  };

  // buildings (instanced)
  const bm = track.buildingMatrices();
  scene.buildings = G.buildUnitBoxInstanced(gl, bm.mat, bm.extra);
  scene.buildingCount = bm.count;

  scene.casters = [
    { mesh: scene.rail },
    { mesh: scene.gate.pillars },
    { mesh: scene.cones },
    { mesh: scene.lamps },
    { mesh: scene.buildings, inst: true }
  ];
  this.scene = scene;
  M.hud.setTrack(track);
  return scene;
};

// ---------------- cars ----------------
Game.prototype.buildCars = function () {
  const track = this.track;
  const defs = M.CARS.slice();
  const slots = track.gridSlots;
  this.cars = [];
  const playerDef = defs[this.selectedCar];
  const others = defs.filter((d, i) => i !== this.selectedCar);
  // shuffle others
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  for (let i = 0; i < slots.length; i++) {
    const isPlayer = i === slots.length - 1; // player starts at the back
    const def = isPlayer ? playerDef : others[(i + (this.selectedCar > i ? 1 : 0)) % others.length];
    const car = new M.Vehicle(def, isPlayer);
    car.__track = track;
    car.finishLap = this.lapTotal;
    car.reset(slots[i]);
    if (!isPlayer) M.initAI(car, 0.955 + Math.random() * 0.04);
    this.cars.push(car);
  }
  this.player = this.cars[slots.length - 1];
  // make sure player def distinct: if collision of defs, fine (paint differs by index? keep unique)
  const seen = new Set();
  for (const c of this.cars) {
    if (seen.has(c.def.id)) { c.def = Object.assign({}, c.def, { paint: [Math.random(), Math.random(), Math.random()] }); }
    seen.add(c.def.id);
  }
};

// ---------------- state transitions ----------------
Game.prototype.toMenu = function () {
  this.state = 'menu';
  this.buildCars();
  M.hud.show(false);
  M.hud.showOverlay('menu-title');
  M.hud.hideMessage();
  M.audio.setMusic(true);
};

Game.prototype.startRace = function () {
  const track = this.track;
  this.buildCars();
  this.state = 'countdown';
  this.countdown = 4.0;
  this.lastBeep = -1;
  this.raceTime = 0;
  this.bestLap = null;
  this.lapStart = 0;
  this.lapTimes = [];
  this.finishDelay = 0;
  M.hud.hideOverlays();
  M.hud.show(true);
  M.hud.message('GET READY', 'gold', 900);
  M.audio.ensure();
  M.audio.setMusic(true);
};

Game.prototype.finishRace = function () {
  this.state = 'finished';
  const rows = this.standings();
  M.hud.buildResults(rows, this.player.position <= 3 ? 'PODIUM FINISH!' : 'RACE COMPLETE');
  setTimeout(() => M.hud.showOverlay('menu-results'), 1800);
  M.hud.message('FINISH!', 'gold', 2400);
};

Game.prototype.standings = function () {
  const L = this.track.length;
  const sorted = this.cars.slice().sort((a, b) => {
    if (a.finished && b.finished) return a.finishTime - b.finishTime;
    if (a.finished) return -1;
    if (b.finished) return 1;
    return b.progress - a.progress;
  });
  const leader = sorted[0];
  return sorted.map(c => {
    let time;
    if (c.finished) time = U.fmtTime(c.finishTime);
    else {
      const gap = Math.max(0, (leader.progress - c.progress)) / 42;
      time = c === leader ? U.fmtTime(this.raceTime) : '+' + gap.toFixed(2) + 's';
    }
    return { name: c.name + (c.isPlayer ? ' (YOU)' : ''), time, me: c.isPlayer };
  });
};

// ---------------- camera ----------------
Game.prototype.updateCamera = function (dt) {
  const cam = this.cam;
  const aspect = this.canvas.width / Math.max(1, this.canvas.height);

  if (this.state === 'menu' || this.state === 'garage' || this.state === 'loading') {
    // orbit the player's car
    const car = this.player;
    if (!car) return;
    this.menuAngle += dt * 0.28;
    const r = this.state === 'garage' ? 6.5 : 12.5;
    const h = this.state === 'garage' ? 1.6 : 4.2;
    const target = { x: car.pos.x, y: car.pos.y + 0.7, z: car.pos.z };
    cam.pos.x = target.x + Math.sin(this.menuAngle) * r;
    cam.pos.z = target.z + Math.cos(this.menuAngle) * r;
    cam.pos.y = target.y + h;
    cam.fwd.x = target.x - cam.pos.x; cam.fwd.y = target.y - cam.pos.y; cam.fwd.z = target.z - cam.pos.z;
    const fl = Math.hypot(cam.fwd.x, cam.fwd.y, cam.fwd.z) || 1;
    cam.fwd.x /= fl; cam.fwd.y /= fl; cam.fwd.z /= fl;
    cam.fov = 46;
    M4.perspective(cam.proj, U.rad(cam.fov), aspect, cam.near, cam.far);
    M4.lookAt(cam.view, cam.pos, target, { x: 0, y: 1, z: 0 });
    return;
  }

  const car = this.player;
  const speed01 = U.clamp(Math.abs(car.vF) / car.def.top, 0, 1);
  const fx = Math.sin(car.yaw), fz = Math.cos(car.yaw);
  const rx = -fz, rz = fx;
  const target = { x: 0, y: 0, z: 0 };
  let eye = { x: 0, y: 0, z: 0 };

  if (this.camMode === 2) {
    // hood cam
    eye = { x: car.pos.x + fx * 0.4, y: car.pos.y + 1.12, z: car.pos.z + fz * 0.4 };
    target.x = car.pos.x + fx * 30; target.y = car.pos.y + 0.9; target.z = car.pos.z + fz * 30;
    cam.fov = this.fov + speed01 * 8 + (car.nitroOn ? 6 : 0);
  } else {
    const dist = (this.camMode === 1 ? 9.4 : 6.4) + speed01 * 3.0;
    const height = (this.camMode === 1 ? 3.6 : 2.6) + speed01 * 0.5;
    // chase position (smoothed)
    const desired = {
      x: car.pos.x - fx * dist + rx * car.vL * 0.03,
      y: car.pos.y + height,
      z: car.pos.z - fz * dist + rz * car.vL * 0.03
    };
    const lam = 7.5 - speed01 * 2.5;
    cam.pos.x = U.damp(cam.pos.x, desired.x, lam, dt);
    cam.pos.y = U.damp(cam.pos.y, desired.y, lam + 1, dt);
    cam.pos.z = U.damp(cam.pos.z, desired.z, lam, dt);
    eye = cam.pos;
    target.x = car.pos.x + fx * (7 + speed01 * 7);
    target.y = car.pos.y + 1.15;
    target.z = car.pos.z + fz * (7 + speed01 * 7);
    cam.fov = this.fov + speed01 * 14 + (car.nitroOn ? 9 : 0);
  }

  // camera shake
  this.shake = Math.max(this.shake * Math.exp(-6 * dt), car.wallHit * 0.5);
  const vib = speed01 * 0.035 + this.shake;
  if (vib > 0.001) {
    const t = this.time * 47;
    eye = {
      x: eye.x + (Math.sin(t) + Math.sin(t * 2.7)) * 0.5 * vib,
      y: eye.y + (Math.sin(t * 1.3) + Math.sin(t * 3.1)) * 0.5 * vib,
      z: eye.z + (Math.cos(t * 1.1) + Math.cos(t * 2.3)) * 0.5 * vib
    };
  }
  // keep camera above ground
  const surf = this.track.localize(eye.x, eye.z, car.hint);
  const sp = this.track.sampleAt(surf.s);
  const minY = sp.y + 0.6;
  if (eye.y < minY) eye.y = minY;

  cam.pos.x = eye.x; cam.pos.y = eye.y; cam.pos.z = eye.z;
  // slightly bank the up vector with car roll for dynamism
  const upx = rx * car.roll * 0.7, upz = rz * car.roll * 0.7;
  M4.perspective(cam.proj, U.rad(cam.fov), aspect, cam.near, cam.far);
  M4.lookAt(cam.view, eye, target, { x: upx, y: 1, z: upz });
  cam.fwd.x = target.x - eye.x; cam.fwd.y = target.y - eye.y; cam.fwd.z = target.z - eye.z;
  const fl = Math.hypot(cam.fwd.x, cam.fwd.y, cam.fwd.z) || 1;
  cam.fwd.x /= fl; cam.fwd.y /= fl; cam.fwd.z /= fl;
};

// ---------------- physics stepping ----------------
const FIXED = 1 / 120;

Game.prototype.stepPhysics = function (dt) {
  const track = this.track;
  const player = this.player;
  const racing = this.state === 'racing';
  const counting = this.state === 'countdown';
  player.__playerProgress = player.progress;

  const input = M.input.driving();
  // countdown lock
  if (counting) { input.throttle = 0; input.brake = 0; input.nitro = false; }
  if (this.state === 'finished' && player.finished) { /* free drive */ }
  if (!racing && !counting && this.state !== 'finished') {
    input.throttle = 0; input.brake = 0; input.nitro = false; input.steer = 0;
  }

  const fx = this.fxCallbacks();
  for (let i = 0; i < this.cars.length; i++) {
    const car = this.cars[i];
    if (car.finished && this.state !== 'finished') { /* AI that finished keep driving */ }
    let inp;
    if (car.isPlayer) inp = input;
    else if (racing || this.state === 'finished') inp = M.aiThink(car, dt, track, this.cars);
    else inp = { throttle: 0, brake: 0, steer: 0, nitro: false, handbrake: false };
    if (counting) inp = { throttle: 0, brake: 0, steer: inp.steer, nitro: false, handbrake: false };
    car.__lastInput = inp;
    car.step(dt, inp, track, this.cars, fx);
    car.updateProgress(track, this.raceTime);
  }

  // player lap bookkeeping
  if (racing) {
    const prevLap = this._prevLap === undefined ? 0 : this._prevLap;
    if (player.lap > prevLap) {
      const lapTime = this.raceTime - this.lapStart;
      this.lapTimes.push(lapTime);
      if (this.bestLap === null || lapTime < this.bestLap) this.bestLap = lapTime;
      this.lapStart = this.raceTime;
      if (player.lap >= this.lapTotal) {
        player.finished = true;
        player.finishTime = this.raceTime;
        this.finishRace();
      } else if (player.lap === this.lapTotal - 1) {
        M.hud.message('FINAL LAP', 'gold', 1400);
        M.audio.beep(990, 0.3, 0.28, 'square');
      } else {
        M.hud.message('LAP ' + (player.lap + 1), '', 900);
        M.audio.beep(760, 0.18, 0.22, 'square');
      }
    }
    this._prevLap = player.lap;
  }
};

Game.prototype.fxCallbacks = function () {
  if (this._fx) return this._fx;
  const self = this;
  this._fx = {
    onWall: function (car, impact, p, dir) {
      const track = self.track;
      const sp = track.sampleAt(car.s);
      const x = car.pos.x + sp.rx * dir * 1.2;
      const z = car.pos.z + sp.rz * dir * 1.2;
      if (self.particles && impact > 0.08) {
        self.particles.sparks(x, car.pos.y + 0.35, z, sp.rx * dir, sp.rz * dir, Math.ceil(impact * 14));
      }
      if (impact > 0.12) {
        M.audio.impact(impact);
        if (car.isPlayer) self.shake = Math.max(self.shake, impact * 0.9);
      }
      void p;
    },
    onCars: function (a, b, impact, nx, nz) {
      const x = (a.pos.x + b.pos.x) / 2, z = (a.pos.z + b.pos.z) / 2;
      const y = (a.pos.y + b.pos.y) / 2;
      if (self.particles && impact > 0.08) self.particles.sparks(x, y + 0.4, z, -nz, nx, Math.ceil(impact * 12));
      if (impact > 0.12) {
        M.audio.impact(impact * 0.8);
        if (a.isPlayer || b.isPlayer) self.shake = Math.max(self.shake, impact * 0.8);
      }
    }
  };
  return this._fx;
};

// ---------------- per-frame ----------------
Game.prototype.update = function (dt) {
  this.time += dt;

  // ---- input edges ----
  if (M.input.consume('Escape')) {
    if (this.state === 'racing' || this.state === 'countdown') this.pause();
    else if (this.state === 'paused') this.resume();
  }
  if (M.input.consume('KeyC')) this.camMode = (this.camMode + 1) % 3;
  if (M.input.consume('KeyR') && (this.state === 'racing')) this.player.respawn(this.track);
  if (M.input.consume('KeyM')) {
    this.muted = !this.muted;
    M.audio.setMuted(this.muted);
  }

  if (this.state === 'menu' || this.state === 'garage') {
    // idle revs for menu ambience
    this.updateCamera(dt);
    this.emitMenuExhaust(dt);
    this.particles.update(dt);
    return;
  }

  if (this.state === 'paused') { this.updateCamera(dt); return; }

  // ---- countdown ----
  if (this.state === 'countdown') {
    this.countdown -= dt;
    const n = Math.ceil(this.countdown - 1); // 3,2,1 at 4.0->3.0 etc
    if (n !== this.lastBeep && n >= 1 && n <= 3) {
      this.lastBeep = n;
      M.hud.message(String(n), 'red', 850);
      M.audio.beep(620, 0.25, 0.3, 'square');
      this.player.rpm = 4500;
    }
    if (this.countdown <= 1.0 && this.lastBeep !== 0) {
      this.lastBeep = 0;
      M.hud.message('GO!', '', 900);
      M.audio.startSting();
      this.state = 'racing';
      this.raceTime = 0;
      this.lapStart = 0;
      this._prevLap = 0;
    }
  }

  // ---- physics (fixed timestep) ----
  if (this.state === 'racing' || this.state === 'countdown' || this.state === 'finished') {
    this.raceTime = (this.raceTime || 0) + (this.state === 'racing' ? dt : 0);
    this.acc += dt;
    let steps = 0;
    while (this.acc >= FIXED && steps < 8) {
      this.stepPhysics(FIXED);
      this.acc -= FIXED;
      steps++;
    }
    if (steps === 8) this.acc = 0;

    // positions
    const sorted = this.cars.slice().sort((a, b) => b.progress - a.progress);
    for (let i = 0; i < sorted.length; i++) sorted[i].position = i + 1;

    // finished AI results
    if (this.state === 'finished') {
      for (const c of this.cars) {
        if (!c.finished && c.progress >= this.track.length * this.lapTotal) {
          c.finished = true; c.finishTime = this.raceTime;
        }
      }
    }
  }

  // ---- particles emitters ----
  this.emitCarFx(dt);

  // ---- audio ----
  const p = this.player;
  if (M.audio.ready) {
    const rpm = (this.state === 'countdown') ? 4200 + Math.sin(this.time * 14) * 900 : p.rpm;
    M.audio.engine(rpm, p.isPlayer ? M.input.driving().throttle : 0.6, p.nitroOn ? 1 : 0, Math.abs(p.vF), p.nitroOn);
    M.audio.screech(p.slip, Math.abs(p.vF));
    M.audio.nitro(p.nitroOn);
  }

  // ---- camera & HUD ----
  this.updateCamera(dt);
  if (this.state === 'racing' || this.state === 'countdown' || this.state === 'finished') {
    const kmh = Math.abs(p.vF) * 3.6;
    M.hud.update({
      player: p, cars: this.cars,
      lap: p.lap, lapTotal: this.lapTotal,
      timeMs: this.raceTime * 1000, bestMs: this.bestLap,
      position: p.position || 1,
      nitro: p.nitro, kmh, gear: p.gear, rpm: p.rpm,
      boost: p.nitroOn
    });
    if (p.wrongWay > 0.5 && this.state === 'racing') M.hud.message('WRONG WAY', 'red small', 600);
  }
};

Game.prototype.emitMenuExhaust = function () { /* quiet menu */ };

Game.prototype.emitCarFx = function (dt) {
  const ps = this.particles;
  if (!ps) return;
  const track = this.track;
  for (const car of this.cars) {
    const speed = Math.abs(car.vF);
    // tire smoke while drifting
    if (car.drifting && speed > 8) {
      const fx = Math.sin(car.yaw), fz = Math.cos(car.yaw);
      const rx = -fz, rz = fx;
      for (const side of [-1, 1]) {
        const wx = car.pos.x - fx * 1.45 + rx * 0.9 * side;
        const wz = car.pos.z - fz * 1.45 + rz * 0.9 * side;
        ps.tireSmoke(wx, car.pos.y, wz, car.vel.x * 0.2, 0, car.vel.z * 0.2, dt * 40 + 0.3);
      }
    }
    // nitro flames + trail
    if (car.nitroOn) {
      const fx = Math.sin(car.yaw), fz = Math.cos(car.yaw);
      const rx = -fz, rz = fx;
      for (const side of [-0.35, 0.35]) {
        ps.nitroFlame(
          car.pos.x - fx * 2.3 + rx * side, car.pos.y + 0.34, car.pos.z - fz * 2.3 + rz * side,
          -fx, 0.05, -fz);
      }
      if (car.isPlayer) ps.boostTrail(car.pos.x - fx * 2.6, car.pos.y + 0.5, car.pos.z - fz * 2.6, car.vel.x, car.vel.z);
    } else if (Math.random() < 0.1) {
      const fx = Math.sin(car.yaw), fz = Math.cos(car.yaw);
      ps.exhaustGlow(car.pos.x - fx * 2.3, car.pos.y + 0.3, car.pos.z - fz * 2.3, -fx, -fz, speed > 3);
    }
    // kerb dust / off-track dirt
    if (!car.onTrack && speed > 10 && Math.random() < 0.5) {
      ps.spawn({
        x: car.pos.x, y: car.pos.y + 0.1, z: car.pos.z,
        vx: -car.vel.x * 0.2, vy: 1.2, vz: -car.vel.z * 0.2,
        life: 0.6, s0: 0.5, s1: 2.6,
        r: 0.5, g: 0.45, b: 0.4, a: 0.4,
        drag: 2, tile: 'smoke', soft: 1
      });
    }
  }
  ps.update(Math.min(dt, 0.05));
  void track;
};

// ---------------- quality / resize ----------------
Game.prototype.quality = function () {
  const q = QUALITY[this.qualityName] || QUALITY.high;
  return q;
};

Game.prototype.applyResolution = function () {
  const q = this.quality();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const targetScale = q.res * this.userRes * this.renderScale;
  const w = Math.round(this.canvas.clientWidth * dpr * targetScale);
  const h = Math.round(this.canvas.clientHeight * dpr * targetScale);
  if (w < 4 || h < 4) return;
  if (this.canvas.width !== w || this.canvas.height !== h) {
    this.canvas.width = w;
    this.canvas.height = h;
    if (this.renderer) this.renderer.resize(w, h);
  }
};

Game.prototype.autoScale = function (dt) {
  this.frameMs = U.damp(this.frameMs, dt * 1000, 3, dt);
  this.resCooldown -= dt;
  if (this.resCooldown > 0) return;
  if (this.frameMs > 21 && this.renderScale > 0.55) {
    this.renderScale = Math.max(0.55, this.renderScale - 0.08);
    this.resCooldown = 1.2;
    this.applyResolution();
  } else if (this.frameMs < 13.5 && this.renderScale < 1) {
    this.renderScale = Math.min(1, this.renderScale + 0.05);
    this.resCooldown = 1.6;
    this.applyResolution();
  }
};

// ---------------- pause / menus ----------------
Game.prototype.pause = function () {
  if (this.state !== 'racing' && this.state !== 'countdown') return;
  this._resumeState = this.state;
  this.state = 'paused';
  M.hud.showOverlay('menu-pause');
};
Game.prototype.resume = function () {
  this.state = this._resumeState || 'racing';
  M.hud.hideOverlays();
};

// ---------------- render ----------------
Game.prototype.renderFrame = function () {
  const renderer = this.renderer;
  const q = this.quality();
  const player = this.player;
  const speed01 = U.clamp(Math.abs(player.vF) / player.def.top, 0, 1);

  renderer.render(this.scene, {
    cam: this.cam,
    cars: this.cars,
    player,
    time: this.time,
    wetness: 0.55,
    particles: this.particles,
    quality: { ssr: q.ssr, ssrStrength: q.ssrStrength, bloom: q.bloom },
    speed01,
    nitro01: player.nitroOn ? 1 : 0,
    motionStrength: speed01 * 0.011 + (player.nitroOn ? 0.008 : 0),
    spotCount: renderer.gatherSpots(this.cars, player)
  });
};

M.Game = Game;
M.QUALITY = QUALITY;

})(window.MIMO);
