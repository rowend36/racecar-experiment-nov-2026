import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { Track, WALL_LAT } from '../src/world/Track';
import { Vehicle, AIDriver, createInput } from '../src/vehicle/Vehicle';
import { CAR_SPECS } from '../src/vehicle/CarModel';
import { stubTextures } from '../src/core/Textures';
import { crossingDelta } from '../src/game/Race';

// Race reads localStorage at construction; stub it in Node.
beforeEach(() => {
  const store = new Map<string, string>();
  (globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
  };
});

describe('crossingDelta (lap logic)', () => {
  const L = 2294;
  it('counts a forward crossing', () => {
    expect(crossingDelta(L * 0.9, L * 0.05, L, 30)).toBe(1);
  });
  it('reversing back over the line undoes the count', () => {
    expect(crossingDelta(L * 0.05, L * 0.9, L, 30)).toBe(-1);
  });
  it('ignores mid-lap wrap-adjacent samples without motion', () => {
    expect(crossingDelta(L * 0.9, L * 0.05, L, 0)).toBe(0);
    expect(crossingDelta(L * 0.9, L * 0.05, L, -5)).toBe(0);
  });
  it('ignores normal forward progress', () => {
    expect(crossingDelta(100, 110, L, 30)).toBe(0);
  });
});

describe('autonomous 3-lap drive (all cars on AI)', () => {
  it('completes laps and stays inside the walls', () => {
    const track = new Track(stubTextures());
    const scene = new THREE.Scene();
    const cars: Vehicle[] = [];
    for (let slot = 0; slot < 4; slot++) {
      const v = new Vehicle(scene, track, CAR_SPECS[slot % CAR_SPECS.length], stubTextures(), slot === 3);
      v.reset(slot, 0);
      cars.push(v);
    }
    const ais = cars.map((v, i) => new AIDriver(v, track, cars[3], 0.6 + i * 0.05, i + 2));
    const DT = 1 / 120;
    let aiAcc = 0;
    const inputs = cars.map(() => createInput());
    let maxLat = 0;
    const SIM_SECONDS = 400;
    const steps = Math.floor(SIM_SECONDS / DT);
    let leaderLap = 0;
    for (let i = 0; i < steps; i++) {
      aiAcc += DT;
      if (aiAcc >= 1 / 20) {
        aiAcc -= 1 / 20;
        for (let c = 0; c < 4; c++) inputs[c] = ais[c].think(1 / 20);
      }
      for (let c = 0; c < 4; c++) {
        const car = cars[c];
        const prevS = car.s;
        car.update(DT, inputs[c]);
        const d = crossingDelta(prevS, car.s, track.length, car.speed);
        if (d > 0) car.lap++;
        car.progress = car.lap * track.length + car.s;
        maxLat = Math.max(maxLat, Math.abs(car.lateral));
        if (c === 0) leaderLap = Math.max(leaderLap, car.lap);
      }
      for (let a = 0; a < 4; a++) {
        for (let b = a + 1; b < 4; b++) Vehicle.resolveCollision(cars[a], cars[b]);
      }
      if (leaderLap > 3) break;
    }
    expect(leaderLap).toBeGreaterThan(3);
    expect(maxLat).toBeLessThan(WALL_LAT + 0.5);
    for (const c of cars) {
      expect(c.lap).toBeGreaterThanOrEqual(3);
    }
  }, 60000);
});
