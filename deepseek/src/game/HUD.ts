import { clamp, formatTime } from '../core/Math';
import { Track } from '../world/Track';

export interface HudCar {
  x: number;
  z: number;
  yaw: number;
  isPlayer: boolean;
  color: number;
}

export interface HudState {
  speedKmh: number;
  gear: number;
  reverse: boolean;
  nitro: number;
  lap: number;
  totalLaps: number;
  position: number;
  totalCars: number;
  lapTime: number;
  bestLap: number;
  drift: number;
  wrongWay: boolean;
  cars: HudCar[];
}

const MAX_SPEED = 340;
const START_ANGLE = 135;
const SWEEP = 270;

export class HUD {
  private root = document.getElementById('hud') as HTMLElement;
  private speedEl = document.getElementById('hud-speed') as HTMLElement;
  private gearEl = document.getElementById('hud-gear') as HTMLElement;
  private nitroEl = document.getElementById('hud-nitro') as HTMLElement;
  private lapEl = document.getElementById('hud-lap') as HTMLElement;
  private posEl = document.getElementById('hud-pos') as HTMLElement;
  private posTotalEl = document.getElementById('hud-pos-total') as HTMLElement;
  private timeEl = document.getElementById('hud-time') as HTMLElement;
  private bestEl = document.getElementById('hud-best') as HTMLElement;
  private carEl = document.getElementById('hud-car') as HTMLElement;
  private driftEl = document.getElementById('hud-drift') as HTMLElement;
  private driftWrap = document.getElementById('hud-drift-wrap') as HTMLElement;
  private wrongEl = document.getElementById('wrongway') as HTMLElement;
  private countdownEl = document.getElementById('countdown') as HTMLElement;
  private messageEl = document.getElementById('hud-message') as HTMLElement;
  private fpsEl = document.getElementById('hud-fps') as HTMLElement;
  private needle!: SVGGElement;
  private arc!: SVGPathElement;
  private arcLength = 0;
  private minimap: HTMLCanvasElement;
  private mapCtx: CanvasRenderingContext2D;
  private mapCache: HTMLCanvasElement;
  private mapScale = 1;
  private mapCx = 0;
  private mapCy = 0;
  private mapW = 210;
  private mapH = 150;
  private last = {
    speed: -1,
    gear: '',
    lap: '',
    pos: -1,
    time: '',
    best: '',
    nitro: -1,
    drift: -1,
    fps: -1,
  };
  private messageTimer = 0;
  private mapAccum = 0;
  private track: Track;

  constructor(track: Track) {
    this.track = track;
    this.buildGauge();

    this.minimap = document.getElementById('minimap') as HTMLCanvasElement;
    const ctx = this.minimap.getContext('2d');
    if (!ctx) throw new Error('minimap ctx');
    this.mapCtx = ctx;
    this.mapCache = document.createElement('canvas');
    this.resizeMinimap();
    window.addEventListener('resize', () => this.resizeMinimap());
    this.showCountdown('');
  }

