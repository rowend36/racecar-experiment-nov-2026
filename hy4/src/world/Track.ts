import { CatmullRomCurve3, Vector3 } from 'three';
import { clamp, wrap } from '../core/Math';

/**
 * Closed, arc-length-parameterised circuit.
 *
 * CONVENTIONS (learned the hard way by four earlier builds):
 *  - Vehicle forward is local +Z: fwd = (sin(yaw), 0, cos(yaw)).
 *  - `right` is the DRIVER's screen-right = tangent × up = (-t.z, 0, t.x).
 *    Steering +1 turns right and therefore DECREASES yaw.
 *  - Positive `lateral` is driver-right of the centreline.
 *  - Nothing solid may be placed inside SCENERY_MIN from the centreline.
 */
export const ROAD_HALF = 8.6;
export const CURB_OUTER = 10.4;
export const RUNOFF_OUTER = 12.4;
export const WALL_LAT = 13.4;
export const SCENERY_MIN = 17.0;
export const GRANDSTAND_MIN = 24.0;

export interface TrackSample {
  position: Vector3;
  tangent: Vector3;
  right: Vector3;
  distance: number;
  curvature: number;
  /** Vertical rise per metre of lateral offset (banking). */
  bank: number;
}

export interface TrackFrame extends TrackSample {}

export interface TrackHit extends TrackFrame {
  index: number;
  lateral: number;
  /** Y of the drivable surface at this lateral offset. */
  height: number;
}

const SAMPLES = 1400;

const makeSample = (): TrackSample => ({
  position: new Vector3(),
  tangent: new Vector3(0, 0, 1),
  right: new Vector3(-1, 0, 0),
  distance: 0,
  curvature: 0,
  bank: 0,
});

const makeHit = (): TrackHit => ({ ...makeSample(), index: 0, lateral: 0, height: 0 });

export class Track {
  readonly curve: CatmullRomCurve3;
  readonly samples: TrackSample[] = [];
  readonly length: number;
  readonly name = 'COASTLINE CIRCUIT';
  readonly city = 'NEON BAY';

  private a = makeSample();
  private b = makeSample();

  constructor() {
    // The line is deliberately on the 132 m seafront straight: starting it on
    // the closing hairpin made crossing velocity oppose the local tangent and
    // silently broke lap counting. Points are listed from the line onward.
    const points = [
      new Vector3(0, 1.4, 132),
      new Vector3(8, 2.0, 232),
      new Vector3(58, 5.0, 302),
      new Vector3(138, 7.2, 316),
      new Vector3(208, 5.0, 270),
      new Vector3(244, 2.6, 204),
      new Vector3(228, 2.0, 134),
      new Vector3(184, 3.2, 78),
      new Vector3(192, 5.4, 8),
      new Vector3(242, 8.6, -48),
      new Vector3(256, 9.2, -118),
      new Vector3(210, 7.0, -168),
      new Vector3(140, 4.2, -178),
      new Vector3(84, 2.2, -146),
      new Vector3(58, 1.4, -94),
      new Vector3(18, 1.0, -58),
      new Vector3(-26, 1.0, -40),
      new Vector3(-58, 1.1, -6),
      new Vector3(-66, 1.2, 34),
      new Vector3(-48, 1.3, 68),
      new Vector3(-20, 1.3, 74),
      new Vector3(0, 1.3, 100),
    ];
    this.curve = new CatmullRomCurve3(points, true, 'centripetal', 0.5);
    this.curve.arcLengthDivisions = 4000;
    this.length = this.curve.getLength();
    this.build();
  }

  private build(): void {
    for (let i = 0; i < SAMPLES; i += 1) {
      const u = i / SAMPLES;
      const position = this.curve.getPointAt(u);
      const tangent = this.curve.getTangentAt(u).normalize();
      const right = new Vector3().crossVectors(tangent, new Vector3(0, 1, 0)).normalize();
      this.samples.push({
        position,
        tangent,
        right,
        distance: u * this.length,
        curvature: 0,
        bank: 0,
      });
    }
    const ds = this.length / SAMPLES;
    for (let i = 0; i < SAMPLES; i += 1) {
      const cur = this.samples[i];
      const ahead = this.samples[(i + 16) % SAMPLES];
      const yaw0 = Math.atan2(cur.tangent.x, cur.tangent.z);
      const yaw1 = Math.atan2(ahead.tangent.x, ahead.tangent.z);
      let dy = yaw1 - yaw0;
      if (dy > Math.PI) dy -= Math.PI * 2;
      else if (dy < -Math.PI) dy += Math.PI * 2;
      cur.curvature = dy / (16 * ds);
      // Outside of a left-hand corner (negative curvature) is driver-right.
      cur.bank = clamp(-cur.curvature * 3.2, -0.12, 0.12);
    }
    // Smooth camber changes so the car never rolls abruptly across a seam.
    // Circular taps keep the last and first samples continuous.
    const kernel = [1, 2, 3, 2, 1];
    for (let pass = 0; pass < 4; pass += 1) {
      const previous = this.samples.map((s) => s.bank);
      for (let i = 0; i < SAMPLES; i += 1) {
        let sum = 0;
        for (let k = -2; k <= 2; k += 1) {
          sum += previous[(i + k + SAMPLES) % SAMPLES] * kernel[k + 2];
        }
        this.samples[i].bank = sum / 9;
      }
    }
  }

