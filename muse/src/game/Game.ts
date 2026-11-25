import * as THREE from 'three';
import { Engine } from '../core/Engine';
import { Input } from '../core/Input';
import { GameAudio } from '../core/Audio';
import { setupSky, bakeEnvironment } from '../graphics/Sky';
import { PostFX } from '../graphics/PostFX';
import { Track } from '../world/Track';
import { Environment } from '../world/Environment';
import { CarMesh, CAR_SPECS } from '../vehicles/Car';
import { CarPhysics } from '../vehicles/Physics';
import { AIController } from '../vehicles/AI';
import { HUD } from '../game/HUD';
import { Minimap } from '../game/Minimap';

type Phase = 'menu' | 'countdown' | 'racing' | 'finished';

interface Racer {
  mesh: CarMesh;
  phys: CarPhysics;
  ai?: AIController;
  isPlayer: boolean;
  color: string;
  progress: number; // continuous unwrapped distance (phys.distance), for positions
  finishedAt: number;
}

const TOTAL_LAPS = 3;

export class Game {
  private engine: Engine;
  private input = new Input();
  private audio = new GameAudio();
  private hud = new HUD();
  private track = new Track();
  private post!: PostFX;
  private minimap!: Minimap;
  private racers: Racer[] = [];
  private phase: Phase = 'menu';
  private countdownT = 0;
  private raceTime = 0;
  private camMode = 0;
  private chasePos = new THREE.Vector3(0, 4, -10);
  private chaseLook = new THREE.Vector3();
  private selectedCar = 0;
  private hiQuality = true;
  private lastT = performance.now();
  private acc = 0;
  private fpsAcc = 0; private fpsN = 0; private fpsT = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.hud.build();

    const { scene } = this;
    setupSky(scene, this.engine.renderer);
    bakeEnvironment(scene, this.engine.renderer);
    scene.add(this.track.group);
    scene.add(new Environment(this.track).group);

    this.post = new PostFX(this.engine.renderer, scene, this.engine.camera);
    this.minimap = new Minimap(this.track);

    this.buildRacers();
    this.buildMenu();
    this.bindButtons();

    // start camera: cinematic orbit in menu
    this.engine.camera.position.set(60, 30, 60);

