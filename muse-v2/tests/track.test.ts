import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Track, ROAD_HALF, WALL_LAT } from '../src/world/Track';
import { stubTextures } from '../src/core/Textures';

const track = new Track(stubTextures());

describe('Track spline', () => {
  it('wraps seamlessly at the start line', () => {
    const a = track.frameAt(0);
    const b = track.frameAt(track.length);
    const c = track.frameAt(track.length + 40);
    const d = track.frameAt(40);
    expect(a.pos.distanceTo(b.pos)).toBeLessThan(0.01);
    expect(c.pos.distanceTo(d.pos)).toBeLessThan(0.5);
  });

  it('projects onto the centerline with ~zero lateral', () => {
    const f = track.frameAt(300);
    const hit = track.nearest(new THREE.Vector3(f.pos.x, f.pos.y, f.pos.z), -1);
    expect(Math.abs(hit.lateral)).toBeLessThan(0.6);
    expect(hit.onRoad).toBe(true);
    expect(Math.abs(hit.s - 300)).toBeLessThan(4);
  });

  it('reports signed lateral offset (right = +lateral)', () => {
    const f = track.frameAt(300);
    const p = new THREE.Vector3(
      f.pos.x + f.right.x * 4,
      f.pos.y,
      f.pos.z + f.right.z * 4,
    );
    const hit = track.nearest(p, -1);
    expect(hit.lateral).toBeCloseTo(4, 0);
  });

  it('places the grid behind the start line in staggered columns', () => {
    const slots = [0, 1, 2, 3].map((i) => track.gridSlot(i));
    for (const g of slots) {
      expect(g.s).toBeGreaterThan(track.length - 60);
      expect(Math.abs(g.lateral)).toBeCloseTo(2.55, 2);
    }
    expect(slots[0].s).toBeGreaterThan(slots[2].s); // row behind
  });

  it('keeps the road corridor free: wall posts sit outside the tarmac', () => {
    // Walls live at ±WALL_LAT; the drivable + curb zone ends at ROAD_HALF + 1.25.
    expect(WALL_LAT).toBeGreaterThan(ROAD_HALF + 1.25);
    // Nearest() must agree: a point at the wall line is not "on road".
    const f = track.frameAt(900);
    const p = new THREE.Vector3(
      f.pos.x + f.right.x * WALL_LAT, f.pos.y, f.pos.z + f.right.z * WALL_LAT);
    const hit = track.nearest(p, -1);
    expect(Math.abs(hit.lateral)).toBeGreaterThan(ROAD_HALF + 1);
  });

  it('hinted search agrees with global search', () => {
    const f = track.frameAt(1500);
    const p = new THREE.Vector3(f.pos.x + 2, f.pos.y, f.pos.z - 1);
    const global = track.nearest(p, -1);
    const hinted = track.nearest(p, global.index);
    expect(Math.abs(hinted.s - global.s)).toBeLessThan(1);
  });
});
