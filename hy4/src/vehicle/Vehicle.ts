import * as THREE from 'three';
import { CarModel, type CarSpec } from './CarModel';
import { Track, ROAD_HALF, WALL_LAT, type TrackHit, type TrackFrame } from '../world/Track';
import { angleDelta, clamp, damp, lerp, TAU } from '../core/Math';
import type { DriveInput } from '../core/Input';

const WHEELBASE = 3.0;
const COLLIDE_RADIUS = 1.15;
const TOTAL_LAPS = 3;

export class Vehicle {
  readonly spec: CarSpec;
  readonly model: CarModel;
  readonly track: Track;
  readonly isPlayer: boolean;
  name = '';
  position = 1;

  pos = new THREE.Vector3();
  yaw = 0;
  vx = 0;
  vz = 0;
  yawRate = 0;
  steerAngle = 0;
  steerInput = 0;
  speed = 0;          // signed longitudinal speed, m/s
  speedAbs = 0;       // magnitude of world velocity
  slip = 0;
  drift = 0;
  drifting = false;
  nitro = 1;
  nitroActive = false;
  gear = 1;
  rpm = 1400;
  offRoad = false;
  onRoad = true;
  wallHit = 0;
  carHit = 0;
  hint = -1;

  s = 0;
  lateral = 0;
  progress = 0;
  started = false;
  lapsCompleted = 0;
  lapStartTime = 0;
  bestLap = 0;
  lastLap = 0;
  lapTimes: number[] = [];
  finished = false;
  finishTime = 0;
  wrongWay = false;

  /** Driver-tunable handling (0.35–1.4 and 0–1). */
  steeringScale = 0.78;
  assistScale = 0.6;

  private hit: TrackHit;
  private frame: TrackFrame;
  private baseY = 0;
  private prevSpeed = 0;
  private roll = 0;
  private pitch = 0;
  private elapsed = 0;

  constructor(scene: THREE.Scene, track: Track, spec: CarSpec, color: number, accent: number, isPlayer: boolean) {
    this.spec = spec;
    this.track = track;
    this.isPlayer = isPlayer;
    this.model = new CarModel(spec, color, accent);
    this.hit = track.nearest(new THREE.Vector3(), -1);
    this.frame = track.frameAt(0);
    scene.add(this.model.root);
  }

  get forwardX(): number { return Math.sin(this.yaw); }
  get forwardZ(): number { return Math.cos(this.yaw); }
  get speedKmh(): number { return this.speedAbs * 3.6; }
  get groundY(): number { return this.baseY; }
  get displayLap(): number { return Math.min(TOTAL_LAPS, this.lapsCompleted + 1); }
  get lapProgress(): number { return this.s / this.track.length; }

  reset(slot: number, time: number): void {
    const grid = this.track.gridSlot(slot);
    this.pos.copy(grid.position);
    this.yaw = grid.yaw;
    this.s = grid.s;
    this.hint = -1;
    this.hit = this.track.nearest(this.pos, -1);
    this.hint = this.hit.index;
    this.baseY = this.hit.height;
    this.vx = 0;
    this.vz = 0;
    this.yawRate = 0;
    this.steerAngle = 0;
    this.steerInput = 0;
    this.speed = 0;
    this.speedAbs = 0;
    this.slip = 0;
    this.drift = 0;
    this.drifting = false;
    this.nitro = 1;
    this.nitroActive = false;
    this.wallHit = 0;
    this.carHit = 0;
    this.offRoad = false;
    this.started = false;
    this.lapsCompleted = 0;
    this.lapStartTime = time;
    this.bestLap = 0;
    this.lastLap = 0;
    this.lapTimes = [];
    this.finished = false;
    this.finishTime = 0;
    this.position = slot + 1;
    this.prevSpeed = 0;
    this.elapsed = 0;
    this.progress = this.s - this.track.length;
    this.model.root.position.set(this.pos.x, this.baseY + 0.01, this.pos.z);
    this.model.root.rotation.set(0, this.yaw, 0);
    this.model.setBodyTilt(0, 0);
  }

