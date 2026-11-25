import { CARS, PAINTS } from '../vehicle/CarModel';
import { Quality } from '../core/Engine';
import { formatTime } from '../core/Math';

export interface GameConfig {
  carId: string;
  color: number;
  accent: number;
  weather: 'sunset' | 'storm';
  quality: Quality;
}

export interface ResultsRow {
  position: number;
  driver: string;
  car: string;
  timeText: string;
  isPlayer: boolean;
  finished: boolean;
}

export interface ResultsData {
  position: number;
  totalCars: number;
  totalTime: number;
  bestLap: number;
  laps: number[];
  rows: ResultsRow[];
  newBest: boolean;
}

const CONFIG_KEY = 'vanta-gp-config-v1';
const BEST_KEY = 'vanta-gp-best-v1';

const SILHOUETTE = `<svg class="car-svg" viewBox="0 0 240 74" aria-hidden="true">
  <path fill="currentColor" d="M14 54c1-7 5-11 13-12l20-2 18-15c5-4 12-6 21-6h40c12 0 21 3 28 9l11 10 41 4c9 1 15 5 19 12l3 6-8 3c-3-5-8-7-15-7-6 0-11 3-14 8H74c-3-5-8-8-15-8-6 0-11 3-14 8l-31-1z"/>
  <circle cx="59" cy="59" r="11" fill="#05070c"/><circle cx="59" cy="59" r="5.5" fill="#aebacd"/>
  <circle cx="186" cy="59" r="11" fill="#05070c"/><circle cx="186" cy="59" r="5.5" fill="#aebacd"/>
</svg>`;

export class UI {
  config: GameConfig;
  onStart: (() => void) | null = null;
  onResume: (() => void) | null = null;
  onRestart: (() => void) | null = null;
  onQuit: (() => void) | null = null;
  onConfigChange: ((config: GameConfig) => void) | null = null;
  onToggleSound: (() => void) | null = null;

  private menu = document.getElementById('menu') as HTMLElement;
  private loading = document.getElementById('loading') as HTMLElement;
  private loadingFill = document.getElementById('loading-fill') as HTMLElement;
  private loadingLabel = document.getElementById('loading-label') as HTMLElement;
  private pauseEl = document.getElementById('pause') as HTMLElement;
  private resultsEl = document.getElementById('results') as HTMLElement;
  private resultsBody = document.getElementById('results-body') as HTMLElement;
  private resultsTitle = document.getElementById('results-title') as HTMLElement;
  private resultsStats = document.getElementById('results-stats') as HTMLElement;
  private resultsBadge = document.getElementById('results-badge') as HTMLElement;
  private carList = document.getElementById('car-list') as HTMLElement;
  private paintList = document.getElementById('paint-list') as HTMLElement;
  private soundBtn = document.getElementById('sound-btn') as HTMLElement;
  private menuBest = document.getElementById('menu-best') as HTMLElement;
  private touch = document.getElementById('touch') as HTMLElement;

  constructor() {
    this.config = this.loadConfig();
    this.buildCars();
    this.buildPaints();
    this.bind();
    this.applySelection();
    this.setSound(localStorage.getItem('vanta-gp-muted') === '1');
    if (window.matchMedia('(pointer: coarse)').matches) {
      this.touch.classList.add('enabled');
    }
  }

