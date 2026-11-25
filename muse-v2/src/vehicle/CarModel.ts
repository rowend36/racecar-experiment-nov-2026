import * as THREE from 'three';
import type { TextureSet } from '../core/Textures';
import { damp } from '../core/Math';

export interface CarSpec {
  id: string;
  name: string;
  topSpeed: number; // m/s
  accel: number;
  grip: number;
  brake: number;
  nitro: number; // efficiency multiplier
  color: number;
  accent: number;
}

export const CAR_SPECS: CarSpec[] = [
  { id: 'volt', name: 'VOLT GT-R', topSpeed: 82, accel: 34, grip: 1.0, brake: 35, nitro: 1.0, color: 0xd2102f, accent: 0x39e6ff },
  { id: 'crimson', name: 'CRIMSON X', topSpeed: 86, accel: 31, grip: 0.94, brake: 32, nitro: 1.12, color: 0x7a0d1e, accent: 0xffb36b },
  { id: 'aurum', name: 'AURUM S', topSpeed: 80, accel: 37, grip: 1.06, brake: 38, nitro: 0.92, color: 0xc8a028, accent: 0xc8ff2e },
];

export const PAINTS = [0xd2102f, 0x1a56ff, 0x0fd07a, 0xc8ff2e, 0xff7a1a, 0xb01aff, 0xe8ecf4, 0x101318];

/**
 * Procedural mid-engine supercar. Faces local +Z. Wheels spin on X, steer on Y
 * with negated input (model faces +Z, so visual steer = -steer).
 */
export class CarModel {
  readonly root = new THREE.Group();
  private body = new THREE.Group();
  private pivots: THREE.Group[] = [];
  private spinners: THREE.Object3D[][] = [];
  private brakeMat: THREE.MeshStandardMaterial;
  private headMat: THREE.MeshStandardMaterial;
  private paintMat: THREE.MeshPhysicalMaterial;
  private wheelRadius = 0.36;

  constructor(public spec: CarSpec, _textures: TextureSet, paint?: number) {
    void _textures;
    const color = paint ?? spec.color;
    this.paintMat = new THREE.MeshPhysicalMaterial({
      color, metalness: 0.75, roughness: 0.32,
      clearcoat: 1, clearcoatRoughness: 0.12,
      envMapIntensity: 1.1,
    });
    const carbon = new THREE.MeshStandardMaterial({ color: 0x0c0e12, roughness: 0.55, metalness: 0.3 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x0a0e16, metalness: 0.9, roughness: 0.08, envMapIntensity: 1.4,
    });
    this.brakeMat = new THREE.MeshStandardMaterial({
      color: 0x550000, emissive: 0xff1a1a, emissiveIntensity: 0.7, roughness: 0.4,
    });
    this.headMat = new THREE.MeshStandardMaterial({
      color: 0xdfefff, emissive: 0xcfe8ff, emissiveIntensity: 2.2, roughness: 0.3,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: spec.accent, emissive: spec.accent, emissiveIntensity: 1.4, roughness: 0.4,
    });

    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      this.body.add(m);
      return m;
    };

    // Main hull: low nose (+Z front), wide rear.
    const hull = add(new THREE.BoxGeometry(1.9, 0.52, 4.4), this.paintMat, 0, 0.62, 0);
    hull.scale.set(1, 1, 1);
    add(new THREE.BoxGeometry(1.7, 0.34, 1.5), this.paintMat, 0, 0.5, 1.85); // nose
    add(new THREE.BoxGeometry(1.94, 0.22, 4.0), carbon, 0, 0.32, -0.1); // side skirts band
    add(new THREE.BoxGeometry(1.5, 0.42, 1.9), glass, 0, 1.02, -0.25); // canopy
    add(new THREE.BoxGeometry(2.0, 0.16, 0.7), carbon, 0, 0.28, 2.25); // splitter
    add(new THREE.BoxGeometry(1.9, 0.14, 0.5), carbon, 0, 0.3, -2.2); // diffuser
    // Rear wing.
    add(new THREE.BoxGeometry(0.14, 0.4, 0.5), carbon, -0.7, 1.0, -2.05);
    add(new THREE.BoxGeometry(0.14, 0.4, 0.5), carbon, 0.7, 1.0, -2.05);
    add(new THREE.BoxGeometry(1.9, 0.1, 0.55), carbon, 0, 1.22, -2.05);
    // Mirrors, vents.
    add(new THREE.BoxGeometry(0.22, 0.1, 0.16), carbon, -1.0, 0.95, 0.35);
    add(new THREE.BoxGeometry(0.22, 0.1, 0.16), carbon, 1.0, 0.95, 0.35);

