import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { clamp, damp } from './Math';

export type Quality = 'ultra' | 'high' | 'performance';

interface QualityPreset {
  pixelCap: number;
  shadowMapSize: number;
  bloom: boolean;
  fxaa: boolean;
  maxBloom: number;
}

const PRESETS: Record<Quality, QualityPreset> = {
  ultra: { pixelCap: 2, shadowMapSize: 2048, bloom: true, fxaa: true, maxBloom: 1 },
  high: { pixelCap: 1.5, shadowMapSize: 1536, bloom: true, fxaa: true, maxBloom: 0.85 },
  performance: { pixelCap: 1.1, shadowMapSize: 1024, bloom: true, fxaa: true, maxBloom: 0.65 },
};

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uSpeed: { value: 0 },
    uExposure: { value: 0.94 },
    uGrain: { value: 0.022 },
    uVignette: { value: 0.42 },
    uChroma: { value: 0.0018 },
    uFlash: { value: 0 },
    uSat: { value: 1.06 },
    uContrast: { value: 1.035 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uExposure;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uChroma;
    uniform float uFlash;
    uniform float uSat;
    uniform float uContrast;
    uniform vec2 uResolution;
    varying vec2 vUv;

    vec3 aces(vec3 x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
    }

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);

      // Radial speed blur, weighted toward the frame edges.
      float blur = uSpeed * 0.055 * (0.25 + r2 * 2.2);
      vec3 col = vec3(0.0);
      float total = 0.0;
      for (int i = 0; i < 6; i++) {
        float t = float(i) / 5.0;
        float w = 1.0 - t * 0.72;
        col += texture2D(tDiffuse, uv - c * t * blur).rgb * w;
        total += w;
      }
      col /= total;

      // Chromatic aberration.
      vec2 ca = c * (uChroma * (0.6 + r2 * 2.4));
      col.r = mix(col.r, texture2D(tDiffuse, uv + ca).r, 0.5);
      col.b = mix(col.b, texture2D(tDiffuse, uv - ca).b, 0.5);

      col = aces(col * uExposure);

      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(col, col * vec3(0.84, 0.97, 1.14), (1.0 - lum) * 0.34);       // cool shadows
      col = mix(col, col * vec3(1.10, 1.005, 0.89), smoothstep(0.32, 1.0, lum) * 0.36); // warm highs
      col = mix(vec3(lum), col, uSat);
      col = (col - 0.5) * uContrast + 0.5;

      col += vec3(0.55, 0.65, 0.95) * uFlash;

      float vig = smoothstep(1.02, 0.25, length(c) * 1.35);
      col *= mix(1.0, vig, uVignette);

      float g = rand(uv * uResolution + fract(uTime) * 137.0) - 0.5;
      col += g * uGrain;

      col = pow(max(col, 0.0), vec3(1.0 / 2.2));
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly composer: EffectComposer;
  private renderPass: RenderPass;
  private bloomPass: UnrealBloomPass;
  private gradePass: ShaderPass;
  private fxaaPass: ShaderPass;
  private width = 1;
  private height = 1;
  private quality: Quality = 'ultra';
  private pixelCap = 2;
  private baseScale = 1;
  private renderScale = 1;
  private adaptTimer = 0;
  private frameAccum = 0;
  private frameCount = 0;
  private fpsEMA = 60;
  private upWindows = 0;
  private elapsed = 0;
  private targetBloom = 0.32;
  private targetExposure = 1.05;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      stencil: false,
      depth: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x05070c, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.autoClear = true;

    this.camera = new THREE.PerspectiveCamera(62, 1, 0.25, 5200);

    const size = this.measure();
    this.width = size.w;
    this.height = size.h;
    const dpr = window.devicePixelRatio || 1;
    this.baseScale = Math.min(dpr, this.pixelCap);
    this.renderer.setPixelRatio(this.baseScale);
    this.renderer.setSize(this.width, this.height, false);

    const target = new THREE.WebGLRenderTarget(
      Math.max(2, Math.floor(this.width * this.baseScale)),
      Math.max(2, Math.floor(this.height * this.baseScale)),
      { type: THREE.HalfFloatType, samples: 0 },
    );
    this.composer = new EffectComposer(this.renderer, target);
    this.composer.setPixelRatio(this.baseScale);
    this.composer.setSize(this.width, this.height);

    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      0.36,
      0.55,
      1.12,
    );
    this.composer.addPass(this.bloomPass);

    this.gradePass = new ShaderPass(GradeShader);
    this.composer.addPass(this.gradePass);

    this.fxaaPass = new ShaderPass(FXAAShader);
    this.composer.addPass(this.fxaaPass);

    this.applyResolution();
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  private measure(): { w: number; h: number } {
    const canvas = this.renderer.domElement;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    return { w: Math.max(1, w), h: Math.max(1, h) };
  }

  private onResize = (): void => {
    const { w, h } = this.measure();
    this.width = w;
    this.height = h;
    this.renderer.setPixelRatio(this.baseScale * this.renderScale);
    this.renderer.setSize(w, h, false);
    this.composer.setPixelRatio(this.baseScale * this.renderScale);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.applyResolution();
  };

  private applyResolution(): void {
    const pr = this.baseScale * this.renderScale;
    this.fxaaPass.material.uniforms['resolution'].value.set(
      1 / (this.width * pr),
      1 / (this.height * pr),
    );
    this.gradePass.uniforms.uResolution.value.set(this.width * pr, this.height * pr);
  }

  setQuality(q: Quality): void {
    this.quality = q;
    this.pixelCap = PRESETS[q].pixelCap;
    this.upWindows = 0;
    const dpr = window.devicePixelRatio || 1;
    this.baseScale = Math.min(dpr, this.pixelCap);
    this.renderScale = 1;
    this.fxaaPass.enabled = PRESETS[q].fxaa;
    this.applyResolution();
    this.onResize();
  }

  getQuality(): Quality {
    return this.quality;
  }

  get shadowMapSize(): number {
    return PRESETS[this.quality].shadowMapSize;
  }

  setBloom(strength: number): void {
    this.targetBloom = strength * PRESETS[this.quality].maxBloom;
  }

  setExposure(v: number): void {
    this.targetExposure = v;
  }

  setSpeedBlur(v: number): void {
    this.gradePass.uniforms.uSpeed.value = v;
  }

  setFlash(v: number): void {
    this.gradePass.uniforms.uFlash.value = v;
  }

  setVignette(v: number): void {
    this.gradePass.uniforms.uVignette.value = v;
  }

  setChroma(v: number): void {
    this.gradePass.uniforms.uChroma.value = v;
  }

  get fps(): number {
    return this.fpsEMA;
  }

  private adaptResolution(dt: number): void {
    this.adaptTimer += dt;
    if (this.adaptTimer < 0.9) return;
    this.adaptTimer = 0;
    const fps = this.fpsEMA;
    if (fps < 49 && this.renderScale > 0.62) {
      this.renderScale = Math.max(0.62, this.renderScale - 0.09);
      this.upWindows = 0;
      this.onResize();
    } else if (fps > 58) {
      this.upWindows++;
      if (this.upWindows >= 3 && this.renderScale < 1) {
        this.renderScale = Math.min(1, this.renderScale + 0.06);
        this.upWindows = 0;
        this.onResize();
      }
    } else {
      this.upWindows = 0;
    }
  }

  render(dt: number, speedBlur = 0): void {
    this.elapsed += dt;
    this.frameAccum += dt;
    this.frameCount++;
    if (this.frameAccum > 0.25) {
      const inst = this.frameCount / this.frameAccum;
      this.fpsEMA = damp(this.fpsEMA, inst, 3.0, this.frameAccum);
      this.frameAccum = 0;
      this.frameCount = 0;
    }
    this.adaptResolution(dt);
    this.gradePass.uniforms.uTime.value = this.elapsed;
    this.gradePass.uniforms.uSpeed.value = speedBlur;
    const bloom = this.bloomPass.strength;
    this.bloomPass.strength = damp(bloom, this.targetBloom, 2.4, dt);
    const exposure = this.gradePass.uniforms.uExposure.value as number;
    this.gradePass.uniforms.uExposure.value = damp(exposure, this.targetExposure, 2.4, dt);
    this.composer.render(dt);
  }

  get rendererInfo(): { calls: number; triangles: number; textures: number } {
    const info = this.renderer.info.render;
    return { calls: info.calls, triangles: info.triangles, textures: this.renderer.info.memory.textures };
  }

  setSpeedShake(v: number): number {
    return clamp(v, 0, 1);
  }
}
