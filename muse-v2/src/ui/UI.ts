import { Race, RaceSettings, RaceResult, HudSnapshot } from '../game/Race';
import { Input } from '../core/Input';
import { AudioSystem } from '../core/Audio';
import { Engine } from '../game/Engine';
import { Track } from '../world/Track';
import { CAR_SPECS, PAINTS } from '../vehicle/CarModel';
import { formatTime } from '../core/Math';

const CONFIG_KEY = 'apex-v2-config-v1';
const BEST_KEY = 'apex-v2-best-lap-v1';
const MUTE_KEY = 'apex-v2-muted';

export function loadSettings(): RaceSettings {
  const fallback: RaceSettings = {
    carId: 'volt', paint: PAINTS[0], quality: 'ultra', muted: false, sensitivity: 0.72,
  };
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return { ...fallback, ...JSON.parse(raw) };
  } catch { /* defaults */ }
  try {
    if (localStorage.getItem(MUTE_KEY) === '1') fallback.muted = true;
  } catch { /* ignore */ }
  return fallback;
}

export function saveSettings(s: RaceSettings): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({
      carId: s.carId, paint: s.paint, quality: s.quality, sensitivity: s.sensitivity,
    }));
    localStorage.setItem(MUTE_KEY, s.muted ? '1' : '0');
  } catch { /* storage unavailable */ }
}

function el<T extends HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`missing #${id}`);
  return e as T;
}

export class UI {
  private race!: Race;
  private minimap: HTMLCanvasElement;
  private mm: CanvasRenderingContext2D;
  private countdownEl = el('countdown');
  private flashEl = el('flash');
  private flashT = 0;
  private countdownT = 0;

  constructor(
    private settings: RaceSettings,
    private input: Input,
    private audio: AudioSystem,
    private engine: Engine,
    private track: Track,
  ) {
    this.minimap = el<HTMLCanvasElement>('minimap');
    this.mm = this.minimap.getContext('2d')!;
    this.buildMenu();
    this.bindButtons();
    this.bindTouch();
    this.refreshBest();
  }

  attach(race: Race): void {
    this.race = race;
  }

  private buildMenu(): void {
    const carRow = el('car-select');
    carRow.innerHTML = '';
    for (const spec of CAR_SPECS) {
      const b = document.createElement('button');
      b.className = 'car-chip' + (spec.id === this.settings.carId ? ' active' : '');
      b.innerHTML = `${spec.name}<small>${Math.round(spec.topSpeed * 3.6)} km/h</small>`;
      b.onclick = () => {
        this.settings.carId = spec.id;
        saveSettings(this.settings);
        this.buildMenu();
      };
      carRow.appendChild(b);
    }
    const spec = CAR_SPECS.find((s) => s.id === this.settings.carId) ?? CAR_SPECS[0];
    el('car-stats').textContent =
      `TOP ${Math.round(spec.topSpeed * 3.6)} km/h · ACCEL ${spec.accel} · GRIP ${spec.grip.toFixed(2)} · N₂O ×${spec.nitro.toFixed(2)}`;

    const paints = el('paint-row');
    paints.innerHTML = '';
    for (const p of PAINTS) {
      const b = document.createElement('button');
      b.style.background = `#${p.toString(16).padStart(6, '0')}`;
      if (p === this.settings.paint) b.classList.add('active');
      b.setAttribute('aria-label', `paint ${p.toString(16)}`);
      b.onclick = () => {
        this.settings.paint = p;
        saveSettings(this.settings);
        this.buildMenu();
      };
      paints.appendChild(b);
    }

    const q = el<HTMLSelectElement>('quality');
    q.value = this.settings.quality;
    q.onchange = () => {
      this.settings.quality = q.value as RaceSettings['quality'];
      this.engine.setQuality(this.settings.quality);
      saveSettings(this.settings);
    };
    const sens = el<HTMLInputElement>('sensitivity');
    sens.value = String(this.settings.sensitivity);
    sens.oninput = () => {
      this.settings.sensitivity = Number(sens.value);
      saveSettings(this.settings);
    };
    this.refreshMute();
  }

