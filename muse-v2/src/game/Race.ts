import * as THREE from 'three';
import { Track } from '../world/Track';
import { Environment } from '../world/Environment';
import { Vehicle, AIDriver, DriveInput, createInput } from '../vehicle/Vehicle';
import { CAR_SPECS } from '../vehicle/CarModel';
import { CameraRig } from './CameraRig';
import { Input } from '../core/Input';
import { AudioSystem } from '../core/Audio';
import type { TextureSet } from '../core/Textures';
import { clamp, formatTime } from '../core/Math';

export type RaceState = 'menu' | 'countdown' | 'racing' | 'paused' | 'finished';

export interface RaceSettings {
  carId: string;
  paint: number;
  quality: 'ultra' | 'high' | 'performance';
  muted: boolean;
  sensitivity: number;
}

export interface HudSnapshot {
  state: RaceState;
  kmh: number;
  gear: number | 'R' | 'N';
  rpm: number;
  nitro: number;
  nitroActive: boolean;
  lap: number;
  totalLaps: number;
  position: number;
  lapTime: number;
  lastLap: number;
  bestLap: number;
  sessionBest: number;
  drifting: boolean;
  wrongWay: boolean;
  offRoad: boolean;
  countdown: string;
  message: string;
  fps: number;
  progress01: number;
}

export interface RaceResult {
  position: number;
  name: string;
  isPlayer: boolean;
  totalTime: number;
  bestLap: number;
  lapTimes: number[];
  gap: string;
  topSpeed: number;
}

const LAPS = 3;
const PHYS_DT = 1 / 120;
const AI_DT = 1 / 20;

const AI_NAMES = ['VEX', 'KOBALT', 'SABLE'];

/** Start-line crossing with forward-motion gating. Returns lap delta. */
export function crossingDelta(prevS: number, s: number, length: number, vLong: number): number {
  if (vLong <= 0.5) return 0;
  if (prevS > length * 0.75 && s < length * 0.25) return 1;
  if (prevS < length * 0.25 && s > length * 0.75) return -1;
  return 0;
}

export class Race {
  state: RaceState = 'menu';
  cars: Vehicle[] = [];
  player!: Vehicle;
  time = 0;
  countdownT = 0;
  countdownShown = '';
  message = '';
  messageT = 0;
  wrongWay = false;
  debugAutopilot = false;
  topSpeed = 0;
  results: RaceResult[] = [];
  newBest = false;
  sessionBest = 0;

  private acc = 0;
  private aiAcc = 0;
  private prevS: number[] = [];
  private aiInputs: DriveInput[] = [];
  private wrongWayT = 0;
  private countdownLast = '';
  private finalLapShown = false;
  private finishOrder: Vehicle[] = [];
  private persistBest: number;

  constructor(
    private scene: THREE.Scene,
    private track: Track,
    private env: Environment,
    private cameraRig: CameraRig,
    private input: Input,
    private audio: AudioSystem,
    private textures: TextureSet,
    private settings: RaceSettings,
    private events: {
      onCountdown: (label: string) => void;
      onMessage: (text: string, dur: number) => void;
      onFinish: (results: RaceResult[], newBest: boolean) => void;
      onStateChange: (s: RaceState) => void;
    },
  ) {
    this.persistBest = Number(localStorage.getItem('apex-v2-best-lap-v1') ?? 0) || 0;
    this.buildGrid();
  }

  get bestLap(): number {
    return this.persistBest;
  }

