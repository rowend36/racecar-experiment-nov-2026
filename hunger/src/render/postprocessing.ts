import {
  ACESFilmicToneMapping,
  HalfFloatType,
  LinearFilter,
  NoToneMapping,
  Vector2,
  WebGLRenderTarget,
} from 'three';
import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import type { QualityPreset } from '../game/types';

// The grade runs in linear HDR; OutputPass performs tone mapping and the display transform.
const CINEMATIC_SHADER = {
  name: 'RaceCinematicGrade',
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uSpeed: { value: 0 },
    uResolution: { value: new Vector2(1, 1) },
    uGrain: { value: 0.009 },
    uChromaticAberration: { value: 0.0007 },
    uVignette: { value: 0.16 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uSpeed;
    uniform vec2 uResolution;
    uniform float uGrain;
    uniform float uChromaticAberration;
    uniform float uVignette;
    varying vec2 vUv;

    float raceHash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      vec2 centered = vUv - 0.5;
      vec2 radial = centered * vec2(aspect, 1.0);
      float radiusSquared = dot(radial, radial);
      float speedAmount = smoothstep(0.72, 1.15, uSpeed);
      float edgeWeight = smoothstep(0.055, 0.62, radiusSquared);

      // Radial chromatic separation remains centered and intentionally very restrained.
      float aberration = uChromaticAberration * (0.38 + uSpeed * 0.62);
      vec2 aberrationOffset = centered * (0.35 + radiusSquared * 2.0) * aberration;
      vec2 redUv = clamp(vUv + aberrationOffset, vec2(0.001), vec2(0.999));
      vec2 blueUv = clamp(vUv - aberrationOffset, vec2(0.001), vec2(0.999));
      vec4 centerSample = texture2D(tDiffuse, vUv);
      vec3 color = vec3(
        texture2D(tDiffuse, redUv).r,
        centerSample.g,
        texture2D(tDiffuse, blueUv).b
      );

      // A single asymmetric tap suggests motion without turning the screen into a blur.
      vec2 speedOffset = centered * edgeWeight * speedAmount * 0.006;
      vec3 hurriedColor = texture2D(tDiffuse, clamp(vUv - speedOffset, vec2(0.001), vec2(0.999))).rgb;
      color = mix(color, color * 0.62 + hurriedColor * 0.38, speedAmount * edgeWeight * 0.48);
      color += vec3(0.002, 0.005, 0.010) * speedAmount * edgeWeight;

      color = max(color, vec3(0.0));
      float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
      float shadowWeight = 1.0 - smoothstep(0.0, 0.48, luminance);
      float highlightWeight = smoothstep(0.42, 1.35, luminance);
      color = mix(vec3(luminance), color, 1.055);
      color += vec3(-0.006, 0.0, 0.008) * shadowWeight;
      color += vec3(0.016, 0.006, -0.008) * highlightWeight;
      color = max((color - 0.18) * 1.035 + 0.18, vec3(0.0));

      float vignette = 1.0 - smoothstep(0.08, 0.79, sqrt(radiusSquared));
      color *= 1.0 - uVignette * (1.0 - vignette);

      float grain = raceHash12(gl_FragCoord.xy + vec2(uTime * 137.0, uTime * 71.0)) - 0.5;
      color += grain * uGrain * (0.4 + 0.6 * exp(-luminance * 1.4));

      gl_FragColor = vec4(max(color, vec3(0.0)), centerSample.a);
    }
  `,
};

export class RacePostProcessor {
  private readonly renderer: WebGLRenderer;
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly composer: EffectComposer;
  private readonly renderPass: RenderPass;
  private readonly bloomPass: UnrealBloomPass;
  private readonly gradePass: ShaderPass;
  private readonly outputPass: OutputPass;
  private readonly fxaaPass: ShaderPass;
  private readonly size = new Vector2(1, 1);
  private readonly gradeResolution: Vector2;
  private readonly fxaaResolution: Vector2;
  private ssaoPass: SSAOPass | null = null;
  private quality: QualityPreset | null = null;
  private elapsed = 0;
  private smoothedSpeed = 0;
  private disposed = false;

  constructor(
    renderer: WebGLRenderer,
    scene: Scene,
    camera: PerspectiveCamera,
    quality: QualityPreset,
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    renderer.getSize(this.size);

    // Explicit HDR targets preserve highlight headroom for bloom and the grade.
    const target = new WebGLRenderTarget(1, 1, {
      type: HalfFloatType,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
    });
    target.texture.name = 'RacePostProcessor.HDR';
    this.composer = new EffectComposer(renderer, target);

    this.renderPass = new RenderPass(scene, camera);
    this.bloomPass = new UnrealBloomPass(new Vector2(1, 1), 0.3, 0.4, 1);
    this.gradePass = new ShaderPass(CINEMATIC_SHADER);
    this.outputPass = new OutputPass();
    this.fxaaPass = new ShaderPass(FXAAShader);

    this.gradeResolution = this.gradePass.uniforms.uResolution.value as Vector2;
    this.fxaaResolution = this.fxaaPass.uniforms.resolution.value as Vector2;

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.gradePass);
    this.composer.addPass(this.outputPass);
    // FXAA follows OutputPass because it expects display-space (sRGB) luminance.
    this.composer.addPass(this.fxaaPass);

    // Respect an artist-selected tone mapper, but provide filmic output when unconfigured.
    if (renderer.toneMapping === NoToneMapping) {
      renderer.toneMapping = ACESFilmicToneMapping;
    }

    this.setQuality(quality);
    this.setSize(this.size.x, this.size.y, renderer.getPixelRatio());
  }

  setQuality(quality: QualityPreset): void {
    if (this.disposed || quality === this.quality) return;
    this.quality = quality;

    const useGrade = quality !== 'low';
    const useFxaa = quality === 'high' || quality === 'ultra';
    this.gradePass.enabled = useGrade;
    this.bloomPass.enabled = useGrade;
    this.fxaaPass.enabled = useFxaa;

    if (quality === 'medium') {
      this.bloomPass.strength = 0.26;
      this.bloomPass.radius = 0.34;
      this.bloomPass.threshold = 0.95;
    } else if (quality === 'high') {
      this.bloomPass.strength = 0.32;
      this.bloomPass.radius = 0.43;
      this.bloomPass.threshold = 1;
    } else if (quality === 'ultra') {
      this.bloomPass.strength = 0.38;
      this.bloomPass.radius = 0.5;
      this.bloomPass.threshold = 1.05;
    }

    if (quality === 'ultra' && this.ssaoPass === null) {
      const pixelRatio = this.renderer.getPixelRatio();
      const ssao = new SSAOPass(
        this.scene,
        this.camera,
        Math.max(1, Math.round(this.size.x * pixelRatio)),
        Math.max(1, Math.round(this.size.y * pixelRatio)),
        16,
      );
      ssao.output = SSAOPass.OUTPUT.Default;
      ssao.kernelRadius = 0.48;
      ssao.minDistance = 0.001;
      ssao.maxDistance = 0.065;
      this.composer.insertPass(ssao, 1);
      this.ssaoPass = ssao;
    } else if (quality !== 'ultra' && this.ssaoPass !== null) {
      this.composer.removePass(this.ssaoPass);
      this.disposeSsao(this.ssaoPass);
      this.ssaoPass = null;
    }
  }

  setSize(width: number, height: number, pixelRatio: number): void {
    if (this.disposed) return;

    const safeWidth = Number.isFinite(width) ? Math.max(1, Math.round(width)) : 1;
    const safeHeight = Number.isFinite(height) ? Math.max(1, Math.round(height)) : 1;
    const safeRatio = Number.isFinite(pixelRatio) ? Math.max(0.1, pixelRatio) : 1;
    this.size.set(safeWidth, safeHeight);
    this.gradeResolution.set(safeWidth, safeHeight);

    // Keep the canvas and all HDR intermediates at the same physical resolution.
    this.renderer.setPixelRatio(safeRatio);
    this.renderer.setSize(safeWidth, safeHeight, false);
    this.composer.setPixelRatio(safeRatio);
    this.composer.setSize(safeWidth, safeHeight);
    this.fxaaResolution.set(1 / (safeWidth * safeRatio), 1 / (safeHeight * safeRatio));
  }

  render(deltaTime: number, speedRatio: number): void {
    if (this.disposed) return;

    const dt = Number.isFinite(deltaTime) ? Math.min(Math.max(deltaTime, 0), 0.1) : 0;
    const targetSpeed = Number.isFinite(speedRatio)
      ? Math.min(Math.max(speedRatio, 0), 1.5)
      : 0;
    const speedBlend = 1 - Math.exp(-dt * 7);
    this.smoothedSpeed += (targetSpeed - this.smoothedSpeed) * speedBlend;
    this.elapsed = (this.elapsed + dt) % 1024;

    this.gradePass.uniforms.uTime.value = this.elapsed;
    this.gradePass.uniforms.uSpeed.value = this.smoothedSpeed;
    this.composer.render(dt);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    for (let index = this.composer.passes.length - 1; index >= 0; index -= 1) {
      const pass = this.composer.passes[index];
      this.composer.removePass(pass);
      pass.dispose();
    }

    // r187 pass disposers omit these two resources.
    this.bloomPass.materialHighPassFilter.dispose();
    if (this.ssaoPass !== null) {
      this.ssaoPass.ssaoMaterial.dispose();
      this.ssaoPass.noiseTexture.dispose();
      this.ssaoPass = null;
    }

    this.composer.timer.dispose();
    this.composer.dispose();
  }

  private disposeSsao(pass: SSAOPass): void {
    pass.dispose();
    // Complete cleanup for resources not covered by SSAOPass.dispose() in r187.
    pass.ssaoMaterial.dispose();
    pass.noiseTexture.dispose();
  }
}
