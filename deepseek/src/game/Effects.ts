import * as THREE from 'three';
import { TextureSet } from '../core/Textures';
import { Vehicle } from '../vehicle/Vehicle';
import { clamp, rand, TAU } from '../core/Math';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  grow: number;
  alpha: number;
  r: number;
  g: number;
  b: number;
  drag: number;
  buoy: number;
}

class ParticlePool {
  readonly points: THREE.Points;
  private particles: Particle[] = [];
  private positions: Float32Array;
  private sizes: Float32Array;
  private alphas: Float32Array;
  private colors: Float32Array;
  private cursor = 0;
  private geometry: THREE.BufferGeometry;
  private readonly capacity: number;

  constructor(capacity: number, map: THREE.Texture, additive: boolean) {
    this.capacity = capacity;
    this.positions = new Float32Array(capacity * 3);
    this.sizes = new Float32Array(capacity);
    this.alphas = new Float32Array(capacity);
    this.colors = new Float32Array(capacity * 3);
    for (let i = 0; i < capacity; i++) {
      this.particles.push({
        x: 0, y: -9999, z: 0, vx: 0, vy: 0, vz: 0,
        life: 0, maxLife: 1, size: 0, grow: 0, alpha: 0,
        r: 1, g: 1, b: 1, drag: 1, buoy: 0,
      });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.colors, 3));
    this.geometry = geo;
    const mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: map } },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aAlpha;
        attribute vec3 aColor;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = clamp(aSize * (420.0 / max(1.0, -mv.z)), 1.0, 220.0);
          gl_Position = projectionMatrix * mv;
          vAlpha = aAlpha;
          vColor = aColor;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(vColor * tex.rgb, tex.a * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
  }

  spawn(p: Partial<Particle> & { x: number; y: number; z: number }): void {
    const idx = this.cursor;
    this.cursor = (this.cursor + 1) % this.capacity;
    const particle = this.particles[idx];
    particle.x = p.x;
    particle.y = p.y;
    particle.z = p.z;
    particle.vx = p.vx ?? 0;
    particle.vy = p.vy ?? 0;
    particle.vz = p.vz ?? 0;
    particle.maxLife = p.maxLife ?? 1;
    particle.life = particle.maxLife;
    particle.size = p.size ?? 1;
    particle.grow = p.grow ?? 0;
    particle.alpha = p.alpha ?? 0.5;
    particle.r = p.r ?? 1;
    particle.g = p.g ?? 1;
    particle.b = p.b ?? 1;
    particle.drag = p.drag ?? 1;
    particle.buoy = p.buoy ?? 0;
  }

  update(dt: number): void {
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i];
      const o = i * 3;
      if (p.life <= 0) {
        this.alphas[i] = 0;
        this.sizes[i] = 0;
        this.positions[o + 1] = -9999;
        continue;
      }
      p.life -= dt;
      const dragF = Math.exp(-p.drag * dt);
      p.vx *= dragF;
      p.vz *= dragF;
      p.vy = p.vy * dragF + p.buoy * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.size += p.grow * dt;
      const lifeT = clamp(p.life / p.maxLife, 0, 1);
      this.positions[o] = p.x;
      this.positions[o + 1] = p.y;
      this.positions[o + 2] = p.z;
      this.sizes[i] = p.size;
      this.alphas[i] = p.alpha * lifeT * lifeT;
      this.colors[o] = p.r;
      this.colors[o + 1] = p.g;
      this.colors[o + 2] = p.b;
    }
    this.geometry.attributes.position.needsUpdate = true;
    (this.geometry.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
    (this.geometry.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    (this.geometry.attributes.aColor as THREE.BufferAttribute).needsUpdate = true;
  }

  clear(): void {
    for (const p of this.particles) p.life = 0;
    this.update(0.016);
  }
}

export class Effects {
  private smoke: ParticlePool;
  private sparks: ParticlePool;
  private flames: ParticlePool;
  private rain: THREE.LineSegments;
  private rainVel: Float32Array;
  private rainCount = 1100;
  private storm = false;
  private skidMesh: THREE.Mesh;
  private skidPositions: Float32Array;
  private skidAlphas: Float32Array;
  private skidGeo: THREE.BufferGeometry;
  private skidCursor = 0;
  private skidMax = 1500;
  private lastSkid = new WeakMap<Vehicle, number>();
  private lastFlame = new WeakMap<Vehicle, number>();
  private rainPositions: Float32Array;