  private buildGauge(): void {
    const svg = document.getElementById('speedo') as unknown as SVGSVGElement;
    const ticks = svg.querySelector('#gauge-ticks') as SVGGElement;
    const NS = 'http://www.w3.org/2000/svg';
    const cx = 140;
    const cy = 140;
    const polar = (deg: number, r: number): [number, number] => {
      const rad = (deg * Math.PI) / 180;
      return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
    };
    for (let i = 0; i <= 17; i++) {
      const ratio = i / 17;
      const deg = START_ANGLE + ratio * SWEEP;
      const major = i % 2 === 0;
      const [x1, y1] = polar(deg, major ? 104 : 108);
      const [x2, y2] = polar(deg, 116);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', x1.toFixed(1));
      line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1));
      line.setAttribute('y2', y2.toFixed(1));
      line.setAttribute('stroke', major ? 'rgba(235,245,255,0.82)' : 'rgba(160,185,215,0.35)');
      line.setAttribute('stroke-width', major ? '2.2' : '1');
      ticks.appendChild(line);
      if (i % 2 === 0) {
        const value = Math.round((i / 17) * MAX_SPEED);
        if (value % 40 === 0) {
          const [tx, ty] = polar(deg, 84);
          const text = document.createElementNS(NS, 'text');
          text.setAttribute('x', tx.toFixed(1));
          text.setAttribute('y', (ty + 3).toFixed(1));
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', 'rgba(190,205,225,0.55)');
          text.setAttribute('font-size', '10');
          text.setAttribute('font-family', 'Helvetica Neue, Arial, sans-serif');
          text.setAttribute('font-weight', '600');
          text.textContent = String(value);
          ticks.appendChild(text);
        }
      }
    }
    this.needle = svg.querySelector('#gauge-needle') as SVGGElement;
    this.arc = svg.querySelector('#gauge-arc') as SVGPathElement;
    try {
      this.arcLength = this.arc.getTotalLength();
    } catch {
      this.arcLength = 500;
    }
    this.arc.style.strokeDasharray = `${this.arcLength}`;
    this.arc.style.strokeDashoffset = `${this.arcLength}`;
  }

  private resizeMinimap(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = this.minimap.clientWidth || 210;
    const cssH = this.minimap.clientHeight || 150;
    this.mapW = cssW;
    this.mapH = cssH;
    this.minimap.width = Math.round(cssW * dpr);
    this.minimap.height = Math.round(cssH * dpr);
    this.mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.mapCache.width = this.minimap.width;
    this.mapCache.height = this.minimap.height;
    this.buildMinimapCache(dpr);
  }

  private buildMinimapCache(dpr: number): void {
    const cache = this.mapCache.getContext('2d');
    if (!cache) return;
    cache.setTransform(dpr, 0, 0, dpr, 0, 0);
    cache.clearRect(0, 0, this.mapW, this.mapH);
    const b = this.track.minimapBounds;
    const pad = 16;
    const bw = b.max.x - b.min.x;
    const bh = b.max.y - b.min.y;
    const scale = Math.min((this.mapW - pad * 2) / bw, (this.mapH - pad * 2) / bh);
    this.mapScale = scale;
    this.mapCx = this.mapW / 2 - ((b.min.x + b.max.x) / 2) * scale;
    this.mapCy = this.mapH / 2 - ((b.min.y + b.max.y) / 2) * scale;

    cache.lineJoin = 'round';
    cache.lineCap = 'round';
    cache.beginPath();
    this.track.minimapPoints.forEach((p, i) => {
      const x = p.x * scale + this.mapCx;
      const y = p.y * scale + this.mapCy;
      if (i === 0) cache.moveTo(x, y);
      else cache.lineTo(x, y);
    });
    cache.closePath();
    cache.strokeStyle = 'rgba(10,14,22,0.9)';
    cache.lineWidth = 7;
    cache.stroke();
    cache.strokeStyle = 'rgba(120,225,255,0.5)';
    cache.lineWidth = 1.6;
    cache.stroke();

    // Start / finish tick.
    const start = this.track.minimapPoints[0];
    const sx = start.x * scale + this.mapCx;
    const sy = start.y * scale + this.mapCy;
    cache.strokeStyle = '#f4f7ff';
    cache.lineWidth = 2;
    cache.beginPath();
    cache.moveTo(sx - 4, sy - 4);
    cache.lineTo(sx + 4, sy + 4);
    cache.stroke();
  }

  setVisible(visible: boolean): void {
    this.root.classList.toggle('visible', visible);
  }

  setCarName(name: string): void {
    this.carEl.textContent = name;
  }

  update(dt: number, state: HudState): void {
    const speed = Math.round(state.speedKmh);
    if (speed !== this.last.speed) {
      this.speedEl.textContent = String(speed);
      this.last.speed = speed;
    }
    const ratio = clamp(state.speedKmh / MAX_SPEED, 0, 1);
    this.needle.setAttribute('transform', `rotate(${(START_ANGLE + ratio * SWEEP).toFixed(2)} 140 140)`);
    this.arc.style.strokeDashoffset = `${this.arcLength * (1 - ratio)}`;

    const gearLabel = state.reverse ? 'R' : String(state.gear);
    if (gearLabel !== this.last.gear) {
      this.gearEl.textContent = gearLabel;
      this.last.gear = gearLabel;
    }
    const lapText = `${Math.min(state.lap, state.totalLaps)}/${state.totalLaps}`;
    if (lapText !== this.last.lap) {
      this.lapEl.textContent = lapText;
      this.last.lap = lapText;
    }
    if (state.position !== this.last.pos) {
      this.posEl.textContent = String(state.position);
      this.posTotalEl.textContent = `/${state.totalCars}`;
      this.last.pos = state.position;
    }
    const timeText = formatTime(state.lapTime);
    if (timeText !== this.last.time) {
      this.timeEl.textContent = timeText;
      this.last.time = timeText;
    }
    const bestText = formatTime(state.bestLap);
    if (bestText !== this.last.best) {
      this.bestEl.textContent = bestText;
      this.last.best = bestText;
    }
    if (Math.abs(state.nitro - this.last.nitro) > 0.004) {
      this.nitroEl.style.transform = `scaleX(${clamp(state.nitro, 0, 1)})`;
      this.last.nitro = state.nitro;
    }
    const drift = Math.round(state.drift * 100) / 100;
    if (Math.abs(drift - this.last.drift) > 0.02) {
      this.driftEl.style.transform = `scaleX(${clamp(drift, 0, 1)})`;
      this.driftWrap.classList.toggle('active', drift > 0.15);
      this.last.drift = drift;
    }
    this.wrongEl.classList.toggle('visible', state.wrongWay);

    this.mapAccum += dt;
    if (this.mapAccum > 0.06) {
      this.mapAccum = 0;
      this.drawMinimap(state.cars);
    }
  }

  private drawMinimap(cars: HudCar[]): void {
    const ctx = this.mapCtx;
    ctx.clearRect(0, 0, this.mapW, this.mapH);
    ctx.drawImage(
      this.mapCache,
      0,
      0,
      this.mapCache.width,
      this.mapCache.height,
      0,
      0,
      this.mapW,
      this.mapH,
    );
    for (const car of cars) {
      const x = car.x * this.mapScale + this.mapCx;
      const y = car.z * this.mapScale + this.mapCy;
      if (car.isPlayer) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-car.yaw + Math.PI);
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(3.4, 4);
        ctx.lineTo(-3.4, 4);
        ctx.closePath();
        ctx.fillStyle = '#f6fbff';
        ctx.shadowColor = '#49e8ff';
        ctx.shadowBlur = 7;
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `#${car.color.toString(16).padStart(6, '0')}`;
        ctx.fill();
      }
    }
  }

  showMessage(text: string, tone: 'cyan' | 'pink' | 'amber' = 'cyan', duration = 2.2): void {
    this.messageEl.textContent = text;
    this.messageEl.className = `message show ${tone}`;
    window.clearTimeout(this.messageTimer);
    this.messageTimer = window.setTimeout(() => {
      this.messageEl.classList.remove('show');
    }, duration * 1000);
  }

  showCountdown(text: string): void {
    if (!text) {
      this.countdownEl.classList.remove('show');
      this.countdownEl.textContent = '';
      return;
    }
    this.countdownEl.textContent = text;
    this.countdownEl.classList.remove('show');
    void this.countdownEl.offsetWidth;
    this.countdownEl.classList.add('show');
    if (text === 'GO') this.countdownEl.classList.add('go');
    else this.countdownEl.classList.remove('go');
  }

  setFps(fps: number): void {
    const v = Math.round(fps);
    if (v !== this.last.fps) {
      this.fpsEl.textContent = String(v);
      this.last.fps = v;
    }
  }

  setDriftActive(active: boolean): void {
    this.driftWrap.classList.toggle('active', active);
  }
}