  private buildGrid(): void {
    for (const c of this.cars) {
      this.scene.remove(c.model.root);
    }
    this.cars = [];
    this.aiInputs = [];
    this.finishOrder = [];
    const spec = CAR_SPECS.find((s) => s.id === this.settings.carId) ?? CAR_SPECS[0];

    const mk = (slot: number, isPlayer: boolean, name: string): Vehicle => {
      const s = isPlayer ? spec : CAR_SPECS[(slot + 1) % CAR_SPECS.length];
      const v = new Vehicle(this.scene, this.track, s, this.textures, isPlayer);
      v.driverName = name;
      if (!isPlayer) {
        v.model.setPaint(s.color);
      } else {
        v.model.setPaint(this.settings.paint);
      }
      v.reset(slot, 0);
      return v;
    };

    // Slots 0..3, player starts last (slot 3).
    const order: Array<{ slot: number; player: boolean; name: string }> = [
      { slot: 0, player: false, name: AI_NAMES[0] },
      { slot: 1, player: false, name: AI_NAMES[1] },
      { slot: 2, player: false, name: AI_NAMES[2] },
      { slot: 3, player: true, name: 'YOU' },
    ];
    for (const o of order) {
      const car = mk(o.slot, o.player, o.name);
      if (o.player) this.player = car;
      // Every car gets an AI driver: rivals always race on it, and the
      // player's is used for the headless autopilot smoke test.
      car.ai = new AIDriver(car, this.track, null, o.player ? 0.7 : 0.55 + o.slot * 0.08, o.slot + 2);
      this.cars.push(car);
      this.aiInputs.push(createInput());
    }
    // AI needs the player ref (player created last) — rebind.
    for (const v of this.cars) {
      if (v.ai) (v.ai as unknown as { player: Vehicle }).player = this.player;
    }
    this.prevS = this.cars.map((c) => c.s);
    this.cameraRig.snapTo(this.player);
    this.topSpeed = 0;
    this.sessionBest = 0;
    this.newBest = false;
    this.finalLapShown = false;
    this.results = [];
    this.wrongWay = false;
  }

  rebuildGrid(): void {
    this.buildGrid();
  }

  setState(s: RaceState): void {
    this.state = s;
    this.events.onStateChange(s);
  }

  startRace(): void {
    this.buildGrid();
    this.time = 0;
    this.acc = 0;
    this.aiAcc = 0;
    this.countdownT = 3.6;
    this.countdownLast = '';
    this.message = '';
    for (const c of this.cars) {
      c.reset(this.cars.indexOf(c) === 3 ? 3 : this.cars.indexOf(c), 0);
      // slots: player slot 3, AI slots 0..2 in order
    }
    // Fix slots explicitly (build order: AI0,AI1,AI2,player).
    this.cars[0].reset(0, 0);
    this.cars[1].reset(1, 0);
    this.cars[2].reset(2, 0);
    this.cars[3].reset(3, 0);
    this.prevS = this.cars.map((c) => c.s);
    this.cameraRig.snapTo(this.player);
    this.setState('countdown');
    this.audio.engineAudible();
  }

  pause(): void {
    if (this.state === 'racing') {
      this.setState('paused');
      this.audio.engineSilent();
    }
  }

  resume(): void {
    if (this.state === 'paused') {
      this.setState('racing');
      this.audio.engineAudible();
    }
  }

  restart(): void {
    this.startRace();
  }

  quitToMenu(): void {
    this.buildGrid();
    this.setState('menu');
    this.audio.engineSilent();
  }

  resetPlayer(): void {
    const p = this.player;
    const f = this.track.frameAt(p.s);
    p.pos.set(f.pos.x, p.pos.y, f.pos.z);
    p.yaw = Math.atan2(f.tangent.x, f.tangent.z);
    p.vx = 0; p.vz = 0;
    p.yawRate = 0;
    p.hint = -1;
    this.events.onMessage('RESET', 1);
  }

