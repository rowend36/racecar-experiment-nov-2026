import * as THREE from 'three';
import type { Track } from '../world/Track';
import type { CarPhysics } from './Physics';

// Rubber-band spline follower with per-driver aggression + lane offsets + mistakes.
export class AIController {
  lane = 0;
  private aggression: number;
  private wobble = Math.random() * 100;
  private tmp = { pos: new THREE.Vector3(), dir: new THREE.Vector3(), side: new THREE.Vector3() };
  steer = 0; throttle = 1; brake = 0; nitro = false;
  private nitroTimer = 0;

  constructor(private track: Track, difficulty = 0.5) {
    this.lane = (Math.random() - 0.5) * 6;
    this.aggression = 0.72 + difficulty * 0.28 + (Math.random() - 0.5) * 0.1;
  }

  update(dt: number, time: number, phys: CarPhysics, playerDistance: number) {
    const n = this.track.centerPoints.length;
    const lookAhead = 14 + phys.speed * 0.55;
    const idx = Math.floor(phys.trackIndex);
    // target point ahead on spline + lane
    const aheadIdx = (idx + Math.floor(lookAhead * 1.4)) % n;
    this.track.frameAt(aheadIdx, this.tmp);
    const target = this.tmp.pos.clone().addScaledVector(this.tmp.side, this.lane * 0.5);
    // wobble lane a touch for organic feel
    target.addScaledVector(this.tmp.side, Math.sin(time * 0.5 + this.wobble) * 0.8);

    const toT = target.clone().sub(phys.pos); toT.y = 0;
    const desired = Math.atan2(toT.x, toT.z);
    let dAng = desired - phys.dir;
    while (dAng > Math.PI) dAng -= Math.PI * 2;
    while (dAng < -Math.PI) dAng += Math.PI * 2;
    // steer +1 = right = decreasing dir, so negate the angle error.
    this.steer = THREE.MathUtils.clamp(-dAng * 2.4, -1, 1);

    // corner slowdown: look at curvature ahead
    const i1 = (idx + 12) % n, i2 = (idx + 30) % n;
    const d1 = this.track.centerPoints[(i1 + 3) % n].clone().sub(this.track.centerPoints[i1]);
    const d2 = this.track.centerPoints[(i2 + 3) % n].clone().sub(this.track.centerPoints[i2]);
    const curve = d1.normalize().angleTo(d2.normalize());
    const cornerSeverity = Math.min(1, curve * 6);

    const targetSpeed = 62 * this.aggression - cornerSeverity * 30 * (2 - this.aggression);
    this.throttle = phys.speed < targetSpeed ? 1 : 0.15;
    this.brake = phys.speed > targetSpeed + 6 ? 0.8 : 0;

    // rubber band: slower if ahead of player, faster if behind (unwrapped distances)
    const gap = phys.distance - playerDistance;
    if (gap > 60) { this.throttle *= 0.85; }
    if (gap < -60) { this.throttle = 1; this.brake *= 0.4; }

    // occasional nitro on straights
    this.nitroTimer -= dt;
    this.nitro = false;
    if (cornerSeverity < 0.15 && phys.speed > 40 && this.nitroTimer <= 0 && Math.random() < dt * 0.25) {
      this.nitroTimer = 2.2 + Math.random() * 2;
    }
    if (this.nitroTimer > 1.2 && cornerSeverity < 0.2) this.nitro = true;

    // change lane occasionally
    if (Math.random() < dt * 0.2) this.lane = THREE.MathUtils.clamp(this.lane + (Math.random() - 0.5) * 4, -5, 5);
  }
}
