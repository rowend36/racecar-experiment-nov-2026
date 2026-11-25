import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RaceAudio } from './Audio';
import { InputManager } from './Input';
import { Opponent } from './Opponent';
import { PHYSICS_STEP, VehiclePhysics } from './VehiclePhysics';
import { RaceSession } from './RaceSession';
import { Track } from './Track';
import {
  DEFAULT_SETTINGS,
  TOTAL_LAPS,
  TOTAL_RACERS,
  type CameraMode,
  type GameSettings,
  type InputFrame,
  type PaintFinish,
  type QualityPreset,
  type RacePhase,
  type Telemetry,
  type UIAction,
  type UICallbacks,
} from '../game/types';
import { createCircuit, type CircuitVisual } from '../render/circuit';
import { createEnvironment, type EnvironmentVisual } from '../render/environment';
import { RacePostProcessor } from '../render/postprocessing';
import { ParticlePool } from '../render/Particles';
import { createVehicle, type VehicleVisual } from '../render/vehicle';
import { UI } from '../ui/UI';

const SETTINGS_KEY = 'hunger-apex-settings-v1';
const BEST_LAP_KEY = 'hunger-apex-best-lap-v1';
const CAMERA_MODES: CameraMode[] = ['chase', 'close', 'hood'];
const QUALITY_DPR: Record<QualityPreset, number> = { low: 0.9, medium: 1.15, high: 1.5, ultra: 2 };

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      quality: ['low', 'medium', 'high', 'ultra'].includes(parsed.quality ?? '') ? parsed.quality! : DEFAULT_SETTINGS.quality,
      paintColor: /^#[0-9a-f]{6}$/i.test(parsed.paintColor ?? '') ? parsed.paintColor! : DEFAULT_SETTINGS.paintColor,
      paintFinish: ['metallic', 'pearl', 'satin'].includes(parsed.paintFinish ?? '') ? parsed.paintFinish! : DEFAULT_SETTINGS.paintFinish,
      wetness: Number.isFinite(parsed.wetness) ? Math.max(0, Math.min(1, parsed.wetness!)) : DEFAULT_SETTINGS.wetness,
      volume: Number.isFinite(parsed.volume) ? Math.max(0, Math.min(1, parsed.volume!)) : DEFAULT_SETTINGS.volume,
      steeringSensitivity: Number.isFinite(parsed.steeringSensitivity) ? Math.max(0.35, Math.min(1, parsed.steeringSensitivity!)) : DEFAULT_SETTINGS.steeringSensitivity,
      steeringAssist: typeof parsed.steeringAssist === 'boolean' ? parsed.steeringAssist : DEFAULT_SETTINGS.steeringAssist,
      cameraShake: typeof parsed.cameraShake === 'boolean' ? parsed.cameraShake : DEFAULT_SETTINGS.cameraShake,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : DEFAULT_SETTINGS.muted,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export class Game {
  readonly settings: GameSettings;
  readonly track = new Track();
  readonly scene = new Scene();
  readonly camera: PerspectiveCamera;
  readonly renderer: WebGLRenderer;
  readonly input: InputManager;
  readonly ui: UI;
  readonly audio = new RaceAudio();

  phase: RacePhase = 'menu';
  private playerPhysics!: VehiclePhysics;
  private playerVisual!: VehicleVisual;
  private opponents: Opponent[] = [];
  private race!: RaceSession;
  private circuit!: CircuitVisual;
  private environment!: EnvironmentVisual;
  private sunLight: DirectionalLight | null = null;
  private baseExposure = 1;
  private post!: RacePostProcessor;
  private particles!: ParticlePool;
  private accumulator = 0;
  private previousTime = 0;
  private menuTime = 0;
  private countdownRemaining = 0;
  private lastCountdown = 0;
  private goTimer = 0;
  private previousPhase: RacePhase = 'racing';
  private cameraMode: CameraMode = 'chase';
  private cameraInitialized = false;
  private shake = 0;
  private collisionCooldown = 0;
  private particleTimer = 0;
  private lastImpact = 0;
  private pixelRatio = 1;
  private maxPixelRatio = 1.5;
  private fpsElapsed = 0;
  private fpsFrames = 0;
  private uiElapsed = 0;
  private disposed = false;
  private readonly resizeObserver: ResizeObserver;
  private readonly cameraForward = new Vector3();
  private readonly cameraDesired = new Vector3();
  private readonly cameraLook = new Vector3();
  private readonly cameraLookTarget = new Vector3();
  private readonly particlePosition = new Vector3();
  private readonly particleVelocity = new Vector3();
  private readonly collisionDelta = new Vector3();
  private readonly sunDirection = new Vector3();
  private readonly viewDirection = new Vector3();
  private readonly uiRacers: Array<{ position: Vector3; isPlayer: boolean }> = [];

  constructor(canvas: HTMLCanvasElement, uiRoot: HTMLElement) {
    this.settings = loadSettings();
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = this.settings.quality !== 'low';
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setClearColor(new Color(0x080a0b));
    this.scene.background = new Color(0x080a0b);
    this.camera = new PerspectiveCamera(62, 1, 0.12, 1500);
    this.input = new InputManager(uiRoot);

    const callbacks: UICallbacks = {
      onAction: (action) => this.handleAction(action),
      onColor: (color) => this.setPaintColor(color),
      onFinish: (finish) => this.setPaintFinish(finish),
      onQuality: (quality) => this.setQuality(quality),
      onWetness: (wetness) => this.setWetness(wetness),
      onVolume: (volume) => this.setVolume(volume),
      onSteeringSensitivity: (sensitivity) => this.setSteeringSensitivity(sensitivity),
      onAssists: (steeringAssist, cameraShake) => {
        this.settings.steeringAssist = steeringAssist;
        this.settings.cameraShake = cameraShake;
        this.saveSettings();
      },
    };
    this.ui = new UI(uiRoot, callbacks);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    canvas.addEventListener('webglcontextlost', this.onContextLost);
  }

  async init(): Promise<void> {
    this.ui.showLoading(0.08, 'Building Neon Dusk circuit');
    await nextFrame();
    this.circuit = createCircuit(this.track);
    this.scene.add(this.circuit.root);

    this.ui.showLoading(0.34, 'Lighting the city');
    await nextFrame();
    this.environment = createEnvironment(this.renderer, this.track);
    this.scene.add(this.environment.root);
    this.sunLight = this.environment.root.userData.sun as DirectionalLight;
    this.scene.environment = this.environment.root.userData.environment;
    this.scene.fog = this.environment.root.userData.fog;
    this.scene.environmentIntensity = 0.62;

    this.ui.showLoading(0.58, 'Preparing the grid');
    this.playerPhysics = new VehiclePhysics(this.track, this.settings);
    this.playerVisual = createVehicle(this.settings.paintColor, true);
    this.scene.add(this.playerVisual.root);
    this.applyPaintFinish(this.settings.paintFinish);
    this.uiRacers.push({ position: this.playerPhysics.position, isPlayer: true });

    const grid = [
      { offset: 6, lane: 2.25, speed: 69.5, color: '#ff4f3d', name: 'VANTA' },
      { offset: 12, lane: -2.25, speed: 71.2, color: '#3c8dff', name: 'KAI' },
      { offset: 18, lane: 2.25, speed: 67.8, color: '#f4f1e8', name: 'NOVA' },
    ];
    for (const entry of grid) {
      const visual = createVehicle(entry.color, false);
      this.scene.add(visual.root);
      const opponent = new Opponent(this.track, visual, entry.offset, entry.lane, entry.speed, entry.name, TOTAL_LAPS);
      this.opponents.push(opponent);
      this.uiRacers.push({ position: opponent.position, isPlayer: false });
    }
    this.race = new RaceSession(this.playerPhysics, this.opponents, this.track.totalLength, TOTAL_LAPS);

    this.ui.showLoading(0.78, 'Calibrating post-processing');
    await nextFrame();
    this.particles = new ParticlePool(this.pixelRatio);
    this.scene.add(this.particles.points);
    this.post = new RacePostProcessor(this.renderer, this.scene, this.camera, this.settings.quality);
    this.input.attach();
    this.applyQuality(this.settings.quality);
    this.applyWetness(this.settings.wetness);
    this.audio.setVolume(this.settings.volume);
    this.audio.setMuted(this.settings.muted);
    this.updatePlayerVisual(0, { throttle: 0, brake: 0, steer: 0, handbrake: false });
    this.resize();
    this.updateCamera(1, true);
    this.ui.showLoading(0.94, 'Compiling shader programs');
    await this.renderer.compileAsync(this.scene, this.camera);

    this.ui.showLoading(1, 'Ready to race');
    await nextFrame();
    this.ui.hideLoading();
    this.ui.showMenu();
    this.previousTime = performance.now();
    this.renderer.setAnimationLoop(this.frame);
  }

  startRace(): void {
    if (!this.race || this.disposed) return;
    void this.audio.unlock();
    this.playerPhysics.reset(this.track.gridDistance, 0);
    for (const opponent of this.opponents) opponent.reset();
    this.race.reset();
    this.accumulator = 0;
    this.phase = 'countdown';
    this.countdownRemaining = 3.35;
    this.lastCountdown = 4;
    this.goTimer = 0;
    this.cameraInitialized = false;
    this.shake = 0;
    this.lastImpact = 0;
    this.ui.showRace();
    this.ui.setPaused(false);
    this.ui.setCountdown('3');
    this.audio.setEnabled(true);
    this.audio.beep(620, 0.12);
    this.updatePlayerVisual(0, { throttle: 0, brake: 0, steer: 0, handbrake: false });
  }

  showMenu(): void {
    this.phase = 'menu';
    this.audio.setEnabled(false);
    this.playerPhysics.reset(this.track.gridDistance, 0);
    for (const opponent of this.opponents) opponent.reset();
    this.race?.reset();
    this.ui.hideCountdown();
    this.ui.setPaused(false);
    this.ui.showMenu();
    this.updatePlayerVisual(0, { throttle: 0, brake: 0, steer: 0, handbrake: false });
    this.updateCamera(1, true);
  }

  pause(): void {
    if (this.phase !== 'racing' && this.phase !== 'countdown') return;
    this.previousPhase = this.phase;
    this.phase = 'paused';
    this.audio.setEnabled(false);
    this.ui.setPaused(true);
  }

  resume(): void {
    if (this.phase !== 'paused') return;
    this.phase = this.previousPhase;
    this.ui.setPaused(false);
    this.audio.setEnabled(true);
    this.previousTime = performance.now();
  }

  setQuality(quality: QualityPreset): void {
    this.settings.quality = quality;
    this.applyQuality(quality);
    this.saveSettings();
  }

  setWetness(wetness: number): void {
    this.settings.wetness = Math.max(0, Math.min(1, wetness));
    this.applyWetness(this.settings.wetness);
    this.saveSettings();
  }

  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.audio.setVolume(this.settings.volume);
    this.saveSettings();
  }

  setSteeringSensitivity(sensitivity: number): void {
    this.settings.steeringSensitivity = Math.max(0.35, Math.min(1, sensitivity));
    this.saveSettings();
  }

  setPaintColor(color: string): void {
    this.settings.paintColor = color;
    this.playerVisual?.setPaint(color);
    this.saveSettings();
  }

  setPaintFinish(finish: PaintFinish): void {
    this.settings.paintFinish = finish;
    this.applyPaintFinish(finish);
    this.saveSettings();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.input.dispose();
    this.ui.dispose();
    this.audio.dispose();
    this.post?.dispose();
    this.particles?.dispose();
    this.playerVisual?.dispose();
    for (const opponent of this.opponents) opponent.visual.dispose();
    this.circuit?.dispose();
    this.environment?.dispose();
    this.renderer.dispose();
  }

  private readonly frame = (time: number): void => {
    if (this.disposed) return;
    const deltaTime = this.previousTime === 0 ? 1 / 60 : Math.min(0.05, Math.max(0, (time - this.previousTime) / 1000));
    this.previousTime = time;
    this.processActions();
    this.menuTime += deltaTime;
    this.collisionCooldown = Math.max(0, this.collisionCooldown - deltaTime);
    this.shake = Math.max(0, this.shake - deltaTime * 1.8);
    const input = this.input.sample();

    if (this.phase === 'countdown') this.updateCountdown(deltaTime, input);
    if (this.phase === 'racing') this.updateRace(deltaTime, input);
    else if (this.phase === 'finished') this.updateFinished(deltaTime);
    else if (this.phase === 'menu') {
      this.playerVisual.update(deltaTime, 0, 0, 0, false, false);
    }

    if (this.phase !== 'paused') {
      this.particles.update(deltaTime);
      this.environment.update(deltaTime, this.phase === 'menu' ? this.playerPhysics.position : this.cameraLookTarget);
      this.updateCamera(deltaTime);
    }

    this.updateGlareExposure(deltaTime);
    const speedRatio = Math.min(1, Math.abs(this.playerPhysics.speed) / 78);
    this.audio.update(this.playerPhysics.rpm, input.throttle, Math.abs(this.playerPhysics.speed), this.playerPhysics.drifting, this.playerPhysics.offroad);
    this.post.render(deltaTime, speedRatio);
    this.updatePerformance(deltaTime);
    this.uiElapsed += deltaTime;
    if (this.uiElapsed >= 1 / 24 && this.phase !== 'menu') {
      this.uiElapsed = 0;
      this.ui.update(this.getTelemetry(), this.track, this.uiRacers);
    }
  };

  private processActions(): void {
    for (const action of this.input.consumeActions()) this.handleAction(action);
  }

  private handleAction(action: UIAction): void {
    switch (action) {
      case 'start':
        if (this.phase === 'menu' || this.phase === 'finished') this.startRace();
        break;
      case 'pause':
        if (this.phase === 'paused') this.resume();
        else this.pause();
        break;
      case 'resume':
        this.resume();
        break;
      case 'restart':
        this.startRace();
        break;
      case 'back':
        this.showMenu();
        break;
      case 'garage':
      case 'settings':
        break;
      case 'camera':
        if (this.phase !== 'menu') {
          const index = CAMERA_MODES.indexOf(this.cameraMode);
          this.cameraMode = CAMERA_MODES[(index + 1) % CAMERA_MODES.length];
          this.cameraInitialized = false;
          this.ui.notify(`${this.cameraMode.toUpperCase()} CAMERA`);
        }
        break;
      case 'reset':
        if (this.phase === 'racing') {
          this.playerPhysics.reset(this.playerPhysics.nearest.distance, 0);
          this.accumulator = 0;
          this.ui.notify('VEHICLE RECOVERED');
        }
        break;
      case 'mute':
        this.settings.muted = !this.settings.muted;
        this.audio.setMuted(this.settings.muted);
        this.saveSettings();
        this.ui.notify(this.settings.muted ? 'AUDIO MUTED' : 'AUDIO ENABLED');
        break;
      case 'fullscreen':
        void this.toggleFullscreen();
        break;
      default:
        break;
    }
  }

  private updateCountdown(deltaTime: number, input: InputFrame): void {
    this.countdownRemaining -= deltaTime;
    const count = Math.max(0, Math.ceil(this.countdownRemaining));
    if (count !== this.lastCountdown && count > 0) {
      this.lastCountdown = count;
      this.ui.setCountdown(String(count));
      this.audio.beep(620, 0.12);
    }
    this.playerVisual.update(deltaTime, 0, input.steer * 0.2, input.throttle, false, false);
    if (this.countdownRemaining <= 0) {
      this.phase = 'racing';
      this.goTimer = 0.85;
      this.ui.setCountdown('GO');
      this.audio.beep(980, 0.25);
      this.previousTime = performance.now();
    }
  }

  private updateRace(deltaTime: number, input: InputFrame): void {
    this.goTimer = Math.max(0, this.goTimer - deltaTime);
    if (this.goTimer === 0) this.ui.hideCountdown();
    this.accumulator += deltaTime;
    let steps = 0;
    while (this.accumulator >= PHYSICS_STEP && steps < 7 && !this.race.finished) {
      const events = this.playerPhysics.step(input, PHYSICS_STEP);
      if (events.impact > 0.24 && this.lastImpact < 0.18 && this.collisionCooldown <= 0) {
        this.audio.impact(events.impact);
        this.particles.burst(this.particlePosition.copy(this.playerPhysics.position).addScaledVector(this.playerPhysics.forward, 1.4), 12, 0xffa53d, 4 + events.impact * 4);
        this.shake = Math.max(this.shake, events.impact * 0.65);
        this.collisionCooldown = 0.18;
      }
      this.lastImpact = events.impact;
      this.race.update(PHYSICS_STEP);
      this.resolveOpponentCollisions();
      this.accumulator -= PHYSICS_STEP;
      steps += 1;
    }
    if (steps === 7) this.accumulator = 0;
    this.spawnTireParticles(deltaTime);
    this.updatePlayerVisual(deltaTime, input);

    if (this.race.finished) {
      this.phase = 'finished';
      this.audio.setEnabled(false);
      this.audio.beep(880, 0.5, 'triangle');
      let stored = Number.NaN;
      try {
        const raw = localStorage.getItem(BEST_LAP_KEY);
        stored = raw === null ? Number.NaN : Number(raw);
      } catch { /* storage unavailable */ }
      const best = this.race.bestLap ?? Number.POSITIVE_INFINITY;
      const isNewRecord = !Number.isFinite(stored) || best < stored;
      try {
        if (isNewRecord) localStorage.setItem(BEST_LAP_KEY, String(best));
      } catch { /* storage unavailable */ }
      this.ui.showResults(this.race.getResult(isNewRecord));
    }
  }

  private updateFinished(deltaTime: number): void {
    const input = { throttle: 0, brake: this.playerPhysics.speed > 0.5 ? 0.35 : 0, steer: 0, handbrake: false };
    this.playerPhysics.step(input, deltaTime);
    this.updatePlayerVisual(deltaTime, input);
  }

  private updatePlayerVisual(deltaTime: number, input: InputFrame): void {
    this.playerVisual.root.position.copy(this.playerPhysics.position);
    this.playerVisual.root.rotation.set(this.playerPhysics.pitch, this.playerPhysics.yaw, this.playerPhysics.roll, 'YXZ');
    this.playerVisual.update(
      deltaTime,
      this.playerPhysics.speed,
      this.playerPhysics.steer,
      input.throttle,
      input.handbrake,
      input.brake > 0.1,
    );
  }

  private resolveOpponentCollisions(): void {
    for (const opponent of this.opponents) {
      this.collisionDelta.copy(this.playerPhysics.position).sub(opponent.position);
      this.collisionDelta.y = 0;
      const distanceSq = this.collisionDelta.lengthSq();
      const minimumDistance = 2.35;
      if (distanceSq >= minimumDistance * minimumDistance || distanceSq < 0.0001) continue;
      const distance = Math.sqrt(distanceSq);
      this.collisionDelta.multiplyScalar(1 / distance);
      const penetration = minimumDistance - distance;
      this.playerPhysics.position.addScaledVector(this.collisionDelta, penetration * 0.72);
      const closingSpeed = -this.playerPhysics.velocity.dot(this.collisionDelta) - opponent.speed * 0.15;
      if (closingSpeed > 0) {
        this.playerPhysics.velocity.addScaledVector(this.collisionDelta, closingSpeed * 1.35).multiplyScalar(0.82);
        this.playerPhysics.speed = this.playerPhysics.velocity.dot(this.playerPhysics.forward);
        if (this.collisionCooldown <= 0) {
          this.audio.impact(Math.min(1, closingSpeed / 16));
          this.particles.burst(this.playerPhysics.position, 10, 0xffcc66, 3.5);
          this.shake = Math.max(this.shake, 0.45);
          this.collisionCooldown = 0.3;
        }
      }
    }
  }

  private spawnTireParticles(deltaTime: number): void {
    this.particleTimer -= deltaTime;
    const speed = Math.abs(this.playerPhysics.speed);
    if ((!this.playerPhysics.drifting && !this.playerPhysics.offroad) || speed < 10 || this.particleTimer > 0) return;
    this.particleTimer = this.playerPhysics.offroad ? 0.025 : 0.045;
    const forward = this.playerPhysics.forward;
    const right = this.cameraForward.set(forward.z, 0, -forward.x);
    for (const side of [-1, 1]) {
      this.particlePosition.copy(this.playerPhysics.position)
        .addScaledVector(forward, -1.42)
        .addScaledVector(right, side * 0.83);
      this.particlePosition.y += 0.18;
      this.particleVelocity.copy(this.playerPhysics.velocity).multiplyScalar(0.12);
      this.particleVelocity.y = 0.7 + Math.random() * 0.45;
      this.particleVelocity.x += (Math.random() - 0.5) * 0.7;
      this.particleVelocity.z += (Math.random() - 0.5) * 0.7;
      this.particles.spawn(
        this.particlePosition,
        this.particleVelocity,
        this.playerPhysics.offroad ? 0x8b7354 : 0xaeb4b6,
        this.playerPhysics.offroad ? 0.28 : 0.38,
        0.55 + Math.random() * 0.35,
        -0.35,
      );
    }
  }

  private updateCamera(deltaTime: number, snap = false): void {
    const playerPosition = this.playerPhysics.position;
    if (this.phase === 'menu') {
      // A restrained front three-quarter sway avoids orbiting through the start gantry.
      const angle = 2.15 + Math.sin(this.menuTime * 0.16) * 0.16;
      this.cameraDesired.set(
        playerPosition.x + Math.cos(angle) * 6.8,
        playerPosition.y + 2.65,
        playerPosition.z + Math.sin(angle) * 6.8,
      );
      this.cameraLookTarget.copy(playerPosition);
      this.cameraLookTarget.y += 0.75;
      this.camera.position.lerp(this.cameraDesired, snap ? 1 : 1 - Math.exp(-deltaTime * 2.4));
      this.cameraLook.lerp(this.cameraLookTarget, snap ? 1 : 1 - Math.exp(-deltaTime * 4));
      this.camera.lookAt(this.cameraLook);
      this.camera.fov += (58 - this.camera.fov) * Math.min(1, deltaTime * 3);
      this.camera.updateProjectionMatrix();
      return;
    }

    this.cameraForward.set(Math.sin(this.playerPhysics.yaw), 0, Math.cos(this.playerPhysics.yaw));
    const speedRatio = Math.min(1, Math.abs(this.playerPhysics.speed) / 78);
    if (this.cameraMode === 'hood') {
      this.cameraDesired.copy(playerPosition).addScaledVector(this.cameraForward, 0.38);
      this.cameraDesired.y += 1.18;
      this.cameraLookTarget.copy(playerPosition).addScaledVector(this.cameraForward, 28);
      this.cameraLookTarget.y += 1.05;
    } else {
      const close = this.cameraMode === 'close';
      const distance = (close ? 4.9 : 7.4) + speedRatio * 1.6;
      this.cameraDesired.copy(playerPosition).addScaledVector(this.cameraForward, -distance);
      this.cameraDesired.y += close ? 2.0 : 2.75;
      this.cameraLookTarget.copy(playerPosition).addScaledVector(this.cameraForward, 4.0 + speedRatio * 3.0);
      this.cameraLookTarget.y += 0.85;
    }

    const positionLerp = snap || !this.cameraInitialized ? 1 : 1 - Math.exp(-deltaTime * (this.cameraMode === 'hood' ? 18 : 6.5));
    const lookLerp = snap || !this.cameraInitialized ? 1 : 1 - Math.exp(-deltaTime * 9);
    this.camera.position.lerp(this.cameraDesired, positionLerp);
    this.cameraLook.lerp(this.cameraLookTarget, lookLerp);
    this.cameraInitialized = true;

    if (this.settings.cameraShake && this.shake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.shake;
      this.camera.position.y += (Math.random() - 0.5) * this.shake * 0.6;
      this.camera.position.z += (Math.random() - 0.5) * this.shake;
    }
    this.camera.lookAt(this.cameraLook);
    const targetFov = (this.cameraMode === 'hood' ? 72 : 61) + speedRatio * 12;
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, deltaTime * 4);
    this.camera.updateProjectionMatrix();
  }

  private getTelemetry(): Telemetry {
    return {
      speed: Math.abs(this.playerPhysics.speed) * 3.6,
      rpm: this.playerPhysics.rpm,
      gear: this.playerPhysics.gear,
      lap: Math.min(TOTAL_LAPS, this.race.lap),
      totalLaps: TOTAL_LAPS,
      position: this.race.position,
      totalRacers: TOTAL_RACERS,
      raceTime: this.race.raceTime,
      lapTime: this.race.lapTime,
      bestLap: this.race.bestLap,
      checkpoint: this.race.checkpoint,
      wrongWay: this.playerPhysics.wrongWay,
      offroad: this.playerPhysics.offroad,
      drifting: this.playerPhysics.drifting,
      progress: Math.max(0, this.race.courseDistance) / (this.track.totalLength * TOTAL_LAPS),
    };
  }

  private applyQuality(quality: QualityPreset): void {
    this.renderer.shadowMap.enabled = quality !== 'low';
    this.scene.traverse((object) => {
      if (!(object instanceof DirectionalLight)) return;
      const size = quality === 'medium' ? 1024 : 2048;
      if (object.shadow.mapSize.x !== size) {
        object.shadow.mapSize.set(size, size);
        object.shadow.map?.dispose();
        object.shadow.map = null;
      }
      object.castShadow = quality !== 'low';
    });
    const coarsePointer = matchMedia('(pointer: coarse)').matches;
    this.maxPixelRatio = Math.min(window.devicePixelRatio || 1, QUALITY_DPR[quality], coarsePointer ? 1.25 : 2);
    this.pixelRatio = this.maxPixelRatio;
    this.post?.setQuality(quality);
    this.resize();
  }

  private applyWetness(wetness: number): void {
    this.environment?.setWetness(wetness);
    this.circuit?.root.traverse((object) => {
      if (!(object instanceof Mesh) || object.name !== 'HUNGER_Road') return;
      const material = object.material as { setWetness?: (value: number) => void };
      material.setWetness?.(wetness);
    });
    this.baseExposure = 1.0 - wetness * 0.06;
  }

  private updateGlareExposure(deltaTime: number): void {
    if (!this.sunLight) return;
    this.camera.getWorldDirection(this.viewDirection);
    this.sunDirection.copy(this.sunLight.position).sub(this.sunLight.target.position).normalize();
    const alignment = Math.max(0, this.viewDirection.dot(this.sunDirection));
    const normalizedGlare = Math.max(0, Math.min(1, (alignment - 0.82) / 0.16));
    const glare = normalizedGlare * normalizedGlare * (3 - 2 * normalizedGlare);
    const targetExposure = this.baseExposure * (1 - glare * 0.55);
    const response = glare > 0.08 ? 5.5 : 1.8;
    this.renderer.toneMappingExposure += (targetExposure - this.renderer.toneMappingExposure) * (1 - Math.exp(-response * deltaTime));
  }

  private applyPaintFinish(finish: PaintFinish): void {
    this.playerVisual?.root.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        if (!(material instanceof MeshPhysicalMaterial) || material.clearcoat < 0.5) continue;
        if (finish === 'metallic') {
          material.metalness = 0.86;
          material.roughness = 0.23;
          material.clearcoat = 1;
          material.clearcoatRoughness = 0.08;
          material.iridescence = 0.08;
        } else if (finish === 'pearl') {
          material.metalness = 0.58;
          material.roughness = 0.2;
          material.clearcoat = 1;
          material.clearcoatRoughness = 0.05;
          material.iridescence = 0.48;
          material.iridescenceIOR = 1.35;
        } else {
          material.metalness = 0.35;
          material.roughness = 0.43;
          material.clearcoat = 0.55;
          material.clearcoatRoughness = 0.3;
          material.iridescence = 0;
        }
        material.needsUpdate = true;
      }
    });
  }

  private updatePerformance(deltaTime: number): void {
    this.fpsElapsed += deltaTime;
    this.fpsFrames += 1;
    if (this.fpsElapsed < 2.5) return;
    const fps = this.fpsFrames / this.fpsElapsed;
    this.fpsElapsed = 0;
    this.fpsFrames = 0;
    let nextRatio = this.pixelRatio;
    if (fps < 47) nextRatio = Math.max(0.65, this.pixelRatio - 0.1);
    else if (fps > 58) nextRatio = Math.min(this.maxPixelRatio, this.pixelRatio + 0.05);
    if (Math.abs(nextRatio - this.pixelRatio) > 0.01) {
      this.pixelRatio = nextRatio;
      this.resize();
    }
  }

  private readonly resize = (): void => {
    if (!this.post || this.disposed) return;
    const width = Math.max(1, this.renderer.domElement.clientWidth);
    const height = Math.max(1, this.renderer.domElement.clientHeight);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.post.setSize(width, height, this.pixelRatio);
    this.particles.setPixelRatio(this.pixelRatio);
  };

  private saveSettings(): void {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings)); } catch { /* storage unavailable */ }
  }

  private async toggleFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      this.ui.notify('FULLSCREEN IS NOT AVAILABLE');
    }
  }

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) this.pause();
  };

  private readonly onContextLost = (event: Event): void => {
    event.preventDefault();
    this.pause();
    this.ui.notify('GRAPHICS CONTEXT LOST — RELOAD TO RECOVER');
  };
}