  constructor(scene: THREE.Scene, textures: TextureSet) {
    this.smoke = new ParticlePool(360, textures.smoke, false);
    this.sparks = new ParticlePool(220, textures.spark, true);
    this.flames = new ParticlePool(140, textures.spark, true);
    scene.add(this.smoke.points, this.sparks.points, this.flames.points);

    this.skidPositions = new Float32Array(this.skidMax * 4 * 3);
    this.skidAlphas = new Float32Array(this.skidMax * 4);
    const indices = new Uint32Array(this.skidMax * 6);
    for (let i = 0; i < this.skidMax; i++) {
      const v = i * 4;
      const o = i * 6;
      indices[o] = v;
      indices[o + 1] = v + 1;
      indices[o + 2] = v + 2;
      indices[o + 3] = v + 2;
      indices[o + 4] = v + 1;
      indices[o + 5] = v + 3;
    }
    this.skidGeo = new THREE.BufferGeometry();
    this.skidGeo.setAttribute('position', new THREE.BufferAttribute(this.skidPositions, 3));
    this.skidGeo.setAttribute('aAlpha', new THREE.BufferAttribute(this.skidAlphas, 1));
    this.skidGeo.setIndex(new THREE.BufferAttribute(indices, 1));
    const skidMat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        attribute float aAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = aAlpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(0.015, 0.016, 0.02, vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    });
    this.skidMesh = new THREE.Mesh(this.skidGeo, skidMat);
    this.skidMesh.frustumCulled = false;
    this.skidMesh.renderOrder = 2;
    scene.add(this.skidMesh);