  /** Interpolated frame at arc-length `distance` (wraps). */
  frameAt(distance: number, out: TrackFrame = makeSample()): TrackFrame {
    const d = wrap(distance, this.length);
    let low = 0;
    let high = this.samples.length - 1;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (this.samples[mid].distance < d) low = mid + 1;
      else high = mid;
    }
    const nextIndex = low % this.samples.length;
    const prevIndex = (low - 1 + this.samples.length) % this.samples.length;
    const prev = this.samples[prevIndex];
    const next = this.samples[nextIndex];
    const prevD = prevIndex === this.samples.length - 1 && nextIndex === 0
      ? prev.distance - this.length
      : prev.distance;
    const span = Math.max(1e-4, next.distance - prevD);
    const alpha = clamp((d - prevD) / span, 0, 1);
    out.position.lerpVectors(prev.position, next.position, alpha);
    out.tangent.lerpVectors(prev.tangent, next.tangent, alpha).normalize();
    out.right.crossVectors(out.tangent, UP).normalize();
    out.distance = d;
    out.curvature = prev.curvature + (next.curvature - prev.curvature) * alpha;
    out.bank = prev.bank + (next.bank - prev.bank) * alpha;
    return out;
  }

  /** World position on the banked surface at a given distance/lateral. */
  pointAt(distance: number, lateral: number, out: Vector3 = new Vector3()): Vector3 {
    const f = this.frameAt(distance, this.a);
    out.copy(f.position).addScaledVector(f.right, lateral);
    out.y += lateral * f.bank;
    return out;
  }

  /** Nearest point on the centreline, windowed around a hint with global fallback. */
  nearest(position: Vector3, hint: number, out: TrackHit = makeHit(), radius = 36): TrackHit {
    let bestSq = Number.POSITIVE_INFINITY;
    let bestIndex = 0;
    let bestAlpha = 0;
    const count = this.samples.length;

    const test = (index: number): void => {
      const start = this.samples[index];
      const end = this.samples[(index + 1) % count];
      const sx = end.position.x - start.position.x;
      const sy = end.position.y - start.position.y;
      const sz = end.position.z - start.position.z;
      const lenSq = sx * sx + sy * sy + sz * sz;
      const alpha = lenSq > 1e-9
        ? clamp(((position.x - start.position.x) * sx
          + (position.y - start.position.y) * sy
          + (position.z - start.position.z) * sz) / lenSq, 0, 1)
        : 0;
      const dx = position.x - (start.position.x + sx * alpha);
      const dy = position.y - (start.position.y + sy * alpha);
      const dz = position.z - (start.position.z + sz * alpha);
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < bestSq) {
        bestSq = d2;
        bestIndex = index;
        bestAlpha = alpha;
      }
    };

    if (hint >= 0 && hint < count) {
      for (let o = -radius; o <= radius; o += 1) test((hint + o + count) % count);
      if (bestSq > 40 * 40) {
        bestSq = Number.POSITIVE_INFINITY;
        for (let i = 0; i < count; i += 1) test(i);
      }
    } else {
      for (let i = 0; i < count; i += 1) test(i);
    }

    const start = this.samples[bestIndex];
    const end = this.samples[(bestIndex + 1) % count];
    const span = start.position.distanceTo(end.position);
    out.index = bestIndex;
    out.distance = wrap(start.distance + span * bestAlpha, this.length);
    out.position.lerpVectors(start.position, end.position, bestAlpha);
    out.tangent.lerpVectors(start.tangent, end.tangent, bestAlpha).normalize();
    out.right.crossVectors(out.tangent, UP).normalize();
    out.curvature = start.curvature + (end.curvature - start.curvature) * bestAlpha;
    out.bank = start.bank + (end.bank - start.bank) * bestAlpha;
    out.lateral = out.right.x * (position.x - out.position.x)
      + out.right.z * (position.z - out.position.z);
    out.height = out.position.y + out.lateral * out.bank;
    return out;
  }

  /** Signed forward-progress delta across the start/finish wrap. */
  delta(from: number, to: number): number {
    let d = to - from;
    if (d > this.length * 0.5) d -= this.length;
    else if (d < -this.length * 0.5) d += this.length;
    return d;
  }

  gridSlot(slot: number): { position: Vector3; yaw: number; s: number; lateral: number } {
    const row = Math.floor(slot / 2);
    const lateral = slot % 2 === 0 ? -3.1 : 3.1;
    const s = wrap(-(11 + row * 9.5), this.length);
    const f = this.frameAt(s, this.b);
    const position = f.position.clone().addScaledVector(f.right, lateral);
    position.y += lateral * f.bank + 0.06;
    return { position, yaw: Math.atan2(f.tangent.x, f.tangent.z), s, lateral };
  }

  /** Distance from the centreline — used by scenery clearance assertions. */
  clearance(x: number, z: number): number {
    return Math.abs(this.nearest(new Vector3(x, 0, z), -1).lateral);
  }
}

const UP = new Vector3(0, 1, 0);