  update(dt: number, input: DriveInput, time: number): void {
    this.elapsed += dt;
    const prevIndex = this.hint;
    const fwdX = Math.sin(this.yaw);
    const fwdZ = Math.cos(this.yaw);
    const rightX = -fwdZ;
    const rightZ = fwdX;
    let vLong = this.vx * fwdX + this.vz * fwdZ;
    let vLat = this.vx * rightX + this.vz * rightZ;

    const onRoad = Math.abs(this.lateral) < ROAD_HALF + 0.7;
    this.onRoad = onRoad;
    this.offRoad = !onRoad;
    const surfaceGrip = onRoad ? 1 : 0.6;
    const topSpeed = this.spec.topSpeed * (this.nitroActive ? 1.13 : 1) * (onRoad ? 1 : 0.56);

    // Nitro: drains under throttle, recharges faster while drifting.
    const wantsNitro = input.nitro && this.nitro > 0.01 && vLong > 3 && input.throttle > 0.05;
    this.nitroActive = wantsNitro;
    if (wantsNitro) this.nitro = Math.max(0, this.nitro - dt * (0.155 / this.spec.nitro));
    else this.nitro = Math.min(1, this.nitro + dt * (0.028 + this.drift * 0.09));

    // Signed longitudinal model. Throttle cancels reverse; brake becomes reverse
    // only once the car has nearly stopped. Never apply anti-creep while a
    // drive input is held (that was a real trapped-in-reverse bug).
    const drive = clamp(input.throttle - input.brake, -1, 1);
    const forwardRatio = clamp(Math.max(0, vLong) / Math.max(1, topSpeed), 0, 1.2);
    const surfaceDrive = onRoad ? 1 : 0.55;
    if (drive > 0.02) {
      let accel = drive * this.spec.accel * (1 - 0.64 * forwardRatio * forwardRatio) * surfaceDrive;
      if (wantsNitro) accel += 8.5;
      if (vLong < 0) accel += drive * this.spec.brake * 0.55;
      vLong += accel * dt;
    } else if (drive < -0.02) {
      const brakeInput = -drive;
      if (vLong > 0.4) vLong -= brakeInput * this.spec.brake * dt;
      else {
        vLong -= brakeInput * 7.6 * (onRoad ? 1 : 0.6) * dt;
        if (vLong < -13) vLong = -13;
      }
    }
    if (input.handbrake) vLong -= Math.sign(vLong) * Math.min(Math.abs(vLong), 6.5 * dt);
    if (Math.abs(drive) < 0.02) {
      const rolling = 1.1 + 0.00045 * vLong * vLong;
      vLong -= Math.sign(vLong) * Math.min(Math.abs(vLong), rolling * dt);
    }
    if (!onRoad) vLong -= Math.sign(vLong) * Math.min(Math.abs(vLong), 2.2 * dt);
    if (vLong > topSpeed) vLong = damp(vLong, topSpeed, 4, dt);
    if (vLong < -13) vLong = -13;
    if (Math.abs(vLong) < 0.015 && Math.abs(drive) < 0.02) vLong = 0;

    // Steering: input damping, speed-sensitive lock, tyre-limited yaw, then a
    // small arcade turn-in assist. +1 steer (screen-right) NEGATES yaw.
    const speedForInput = clamp(Math.abs(vLong) / 28, 0, 1);
    const inputResponse = lerp(16, 22, speedForInput);
    const sensitivity = this.steeringScale / 0.78;
    this.steerInput = damp(this.steerInput, input.steer * sensitivity, inputResponse, dt);
    const speedFactor = clamp(Math.abs(vLong) / Math.max(8, this.spec.topSpeed), 0, 1);
    const maxSteer = lerp(0.60, 0.20, speedFactor);
    this.steerAngle = damp(this.steerAngle, this.steerInput * maxSteer, lerp(17, 22, speedForInput), dt);

    const maxLat = 9.81 * this.spec.grip * (input.handbrake ? 1.25 : 1.42) * surfaceGrip;
    const maxYaw = maxLat / Math.max(6, Math.abs(vLong));
    let yawTarget = -(vLong / WHEELBASE) * Math.tan(this.steerAngle);
    yawTarget = clamp(yawTarget, -maxYaw, maxYaw);
    if (input.handbrake && Math.abs(vLong) > 8) yawTarget *= 1.28;
    const assistGain = (this.isPlayer ? 0.50 : 0.22) * this.assistScale / 0.6;
    const assist = assistGain * clamp((Math.abs(vLong) - 4) / 40, 0, 1) * Math.sign(vLong || 1);
    yawTarget += -this.steerInput * assist;
    const lowSpeedYawCap = clamp(1.55 + (Math.abs(vLong) - 4) * 0.035, 1.55, 3.2);
    yawTarget = clamp(yawTarget, -lowSpeedYawCap, lowSpeedYawCap);
    const yawResponse = input.handbrake ? 4.2 : lerp(9.0, 11.5, speedForInput);
    this.yawRate = damp(this.yawRate, yawTarget, yawResponse, dt);
    this.yaw += this.yawRate * dt;
    if (this.yaw > Math.PI) this.yaw -= TAU;
    if (this.yaw < -Math.PI) this.yaw += TAU;

    // Tyres scrub lateral velocity; then rotate the (already updated) local
    // velocity into the new heading. Re-projecting the old world velocity here
    // would throw away throttle and brake forces.
    const grip = (onRoad ? 1 : 0.45) * (input.handbrake ? 0.2 : 1);
    vLat *= Math.exp(-(7.6 + this.spec.grip * 2.6) * grip * dt);
    vLat = clamp(vLat, -24, 24);
    if (Math.abs(vLong) < 0.25 && Math.abs(drive) < 0.02) vLong *= 0.85;

    const nfX = Math.sin(this.yaw);
    const nfZ = Math.cos(this.yaw);
    const nrX = -nfZ;
    const nrZ = nfX;
    this.vx = nfX * vLong + nrX * vLat;
    this.vz = nfZ * vLong + nrZ * vLat;
    this.pos.x += this.vx * dt;
    this.pos.z += this.vz * dt;

    // Barrier containment: remove only outward velocity; mild tangential drag.
    const hit = this.track.nearest(this.pos, this.hint, this.hit);
    this.hint = hit.index;
    const limit = WALL_LAT - 0.95;
    if (Math.abs(hit.lateral) > limit) {
      const side = Math.sign(hit.lateral);
      const over = Math.abs(hit.lateral) - limit;
      this.pos.x -= hit.right.x * over * side;
      this.pos.z -= hit.right.z * over * side;
      const outward = this.vx * hit.right.x + this.vz * hit.right.z;
      const impact = outward * side;
      if (impact > 0) {
        this.vx -= hit.right.x * outward * 1.08;
        this.vz -= hit.right.z * outward * 1.08;
        const tangential = this.vx * hit.tangent.x + this.vz * hit.tangent.z;
        // Rate-based scrape: a fixed per-step multiplier would compound 120×
        // per second and glue the car to the barrier (a real earlier bug).
        const friction = clamp(impact * 0.02, 0, 1.2) * dt;
        this.vx -= hit.tangent.x * tangential * friction;
        this.vz -= hit.tangent.z * tangential * friction;
        this.wallHit = Math.max(this.wallHit, clamp(impact / 12, 0.15, 1));
      }
      vLong = this.vx * nfX + this.vz * nfZ;
      const clamped = this.track.nearest(this.pos, this.hint, this.hit);
      this.hint = clamped.index;
    }

    this.s = this.hit.distance;
    this.lateral = this.hit.lateral;
    const frame = this.track.frameAt(this.s, this.frame);
    this.baseY = damp(this.baseY, this.hit.height, 16, dt);

    // Telemetry.
    this.speed = vLong;
    this.speedAbs = Math.hypot(this.vx, this.vz);
    this.slip = Math.abs(Math.atan2(vLat, Math.max(2, Math.abs(vLong))));
    this.drifting = this.slip > 0.12 && this.speedAbs > 8;
    this.drift = damp(this.drift, this.drifting ? clamp(this.slip * 1.6, 0, 1) : 0, 4, dt);

    // Gearbox.
    if (vLong < -0.3) {
      this.gear = 0; // R
      this.rpm = damp(this.rpm, 1500 + clamp(Math.abs(vLong) / 13, 0, 1) * 2400, 9, dt);
    } else {
      const ratio = clamp(Math.abs(vLong) / Math.max(4, this.spec.topSpeed), 0, 1.05);
      this.gear = clamp(1 + Math.floor(ratio * 6.4), 1, 7);
      const seg = 6.4;
      const start = (this.gear - 1) / seg;
      const span = 1 / seg;
      const within = clamp((ratio - start) / span, 0, 1);
      this.rpm = damp(this.rpm, 1600 + within * 6400 + (this.nitroActive ? 400 : 0), 8, dt);
    }

    this.updateRace(time, prevIndex);
    this.placeVisual(dt, frame, vLong);
  }

