import * as THREE from 'three';
import { Engine, Quality } from '../core/Engine';
import { AudioSystem } from '../core/Audio';
import { Input } from '../core/Input';
import { TextureSet } from '../core/Textures';
import { Sky, SUNSET, STORM } from '../world/Sky';
import { Track } from '../world/Track';
import { Scenery } from '../world/Scenery';
import { CARS, CarModel, CarSpec } from '../vehicle/CarModel';
import { Vehicle, AIDriver, DriveInput, createInput } from '../vehicle/Vehicle';
import { Effects } from './Effects';
import { CameraRig, CameraTarget } from './CameraRig';
import { HUD, HudCar } from './HUD';
import { clamp, nextFrame, rand } from '../core/Math';
import type { ResultsData, ResultsRow } from '../ui/UI';

export type GameState = 'menu' | 'countdown' | 'racing' | 'paused' | 'finished';

const TOTAL_LAPS = 3;
const FIXED_DT = 1 / 120;

const AI_SETUP = [
  { driver: 'K. VOSS', car: 1, color: 0x0b8ed8, accent: 0x9ef4ff, skill: 0.995, slot: 0 },
  { driver: 'M. REYES', car: 2, color: 0xf4a400, accent: 0xffe14a, skill: 0.975, slot: 1 },
  { driver: 'A. LINDQVIST', car: 0, color: 0xff2f6d, accent: 0xffc2e2, skill: 0.985, slot: 2 },
  { driver: 'D. OKAFOR', car: 1, color: 0x27c96b, accent: 0xd8ff3c, skill: 0.955, slot: 3 },
  { driver: 'S. TANAKA', car: 2, color: 0x7a5cff, accent: 0xd9c8ff, skill: 0.965, slot: 5 },
];

const PLAYER_SLOT = 4;

export class RaceGame {
  readonly engine: Engine;
  readonly textures: TextureSet;
  readonly audio: AudioSystem;
  readonly input: Input;
  hud!: HUD;

  state: GameState = 'menu';
  track!: Track;
  scenery!: Scenery;
  sky!: Sky;
  sun!: THREE.DirectionalLight;
  hemi!: THREE.HemisphereLight;
  fill!: THREE.DirectionalLight;
  carFill!: THREE.PointLight;
  effects!: Effects;
  cameraRig: CameraRig;
  preview: CarModel | null = null;
  previewTarget: CameraTarget | null = null;
  player!: Vehicle;
  playerAI: AIDriver | null = null;
  debugAutopilot = false;
  cars: Vehicle[] = [];
  aiDrivers: AIDriver[] = [];

  onFinish: ((data: ResultsData) => void) | null = null;
  onPauseChanged: ((paused: boolean) => void) | null = null;

  private config: { carId: string; color: number; accent: number; weather: 'sunset' | 'storm'; quality: Quality };
  private weather: 'sunset' | 'storm' = 'sunset';
  private quality: Quality = 'ultra';
  private sunDir = SUNSET.sunDir.clone();

  private driveInput: DriveInput = createInput();
  private aiInputs: DriveInput[] = [];
  private aiTimers: number[] = [];
  private prevS: number[] = [];
  private accumulator = 0;
  private countdownT = 0;
  private lastCountdown = '';
  private raceTime = 0;
  private lastPlayerPosition = 6;
  private overtakeCooldown = 0;
  private wrongWay = false;
  private speedBlur = 0;
  private resultsSent = false;
  private flash = 0;
  private lightningTimer = rand(6, 14);
  private lightsOffTimer = 0;

  constructor(
    engine: Engine,
    textures: TextureSet,
    audio: AudioSystem,
    input: Input,
    config: { carId: string; color: number; accent: number; weather: 'sunset' | 'storm'; quality: Quality },
  ) {
    this.engine = engine;
    this.textures = textures;
    this.audio = audio;
    this.input = input;
    this.config = { ...config };
    this.cameraRig = new CameraRig(engine.camera);
  }