  private loadConfig(): GameConfig {
    const fallback: GameConfig = {
      carId: CARS[0].id,
      color: CARS[0].color,
      accent: CARS[0].accent,
      weather: 'sunset',
      quality: window.matchMedia('(pointer: coarse)').matches ? 'high' : 'ultra',
    };
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as Partial<GameConfig>;
      if (!CARS.some((c) => c.id === parsed.carId)) parsed.carId = fallback.carId;
      if (typeof parsed.color !== 'number') parsed.color = fallback.color;
      if (typeof parsed.accent !== 'number') parsed.accent = fallback.accent;
      if (parsed.weather !== 'storm' && parsed.weather !== 'sunset') parsed.weather = 'sunset';
      if (!['ultra', 'high', 'performance'].includes(parsed.quality ?? '')) parsed.quality = 'ultra';
      return parsed as GameConfig;
    } catch {
      return fallback;
    }
  }

  private saveConfig(): void {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
  }

  private buildCars(): void {
    this.carList.innerHTML = CARS.map(
      (car, i) => `
      <button class="car-card" data-car="${car.id}" type="button">
        <div class="car-card-top"><span class="car-num">0${i + 1}</span><span class="car-name">${car.name}</span></div>
        <div class="car-art" style="color:#${car.color.toString(16).padStart(6, '0')}">${SILHOUETTE}</div>
        <div class="car-tag">${car.tagline}</div>
        <div class="stat"><span>SPEED</span><i><b style="width:${car.stats.speed}%"></b></i><em>${car.stats.speed}</em></div>
        <div class="stat"><span>ACCEL</span><i><b style="width:${car.stats.accel}%"></b></i><em>${car.stats.accel}</em></div>
        <div class="stat"><span>GRIP</span><i><b style="width:${car.stats.handling}%"></b></i><em>${car.stats.handling}</em></div>
      </button>`,
    ).join('');
    this.carList.querySelectorAll<HTMLElement>('.car-card').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.car;
        if (!id || id === this.config.carId) return;
        this.config.carId = id;
        const spec = CARS.find((c) => c.id === id);
        if (spec) {
          this.config.color = spec.color;
          this.config.accent = spec.accent;
        }
        this.applySelection();
        this.saveConfig();
        this.onConfigChange?.(this.config);
      });
    });
  }

  private buildPaints(): void {
    this.paintList.innerHTML = PAINTS.map(
      (p, i) =>
        `<button class="paint" type="button" data-paint="${i}" title="${p.name}" style="--swatch:#${p.color
          .toString(16)
          .padStart(6, '0')};--swatch-accent:#${p.accent.toString(16).padStart(6, '0')}"></button>`,
    ).join('');
    this.paintList.querySelectorAll<HTMLElement>('.paint').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = Number(el.dataset.paint);
        const paint = PAINTS[idx];
        if (!paint) return;
        this.config.color = paint.color;
        this.config.accent = paint.accent;
        this.applySelection();
        this.saveConfig();
        this.onConfigChange?.(this.config);
      });
    });
  }

  private bind(): void {
    document.getElementById('start-btn')?.addEventListener('click', () => {
      this.onStart?.();
    });
    document.getElementById('resume-btn')?.addEventListener('click', () => {
      this.onResume?.();
    });
    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.onRestart?.();
    });
    document.getElementById('quit-btn')?.addEventListener('click', () => {
      this.onQuit?.();
    });
    document.getElementById('again-btn')?.addEventListener('click', () => {
      this.onRestart?.();
    });
    document.getElementById('menu-btn')?.addEventListener('click', () => {
      this.onQuit?.();
    });
    this.soundBtn.addEventListener('click', () => {
      this.onToggleSound?.();
    });

    document.querySelectorAll<HTMLElement>('.seg[data-setting]').forEach((seg) => {
      const key = seg.dataset.setting as 'weather' | 'quality';
      seg.querySelectorAll<HTMLButtonElement>('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.value;
          if (!value) return;
          if (key === 'weather') this.config.weather = value === 'storm' ? 'storm' : 'sunset';
          else this.config.quality = value as Quality;
          this.applySelection();
          this.saveConfig();
          this.onConfigChange?.(this.config);
        });
      });
    });
  }

  private applySelection(): void {
    this.carList.querySelectorAll<HTMLElement>('.car-card').forEach((el) => {
      el.classList.toggle('selected', el.dataset.car === this.config.carId);
    });
    this.paintList.querySelectorAll<HTMLElement>('.paint').forEach((el) => {
      const paint = PAINTS[Number(el.dataset.paint)];
      el.classList.toggle('selected', paint.color === this.config.color);
    });
    document.querySelectorAll<HTMLElement>('.seg[data-setting="weather"] button').forEach((el) => {
      el.classList.toggle('active', el.dataset.value === this.config.weather);
    });
    document.querySelectorAll<HTMLElement>('.seg[data-setting="quality"] button').forEach((el) => {
      el.classList.toggle('active', el.dataset.value === this.config.quality);
    });
  }

  setSound(muted: boolean): void {
    localStorage.setItem('vanta-gp-muted', muted ? '1' : '0');
    this.soundBtn.textContent = muted ? 'SOUND · OFF' : 'SOUND · ON';
    this.soundBtn.classList.toggle('off', muted);
  }

  showMenu(bestLap: number): void {
    this.menu.classList.add('visible');
    this.menuBest.textContent = formatTime(bestLap);
    this.pauseEl.classList.remove('visible');
    this.resultsEl.classList.remove('visible');
  }

  hideMenu(): void {
    this.menu.classList.remove('visible');
  }

  showPause(): void {
    this.pauseEl.classList.add('visible');
  }

  hidePause(): void {
    this.pauseEl.classList.remove('visible');
  }

  showResults(data: ResultsData): void {
    this.resultsTitle.innerHTML = `<span class="pos-accent">P${data.position}</span> / ${data.totalCars}<small>RACE COMPLETE</small>`;
    this.resultsStats.innerHTML = `
      <div class="res-stat"><span>TOTAL TIME</span><strong>${formatTime(data.totalTime)}</strong></div>
      <div class="res-stat"><span>BEST LAP</span><strong>${formatTime(data.bestLap)}</strong></div>
      <div class="res-stat"><span>LAPS</span><strong>${data.laps.map((l) => formatTime(l)).join(' · ')}</strong></div>`;
    this.resultsBadge.textContent = data.newBest ? 'NEW PERSONAL BEST' : 'SUNSET CIRCUIT';
    this.resultsBadge.classList.toggle('gold', data.newBest);
    this.resultsBody.innerHTML = data.rows
      .map(
        (row) => `<div class="res-row ${row.isPlayer ? 'player' : ''}">
          <span class="res-pos">${row.position}</span>
          <span class="res-driver">${row.driver}</span>
          <span class="res-car">${row.car}</span>
          <span class="res-time">${row.timeText}</span>
        </div>`,
      )
      .join('');
    this.resultsEl.classList.add('visible');
  }

  hideResults(): void {
    this.resultsEl.classList.remove('visible');
  }

  setLoading(label: string, progress: number): void {
    this.loadingLabel.textContent = label;
    this.loadingFill.style.width = `${Math.round(progress * 100)}%`;
  }

  hideLoading(): void {
    this.loading.classList.add('done');
    window.setTimeout(() => {
      this.loading.style.display = 'none';
    }, 700);
  }

  bestLap(): number {
    const v = Number(localStorage.getItem(BEST_KEY) ?? 0);
    return Number.isFinite(v) ? v : 0;
  }

  saveBestLap(lap: number): boolean {
    const current = this.bestLap();
    if (!lap || (current && lap >= current)) return false;
    localStorage.setItem(BEST_KEY, String(lap));
    this.menuBest.textContent = formatTime(lap);
    return true;
  }
}