  private refreshMute(): void {
    el('mute-btn').textContent = this.settings.muted ? 'OFF' : 'ON';
  }

  private refreshBest(): void {
    const best = Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
    el('menu-best').textContent = best ? `CLUB BEST LAP — ${formatTime(best)}` : 'NO LAP RECORDED YET — SET THE PACE';
  }

  private bindButtons(): void {
    el('start-btn').onclick = () => this.startFromMenu();
    el('mute-btn').onclick = () => {
      this.settings.muted = !this.settings.muted;
      this.audio.unlock();
      this.audio.setMuted(this.settings.muted);
      saveSettings(this.settings);
      this.refreshMute();
    };
    el('resume-btn').onclick = () => this.race.resume();
    el('restart-btn').onclick = () => this.race.restart();
    el('quit-btn').onclick = () => this.race.quitToMenu();
    el('again-btn').onclick = () => this.race.restart();
    el('menu-btn').onclick = () => this.race.quitToMenu();
    document.addEventListener('pointerdown', () => this.audio.unlock(), { once: true });
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' && this.race.state === 'menu') this.startFromMenu();
    });
  }

  private startFromMenu(): void {
    this.audio.unlock();
    this.audio.setMuted(this.settings.muted);
    saveSettings(this.settings);
    this.race.rebuildGrid();
    this.race.startRace();
  }

  private bindTouch(): void {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const bind = (id: string, down: () => void, up: () => void): void => {
      const b = el(id);
      const on = (e: Event) => { e.preventDefault(); this.input.usingTouch = true; b.classList.add('on'); down(); };
      const off = (e: Event) => { e.preventDefault(); b.classList.remove('on'); up(); };
      b.addEventListener('pointerdown', on);
      b.addEventListener('pointerup', off);
      b.addEventListener('pointercancel', off);
      b.addEventListener('pointerleave', off);
    };
    bind('t-gas', () => { this.input.touch.gas = true; }, () => { this.input.touch.gas = false; });
    bind('t-brake', () => { this.input.touch.brake = true; }, () => { this.input.touch.brake = false; });
    bind('t-left', () => { this.input.touch.left = true; }, () => { this.input.touch.left = false; });
    bind('t-right', () => { this.input.touch.right = true; }, () => { this.input.touch.right = false; });
    bind('t-nitro', () => { this.input.touch.nitro = true; }, () => { this.input.touch.nitro = false; });
    bind('t-drift', () => { this.input.touch.drift = true; }, () => { this.input.touch.drift = false; });
    void coarse;
  }

  onCountdown(label: string): void {
    this.countdownEl.textContent = label;
    this.countdownEl.classList.remove('hidden');
    this.countdownT = label === 'GO!' ? 0.7 : 0.95;
  }

  onMessage(text: string, dur: number): void {
    this.flashEl.textContent = text;
    this.flashEl.classList.remove('hidden');
    this.flashT = dur;
  }

  onFinish(results: RaceResult[], newBest: boolean): void {
    const me = results.find((r) => r.isPlayer)!;
    el('results-head').textContent = `P${me.position} — ${me.position === 1 ? 'VICTORY' : me.position === 2 ? 'P2 FINISH' : me.position === 3 ? 'P3 FINISH' : 'P4 FINISH'}`;
    el('results-sub').textContent =
      `${newBest ? '★ NEW CLUB BEST ' : ''}${me.bestLap ? formatTime(me.bestLap) : ''} · TOP ${Math.round(me.topSpeed)} km/h`;
    const table = el('results-table');
    table.innerHTML = '';
    for (const r of results) {
      const row = document.createElement('div');
      row.className = 'row' + (r.isPlayer ? ' me' : '');
      const t = r.isPlayer || r.totalTime ? formatTime(r.totalTime || me.totalTime) : '—';
      row.innerHTML = `<span>P${r.position}</span><span>${r.name}</span><span class="t">${r.position === 1 ? t : r.gap}</span>`;
      table.appendChild(row);
    }
    this.refreshBest();
  }

  onStateChange(s: string): void {
    el('menu').classList.toggle('visible', s === 'menu');
    el('hud').classList.toggle('hidden', s === 'menu');
    el('pause').classList.toggle('visible', s === 'paused');
    el('pause').classList.toggle('hidden', s !== 'paused');
    el('results').classList.toggle('visible', s === 'finished');
    el('results').classList.toggle('hidden', s !== 'finished');
    el('touch').classList.toggle('hidden', !(s === 'racing' && window.matchMedia('(pointer: coarse)').matches));
    if (s === 'menu') {
      this.countdownEl.classList.add('hidden');
      this.refreshBest();
    }
  }

  updateHUD(s: HudSnapshot, race: Race): void {
    el('hud-pos').textContent = `P${s.position}`;
    el('hud-lap').textContent = `LAP ${s.lap}/${s.totalLaps}`;
    el('hud-time').textContent = formatTime(s.lapTime);
    el('hud-last').textContent = race.player.lastLap ? `LAST ${formatTime(race.player.lastLap)}` : '';
    el('hud-best').textContent = s.bestLap ? `BEST ${formatTime(s.bestLap)}` : '';
    el('speed-num').textContent = String(Math.round(s.kmh));
    el('gear').textContent = String(s.gear);
    const bar = el('nitro-bar');
    bar.style.width = `${Math.round(s.nitro * 100)}%`;
    bar.style.opacity = s.nitroActive ? '1' : '0.55';
    el('drift-flag').classList.toggle('hidden', !s.drifting);
    el('wrongway-flag').classList.toggle('hidden', !s.wrongWay);
    el('offroad-flag').classList.toggle('hidden', !s.offRoad);
    el('fps').textContent = `${Math.round(s.fps)} FPS`;

    if (this.countdownT > 0) {
      this.countdownT -= 1 / 60;
      if (this.countdownT <= 0) this.countdownEl.classList.add('hidden');
    }
    if (this.flashT > 0) {
      this.flashT -= 1 / 60;
      if (this.flashT <= 0) this.flashEl.classList.add('hidden');
    }
    this.drawMinimap(race);
  }

  private drawMinimap(race: Race): void {
    const g = this.mm;
    const W = this.minimap.width;
    const H = this.minimap.height;
    g.clearRect(0, 0, W, H);
    const b = this.track.minimapBounds;
    const bw = Math.max(1, b.max.x - b.min.x);
    const bh = Math.max(1, b.max.y - b.min.y);
    const pad = 12;
    const sc = Math.min((W - pad * 2) / bw, (H - pad * 2) / bh);
    const ox = pad + (W - pad * 2 - bw * sc) / 2;
    const oy = pad + (H - pad * 2 - bh * sc) / 2;
    const px = (x: number): number => ox + (x - b.min.x) * sc;
    const py = (z: number): number => oy + (z - b.min.y) * sc;

    g.lineWidth = 5;
    g.strokeStyle = 'rgba(220,228,240,0.85)';
    g.lineJoin = 'round';
    g.beginPath();
    const pts = this.track.minimapPoints;
    pts.forEach((p, i) => {
      if (i === 0) g.moveTo(px(p.x), py(p.y));
      else g.lineTo(px(p.x), py(p.y));
    });
    g.closePath();
    g.stroke();

    for (const c of race.cars) {
      g.fillStyle = c.isPlayer ? '#c8ff2e' : '#ff5a5a';
      g.beginPath();
      g.arc(px(c.pos.x), py(c.pos.z), c.isPlayer ? 4.5 : 3.2, 0, Math.PI * 2);
      g.fill();
    }
  }
}