    // Rain streak buffer.
    this.rainPositions = new Float32Array(this.rainCount * 6);
    this.rainVel = new Float32Array(this.rainCount);
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(this.rainPositions, 3));
    const rainMat = new THREE.LineBasicMaterial({
      color: 0xaac8ff,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    this.rain = new THREE.LineSegments(rainGeo, rainMat);
    this.rain.frustumCulled = false;
    this.rain.visible = false;
    scene.add(this.rain);
    for (let i = 0; i < this.rainCount; i++) {
      this.rainVel[i] = 32 + Math.random() * 26;
      this.rainPositions[i * 6] = (Math.random() - 0.5) * 90;
      this.rainPositions[i * 6 + 1] = Math.random() * 40;
      this.rainPositions[i * 6 + 2] = (Math.random() - 0.5) * 90;
    }
  }

  setStorm(on: boolean): void {
    this.storm = on;
    this.rain.visible = on;
  }

  tireSmoke(car: Vehicle, dt: number): void {
    const intensity = car.drifting ? clamp(car.slip * 1.8, 0.15, 1) : car.offRoad && car.speedAbs > 6 ? 0.4 : 0;
    if (intensity <= 0.05) return;
    const spawnCount = Math.random() < intensity * dt * 28 ? 2 : 0;
    const dust = car.offRoad;
    const fwdX = Math.sin(car.yaw);
    const fwdZ = Math.cos(car.yaw);
    const rx = -fwdZ;
    const rz = fwdX;
    for (let i = 0; i < spawnCount; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = car.pos.x - fwdX * 1.5 + rx * side * 0.92;
      const z = car.pos.z - fwdZ * 1.5 + rz * side * 0.92;
      const shade = dust ? 0.72 + Math.random() * 0.15 : 0.52 + Math.random() * 0.2;
      this.smoke.spawn({
        x: x + rand(-0.15, 0.15),
        y: car.groundY + 0.25,
        z: z + rand(-0.15, 0.15),
        vx: -fwdX * rand(0.5, 2.5) + rand(-0.8, 0.8),
        vy: rand(0.4, 1.3),
        vz: -fwdZ * rand(0.5, 2.5) + rand(-0.8, 0.8),
        maxLife: dust ? rand(0.8, 1.6) : rand(0.7, 1.4),
        size: rand(0.9, 2.1),
        grow: rand(2.2, 4.5),
        alpha: 0.11 + intensity * 0.1,
        r: shade,
        g: shade * (dust ? 0.9 : 0.97),
        b: shade,
        drag: 1.1,
        buoy: 0.75,
      });
    }
    if (car.speedAbs > 4 && Math.random() < intensity * dt * 34) {
      this.laySkid(car, dt);
    }
  }

  laySkid(car: Vehicle, dt: number): void {
    const last = this.lastSkid.get(car) ?? 0;
    const now = performance.now() / 1000;
    if (now - last < 0.035) return;
    this.lastSkid.set(car, now);
    const fwdX = Math.sin(car.yaw);
    const fwdZ = Math.cos(car.yaw);
    const rx = -fwdZ;
    const rz = fwdX;
    const halfLen = clamp(car.speedAbs * dt * 0.7, 0.12, 0.55);
    const halfW = 0.13;
    const y = car.groundY + 0.035;
    for (const side of [-1, 1]) {
      const cx = car.pos.x - fwdX * 1.5 + rx * side * 0.92;
      const cz = car.pos.z - fwdZ * 1.5 + rz * side * 0.92;
      const idx = this.skidCursor;
      this.skidCursor = (this.skidCursor + 1) % this.skidMax;
      const base = idx * 12;
      const pts = [
        [cx - fwdX * halfLen - rx * halfW, cz - fwdZ * halfLen - rz * halfW],
        [cx - fwdX * halfLen + rx * halfW, cz - fwdZ * halfLen + rz * halfW],
        [cx + fwdX * halfLen - rx * halfW, cz + fwdZ * halfLen - rz * halfW],
        [cx + fwdX * halfLen + rx * halfW, cz + fwdZ * halfLen + rz * halfW],
      ];
      for (let i = 0; i < 4; i++) {
        this.skidPositions[base + i * 3] = pts[i][0];
        this.skidPositions[base + i * 3 + 1] = y;
        this.skidPositions[base + i * 3 + 2] = pts[i][1];
        this.skidAlphas[idx * 4 + i] = clamp(car.slip * 0.55, 0.12, 0.42);
      }
    }
    (this.skidGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.skidGeo.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
  }

  sparkBurst(x: number, y: number, z: number, strength: number): void {
    const n = Math.floor(6 + strength * 22);
    for (let i = 0; i < n; i++) {
      this.sparks.spawn({
        x, y, z,
        vx: rand(-7, 7) * (0.5 + strength),
        vy: rand(1, 8) * (0.4 + strength),
        vz: rand(-7, 7) * (0.5 + strength),
        maxLife: rand(0.25, 0.7),
        size: rand(0.13, 0.36),
        grow: -0.05,
        alpha: 0.95,
        r: 1.0,
        g: 0.55 + Math.random() * 0.3,
        b: 0.15,
        drag: 0.6,
        buoy: -13,
      });
    }
  }

  flame(car: Vehicle): void {
    if (!car.nitroActive) return;
    const now = performance.now() / 1000;
    if (now - (this.lastFlame.get(car) ?? 0) < 0.045) return;
    this.lastFlame.set(car, now);
    const fwdX = Math.sin(car.yaw);
    const fwdZ = Math.cos(car.yaw);
    const rx = -fwdZ;
    const rz = fwdX;
    for (const side of [-1, 1]) {
      this.flames.spawn({
        x: car.pos.x - fwdX * 2.4 + rx * side * 0.27,
        y: car.groundY + 0.4,
        z: car.pos.z - fwdZ * 2.4 + rz * side * 0.27,
        vx: -fwdX * rand(5, 12) + rand(-0.6, 0.6),
        vy: rand(0.1, 0.8),
        vz: -fwdZ * rand(5, 12) + rand(-0.6, 0.6),
        maxLife: rand(0.04, 0.1),
        size: rand(0.25, 0.5),
        grow: -1.4,
        alpha: 0.32,
        r: 0.3,
        g: 0.6,
        b: 1.4,
        drag: 1.5,
        buoy: 0,
      });
    }
  }

  update(dt: number, camera: THREE.PerspectiveCamera, speed01: number): void {
    this.smoke.update(dt);
    this.sparks.update(dt);
    this.flames.update(dt);

    if (this.rain.visible) {
      const pos = this.rain.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const cx = camera.position.x;
      const cy = camera.position.y;
      const cz = camera.position.z;
      for (let i = 0; i < this.rainCount; i++) {
        const o = i * 6;
        arr[o + 1] -= this.rainVel[i] * dt;
        arr[o] += dt * 5.5;
        const y = arr[o + 1];
        if (
          y < cy - 16 ||
          Math.abs(arr[o] - cx) > 48 ||
          Math.abs(arr[o + 2] - cz) > 48
        ) {
          arr[o] = cx + (Math.random() - 0.5) * 80;
          arr[o + 1] = cy + 12 + Math.random() * 16;
          arr[o + 2] = cz + (Math.random() - 0.5) * 80;
        }
        arr[o + 3] = arr[o] - 0.09;
        arr[o + 4] = arr[o + 1] + 0.75;
        arr[o + 5] = arr[o + 2];
      }
      pos.needsUpdate = true;
    }
    if (speed01 > 0.7 && Math.random() < 0.3) {
      // A few speed motes near the camera sell the sense of velocity.
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const x = camera.position.x + dir.x * 8 + rand(-20, 20);
      const y = camera.position.y + rand(-4, 5);
      const z = camera.position.z + dir.z * 8 + rand(-20, 20);
      this.smoke.spawn({
        x, y, z,
        vx: -dir.x * 30,
        vy: 0,
        vz: -dir.z * 30,
        maxLife: 0.25,
        size: 0.25,
        grow: -0.2,
        alpha: 0.22,
        r: 0.7,
        g: 0.85,
        b: 1,
        drag: 0.2,
        buoy: 0,
      });
    }
  }

  clear(): void {
    this.smoke.clear();
    this.sparks.clear();
    this.flames.clear();
    this.skidAlphas.fill(0);
    (this.skidGeo.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
  }
}
