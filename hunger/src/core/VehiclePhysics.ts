import { Vector3 } from 'three';
import { Track, type NearestTrackPoint } from './Track';
import type { GameSettings, InputFrame } from '../game/types';

export interface PhysicsEvents {
  impact: number;
  offroad: boolean;
  drifting: boolean;
  wrongWay: boolean;
}

const FIXED_STEP = 1 / 120;
const MAX_SPEED = 78;
const WHEELBASE = 2.72;

/** Arcade-sim vehicle dynamics: momentum, load-sensitive grip, drifting and barriers. */
export class VehiclePhysics {
  readonly position = new Vector3();
  readonly velocity = new Vector3();
  readonly nearest: NearestTrackPoint;
  yaw = 0;
  pitch = 0;
  roll = 0;
  steer = 0;
  speed = 0;
  trackIndex = -1;
  offroad = false;
  drifting = false;
  wrongWay = false;
  impact = 0;

  private readonly forwardVector = new Vector3();
  private readonly right = new Vector3();
  private readonly facing = new Vector3();
  private readonly settings: GameSettings;
  private readonly track: Track;

  constructor(track: Track, settings: GameSettings) {
    this.track = track;
    this.settings = settings;
    this.nearest = track.nearest(new Vector3(), -1);
    this.reset(track.gridDistance, 0);
  }

  reset(distance: number, lateral = 0): void {
    const sample = this.track.sampleAt(distance);
    this.position.copy(sample.position).addScaledVector(sample.right, lateral);
    this.position.y += 0.04;
    this.yaw = Math.atan2(sample.tangent.x, sample.tangent.z);
    this.pitch = -Math.asin(sample.tangent.y);
    this.roll = 0;
    this.velocity.set(0, 0, 0);
    this.speed = 0;
    this.steer = 0;
    this.trackIndex = Math.floor((distance / this.track.totalLength) * this.track.samples.length);
    this.track.nearest(this.position, this.trackIndex, this.nearest);
    this.offroad = false;
    this.drifting = false;
    this.wrongWay = false;
    this.impact = 0;
  }

