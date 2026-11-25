import * as THREE from 'three';
import type { Vehicle } from '../vehicle/Vehicle';
import { clamp, damp } from '../core/Math';

export type CameraMode = 'chase' | 'hood' | 'wide' | 'showcase';

const MODES: Record<CameraMode, { back: number; up: number; look: number; fov: number }> = {
  chase: { back: 7.2, up: 3.05, look: 13, fov: 64 },
  hood: { back: -0.2, up: 1.35, look: 18, fov: 76 },
  wide: { back: 14.5, up: 7.0, look: 16, fov: 62 },
  showcase: { back: 8.8, up: 3.1, look: 4, fov: 52 },
};

export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  mode: CameraMode = 'chase';
  shakeScale = 0.8;
  private smoothPos = new THREE.Vector3();
  private smoothLook = new THREE.Vector3();
  private prevCar = new THREE.Vector3();
  private delta = new THREE.Vector3();
  private desired = new THREE.Vector3();
  private lookAt = new THREE.Vector3();
  private initialised = false;
  private shake = 0;
  private showcaseAngle = 0;
  private fov = 68;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(68, aspect, 0.12, 6000);
    this.camera.position.set(0, 4, -10);
  }

  setMode(mode: CameraMode): void {
    this.mode = mode;
    this.initialised = false;
  }

  cycle(): CameraMode {
    const order: CameraMode[] = ['chase', 'hood', 'wide'];
    const i = order.indexOf(this.mode);
    this.setMode(order[(i + 1) % order.length]);
    return this.mode;
  }

  addShake(amount: number): void {
    this.shake = Math.min(1.6, this.shake + amount);
  }

  resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  update(dt: number, car: Vehicle, speed01: number, nitro: boolean): void {
    const m = MODES[this.mode];
    this.delta.subVectors(car.pos, this.prevCar);
    this.prevCar.copy(car.pos);
    if (!this.initialised) {
      this.smoothPos.copy(car.pos);
      this.smoothLook.copy(car.pos);
      this.initialised = true;
      this.delta.set(0, 0, 0);
    }
    // Translation feed-forward: carry the camera with the car before damping
    // the relative offset, otherwise it lags metres behind at 300 km/h.
    this.smoothPos.add(this.delta);
    this.smoothLook.add(this.delta);

    const fx = car.forwardX;
    const fz = car.forwardZ;
    if (this.mode === 'showcase') {
      this.showcaseAngle += dt * 0.18;
      const radius = m.back;
      this.desired.set(
        car.pos.x + Math.sin(this.showcaseAngle) * radius,
        car.groundY + m.up + Math.sin(this.showcaseAngle * 0.7) * 0.6,
        car.pos.z + Math.cos(this.showcaseAngle) * radius,
      );
      this.lookAt.copy(car.pos).add(new THREE.Vector3(0, 0.8, 0));
    } else {
      this.desired.set(
        car.pos.x - fx * m.back,
        car.groundY + m.up,
        car.pos.z - fz * m.back,
      );
      this.lookAt.set(
        car.pos.x + fx * m.look,
        car.groundY + 1.05 + speed01 * 0.35,
        car.pos.z + fz * m.look,
      );
      if (this.mode === 'hood') {
        this.desired.set(car.pos.x - fx * 0.15, car.groundY + 1.25, car.pos.z - fz * 0.15);
      }
    }

    const posRate = this.mode === 'showcase' ? 2.2 : this.mode === 'hood' ? 22 : 12;
    const lookRate = this.mode === 'hood' ? 26 : 14;
    this.smoothPos.lerp(this.desired, 1 - Math.exp(-posRate * dt));
    this.smoothLook.lerp(this.lookAt, 1 - Math.exp(-lookRate * dt));

    this.shake = Math.max(0, this.shake - dt * 2.8);
    const amp = this.shake * this.shakeScale;
    this.camera.position.copy(this.smoothPos);
    if (amp > 0.001) {
      this.camera.position.x += (Math.random() - 0.5) * amp * 0.35;
      this.camera.position.y += (Math.random() - 0.5) * amp * 0.25;
      this.camera.position.z += (Math.random() - 0.5) * amp * 0.35;
    }
    this.camera.lookAt(this.smoothLook);
    // Roll via rotateZ AFTER lookAt. Writing Euler .z here flips 180° when the
    // pitch decomposition gets steep — a real regression from an earlier build.
    const roll = clamp(-car.yawRate * 0.035 * speed01, -0.06, 0.06)
      + (Math.random() - 0.5) * amp * 0.018;
    if (Math.abs(roll) > 0.0001) this.camera.rotateZ(roll);

    const targetFov = m.fov + speed01 * 16 + (nitro ? 7 : 0);
    this.fov = damp(this.fov, targetFov, 3.5, dt);
    if (Math.abs(this.camera.fov - this.fov) > 0.01) {
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }
  }

  reset(): void {
    this.initialised = false;
    this.shake = 0;
    this.fov = 68;
  }
}
