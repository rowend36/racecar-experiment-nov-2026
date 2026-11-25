import * as THREE from 'three';
import { Engine } from './Engine';
import { CameraRig } from './CameraRig';
import { Effects } from './Effects';
import { HUD } from './HUD';
import { Track } from '../world/Track';
import { RoadBuilder, buildScenery, disposeScenery, type SceneryResult } from '../world/Scenery';
import { SkySystem, PALETTES } from '../world/Sky';
import { setStartLights } from '../world/EnvironmentMaterials';
import { Vehicle, AIDriver } from '../vehicle/Vehicle';
import { CARS, PAINTS, type CarSpec } from '../vehicle/CarModel';
import { Input, createInput, type DriveInput, type Action } from '../core/Input';
import { AudioSystem } from '../core/Audio';
import { loadSettings, saveSettings, loadRecords, saveRecords, type Settings, type Records } from '../core/Storage';
import { UI } from '../ui/UI';
import { clamp } from '../core/Math';

const FIXED_DT = 1 / 120;
const AI_HZ = 20;
const RIVALS: Array<{ name: string; skill: number; paint: number }> = [
  { name: 'V. KOVA', skill: 0.96, paint: 3 },
  { name: 'M. STORM', skill: 0.93, paint: 5 },
  { name: 'R. OKADA', skill: 0.91, paint: 1 },
  { name: 'A. RIVERA', skill: 0.89, paint: 6 },
  { name: 'J. PETROV', skill: 0.87, paint: 2 },
];

export type GameMode = 'menu' | 'countdown' | 'racing' | 'paused' | 'results';

export class Game {
  readonly engine: Engine;
  readonly track = new Track();
  readonly input = new Input();
  readonly audio = new AudioSystem();
  readonly camera: CameraRig;
  readonly effects: Effects;
  readonly hud: HUD;
  readonly sky: SkySystem;
  readonly road: RoadBuilder;
  readonly cars: Vehicle[] = [];
  readonly player: Vehicle;
  readonly settings: Settings;
  readonly records: Records;
  readonly ui: UI;

  mode: GameMode = 'menu';
  time = 0;
  debugAutopilot = false;
  private rivals: AIDriver[] = [];
  private rivalInputs: DriveInput[] = [];
  private autopilot: AIDriver;
  private autopilotInput: DriveInput = createInput();
  private aiTimer = 0;
  private accumulator = 0;
  private lastFrame = performance.now();
  private countdown = 0;
  private countdownLabel = '';
  private message = '';
  private messageTimer = 0;
  private warn = '';
  private finishDelay = -1;
  private pausedFrom: GameMode = 'racing';
  private impactFlash = 0;
  private savedCamera = 0;
  private playerFill: THREE.PointLight;
  private scenery!: SceneryResult;
  private sceneryDensity = -1;
  private raf = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.settings = loadSettings();
    this.records = loadRecords();
    this.engine = new Engine(canvas, this.settings.quality);
    this.sky = new SkySystem(this.engine.scene, this.engine.renderer, this.settings.weather);
    this.camera = new CameraRig(window.innerWidth / Math.max(1, window.innerHeight));
    this.camera.shakeScale = this.settings.cameraShake;
    this.engine.setCamera(this.camera.camera);
    this.road = new RoadBuilder(this.track, PALETTES[this.settings.weather].wet);
    this.engine.scene.add(this.road.group);
    this.applyQuality();
    this.effects = new Effects(this.engine.scene);
    this.effects.setRain(this.settings.weather === 'storm' || this.settings.weather === 'night');
    this.playerFill = new THREE.PointLight(0xa8c8ff, 0, 22, 2);
    this.engine.scene.add(this.playerFill);
    this.hud = new HUD(this.track);

