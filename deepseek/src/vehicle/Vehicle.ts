import * as THREE from 'three';
import { CarModel, CarSpec } from '../vehicle/CarModel';
import { TextureSet } from '../core/Textures';
import { Track, TrackFrame, TrackHit, ROAD_HALF, WALL_LAT } from '../world/Track';
import { angleDelta, clamp, damp, lerp, TAU } from '../core/Math';

export interface DriveInput {
  throttle: number;
  brake: number;
  steer: number;
  handbrake: boolean;
  nitro: boolean;
}

export const createInput = (): DriveInput => ({
  throttle: 0,
  brake: 0,
  steer: 0,
  handbrake: false,
  nitro: false,
});

const WHEELBASE = 2.98;
const COLLIDE_RADIUS = 1.12;

export class Vehicle {
  readonly spec: CarSpec;
  readonly model: CarModel;
  readonly track: Track;
  readonly isPlayer: boolean;

  pos = new THREE.Vector3();
  yaw = 0;
  vx = 0;
  vz = 0;
  yawRate = 0;
  steerAngle = 0;
  speed = 0;
  speedAbs = 0;
  slip = 0;
  drift = 0;
  drifting = false;
  nitro = 1;
  nitroActive = false;
  gear = 1;
  rpm = 1400;
  lap = 0;
  s = 0;
  lateral = 0;
  progress = 0;
  lapStart = 0;
  bestLap = 0;
  lastLap = 0;
  lapTimes: number[] = [];
  finished = false;
  finishTime = 0;
  position = 1;
  wallHit = 0;
  carHit = 0;
  offRoad = false;
  onRoad = true;
  hint = -1;
  ai: AIDriver | null = null;

  private hit: TrackHit;
  private frame: TrackFrame;
  private baseY = 0;
  private prevSpeed = 0;
  private roll = 0;
  private pitch = 0;
  steerInput = 0;
  driverName = '';
  private elapsed = 0;

