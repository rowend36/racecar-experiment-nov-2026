import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { Track } from '../src/world/Track';
import { Vehicle } from '../src/vehicle/Vehicle';
import { CARS, PAINTS } from '../src/vehicle/CarModel';
import type { DriveInput } from '../src/core/Input';

const idle: DriveInput = { throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };
const throttle: DriveInput = { ...idle, throttle: 1 };
const dt = 1 / 120;

function makeCar(track: Track): Vehicle {
  const v = new Vehicle({ add: () => undefined } as never, track, { ...CARS[0], stats: { ...CARS[0].stats } },
    PAINTS[0].color, PAINTS[0].accent, true);
  v.reset(4, 0);
  return v;
}

function advance(v: Vehicle, input: DriveInput, seconds: number, time = 0): number {
  let t = time;
  for (let i = 0; i < Math.round(seconds / dt); i += 1) {
    t += dt;
    v.update(dt, input, t);
  }
  return t;
}

/** Place a car at a given arc length with a chosen forward speed. */
function launch(v: Vehicle, track: Track, distance: number, speed: number, hintDistance = distance): void {
  const f = track.frameAt(distance);
  v.pos.copy(f.position);
  v.yaw = Math.atan2(f.tangent.x, f.tangent.z);
  v.vx = Math.sin(v.yaw) * speed;
  v.vz = Math.cos(v.yaw) * speed;
  v.hint = track.nearest(track.frameAt(hintDistance).position, -1).index;
}

/** Deterministic start-line crossing: hint is on one side, position on the other. */
function crossLine(v: Vehicle, track: Track, forward: boolean): void {
  if (forward) launch(v, track, 0.4, 18, track.length - 0.4);
  else launch(v, track, track.length - 0.4, -18, 0.4);
}

describe('Vehicle physics', () => {
  const track = new Track();

  it('starts stationary on the grid, aligned with the track', () => {
    const v = makeCar(track);
    expect(v.speed).toBe(0);
    expect(Math.abs(v.lateral)).toBeLessThan(4);
    const f = track.frameAt(v.s);
    const dot = v.forwardX * f.tangent.x + v.forwardZ * f.tangent.z;
    expect(dot).toBeGreaterThan(0.99);
  });

  it('accelerates and brakes', () => {
    const v = makeCar(track);
    advance(v, throttle, 2);
    expect(v.speed).toBeGreaterThan(15);
    const before = v.speed;
    advance(v, { ...idle, brake: 1 }, 0.5, 2);
    expect(v.speed).toBeLessThan(before * 0.6);
  });

  it('maps +1 steering to driver screen-right (negative yaw)', () => {
    const v = makeCar(track);
    advance(v, throttle, 1.2);
    const f = track.frameAt(v.s);
    const driverRight = new Vector3(-f.tangent.z, 0, f.tangent.x).normalize();
    const before = new Vector3(v.forwardX, 0, v.forwardZ);
    advance(v, { ...throttle, steer: 1 }, 0.6, 1.2);
    const after = new Vector3(v.forwardX, 0, v.forwardZ);
    expect(after.sub(before).dot(driverRight)).toBeGreaterThan(0.02);
  });

  it('steering sensitivity changes turn rate without breaking stability', () => {
    const high = makeCar(track);
    const low = makeCar(track);
    low.steeringScale = 0.4;
    high.steeringScale = 1.3;
    let t = advance(high, throttle, 1);
    t = advance(low, throttle, 1, t);
    const yawHigh = high.yaw;
    const yawLow = low.yaw;
    t = advance(high, { ...throttle, steer: 1 }, 0.6, t);
    advance(low, { ...throttle, steer: 1 }, 0.6, t);
    expect(Math.abs(high.yaw - yawHigh)).toBeGreaterThan(Math.abs(low.yaw - yawLow));
    expect(Number.isFinite(high.pos.x)).toBe(true);
  });

  it('contains the car at the barrier without gluing it there', () => {
    const v = makeCar(track);
    const f = track.frameAt(200);
    v.pos.copy(f.position).addScaledVector(f.right, 20);
    v.yaw = Math.atan2(f.right.x, f.right.z);
    v.vx = f.right.x * 14;
    v.vz = f.right.z * 14;
    v.hint = track.nearest(v.pos, -1).index;
    advance(v, idle, 0.2);
    expect(Math.abs(v.lateral)).toBeLessThanOrEqual(12.5);
    // Reverse away from the wall must work.
    advance(v, { ...idle, brake: 1 }, 1.5, 0.2);
    expect(Math.abs(v.lateral)).toBeLessThan(12.5);
  });

  it('depletes nitro and raises the speed cap', () => {
    const v = makeCar(track);
    launch(v, track, 40, 28);
    const before = v.nitro;
    advance(v, { ...throttle, nitro: true }, 0.2);
    expect(v.nitro).toBeLessThan(before);
    expect(v.nitroActive).toBe(true);
    expect(v.speed).toBeGreaterThan(28);
  });

  it('counts a forward start-line crossing and undoes it when reversed', () => {
    const v = makeCar(track);
    crossLine(v, track, true);
    advance(v, throttle, 1 / 120);
    expect(v.started).toBe(true);
    expect(v.lapsCompleted).toBe(0);

    crossLine(v, track, true);
    advance(v, throttle, 1 / 120, 0.1);
    expect(v.lapsCompleted).toBe(1);
    expect(v.lapTimes.length).toBe(1);

    crossLine(v, track, false);
    advance(v, { ...idle, brake: 1 }, 1 / 120, 0.2);
    expect(v.lapsCompleted).toBe(0);
  });

  it('keeps progress continuous from the grid through the first line crossing', () => {
    const v = makeCar(track);
    // Grid starts behind the line: progress must be negative, not +L.
    expect(v.progress).toBeLessThan(0);
    v.update(dt, throttle, dt);
    expect(Math.abs(v.progress - v.s + track.length)).toBeLessThan(0.01);

    crossLine(v, track, true);
    // A teleport does not run the integrator: establish the pre-crossing
    // unwrapped value explicitly, then check the crossing step itself.
    const before = -0.4; // unwrapped position just before the line
    v.progress = before;
    v.update(dt, throttle, dt);
    expect(v.started).toBe(true);
    expect(Math.abs(v.progress - before)).toBeLessThan(2);
  });

  it('resolves car-to-car overlap symmetrically', () => {
    const a = makeCar(track);
    const b = makeCar(track);
    b.pos.copy(a.pos).add(new Vector3(0.4, 0, 0));
    const ax = a.pos.x;
    const bx = b.pos.x;
    Vehicle.resolveCollision(a, b);
    expect(a.pos.x).toBeLessThan(ax);
    expect(b.pos.x).toBeGreaterThan(bx);
  });
});
