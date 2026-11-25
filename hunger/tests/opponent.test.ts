import { describe, expect, it } from 'vitest';
import { Group } from 'three';
import { Opponent } from '../src/core/Opponent';
import { Track } from '../src/core/Track';
import type { VehicleVisual } from '../src/render/vehicle';

function createVisual(): VehicleVisual {
  return {
    root: new Group(),
    update() {},
    setPaint() {},
    dispose() {},
  };
}

describe('Opponent', () => {
  it('follows the elevated circuit and completes a race at a competitive pace', () => {
    const track = new Track();
    const opponent = new Opponent(track, createVisual(), 6, 2.2, 70, 'TEST', 1);
    let raceTime = 0;
    for (let frame = 0; frame < 120 * 120 && !opponent.finished; frame += 1) {
      opponent.update(1 / 120, raceTime);
      raceTime += 1 / 120;
    }
    expect(opponent.finished).toBe(true);
    expect(opponent.finishTime).toBeGreaterThan(10);
    expect(opponent.finishTime).toBeLessThan(65);
    expect(Number.isFinite(opponent.position.x)).toBe(true);
    expect(opponent.visual.root.position.distanceTo(opponent.position)).toBeLessThan(0.001);
  });

  it('continues through all three race laps by default', () => {
    const track = new Track();
    const opponent = new Opponent(track, createVisual(), 0, 0, 70, 'TEST');
    let raceTime = 0;
    for (let frame = 0; frame < 120 * 150 && !opponent.finished; frame += 1) {
      opponent.update(1 / 120, raceTime);
      raceTime += 1 / 120;
    }
    expect(opponent.finished).toBe(true);
    expect(opponent.distance).toBeGreaterThan(track.totalLength * 2.5);
    expect(opponent.finishTime).toBeGreaterThan(20);
  });

  it('brakes for corners instead of holding one constant speed', () => {
    const track = new Track();
    const opponent = new Opponent(track, createVisual(), 0, 0, 72, 'TEST');
    let minimumSpeed = Number.POSITIVE_INFINITY;
    let maximumSpeed = 0;
    for (let frame = 0; frame < 120 * 25; frame += 1) {
      opponent.update(1 / 120, frame / 120);
      if (frame > 240) {
        minimumSpeed = Math.min(minimumSpeed, opponent.speed);
        maximumSpeed = Math.max(maximumSpeed, opponent.speed);
      }
    }
    expect(maximumSpeed).toBeGreaterThan(55);
    expect(minimumSpeed).toBeLessThan(maximumSpeed - 8);
  });
});