  /** Lap crossing, anti-cheat and unwrapped progress. */
  private updateRace(time: number, prevIndex: number): void {
    const n = this.track.samples.length;
    const along = this.vx * this.hit.tangent.x + this.vz * this.hit.tangent.z;
    const forwardCross = prevIndex > n * 0.75 && this.hit.index < n * 0.25 && along > 4;
    const backwardCross = prevIndex < n * 0.25 && this.hit.index > n * 0.75 && along < -4;
    if (forwardCross) {
      if (!this.started) {
        this.started = true;
        this.lapStartTime = time;
      } else if (!this.finished) {
        const lap = time - this.lapStartTime;
        this.lastLap = lap;
        this.lapTimes.push(lap);
        if (this.bestLap === 0 || lap < this.bestLap) this.bestLap = lap;
        this.lapsCompleted += 1;
        this.lapStartTime = time;
        if (this.lapsCompleted >= TOTAL_LAPS) {
          this.finished = true;
          this.finishTime = time;
        }
      }
    } else if (backwardCross) {
      if (this.lapsCompleted > 0) {
        this.lapsCompleted -= 1;
        this.lapTimes.pop();
        this.lapStartTime = time;
        this.finished = false;
      } else if (this.started) {
        this.started = false;
      }
    }
    this.wrongWay = along < -6 && this.speedAbs > 7;
    // Unwrapped progress for ordering. Before the first crossing the car is
    // still on the grid *behind* the line, so its progress must stay negative;
    // jumping to +L here used to scramble the standings on lap 1.
    this.progress = this.started
      ? this.lapsCompleted * this.track.length + this.s
      : this.s - this.track.length;
  }