    // Headlight bar + taillight bar + accent strips.
    add(new THREE.BoxGeometry(1.5, 0.12, 0.08), this.headMat, 0, 0.62, 2.62);
    add(new THREE.BoxGeometry(1.7, 0.12, 0.08), this.brakeMat, 0, 0.72, -2.21);
    add(new THREE.BoxGeometry(0.06, 0.06, 3.2), accentMat, -0.96, 0.5, 0);
    add(new THREE.BoxGeometry(0.06, 0.06, 3.2), accentMat, 0.96, 0.5, 0);

    // Underglow.
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 4.6),
      new THREE.MeshBasicMaterial({ color: spec.accent, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.06;
    this.body.add(glow);

    // Contact shadow (canvas blob; headless-safe stub texture under vitest).
    const shadowTex = (() => {
      if (typeof document === 'undefined') return new THREE.Texture();
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d')!;
      const grad = g.createRadialGradient(32, 32, 4, 32, 32, 32);
      grad.addColorStop(0, 'rgba(0,0,0,0.55)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();
    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 4.9),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.02;
    this.body.add(contact);

    // Wheels: tire + rim + brake disc. Front axle at z=+1.45, rear at z=-1.45.
    const tireGeo = new THREE.CylinderGeometry(this.wheelRadius, this.wheelRadius, 0.3, 18);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.9 });
    const rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.32, 8);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, roughness: 0.3, metalness: 0.9 });
    for (const [x, z, front] of [[-0.85, 1.45, true], [0.85, 1.45, true], [-0.88, -1.45, false], [0.88, -1.45, false]] as Array<[number, number, boolean]>) {
      const pivot = new THREE.Group();
      pivot.position.set(x, this.wheelRadius, z);
      pivot.userData.front = front;
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.castShadow = true;
      const rim = new THREE.Mesh(rimGeo, rimMat);
      pivot.add(tire, rim);
      this.body.add(pivot);
      this.pivots.push(pivot);
      this.spinners.push([tire, rim]);
    }
    this.root.add(this.body);
  }

  setPaint(color: number): void {
    this.paintMat.color.set(color);
  }

  setBodyTilt(roll: number, pitch: number): void {
    this.body.rotation.z = damp(this.body.rotation.z, roll, 8, 1 / 60);
    this.body.rotation.x = damp(this.body.rotation.x, pitch, 8, 1 / 60);
  }

  updateVisual(dt: number, vLong: number, steerInput: number, _slip: number, braking: boolean): void {
    void _slip;
    // Wheel spin + front steering (model faces +Z: visual steer is negated).
    for (let i = 0; i < this.pivots.length; i++) {
      const pivot = this.pivots[i];
      for (const w of this.spinners[i]) w.rotation.x += (vLong / this.wheelRadius) * dt;
      if (pivot.userData.front) {
        pivot.rotation.y = damp(pivot.rotation.y, -steerInput * 0.42, 14, dt);
      }
    }
    const target = braking ? 3.2 : 0.7;
    this.brakeMat.emissiveIntensity = damp(this.brakeMat.emissiveIntensity, target, 12, dt);
  }
}
