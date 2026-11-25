import { CARS, PAINTS } from '../vehicle/CarModel';
import type { Records, Settings, QualityName, WeatherName } from '../core/Storage';
import type { Vehicle } from '../vehicle/Vehicle';
import { formatTime } from '../core/Math';

const el = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;

export interface UICallbacks {
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onSettings: (settings: Settings) => void;
  onMute: () => void;
  onFullscreen: () => void;
}

export interface ResultData {
  player: Vehicle;
  cars: Vehicle[];
  totalTime: number;
}

export class UI {
  private menu = el('menu');
  private pause = el('pause');
  private results = el('results');
  private carList = el('car-list');
  private paintList = el('paint-list');
  private carStats = el('car-stats');
  private weatherList = el('weather-list');
  private qualityList = el('quality-list');
  private bestLabel = el('menu-best');

  constructor(
    private settings: Settings,
    private records: Records,
    private cb: UICallbacks,
  ) {
    this.buildMenu();
    this.bind();
  }

  private buildMenu(): void {
    this.carList.innerHTML = CARS.map((c, i) => `
      <button class="car-item ${c.id === this.settings.carId ? 'active' : ''}" data-car="${c.id}" ${i === 0 ? 'autofocus' : ''}>
        <span><b>${c.name}</b><small>${c.tagline}</small></span>
        <span class="car-no">0${i + 1}</span>
      </button>`).join('');
    this.paintList.innerHTML = PAINTS.map((p, i) => `
      <button class="swatch ${i === this.settings.paint ? 'active' : ''}" data-paint="${i}"
        style="background:#${p.color.toString(16).padStart(6, '0')}" aria-label="${p.name}"></button>`).join('');
    this.weatherList.innerHTML = (['sunset', 'night', 'storm'] as WeatherName[]).map((w) => `
      <button data-weather="${w}" class="${w === this.settings.weather ? 'active' : ''}">${w.toUpperCase()}</button>`).join('');
    this.qualityList.innerHTML = (['low', 'medium', 'high', 'ultra'] as QualityName[]).map((q) => `
      <button data-quality="${q}" class="${q === this.settings.quality ? 'active' : ''}">${q.toUpperCase()}</button>`).join('');
    this.renderStats();
    this.renderSliders();
    this.updateBest();
  }

  private renderStats(): void {
    const car = CARS.find((c) => c.id === this.settings.carId) ?? CARS[0];
    this.carStats.innerHTML = ([['TOP SPEED', car.stats.speed], ['ACCELERATION', car.stats.accel], ['HANDLING', car.stats.handling]] as const)
      .map(([label, value]) => `<div class="stat"><span>${label}</span><i><b style="width:${value}%"></b></i><em>${value}</em></div>`).join('');
  }

  private renderSliders(): void {
    const pairs: Array<[string, string, number, number]> = [
      ['steer-range', 'steer-val', this.settings.steering * 100, 0],
      ['assist-range', 'assist-val', this.settings.assist * 100, 0],
      ['shake-range', 'shake-val', this.settings.cameraShake * 100, 0],
    ];
    for (const [id, label, value] of pairs) {
      (el<HTMLInputElement>(id)).value = String(value);
      el(label).textContent = `${Math.round(value)}%`;
    }
  }

  private updateBest(): void {
    const key = this.settings.carId;
    const best = this.records.bestLap[key];
    this.bestLabel.textContent = best ? formatTime(best) : '--:--.---';
  }