  constructor(
    scene: THREE.Scene,
    track: Track,
    spec: CarSpec,
    textures: TextureSet,
    isPlayer: boolean,
  ) {
    this.spec = spec;
    this.track = track;
    this.isPlayer = isPlayer;
    this.model = new CarModel(spec, textures);
    this.hit = track.nearest(new THREE.Vector3(), -1);
    this.frame = track.frameAt(0);
    scene.add(this.model.root);
  }

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
    this.speed = 0;
    this.speedAbs = 0;
    this.slip = 0;
    this.drift = 0;
    this.drifting = false;
    this.nitro = 1;
    this.nitroActive = false;
    this.lap = 0;
    this.progress = this.hit.s;
    this.lapStart = time;
    this.bestLap = 0;
    this.lastLap = 0;
    this.lapTimes = [];
    this.finished = false;
    this.finishTime = 0;
    this.wallHit = 0;
    this.carHit = 0;
    this.offRoad = false;
    this.onRoad = true;
    this.prevSpeed = 0;
    this.model.root.position.set(this.pos.x, this.baseY + 0.02, this.pos.z);
    this.model.root.rotation.set(0, this.yaw, 0);
    this.model.setBodyTilt(0, 0);
  }

  get forwardX(): number {
    return Math.sin(this.yaw);
  }

  get forwardZ(): number {
    return Math.cos(this.yaw);
  }

  get speedKmh(): number {
    return this.speedAbs * 3.6;
  }

  get midY(): number {
    return this.baseY + 0.55;
  }

  get groundY(): number {
    return this.baseY;
  }

  update(dt: number, input: DriveInput): void {
    this.elapsed += dt;
    const canDrive = true;
    const fwdX = Math.sin(this.yaw);
    const fwdZ = Math.cos(this.yaw);
    const rightX = -fwdZ;
    const rightZ = fwdX;

    let vLong = this.vx * fwdX + this.vz * fwdZ;
    let vLat = this.vx * rightX + this.vz * rightZ;

    const handbrake = input.handbrake && canDrive;
    const onRoad = Math.abs(this.lateral) < ROAD_HALF + 0.7;
    this.onRoad = onRoad;
    const surfaceGrip = onRoad ? 1 : 0.6;
    const topSpeed = this.spec.topSpeed * (this.nitroActive ? 1.12 : 1) * (onRoad ? 1 : 0.55);

    // Nitro management.
    const wantsNitro = input.nitro && this.nitro > 0.01 && vLong > 3 && input.throttle > 0.05;
    this.nitroActive = wantsNitro;
    if (wantsNitro) {
      this.nitro = Math.max(0, this.nitro - dt * (0.155 / this.spec.nitro));
    } else {
      this.nitro = Math.min(1, this.nitro + dt * (0.028 + this.drift * 0.09));
    }

    // Longitudinal forces. Throttle and brake form a signed drive input:
    // throttle cancels reverse and drives forward; brake slows a forward car
    // and, once nearly stopped, engages reverse. This also prevents the
    // "stuck while reversing" case where throttle used to be ignored.
    const drive = clamp(input.throttle - input.brake, -1, 1);
    const forwardRatio = clamp(Math.max(0, vLong) / Math.max(1, topSpeed), 0, 1.2);
    const surfaceDrive = onRoad ? 1 : 0.55;

    if (drive > 0.02) {
      let accel = drive * this.spec.accel * (1 - 0.64 * forwardRatio * forwardRatio) * surfaceDrive;
      if (wantsNitro) accel += 8.5;
      // When reversing, throttle doubles as a strong service brake.
      if (vLong < 0) accel += drive * this.spec.brake * 0.55;
      vLong += accel * dt;
    } else if (drive < -0.02) {
      const brakeInput = -drive;
      if (vLong > 0.4) {
        vLong -= brakeInput * this.spec.brake * dt;
      } else {
        // Reverse gear: cap at ~47 km/h so it stays controllable.
        const reverseAccel = 7.6 * (onRoad ? 1 : 0.6);
        vLong -= brakeInput * reverseAccel * dt;
        if (vLong < -13) vLong = -13;
      }
    }

    if (input.handbrake) {
      const decel = 6.5 * dt;
      vLong -= Math.sign(vLong) * Math.min(Math.abs(vLong), decel);
    }

    // Rolling resistance and aero drag when coasting, plus off-road drag.
    if (Math.abs(drive) < 0.02) {
      const rolling = 1.1 + 0.00045 * vLong * vLong;
      vLong -= Math.sign(vLong) * Math.min(Math.abs(vLong), rolling * dt);
    }
    if (!onRoad) {
      vLong -= Math.sign(vLong) * Math.min(Math.abs(vLong), 2.2 * dt);
    }

    if (vLong > topSpeed) vLong = damp(vLong, topSpeed, 4, dt);
    if (vLong < -13) vLong = -13;
    if (Math.abs(vLong) < 0.015 && Math.abs(drive) < 0.02) vLong = 0;

    // Steering / yaw.
    const speedForInput = clamp(Math.abs(vLong) / 28, 0, 1);
    const inputResponse = lerp(16, 22, speedForInput);
    this.steerInput = damp(this.steerInput, input.steer, inputResponse, dt);
    const speedFactor = clamp(Math.abs(vLong) / Math.max(8, this.spec.topSpeed), 0, 1);
    const maxSteer = lerp(0.6, 0.2, speedFactor);
    const steerTarget = this.steerInput * maxSteer;
    const steerResponse = lerp(17, 22, speedForInput);
    this.steerAngle = damp(this.steerAngle, steerTarget, steerResponse, dt);

    const maxLat = 9.81 * this.spec.grip * (handbrake ? 1.25 : 1.42) * surfaceGrip;
    const maxYaw = maxLat / Math.max(6, Math.abs(vLong));
    let yawTarget = -(vLong / WHEELBASE) * Math.tan(this.steerAngle);
    yawTarget = clamp(yawTarget, -maxYaw, maxYaw);
    if (handbrake && Math.abs(vLong) > 8) yawTarget *= 1.28;
    // Arcade turn-in assist: give the car meaningful high-speed steering
    // authority beyond the pure tyre limit. Scales with speed so parking
    // manoeuvres stay calm and flips sign in reverse.
    const assistGain = this.isPlayer ? 0.5 : 0.22;
    const assist = assistGain * clamp((Math.abs(vLong) - 4) / 40, 0, 1) * Math.sign(vLong || 1);
    yawTarget += -this.steerInput * assist;
    // Cap low-speed yaw so parking/manoeuvring is smooth; the cap disappears
    // by racing speed, preserving the sharp high-speed turn-in.
    const lowSpeedYawCap = clamp(1.55 + (Math.abs(vLong) - 4) * 0.035, 1.55, 3.2);
    yawTarget = clamp(yawTarget, -lowSpeedYawCap, lowSpeedYawCap);
    const yawResponse = handbrake ? 4.2 : lerp(9.0, 11.5, speedForInput);
    this.yawRate = damp(this.yawRate, yawTarget, yawResponse, dt);
    this.yaw += this.yawRate * dt;
    if (this.yaw > Math.PI) this.yaw -= TAU;
    if (this.yaw < -Math.PI) this.yaw += TAU;

    // Tyres scrub lateral velocity, then the updated local velocity is rotated
    // into the new heading. (Do not re-project the old world velocity here:
    // that would throw away the engine/brake forces applied above.)
    const grip = (onRoad ? 1 : 0.45) * (handbrake ? 0.2 : 1);
    const latDamp = (7.6 + this.spec.grip * 2.6) * grip;
    vLat *= Math.exp(-latDamp * dt);
    vLat = clamp(vLat, -24, 24);
    // Anti-creep only when coasting; never while reverse/brake/throttle is held.
    if (Math.abs(vLong) < 0.25 && Math.abs(drive) < 0.02) vLong *= 0.85;

    const nfX = Math.sin(this.yaw);
    const nfZ = Math.cos(this.yaw);
    const nrX = -nfZ;
    const nrZ = nfX;
    this.vx = nfX * vLong + nrX * vLat;
    this.vz = nfZ * vLong + nrZ * vLat;

    // Integrate.
    this.pos.x += this.vx * dt;
    this.pos.z += this.vz * dt;

    // Track projection, barriers, surface.
    const hit = this.track.nearest(this.pos, this.hint, this.hit);
    this.hint = hit.index;
    this.s = hit.s;
    this.lateral = hit.lateral;
    const limit = WALL_LAT - 0.95;
    if (Math.abs(this.lateral) > limit) {
      const side = Math.sign(this.lateral);
      const over = Math.abs(this.lateral) - limit;
      const rightX3 = hit.right.x;
      const rightZ3 = hit.right.z;
      this.pos.x -= rightX3 * over * side;
      this.pos.z -= rightZ3 * over * side;
      const outward = this.vx * rightX3 + this.vz * rightZ3;
      const impact = outward * side;
      if (impact > 0) {
        // Remove only the outward component (with a small bounce), and apply
        // friction to the along-wall component proportional to the impact.
        // Never scrub the whole velocity every step: that glues the car to
        // the barrier and makes reversing away impossible.
        this.vx -= rightX3 * outward * 1.08;
        this.vz -= rightZ3 * outward * 1.08;
        const tangential = this.vx * hit.tangent.x + this.vz * hit.tangent.z;
        const friction = clamp(impact * 0.012, 0, 0.18);
        this.vx -= hit.tangent.x * tangential * friction;
        this.vz -= hit.tangent.z * tangential * friction;
        this.wallHit = Math.max(this.wallHit, clamp(impact / 12, 0.15, 1));
      }
      vLong = this.vx * nfX + this.vz * nfZ;
      this.lateral = side * limit;
      const clamped = this.track.nearest(this.pos, this.hint, this.hit);
      this.hint = clamped.index;
      this.s = clamped.s;
      this.lateral = clamped.lateral;
    }

    this.offRoad = Math.abs(this.lateral) > ROAD_HALF + 1.25;
    const frame = this.track.frameAt(this.s, this.frame);
    const surfaceY = frame.pos.y + hit.lateral * Math.tan(frame.bank);
    this.baseY = damp(this.baseY, surfaceY, 16, dt);

    // Drift telemetry.
    this.speed = vLong;
    this.speedAbs = Math.hypot(this.vx, this.vz);
    this.slip = Math.abs(Math.atan2(vLat, Math.max(2, Math.abs(vLong))));
    this.drifting = this.slip > 0.12 && this.speedAbs > 8;
    this.drift = damp(this.drift, this.drifting ? clamp(this.slip * 1.6, 0, 1) : 0, 4, dt);

    // Gearbox / RPM.
    if (vLong < -0.3) {
      this.gear = 1;
      const reverseLoad = clamp(Math.abs(vLong) / 13, 0, 1);
      this.rpm = damp(this.rpm, 1500 + reverseLoad * 2400, 9, dt);
    } else {
      const ratioGear = clamp(Math.abs(vLong) / Math.max(4, this.spec.topSpeed), 0, 1.05);
      this.gear = clamp(1 + Math.floor(ratioGear * 6.4), 1, 7);
      const seg = 6.4;
      const segStart = (this.gear - 1) / seg;
      const segEnd = this.gear / seg;
      const within = clamp((ratioGear - segStart) / Math.max(0.01, segEnd - segStart), 0, 1);
      const targetRpm = 1600 + within * 6400 + (this.nitroActive ? 400 : 0);
      this.rpm = damp(this.rpm, targetRpm, 8, dt);
    }

    // Progress.
    this.progress = this.lap * this.track.length + this.s;

    // Visual placement on the banked surface.
    const normal = new THREE.Vector3(0, 1, 0)
      .addScaledVector(frame.right, -Math.tan(frame.bank))
      .normalize();
    const fwd = new THREE.Vector3(nfX, 0, nfZ);
    fwd.addScaledVector(normal, -fwd.dot(normal)).normalize();
    const xAxis = new THREE.Vector3().crossVectors(normal, fwd).normalize();
    const yAxis = new THREE.Vector3().crossVectors(fwd, xAxis).normalize();
    const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, fwd);
    const targetQ = new THREE.Quaternion().setFromRotationMatrix(basis);
    this.model.root.quaternion.slerp(targetQ, 1 - Math.exp(-18 * dt));
    this.model.root.position.set(this.pos.x, this.baseY + 0.01, this.pos.z);

    const longAccel = clamp((vLong - this.prevSpeed) / Math.max(dt, 1e-4), -40, 40);
    this.prevSpeed = vLong;
    const latAccel = this.yawRate * vLong;
    const rollTarget = clamp(latAccel * 0.0038, -0.07, 0.07);
    const pitchTarget = clamp(longAccel * 0.0035, -0.055, 0.055);
    this.roll = damp(this.roll, rollTarget, 7, dt);
    this.pitch = damp(this.pitch, pitchTarget, 5, dt);
    this.model.setBodyTilt(this.roll, this.pitch);

    this.model.updateVisual(
      dt,
      vLong,
      this.steerInput,
      this.slip,
      input.brake > 0.15 || handbrake,
    );
  }

  /** Simple circle collision between cars. */
  static resolveCollision(a: Vehicle, b: Vehicle): void {
    const dx = b.pos.x - a.pos.x;
    const dz = b.pos.z - a.pos.z;
    const dist = Math.hypot(dx, dz);
    const min = COLLIDE_RADIUS * 2;
    if (dist > min || dist < 0.0001) return;
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
      a.carHit = Math.max(a.carHit, clamp(Math.abs(relative) / 10, 0.1, 1));
      b.carHit = Math.max(b.carHit, clamp(Math.abs(relative) / 10, 0.1, 1));
    }
  }

  get collisionRadius(): number {
    return COLLIDE_RADIUS;
  }

  get forward(): THREE.Vector3 {
    return new THREE.Vector3(this.forwardX, 0, this.forwardZ);
  }
}

