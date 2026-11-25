import * as THREE from 'three';
import { Vehicle } from '../vehicle/Vehicle';
import { clamp, damp } from '../core/Math';

export type CamMode = 'chase' | 'hood' | 'wide';

/**
 * Chase / hood / wide cameras. The camera feed-forwards the car's own
 * translation (smoothPos += carDelta) so it never lags behind at 300 km/h.
 * Roll uses camera.rotateZ() after lookAt — never overwrite rotation.z
 * (a near-vertical pitch decomposition once flipped the world upside down).
 */
export class CameraRig {
  mode: CamMode = 'chase';
  private smoothPos = new THREE.Vector3();
  private lookPos = new THREE.Vector3();
  private lastCarPos = new THREE.Vector3();
  private shake = 0;
  private fovCur = 68;
  private init = false;

  constructor(private camera: THREE.PerspectiveCamera) {}

  cycle(): void {
    this.mode = this.mode === 'chase' ? 'hood' : this.mode === 'hood' ? 'wide' : 'chase';
    this.init = false;
  }

  addShake(amount: number): void {
    this.shake = Math.min(1, this.shake + amount);
  }

  snapTo(car: Vehicle): void {
    this.init = false;
    this.lastCarPos.set(car.pos.x, car.groundY, car.pos.z);
    this.update(car, 1 / 60);
  }

  private offsets(): { back: number; up: number; look: number } {
    switch (this.mode) {
      case 'hood': return { back: -0.4, up: 1.5, look: 16 };
      case 'wide': return { back: 13.5, up: 5.4, look: 10 };
      default: return { back: 8.4, up: 3.2, look: 9 };
    }
  }

  update(car: Vehicle, dt: number): void {
    const carPos = new THREE.Vector3(car.pos.x, car.groundY, car.pos.z);
    const fwd = new THREE.Vector3(car.forwardX, 0, car.forwardZ);
    const { back, up, look } = this.offsets();

    if (!this.init) {
      this.smoothPos.copy(carPos).addScaledVector(fwd, -back).add(new THREE.Vector3(0, up, 0));
      this.lookPos.copy(carPos).addScaledVector(fwd, look);
      this.lastCarPos.copy(carPos);
      this.init = true;
    }

    // Feed-forward translation, then damp only the relative offset.
    this.smoothPos.add(carPos.clone().sub(this.lastCarPos));
    this.lastCarPos.copy(carPos);

    const desired = carPos.clone().addScaledVector(fwd, -back).add(new THREE.Vector3(0, up, 0));
    const stiff = this.mode === 'hood' ? 60 : 7;
    this.smoothPos.x = damp(this.smoothPos.x, desired.x, stiff, dt);
    this.smoothPos.y = damp(this.smoothPos.y, desired.y, this.mode === 'hood' ? 60 : 5, dt);
    this.smoothPos.z = damp(this.smoothPos.z, desired.z, stiff, dt);

    const lookTarget = carPos.clone().addScaledVector(fwd, look).add(new THREE.Vector3(0, 1.1, 0));
    this.lookPos.x = damp(this.lookPos.x, lookTarget.x, 14, dt);
    this.lookPos.y = damp(this.lookPos.y, lookTarget.y, 10, dt);
    this.lookPos.z = damp(this.lookPos.z, lookTarget.z, 14, dt);

    this.shake = damp(this.shake, 0, 5, dt);
    const pos = this.smoothPos.clone();
    if (this.shake > 0.01) {
      const t = performance.now() * 0.05;
      pos.x += Math.sin(t * 1.3) * 0.12 * this.shake;
      pos.y += Math.cos(t * 1.7) * 0.1 * this.shake;
    }
    this.camera.position.copy(pos);
    this.camera.lookAt(this.lookPos);
    const roll = clamp(-car.yawRate * car.speed * 0.0016, -0.06, 0.06);
    this.camera.rotateZ(roll);

    const speedFov = 68 + clamp(car.speedAbs / 95, 0, 1) * 12 + (car.nitroActive ? 5 : 0);
    this.fovCur = damp(this.fovCur, speedFov, 5, dt);
    if (Math.abs(this.camera.fov - this.fovCur) > 0.05) {
      this.camera.fov = this.fovCur;
      this.camera.updateProjectionMatrix();
    }
  }
}
