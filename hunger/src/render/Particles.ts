import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  NormalBlending,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three';

const CAPACITY = 256;

/** Fixed-size GPU particle pool for tire smoke, dust and collision sparks. */
export class ParticlePool {
  readonly points: Points;
  private readonly positions = new Float32Array(CAPACITY * 3);
  private readonly colors = new Float32Array(CAPACITY * 3);
  private readonly sizes = new Float32Array(CAPACITY);
  private readonly alphas = new Float32Array(CAPACITY);
  private readonly velocities = new Float32Array(CAPACITY * 3);
  private readonly life = new Float32Array(CAPACITY);
  private readonly maxLife = new Float32Array(CAPACITY);
  private readonly gravity = new Float32Array(CAPACITY);
  private readonly geometry: BufferGeometry;
  private readonly material: ShaderMaterial;
  private readonly color = new Color();
  private readonly burstVelocity = new Vector3();
  private cursor = 0;

  constructor(pixelRatio: number) {
    this.geometry = new BufferGeometry();
    this.geometry.setAttribute('position', new BufferAttribute(this.positions, 3).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('aColor', new BufferAttribute(this.colors, 3).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('aSize', new BufferAttribute(this.sizes, 1).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('aAlpha', new BufferAttribute(this.alphas, 1).setUsage(DynamicDrawUsage));
    this.material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      uniforms: { pixelRatio: { value: pixelRatio } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aAlpha;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float pixelRatio;
        void main() {
          vColor = aColor;
          vAlpha = aAlpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = clamp(aSize * pixelRatio * (170.0 / max(1.0, -mvPosition.z)), 1.0, 100.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec2 centered = gl_PointCoord - 0.5;
          float radius = length(centered);
          float alpha = smoothstep(0.5, 0.08, radius) * vAlpha;
          if (alpha < 0.005) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });
    this.points = new Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 4;
  }

  setPixelRatio(pixelRatio: number): void {
    this.material.uniforms.pixelRatio.value = pixelRatio;
  }

  spawn(position: Vector3, velocity: Vector3, color: number, size: number, lifetime: number, gravity = 0): void {
    const index = this.cursor;
    this.cursor = (this.cursor + 1) % CAPACITY;
    const offset = index * 3;
    this.positions[offset] = position.x;
    this.positions[offset + 1] = position.y;
    this.positions[offset + 2] = position.z;
    this.velocities[offset] = velocity.x;
    this.velocities[offset + 1] = velocity.y;
    this.velocities[offset + 2] = velocity.z;
    this.color.set(color);
    this.colors[offset] = this.color.r;
    this.colors[offset + 1] = this.color.g;
    this.colors[offset + 2] = this.color.b;
    this.sizes[index] = size;
    this.life[index] = lifetime;
    this.maxLife[index] = lifetime;
    this.alphas[index] = 1;
    this.gravity[index] = gravity;
  }

  burst(position: Vector3, count: number, color: number, strength: number): void {
    for (let index = 0; index < count; index += 1) {
      this.burstVelocity.set(
        (Math.random() - 0.5) * strength,
        Math.random() * strength * 0.65,
        (Math.random() - 0.5) * strength,
      );
      this.spawn(position, this.burstVelocity, color, 0.08 + Math.random() * 0.1, 0.25 + Math.random() * 0.3, -9);
    }
  }

  update(deltaTime: number): void {
    const dt = Math.min(deltaTime, 0.05);
    for (let index = 0; index < CAPACITY; index += 1) {
      if (this.life[index] <= 0) continue;
      this.life[index] -= dt;
      const offset = index * 3;
      this.velocities[offset + 1] += this.gravity[index] * dt;
      this.velocities[offset] *= Math.exp(-1.8 * dt);
      this.velocities[offset + 2] *= Math.exp(-1.8 * dt);
      this.positions[offset] += this.velocities[offset] * dt;
      this.positions[offset + 1] += this.velocities[offset + 1] * dt;
      this.positions[offset + 2] += this.velocities[offset + 2] * dt;
      this.alphas[index] = Math.max(0, this.life[index] / this.maxLife[index]);
      this.sizes[index] += dt * 0.55;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.aColor.needsUpdate = true;
    this.geometry.attributes.aSize.needsUpdate = true;
    this.geometry.attributes.aAlpha.needsUpdate = true;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