  async init(progress: (label: string, p: number) => void): Promise<void> {
    progress('FORGING THE CIRCUIT', 0.16);
    await nextFrame();
    this.track = new Track(this.textures);
    this.scene.add(this.track.group);

    progress('BAKING TERRAIN AND SKYLINE', 0.4);
    await nextFrame();
    this.scenery = new Scenery(this.track, this.textures);
    this.scene.add(this.scenery.group);

    progress('RAISING THE SUNSET', 0.58);
    await nextFrame();
    this.sky = new Sky(this.engine.renderer);
    this.scene.add(this.sky.mesh);
    this.setupLights();
    this.effects = new Effects(this.scene, this.textures);

    progress('ASSEMBLING THE MACHINE', 0.72);
    await nextFrame();
    this.applyQuality(this.config.quality, true);
    this.applyWeather(this.config.weather, true);
    this.buildPreview();

    progress('CALIBRATING TELEMETRY', 0.86);
    await nextFrame();
    this.hud = new HUD(this.track);

    progress('COMPILING SHADERS', 0.94);
    await nextFrame();
    try {
      this.engine.renderer.compile(this.scene, this.engine.camera);
    } catch {
      /* compile is best-effort */
    }
    progress('READY', 1);
    await nextFrame();
    this.state = 'menu';
  }

  private get scene(): THREE.Scene {
    return this.engine.scene;
  }