  private crossLine(v: Vehicle, idx: number, now: number): void {
    const d = crossingDelta(this.prevS[idx], v.s, this.track.length, v.speed);
    if (d === 0) return;
    if (d > 0) {
      v.lap++;
      if (v.lap === 1) {
        v.lapStart = now;
      } else {
        // Record every completed lap — including the final one (lap LAPS+1
        // crossing), which the old `lap <= LAPS` guard used to drop.
        const t = now - v.lapStart;
        v.lastLap = t;
        v.lapTimes.push(t);
        if (!v.bestLap || t < v.bestLap) v.bestLap = t;
        v.lapStart = now;
        if (v.isPlayer) {
          this.sessionBest = this.sessionBest === 0 ? t : Math.min(this.sessionBest, t);
          if (!this.persistBest || t < this.persistBest) {
            this.persistBest = t;
            localStorage.setItem('apex-v2-best-lap-v1', String(t));
            this.newBest = true;
            this.events.onMessage(`NEW BEST LAP ${formatTime(t)}`, 2.5);
          } else {
            this.events.onMessage(`LAP ${v.lap - 1} — ${formatTime(t)}`, 2);
          }
          if (v.lap === LAPS) {
            this.events.onMessage('FINAL LAP', 2.5);
            this.finalLapShown = true;
          }
        }
      }
      if (v.lap > LAPS && !v.finished) {
        v.finished = true;
        v.finishTime = now;
        this.finishOrder.push(v);
        if (v.isPlayer) this.finishRace();
      }
    } else if (v.lap > 0) {
      // Reversing back over the line undoes the count (never below 0).
      v.lap = Math.max(0, v.lap - 1);
      v.lapTimes.pop();
    }
  }

