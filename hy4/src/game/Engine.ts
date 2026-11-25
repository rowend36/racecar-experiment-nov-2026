import * as THREE from 'three';
import { PostFX } from '../render/PostFX';
import { QUALITY_PRESETS } from '../render/Quality';
import type { QualityName } from '../core/Storage';

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly postfx: PostFX;
  quality: QualityName = 'high';
  fps = 60;
  private scale = 1;
  private frames = 0;
  private fpsTime = 0;
  private glowExposure = 1;
  private bloomBase = 0.42;

  constructor(canvas: HTMLCanvasElement, quality: QualityName) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
      depth: true,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.info.autoReset = false;
    this.postfx = new PostFX(this.renderer, this.scene, new THREE.PerspectiveCamera(), this.bloomBase);
    this.setQuality(quality);
    this.resize();
  }

  get preset() { return QUALITY_PRESETS[this.quality]; }

  get camera(): THREE.PerspectiveCamera {
    return (this.postfx.composer.passes[0] as import('three/addons/postprocessing/RenderPass.js').RenderPass).camera as THREE.PerspectiveCamera;
  }

  setCamera(camera: THREE.PerspectiveCamera): void {
    const pass = this.postfx.composer.passes[0] as import('three/addons/postprocessing/RenderPass.js').RenderPass;
    pass.camera = camera;
  }

  setQuality(quality: QualityName): void {
    this.quality = quality;
    const p = this.preset;
    this.scale = p.dpr;
    this.renderer.shadowMap.enabled = p.shadow > 0;
    this.renderer.shadowMap.needsUpdate = true;
    this.postfx.setQuality(p.fxaa, p.bloomScale, this.bloomBase);
    this.resize();
  }

  setPalette(exposure: number, bloom: number): void {
    this.glowExposure = exposure;
    this.bloomBase = bloom;
    const p = this.preset;
    this.postfx.setQuality(p.fxaa, p.bloomScale, bloom);
  }

  get pixelRatio(): number {
    return Math.min(window.devicePixelRatio || 1, this.scale);
  }

  resize(): void {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    const ratio = this.pixelRatio;
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(w, h, false);
    this.postfx.setSize(w, h, ratio, this.preset.bloomScale);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Hold ~60 fps without ever exceeding the chosen preset's fidelity cap. */
  updateTiming(dt: number): void {
    this.frames += 1;
    this.fpsTime += dt;
    if (this.fpsTime >= 0.5) {
      this.fps = this.frames / this.fpsTime;
      this.frames = 0;
      this.fpsTime = 0;
      const p = this.preset;
      if (this.fps < 52 && this.scale > p.adaptiveMin) this.scale = Math.max(p.adaptiveMin, this.scale - 0.12);
      else if (this.fps > 58 && this.scale < p.dpr) this.scale = Math.min(p.dpr, this.scale + 0.06);
      this.resize();
    }
  }

  setGlare(amount: number): void {
    this.renderer.toneMappingExposure = this.glowExposure * (1 + amount * 0.35);
  }

  render(time: number, fx: Parameters<PostFX['render']>[1]): void {
    this.renderer.info.reset();
    this.postfx.render(time, fx);
  }

  debugQuality(): Record<string, unknown> {
    const drawing = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(drawing);
    const target = this.postfx.composer.renderTarget1;
    return {
      quality: this.quality,
      dpr: this.preset.dpr,
      pixelRatio: this.pixelRatio,
      scale: this.scale,
      drawingBuffer: [drawing.x, drawing.y],
      composerTarget: [target.width, target.height],
      adaptiveMin: this.preset.adaptiveMin,
      shadows: this.renderer.shadowMap.enabled,
      fxaa: this.postfx.fxaaEnabled,
      bloom: this.postfx.bloomEnabled,
      bloomScale: this.preset.bloomScale,
      density: this.preset.density,
      pointLights: this.preset.pointLights,
    };
  }
}