  private placeVisual(dt: number, frame: TrackFrame, vLong: number): void {
    const normal = new THREE.Vector3(0, 1, 0)
      .addScaledVector(frame.right, -Math.tan(frame.bank))
      .normalize();
    const fwd = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    fwd.addScaledVector(normal, -fwd.dot(normal)).normalize();
    const xAxis = new THREE.Vector3().crossVectors(normal, fwd).normalize();
    const yAxis = new THREE.Vector3().crossVectors(fwd, xAxis).normalize();
    const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, fwd);
    const target = new THREE.Quaternion().setFromRotationMatrix(basis);
    this.model.root.quaternion.slerp(target, 1 - Math.exp(-18 * dt));
    this.model.root.position.set(this.pos.x, this.baseY + 0.01, this.pos.z);

    const longAccel = clamp((vLong - this.prevSpeed) / Math.max(dt, 1e-4), -40, 40);
    this.prevSpeed = vLong;
    const latAccel = this.yawRate * vLong;
    this.roll = damp(this.roll, clamp(latAccel * 0.0038, -0.07, 0.07), 7, dt);
    this.pitch = damp(this.pitch, clamp(longAccel * 0.0035, -0.055, 0.055), 5, dt);
    this.model.setBodyTilt(this.roll, this.pitch);
    this.model.updateVisual(dt, vLong, this.steerInput, this.slip, this.brakingHeld, this.nitroActive);
  }

  brakingHeld = false;

  static resolveCollision(a: Vehicle, b: Vehicle): void {
    const dx = b.pos.x - a.pos.x;
    const dz = b.pos.z - a.pos.z;
    const dist = Math.hypot(dx, dz);
    const min = COLLIDE_RADIUS * 2;
    if (dist > min || dist < 1e-4) return;
    if (Math.abs(a.baseY - b.baseY) > 2.2) return;
    const nx = dx / dist;
    const nz = dz / dist;
    const overlap = min - dist;
    a.pos.x -= nx * overlap * 0.5;
    a.pos.z -= nz * overlap * 0.5;
    b.pos.x += nx * overlap * 0.5;
    b.pos.z += nz * overlap * 0.5;
    const relative = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
    if (relative < 0) {
      const impulse = relative * 0.45;
      a.vx += nx * impulse;
      a.vz += nz * impulse;
      b.vx -= nx * impulse;
      b.vz -= nz * impulse;
      const hit = clamp(Math.abs(relative) / 10, 0.1, 1);
      a.carHit = Math.max(a.carHit, hit);
      b.carHit = Math.max(b.carHit, hit);
    }
  }

  recover(): void {
    const f = this.track.frameAt(this.s);
    this.pos.copy(f.position);
    this.pos.y += 0.1;
    this.yaw = Math.atan2(f.tangent.x, f.tangent.z);
    this.vx = 0;
    this.vz = 0;
    this.yawRate = 0;
    this.hint = -1;
  }
}

