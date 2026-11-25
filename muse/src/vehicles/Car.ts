import * as THREE from 'three';
import { makeCarPaint, makeGlass, makeHeadlight, makeTaillight } from '../graphics/Materials';

export interface CarSpec {
  name: string; color: number; topSpeed: number; accel: number; grip: number; nitroPower: number;
}

export const CAR_SPECS: CarSpec[] = [
  { name: 'VOLT GT-R', color: 0x00c8ff, topSpeed: 82, accel: 34, grip: 1.0, nitroPower: 26 },
  { name: 'CRIMSON X', color: 0xff1744, topSpeed: 86, accel: 31, grip: 0.94, nitroPower: 30 },
  { name: 'AURUM S', color: 0xffb300, topSpeed: 80, accel: 37, grip: 1.06, nitroPower: 24 },
];

// Procedural supercar: beveled body + cabin + aero + wheels + lights. Casts shadows.
export class CarMesh {
  group = new THREE.Group();
  wheels: THREE.Mesh[] = [];
  bodyMat: THREE.MeshPhysicalMaterial;
  brakeMat: THREE.MeshStandardMaterial;
  wheelSpin = 0;

  constructor(spec: CarSpec) {
    this.bodyMat = makeCarPaint(spec.color);

    const body = new THREE.Mesh(this.bodyGeometry(), this.bodyMat);
    body.castShadow = true; body.receiveShadow = false;
    this.group.add(body);

    const cabin = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
      makeGlass()
    );
    cabin.scale.set(0.85, 0.5, 1.15);
    cabin.position.set(0, 0.62, 0.25);
    cabin.castShadow = true;
    this.group.add(cabin);

    // aero: splitter + spoiler + diffuser glow
    const carbon = new THREE.MeshStandardMaterial({ color: 0x0b0d12, roughness: 0.35, metalness: 0.8 });
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.5), carbon);
    splitter.position.set(0, 0.16, 2.15); this.group.add(splitter);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.09, 0.5), carbon);
    wing.position.set(0, 1.02, -1.95); wing.rotation.x = -0.12; wing.castShadow = true; this.group.add(wing);
    for (const sx of [-0.8, 0.8]) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.5, 0.55), carbon);
      fin.position.set(sx, 0.78, -1.95); this.group.add(fin);
    }
    const skirts: THREE.Mesh[] = [];
    for (const sx of [-1.02, 1.02]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 2.6), carbon);
      s.position.set(sx, 0.22, 0); this.group.add(s); skirts.push(s);
    }

    // headlights / taillight bar / underglow
    const hl = makeHeadlight();
    for (const sx of [-0.62, 0.62]) {
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.14, 0.1), hl);
      h.position.set(sx, 0.52, 2.28); h.rotation.x = -0.15; this.group.add(h);
    }
    this.brakeMat = makeTaillight();
    const tail = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.08), this.brakeMat);
    tail.position.set(0, 0.6, -2.12); this.group.add(tail);

    const under = new THREE.PointLight(spec.color, 18, 7, 2);
    under.position.set(0, 0.25, 0);
    this.group.add(under);

    // headlight beams
    const beam = new THREE.SpotLight(0xcfe8ff, 260, 60, 0.5, 0.5, 1.6);
    beam.position.set(0, 0.8, 2.2);
    const tgt = new THREE.Object3D(); tgt.position.set(0, 0, 30);
    this.group.add(tgt); beam.target = tgt; this.group.add(beam);

    // wheels
    const tireG = new THREE.CylinderGeometry(0.38, 0.38, 0.32, 20);
    tireG.rotateZ(Math.PI / 2);
    const tireM = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.85 });
    const rimG = new THREE.CylinderGeometry(0.22, 0.22, 0.34, 8);
    rimG.rotateZ(Math.PI / 2);
    const rimM = new THREE.MeshStandardMaterial({ color: 0xd7dde8, metalness: 0.95, roughness: 0.25 });
    const pos: Array<[number, number]> = [[-0.95, 1.35], [0.95, 1.35], [-0.95, -1.35], [0.95, -1.35]];
    for (const [x, z] of pos) {
      const w = new THREE.Group();
      const t = new THREE.Mesh(tireG, tireM); t.castShadow = true;
      const r = new THREE.Mesh(rimG, rimM);
      w.add(t, r); w.position.set(x, 0.38, z);
      this.group.add(w);
      this.wheels.push(t);
    }
  }

  private bodyGeometry(): THREE.BufferGeometry {
    // Low, wide supercar silhouette via shaped extrude
    const s = new THREE.Shape();
    s.moveTo(-1.0, -2.1); s.lineTo(-1.02, -0.6); s.lineTo(-0.88, 0.7);
    s.lineTo(-0.95, 1.6); s.lineTo(-0.55, 2.25); s.lineTo(0.55, 2.25);
    s.lineTo(0.95, 1.6); s.lineTo(0.88, 0.7); s.lineTo(1.02, -0.6); s.lineTo(1.0, -2.1);
    s.quadraticCurveTo(0, -2.35, -1.0, -2.1);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.12, bevelSegments: 3, steps: 1 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.35, 0);
    g.computeVertexNormals();
    return g;
  }

  updateVisual(speedMs: number, steer: number, braking: boolean, dt: number) {
    this.wheelSpin += (speedMs / 0.38) * dt;
    for (let i = 0; i < this.wheels.length; i++) {
      this.wheels[i].rotation.x = this.wheelSpin;
      // front wheels steer visually (steer +1 = right = negative yaw for +Z-forward car)
      if (i < 2) this.wheels[i].rotation.y = -steer * 0.4;
    }
    this.brakeMat.emissiveIntensity = braking ? 8 : 3.2;
    // body roll: lean out of the turn (right turn = roll left)
    this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, steer * Math.min(0.06, speedMs * 0.001), 0.15);
  }
}
