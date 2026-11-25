import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { Track } from '../src/core/Track';
import { VehiclePhysics } from '../src/core/VehiclePhysics';
import { DEFAULT_SETTINGS, type InputFrame } from '../src/game/types';

const idle: InputFrame = { throttle: 0, brake: 0, steer: 0, handbrake: false };
const throttle: InputFrame = { ...idle, throttle: 1 };

function advance(car: VehiclePhysics, input: InputFrame, seconds: number): void {
  for (let index = 0; index < Math.ceil(seconds * 120); index += 1) car.step(input, 1 / 120);
}

describe('VehiclePhysics', () => {
  it('starts stationary and aligned with the circuit', () => {
    const track = new Track();
    const car = new VehiclePhysics(track, { ...DEFAULT_SETTINGS });
    expect(car.speed).toBe(0);
    expect(Math.abs(car.nearest.lateral)).toBeLessThan(0.01);
    expect(car.forward.dot(track.sampleAt(track.gridDistance).tangent)).toBeCloseTo(1, 3);
  });

  it('accelerates, brakes and respects a speed limiter', () => {
    const car = new VehiclePhysics(new Track(), { ...DEFAULT_SETTINGS });
    advance(car, throttle, 2);
    expect(car.speed).toBeGreaterThan(15);
    const speedBeforeBraking = car.speed;
    advance(car, { ...idle, brake: 1 }, 0.6);
    expect(car.speed).toBeLessThan(speedBeforeBraking * 0.5);
    advance(car, throttle, 20);
    expect(car.speed).toBeLessThanOrEqual(78);
  });

  it('steers without changing the vehicle into a ballistic object', () => {
    const car = new VehiclePhysics(new Track(), { ...DEFAULT_SETTINGS });
    advance(car, throttle, 1.5);
    const originalYaw = car.yaw;
    advance(car, { ...throttle, steer: 1 }, 0.5);
    expect(Math.abs(car.yaw - originalYaw)).toBeGreaterThan(0.05);
    expect(Number.isFinite(car.position.x)).toBe(true);
    expect(car.position.y).toBeCloseTo(car.nearest.position.y + 0.04, 4);
  });

  it('maps positive steering input to the driver-facing screen-right direction', () => {
    const track = new Track();
    const car = new VehiclePhysics(track, { ...DEFAULT_SETTINGS });
    const tangent = track.sampleAt(track.gridDistance).tangent;
    const driverRight = new Vector3(-tangent.z, 0, tangent.x).normalize();
    const initialForward = car.forward.clone();
    advance(car, { ...throttle, steer: 1 }, 0.6);
    const rightTurn = car.forward.clone().sub(initialForward);
    expect(rightTurn.dot(driverRight)).toBeGreaterThan(0.05);

    car.reset(track.gridDistance, 0);
    const resetForward = car.forward.clone();
    advance(car, { ...throttle, steer: -1 }, 0.6);
    const leftTurn = car.forward.clone().sub(resetForward);
    expect(leftTurn.dot(driverRight)).toBeLessThan(-0.05);
  });

  it('applies the configurable steering sensitivity', () => {
    const track = new Track();
    const sensitive = new VehiclePhysics(track, { ...DEFAULT_SETTINGS, steeringSensitivity: 1 });
    const smooth = new VehiclePhysics(track, { ...DEFAULT_SETTINGS, steeringSensitivity: 0.35 });
    const initialYaw = sensitive.yaw;
    advance(sensitive, { ...throttle, steer: 1 }, 0.6);
    advance(smooth, { ...throttle, steer: 1 }, 0.6);
    expect(Math.abs(sensitive.yaw - initialYaw)).toBeGreaterThan(Math.abs(smooth.yaw - initialYaw) * 1.5);
  });

  it('contains the car at the barrier and kills outward velocity', () => {
    const track = new Track();
    const car = new VehiclePhysics(track, { ...DEFAULT_SETTINGS });
    const sample = track.sampleAt(100);
    car.position.copy(sample.position).addScaledVector(sample.right, 20);
    car.yaw = Math.atan2(sample.right.x, sample.right.z);
    car.velocity.copy(sample.right).multiplyScalar(12);
    car.speed = 12;
    car.step(idle, 1 / 120);
    expect(Math.abs(car.nearest.lateral)).toBeLessThanOrEqual(track.roadHalfWidth + 1.46);
    expect(car.velocity.dot(sample.right)).toBeLessThan(1);
    expect(car.impact).toBeGreaterThan(0);
  });

  it('detects wrong-way driving and resets cleanly', () => {
    const track = new Track();
    const car = new VehiclePhysics(track, { ...DEFAULT_SETTINGS });
    const sample = track.sampleAt(track.gridDistance);
    car.yaw += Math.PI;
    car.velocity.copy(sample.tangent).multiplyScalar(-12);
    car.speed = -12;
    car.step(idle, 1 / 120);
    expect(car.wrongWay).toBe(true);
    car.reset(200, 2);
    expect(car.speed).toBe(0);
    expect(car.velocity.length()).toBe(0);
    expect(car.nearest.lateral).toBeCloseTo(2, 2);
  });

  it('selects sensible gears and RPM across the speed range', () => {
    const car = new VehiclePhysics(new Track(), { ...DEFAULT_SETTINGS });
    const tangent = car.forward.clone();
    car.velocity.copy(tangent).multiplyScalar(30);
    car.speed = 30;
    expect(car.gear).toBeGreaterThan(1);
    expect(car.rpm).toBeGreaterThan(1000);
    expect(car.rpm).toBeLessThan(8000);
  });
});
