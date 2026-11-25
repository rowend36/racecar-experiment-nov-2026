import * as THREE from 'three';
import type { TextureSet } from '../core/Textures';
import { Vehicle } from '../vehicle/Vehicle';
import { clamp } from '../core/Math';

const SMOKE_N = 90;
const SPARK_N = 60;
const SKID_N = 240;

/**
 * Pooled particles (zero per-frame allocation): tire smoke sprites, wall
 * spark points, nitro flames. Plus a ring-buffer skid-mark ribbon.
 */
export class Effects {
  private smoke: THREE.Sprite[] = [];
  private smokeVel: THREE.Vector3[] = [];
  private smokeLife = new Float32Array(SMOKE_N);
  private smokeIdx = 0;
  private sparks: THREE.Points;
  private sparkPos: Float32Array;
  private sparkVel: Float32Array;
  private sparkLife = new Float32Array(SPARK_N);
  private flames: THREE.Sprite[] = [];
  private skidGeo = new THREE.BufferGeometry();
  private skidPos: Float32Array;
  private skidIdx = 0;
  private skidMesh: THREE.Mesh;
  private tmp = new THREE.Vector3();

  constructor(private scene: THREE.Scene, textures: TextureSet) {
    const smokeMat = new THREE.SpriteMaterial({
      map: textures.glow, color: 0x9aa0aa, transparent: true, opacity: 0.35, depthWrite: false,
    });
    for (let i = 0; i < SMOKE_N; i++) {
      const s = new THREE.Sprite(smokeMat.clone());
      s.scale.setScalar(0.001);
      s.visible = false;
      this.scene.add(s);
      this.smoke.push(s);
      this.smokeVel.push(new THREE.Vector3());
    }

    this.sparkPos = new Float32Array(SPARK_N * 3);
    this.sparkVel = new Float32Array(SPARK_N * 3);
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(this.sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffc46b, size: 0.35, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.sparks = new THREE.Points(sparkGeo, sparkMat);
    this.sparks.frustumCulled = false;
    this.scene.add(this.sparks);

    const flameMat = new THREE.SpriteMaterial({
      map: textures.glow, color: 0x66ccff, transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    for (let i = 0; i < 8; i++) {
      const f = new THREE.Sprite(flameMat.clone());
      f.visible = false;
      this.scene.add(f);
      this.flames.push(f);
    }

    this.skidPos = new Float32Array(SKID_N * 2 * 3);
    this.skidGeo.setAttribute('position', new THREE.BufferAttribute(this.skidPos, 3));
    const skidIdx: number[] = [];
    for (let i = 0; i < SKID_N - 1; i++) {
      const r = i * 2;
      skidIdx.push(r, r + 1, r + 2, r + 1, r + 3, r + 2);
    }
    this.skidGeo.setIndex(skidIdx);
    this.skidMesh = new THREE.Mesh(
      this.skidGeo,
      new THREE.MeshBasicMaterial({ color: 0x0a0a0c, transparent: true, opacity: 0.5, depthWrite: false }),
    );
    this.skidMesh.frustumCulled = false;
    this.skidMesh.renderOrder = 1;
    // Park all verts underground initially.
    for (let i = 0; i < SKID_N * 2; i++) this.skidPos[i * 3 + 1] = -50;
    this.scene.add(this.skidMesh);
  }

  puff(p: THREE.Vector3, strength = 1): void {
    const s = this.smoke[this.smokeIdx];
    const i = this.smokeIdx;
    this.smokeIdx = (this.smokeIdx + 1) % SMOKE_N;
    s.visible = true;
    s.position.copy(p);
    s.scale.setScalar(0.6 + strength * 0.5);
    (s.material as THREE.SpriteMaterial).opacity = 0.32;
    this.smokeVel[i].set((Math.random() - 0.5) * 2, 1 + Math.random(), (Math.random() - 0.5) * 2);
    this.smokeLife[i] = 1;
  }

  burst(p: THREE.Vector3, strength = 1): void {
    for (let k = 0; k < 8; k++) {
      const i = Math.floor(Math.random() * SPARK_N);
      this.sparkPos[i * 3] = p.x;
      this.sparkPos[i * 3 + 1] = p.y;
      this.sparkPos[i * 3 + 2] = p.z;
      this.sparkVel[i * 3] = (Math.random() - 0.5) * 14 * strength;
      this.sparkVel[i * 3 + 1] = Math.random() * 8 * strength;
      this.sparkVel[i * 3 + 2] = (Math.random() - 0.5) * 14 * strength;
      this.sparkLife[i] = 0.6;
    }
  }

  skid(x: number, y: number, z: number, wobble: number): void {
    const i = (this.skidIdx % SKID_N) * 6;
    this.skidPos[i] = x - wobble; this.skidPos[i + 1] = y; this.skidPos[i + 2] = z;
    this.skidPos[i + 3] = x + wobble; this.skidPos[i + 4] = y; this.skidPos[i + 5] = z;
    this.skidIdx++;
    (this.skidGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }

  update(dt: number, player: Vehicle): void {
    for (let i = 0; i < SMOKE_N; i++) {
      if (this.smokeLife[i] <= 0) continue;
      this.smokeLife[i] -= dt * 1.4;
      const s = this.smoke[i];
      if (this.smokeLife[i] <= 0) { s.visible = false; s.scale.setScalar(0.001); continue; }
      s.position.addScaledVector(this.smokeVel[i], dt);
      s.scale.addScalar(dt * 2.2);
      (s.material as THREE.SpriteMaterial).opacity = 0.32 * this.smokeLife[i];
    }
    let sparkAlive = false;
    for (let i = 0; i < SPARK_N; i++) {
      if (this.sparkLife[i] <= 0) continue;
      sparkAlive = true;
      this.sparkLife[i] -= dt;
      this.sparkVel[i * 3 + 1] -= 22 * dt;
      this.sparkPos[i * 3] += this.sparkVel[i * 3] * dt;
      this.sparkPos[i * 3 + 1] += this.sparkVel[i * 3 + 1] * dt;
      this.sparkPos[i * 3 + 2] += this.sparkVel[i * 3 + 2] * dt;
    }
    (this.sparks.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    this.sparks.visible = sparkAlive;

    // Nitro flames behind the player car.
    const show = player.nitroActive;
    this.flames.forEach((f, i) => {
      f.visible = show;
      if (show) {
        const side = i % 2 === 0 ? -0.3 : 0.3;
        this.tmp.set(
          player.pos.x - player.forwardX * 2.4 + -player.forwardZ * side,
          player.midY - 0.15,
          player.pos.z - player.forwardZ * 2.4 + player.forwardX * side,
        );
        f.position.copy(this.tmp);
        f.scale.setScalar(0.7 + Math.random() * 0.5);
      }
    });

    // Drift smoke + skid marks at rear wheels.
    if (player.drifting && player.onRoad) {
      const bx = player.pos.x - player.forwardX * 1.5;
      const bz = player.pos.z - player.forwardZ * 1.5;
      if (Math.random() < 0.5) {
        this.tmp.set(bx, player.midY - 0.3, bz);
        this.puff(this.tmp, clamp(player.slip * 2, 0.4, 1.4));
      }
      this.skid(bx, player.midY - 0.48, bz, 0.12);
    }
    // Wall-contact sparks + scrape smoke.
    if (player.wallHit > 0.25) {
      this.tmp.set(player.pos.x, player.midY, player.pos.z);
      this.burst(this.tmp, player.wallHit);
      if (Math.random() < 0.4) this.puff(this.tmp, 0.5);
    }
    player.wallHit = Math.max(0, player.wallHit - dt * 2.5);
    player.carHit = Math.max(0, player.carHit - dt * 2.5);
  }
}
