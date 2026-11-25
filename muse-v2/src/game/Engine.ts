import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { clamp, damp } from '../core/Math';

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    time: { value: 0 },
    speed: { value: 0 },
    flash: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float speed;
    uniform float flash;
    void main() {
      vec2 uv = vUv;
      // Chromatic aberration grows toward edges + with speed.
      vec2 dir = uv - 0.5;
      float ab = 0.0012 + speed * 0.0022;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + dir * ab).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - dir * ab).b;
      // Speed radial blur-ish darkening.
      float r = length(dir);
      col *= 1.0 - speed * 0.28 * smoothstep(0.35, 0.75, r);
      // Vignette.
      col *= 1.0 - 0.42 * smoothstep(0.45, 0.95, r);
      // Film grain.
      float g = fract(sin(dot(uv * (time + 13.0), vec2(12.9898, 78.233))) * 43758.5453);
      col += (g - 0.5) * 0.035;
      // Warm cinematic lift.
      col = col * vec3(1.04, 1.0, 0.96) + vec3(0.012, 0.006, 0.0);
      col += vec3(flash);
      gl_FragColor = vec4(col, 1.0);
    }`,
};

/**
 * HDR renderer: ACES tone mapping, PCF soft shadows, half-float composer
 * with bloom + cinematic grade. Adaptive internal resolution holds 60 fps.
 */
export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;
  private grade: ShaderPass;
  private renderPass: RenderPass;
  fps = 60;
  private fpsAcc = 0;
  private fpsN = 0;
  private fpsT = 0;
  private scale = 1;
  private scaleTimer = 0;
  quality: 'ultra' | 'high' | 'performance' = 'ultra';
  speedAmount = 0;
  flash = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.32;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.fog = new THREE.FogExp2(0x2a1a2e, 0.0016);

    this.camera = new THREE.PerspectiveCamera(68, 1, 0.1, 3000);
    this.camera.position.set(0, 4, -8);

    const rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(this.renderer, rt);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(2, 2), 0.55, 0.75, 0.82);
    this.composer.addPass(this.bloom);
    this.grade = new ShaderPass(GradeShader);
    this.composer.addPass(this.grade);
    this.composer.addPass(new OutputPass());

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  setQuality(q: 'ultra' | 'high' | 'performance'): void {
    this.quality = q;
    const ultra = q === 'ultra';
    const high = q === 'high';
    this.renderer.shadowMap.enabled = q !== 'performance';
    this.bloom.strength = ultra ? 0.55 : high ? 0.4 : 0.25;
    this.bloom.enabled = q !== 'performance';
    this.scale = q === 'performance' ? 0.8 : 1;
    this.resize();
  }

  resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cap = this.quality === 'ultra' ? 2 : this.quality === 'high' ? 1.5 : 1.1;
    const dpr = Math.min(window.devicePixelRatio || 1, cap) * this.scale;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Auto quality: drop internal resolution while fps < 50, recover above 58. */
  adapt(dt: number): void {
    this.fpsAcc += dt;
    this.fpsN++;
    this.fpsT += dt;
    if (this.fpsT >= 0.5) {
      this.fps = this.fpsN / Math.max(0.001, this.fpsAcc);
      this.fpsAcc = 0;
      this.fpsN = 0;
      this.fpsT = 0;
    }
    this.scaleTimer += dt;
    if (this.scaleTimer > 2) {
      this.scaleTimer = 0;
      if (this.fps < 50 && this.scale > 0.55) {
        this.scale = Math.max(0.55, this.scale - 0.1);
        this.resize();
      } else if (this.fps > 58 && this.scale < 1) {
        this.scale = Math.min(1, this.scale + 0.05);
        this.resize();
      }
    }
  }

  render(dt: number, time: number): void {
    this.grade.uniforms.time.value = time;
    this.grade.uniforms.speed.value = damp(this.grade.uniforms.speed.value as number, clamp(this.speedAmount, 0, 1), 4, dt);
    this.grade.uniforms.flash.value = damp(this.grade.uniforms.flash.value as number, this.flash, 8, dt);
    this.composer.render();
  }

  get rendererInfo(): { calls: number; triangles: number } {
    return { calls: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles };
  }
}