  private bind(): void {
    this.carList.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-car]');
      if (!btn) return;
      this.settings.carId = btn.dataset.car!;
      this.carList.querySelectorAll('.car-item').forEach((n) => n.classList.toggle('active', n === btn));
      this.renderStats();
      this.updateBest();
      this.commit();
    });
    this.paintList.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-paint]');
      if (!btn) return;
      this.settings.paint = Number(btn.dataset.paint);
      this.paintList.querySelectorAll('.swatch').forEach((n) => n.classList.toggle('active', n === btn));
      this.commit();
    });
    this.weatherList.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-weather]');
      if (!btn) return;
      this.settings.weather = btn.dataset.weather as WeatherName;
      this.weatherList.querySelectorAll('button').forEach((n) => n.classList.toggle('active', n === btn));
      this.commit();
    });
    this.qualityList.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-quality]');
      if (!btn) return;
      this.settings.quality = btn.dataset.quality as QualityName;
      this.qualityList.querySelectorAll('button').forEach((n) => n.classList.toggle('active', n === btn));
      this.commit();
    });
    const wireSlider = (id: string, label: string, key: 'steering' | 'assist' | 'cameraShake', scale: number): void => {
      const input = el<HTMLInputElement>(id);
      input.addEventListener('input', () => {
        const v = Number(input.value) / scale;
        this.settings[key] = key === 'steering' ? Math.max(0.35, v) : v;
        el(label).textContent = `${input.value}%`;
        this.commit();
      });
    };
    wireSlider('steer-range', 'steer-val', 'steering', 100);
    wireSlider('assist-range', 'assist-val', 'assist', 100);
    wireSlider('shake-range', 'shake-val', 'cameraShake', 100);

    el('start-btn').addEventListener('click', () => this.cb.onStart());
    el('resume-btn').addEventListener('click', () => this.cb.onResume());
    el('restart-btn').addEventListener('click', () => this.cb.onRestart());
    el('quit-btn').addEventListener('click', () => this.cb.onQuit());
    el('result-restart').addEventListener('click', () => this.cb.onRestart());
    el('result-menu').addEventListener('click', () => this.cb.onQuit());
    el('mute-btn').addEventListener('click', () => this.cb.onMute());
    el('fs-btn').addEventListener('click', () => this.cb.onFullscreen());
    el('hud-pause').addEventListener('click', () => this.cb.onResume());

    // Arrow-key navigation for option groups. Horizontal groups also select on
    // movement (paint / conditions / graphics); the car list just moves focus.
    this.bindGroup(this.carList, 'vertical', false);
    this.bindGroup(this.paintList, 'horizontal', true);
    this.bindGroup(this.weatherList, 'horizontal', true);
    this.bindGroup(this.qualityList, 'horizontal', true);
  }

  private bindGroup(container: HTMLElement, orientation: 'horizontal' | 'vertical', selectOnMove: boolean): void {
    const keys = orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    container.addEventListener('keydown', (e) => {
      if (!keys.includes(e.code)) return;
      const items = Array.from(container.querySelectorAll<HTMLElement>('button'));
      const index = items.indexOf(document.activeElement as HTMLElement);
      if (index < 0 || items.length === 0) return;
      e.preventDefault();
      e.stopPropagation();
      const step = e.code === 'ArrowRight' || e.code === 'ArrowDown' ? 1 : -1;
      const next = items[(index + step + items.length) % items.length];
      next.focus({ preventScroll: true });
      if (selectOnMove) next.click();
    });
  }

  private focusInitial(target: HTMLElement | null): void {
    if (target) target.focus({ preventScroll: true });
  }

  setMuted(muted: boolean): void {
    el('mute-btn').textContent = muted ? 'SOUND OFF' : 'SOUND ON';
  }

  private commit(): void {
    this.cb.onSettings(this.settings);
  }

  showMenu(): void {
    this.hideAll();
    this.menu.classList.remove('hidden');
    this.updateBest();
    this.focusInitial(this.carList.querySelector<HTMLElement>('button'));
  }

  showPause(): void {
    this.pause.classList.remove('hidden');
    this.focusInitial(el('resume-btn'));
  }

  hidePause(): void {
    this.pause.classList.add('hidden');
  }

  hideAll(): void {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest('#menu, #pause, #results')) active.blur();
    this.menu.classList.add('hidden');
    this.pause.classList.add('hidden');
    this.results.classList.add('hidden');
  }

  showResults(data: ResultData): void {
    this.results.classList.remove('hidden');
    this.focusInitial(el('result-restart'));
    const { player, cars, totalTime } = data;
    el('result-kicker').textContent = player.position === 1 ? 'UNCONTESTED VICTORY' : 'RACE COMPLETE';
    el('result-title').textContent = `P${player.position} — ${player.position === 1 ? 'VICTORY' : 'FINISH'}`;
    el('result-total').textContent = formatTime(totalTime);
    el('result-best').textContent = formatTime(player.bestLap);
    let top = 0;
    for (const c of cars) top = Math.max(top, c.speedKmh);
    el('result-top').textContent = `${Math.round(top)} KM/H`;
    const sorted = [...cars].sort((a, b) => a.position - b.position);
    el('result-standings').innerHTML = sorted.map((c) => {
      const gap = c === player ? '' : c.finished && player.finished
        ? formatGapText(c.finishTime - player.finishTime)
        : `+${Math.max(1, player.lapsCompleted - c.lapsCompleted)} LAP`;
      return `<div class="stand-row ${c === player ? 'me' : ''}"><span>P${c.position}</span><span>${c.name}</span><span>${gap}</span></div>`;
    }).join('');
  }
}

function formatGapText(seconds: number): string {
  return `+${Math.abs(seconds).toFixed(3)}s`;
}