    requestAnimationFrame((t) => this.frame(t));
  }

  private get scene() { return this.engine.scene; }

  private buildRacers() {
    for (const r of this.racers) this.scene.remove(r.mesh.group);
    this.racers = [];
    const specs = [CAR_SPECS[this.selectedCar], CAR_SPECS[(this.selectedCar + 1) % 3], CAR_SPECS[(this.selectedCar + 2) % 3], CAR_SPECS[this.selectedCar]];
    const colors = ['#00e5ff', '#ff2d78', '#ffb300', '#9d7bff'];
    for (let i = 0; i < 4; i++) {
      const mesh = new CarMesh(specs[i]);
      const phys = new CarPhysics(this.track, specs[i]);
      // grid: 2 columns staggered behind start line
      const back = 12 + Math.floor(i / 2) * 11;
      const idx = (this.track.centerPoints.length - back) % this.track.centerPoints.length;
      phys.placeAt(idx, i % 2 === 0 ? -3.4 : 3.4);
      phys.trackIndex = idx; phys.initRaceState();
      // face along track
      const f = { pos: new THREE.Vector3(), dir: new THREE.Vector3(), side: new THREE.Vector3() };
      this.track.frameAt(idx, f);
      phys.dir = Math.atan2(f.dir.x, f.dir.z);
      this.scene.add(mesh.group);
      const isPlayer = i === 0;
      this.racers.push({
        mesh, phys, isPlayer, color: colors[i], progress: 0, finishedAt: 0,
        ai: isPlayer ? undefined : new AIController(this.track, 0.55 + i * 0.08),
      });
    }
  }

  private buildMenu() {
    const sel = document.getElementById('car-select')!;
    sel.innerHTML = '';
    CAR_SPECS.forEach((s, i) => {
      const d = document.createElement('div');
      d.className = 'car-chip' + (i === this.selectedCar ? ' active' : '');
      d.innerHTML = `<b style="color:${'#' + s.color.toString(16).padStart(6, '0')}">${s.name}</b><span>TOP ${Math.round(s.topSpeed * 3.6)} km/h • GRIP ${s.grip.toFixed(2)}</span>`;
      d.onclick = () => { this.selectedCar = i; this.audio.init(); this.audio.beep(660, 0.08); this.buildRacers(); this.buildMenu(); };
      sel.appendChild(d);
    });
  }

  private bindButtons() {
    document.getElementById('btn-race')!.onclick = () => this.startRace();
    document.getElementById('btn-again')!.onclick = () => {
      this.hud.hideEnd(); this.buildRacers(); this.startRace();
    };
    document.getElementById('btn-mute')!.onclick = (e) => {
      this.audio.init();
      const m = this.audio.toggleMute();
      (e.target as HTMLElement).textContent = m ? '🔇 MUTED' : '🔊 SOUND';
    };
    document.getElementById('btn-quality')!.onclick = (e) => {
      this.hiQuality = !this.hiQuality;
      (e.target as HTMLElement).textContent = this.hiQuality ? 'QUALITY: ULTRA' : 'QUALITY: PERFORMANCE';
      this.post.bloom.strength = this.hiQuality ? 0.55 : 0.25;
      this.post.enabled = this.hiQuality;
      this.engine.renderer.shadowMap.enabled = this.hiQuality;
    };
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r' && this.phase === 'racing') this.resetPlayer();
      if (e.key.toLowerCase() === 'c') this.camMode = (this.camMode + 1) % 3;
      if (e.key === 'Enter' && this.phase === 'menu') this.startRace();
    });
  }

  private startRace() {
    this.audio.init();
    this.hud.hideMenu(); this.hud.hideEnd(); this.hud.showHUD(true);
    this.phase = 'countdown'; this.countdownT = 0; this.raceTime = 0;
  }

  private resetPlayer() {
    const p = this.racers[0];
    const idx = p.phys.trackIndex;
    p.phys.placeAt(idx, 0);
    const f = { pos: new THREE.Vector3(), dir: new THREE.Vector3(), side: new THREE.Vector3() };
    this.track.frameAt(idx, f);
    p.phys.dir = Math.atan2(f.dir.x, f.dir.z);
  }

  private frame(now: number) {
    requestAnimationFrame((t) => this.frame(t));
    let dt = Math.min(0.05, (now - this.lastT) / 1000);
    this.lastT = now;
    if (dt <= 0) return;

    this.input.update();
    this.engine.adapt(dt, now);

    // fixed-step physics (120Hz) for determinism + perf stability
    if (this.phase === 'racing' || this.phase === 'countdown' || this.phase === 'finished') {
      this.acc = Math.min(0.1, this.acc + dt);
      const h = 1 / 120;
      while (this.acc >= h) { this.step(h); this.acc -= h; }
    }

    this.syncMeshes(dt);
    this.updateCamera(dt);
    this.updateHUD(dt, now);

    const player = this.racers[0]?.phys;
    const speed01 = player ? Math.min(1, player.speedKmh / 300) : 0;
    if (this.hiQuality && this.post.enabled) this.post.render(dt, speed01, !!player?.nitroActive);
    else this.engine.renderer.render(this.scene, this.engine.camera);
  }

  private step(h: number) {
    if (this.phase === 'countdown') {
      this.countdownT += h;
      const seq = ['3', '2', '1', 'GO!'];
      const idx = Math.floor(this.countdownT / 1.0);
      const prev = (this as unknown as { _cd?: number })._cd;
      if (idx !== prev && idx < 4) {
        (this as unknown as { _cd?: number })._cd = idx;
        this.hud.message(seq[idx]);
        this.audio.beep(idx < 3 ? 440 : 880, idx < 3 ? 0.15 : 0.5, 'square', 0.22);
      }
      if (this.countdownT >= 4) { this.phase = 'racing'; this.raceTime = 0; }
      // hold cars still during countdown
      return;
    }
    if (this.phase === 'racing') this.raceTime += h;

    const t = this.raceTime;
    for (const r of this.racers) {
      if (r.isPlayer) {
        const locked = this.phase !== 'racing';
        r.phys.update(h, locked ? 0 : this.input.steer, locked ? 0 : this.input.throttle, locked ? 0 : Math.max(this.input.brake, this.input.handbrake ? 1 : 0), this.input.nitro && this.phase === 'racing', true);
      } else {
        r.ai!.update(h, t, r.phys, this.racers[0].phys.distance);
        const hold = this.phase !== 'racing';
        r.phys.update(h, hold ? 0 : r.ai!.steer, hold ? 0 : r.ai!.throttle, hold ? 0 : r.ai!.brake, r.ai!.nitro && !hold, false);
      }
      // continuous unwrapped progress — immune to start-line index wrapping
      r.progress = r.phys.distance;
    }

    // finish detection
    const player = this.racers[0];
    if (this.phase === 'racing' && player.phys.lapsDone >= TOTAL_LAPS) {
      this.phase = 'finished';
      const order = [...this.racers].sort((a, b) => b.progress - a.progress);
      const pos = order.indexOf(player) + 1;
      const words = pos === 1 ? 'P1 — VICTORY' : pos === 2 ? 'P2 — PODIUM' : pos === 3 ? 'P3 — PODIUM' : `P${pos} — FINISH`;
      this.hud.showEnd(words, `TIME ${this.fmtTime(this.raceTime)} • TOP ${Math.round(this.peakSpeed)} KM/H`);
      this.hud.message(pos === 1 ? '🏆 VICTORY!' : `P${pos} FINISH`);
      this.audio.beep(880, 0.4, 'sine', 0.25);
    }

    // audio
    const rpm = player.phys.rpm01;
    this.audio.setEngine(rpm, this.input.throttle, this.phase === 'racing');
    this.audio.setSkid(player.phys.drift * Math.min(1, player.phys.speedKmh / 120));
    this.audio.setNitro(player.phys.nitroActive);
  }

  private peakSpeed = 0;
  private fmtTime(s: number) {
    const m = Math.floor(s / 60); return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0')}`;
  }

  private syncMeshes(dt: number) {
    for (const r of this.racers) {
      r.mesh.group.position.copy(r.phys.pos);
      r.mesh.group.rotation.y = r.phys.dir;
      r.mesh.updateVisual(r.phys.speed, r.isPlayer ? this.input.steer : r.ai!.steer, r.isPlayer ? this.input.brake > 0 : r.ai!.brake > 0, dt);
    }
    const p = this.racers[0]?.phys;
    if (p) this.peakSpeed = Math.max(this.peakSpeed, p.speedKmh);
    void dt;
  }

  private updateCamera(dt: number) {
    const player = this.racers[0];
    if (!player) return;
    const cam = this.engine.camera;
    if (this.phase === 'menu') {
      // cinematic orbit around start gantry
      const t = performance.now() / 1000 * 0.12;
      const c = this.track.centerPoints[0];
      cam.position.set(c.x + Math.cos(t) * 55, 22, c.z + Math.sin(t) * 55);
      cam.lookAt(c.x, 4, c.z);
      this.chasePos.copy(cam.position);
      return;
    }
    const fwd = new THREE.Vector3(Math.sin(player.phys.dir), 0, Math.cos(player.phys.dir));
    const speed01 = Math.min(1, player.phys.speedKmh / 280);
    if (this.camMode === 0) {
      // chase: FOV kicks with speed/nitro
      const back = 8.2 + speed01 * 1.6, up = 3.1 + speed01 * 0.5;
      const want = player.phys.pos.clone().addScaledVector(fwd, -back); want.y += up;
      // keep camera above track surface
      const qi = this.track.nearestIndex(want, player.phys.trackIndex, 20);
      want.y = Math.max(want.y, this.track.centerPoints[qi.index].y + 1.6);
      this.chasePos.lerp(want, 1 - Math.pow(0.0001, dt));
      cam.position.copy(this.chasePos);
      const look = player.phys.pos.clone().addScaledVector(fwd, 9); look.y += 1.2;
      this.chaseLook.lerp(look, 1 - Math.pow(0.00001, dt));
      cam.lookAt(this.chaseLook);
      const targetFov = 68 + speed01 * 14 + (player.phys.nitroActive ? 8 : 0);
      cam.fov += (targetFov - cam.fov) * Math.min(1, dt * 5);
      cam.updateProjectionMatrix();
      // shadow frustum follows player
      const sun = this.scene.children.find((o) => o instanceof THREE.DirectionalLight) as THREE.DirectionalLight | undefined;
      if (sun) { sun.position.copy(player.phys.pos).add(new THREE.Vector3(120, 180, 60)); sun.target.position.copy(player.phys.pos); sun.target.updateMatrixWorld(); }
    } else if (this.camMode === 1) {
      // hood
      const want = player.phys.pos.clone().addScaledVector(fwd, 0.4); want.y += 1.35;
      cam.position.copy(want);
      cam.lookAt(player.phys.pos.clone().addScaledVector(fwd, 40));
      if (Math.abs(cam.fov - 74) > 0.1) { cam.fov = 74; cam.updateProjectionMatrix(); }
    } else {
      // cinematic far chase
      const want = player.phys.pos.clone().addScaledVector(fwd, -14); want.y += 6;
      this.chasePos.lerp(want, 1 - Math.pow(0.001, dt));
      cam.position.copy(this.chasePos);
      cam.lookAt(player.phys.pos);
      if (Math.abs(cam.fov - 60) > 0.1) { cam.fov = 60; cam.updateProjectionMatrix(); }
    }
  }

  private updateHUD(_dt: number, now: number) {
    // fps meter
    this.fpsAcc += 1; this.fpsN++;
    if (now - this.fpsT > 500) {
      const fps = 1000 / ((now - this.fpsT) / Math.max(1, this.fpsN));
      this.hud.setFps(Math.min(120, fps));
      this.fpsT = now; this.fpsN = 0; void this.fpsAcc;
    }
    if (this.phase !== 'racing' && this.phase !== 'finished' && this.phase !== 'countdown') return;
    const player = this.racers[0].phys;
    const order = [...this.racers].sort((a, b) => b.progress - a.progress);
    const pos = order.indexOf(this.racers[0]) + 1;
    this.hud.setLap(Math.min(TOTAL_LAPS, player.lapsDone + 1), TOTAL_LAPS);
    this.hud.setPos(pos, this.racers.length);
    this.hud.setTime(this.raceTime);
    this.hud.setSpeed(player.speedKmh, player.nitro / 100, player.nitroActive, player.drift > 0.4 && player.speedKmh > 60, player.wrongWay);
    this.minimap.draw(this.racers.map((r) => ({ x: r.phys.pos.x, z: r.phys.pos.z, color: r.color, player: r.isPlayer })));
  }
}
