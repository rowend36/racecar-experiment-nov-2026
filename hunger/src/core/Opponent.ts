import { Vector3 } from 'three';
import { Track, wrapDistance, type TrackSample } from './Track';
import { TOTAL_LAPS } from '../game/types';
import type { VehicleVisual } from '../render/vehicle';

export class Opponent {
  readonly position = new Vector3();
  readonly visual: VehicleVisual;
  readonly startOffset: number;
  readonly name: string;
  distance = 0;
  speed = 0;
  finished = false;
  finishTime = 0;
  private readonly track: Track;
  private readonly sample: TrackSample;
  private readonly lookAhead: TrackSample;
  private readonly cornerSample: TrackSample;
  private readonly topSpeed: number;
  private readonly raceDistance: number;
  private readonly baseLane: number;
  private readonly phase: number;
  private yaw = 0;

  constructor(track: Track, visual: VehicleVisual, gridOffset: number, lane: number, topSpeed: number, name: string, totalLaps = TOTAL_LAPS) {
    this.track = track;
    this.visual = visual;
    this.startOffset = gridOffset;
    this.distance = gridOffset;
    this.baseLane = lane;
    this.topSpeed = topSpeed;
    this.raceDistance = track.totalLength * totalLaps;
    this.name = name;
    this.phase = gridOffset * 0.173;
    this.sample = track.sampleAt(track.gridDistance + gridOffset);
    this.lookAhead = track.sampleAt(0);
    this.cornerSample = track.sampleAt(0);
    this.reset();
  }

  reset(): void {
    this.distance = this.startOffset;
    this.speed = 0;
    this.finished = false;
    this.finishTime = 0;
    this.yaw = Math.atan2(this.sample.tangent.x, this.sample.tangent.z);
    this.place(0);
  }

  update(deltaTime: number, raceTime: number): void {
    const dt = Math.min(deltaTime, 0.05);
    if (!this.finished) {
      this.track.sampleAt(this.track.gridDistance + this.distance + 16, this.lookAhead);
      const cornerFactor = Math.abs(this.lookAhead.curvature) * 48;
      let targetSpeed = Math.min(this.topSpeed, 74 / (1 + cornerFactor * 0.72));
      this.track.sampleAt(this.track.gridDistance + this.distance + 45, this.cornerSample);
      const nearbyCurvature = Math.abs(this.cornerSample.curvature);
      targetSpeed = Math.min(targetSpeed, 69 / (1 + nearbyCurvature * 30));
      const acceleration = targetSpeed > this.speed ? 10.5 : 22;
      this.speed += Math.max(-acceleration * dt, Math.min(11.2 * dt, targetSpeed - this.speed));
      this.distance += this.speed * dt;
      if (this.distance >= this.raceDistance) {
        this.finished = true;
        this.finishTime = raceTime;
      }
    } else {
      this.speed *= Math.exp(-1.6 * dt);
      this.distance += this.speed * dt;
    }
    this.place(dt);
  }

  private place(deltaTime: number): void {
    this.track.sampleAt(wrapDistance(this.track.gridDistance + this.distance, this.track.totalLength), this.sample);
    const lane = this.baseLane + Math.sin(this.distance * 0.012 + this.phase) * 0.38;
    this.position.copy(this.sample.position).addScaledVector(this.sample.right, lane);
    this.position.y += 0.04;
    const targetYaw = Math.atan2(this.sample.tangent.x, this.sample.tangent.z);
    let yawDelta = targetYaw - this.yaw;
    if (yawDelta > Math.PI) yawDelta -= Math.PI * 2;
    if (yawDelta < -Math.PI) yawDelta += Math.PI * 2;
    this.yaw += yawDelta * Math.min(1, deltaTime * 10);
    const pitch = -Math.asin(this.sample.tangent.y);
    this.visual.root.position.copy(this.position);
    this.visual.root.rotation.set(pitch, this.yaw, Math.sin(this.distance * 0.012 + this.phase) * 0.012, 'YXZ');
    this.visual.update(deltaTime, this.speed, yawDelta * 0.8, 0.7, false, false);
  }
}
