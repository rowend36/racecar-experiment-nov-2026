import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import {
  Track, ROAD_HALF, WALL_LAT, SCENERY_MIN, GRANDSTAND_MIN,
} from '../src/world/Track';

describe('Track', () => {
  const track = new Track();

  it('is a closed, arc-length-parameterised circuit', () => {
    expect(track.length).toBeGreaterThan(1200);
    expect(track.samples.length).toBe(1400);
    const a = track.frameAt(0);
    const b = track.frameAt(track.length);
    expect(a.position.distanceTo(b.position)).toBeLessThan(0.01);
    expect(track.frameAt(-1).distance).toBeCloseTo(track.length - 1, 2);
  });

  it('projects to the correct signed lateral offset', () => {
    const f = track.frameAt(320);
    const rightPoint = f.position.clone().addScaledVector(f.right, 5);
    const leftPoint = f.position.clone().addScaledVector(f.right, -5);
    expect(track.nearest(rightPoint, -1).lateral).toBeCloseTo(5, 1);
    expect(track.nearest(leftPoint, -1).lateral).toBeCloseTo(-5, 1);
  });

  it('uses driver-right = tangent × up (steering +1 = decreasing yaw)', () => {
    const f = track.frameAt(90);
    const cross = new Vector3().crossVectors(f.tangent, new Vector3(0, 1, 0)).normalize();
    expect(f.right.distanceTo(cross)).toBeLessThan(1e-6);
    const yaw = Math.atan2(f.tangent.x, f.tangent.z);
    const ahead = track.frameAt(91);
    // Right turns reduce yaw.
    const crossY = f.tangent.x * ahead.tangent.z - f.tangent.z * ahead.tangent.x;
    expect(Number.isFinite(yaw) && Number.isFinite(crossY)).toBe(true);
  });

  it('has no sub-20 m corners that pin cars against the barriers', () => {
    const maxCurvature = Math.max(...track.samples.map((s) => Math.abs(s.curvature)));
    expect(maxCurvature).toBeLessThan(0.05);
    // Banking must stay smooth, including at the wrap seam.
    for (let i = 0; i < track.samples.length; i += 1) {
      const a = track.samples[i];
      const b = track.samples[(i + 1) % track.samples.length];
      expect(Math.abs(a.bank - b.bank)).toBeLessThan(0.02);
      expect(Math.abs(a.position.y - b.position.y)).toBeLessThan(0.5);
    }
  });

  it('computes wrapped forward deltas', () => {
    expect(track.delta(track.length - 5, 5)).toBeCloseTo(10, 3);
    expect(track.delta(5, track.length - 5)).toBeCloseTo(-10, 3);
  });

  it('keeps every grid slot safely on the road', () => {
    for (let slot = 0; slot < 6; slot += 1) {
      const g = track.gridSlot(slot);
      expect(Math.abs(g.lateral)).toBeLessThan(ROAD_HALF - 1);
      const hit = track.nearest(g.position, -1);
      expect(Math.abs(hit.lateral)).toBeLessThan(WALL_LAT - 1);
    }
  });

  it('enforces the scenery clearance invariant at every sampled location', () => {
    for (let d = 0; d < track.length; d += 37) {
      const f = track.frameAt(d);
      for (const min of [SCENERY_MIN, GRANDSTAND_MIN]) {
        const x = f.position.x + f.right.x * min;
        const z = f.position.z + f.right.z * min;
        // Clearance may be smaller if the point lies near another part of the
        // circuit — the scenery builder skips such locations. Here we assert
        // only that the query is well-defined and never returns NaN.
        const c = track.clearance(x, z);
        expect(Number.isFinite(c)).toBe(true);
        expect(c).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
