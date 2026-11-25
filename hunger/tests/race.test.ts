import { describe, expect, it } from 'vitest';
import { Track, wrapDistance } from '../src/core/Track';
import { RaceSession } from '../src/core/RaceSession';
import { VehiclePhysics } from '../src/core/VehiclePhysics';
import { DEFAULT_SETTINGS, TOTAL_LAPS } from '../src/game/types';
import type { Opponent } from '../src/core/Opponent';

function createSession(laps = TOTAL_LAPS) {
  const track = new Track();
  const player = new VehiclePhysics(track, { ...DEFAULT_SETTINGS });
  const opponent = {
    distance: 6,
    speed: 0,
    finished: false,
    finishTime: 0,
    update(deltaTime: number) { opponent.distance += deltaTime * 20; },
  } as unknown as Opponent;
  const session = new RaceSession(player, [opponent], track.totalLength, laps);
  return { track, player, opponent, session };
}

function driveTo(track: Track, player: VehiclePhysics, session: RaceSession, distance: number): void {
  const startDistance = session.courseDistance;
  const steps = Math.max(1, Math.ceil(Math.abs(distance - startDistance) / 10));
  for (let step = 1; step <= steps; step += 1) {
    const progress = startDistance + ((distance - startDistance) * step) / steps;
    player.nearest.distance = wrapDistance(track.gridDistance + progress, track.totalLength);
    session.update(0.01);
  }
}

describe('RaceSession', () => {
  it('requires all checkpoints before completing a lap', () => {
    const { track, player, session } = createSession();
    driveTo(track, player, session, track.totalLength * 0.24);
    expect(session.checkpointCount).toBe(0);
    driveTo(track, player, session, track.totalLength * 0.26);
    expect(session.checkpointCount).toBe(1);
    driveTo(track, player, session, track.totalLength - 1);
    expect(session.lap).toBe(1);
    driveTo(track, player, session, track.totalLength);
    expect(session.lap).toBe(2);
    expect(session.lapTimes).toHaveLength(1);
    expect(session.bestLap).toBeGreaterThan(0);
  });

  it('invalidates checkpoint progress when the player reverses', () => {
    const { track, player, session } = createSession();
    driveTo(track, player, session, track.totalLength * 0.3);
    expect(session.checkpointCount).toBe(1);
    driveTo(track, player, session, track.totalLength * 0.1);
    expect(session.checkpointCount).toBe(0);
    expect(session.lap).toBe(1);
  });

  it('finishes after the configured number of validated laps', () => {
    const { track, player, session } = createSession();
    for (let distance = 5; distance <= track.totalLength * TOTAL_LAPS + 5 && !session.finished; distance += 5) {
      driveTo(track, player, session, distance);
    }
    expect(session.finished).toBe(true);
    expect(session.lapTimes).toHaveLength(TOTAL_LAPS);
    expect(session.getResult(false).laps).toHaveLength(TOTAL_LAPS);
  });

  it('calculates race position from unwrapped opponent progress', () => {
    const { opponent, session } = createSession();
    opponent.distance = -10;
    expect(session.position).toBe(1);
    opponent.distance = 10;
    expect(session.position).toBe(2);
  });

  it('resets all timing and progress state', () => {
    const { track, player, session } = createSession();
    driveTo(track, player, session, track.totalLength);
    session.reset();
    expect(session.raceTime).toBe(0);
    expect(session.courseDistance).toBe(0);
    expect(session.lap).toBe(1);
    expect(session.lapTimes).toHaveLength(0);
    expect(session.finished).toBe(false);
  });
});