  private finishRace(): void {
    // Order: finished by time, then unfinished by progress.
    const sorted = [...this.cars].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.progress - a.progress;
    });
    this.results = sorted.map((v, i) => {
      const gap = i === 0 ? 'WINNER' : v.finished && sorted[0].finished
        ? `+${(v.finishTime - sorted[0].finishTime).toFixed(2)}s`
        : v.finished ? `+${(v.finishTime - sorted[0].finishTime).toFixed(2)}s` : `+${Math.round((sorted[0].progress - v.progress) / 100) / 10}km`;
      return {
        position: i + 1,
        name: v.driverName,
        isPlayer: v.isPlayer,
        totalTime: v.finished ? v.finishTime : 0,
        bestLap: v.bestLap,
        lapTimes: [...v.lapTimes],
        gap,
        topSpeed: v.isPlayer ? this.topSpeed : 0,
      };
    });
    this.player.position = this.results.find((r) => r.isPlayer)?.position ?? 4;
    this.setState('finished');
    this.audio.engineSilent();
    this.events.onFinish(this.results, this.newBest);
  }

  update(frameDt: number): void {
    const buttons = this.input.consume();
    if (buttons.mute) {
      this.settings.muted = !this.settings.muted;
      this.audio.setMuted(this.settings.muted);
      localStorage.setItem('apex-v2-muted', this.settings.muted ? '1' : '0');
    }

    if (this.state === 'menu') {
      // Slow showcase orbit handled by UI camera; keep world alive.
      if (buttons.confirm) {
        this.audio.unlock();
      }
      return;
    }

    if (this.state === 'countdown') {
      this.time += frameDt;
      this.countdownT -= frameDt;
      const label = this.countdownT > 2.6 ? '3' : this.countdownT > 1.6 ? '2' : this.countdownT > 0.6 ? '1' : 'GO!';
      if (label !== this.countdownLast) {
        this.countdownLast = label;
        this.events.onCountdown(label);
        this.audio.countdown(label === 'GO!');
        this.env.setGantryLights(label === 'GO!' ? 5 : label === '1' ? 4 : label === '2' ? 3 : 2);
      }
      if (this.countdownT <= 0) {
        this.setState('racing');
        for (const c of this.cars) c.lapStart = this.time;
        this.env.setGantryLights(0);
      }
      // Hold cars during countdown.
      const zero = createInput();
      for (const c of this.cars) c.update(PHYS_DT, zero);
      this.cameraRig.update(this.player, frameDt);
      return;
    }

    if (buttons.pause && (this.state === 'racing' || this.state === 'paused')) {
      if (this.state === 'racing') this.pause();
      else this.resume();
    }
    if (this.state === 'paused') return;
    if (this.state === 'finished') {
      // Let the player cruise after finishing.
      this.stepPhysics(frameDt, true);
      this.cameraRig.update(this.player, frameDt);
      return;
    }

    // Racing.
    if (buttons.camera) {
      this.cameraRig.cycle();
    }
    if (buttons.reset) this.resetPlayer();

    this.stepPhysics(frameDt, false);
    this.cameraRig.update(this.player, frameDt);

    // Audio + effects hooks.
    const p = this.player;
    this.topSpeed = Math.max(this.topSpeed, p.speedKmh);
    this.audio.updateEngine(p.rpm, p.speedAbs, p.drift, p.nitroActive, frameDt);
    if (p.wallHit > 0.3) {
      this.audio.impact(p.wallHit);
      this.cameraRig.addShake(p.wallHit * 0.5);
      p.wallHit = Math.min(p.wallHit, 0.6); // consume edge so impact isn't machine-gun
    }

    // Wrong-way: velocity opposes track tangent.
    const f = this.track.frameAt(p.s);
    const along = p.vx * f.tangent.x + p.vz * f.tangent.z;
    if (along < -1.5 && p.speedAbs > 3) {
      this.wrongWayT += frameDt;
      if (this.wrongWayT > 0.8) this.wrongWay = true;
    } else {
      this.wrongWayT = 0;
      this.wrongWay = false;
    }

    if (this.messageT > 0) {
      this.messageT -= frameDt;
      if (this.messageT <= 0) this.message = '';
    }
    void this.finalLapShown;
  }

  private stepPhysics(frameDt: number, freeCruise: boolean): void {
    this.acc = Math.min(this.acc + frameDt, 0.1);
    while (this.acc >= PHYS_DT) {
      this.acc -= PHYS_DT;
      this.time += PHYS_DT;

      // AI think at 20 Hz.
      this.aiAcc += PHYS_DT;
      const think = this.aiAcc >= AI_DT;
      if (think) this.aiAcc -= AI_DT;

      const acts = this.input.actions;
      for (let i = 0; i < this.cars.length; i++) {
        const c = this.cars[i];
        if (c.finished && !freeCruise) {
          c.update(PHYS_DT, createInput());
          continue;
        }
        let drive: DriveInput;
        if (c.isPlayer) {
          if (this.debugAutopilot && c.ai) {
            drive = c.ai.think(AI_DT);
          } else {
            drive = {
              throttle: acts.throttle, brake: acts.brake,
              steer: acts.steer * (this.settings.sensitivity || 1),
              handbrake: acts.handbrake, nitro: acts.nitro,
            };
            drive.steer = clamp(drive.steer, -1, 1);
          }
        } else {
          if (think || !c.ai) {
            const inp = c.ai!.think(AI_DT);
            this.aiInputs[i] = inp;
          }
          drive = this.aiInputs[i];
        }
        c.update(PHYS_DT, drive);
        this.crossLine(c, i, this.time);
        this.prevS[i] = c.s;
      }
      // Car-car collisions.
      for (let i = 0; i < this.cars.length; i++) {
        for (let j = i + 1; j < this.cars.length; j++) {
          Vehicle.resolveCollision(this.cars[i], this.cars[j]);
        }
      }
      // Positions.
      const order = [...this.cars].sort((a, b) => {
        if (a.finished && b.finished) return a.finishTime - b.finishTime;
        if (a.finished) return -1;
        if (b.finished) return 1;
        return b.progress - a.progress;
      });
      order.forEach((c, k) => { c.position = k + 1; });
    }
  }

  snapshot(fps: number): HudSnapshot {
    const p = this.player;
    const gear = p.speed < -0.3 ? 'R' : p.speedAbs < 0.5 ? 'N' : p.gear;
    return {
      state: this.state,
      kmh: p.speedKmh,
      gear,
      rpm: p.rpm,
      nitro: p.nitro,
      nitroActive: p.nitroActive,
      lap: clamp(p.lap, 1, LAPS),
      totalLaps: LAPS,
      position: p.position,
      lapTime: this.state === 'racing' ? this.time - p.lapStart : 0,
      lastLap: p.lastLap,
      bestLap: this.persistBest,
      sessionBest: this.sessionBest,
      drifting: p.drifting,
      wrongWay: this.wrongWay,
      offRoad: p.offRoad,
      countdown: this.countdownShown,
      message: this.message,
      fps,
      progress01: p.s / this.track.length,
    };
  }
}
