/* MIMO VELOCITY — vehicle physics (arcade-sim hybrid) */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';
const U = M.util, V3 = M.v3;

// ---- car catalogue ----
const CARS = [
  { id: 'vortex', name: 'VORTEX GT',  paint: [0.06, 0.42, 0.95], accel: 27, top: 84, grip: 1.00, nitro: 1.00, flake: 1.0,
    stats: { SPEED: .80, ACCEL: .80, GRIP: .80, NITRO: .80 } },
  { id: 'phantom', name: 'PHANTOM X', paint: [0.62, 0.65, 0.70], accel: 25, top: 92, grip: 0.92, nitro: 0.95, flake: 1.4,
    stats: { SPEED: .97, ACCEL: .72, GRIP: .70, NITRO: .76 } },
  { id: 'blaze',   name: 'BLAZE R',   paint: [0.95, 0.12, 0.18], accel: 31, top: 79, grip: 1.10, nitro: 1.05, flake: .9,
    stats: { SPEED: .72, ACCEL: .95, GRIP: .93, NITRO: .86 } },
  { id: 'nyx',     name: 'NYX TURBO', paint: [0.10, 0.85, 0.55], accel: 28, top: 83, grip: 1.04, nitro: 1.30, flake: 1.2,
    stats: { SPEED: .78, ACCEL: .84, GRIP: .84, NITRO: 1.00 } },
  { id: 'inferno', name: 'INFERNO',   paint: [1.0, 0.45, 0.05], accel: 30, top: 86, grip: 0.97, nitro: 1.10, flake: 1.1,
    stats: { SPEED: .86, ACCEL: .90, GRIP: .77, NITRO: .90 } },
  { id: 'aurora',  name: 'AURORA LE', paint: [0.55, 0.15, 0.95], accel: 29, top: 88, grip: 1.05, nitro: 1.05, flake: 1.5,
    stats: { SPEED: .90, ACCEL: .87, GRIP: .86, NITRO: .84 } }
];
M.CARS = CARS;

const GEARS = [0, 11, 21, 33, 47, 62, 79]; // m/s at redline per gear (approx)

function Vehicle(carDef, isPlayer) {
  this.def = carDef;
  this.isPlayer = !!isPlayer;
  this.pos = { x: 0, y: 0, z: 0 };
  this.vel = { x: 0, y: 0, z: 0 };
  this.yaw = 0;
  this.yawRate = 0;
  this.steer = 0;
  this.vF = 0; this.vL = 0;
  this.nitro = 100;
  this.nitroOn = false;
  this.gear = 1;
  this.rpm = 1000;
  this.s = 0; this.lat = 0; this.hint = 0;
  this.onTrack = true;
  this.slip = 0;
  this.drifting = false;
  this.wallHit = 0;         // impact intensity (decays)
  this.lastWallDir = 0;
  this.pitch = 0; this.roll = 0; this.bounce = 0;
  this.wheelSpin = 0; this.wheelSteer = 0;
  this.brakeLight = 0; this.headlights = 1;
  this.lap = 0; this.prevS = 0; this.progress = 0;
  this.finished = false; this.finishTime = 0;
  this.wrongWay = 0;
  this.stuck = 0;
  this.aiSkill = 1;
  this.name = carDef.name;
  this.color = carDef.paint;
}

Vehicle.prototype.reset = function (slot) {
  this.pos.x = slot.x; this.pos.y = slot.y; this.pos.z = slot.z;
  this.yaw = slot.yaw;
  this.vel.x = this.vel.y = this.vel.z = 0;
  this.yawRate = 0; this.steer = 0; this.vF = 0; this.vL = 0;
  this.nitro = 100; this.gear = 1; this.rpm = 1000;
  this.s = slot.s; this.lat = slot.lat; this.hint = 0;
  this.totalDist = null;
  this.lap = 0; this.prevS = slot.s; this.progress = slot.s;
  this.finished = false; this.finishTime = 0;
  this.wrongWay = 0; this.wallHit = 0; this.slip = 0;
  this.pitch = this.roll = this.bounce = 0;
  this.wheelSpin = 0;
};

