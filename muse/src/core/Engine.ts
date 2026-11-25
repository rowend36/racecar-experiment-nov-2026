import * as THREE from 'three';

// HDR PBR renderer + adaptive resolution for locked 60fps on mobile -> desktop.
export class Engine {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  private basePixelRatio: number;
  private autoScale = 1;
  private frameAcc = 0; private frameN = 0; private lastScaleT = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', stencil: false });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 2500);
    this.camera.position.set(0, 4, -10);

    this.basePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.applySize();

    window.addEventListener('resize', () => this.applySize());
  }

  applySize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(this.basePixelRatio * this.autoScale);
    this.renderer.setSize(w, h, false);
  }

  // call every frame with dt; lowers/raises internal resolution to hold 55-60fps
  adapt(dt: number, now: number) {
    this.frameAcc += dt; this.frameN++;
    if (now - this.lastScaleT < 1500 || this.frameN < 20) return;
    const avg = this.frameAcc / this.frameN;
    const fps = 1 / Math.max(1e-4, avg);
    this.frameAcc = 0; this.frameN = 0; this.lastScaleT = now;
    if (fps < 48 && this.autoScale > 0.55) { this.autoScale -= 0.15; this.applySize(); }
    else if (fps > 58 && this.autoScale < 1) { this.autoScale = Math.min(1, this.autoScale + 0.1); this.applySize(); }
  }

  get qualityScale() { return this.autoScale; }
}
