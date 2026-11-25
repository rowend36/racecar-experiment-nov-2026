import { shortestTrackDelta } from './Track';
import type { Opponent } from './Opponent';
import type { VehiclePhysics } from './VehiclePhysics';
import { TOTAL_LAPS } from '../game/types';
import type { RaceResult } from '../game/types';

export class RaceSession {
  raceTime = 0;
  lap = 1;
  lapStartTime = 0;
  courseDistance = 0;
  checkpointCount = 0;
  readonly lapTimes: number[] = [];
  bestLap: number | null = null;
  finished = false;

  private readonly player: VehiclePhysics;
  private readonly opponents: Opponent[];
  private readonly totalLength: number;
  private lastTrackDistance: number;
  private readonly totalLaps: number;

  constructor(player: VehiclePhysics, opponents: Opponent[], totalLength: number, totalLaps = TOTAL_LAPS) {
    this.player = player;
    this.opponents = opponents;
    this.totalLength = totalLength;
    this.totalLaps = totalLaps;
    this.lastTrackDistance = player.nearest.distance;
  }

  reset(): void {
    this.raceTime = 0;
    this.lap = 1;
    this.lapStartTime = 0;
    this.courseDistance = 0;
    this.checkpointCount = 0;
    this.lapTimes.length = 0;
    this.bestLap = null;
    this.finished = false;
    this.lastTrackDistance = this.player.nearest.distance;
  }

  update(deltaTime: number): void {
    if (this.finished) return;
    const dt = Math.min(deltaTime, 0.05);
    this.raceTime += dt;
    const delta = shortestTrackDelta(this.lastTrackDistance, this.player.nearest.distance, this.totalLength);
    this.lastTrackDistance = this.player.nearest.distance;
    this.courseDistance += delta;

    const checkpointSpacing = this.totalLength / 4;
    while (this.checkpointCount < this.totalLaps * 3
      && this.courseDistance >= (this.checkpointCount + 1) * checkpointSpacing) {
      this.checkpointCount += 1;
    }
    while (this.checkpointCount > 0
      && this.courseDistance < this.checkpointCount * checkpointSpacing) {
      this.checkpointCount -= 1;
    }

    if (this.checkpointCount >= this.lap * 3 && this.courseDistance + 0.02 >= this.lap * this.totalLength) {
      const lapTime = this.raceTime - this.lapStartTime;
      this.lapTimes.push(lapTime);
      this.bestLap = this.bestLap === null ? lapTime : Math.min(this.bestLap, lapTime);
      this.lapStartTime = this.raceTime;
      this.lap += 1;
      if (this.lap > this.totalLaps) this.finished = true;
    }

    for (const opponent of this.opponents) opponent.update(dt, this.raceTime);
  }

  get position(): number {
    return 1 + this.opponents.filter((opponent) => opponent.distance > this.courseDistance).length;
  }

  get checkpoint(): number {
    return this.checkpointCount % 3;
  }

  get lapTime(): number {
    return this.raceTime - this.lapStartTime;
  }

  getResult(isNewRecord: boolean): RaceResult {
    return {
      position: this.position,
      totalRacers: this.opponents.length + 1,
      raceTime: this.raceTime,
      bestLap: this.bestLap ?? this.raceTime,
      laps: [...this.lapTimes],
      isNewRecord,
    };
  }
}