    // Player occupies slot 4 of the six-car grid.
    this.player = new Vehicle(this.engine.scene, this.track, this.cloneSpec(CARS[0]), PAINTS[this.settings.paint].color,
      PAINTS[this.settings.paint].accent, true);
    this.player.name = 'YOU';
    this.cars.push(this.player);
    for (let i = 0; i < RIVALS.length; i += 1) {
      const r = RIVALS[i];
      const car = new Vehicle(this.engine.scene, this.track, this.cloneSpec(CARS[i % CARS.length]),
        PAINTS[r.paint].color, PAINTS[r.paint].accent, false);
      car.name = r.name;
      this.cars.push(car);
      this.rivals.push(new AIDriver(car, this.track, this.player, r.skill, i + 1));
      this.rivalInputs.push(createInput());
    }
    this.autopilot = new AIDriver(this.player, this.track, null, 0.94, 9);
    this.applyVehicleSettings();
    this.applyPalette();

    this.ui = new UI(this.settings, this.records, {
      onStart: () => this.startRace(),
      onResume: () => this.togglePause(),
      onRestart: () => this.startRace(),
      onQuit: () => this.toMenu(),
      onSettings: () => this.applySettings(),
      onMute: () => this.toggleMute(),
      onFullscreen: () => this.toggleFullscreen(),
    });
    this.ui.setMuted(this.settings.muted);
    this.audio.setVolume(this.settings.volume);
    this.audio.setMuted(this.settings.muted);
    this.input.setActionListener((a) => this.handleAction(a));
    window.addEventListener('resize', () => this.engine.resize());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.mode === 'racing') this.togglePause();
    });
    this.resetGrid(0);
    this.camera.setMode('showcase');
    this.ui.showMenu();
    this.raf = requestAnimationFrame(this.frame);
    document.getElementById('loading')?.classList.add('hidden');
  }

  /** Only a live race puts the viewport in the Tab order. */
  private setCanvasFocusable(active: boolean): void {
    document.getElementById('game')?.setAttribute('tabindex', active ? '0' : '-1');
  }

  private cloneSpec(source: CarSpec): CarSpec {
    return { ...source, stats: { ...source.stats } };
  }

  private applyVehicleSettings(): void {
    const car = CARS.find((c) => c.id === this.settings.carId) ?? CARS[0];
    const spec = this.player.spec;
    spec.topSpeed = car.topSpeed;
    spec.accel = car.accel;
    spec.grip = car.grip;
    spec.brake = car.brake;
    spec.nitro = car.nitro;
    spec.name = car.name;
    spec.tagline = car.tagline;
    spec.id = car.id;
    spec.stats = { ...car.stats };
    const paint = PAINTS[this.settings.paint] ?? PAINTS[0];
    this.player.model.setPaint(paint.color, paint.accent);
    this.player.steeringScale = this.settings.steering;
    this.player.assistScale = this.settings.assist;
    this.camera.shakeScale = this.settings.cameraShake;
  }

  private applyPalette(): void {
    const p = PALETTES[this.settings.weather];
    this.engine.setPalette(p.exposure, p.bloom);
    this.road.asphaltMaterial.color.setRGB(1 - p.wet * 0.32, 1 - p.wet * 0.3, 1 - p.wet * 0.26);
    this.road.asphaltMaterial.roughness = 0.86 - p.wet * 0.42;
    this.road.asphaltMaterial.metalness = 0.04 + p.wet * 0.12;
    this.road.asphaltMaterial.envMapIntensity = 0.55 + p.wet * 1.2;
    this.effects.setRain(p.wet > 0.3);
  }

  private applyQuality(): void {
    this.engine.setQuality(this.settings.quality);
    const p = this.engine.preset;
    this.sky.setShadowSize(p.shadow);
    if (this.sceneryDensity !== p.density) {
      if (this.scenery) {
        this.engine.scene.remove(this.scenery.group);
        disposeScenery(this.scenery.group);
      }
      this.scenery = buildScenery(this.track, 8432, p.density, p.pointLights);
      this.engine.scene.add(this.scenery.group);
      this.sceneryDensity = p.density;
    }
    const intensity = this.settings.weather === 'night' ? 42 : this.settings.weather === 'storm' ? 24 : 14;
    for (const light of this.scenery.pointLights) light.intensity = intensity;
  }

  private applySettings(): void {
    saveSettings(this.settings);
    this.applyVehicleSettings();
    this.sky.setWeather(this.settings.weather);
    this.applyQuality();
    this.applyPalette();
  }

  private toggleMute(): void {
    this.settings.muted = !this.settings.muted;
    this.audio.setMuted(this.settings.muted);
    this.ui.setMuted(this.settings.muted);
    saveSettings(this.settings);
  }

  private toggleFullscreen(): void {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }

  private handleAction(action: Action): void {
    switch (action) {
      case 'pause':
        if (this.mode === 'racing' || this.mode === 'countdown') this.togglePause();
        else if (this.mode === 'paused') this.togglePause();
        break;
      case 'camera':
        if (this.mode === 'racing' || this.mode === 'countdown') this.camera.cycle();
        break;
      case 'reset':
        if (this.mode === 'racing' && !this.player.finished) {
          this.player.recover();
          this.message = 'RECOVERED';
          this.messageTimer = 1.2;
        }
        break;
      case 'mute':
        this.toggleMute();
        break;
      case 'confirm':
        if (this.mode === 'menu') this.startRace();
        else if (this.mode === 'results') this.startRace();
        else if (this.mode === 'paused') this.togglePause();
        break;
      case 'restart':
        if (this.mode !== 'menu') this.startRace();
        break;
      case 'fullscreen':
        this.toggleFullscreen();
        break;
    }
  }

  private resetGrid(time: number): void {
    for (let i = 0; i < this.cars.length; i += 1) this.cars[i].reset(i, time);
    this.effects.reset();
    this.hud.reset();
    this.time = 0;
    this.countdown = 3.6;
    this.countdownLabel = '';
    this.finishDelay = -1;
    this.accumulator = 0;
    this.aiTimer = 0;
    this.impactFlash = 0;
    this.input.reset();
    this.camera.reset();
    setStartLights(this.road.startLights, 0, false);
  }

  startRace(): void {
    this.applyVehicleSettings();
    this.resetGrid(0);
    this.ui.hideAll();
    this.hud.show();
    this.camera.setMode('chase');
    this.mode = 'countdown';
    this.setCanvasFocusable(true);
    document.getElementById('game')?.focus({ preventScroll: true });
    void this.audio.init();
    this.audio.beep(560, 0.1);
  }

  toMenu(): void {
    this.mode = 'menu';
    this.setCanvasFocusable(false);
    this.hud.hide();
    this.ui.showMenu();
    this.camera.setMode('showcase');
    this.resetGrid(0);
    this.audio.beep(420, 0.08);
  }

  private togglePause(): void {
    if (this.mode === 'paused') {
      this.mode = this.pausedFrom;
      this.ui.hidePause();
      this.setCanvasFocusable(true);
      document.getElementById('game')?.focus({ preventScroll: true });
      this.lastFrame = performance.now();
    } else {
      this.pausedFrom = this.mode;
      this.mode = 'paused';
      this.setCanvasFocusable(false);
      this.ui.showPause();
      this.input.reset();
    }
  }

  private frame = (now: number): void => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, Math.max(0, (now - this.lastFrame) / 1000));
    this.lastFrame = now;
    this.engine.updateTiming(dt);

    if (this.mode !== 'paused') {
      this.input.poll();
      if (this.mode === 'countdown') this.stepCountdown(dt);
      else if (this.mode === 'racing') this.stepRace(dt);
      else if (this.mode === 'menu') this.stepShowcase(dt);
      else if (this.mode === 'results') this.stepResults(dt);
    }

    const focus = this.mode === 'menu' ? this.cars[4] : this.player;
    const speed01 = clamp(focus.speedAbs / 70, 0, 1);
    const wet = PALETTES[this.settings.weather].wet;
    this.playerFill.intensity = wet > 0.3 ? 26 + wet * 16 : 0;
    this.playerFill.position.set(
      focus.pos.x - focus.forwardX * 3.2,
      focus.groundY + 4.2,
      focus.pos.z - focus.forwardZ * 3.2,
    );
    this.camera.update(dt, focus, speed01, focus.nitroActive);
    this.sky.update(dt, now / 1000, this.camera.camera);
    this.effects.update(dt, this.camera.camera);
    this.messageTimer = Math.max(0, this.messageTimer - dt);
    this.impactFlash = Math.max(0, this.impactFlash - dt * 3.2);

    this.audio.update({
      rpm01: clamp(this.player.rpm / 8200, 0, 1),
      throttle: this.input.drive.throttle,
      speed01,
      slip: this.player.slip,
      nitro: this.player.nitroActive,
      offRoad: this.player.offRoad,
      rain: PALETTES[this.settings.weather].wet,
      impact: this.player.wallHit + this.player.carHit,
    }, dt);
    this.player.wallHit = 0;
    this.player.carHit = 0;

    this.engine.setGlare(this.impactFlash * 0.2);
    this.engine.render(now / 1000, {
      speed01,
      nitro: this.player.nitroActive,
      impact: this.impactFlash,
      flash: (this.sky.material.uniforms.uFlash!.value as number) ?? 0,
      rain: PALETTES[this.settings.weather].wet,
    });
    if (this.mode !== 'menu' && this.mode !== 'paused') {
      this.hud.update(dt, this.player, this.cars, {
        time: this.time,
        fps: this.engine.fps,
        weather: this.settings.weather,
        countdown: this.mode === 'countdown' ? this.countdownLabel : '',
        message: this.messageTimer > 0 ? this.message : '',
        warn: this.warn,
      });
    }
  };

  private stepShowcase(dt: number): void {
    // Gently idle the grid cars so the menu has life without burning physics.
    for (const car of this.cars) car.model.updateVisual(dt, 0, 0, 0, false, false);
  }

  private stepCountdown(dt: number): void {
    this.countdown -= dt;
    const remain = this.countdown;
    const label = remain > 2.6 ? '3' : remain > 1.6 ? '2' : remain > 0.6 ? '1' : remain > 0 ? 'GO' : '';
    if (label !== this.countdownLabel) {
      this.countdownLabel = label;
      if (label && label !== 'GO') this.audio.countdown(false);
      if (label === 'GO') this.audio.countdown(true);
      setStartLights(this.road.startLights, label === 'GO' ? 5 : 3 - Number(label) + 1, label === 'GO');
    }
    if (this.countdown <= 0) {
      this.mode = 'racing';
      this.countdownLabel = '';
      this.message = 'GO!';
      this.messageTimer = 1.0;
    }
  }

  private stepRace(dt: number): void {
    this.accumulator += dt;
    let steps = 0;
    while (this.accumulator >= FIXED_DT && steps < 8) {
      this.stepPhysics(FIXED_DT);
      this.accumulator -= FIXED_DT;
      steps += 1;
    }
  }

  private stepPhysics(dt: number): void {
    this.time += dt;
    const drive = this.input.drive;
    this.player.brakingHeld = drive.brake > 0.15 || drive.handbrake;

    this.aiTimer -= dt;
    if (this.aiTimer <= 0) {
      this.aiTimer = 1 / AI_HZ;
      for (let i = 0; i < this.rivals.length; i += 1) {
        this.rivalInputs[i] = this.rivals[i].think(1 / AI_HZ, this.time);
      }
      if (this.debugAutopilot) this.autopilotInput = this.autopilot.think(1 / AI_HZ, this.time);
    }
    this.player.update(dt, this.debugAutopilot ? this.autopilotInput : drive, this.time);
    for (let i = 0; i < this.rivals.length; i += 1) {
      this.rivals[i].vehicle.update(dt, this.rivalInputs[i], this.time);
    }

    for (let i = 0; i < this.cars.length; i += 1) {
      for (let j = i + 1; j < this.cars.length; j += 1) {
        Vehicle.resolveCollision(this.cars[i], this.cars[j]);
      }
    }

    const order = [...this.cars].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.progress - a.progress;
    });
    for (let i = 0; i < order.length; i += 1) order[i].position = i + 1;

    // Visual feedback.
    for (const car of this.cars) {
      if (car.drifting && car.speedAbs > 10) {
        this.effects.addSkid(car.pos.x, car.groundY + 0.03, car.pos.z, car.yaw, 0.38);
        if (Math.random() < 0.35) {
          this.effects.emitSmoke(car.pos.x - car.forwardX * 1.4, car.groundY + 0.2,
            car.pos.z - car.forwardZ * 1.4, -car.vx, -car.vz, 1);
        }
      }
      if (car.wallHit > 0.16) {
        this.effects.emitSparks(car.pos.x, car.groundY + 0.4, car.pos.z, car.wallHit);
        if (car === this.player) {
          this.camera.addShake(car.wallHit);
          this.audio.impact(car.wallHit);
          this.impactFlash = Math.max(this.impactFlash, car.wallHit);
        }
      }
    }

    this.warn = this.player.wrongWay ? 'WRONG WAY' : this.player.offRoad ? 'OFF TRACK' : '';
    if (this.messageTimer <= 0 && this.player.lapsCompleted > this.savedCamera) {
      this.savedCamera = this.player.lapsCompleted;
      if (!this.player.finished) {
        this.message = this.player.lapsCompleted === 2 ? 'FINAL LAP' : `LAP ${this.player.displayLap}`;
        this.messageTimer = 1.8;
      }
    }

    if (this.player.finished && this.finishDelay < 0) this.finishDelay = 1.1;
    if (this.finishDelay > 0) {
      this.finishDelay -= dt;
      if (this.finishDelay <= 0) this.finishRace();
    }
  }

  private stepResults(dt: number): void {
    for (const car of this.cars) car.model.updateVisual(dt, 0, 0, 0, false, false);
  }

  private finishRace(): void {
    this.mode = 'results';
    this.setCanvasFocusable(false);
    this.input.reset();
    const key = this.settings.carId;
    const best = this.records.bestLap[key];
    const isBest = this.player.bestLap > 0 && (!best || this.player.bestLap < best);
    if (isBest) this.records.bestLap[key] = this.player.bestLap;
    const raceKey = `${key}:${this.settings.weather}`;
    const raceBest = this.records.bestRace[raceKey];
    if (!raceBest || this.player.finishTime < raceBest) this.records.bestRace[raceKey] = this.player.finishTime;
    saveRecords(this.records);
    this.ui.showResults({ player: this.player, cars: this.cars, totalTime: this.player.finishTime });
    if (isBest) this.audio.beep(980, 0.3, 0.2);
  }

  /** Exposed for automated smoke tests and manual debugging. */
  debugState(): Record<string, unknown> {
    return {
      mode: this.mode,
      time: this.time,
      fps: this.engine.fps,
      player: {
        speed: this.player.speedKmh,
        lap: this.player.lapsCompleted,
        position: this.player.position,
        nitro: this.player.nitro,
        finished: this.player.finished,
        s: this.player.s,
        lateral: this.player.lateral,
      },
      cars: this.cars.length,
      trackLength: this.track.length,
      sceneryInstances: this.scenery.group.children.length,
      quality: this.engine.debugQuality(),
      renderer: this.engine.renderer.info.render,
    };
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.input.dispose();
    this.sky.dispose();
  }
}