/** Racing-line follower with corner-speed preview and rubber-banding. */
export class AIDriver {
  readonly vehicle: Vehicle;
  private track: Track;
  private player: Vehicle | null;
  private input: DriveInput = createInput();
  private laneBias: number;
  private lanePhase: number;
  private stuckFor = 0;
  private skill: number;
  pace = 1;

  constructor(vehicle: Vehicle, track: Track, player: Vehicle | null, skill: number, seed: number) {
    this.vehicle = vehicle;
    this.track = track;
    this.player = player;
    this.skill = skill;
    this.laneBias = (seed % 3 - 1) * 0.45;
    this.lanePhase = seed * 1.7;
  }

  think(dt: number): DriveInput {
    const v = this.vehicle;
    const input = this.input;
    input.throttle = 0;
    input.brake = 0;
    input.steer = 0;
    input.handbrake = false;
    input.nitro = false;

    const speed = Math.max(0, v.speed);
    const total = this.track.length;
    const s = v.s;

    // Find the lowest speed the upcoming road allows. Corner speed is kept
    // below the tyre limit and braking distances are accounted for, so the
    // pack does not understeer into the barriers.
    const maxLat = 9.81 * v.spec.grip * 0.9 * this.skill;
    const decel = v.spec.brake * 0.86;
    let target = v.spec.topSpeed * this.pace * (0.8 + this.skill * 0.1);
    const previews = [0, 12, 28, 50, 78, 112, 150, 195];
    let tightest = 0;
    for (const d of previews) {
      const f = this.track.frameAt(s + d);
      const curv = Math.abs(f.curvature);
      tightest = Math.max(tightest, curv);
      const vCorner = Math.sqrt(maxLat / Math.max(curv, 0.0005)) * (0.82 + this.skill * 0.1);
      const allowed = Math.sqrt(vCorner * vCorner + 2 * decel * d) * 0.94;
      target = Math.min(target, allowed);
    }
    target = clamp(target, 12, v.spec.topSpeed * 1.03);

    // Ease off when already wide or off the road, and recover to the centre.
    const wide = Math.abs(v.lateral) > 6.2;
    const offRoad = Math.abs(v.lateral) > ROAD_HALF + 1;
    if (wide) target = Math.min(target, 24);
    if (offRoad) target = Math.min(target, 13);

    if (speed < target - 1.5) input.throttle = 1;
    else if (speed > target + 2) input.brake = clamp((speed - target) / 7, 0.25, 1);
    else input.throttle = 0.35;

    // Pure-pursuit steering with an apex-seeking lateral offset. The long
    // lookahead and yaw-rate damping keep it stable at 300 km/h.
    const look = clamp(12 + speed * 0.4, 14, 42);
    const destF = this.track.frameAt(s + look);
    const apex = -Math.sign(destF.curvature) * clamp(Math.abs(destF.curvature) * 60, 0, 1.8);
    const laneWander = Math.sin(s * 0.011 + this.lanePhase) * 0.25;
    let offset = clamp(apex + this.laneBias + laneWander, -2.6, 2.6);
    if (wide) offset = clamp(offset - Math.sign(v.lateral) * 1.2, -3, 3);
    const tx = destF.pos.x + destF.right.x * offset;
    const tz = destF.pos.z + destF.right.z * offset;
    const desiredYaw = Math.atan2(tx - v.pos.x, tz - v.pos.z);
    const centreBias = clamp(v.lateral * 0.008, -0.12, 0.12);
    const headingErr = angleDelta(v.yaw, desiredYaw + centreBias);
    input.steer = clamp(-headingErr * 1.15 + v.yawRate * 0.32, -1, 1);

    // Avoid the player when close ahead.
    if (this.player) {
      const dx = this.player.pos.x - v.pos.x;
      const dz = this.player.pos.z - v.pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 12) {
        const ahead = dx * v.forwardX + dz * v.forwardZ;
        if (ahead > 0) {
          const side = Math.sign(dx * -v.forwardZ + dz * v.forwardX);
          input.steer = clamp(input.steer - side * 0.35, -1, 1);
        }
      }
    }