// damage-free respawn at current s
Vehicle.prototype.respawn = function (track) {
  const p = track.pointAt(this.s, 0);
  this.pos.x = p.x; this.pos.y = p.y + 0.05; this.pos.z = p.z;
  this.yaw = Math.atan2(p.p.tx, p.p.tz);
  this.vel.x = this.vel.y = this.vel.z = 0;
  this.yawRate = 0; this.vF = 0; this.vL = 0;
  this.lat = 0;
};

Vehicle.prototype.surfaceY = function (track) {
  const loc = track.localize(this.pos.x, this.pos.z, this.hint);
  this.hint = loc.index;
  this.s = loc.s; this.lat = loc.lat;
  const p = track.sampleAt(loc.s);
  return { y: p.y + p.ry * loc.lat, on: Math.abs(loc.lat) <= track.halfWidth + 1.5, p };
};

// main step — input: {throttle 0..1, brake 0..1, steer -1..1, nitro bool, handbrake bool}
Vehicle.prototype.step = function (dt, input, track, cars, fx) {
  const def = this.def;
  const fwd = { x: Math.sin(this.yaw), z: Math.cos(this.yaw) };
  // right = fwd × up  =>  facing +Z, right = -X
  const right = { x: -fwd.z, z: fwd.x };

  // decompose velocity in car frame
  let vF = this.vel.x * fwd.x + this.vel.z * fwd.z;
  let vL = this.vel.x * right.x + this.vel.z * right.z;

  const surf = this.surfaceY(track);
  const onTrack = surf.on;
  this.onTrack = onTrack;

  // ---- steering input smoothing (+1 = right) ----
  const steerTarget = input.steer;
  const rate = 7.5;
  this.steer = U.moveTowards(this.steer, steerTarget, rate * dt);

  // ---- engine ----
  const speed = Math.abs(vF);
  const top = def.top * (this.nitroOn ? 1.16 : 1.0) * (onTrack ? 1 : 0.82);
  let engineA = 0;
  const throttle = input.throttle;
  const brake = input.brake;
  if (throttle > 0) {
    if (vF > -1) {
      // gear / rpm simulation for HUD + audio
      const bounds = GEARS;
      let g = 1;
      while (g < bounds.length && speed >= bounds[g - 1]) g++;
      this.gear = g;
      const low = g > 1 ? bounds[g - 2] : 0;
      const high = bounds[g - 1];
      const rpmN = U.clamp((speed - low) / Math.max(1, high - low), 0, 1);
      this.rpm = 1400 + rpmN * 7200 + throttle * 350;
      const torqueMul = 0.78 + 0.42 * Math.sin(Math.PI * U.clamp(rpmN * .88 + .16, 0, 1));
      engineA = throttle * def.accel * torqueMul * (onTrack ? 1 : 0.6);
    } else {
      // reverse
      engineA = -12 * throttle;
    }
  } else {
    this.rpm = U.damp(this.rpm, 1000, 4, dt);
    this.gear = vF < -0.5 ? 0 : Math.max(1, this.gear);
  }
  if (brake > 0 && vF > 0.5) engineA = 0;

  // nitro
  this.nitroOn = !!input.nitro && this.nitro > 0.5 && throttle > 0.1;
  if (this.nitroOn) {
    this.nitro = Math.max(0, this.nitro - 34 * dt / def.nitro);
    engineA += 24 * def.nitro;
  } else if (!input.nitro) {
    this.nitro = Math.min(100, this.nitro + 3.2 * dt);
  }

  // braking / reverse
  let brakeA = 0;
  if (brake > 0) {
    if (vF > 0.3) brakeA = -22 * brake * (onTrack ? 1 : 0.75);
    else if (vF <= 0.3 && throttle < 0.1) brakeA = -10 * brake;
  }

  // drag & rolling resistance (equilibrium ≈ top speed at full throttle)
  const dragK = 0.95 * def.accel / (top * top);
  const dragA = -vF * Math.abs(vF) * dragK - vF * (onTrack ? 0.35 : 1.6);
  let aF = engineA + brakeA + dragA;
  if (input.handbrake) aF -= Math.sign(vF) * 6;

  vF += aF * dt;

  // ---- yaw dynamics (steer +1 = right => yaw decreases) ----
  const aLatMax = 13.5 * def.grip * (onTrack ? 1 : 0.62);
  let desiredYaw = -this.steer * (aLatMax / Math.max(11, speed));
  desiredYaw *= U.clamp(speed / 3.5, 0, 1);
  desiredYaw *= 1 + (input.handbrake ? 0.45 : 0);
  desiredYaw *= this.nitroOn ? 1.04 : 1;
  const yawAccel = (desiredYaw - this.yawRate) * (speed > 1 ? 6.5 : 10);
  this.yawRate += yawAccel * dt;

  // grip: decay lateral velocity (handbrake = low grip => drift)
  let gripK = onTrack ? 7.6 * def.grip : 4.2;
  if (input.handbrake) gripK = 1.5;
  vL *= Math.exp(-gripK * dt);

  // slip-angle self-aligning torque (stability + drift feel)
  const slipAngle = Math.atan2(vL, Math.max(1, Math.abs(vF)));
  if (!input.handbrake) {
    this.yawRate += -slipAngle * 1.15 * U.clamp(speed / 14, 0, 1) * dt * 6;
  } else {
    this.yawRate += -slipAngle * 0.25 * dt * 6;
  }
  this.yawRate = U.clamp(this.yawRate, -2.6, 2.6);

  this.yaw += this.yawRate * dt;

  // recompose velocity with updated axes
  const fwd2 = { x: Math.sin(this.yaw), z: Math.cos(this.yaw) };
  const right2 = { x: -fwd2.z, z: fwd2.x };
  this.vel.x = fwd2.x * vF + right2.x * vL;
  this.vel.z = fwd2.z * vF + right2.z * vL;

  // ---- integrate position ----
  this.pos.x += this.vel.x * dt;
  this.pos.z += this.vel.z * dt;
  const surf2 = this.surfaceY(track);
  this.pos.y = surf2.y;

  // ---- wall collision (track bounds) ----
  const hw = track.halfWidth;
  const maxLat = hw + 0.35;
  if (Math.abs(this.lat) > maxLat) {
    const dir = Math.sign(this.lat);
    const excess = Math.abs(this.lat) - maxLat;
    // push back
    const p = track.sampleAt(this.s);
    this.pos.x -= p.rx * dir * excess;
    this.pos.z -= p.rz * dir * excess;
    // velocity component along outward normal
    const outN = { x: p.rx * dir, z: p.rz * dir };
    const vn = this.vel.x * outN.x + this.vel.z * outN.z;
    if (vn > 0) {
      const impact = U.clamp(vn / 30, 0, 1);
      this.wallHit = Math.max(this.wallHit, impact);
      this.vel.x -= outN.x * vn * 1.45;
      this.vel.z -= outN.z * vn * 1.45;
      // tangential scrub
      const tvx = this.vel.x - outN.x * (this.vel.x * outN.x + this.vel.z * outN.z);
      const tvz = this.vel.z - outN.z * (this.vel.x * outN.x + this.vel.z * outN.z);
      this.vel.x = tvx * 0.94 + outN.x * (this.vel.x * outN.x + this.vel.z * outN.z);
      this.vel.z = tvz * 0.94 + outN.z * (this.vel.x * outN.x + this.vel.z * outN.z);
      this.yawRate += (Math.random() - .5) * impact * 2.2;
      this.lat = dir * maxLat;
      if (fx) fx.onWall(this, impact, p, dir);
    }
  }

  // ---- car vs car ----
  if (cars) {
    for (let i = 0; i < cars.length; i++) {
      const o = cars[i];
      if (o === this) continue;
      const dx = o.pos.x - this.pos.x, dz = o.pos.z - this.pos.z;
      const d2 = dx * dx + dz * dz;
      if (d2 > 7.3 || d2 < 1e-6) continue;
      const d = Math.sqrt(d2);
      const nx = dx / d, nz = dz / d;
      const overlap = 2.7 - d;
      if (overlap > 0) {
        // separate
        this.pos.x -= nx * overlap * 0.5; this.pos.z -= nz * overlap * 0.5;
        o.pos.x += nx * overlap * 0.5; o.pos.z += nz * overlap * 0.5;
        // impulse along normal
        const rvx = this.vel.x - o.vel.x, rvz = this.vel.z - o.vel.z;
        const vn = rvx * nx + rvz * nz;
        if (vn < 0) {
          const j = -vn * 0.62;
          this.vel.x -= nx * j; this.vel.z -= nz * j;
          o.vel.x += nx * j; o.vel.z += nz * j;
          const impact = U.clamp(-vn / 26, 0, 1);
          this.wallHit = Math.max(this.wallHit, impact * .8);
          o.wallHit = Math.max(o.wallHit, impact * .8);
          this.yawRate += (Math.random() - .5) * impact;
          o.yawRate += (Math.random() - .5) * impact;
          if (fx) fx.onCars(this, o, impact, nx, nz);
        }
      }
    }
  }

  // ---- post-state bookkeeping ----
  const fwd3 = { x: Math.sin(this.yaw), z: Math.cos(this.yaw) };
  this.vF = this.vel.x * fwd3.x + this.vel.z * fwd3.z;
  this.vL = this.vel.x * (-fwd3.z) + this.vel.z * (fwd3.x);

  // slip amount for fx/audio
  const slipRaw = U.clamp(Math.abs(this.vL) / 9 + (input.handbrake ? speed / 60 : 0), 0, 1);
  this.slip = U.damp(this.slip, slipRaw * (onTrack ? 1 : .6), 8, dt);
  this.drifting = this.slip > 0.42 && speed > 6;
  if (this.drifting && input.handbrake) this.nitro = Math.min(100, this.nitro + 11 * dt * def.nitro);

  // visual body dynamics
  const targetRoll = U.clamp(this.steer * speed * 0.010 + this.vL * 0.012, -0.14, 0.14);
  const targetPitch = U.clamp(-aF * 0.0025 + Math.max(0, -brakeA) * 0.0035, -0.07, 0.07);
  this.roll = U.damp(this.roll, targetRoll, 7, dt);
  this.pitch = U.damp(this.pitch, targetPitch, 8, dt);
  this.bounce = U.damp(this.bounce, onTrack ? 0 : Math.sin(performance.now() * .02) * 0.05, 4, dt);
  this.wheelSteer = U.damp(this.wheelSteer, -this.steer * 0.42, 12, dt);
  this.wheelSpin += (this.vF / 0.345) * dt;
  this.brakeLight = U.damp(this.brakeLight, (brake > 0 || (throttle < .1 && speed > 2)) ? 1 : 0, 12, dt);
  this.wallHit = Math.max(0, this.wallHit - dt * 2.2);
};