export class AIDriver {
  readonly vehicle: Vehicle;
  private track: Track;
  private player: Vehicle | null;
  private input: DriveInput = { throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };
  private laneBias: number;
  private lanePhase: number;
  private stuckFor = 0;
  private skill: number;
  pace = 1;
  private errorTimer = 0;
  private errorOffset = 0;

  constructor(vehicle: Vehicle, track: Track, player: Vehicle | null, skill: number, seed: number) {
    this.vehicle = vehicle;
    this.track = track;
    this.player = player;
    this.skill = skill;
    this.laneBias = ((seed % 3) - 1) * 0.5;
    this.lanePhase = seed * 1.7;
  }

  think(dt: number, elapsed: number): DriveInput {
    const v = this.vehicle;
    const i = this.input;
    i.throttle = 0; i.brake = 0; i.steer = 0; i.handbrake = false; i.nitro = false;
    const speed = Math.max(0, v.speed);
    const s = v.s;

    const maxLat = 9.81 * v.spec.grip * 0.9 * this.skill;
    const decel = v.spec.brake * 0.86;
    let target = v.spec.topSpeed * this.pace * (0.8 + this.skill * 0.1);
    let tightest = 0;
    for (const d of [0, 12, 28, 50, 78, 112, 150, 195]) {
      const f = this.track.frameAt(s + d);
      tightest = Math.max(tightest, Math.abs(f.curvature));
      const vCorner = Math.sqrt(maxLat / Math.max(Math.abs(f.curvature), 0.0005)) * (0.82 + this.skill * 0.1);
      target = Math.min(target, Math.sqrt(vCorner * vCorner + 2 * decel * d) * 0.94);
    }
    target = clamp(target, 12, v.spec.topSpeed * 1.03);

    // Occasional small error injection keeps rivals from feeling metronomic.
    this.errorTimer -= dt;
    if (this.errorTimer <= 0) {
      this.errorTimer = 3 + ((Math.sin(elapsed * 0.37 + this.lanePhase) + 1) * 2.5);
      this.errorOffset = (Math.sin(elapsed * 2.3 + this.lanePhase) * 0.8) * (1 - this.skill);
    }

    const wide = Math.abs(v.lateral) > 6.2;
    const offRoad = Math.abs(v.lateral) > ROAD_HALF + 1;
    if (wide) target = Math.min(target, 24);
    if (offRoad) target = Math.min(target, 13);
    if (speed < target - 1.5) i.throttle = 1;
    else if (speed > target + 2) i.brake = clamp((speed - target) / 7, 0.25, 1);
    else i.throttle = 0.35;

    const look = clamp(12 + speed * 0.4, 14, 42);
    const dest = this.track.frameAt(s + look);
    const apex = -Math.sign(dest.curvature) * clamp(Math.abs(dest.curvature) * 60, 0, 1.8);
    const wander = Math.sin(s * 0.011 + this.lanePhase) * 0.25;
    let offset = clamp(apex + this.laneBias + wander + this.errorOffset, -2.8, 2.8);
    if (wide) offset = clamp(offset - Math.sign(v.lateral) * 1.2, -3, 3);
    const tx = dest.position.x + dest.right.x * offset;
    const tz = dest.position.z + dest.right.z * offset;
    const desiredYaw = Math.atan2(tx - v.pos.x, tz - v.pos.z);
    const centreBias = clamp(v.lateral * 0.008, -0.12, 0.12);
    const headingErr = angleDelta(v.yaw, desiredYaw + centreBias);
    i.steer = clamp(-headingErr * 1.15 + v.yawRate * 0.32, -1, 1);

    if (this.player) {
      const dx = this.player.pos.x - v.pos.x;
      const dz = this.player.pos.z - v.pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 12 && dx * v.forwardX + dz * v.forwardZ > 0) {
        const side = Math.sign(dx * -v.forwardZ + dz * v.forwardX);
        i.steer = clamp(i.steer - side * 0.35, -1, 1);
      }
      const gap = this.player.progress - v.progress;
      if (gap > 60) this.pace = Math.min(1.07, 1 + gap * 0.0005);
      else if (gap < -60) this.pace = Math.max(0.94, 1 + gap * 0.00035);
      else this.pace = 1;
    }

