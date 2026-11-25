import { CatmullRomCurve3, Vector3 } from 'three';

export interface TrackSample {
  position: Vector3;
  tangent: Vector3;
  right: Vector3;
  distance: number;
  curvature: number;
}

export interface NearestTrackPoint {
  index: number;
  distance: number;
  lateral: number;
  position: Vector3;
  tangent: Vector3;
  right: Vector3;
  curvature: number;
}

const SAMPLE_COUNT = 1200;

export function wrapDistance(distance: number, length: number): number {
  return ((distance % length) + length) % length;
}

export function shortestTrackDelta(from: number, to: number, length: number): number {
  let delta = to - from;
  if (delta > length * 0.5) delta -= length;
  if (delta < -length * 0.5) delta += length;
  return delta;
}

/** A closed, elevated city circuit sampled into a cache-friendly lookup table. */
export class Track {
  readonly curve: CatmullRomCurve3;
  readonly samples: TrackSample[] = [];
  readonly totalLength: number;
  readonly roadHalfWidth = 7.4;
  readonly startDistance = 20;
  readonly gridDistance = 2;

  constructor() {
    this.curve = new CatmullRomCurve3(
      [
        new Vector3(0, 0.08, 0),
        new Vector3(-3, 0.5, 75),
        new Vector3(18, 2.2, 150),
        new Vector3(86, 4.4, 198),
        new Vector3(158, 2.6, 188),
        new Vector3(207, 0.2, 132),
        new Vector3(218, 0.08, 62),
        new Vector3(184, 1.3, 2),
        new Vector3(126, 3.1, -34),
        new Vector3(63, 1.5, -52),
        new Vector3(7, 0.2, -32),
      ],
      true,
      'centripetal',
      0.5,
    );
    this.curve.arcLengthDivisions = 2400;
    this.totalLength = this.curve.getLength();
    this.buildSamples();
  }

  private buildSamples(): void {
    for (let i = 0; i < SAMPLE_COUNT; i += 1) {
      const u = i / SAMPLE_COUNT;
      const position = this.curve.getPointAt(u);
      const tangent = this.curve.getTangentAt(u).normalize();
      const right = new Vector3(tangent.z, 0, -tangent.x).normalize();
      this.samples.push({
        position,
        tangent,
        right,
        distance: u * this.totalLength,
        curvature: 0,
      });
    }

    for (let i = 0; i < SAMPLE_COUNT; i += 1) {
      const ahead = this.samples[(i + 12) % SAMPLE_COUNT];
      const current = this.samples[i];
      const cross = current.tangent.x * ahead.tangent.z - current.tangent.z * ahead.tangent.x;
      const dot = Math.max(-1, Math.min(1, current.tangent.dot(ahead.tangent)));
      current.curvature = Math.atan2(cross, dot) / (12 * (this.totalLength / SAMPLE_COUNT));
    }
  }

  sampleAt(distance: number, out: TrackSample = this.createSample()): TrackSample {
    const wrapped = wrapDistance(distance, this.totalLength);
    let low = 0;
    let high = this.samples.length - 1;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (this.samples[middle].distance < wrapped) low = middle + 1;
      else high = middle;
    }
    const nextIndex = low % this.samples.length;
    const previousIndex = (low - 1 + this.samples.length) % this.samples.length;
    const previous = this.samples[previousIndex];
    const next = this.samples[nextIndex];
    const previousWrapped = previousIndex === this.samples.length - 1 && nextIndex === 0
      ? previous.distance - this.totalLength
      : previous.distance;
    const segmentLength = Math.max(0.0001, next.distance - previousWrapped);
    const alpha = Math.max(0, Math.min(1, (wrapped - previousWrapped) / segmentLength));
    out.position.lerpVectors(previous.position, next.position, alpha);
    out.tangent.lerpVectors(previous.tangent, next.tangent, alpha).normalize();
    out.right.set(out.tangent.z, 0, -out.tangent.x).normalize();
    out.distance = wrapped;
    out.curvature = previous.curvature + (next.curvature - previous.curvature) * alpha;
    return out;
  }

  nearest(
    position: Vector3,
    hintIndex: number,
    out: NearestTrackPoint = this.createNearestPoint(),
    searchRadius = 34,
  ): NearestTrackPoint {
    let bestDistanceSq = Number.POSITIVE_INFINITY;
    let bestIndex = 0;
    let bestAlpha = 0;

    const search = (index: number): void => {
      const nextIndex = (index + 1) % this.samples.length;
      const start = this.samples[index];
      const end = this.samples[nextIndex];
      const segmentX = end.position.x - start.position.x;
      const segmentY = end.position.y - start.position.y;
      const segmentZ = end.position.z - start.position.z;
      const lengthSq = segmentX * segmentX + segmentY * segmentY + segmentZ * segmentZ;
      const alpha = lengthSq > 0
        ? Math.max(0, Math.min(1,
          ((position.x - start.position.x) * segmentX
            + (position.y - start.position.y) * segmentY
            + (position.z - start.position.z) * segmentZ) / lengthSq))
        : 0;
      const dx = position.x - (start.position.x + segmentX * alpha);
      const dy = position.y - (start.position.y + segmentY * alpha);
      const dz = position.z - (start.position.z + segmentZ * alpha);
      const distanceSq = dx * dx + dy * dy + dz * dz;
      if (distanceSq < bestDistanceSq) {
        bestDistanceSq = distanceSq;
        bestIndex = index;
        bestAlpha = alpha;
      }
    };

    if (hintIndex >= 0) {
      for (let offset = -searchRadius; offset <= searchRadius; offset += 1) {
        search((hintIndex + offset + this.samples.length) % this.samples.length);
      }
      if (bestDistanceSq > 28 * 28) {
        bestDistanceSq = Number.POSITIVE_INFINITY;
        for (let index = 0; index < this.samples.length; index += 1) search(index);
      }
    } else {
      for (let index = 0; index < this.samples.length; index += 1) search(index);
    }

    const nextIndex = (bestIndex + 1) % this.samples.length;
    const start = this.samples[bestIndex];
    const end = this.samples[nextIndex];
    const segmentLength = start.position.distanceTo(end.position);
    out.index = bestIndex;
    out.distance = wrapDistance(start.distance + segmentLength * bestAlpha, this.totalLength);
    out.position.lerpVectors(start.position, end.position, bestAlpha);
    out.tangent.lerpVectors(start.tangent, end.tangent, bestAlpha).normalize();
    out.right.set(out.tangent.z, 0, -out.tangent.x).normalize();
    out.curvature = start.curvature + (end.curvature - start.curvature) * bestAlpha;
    out.lateral = out.right.x * (position.x - out.position.x)
      + out.right.z * (position.z - out.position.z);
    return out;
  }

  private createSample(): TrackSample {
    return {
      position: new Vector3(),
      tangent: new Vector3(0, 0, 1),
      right: new Vector3(1, 0, 0),
      distance: 0,
      curvature: 0,
    };
  }

  private createNearestPoint(): NearestTrackPoint {
    return {
      index: -1,
      distance: 0,
      lateral: 0,
      position: new Vector3(),
      tangent: new Vector3(0, 0, 1),
      right: new Vector3(1, 0, 0),
      curvature: 0,
    };
  }
}
