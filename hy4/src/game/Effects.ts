import * as THREE from 'three';

const PARTICLE_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aLife;
  varying vec3 vColor;
  varying float vLife;
  void main() {
    vColor = aColor;
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / max(1.0, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;
const PARTICLE_FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vLife;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r = dot(d, d);
    if (r > 0.25) discard;
    float a = smoothstep(0.25, 0.0, r) * clamp(vLife, 0.0, 1.0);
    gl_FragColor = vec4(vColor * a, a);
  }
`;

interface Particle { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; max: number; size: number; r: number; g: number; b: number }

class ParticlePool {
  readonly points: THREE.Points;
  private data: Particle[] = [];
  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;
  private lives: Float32Array;

  constructor(private capacity: number, blending: THREE.Blending) {
    this.positions = new Float32Array(capacity * 3);
    this.colors = new Float32Array(capacity * 3);
    this.sizes = new Float32Array(capacity);
    this.lives = new Float32Array(capacity);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aLife', new THREE.BufferAttribute(this.lives, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setDrawRange(0, 0);
    const mat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
  }

  spawn(p: Particle): void {
    if (this.data.length >= this.capacity) this.data.shift();
    this.data.push(p);
  }

  update(dt: number): void {
    let n = 0;
    for (let i = this.data.length - 1; i >= 0; i -= 1) {
      const p = this.data[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.data.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy += 1.3 * dt;
      p.vx *= 1 - dt * 0.8;
      p.vz *= 1 - dt * 0.8;
    }
    for (const p of this.data) {
      this.positions[n * 3] = p.x;
      this.positions[n * 3 + 1] = p.y;
      this.positions[n * 3 + 2] = p.z;
      this.colors[n * 3] = p.r;
      this.colors[n * 3 + 1] = p.g;
      this.colors[n * 3 + 2] = p.b;
      this.sizes[n] = p.size;
      this.lives[n] = Math.min(1, p.life / p.max);
      n += 1;
    }
    const geo = this.points.geometry;
    geo.setDrawRange(0, n);
    (geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (geo.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true;
    (geo.getAttribute('aSize') as THREE.BufferAttribute).needsUpdate = true;
    (geo.getAttribute('aLife') as THREE.BufferAttribute).needsUpdate = true;
  }
}

export class Effects {
  readonly group = new THREE.Group();
  private smoke = new ParticlePool(900, THREE.NormalBlending);
  private sparks = new ParticlePool(320, THREE.AdditiveBlending);
  private rain: THREE.Points;
  private rainActive = false;
  private skidGeo: THREE.BufferGeometry;
  private skidPositions: Float32Array;
  private skidAlphas: Float32Array;
  private skidCursor = 0;
  private skidMax = 1400;
  private skidMat: THREE.ShaderMaterial;

  constructor(scene: THREE.Scene) {
    this.group.add(this.smoke.points, this.sparks.points);
    scene.add(this.group);

    // Skid marks: ring buffer of quads, each fading with age.
    this.skidPositions = new Float32Array(this.skidMax * 6 * 3);
    this.skidAlphas = new Float32Array(this.skidMax * 6);
    this.skidGeo = new THREE.BufferGeometry();
    this.skidGeo.setAttribute('position', new THREE.BufferAttribute(this.skidPositions, 3).setUsage(THREE.DynamicDrawUsage));
    this.skidGeo.setAttribute('aAlpha', new THREE.BufferAttribute(this.skidAlphas, 1).setUsage(THREE.DynamicDrawUsage));
    this.skidGeo.setDrawRange(0, 0);
    this.skidMat = new THREE.ShaderMaterial({
      vertexShader: `attribute float aAlpha; varying float vA; void main(){ vA=aAlpha; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `precision mediump float; varying float vA; void main(){ gl_FragColor=vec4(0.02,0.02,0.025,vA*0.55); }`,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    scene.add(new THREE.Mesh(this.skidGeo, this.skidMat));

    // Rain curtain that follows the camera.
    const rainCount = 1800;
    const rp = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i += 1) {
      rp[i * 3] = (Math.random() - 0.5) * 90;
      rp[i * 3 + 1] = Math.random() * 45;
      rp[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.BufferAttribute(rp, 3).setUsage(THREE.DynamicDrawUsage));
    const rm = new THREE.PointsMaterial({
      color: 0xb8d4ff, size: 0.16, transparent: true, opacity: 0.45, depthWrite: false,
    });
    this.rain = new THREE.Points(rg, rm);
    this.rain.frustumCulled = false;
    this.rain.visible = false;
    scene.add(this.rain);
  }

  setRain(active: boolean): void {
    this.rainActive = active;
    this.rain.visible = active;
  }

  emitSmoke(x: number, y: number, z: number, vx: number, vz: number, amount = 1): void {
    for (let i = 0; i < amount; i += 1) {
      this.smoke.spawn({
        x: x + (Math.random() - 0.5) * 0.5, y: y + Math.random() * 0.2, z: z + (Math.random() - 0.5) * 0.5,
        vx: vx * 0.16 + (Math.random() - 0.5) * 1.6, vy: 0.5 + Math.random() * 0.6,
        vz: vz * 0.16 + (Math.random() - 0.5) * 1.6,
        life: 0.5 + Math.random() * 0.5, max: 1, size: 0.7 + Math.random() * 0.7,
        r: 0.68, g: 0.70, b: 0.74,
      });
    }
  }

  emitSparks(x: number, y: number, z: number, strength: number): void {
    const count = Math.round(8 + strength * 16);
    for (let i = 0; i < count; i += 1) {
      this.sparks.spawn({
        x, y, z,
        vx: (Math.random() - 0.5) * 10, vy: Math.random() * 6, vz: (Math.random() - 0.5) * 10,
        life: 0.2 + Math.random() * 0.35, max: 0.55, size: 0.18 + Math.random() * 0.15,
        r: 1, g: 0.55 + Math.random() * 0.35, b: 0.14,
      });
    }
  }

  addSkid(x: number, y: number, z: number, yaw: number, width: number): void {
    const rx = -Math.cos(yaw);
    const rz = Math.sin(yaw);
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    const len = 0.55;
    const verts: Array<[number, number, number]> = [
      [x - rx * width - fx * len * 0.5, y, z - rz * width - fz * len * 0.5],
      [x + rx * width - fx * len * 0.5, y, z + rz * width - fz * len * 0.5],
      [x - rx * width + fx * len * 0.5, y, z - rz * width + fz * len * 0.5],
      [x - rx * width + fx * len * 0.5, y, z - rz * width + fz * len * 0.5],
      [x + rx * width - fx * len * 0.5, y, z + rz * width - fz * len * 0.5],
      [x + rx * width + fx * len * 0.5, y, z + rz * width + fz * len * 0.5],
    ];
    const base = this.skidCursor * 18;
    for (let i = 0; i < 6; i += 1) {
      this.skidPositions[base + i * 3] = verts[i][0];
      this.skidPositions[base + i * 3 + 1] = verts[i][1];
      this.skidPositions[base + i * 3 + 2] = verts[i][2];
      this.skidAlphas[this.skidCursor * 6 + i] = 1;
    }
    this.skidCursor = (this.skidCursor + 1) % this.skidMax;
    this.skidGeo.setDrawRange(0, this.skidMax * 6);
    (this.skidGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (this.skidGeo.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
  }

  update(dt: number, camera: THREE.Camera): void {
    this.smoke.update(dt);
    this.sparks.update(dt);
    if (this.rainActive) {
      this.rain.position.copy(camera.position);
      const arr = this.rain.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < arr.count; i += 1) {
        let y = arr.getY(i) - dt * (28 + (i % 7) * 2);
        if (y < 0) y += 45;
        arr.setY(i, y);
      }
      arr.needsUpdate = true;
    }
  }

  reset(): void {
    this.skidCursor = 0;
    this.skidGeo.setDrawRange(0, 0);
  }
}