  step(input: InputFrame, deltaTime = FIXED_STEP): PhysicsEvents {
    const dt = Math.min(deltaTime, 0.05);
    this.forwardVector.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    this.right.set(this.forwardVector.z, 0, -this.forwardVector.x);
    let forwardSpeed = this.velocity.dot(this.forwardVector);
    let lateralSpeed = this.velocity.dot(this.right);
    const absoluteSpeed = Math.abs(forwardSpeed);

    const sensitivity = Math.max(0.35, Math.min(1, this.settings.steeringSensitivity));
    const steeringLimit = 0.46 / (1 + absoluteSpeed * 0.075);
    // The model faces local +Z, so positive screen-right input requires negative yaw.
    const targetSteer = -input.steer * steeringLimit * sensitivity;
    const steeringResponse = Math.abs(targetSteer) > Math.abs(this.steer) ? 6 : 8.5;
    this.steer += (targetSteer - this.steer) * (1 - Math.exp(-steeringResponse * dt));

    let acceleration = 0;
    if (input.throttle > 0) {
      acceleration += input.throttle * 15.8 * Math.max(0.18, 1 - Math.max(0, forwardSpeed) / 105);
      if (Math.abs(this.steer) > 0.12 && forwardSpeed > 35 && this.settings.steeringAssist) {
        acceleration *= 0.82;
      }
    }
    if (input.brake > 0) {
      if (forwardSpeed > 0.8) acceleration -= input.brake * 28;
      else acceleration -= input.brake * 7.5;
    }
    if (input.throttle > 0 && forwardSpeed < -0.5) acceleration += input.brake * 34;
    const rollingResistance = 0.32 + absoluteSpeed * 0.022 + absoluteSpeed * absoluteSpeed * 0.00115;
    acceleration -= Math.sign(forwardSpeed) * rollingResistance;
    if (input.handbrake) acceleration -= Math.sign(forwardSpeed) * 5.5;
    if (this.offroad) acceleration -= Math.sign(forwardSpeed) * (3.5 + absoluteSpeed * 0.045);

    forwardSpeed += acceleration * dt;
    if (!input.throttle && !input.brake && Math.abs(forwardSpeed) < 0.12) forwardSpeed = 0;
    forwardSpeed = Math.max(-8, Math.min(MAX_SPEED, forwardSpeed));

    const lowSpeedSteering = input.throttle
      * Math.tan(this.steer)
      * 0.9
      * Math.max(0, 1 - absoluteSpeed / 4);
    const requestedYawRate = (forwardSpeed / WHEELBASE)
      * Math.tan(this.steer)
      * (input.handbrake ? 1.42 : 1)
      * (1 - Math.min(0.32, absoluteSpeed / 260))
      + lowSpeedSteering;
    const maxYawRate = (1.65 / (1 + absoluteSpeed * 0.022)) * (input.handbrake ? 1.5 : 1);
    const yawRate = Math.max(-maxYawRate, Math.min(maxYawRate, requestedYawRate));
    this.yaw += yawRate * dt;

    this.forwardVector.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    this.right.set(this.forwardVector.z, 0, -this.forwardVector.x);
    const grip = this.offroad ? 2.1 : input.handbrake ? 1.45 : this.settings.steeringAssist ? 8.4 : 6.4;
    lateralSpeed *= Math.exp(-grip * dt);
    this.velocity.copy(this.forwardVector).multiplyScalar(forwardSpeed).addScaledVector(this.right, lateralSpeed);
    this.position.addScaledVector(this.velocity, dt);
    this.speed = forwardSpeed;
    this.impact = Math.max(0, this.impact - dt * 2.8);

    this.track.nearest(this.position, this.trackIndex, this.nearest, 42);
    this.trackIndex = this.nearest.index;
    this.offroad = Math.abs(this.nearest.lateral) > this.track.roadHalfWidth - 0.25;
    this.drifting = Math.abs(lateralSpeed) > 2.3 && absoluteSpeed > 13;
    this.wrongWay = this.nearest.tangent.dot(this.velocity) < -2.5 && absoluteSpeed > 4;
    this.position.y = this.nearest.position.y + 0.04;
    this.velocity.y = 0;
    this.pitch = -Math.asin(this.nearest.tangent.y);
    this.roll += ((-this.steer * forwardSpeed * 0.006) - this.roll) * Math.min(1, dt * 6);

    const barrierLimit = this.track.roadHalfWidth + 1.45;
    if (Math.abs(this.nearest.lateral) > barrierLimit) {
      const side = Math.sign(this.nearest.lateral);
      const penetration = Math.abs(this.nearest.lateral) - barrierLimit;
      this.position.addScaledVector(this.nearest.right, -side * penetration);
      const impactVelocity = this.velocity.dot(this.nearest.right) * side;
      if (impactVelocity > 0) {
        this.velocity.addScaledVector(this.nearest.right, -side * impactVelocity * 1.22);
        this.impact = Math.min(1, Math.abs(impactVelocity) / 15 + Math.abs(forwardSpeed) / 70);
        this.velocity.multiplyScalar(0.78);
      }
      this.speed = this.velocity.dot(this.forwardVector);
      this.track.nearest(this.position, this.trackIndex, this.nearest);
      this.position.y = this.nearest.position.y + 0.04;
    }

    return {
      impact: this.impact,
      offroad: this.offroad,
      drifting: this.drifting,
      wrongWay: this.wrongWay,
    };
  }

  get forward(): Vector3 {
    return this.facing.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
  }

  get rpm(): number {
    const speed = Math.abs(this.speed) * 3.6;
    const thresholds = [0, 24, 49, 77, 108, 142, 179, 220, 290];
    let gear = 1;
    for (let index = 1; index < thresholds.length - 1; index += 1) {
      if (speed >= thresholds[index]) gear = index + 1;
    }
    const low = thresholds[gear - 1];
    const high = thresholds[gear] ?? 310;
    const normalized = Math.max(0, Math.min(1, (speed - low) / (high - low)));
    return 1100 + normalized * 6600 + (this.speed < 0 ? -300 : 0);
  }

  get gear(): number {
    if (this.speed < -0.5) return -1;
    const speed = this.speed * 3.6;
    const thresholds = [24, 49, 77, 108, 142, 179, 220];
    return 1 + thresholds.filter((threshold) => speed >= threshold).length;
  }
}

export const PHYSICS_STEP = FIXED_STEP;