    // If the car is off the road, forget the racing line and aim for the tarmac.
    if (offRoad && speed < 30) {
      const centre = this.track.frameAt(s + 8);
      const recoverYaw = Math.atan2(centre.pos.x - v.pos.x, centre.pos.z - v.pos.z);
      input.steer = clamp(-angleDelta(v.yaw, recoverYaw) * 3.2, -1, 1);
      input.throttle = 0.45;
      input.brake = 0;
    }

    // Tight hairpins get a handbrake flick.
    if (tightest > 0.04 && speed > 20 && speed > target * 1.15) {
      input.handbrake = true;
      input.brake = 0.3;
    }

    // Rubber band around the player.
    if (this.player) {
      const gap = this.player.progress - v.progress;
      if (gap > 60) this.pace = Math.min(1.07, 1 + gap * 0.0005);
      else if (gap < -60) this.pace = Math.max(0.94, 1 + gap * 0.00035);
      else this.pace = 1;
    }

    const straightAhead = Math.abs(this.track.frameAt(s + 75).curvature) < 0.006;
    if (straightAhead && v.nitro > 0.32 && speed > 24 && (tightest < 0.012 || speed < target - 10)) {
      input.nitro = true;
      input.throttle = 1;
    }

    // Keep the nose pointing down the road if we get turned around.
    if (Math.abs(v.lateral) > ROAD_HALF + 1 && speed < 10) {
      input.steer = clamp(-angleDelta(v.yaw, Math.atan2(v.forwardX, v.forwardZ)) * 0.1, -0.4, 0.4);
    }

    // Unstick.
    if (speed < 2 && input.throttle > 0.2) {
      this.stuckFor += dt;
      if (this.stuckFor > 1.6) {
        const f = this.track.frameAt(v.s);
        v.pos.set(f.pos.x + f.right.x * clamp(v.lateral, -3, 3), v.pos.y, f.pos.z + f.right.z * clamp(v.lateral, -3, 3));
        v.yaw = Math.atan2(f.tangent.x, f.tangent.z);
        v.vx = 0;
        v.vz = 0;
        v.hint = -1;
        this.stuckFor = 0;
      }
    } else {
      this.stuckFor = 0;
    }

    // Do not disturb the start countdown.
    return input;
  }
}
