import { describe, expect, it } from 'vitest';
import { Track } from '../src/world/Track';
import { Vehicle, AIDriver } from '../src/vehicle/Vehicle';
import { CARS, PAINTS } from '../src/vehicle/CarModel';
import { WALL_LAT } from '../src/world/Track';
import type { DriveInput } from '../src/core/Input';

/** Headless 120 Hz race — no renderer, just the real physics and AI. */
describe('three-lap race simulation', () => {
  it('lets every car complete three laps without getting stuck on the barriers', () => {
    const track = new Track();
    const cars: Vehicle[] = [];
    for (let i = 0; i < 6; i += 1) {
      const v = new Vehicle({ add: () => undefined } as never, track,
        { ...CARS[i % CARS.length], stats: { ...CARS[i % CARS.length].stats } },
        PAINTS[i % PAINTS.length].color, PAINTS[i % PAINTS.length].accent, i === 0);
      v.reset(i, 0);
      cars.push(v);
    }
    const drivers = cars.map((c, i) => new AIDriver(c, track, cars[0], 0.88 + i * 0.02, i + 1));
    const inputs: DriveInput[] = drivers.map(() => ({
      throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false,
    }));
    const dt = 1 / 120;
    let time = 0;
    let thinkTimer = 0;
    let offTrackFrames = 0;
    let maxLateral = 0;
    let maxProgressJump = 0;
    let prevProgress = cars.map((c) => c.progress);

    for (let step = 0; step < 120 * 180; step += 1) {
      time += dt;
      thinkTimer -= dt;
      if (thinkTimer <= 0) {
        thinkTimer = 1 / 20;
        for (let i = 0; i < drivers.length; i += 1) inputs[i] = drivers[i].think(1 / 20, time);
      }
      for (let i = 0; i < cars.length; i += 1) cars[i].update(dt, inputs[i], time);
      for (let i = 0; i < cars.length; i += 1) {
        for (let j = i + 1; j < cars.length; j += 1) Vehicle.resolveCollision(cars[i], cars[j]);
      }
      for (let i = 0; i < cars.length; i += 1) {
        const car = cars[i];
        if (Math.abs(car.lateral) > WALL_LAT - 1.1) offTrackFrames += 1;
        maxLateral = Math.max(maxLateral, Math.abs(car.lateral));
        maxProgressJump = Math.max(maxProgressJump, Math.abs(track.delta(prevProgress[i], car.progress) - (car.progress - prevProgress[i])));
        prevProgress[i] = car.progress;
      }
      if (cars.every((c) => c.finished)) break;
    }

    for (const car of cars) {
      expect(car.lapsCompleted).toBe(3);
      expect(car.finished).toBe(true);
      expect(car.finishTime).toBeGreaterThan(20);
      expect(car.bestLap).toBeGreaterThan(5);
      expect(Number.isFinite(car.pos.x)).toBe(true);
    }
    // Regression: the old 6.5 m-radius hairpin pinned the AI on the barriers
    // for ~1,000 frames per race. A clean circuit produces no wall contact.
    expect(offTrackFrames).toBe(0);
    expect(maxLateral).toBeLessThan(WALL_LAT - 1.1);
    expect(maxProgressJump).toBeLessThan(1);
  }, 60000);
});