    if (offRoad && speed < 30) {
      const centre = this.track.frameAt(s + 8);
      const recover = Math.atan2(centre.position.x - v.pos.x, centre.position.z - v.pos.z);
      i.steer = clamp(-angleDelta(v.yaw, recover) * 3.2, -1, 1);
      i.throttle = 0.45;
      i.brake = 0;
    }
    if (tightest > 0.04 && speed > 20 && speed > target * 1.15) {
      i.handbrake = true;
      i.brake = 0.3;
    }
    if (Math.abs(this.track.frameAt(s + 75).curvature) < 0.006 && v.nitro > 0.32
      && speed > 24 && (tightest < 0.012 || speed < target - 10)) {
      i.nitro = true;
      i.throttle = 1;
    }

    if (speed < 2 && i.throttle > 0.2) {
      this.stuckFor += dt;
      if (this.stuckFor > 1.6) {
        const f = this.track.frameAt(v.s);
        v.pos.set(f.position.x + f.right.x * clamp(v.lateral, -3, 3), v.pos.y, f.position.z + f.right.z * clamp(v.lateral, -3, 3));
        v.yaw = Math.atan2(f.tangent.x, f.tangent.z);
        v.vx = 0; v.vz = 0; v.hint = -1;
        this.stuckFor = 0;
      }
    } else this.stuckFor = 0;
    return i;
  }
}
