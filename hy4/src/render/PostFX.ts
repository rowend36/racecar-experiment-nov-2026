import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { clamp } from '../core/Math';

export interface FXTelemetry {
  speed01: number;
  nitro: boolean;
  impact: number;
  flash: number;
  rain: number;
}

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uSpeed: { value: 0 },
    uNitro: { value: 0 },
    uImpact: { value: 0 },
    uFlash: { value: 0 },
    uRain: { value: 0 },
    uStrength: { value: 1 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float uTime, uSpeed, uNitro, uImpact, uFlash, uRain, uStrength;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5);
      vec2 toCenter = uv - center;
      float r2 = dot(toCenter, toCenter);
      float speed = uSpeed * uStrength;

      // Radial speed blur: 5 taps toward the vanishing point.
      vec3 col = texture2D(tDiffuse, uv).rgb;
      if (speed > 0.02) {
        float amt = speed * (0.0035 + r2 * 0.016);
        for (int i = 1; i <= 5; i++) {
          float t = float(i) / 5.0;
          col += texture2D(tDiffuse, uv - toCenter * amt * t).rgb;
        }
        col /= 6.0;
      }

      // Chromatic aberration grows towards the frame edge and with boost.
      float ab = (0.00022 + speed * 0.00085 + uNitro * 0.0006) * uStrength;
      vec2 off = toCenter * ab;
      col.r = texture2D(tDiffuse, uv + off).r;
      col.b = texture2D(tDiffuse, uv - off).b;

      // Filmic contrast lift + cool shadows / warm highlights.
      col = max(vec3(0.0), col);
      col = col * col * (3.0 - 2.0 * col) * 0.24 + col * 0.76;
      col += vec3(0.012, 0.016, 0.030) * (1.0 - smoothstep(0.0, 0.45, dot(col, vec3(0.333))));

      // Vignette and grain.
      float vig = 1.0 - smoothstep(0.18, 0.82, r2) * (0.34 + uRain * 0.12);
      col *= vig;
      // Film grain is deliberately subtle and time-quantised to 12 Hz. It must
      // never scale with speed, and must stay quiet on the dark tarmac where a
      // large amplitude read as heavy static noise during the race.
      float luma = dot(col, vec3(0.299, 0.587, 0.114));
      float grain = (hash(uv * vec2(1920.0, 1080.0) + floor(uTime * 12.0) * 17.0) - 0.5)
        * 0.0045 * (0.35 + 0.65 * smoothstep(0.05, 0.4, luma));
      col += grain;
      col += vec3(0.55, 0.68, 0.95) * uFlash * 0.28;
      col += vec3(1.0, 0.25, 0.2) * uImpact * 0.12;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class PostFX {
  readonly composer: EffectComposer;
  private grade: ShaderPass;
  private bloom: UnrealBloomPass;
  private fxaa: ShaderPass;
  private width = 1;
  private height = 1;
  private bloomScale = 1;
  private bloomBase = 0.42;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    bloomStrength = 0.42,
  ) {
    this.bloomBase = bloomStrength;
    const target = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: 0,
      depthBuffer: true,
    });
    this.composer = new EffectComposer(renderer, target);
    this.composer.addPass(new RenderPass(scene, camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), bloomStrength, 0.62, 0.82);
    this.composer.addPass(this.bloom);
    this.grade = new ShaderPass(GradeShader);
    this.composer.addPass(this.grade);
    this.composer.addPass(new OutputPass());
    this.fxaa = new ShaderPass(FXAAShader);
    this.composer.addPass(this.fxaa);
  }

  /** All tiers keep grade and bloom; only AA and bloom resolution change. */
  setQuality(fxaa: boolean, bloomScale: number, bloom: number): void {
    this.bloomBase = bloom;
    this.bloomScale = bloomScale;
    this.fxaa.enabled = fxaa;
    this.bloom.enabled = true;
    this.bloom.setSize(
      Math.max(1, Math.floor(this.width * bloomScale)),
      Math.max(1, Math.floor(this.height * bloomScale)),
    );
  }

  get fxaaEnabled(): boolean { return this.fxaa.enabled; }
  get bloomEnabled(): boolean { return this.bloom.enabled; }

  setSize(width: number, height: number, pixelRatio: number, bloomScale = this.bloomScale): void {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.bloomScale = bloomScale;
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(this.width, this.height);
    this.bloom.setSize(
      Math.max(1, Math.floor(this.width * bloomScale)),
      Math.max(1, Math.floor(this.height * bloomScale)),
    );
    const res = this.fxaa.material.uniforms['resolution'] as THREE.IUniform<THREE.Vector2>;
    res.value.set(1 / (this.width * pixelRatio), 1 / (this.height * pixelRatio));
  }

  render(time: number, t: FXTelemetry): void {
    const u = this.grade.material.uniforms;
    u['uTime']!.value = time;
    u['uSpeed']!.value = clamp(t.speed01, 0, 1);
    u['uNitro']!.value = t.nitro ? 1 : 0;
    u['uImpact']!.value = t.impact;
    u['uFlash']!.value = t.flash;
    u['uRain']!.value = t.rain;
    this.bloom.strength = this.bloomBase + (t.nitro ? 0.16 : 0) + t.flash * 0.4;
    this.composer.render();
  }
}
