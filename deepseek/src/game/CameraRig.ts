import * as THREE from 'three';
import { clamp, damp, lerp, rand } from '../core/Math';

const REF_ASPECT = 16 / 9;

export type CameraMode = 'chase' | 'hood' | 'wide';

export interface CameraTarget {
  pos: THREE.Vector3;
  yaw: number;
  speedAbs: number;
  groundY: number;
  steerInput: number;
  slip: number;
  nitroActive: boolean;
}

/**
 * Cinematic chase camera with spring damping, speed FOV, drift look-ahead,
 * impact shake and a showcase orbit for the menu / results.
 */
export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  mode: CameraMode = 'chase';
  private smoothPos = new THREE.Vector3();
  private smoothLook = new THREE.Vector3();
  private initialized = false;
  private trauma = 0;
  private fov = 62;
  private orbit = -0.55;
  private orbitTime = 0;
  private shakeSeed = Math.random() * 1000;
  private roll = 0;
  private lastCarPos = new THREE.Vector3();
  private hasLast = false;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  setMode(mode: CameraMode): void {
    this.mode = mode;
    this.initialized = false;
  }

  cycleMode(): void {
    const order: CameraMode[] = ['chase', 'hood', 'wide'];
    const i = order.indexOf(this.mode);
    this.setMode(order[(i + 1) % order.length]);
  }

  addShake(amount: number): void {
    this.trauma = clamp(this.trauma + amount, 0, 1);
  }

  private fovForAspect(desiredVertical: number): number {
    const aspect = this.camera.aspect;
    if (aspect <= REF_ASPECT) return desiredVertical;
    const horizontal = 2 * Math.atan(Math.tan((desiredVertical * Math.PI) / 360) * REF_ASPECT);
    const vertical = (2 * Math.atan(Math.tan(horizontal / 2) / aspect) * 180) / Math.PI;
    return clamp(vertical, 30, 80);
  }

  private orbitCamera(car: CameraTarget | null, dt: number, fast: boolean): void {
    this.orbitTime += dt;
    this.hasLast = false;
    const base = car ? car.pos : new THREE.Vector3(0, 0, 0);
    const height = car ? car.groundY : 0;
    this.orbit += dt * (fast ? 0.07 : 0.045);
    const radius = 9.4 + Math.sin(this.orbitTime * 0.23) * 0.55;
    // Sit behind the car so the sunset, city and circuit fill the frame.
    const angle = this.orbit + (car ? car.yaw : 0) + Math.PI + 0.55;
    const x = base.x + Math.sin(angle) * radius;
    const z = base.z + Math.cos(angle) * radius;
    const y = height + 2.5 + Math.sin(this.orbitTime * 0.15) * 0.3;
    this.smoothPos.set(x, y, z);
    // Aim slightly left of the car so it sits in the right half of the frame.
    const right = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
    const look = new THREE.Vector3(base.x, height + 0.72, base.z);
    look.addScaledVector(right, -2.2);
    this.smoothLook.copy(look);
    this.camera.position.copy(this.smoothPos);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.smoothLook);
    this.camera.rotateZ(Math.sin(this.orbitTime * 0.2) * 0.004);
    this.fov = damp(this.fov, this.fovForAspect(41), 3, dt);
    this.camera.fov = this.fov;
    this.camera.updateProjectionMatrix();
  }

  update(
    dt: number,
    car: CameraTarget,
    speed01: number,
    showcase: boolean,
    finished: boolean,
  ): void {
    if (showcase || finished) {
      this.orbitCamera(car, dt, finished);
      return;
    }

    const fwdX = Math.sin(car.yaw);
    const fwdZ = Math.cos(car.yaw);
    const rightX = -fwdZ;
    const rightZ = fwdX;
    const speed = car.speedAbs;
    const steer = car.steerInput;
    const driftSide = clamp(car.slip * 2.2, 0, 1.2) * Math.sign(steer);
    const shake = Math.pow(this.trauma, 1.6);

    // Follow the car's translation exactly; only the relative offset lags.
    // Without this, a fast car outruns a damped world-space camera by metres.
    if (this.hasLast) {
      const dx = car.pos.x - this.lastCarPos.x;
      const dz = car.pos.z - this.lastCarPos.z;
      this.smoothPos.x += dx;
      this.smoothPos.z += dz;
      this.smoothLook.x += dx;
      this.smoothLook.z += dz;
    }
    this.lastCarPos.copy(car.pos);
    this.hasLast = true;

    let desired = new THREE.Vector3();
    let look = new THREE.Vector3();
    let targetFov = 62;
    let stiff = 7;

    if (this.mode === 'hood') {
      const shakeAmt = 0.008 + shake * 0.045 + speed01 * 0.003;
      desired.set(
        car.pos.x + fwdX * 0.95 + rightX * 0.02,
        car.groundY + 1.16,
        car.pos.z + fwdZ * 0.95 + rightZ * 0.02,
      );
      look.set(
        car.pos.x + fwdX * 30 + rightX * steer * 1.4,
        car.groundY + 1.02,
        car.pos.z + fwdZ * 30 + rightZ * steer * 1.4,
      );
      desired.x += rand(-shakeAmt, shakeAmt);
      desired.y += rand(-shakeAmt, shakeAmt);
      targetFov = 70 + speed01 * 10;
      stiff = 40;
    } else if (this.mode === 'wide') {
      const back = 13.5 + speed01 * 3.5;
      const height = 5.2 + speed01 * 1.2;
      desired.set(
        car.pos.x - fwdX * back - rightX * steer * 2.5,
        car.groundY + height,
        car.pos.z - fwdZ * back - rightZ * steer * 2.5,
      );
      look.set(
        car.pos.x + fwdX * 8,
        car.groundY + 1.1,
        car.pos.z + fwdZ * 8,
      );
      targetFov = 52 + speed01 * 8;
      stiff = 3.2;
    } else {
      const back = 6.95 + speed01 * 1.1;
      const height = 2.45 + speed01 * 0.35;
      const lateral = -steer * 0.8 - driftSide * 1.0;
      const lateralVel = clamp(car.steerInput, -1, 1);
      desired.set(
        car.pos.x - fwdX * back + rightX * lateral,
        car.groundY + height,
        car.pos.z - fwdZ * back + rightZ * lateral,
      );
      look.set(
        car.pos.x + fwdX * (7.5 + speed * 0.07) + rightX * lateralVel * 1.2,
        car.groundY + 1.15,
        car.pos.z + fwdZ * (7.5 + speed * 0.07) + rightZ * lateralVel * 1.2,
      );
      targetFov = 58 + speed01 * 8 + (car.nitroActive ? 4 : 0);
      stiff = 6.5 + speed01 * 2.5;
    }

    if (!this.initialized) {
      this.smoothPos.copy(desired);
      this.smoothLook.copy(look);
      this.initialized = true;
    } else {
      const posT = 1 - Math.exp(-stiff * dt);
      const lookT = 1 - Math.exp(-(stiff + 4) * dt);
      this.smoothPos.lerp(desired, posT);
      this.smoothLook.lerp(look, lookT);
    }

    this.fov = damp(this.fov, targetFov, 4, dt);
    const targetRoll = -steer * 0.018 * (this.mode === 'hood' ? 0.4 : 1) - driftSide * 0.008;
    this.roll = damp(this.roll, targetRoll, 5, dt);

    // Impact shake: positional jitter plus a tiny rotational jolt.
    const shakeMag = shake * 0.55;
    const t = performance.now() * 0.001 + this.shakeSeed;
    const sx = (Math.sin(t * 61.7) + Math.sin(t * 37.1)) * 0.5 * shakeMag;
    const sy = (Math.sin(t * 53.3) + Math.sin(t * 29.7)) * 0.5 * shakeMag;
    this.camera.position.set(
      this.smoothPos.x + sx,
      this.smoothPos.y + sy + Math.sin(t * 7.3) * speed01 * 0.012,
      this.smoothPos.z + sx * 0.5,
    );
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.smoothLook);
    this.camera.rotateZ(this.roll + sy * 0.01);
    this.camera.fov = this.fovForAspect(this.fov);
    this.camera.updateProjectionMatrix();
    this.trauma = Math.max(0, this.trauma - dt * 1.7);
  }

  /** Snap after a reset / race start so the camera does not fly across the map. */
  snap(car: CameraTarget): void {
    this.initialized = false;
    this.lastCarPos.copy(car.pos);
    this.hasLast = true;
    const fwdX = Math.sin(car.yaw);
    const fwdZ = Math.cos(car.yaw);
    this.smoothPos.set(
      car.pos.x - fwdX * 7,
      car.groundY + 2.1,
      car.pos.z - fwdZ * 7,
    );
    this.smoothLook.set(car.pos.x, car.groundY + 1.1, car.pos.z);
    this.camera.position.copy(this.smoothPos);
    this.camera.lookAt(this.smoothLook);
  }
}
