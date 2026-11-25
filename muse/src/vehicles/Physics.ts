import * as THREE from 'three';
import type { Track } from '../world/Track';
import type { CarSpec } from './Car';

// Fixed-timestep arcade bicycle model tuned for asphalt feel:
// high-speed stability + low-speed agility + controllable drift + wall scrape.
export class CarPhysics {
  pos = new THREE.Vector3();
  dir = 0;            // heading radians
  vel = new THREE.Vector3();
  speed = 0;          // forward speed m/s
  drift = 0;          // 0..1 drift amount
  trackIndex = 0;
  lapsDone = 0;           // completed laps (first start-line crossing only begins lap 1)
  hasCrossedStart = false;
  distance = 0;           // continuous unwrapped progress (index units) for positions
  wrongWay = false;
  nitro = 100;        // 0..100
  nitroActive = false;
  offTrack = false;

  private tmp = { pos: new THREE.Vector3(), dir: new THREE.Vector3(), side: new THREE.Vector3() };

  constructor(private track: Track, private spec: CarSpec) {
    this.reset(0);
  }

  reset(startIndex = 0) {
    this.track.frameAt(startIndex, this.tmp);
    const start = this.tmp.pos.clone();
    this.pos.copy(start);
    this.pos.y += 0.15;
    this.dir = Math.atan2(this.tmp.dir.x, this.tmp.dir.z);
    this.vel.set(0, 0, 0); this.speed = 0; this.drift = 0;
    this.trackIndex = startIndex;
    this.initRaceState();
    this.nitro = 100; this.nitroActive = false; this.wrongWay = false;
  }

  // (re)initialise lap + progress counters — call once at race spawn, NOT on reset
  initRaceState() {
    this.lapsDone = 0; this.hasCrossedStart = false; this.distance = 0;
  }

  placeAt(index: number, lateral: number) {
    this.track.frameAt(index, this.tmp);
    this.pos.copy(this.tmp.pos).addScaledVector(this.tmp.side, lateral);
    this.pos.y = this.tmp.pos.y + 0.15;
    this.dir = Math.atan2(this.tmp.dir.x, this.tmp.dir.z);
    this.vel.set(0, 0, 0); this.speed = 0;
    this.trackIndex = index;
  }