  private setupLights(): void {
    const sun = new THREE.DirectionalLight(0xffb37d, 3.2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(this.engine.shadowMapSize, this.engine.shadowMapSize);
    const cam = sun.shadow.camera as THREE.OrthographicCamera;
    cam.left = -78;
    cam.right = 78;
    cam.top = 78;
    cam.bottom = -78;
    cam.near = 1;
    cam.far = 620;
    cam.updateProjectionMatrix();
    sun.shadow.bias = -0.00025;
    sun.shadow.normalBias = 0.035;
    this.scene.add(sun, sun.target);
    this.sun = sun;

    this.hemi = new THREE.HemisphereLight(0x8fa8ff, 0x2a1a16, 0.5);
    this.scene.add(this.hemi);

    this.fill = new THREE.DirectionalLight(0x8fb8ff, 0.55);
    this.fill.position.set(-120, 80, 140);
    this.scene.add(this.fill);

    // Localised cool rim/fill that follows the focus car so its body reads at dusk.
    this.carFill = new THREE.PointLight(0xbfd8ff, 220, 45, 2);
    this.scene.add(this.carFill);
  }

  private applyQuality(quality: Quality, force = false): void {
    if (quality !== this.quality || force) {
      this.engine.setQuality(quality);
      this.quality = quality;
    }
    if (this.sun) {
      const size = this.engine.shadowMapSize;
      if (this.sun.shadow.mapSize.x !== size) {
        this.sun.shadow.mapSize.set(size, size);
        this.sun.shadow.map?.dispose();
        this.sun.shadow.map = null;
      }
    }
  }

  private applyWeather(weather: 'sunset' | 'storm', force = false): void {
    if (!force && weather === this.weather) return;
    this.weather = weather;
    const storm = weather === 'storm';
    const p = storm ? STORM : SUNSET;
    this.sunDir.copy(p.sunDir);

    this.sky.setPalette(p, storm);
    this.scene.environment = this.sky.environment;
    this.scene.environmentIntensity = p.envIntensity;
    this.scene.fog = new THREE.FogExp2(p.fog, p.fogDensity);
    this.engine.renderer.setClearColor(p.fog, 1);

    this.sun.color.setHex(p.light);
    this.sun.intensity = p.lightIntensity;
    this.hemi.color.setHex(p.hemiSky);
    this.hemi.groundColor.setHex(p.hemiGround);
    this.hemi.intensity = p.hemiIntensity;
    this.fill.color.setHex(p.hemiSky);
    this.fill.intensity = storm ? 0.65 : 0.5;
    this.carFill.intensity = storm ? 190 : 260;

    this.engine.setExposure(p.exposure);
    this.engine.setBloom(p.bloom);
    this.track?.setWet(storm);
    this.effects?.setStorm(storm);
    this.audio.setRain(storm);
    this.lightningTimer = rand(5, 12);
    this.flash = 0;
  }

  private buildPreview(): void {
    if (this.preview) this.preview.dispose();
    const base = CARS.find((c) => c.id === this.config.carId) ?? CARS[0];
    const spec: CarSpec = { ...base, color: this.config.color, accent: this.config.accent };
    const model = new CarModel(spec, this.textures);
    const slot = this.track.gridSlot(2);
    model.root.position.copy(slot.position).add(new THREE.Vector3(0, 0.01, 0));
    model.root.rotation.y = slot.yaw;
    this.scene.add(model.root);
    this.preview = model;
    this.previewTarget = {
      pos: model.root.position,
      yaw: slot.yaw,
      speedAbs: 0,
      groundY: slot.position.y,
      steerInput: 0,
      slip: 0,
      nitroActive: false,
    };
  }

  applyConfig(config: { carId: string; color: number; accent: number; weather: 'sunset' | 'storm'; quality: Quality }): void {
    const weatherChanged = config.weather !== this.config.weather;
    const qualityChanged = config.quality !== this.config.quality;
    this.config = { ...config };
    if (weatherChanged) this.applyWeather(config.weather);
    if (qualityChanged) this.applyQuality(config.quality);
    if (this.preview) this.preview.setPaint(config.color, config.accent);
    if (this.state !== 'menu' && this.player) this.player.model.setPaint(config.color, config.accent);
  }

  startRace(): void {
    this.teardownCars();
    if (this.preview) this.preview.root.visible = false;

    const base = CARS.find((c) => c.id === this.config.carId) ?? CARS[0];
    const playerSpec: CarSpec = { ...base, color: this.config.color, accent: this.config.accent };
    this.player = new Vehicle(this.scene, this.track, playerSpec, this.textures, true);
    this.player.driverName = 'YOU';
    this.player.reset(PLAYER_SLOT, 0);

    const cars: Vehicle[] = [this.player];
    const drivers: AIDriver[] = [];
    AI_SETUP.forEach((info, i) => {
      const specBase = CARS[info.car % CARS.length];
      const spec: CarSpec = {
        ...specBase,
        name: specBase.name,
        color: info.color,
        accent: info.accent,
      };
      const vehicle = new Vehicle(this.scene, this.track, spec, this.textures, false);
      vehicle.driverName = info.driver;
      vehicle.reset(info.slot, 0);
      cars.push(vehicle);
      drivers.push(new AIDriver(vehicle, this.track, this.player, info.skill, i + 1));
    });

    this.cars = cars;
    this.aiDrivers = drivers;
    this.playerAI = new AIDriver(this.player, this.track, null, 1.0, 9);
    this.aiInputs = drivers.map(() => createInput());
    this.aiTimers = drivers.map(() => 0);
    this.prevS = cars.map((c) => c.s);

    this.state = 'countdown';
    this.countdownT = 3.9;
    this.lastCountdown = '';
    this.raceTime = 0;
    this.accumulator = 0;
    this.resultsSent = false;
    this.wrongWay = false;
    this.speedBlur = 0;
    this.lightsOffTimer = 0;
    this.overtakeCooldown = 0;
    this.flash = 0;
    this.lightningTimer = rand(4, 10);

    this.hud.setVisible(true);
    this.hud.setCarName(playerSpec.name);
    this.hud.showCountdown('');
    this.scenery.setStartLights(0, false);
    this.effects.clear();
    this.cameraRig.setMode('chase');
    this.cameraRig.snap(this.player);
    this.updatePositions();
    this.lastPlayerPosition = this.player.position;
  }

  private teardownCars(): void {
    for (const car of this.cars) car.model.dispose();
    this.cars = [];
    this.aiDrivers = [];
    this.aiInputs = [];
    this.aiTimers = [];
    this.prevS = [];
  }

  quitToMenu(): void {
    this.teardownCars();
    this.state = 'menu';
    this.hud.setVisible(false);
    this.hud.showCountdown('');
    this.scenery.setStartLights(0, false);
    this.effects.clear();
    this.cameraRig.setMode('chase');
    if (this.preview) this.preview.root.visible = true;
    this.onPauseChanged?.(false);
    this.speedBlur = 0;
  }

  togglePause(): void {
    if (this.state === 'racing') {
      this.state = 'paused';
      this.onPauseChanged?.(true);
      this.audio.updateEngine(0, 0, 0, false, 1, false);
    } else if (this.state === 'paused') {
      this.state = 'racing';
      this.accumulator = 0;
      this.onPauseChanged?.(false);
    }
  }

  private resetPlayer(): void {
    if (this.state !== 'racing') return;
    const f = this.track.frameAt(this.player.s);
    this.player.pos.set(f.pos.x, f.pos.y, f.pos.z);
    this.player.yaw = Math.atan2(f.tangent.x, f.tangent.z);
    this.player.vx = 0;
    this.player.vz = 0;
    this.player.yawRate = 0;
    this.player.hint = -1;
    this.cameraRig.snap(this.player);
    this.hud.showMessage('RESET', 'cyan', 1.1);
  }

  private updatePositions(): void {
    const order = this.cars.slice().sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.progress - a.progress;
    });
    order.forEach((car, i) => {
      car.position = i + 1;
    });
  }

  private handleLap(car: Vehicle, index: number): void {
    if (car.finished) return;
    const L = this.track.length;
    const prev = this.prevS[index] ?? car.s;
    if (prev > L * 0.72 && car.s < L * 0.28) {
      car.lap++;
      if (car.lap === 1) {
        car.lapStart = this.raceTime;
      } else if (car.lapStart >= 0) {
        const lapTime = Math.max(0.001, this.raceTime - car.lapStart);
        car.lastLap = lapTime;
        car.lapTimes.push(lapTime);
        if (!car.bestLap || lapTime < car.bestLap) car.bestLap = lapTime;
        car.lapStart = this.raceTime;
        if (car.isPlayer) {
          if (car.lap === 3) this.hud.showMessage('FINAL LAP', 'amber', 2);
          else if (car.lap < 4) this.hud.showMessage(`LAP ${car.lap}`, 'cyan', 1.3);
        }
      }
      if (car.lap > TOTAL_LAPS) this.finishCar(car);
      car.progress = car.lap * L + car.s;
    } else if (prev < L * 0.28 && car.s > L * 0.72) {
      car.lap = Math.max(0, car.lap - 1);
    }
    this.prevS[index] = car.s;
  }

  private finishCar(car: Vehicle): void {
    if (car.finished) return;
    car.finished = true;
    car.finishTime = this.raceTime;
    car.progress = car.lap * this.track.length + car.s;
    if (car.isPlayer) this.finishPlayer();
  }

  private finishPlayer(): void {
    if (this.resultsSent) return;
    this.resultsSent = true;
    this.state = 'finished';
    this.hud.setVisible(false);
    this.hud.showCountdown('');
    this.speedBlur = 0;
    this.updatePositions();
    const data = this.buildResults();
    this.onFinish?.(data);
  }

  private buildResults(): ResultsData {
    const order = this.cars.slice().sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.progress - a.progress;
    });
    const playerIndex = order.indexOf(this.player);
    const rows: ResultsRow[] = order.map((car, i) => {
      let timeText = '—';
      if (car.finished) timeText = this.formatTime(car.finishTime);
      else if (this.state === 'finished' || this.player.finishTime > 0) {
        const behind = Math.max(0, this.player.progress - car.progress);
        const lapsDown = Math.floor(behind / this.track.length);
        timeText = lapsDown >= 1
          ? `+${lapsDown} LAP${lapsDown > 1 ? 'S' : ''}`
          : `+${(behind / 42).toFixed(1)}s`;
      }
      return {
        position: i + 1,
        driver: car.driverName || (car.isPlayer ? 'YOU' : 'RIVAL'),
        car: car.spec.name,
        timeText,
        isPlayer: car.isPlayer,
        finished: car.finished,
      };
    });
    return {
      position: playerIndex + 1,
      totalCars: this.cars.length,
      totalTime: this.player.finishTime,
      bestLap: this.player.bestLap,
      laps: this.player.lapTimes.slice(0, TOTAL_LAPS),
      rows,
      newBest: false,
    };
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  private fixedStep(dt: number): void {
    this.raceTime += dt;
    if (this.debugAutopilot && this.playerAI) {
      const auto = this.playerAI.think(dt);
      this.driveInput.throttle = auto.throttle;
      this.driveInput.brake = auto.brake;
      this.driveInput.steer = auto.steer;
      this.driveInput.handbrake = auto.handbrake;
      this.driveInput.nitro = auto.nitro;
    } else {
      this.zeroInput(this.driveInput);
      this.driveInput.throttle = this.input.throttle;
      this.driveInput.brake = this.input.brake;
      this.driveInput.steer = this.input.steer;
      this.driveInput.handbrake = this.input.handbrake;
      this.driveInput.nitro = this.input.nitro;
    }
    this.player.update(dt, this.driveInput);

    for (let i = 0; i < this.aiDrivers.length; i++) {
      const car = this.aiDrivers[i].vehicle;
      if (car.finished) {
        this.zeroInput(this.aiInputs[i]);
      } else {
        this.aiTimers[i] -= dt;
        if (this.aiTimers[i] <= 0) {
          this.aiInputs[i] = this.aiDrivers[i].think(0.05);
          this.aiTimers[i] = 0.05;
        }
      }
      car.update(dt, this.aiInputs[i]);
    }

    for (let i = 0; i < this.cars.length; i++) {
      for (let j = i + 1; j < this.cars.length; j++) {
        Vehicle.resolveCollision(this.cars[i], this.cars[j]);
      }
    }

    for (let i = 0; i < this.cars.length; i++) {
      this.handleLap(this.cars[i], i);
    }
    this.updatePositions();
  }

  private zeroInput(input: DriveInput): void {
    input.throttle = 0;
    input.brake = 0;
    input.steer = 0;
    input.handbrake = false;
    input.nitro = false;
  }

  update(dt: number): void {
    const step = Math.min(dt, 1 / 20);
    this.handleGlobalInput();

    if (this.state !== 'paused') {
      this.updateLightning(step);
      this.lightsOffTimer = Math.max(0, this.lightsOffTimer - step);
      if (this.lightsOffTimer === 0 && this.state === 'racing') {
        this.scenery.setStartLights(0, false);
      }
    }

    let speed01 = 0;
    if (this.player) {
      speed01 = clamp(this.player.speedAbs / Math.max(10, this.player.spec.topSpeed), 0, 1);
    }

    switch (this.state) {
      case 'menu':
        this.updateMenu(step);
        this.updateCamera(step, 0);
        break;
      case 'countdown':
        this.updateCountdown(step);
        this.updateCamera(step, 0);
        this.updateHud(step);
        break;
      case 'racing':
        this.updateRacing(step);
        speed01 = clamp(this.player.speedAbs / Math.max(10, this.player.spec.topSpeed), 0, 1);
        this.updateCamera(step, speed01);
        this.updateHud(step);
        this.updateFeedback(step);
        break;
      case 'paused':
        break;
      case 'finished':
        this.updateCamera(step, 0);
        break;
    }

    this.speedBlur =
      this.state === 'racing' && this.player
        ? clamp((this.player.speedAbs - 28) / 82, 0, 1) * 0.9 + (this.player.nitroActive ? 0.12 : 0)
        : 0;
    this.engine.setSpeedBlur(this.speedBlur);
    this.engine.setVignette(0.4 + this.speedBlur * 0.09);

    this.updateAudio(speed01);
    this.effects.update(step, this.engine.camera, this.state === 'racing' ? speed01 : 0);
    this.updateSun();
    this.sky.update(step, this.engine.camera.position);
    this.engine.setFlash(this.flash * 0.45);
  }

  private updateMenu(dt: number): void {
    if (!this.preview) return;
    const t = performance.now() * 0.001;
    this.preview.updateVisual(dt, 0, Math.sin(t * 0.6) * 0.35, 0, false);
    this.preview.setBodyTilt(Math.sin(t * 0.5) * 0.004, 0);
  }

  private updateCountdown(dt: number): void {
    this.countdownT -= dt;
    const t = this.countdownT;
    let display = '';
    if (t > 2.9) display = '3';
    else if (t > 1.9) display = '2';
    else if (t > 0.9) display = '1';
    else if (t > 0.12) display = 'GO';
    if (display !== this.lastCountdown) {
      this.lastCountdown = display;
      if (display) {
        this.hud.showCountdown(display);
        if (display === 'GO') {
          this.scenery.setStartLights(0, true);
          this.audio.countdown(0);
          this.lightsOffTimer = 1.6;
        } else {
          const n = Number(display);
          this.scenery.setStartLights(4 - n, false);
          this.audio.countdown(n);
        }
      }
    }
    if (t <= 0) {
      this.state = 'racing';
      this.raceTime = 0;
      this.accumulator = 0;
      this.hud.showCountdown('');
      this.prevS = this.cars.map((c) => c.s);
    }
  }

  private updateRacing(dt: number): void {
    this.accumulator += dt;
    let steps = 0;
    while (this.accumulator >= FIXED_DT && steps < 8) {
      this.fixedStep(FIXED_DT);
      this.accumulator -= FIXED_DT;
      steps++;
      if (this.state !== 'racing') break;
    }
    if (steps >= 8) this.accumulator = 0;
    if (this.overtakeCooldown > 0) this.overtakeCooldown -= dt;
    if (this.state === 'racing' && this.overtakeCooldown <= 0) {
      if (this.raceTime > 5 && this.player.speedKmh > 25 && this.player.position < this.lastPlayerPosition) {
        this.hud.showMessage('OVERTAKE', 'cyan', 1.4);
        this.overtakeCooldown = 1.6;
      }
      this.lastPlayerPosition = this.player.position;
    }
  }

  private updateHud(dt: number): void {
    if (!this.player) return;
    const f = this.track.frameAt(this.player.s);
    const heading =
      this.player.vx * f.tangent.x + this.player.vz * f.tangent.z;
    this.wrongWay =
      (this.state === 'racing') && this.player.speedAbs > 7 && heading < -4;
    const hudCars: HudCar[] = this.cars.map((car) => ({
      x: car.pos.x,
      z: car.pos.z,
      yaw: car.yaw,
      isPlayer: car.isPlayer,
      color: car.spec.color,
    }));
    const lapTime =
      this.state === 'racing' && this.player.lap > 0
        ? Math.max(0, this.raceTime - this.player.lapStart)
        : this.state === 'racing'
          ? this.raceTime
          : 0;
    this.hud.update(dt, {
      speedKmh: this.player.speedKmh,
      gear: this.player.gear,
      reverse: this.player.speed < -0.5,
      nitro: this.player.nitro,
      lap: Math.max(1, Math.min(this.player.lap, TOTAL_LAPS)),
      totalLaps: TOTAL_LAPS,
      position: this.player.position,
      totalCars: this.cars.length,
      lapTime,
      bestLap: this.player.bestLap,
      drift: this.player.drift,
      wrongWay: this.wrongWay,
      cars: hudCars,
    });
  }

  private updateFeedback(dt: number): void {
    for (const car of this.cars) {
      if (car.wallHit > 0.05) {
        const f = this.track.frameAt(car.s);
        const side = Math.sign(car.lateral) || 1;
        const x = car.pos.x + f.right.x * side * 1.05;
        const z = car.pos.z + f.right.z * side * 1.05;
        this.effects.sparkBurst(x, car.groundY + 0.5, z, car.wallHit);
        if (car.isPlayer) {
          this.cameraRig.addShake(car.wallHit * 0.55);
          this.audio.impact(car.wallHit);
          if (car.wallHit > 0.3) this.audio.scrape(car.wallHit);
        }
        car.wallHit = 0;
      }
      if (car.carHit > 0.08) {
        this.effects.sparkBurst(car.pos.x, car.groundY + 0.6, car.pos.z, car.carHit * 0.8);
        if (car.isPlayer) {
          this.cameraRig.addShake(car.carHit * 0.4);
          this.audio.impact(car.carHit * 0.7);
        }
        car.carHit = 0;
      }
      this.effects.tireSmoke(car, dt);
      this.effects.flame(car);
    }
  }

  private updateCamera(dt: number, speed01: number): void {
    if (this.state === 'menu') {
      if (this.previewTarget) this.cameraRig.update(dt, this.previewTarget, 0, true, false);
      return;
    }
    if (!this.player) return;
    if (this.state === 'finished') {
      this.cameraRig.update(dt, this.player, 0, false, true);
      return;
    }
    this.cameraRig.update(dt, this.player, speed01, false, false);
  }

  private updateAudio(speed01: number): void {
    if (!this.player || this.cars.length === 0) {
      if (this.audio) this.audio.updateEngine(0, 0, 0, false, 1, false);
      return;
    }
    const active = this.state === 'racing' || this.state === 'countdown';
    const throttle = active ? this.input.throttle : 0;
    this.audio.updateEngine(
      this.player.rpm,
      throttle,
      active ? speed01 : 0,
      active && this.player.nitroActive,
      this.player.gear,
      active,
    );
    this.audio.updateTyres(active ? this.player.slip : 0, active ? speed01 : 0);
    this.audio.updateWind(active ? speed01 : 0);
    this.audio.updateNitro(active && this.player.nitroActive);
  }

  private updateSun(): void {
    const focus = this.state === 'menu' && this.preview ? this.preview.root.position : this.player?.pos;
    if (!focus) return;
    this.sun.position.copy(focus).addScaledVector(this.sunDir, 280);
    this.sun.target.position.copy(focus);
    this.sun.target.updateMatrixWorld();

    const camera = this.engine.camera;
    const rimDir = camera.position.clone().sub(focus);
    rimDir.y = Math.abs(rimDir.y) + 3.5;
    rimDir.normalize();
    this.carFill.position.copy(focus).addScaledVector(rimDir, 4).add(new THREE.Vector3(0, 2.3, 0));
  }

  private updateLightning(dt: number): void {
    if (this.weather !== 'storm') {
      this.flash = 0;
      this.sky?.setFlash(0);
      return;
    }
    this.flash = Math.max(0, this.flash - dt * 2.2);
    this.lightningTimer -= dt;
    if (this.lightningTimer <= 0) {
      this.lightningTimer = rand(5, 13);
      this.flash = 1;
      this.audio.thunder();
      this.sky?.setFlash(1);
    } else {
      this.sky?.setFlash(this.flash);
    }
  }

  private handleGlobalInput(): void {
    if (this.input.consume('pause')) this.togglePause();
    if (this.input.consume('camera') && (this.state === 'racing' || this.state === 'countdown')) {
      this.cameraRig.cycleMode();
    }
    if (this.input.consume('reset') && this.state === 'racing') this.resetPlayer();
  }

  getSpeedBlur(): number {
    return this.speedBlur;
  }

  get isStorm(): boolean {
    return this.weather === 'storm';
  }
}