// lap & progress tracking (robust: cumulative arc distance, wrap-safe)
Vehicle.prototype.updateProgress = function (track, raceTime) {
  const L = track.length;
  const s = this.s;
  let d = s - this.prevS;
  if (d > L * 0.5) d -= L;
  else if (d < -L * 0.5) d += L;
  if (this.totalDist === null || this.totalDist === undefined) this.totalDist = s - L;
  this.totalDist += d;
  this.prevS = s;
  this.progress = this.totalDist;
  this.lap = Math.max(0, Math.floor(this.totalDist / L));
  // crossing the finish distance records the time (whoever finishes first)
  if (!this.finished && this.totalDist >= L * (this.finishLap || 3)) {
    this.finished = true;
    this.finishTime = raceTime;
  }

  // wrong way (display only): velocity vs track tangent
  const p = track.sampleAt(s);
  const fw = Math.sin(this.yaw), fz = Math.cos(this.yaw);
  const align = fw * p.tx + fz * p.tz;
  const moving = Math.hypot(this.vel.x, this.vel.z) > 6;
  this.wrongWay = (align < -0.35 && moving) ? Math.min(1, this.wrongWay + 0.02) : Math.max(0, this.wrongWay - 0.05);
  void raceTime;
};

M.Vehicle = Vehicle;

})(window.MIMO);
