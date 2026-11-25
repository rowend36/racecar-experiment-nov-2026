/** Persisted player settings and records. All keys are namespaced and versioned. */

export type QualityName = 'low' | 'medium' | 'high' | 'ultra';
export type WeatherName = 'sunset' | 'night' | 'storm';

export interface Settings {
  carId: string;
  paint: number;
  weather: WeatherName;
  quality: QualityName;
  volume: number;
  muted: boolean;
  steering: number;
  assist: number;
  cameraShake: number;
}

const SETTINGS_KEY = 'redline-gp-settings-v2';
const RECORD_KEY = 'redline-gp-records-v2';

export const DEFAULT_SETTINGS: Settings = {
  carId: 'vortex',
  paint: 0,
  weather: 'sunset',
  quality: 'high',
  volume: 0.75,
  muted: false,
  steering: 0.78,
  assist: 0.6,
  cameraShake: 0.8,
};

function safeRead(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / disabled storage — run with defaults */
  }
}

export function loadSettings(): Settings {
  const raw = safeRead(SETTINGS_KEY);
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SETTINGS };
  const s = raw as Partial<Settings>;
  return {
    carId: typeof s.carId === 'string' ? s.carId : DEFAULT_SETTINGS.carId,
    paint: Number.isFinite(s.paint) ? clampInt(s.paint as number, 0, 7) : DEFAULT_SETTINGS.paint,
    weather: isWeather(s.weather) ? s.weather : DEFAULT_SETTINGS.weather,
    quality: isQuality(s.quality) ? s.quality : DEFAULT_SETTINGS.quality,
    volume: Number.isFinite(s.volume) ? Math.min(1, Math.max(0, s.volume as number)) : DEFAULT_SETTINGS.volume,
    muted: typeof s.muted === 'boolean' ? s.muted : DEFAULT_SETTINGS.muted,
    steering: Number.isFinite(s.steering) ? Math.min(1.4, Math.max(0.35, s.steering as number)) : DEFAULT_SETTINGS.steering,
    assist: Number.isFinite(s.assist) ? Math.min(1, Math.max(0, s.assist as number)) : DEFAULT_SETTINGS.assist,
    cameraShake: Number.isFinite(s.cameraShake) ? Math.min(1, Math.max(0, s.cameraShake as number)) : DEFAULT_SETTINGS.cameraShake,
  };
}

export function saveSettings(settings: Settings): void {
  safeWrite(SETTINGS_KEY, settings);
}

export interface Records {
  bestLap: Record<string, number>;
  bestRace: Record<string, number>;
}

export function loadRecords(): Records {
  const raw = safeRead(RECORD_KEY);
  if (!raw || typeof raw !== 'object') return { bestLap: {}, bestRace: {} };
  const r = raw as Partial<Records>;
  const clean = (v: unknown): Record<string, number> => {
    const out: Record<string, number> = {};
    if (!v || typeof v !== 'object') return out;
    for (const [k, n] of Object.entries(v as Record<string, unknown>)) {
      if (typeof n === 'number' && Number.isFinite(n) && n > 0) out[k] = n;
    }
    return out;
  };
  return { bestLap: clean(r.bestLap), bestRace: clean(r.bestRace) };
}

export function saveRecords(records: Records): void {
  safeWrite(RECORD_KEY, records);
}

function clampInt(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, Math.floor(v)));
}

function isWeather(v: unknown): v is WeatherName {
  return v === 'sunset' || v === 'night' || v === 'storm';
}

function isQuality(v: unknown): v is QualityName {
  return v === 'low' || v === 'medium' || v === 'high' || v === 'ultra';
}
