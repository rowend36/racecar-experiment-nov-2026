import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { shortestTrackDelta, Track, wrapDistance } from '../src/core/Track';

describe('Track', () => {
  const track = new Track();

  it('creates a closed circuit with a meaningful racing length', () => {
    expect(track.totalLength).toBeGreaterThan(500);
    expect(track.samples).toHaveLength(1200);
    expect(track.samples[0].position.distanceTo(track.curve.getPointAt(1))).toBeLessThan(0.001);
  });

  it('wraps distances and finds the shortest signed delta', () => {
    expect(wrapDistance(-5, 100)).toBe(95);
    expect(wrapDistance(105, 100)).toBe(5);
    expect(shortestTrackDelta(98, 2, 100)).toBe(4);
    expect(shortestTrackDelta(2, 98, 100)).toBe(-4);
  });

  it('projects a centerline point without lateral error', () => {
    const sample = track.sampleAt(track.totalLength * 0.37);
    const nearest = track.nearest(sample.position, -1);
    expect(Math.abs(nearest.lateral)).toBeLessThan(0.001);
    expect(nearest.tangent.length()).toBeCloseTo(1, 5);
    expect(nearest.right.length()).toBeCloseTo(1, 5);
  });

  it('reports signed lateral offset and a stable hint-based search', () => {
    const sample = track.sampleAt(150);
    const index = Math.floor((150 / track.totalLength) * track.samples.length);
    const position = sample.position.clone().addScaledVector(sample.right, 3.5);
    const full = track.nearest(position, -1);
    const hinted = track.nearest(position, index);
    expect(full.lateral).toBeCloseTo(3.5, 3);
    expect(hinted.distance).toBeCloseTo(full.distance, 5);
    expect(hinted.lateral).toBeCloseTo(full.lateral, 5);
  });

  it('keeps sampled tangents normalized through the start seam', () => {
    for (const distance of [0, 0.01, track.totalLength - 0.01, track.totalLength]) {
      expect(track.sampleAt(distance).tangent.length()).toBeCloseTo(1, 5);
    }
  });

  it('recovers with a full search after a large displacement', () => {
    const start = track.sampleAt(20);
    const target = track.sampleAt(track.totalLength * 0.7);
    const nearest = track.nearest(target.position.clone().add(new Vector3(0, 0, 0)), Math.floor(20 / track.totalLength * track.samples.length));
    expect(nearest.distance).toBeCloseTo(target.distance, 1);
    expect(nearest.position.distanceTo(target.position)).toBeLessThan(0.1);
    expect(start.tangent.length()).toBeCloseTo(1, 5);
  });
});
