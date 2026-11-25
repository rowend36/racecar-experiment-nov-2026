import type { Vehicle } from '../vehicle/Vehicle';
import type { Track } from '../world/Track';
import { clamp, formatTime } from '../core/Math';

export interface HudState {
  time: number;
  fps: number;
  weather: string;
  countdown: string;
  message: string;
  warn: string;
}

const el = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing UI element #${id}`);
  return node as T;
};

export class HUD {
  private root = el('hud');
  private pos = el('hud-pos');
  private lap = el('hud-lap');
  private time = el('hud-time');
  private best = el('hud-best');
  private last = el('hud-last');
  private speed = el('hud-speed');
  private gear = el('hud-gear');
  private needle = document.getElementById('needle') as unknown as SVGLineElement;
  private nitro = el('nitro-bar');
  private drift = el('drift-bar');
  private fps = el('hud-fps');
  private weather = el('hud-weather');
  private countdown = el('countdown');
  private message = el('center-msg');
  private warnEl = el('warn');
  private minimap = el<HTMLCanvasElement>('minimap');
  private mapCtx = this.minimap.getContext('2d')!;
  private mapPath: Array<[number, number]> = [];
  private mapBounds = { minX: 0, minY: 0, scale: 1 };
  private msgTimer = 0;
  private lastCountdown = '';

  constructor(track: Track) {
    this.buildTicks();
    this.buildMap(track);
  }

  show(): void { this.root.classList.remove('hidden'); }
  hide(): void { this.root.classList.add('hidden'); }

  private buildTicks(): void {
    const group = document.getElementById('ticks');
    if (!group) return;
    let html = '';
    for (let i = 0; i <= 24; i += 1) {
      const angle = (i / 24) * 270;
      const major = i % 4 === 0;
      const r1 = major ? 72 : 80;
      const rad = angle * Math.PI / 180;
      html += `<line x1="${120 + Math.cos(rad) * r1}" y1="${120 + Math.sin(rad) * r1}" x2="${120 + Math.cos(rad) * 92}" y2="${120 + Math.sin(rad) * 92}" class="${major ? 'major' : ''}" />`;
    }
    group.innerHTML = html;
  }

  private buildMap(track: Track): void {
    let minX = Infinity; let maxX = -Infinity; let minZ = Infinity; let maxZ = -Infinity;
    for (const s of track.samples) {
      minX = Math.min(minX, s.position.x); maxX = Math.max(maxX, s.position.x);
      minZ = Math.min(minZ, s.position.z); maxZ = Math.max(maxZ, s.position.z);
    }
    const pad = 20;
    const size = this.minimap.width;
    const span = Math.max(maxX - minX, maxZ - minZ);
    const scale = (size - pad * 2) / span;
    const cx = (minX + maxX) * 0.5;
    const cz = (minZ + maxZ) * 0.5;
    this.mapBounds = { minX: cx, minY: cz, scale };
    this.mapPath = track.samples.map((s) => [
      size / 2 + (s.position.x - cx) * scale,
      size / 2 - (s.position.z - cz) * scale,
    ]);
  }

  update(dt: number, player: Vehicle, cars: Vehicle[], state: HudState): void {
    const kmh = Math.round(player.speedKmh);
    this.speed.textContent = String(kmh);
    this.gear.textContent = player.gear === 0 ? 'R' : String(player.gear);
    const ratio = clamp(kmh / 350, 0, 1);
    this.needle.style.transform = `rotate(${90 + ratio * 270}deg)`;
    this.nitro.style.width = `${(player.nitro * 100).toFixed(1)}%`;
    this.drift.style.width = `${(player.drift * 100).toFixed(1)}%`;

    const ordinal = (n: number): string => n === 1 ? 'ST' : n === 2 ? 'ND' : n === 3 ? 'RD' : 'TH';
    this.pos.innerHTML = `${player.position}<sup>${ordinal(player.position)}</sup>`;
    this.lap.innerHTML = `${player.displayLap}<sup>/3</sup>`;
    this.time.textContent = formatTime(state.time);
    this.best.textContent = formatTime(player.bestLap);
    this.last.textContent = formatTime(player.lastLap);
    this.fps.textContent = `${Math.round(state.fps)} FPS`;
    this.weather.textContent = state.weather.toUpperCase();

    if (state.countdown !== this.lastCountdown) {
      this.lastCountdown = state.countdown;
      if (state.countdown) {
        this.countdown.textContent = state.countdown;
        this.countdown.classList.remove('pop');
        void this.countdown.offsetWidth;
        this.countdown.classList.add('pop');
      }
    }
    if (state.message) {
      this.message.textContent = state.message;
      this.message.classList.add('show');
      this.msgTimer = 1.9;
    } else if (this.msgTimer > 0) {
      this.msgTimer -= dt;
      if (this.msgTimer <= 0) this.message.classList.remove('show');
    }
    if (state.warn) {
      this.warnEl.textContent = state.warn;
      this.warnEl.classList.add('show');
    } else this.warnEl.classList.remove('show');

    this.drawMap(player, cars);
  }

  private drawMap(player: Vehicle, cars: Vehicle[]): void {
    const ctx = this.mapCtx;
    const size = this.minimap.width;
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    for (let i = 0; i < this.mapPath.length; i += 1) {
      const p = this.mapPath[i];
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(150,180,220,0.35)';
    ctx.lineWidth = Math.max(4, size * 0.045);
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    const plot = (v: Vehicle): [number, number] => [
      size / 2 + (v.pos.x - this.mapBounds.minX) * this.mapBounds.scale,
      size / 2 - (v.pos.z - this.mapBounds.minY) * this.mapBounds.scale,
    ];
    for (const car of cars) {
      if (car === player) continue;
      const [x, y] = plot(car);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#9fb0c8';
      ctx.fill();
    }
    const [px, py] = plot(player);
    ctx.beginPath();
    ctx.arc(px, py, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff2f5e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  reset(): void {
    this.msgTimer = 0;
    this.lastCountdown = '';
    this.message.classList.remove('show');
    this.warnEl.classList.remove('show');
    this.countdown.classList.remove('pop');
  }
}