  update(dt: number, steer: number, throttle: number, brake: number, wantNitro: boolean, isPlayer: boolean) {
    const spec = this.spec;
    const fwd = new THREE.Vector3(Math.sin(this.dir), 0, Math.cos(this.dir));

    // nitro
    this.nitroActive = wantNitro && this.nitro > 1 && throttle > 0.05;
    if (this.nitroActive) this.nitro = Math.max(0, this.nitro - dt * 28);
    else this.nitro = Math.min(100, this.nitro + dt * (this.drift > 0.35 ? 9 : 4.5));

    const topSpeed = spec.topSpeed + (this.nitroActive ? spec.nitroPower : 0);
    const accel = spec.accel * (1 - Math.min(1, this.speed / (topSpeed * 1.35)));

    // longitudinal
    if (throttle > 0) this.speed += accel * throttle * dt * (this.nitroActive ? 1.5 : 1);
    if (brake > 0) this.speed -= (58 + this.speed * 0.9) * brake * dt;
    // drag + rolling
    this.speed -= this.speed * 0.28 * dt;
    this.speed -= Math.sign(this.speed) * Math.min(Math.abs(this.speed), 3.5 * dt);
    this.speed = THREE.MathUtils.clamp(this.speed, this.speed < -8 ? -12 : -12, topSpeed + 12);

    // steering: less authority at speed, drift widens angle
    const spd01 = Math.min(1, Math.abs(this.speed) / spec.topSpeed);
    const grip = spec.grip * (this.nitroActive ? 0.94 : 1);
    const steerAuthority = (2.4 * (1 - spd01 * 0.62)) * grip;
    const driftTarget = (brake > 0.4 && Math.abs(steer) > 0.35 && Math.abs(this.speed) > 18) ? 1 : 0;
    this.drift += (driftTarget - this.drift) * Math.min(1, dt * 4);
    const effSteer = steer * steerAuthority * (1 + this.drift * 0.55);
    // NOTE: steer +1 = right. fwd=(sin(dir),0,cos(dir)), so a right turn
    // must *decrease* dir (derivative of fwd wrt dir points screen-left).
    if (Math.abs(this.speed) > 0.5) this.dir -= effSteer * dt * Math.sign(this.speed) * (1 - this.drift * 0.25);

    // velocity: blend heading with lateral slide when drifting
    const targetVel = fwd.clone().multiplyScalar(this.speed);
    const lateralKeep = THREE.MathUtils.clamp(this.drift * 0.55, 0, 0.55);
    this.vel.lerp(targetVel, 1 - lateralKeep * Math.min(1, dt * 8));
    // when not drifting, snap velocity to heading (grip)
    if (this.drift < 0.15) this.vel.copy(targetVel).multiplyScalar(0.92).add(this.vel.clone().multiplyScalar(0.08));

    this.pos.addScaledVector(this.vel, dt);

    // track constraint: soft walls with scrape slowdown
    const q = this.track.nearestIndex(this.pos, this.trackIndex, 30);
    this.trackIndex = q.index;
    const halfW = this.track.widths[q.index] / 2 - 0.9;
    this.offTrack = false;
    if (Math.abs(q.lateral) > halfW) {
      const over = Math.abs(q.lateral) - halfW;
      const push = Math.sign(q.lateral) * Math.min(over, 6 * dt + over * 0.5);
      this.track.frameAt(q.index, this.tmp);
      this.pos.addScaledVector(this.tmp.side, -push);
      // scrape: kill outward velocity + slow
      const sideVel = this.vel.dot(this.tmp.side);
      if (Math.sign(sideVel) === Math.sign(q.lateral)) this.vel.addScaledVector(this.tmp.side, -sideVel * Math.min(1, 6 * dt));
      this.speed *= 1 - Math.min(0.5, 2.2 * dt);
      if (isPlayer) this.drift = Math.max(this.drift, 0.25);
    }

    // lap / progress: detect start-line crossings + accumulate unwrapped distance.
    // NOTE: the old lastCheckpoint scheme updated the reference every frame, so the
    // lap++ threshold (>40% track jump) could never fire — laps never counted.
    const n = this.track.centerPoints.length;
    const prevRaw = this.trackIndex;
    this.trackIndex = q.index;
    let dRaw = q.index - prevRaw;
    if (dRaw < -n / 2) dRaw += n; else if (dRaw > n / 2) dRaw -= n;
    this.distance += dRaw;

    this.track.frameAt(q.index, this.tmp);
    const along = this.vel.dot(this.tmp.dir);
    const crossedForward = prevRaw > n * 0.75 && q.index < n * 0.25 && along > 5;
    const crossedBackward = prevRaw < n * 0.25 && q.index > n * 0.75 && along < -5;
    if (crossedForward) {
      if (!this.hasCrossedStart) this.hasCrossedStart = true; // lap 1 begins
      else this.lapsDone++;
    } else if (crossedBackward) {
      // reversing back over the line undoes the count
      if (this.lapsDone > 0) this.lapsDone--;
      else this.hasCrossedStart = false;
    }
    // wrong way: moving opposite to track direction
    this.wrongWay = along < -6 && this.speed > 8;

    // stick to track height
    this.pos.y += (this.track.centerPoints[q.index].y + 0.15 - this.pos.y) * Math.min(1, dt * 10);
  }

  get speedKmh() { return Math.abs(this.speed) * 3.6; }
  get rpm01() { return Math.min(1, Math.abs(this.speed) / (this.spec.topSpeed + this.spec.nitroPower)); }
}
