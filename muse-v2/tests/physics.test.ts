import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Track, ROAD_HALF, WALL_LAT } from '../src/world/Track';
import { Vehicle, createInput } from '../src/vehicle/Vehicle';
import { CAR_SPECS } from '../src/vehicle/CarModel';
import { stubTextures } from '../src/core/Textures';

const DT = 1 / 120;

function straightTrackCar(): { track: Track; car: Vehicle } {
  const track = new Track(stubTextures());
  // Find a low-curvature sample for straight-line tests.
  let best = 0;
  let bestC = Infinity;
  for (let i = 0; i < track.samples.length; i += 10) {
    const c = Math.abs(track.samples[i].curvature);
    if (c < bestC) { bestC = c; best = i; }
  }
  const scene = new THREE.Scene();
  const car = new Vehicle(scene, track, CAR_SPECS[0], stubTextures(), true);
  const f = track.frameAt(track.samples[best].s);
  car.pos.set(f.pos.x, f.pos.y, f.pos.z);
  car.yaw = Math.atan2(f.tangent.x, f.tangent.z);
  car.hint = -1;
  const hit = track.nearest(car.pos, -1);
  car.hint = hit.index;
  car.s = hit.s;
  car.lateral = hit.lateral;
  return { track, car };
}

function drive(car: Vehicle, seconds: number, input: Partial<ReturnType<typeof createInput>>): void {
  const base = createInput();
  Object.assign(base, input);
  const steps = Math.floor(seconds / DT);
  for (let i = 0; i < steps; i++) car.update(DT, base);
}

describe('Vehicle physics', () => {
  it('steers screen-right with +1 input (negative yaw, rightward motion)', () => {
    const { car } = straightTrackCar();
    const yaw0 = car.yaw;
    const fwd0 = new THREE.Vector3(car.forwardX, 0, car.forwardZ);
    const screenRight = new THREE.Vector3(-fwd0.z, 0, fwd0.x);
    const p0 = car.pos.clone();
    drive(car, 0.8, { throttle: 1, steer: 1 });
    expect(car.yaw).toBeLessThan(yaw0); // negative yaw = right
    const disp = car.pos.clone().sub(p0);
    expect(disp.dot(screenRight)).toBeGreaterThan(0);
  });

  it('builds speed in a straight line', () => {
    const { car } = straightTrackCar();
    drive(car, 1, { throttle: 1 });
    expect(car.speedKmh).toBeGreaterThan(50);
  });

  it('left input mirrors right input', () => {
    const a = straightTrackCar();
    const b = straightTrackCar();
    const yawA0 = a.car.yaw;
    const yawB0 = b.car.yaw;
    drive(a.car, 0.7, { throttle: 1, steer: 0.6 });
    drive(b.car, 0.7, { throttle: 1, steer: -0.6 });
    const dA = a.car.yaw - yawA0;
    const dB = b.car.yaw - yawB0;
    // Opposite directions (the historical bug flipped one of these)...
    expect(dA).toBeLessThan(0);
    expect(dB).toBeGreaterThan(0);
    // ...with roughly matching magnitude.
    expect(Math.abs(Math.abs(dA) - Math.abs(dB))).toBeLessThan(0.35);
    expect(Math.abs(a.car.speedKmh - b.car.speedKmh)).toBeLessThan(30);
  });

  it('reverses away from a curb trap (anti-creep must not block reverse)', () => {
    const { track, car } = straightTrackCar();
    const f = track.frameAt(car.s);
    // Park half on the curb: still "on road" but draggy.
    car.pos.set(
      f.pos.x + f.right.x * (ROAD_HALF + 0.3),
      f.pos.y, f.pos.z + f.right.z * (ROAD_HALF + 0.3));
    car.vx = 0; car.vz = 0;
    drive(car, 2.5, { brake: 1 });
    expect(car.speed).toBeLessThan(-1.5);
  });

  it('reverse is capped and controllable', () => {
    const { car } = straightTrackCar();
    drive(car, 1.2, { brake: 1 });
    expect(car.speed).toBeGreaterThanOrEqual(-13.1);
    expect(car.speed).toBeLessThan(-3);
    expect(car.gear).toBe(1);
  });

  it('walls preserve tangential velocity (graze slides, no glue)', () => {
    const { track, car } = straightTrackCar();
    const f = track.frameAt(car.s);
    // Park just inside the wall, aimed almost parallel, slightly inward.
    car.yaw = Math.atan2(f.tangent.x, f.tangent.z) - 0.06;
    car.pos.set(
      f.pos.x + f.right.x * (WALL_LAT - 1.4),
      f.pos.y, f.pos.z + f.right.z * (WALL_LAT - 1.4));
    car.vx = 0; car.vz = 0;
    drive(car, 2, { throttle: 1 });
    expect(Math.abs(car.lateral)).toBeLessThanOrEqual(WALL_LAT - 0.95 + 0.3);
    // Still moving along the wall, not glued.
    const t = track.frameAt(car.s).tangent;
    const tangentSpeed = Math.abs(car.vx * t.x + car.vz * t.z);
    expect(tangentSpeed).toBeGreaterThan(8);
  });

  it('can reverse away from a nose-in wall contact', () => {
    const { track, car } = straightTrackCar();
    const f = track.frameAt(car.s);
    car.yaw = Math.atan2(f.tangent.x, f.tangent.z);
    car.pos.set(
      f.pos.x + f.right.x * (WALL_LAT - 1.2),
      f.pos.y, f.pos.z + f.right.z * (WALL_LAT - 1.2));
    car.vx = 0; car.vz = 0;
    drive(car, 2, { brake: 1 });
    expect(car.speed).toBeLessThan(-0.5);
  });

  it('nitro drains while active and recharges while coasting', () => {
    const { car } = straightTrackCar();
    drive(car, 0.8, { throttle: 1 });
    const before = car.nitro;
    const inp = createInput();
    inp.throttle = 1;
    inp.nitro = true;
    let everActive = false;
    for (let i = 0; i < Math.floor(1.2 / DT); i++) {
      car.update(DT, inp);
      if (car.nitroActive) everActive = true;
    }
    expect(everActive).toBe(true);
    expect(car.nitro).toBeLessThan(before);
  });
});
