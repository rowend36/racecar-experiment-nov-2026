import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { RaceSession } from '../src/core/RaceSession';
import { Track } from '../src/core/Track';
import { VehiclePhysics } from '../src/core/VehiclePhysics';
import { DEFAULT_SETTINGS, TOTAL_LAPS } from '../src/game/types';

describe('Playable race integration', () => {
  it('can complete three laps using only the public driving controls', () => {
    const track = new Track();
    const player = new VehiclePhysics(track, { ...DEFAULT_SETTINGS, steeringAssist: true });
    const session = new RaceSession(player, [], track.totalLength, TOTAL_LAPS);
    const lookAhead = track.sampleAt(0);
    const corner = track.sampleAt(0);
    const toTarget = new Vector3();
    let simulationTime = 0;

    for (let frame = 0; frame < 120 * 150 && !session.finished; frame += 1) {
      const speed = Math.abs(player.speed);
      track.sampleAt(player.nearest.distance + 15 + speed * 0.22, lookAhead);
      track.sampleAt(player.nearest.distance + 35 + speed * 0.25, corner);
      toTarget.copy(lookAhead.position).sub(player.position);
      const forwardAmount = toTarget.dot(player.forward);
      const driverRight = toTarget.dot(player.nearest.right) * -1;
      const desiredSteer = Math.max(-1, Math.min(1, Math.atan2(driverRight, Math.max(1, forwardAmount)) * 1.45));
      const targetSpeed = Math.min(40, 20 / (0.34 + Math.abs(corner.curvature) * 15));
      const throttle = speed < targetSpeed ? 1 : 0;
      const brake = speed > targetSpeed + 3 ? 0.7 : 0;
      player.step({ throttle, brake, steer: desiredSteer, handbrake: false }, 1 / 120);
      session.update(1 / 120);
      simulationTime += 1 / 120;
    }

    expect(session.finished, JSON.stringify({
      time: simulationTime,
      distance: session.courseDistance,
      length: track.totalLength,
      speed: player.speed,
      lateral: player.nearest.lateral,
      wrongWay: player.wrongWay,
      checkpoints: session.checkpointCount,
    })).toBe(true);
    expect(session.lapTimes).toHaveLength(TOTAL_LAPS);
    expect(simulationTime).toBeLessThan(150);
    expect(session.bestLap).toBeGreaterThan(8);
  }, 20_000);
});
