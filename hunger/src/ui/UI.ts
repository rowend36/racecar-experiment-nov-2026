import type { Track } from '../core/Track';
import { DEFAULT_SETTINGS } from '../game/types';
import type {
  GameSettings,
  PaintFinish,
  QualityPreset,
  RaceResult,
  Telemetry,
  UIAction,
  UICallbacks,
} from '../game/types';

const SETTINGS_KEY = 'hunger-apex-settings-v1';
const QUALITIES: ReadonlyArray<QualityPreset> = ['low', 'medium', 'high', 'ultra'];
const FINISHES: ReadonlyArray<PaintFinish> = ['metallic', 'pearl', 'satin'];
const ACTIONS = new Set<UIAction>([
  'start', 'pause', 'resume', 'restart', 'garage', 'settings', 'back',
  'camera', 'reset', 'mute', 'fullscreen',
]);

const PAINTS: ReadonlyArray<{ hex: string; name: string }> = [
  { hex: '#d8ff3e', name: 'Acid Lime' },
  { hex: '#ff4d6d', name: 'Signal Red' },
  { hex: '#39d6ff', name: 'Ion Blue' },
  { hex: '#f5f2e8', name: 'Ceramic White' },
  { hex: '#9b6dff', name: 'Ultraviolet' },
  { hex: '#ff8a3d', name: 'Burnout Orange' },
];

type Screen = 'loading' | 'menu' | 'garage' | 'settings' | 'race' | 'results';

interface MinimapCache {
  track: Track;
  width: number;
  height: number;
  dpr: number;
  canvas: HTMLCanvasElement;
  project: (x: number, z: number) => { x: number; y: number };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeSettings(value: unknown): GameSettings {
  const fallback = { ...DEFAULT_SETTINGS };
  if (!isRecord(value)) return fallback;

  const quality = QUALITIES.includes(value.quality as QualityPreset)
    ? value.quality as QualityPreset
    : fallback.quality;
  const paintColor = typeof value.paintColor === 'string' && /^#[0-9a-f]{6}$/i.test(value.paintColor)
    ? value.paintColor.toLowerCase()
    : fallback.paintColor;
  const paintFinish = FINISHES.includes(value.paintFinish as PaintFinish)
    ? value.paintFinish as PaintFinish
    : fallback.paintFinish;
  const wetness = typeof value.wetness === 'number' && Number.isFinite(value.wetness)
    ? clamp(value.wetness, 0, 1)
    : fallback.wetness;
  const volume = typeof value.volume === 'number' && Number.isFinite(value.volume)
    ? clamp(value.volume, 0, 1)
    : fallback.volume;
  const steeringSensitivity = typeof value.steeringSensitivity === 'number' && Number.isFinite(value.steeringSensitivity)
    ? clamp(value.steeringSensitivity, 0.35, 1)
    : fallback.steeringSensitivity;

  return {
    quality,
    paintColor,
    paintFinish,
    wetness,
    volume,
    steeringSensitivity,
    steeringAssist: typeof value.steeringAssist === 'boolean' ? value.steeringAssist : fallback.steeringAssist,
    cameraShake: typeof value.cameraShake === 'boolean' ? value.cameraShake : fallback.cameraShake,
    muted: typeof value.muted === 'boolean' ? value.muted : fallback.muted,
  };
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '00:00.000';
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const wholeSeconds = Math.floor(safe % 60);
  const milliseconds = Math.floor((safe % 1) * 1000);
  return `${String(minutes).padStart(2, '0')}:${String(wholeSeconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

function ordinal(position: number): string {
  const mod100 = position % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  switch (position % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function setText(element: HTMLElement, value: string): void {
  if (element.textContent !== value) element.textContent = value;
}

function setHidden(element: HTMLElement, hidden: boolean): void {
  if (element.hidden !== hidden) element.hidden = hidden;
}

function setAttribute(element: HTMLElement, name: string, value: string): void {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function setStyle(element: HTMLElement, property: string, value: string): void {
  if (element.style.getPropertyValue(property) !== value) element.style.setProperty(property, value);
}

/** DOM-only racing interface. The Three.js scene remains the live backdrop. */
export class UI {
  private readonly root: HTMLElement;
  private readonly callbacks: UICallbacks;
  private readonly document: Document;
  private readonly loadingScreen: HTMLElement | null;
  private readonly panels: ReadonlyArray<HTMLElement>;
  private readonly colorButtons: ReadonlyArray<HTMLButtonElement>;
  private readonly finishButtons: ReadonlyArray<HTMLButtonElement>;
  private readonly qualityButtons: ReadonlyArray<HTMLButtonElement>;
  private readonly checkpointPips: ReadonlyArray<HTMLElement>;

  private readonly paintName: HTMLElement;
  private readonly paintHex: HTMLElement;
  private readonly wetnessInput: HTMLInputElement;
  private readonly wetnessOutput: HTMLElement;
  private readonly volumeInput: HTMLInputElement;
  private readonly volumeOutput: HTMLElement;
  private readonly steeringSensitivityInput: HTMLInputElement;
  private readonly steeringSensitivityOutput: HTMLElement;
  private readonly steeringAssistInput: HTMLInputElement;
  private readonly cameraShakeInput: HTMLInputElement;
  private readonly muteButton: HTMLButtonElement;
  private readonly muteLabel: HTMLElement;
  private readonly hudMuteLabel: HTMLElement;
  private readonly fullscreenLabel: HTMLElement;

  private readonly positionValue: HTMLElement;
  private readonly racerCountValue: HTMLElement;
  private readonly lapValue: HTMLElement;
  private readonly totalLapsValue: HTMLElement;
  private readonly raceTimeValue: HTMLElement;
  private readonly lapTimeValue: HTMLElement;
  private readonly bestLapValue: HTMLElement;
  private readonly checkpointValue: HTMLElement;
  private readonly speedValue: HTMLElement;
  private readonly gearValue: HTMLElement;
  private readonly rpmFill: HTMLElement;
  private readonly wrongWayIndicator: HTMLElement;
  private readonly offroadIndicator: HTMLElement;
  private readonly driftIndicator: HTMLElement;

  private readonly countdown: HTMLElement;
  private readonly countdownValue: HTMLElement;
  private readonly countdownKicker: HTMLElement;
  private readonly pausePanel: HTMLElement;
  private readonly resultPosition: HTMLElement;
  private readonly resultOrdinal: HTMLElement;
  private readonly resultField: HTMLElement;
  private readonly resultTitle: HTMLElement;
  private readonly resultTime: HTMLElement;
  private readonly resultBest: HTMLElement;
  private readonly resultLaps: HTMLElement;
  private readonly resultRecord: HTMLElement;
  private readonly toast: HTMLElement;

  private readonly minimap: HTMLCanvasElement;
  private minimapContext: CanvasRenderingContext2D | null;
  private minimapCache: MinimapCache | null = null;
  private minimapSize = { width: 0, height: 0 };
  private readonly minimapObserver: ResizeObserver | null;

  private settings: GameSettings;
  private screen: Screen = 'loading';
  private paused = false;
  private visible = true;
  private loadingVisible = true;
  private disposed = false;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private countdownAnimation: Animation | null = null;

  constructor(root: HTMLElement, callbacks: UICallbacks) {
    this.root = root;
    this.callbacks = callbacks;
    this.document = root.ownerDocument;
    this.loadingScreen = this.document.getElementById('loading-screen');
    this.settings = this.readSettings();

    root.innerHTML = `
      <svg class="ui-sprite" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          <symbol id="ha-emblem" viewBox="0 0 64 64">
            <path d="M7 49 25 15h14l18 34H44L32 29 20 49H7Z" fill="currentColor"/>
            <path d="M23 38h18l-5 11H28l-5-11Z" fill="currentColor"/>
            <path d="M4 55h56v5H4z" fill="currentColor"/>
          </symbol>
          <symbol id="ha-arrow" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter"/></symbol>
          <symbol id="ha-back" viewBox="0 0 24 24"><path d="M20 12H5m6-6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/></symbol>
          <symbol id="ha-garage" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v11H3V10Zm5 11v-7h8v7M7 8h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></symbol>
          <symbol id="ha-settings" viewBox="0 0 24 24"><path d="M4 7h16M4 17h16M8 4v6m8 4v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/><circle cx="8" cy="7" r="2" fill="currentColor"/><circle cx="16" cy="17" r="2" fill="currentColor"/></symbol>
          <symbol id="ha-play" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z" fill="currentColor"/></symbol>
          <symbol id="ha-pause" viewBox="0 0 24 24"><path d="M7 5h4v14H7zm6 0h4v14h-4z" fill="currentColor"/></symbol>
          <symbol id="ha-camera" viewBox="0 0 24 24"><path d="M3 8h4l2-3h6l2 3h4v12H3V8Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
          <symbol id="ha-reset" viewBox="0 0 24 24"><path d="M5 9a8 8 0 1 1-1 6M5 3v6h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/></symbol>
          <symbol id="ha-volume" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4V9Zm12-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></symbol>
          <symbol id="ha-mute" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4V9Zm12 0 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></symbol>
          <symbol id="ha-fullscreen" viewBox="0 0 24 24"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
          <symbol id="ha-flag" viewBox="0 0 24 24"><path d="M5 22V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0" fill="none" stroke="currentColor" stroke-width="1.7"/></symbol>
          <symbol id="ha-trophy" viewBox="0 0 24 24"><path d="M7 3h10v7a5 5 0 0 1-10 0V3Zm0 2H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 3v5m-4 1h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></symbol>
          <symbol id="ha-left" viewBox="0 0 24 24"><path d="m14 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></symbol>
          <symbol id="ha-right" viewBox="0 0 24 24"><path d="m10 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></symbol>
          <symbol id="ha-throttle" viewBox="0 0 24 24"><path d="m6 14 6-6 6 6M12 8v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></symbol>
          <symbol id="ha-brake" viewBox="0 0 24 24"><path d="M6 10h12M12 4v12m-6 4 6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></symbol>
          <symbol id="ha-handbrake" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h8v8H8z" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
        </defs>
      </svg>

      <div class="ui-atmosphere" aria-hidden="true"></div>

      <section class="ui-panel menu-screen" data-screen-panel="menu" aria-labelledby="menu-title" hidden>
        <header class="menu-header">
          <a class="mini-brand" href="#" aria-label="Hunger Apex home" data-action="back">
            <svg class="emblem emblem-small" aria-hidden="true"><use href="#ha-emblem"></use></svg>
            <span>HUNGER<span class="brand-divider">/</span>APEX</span>
          </a>
          <div class="live-tag"><i aria-hidden="true"></i> LIVE CIRCUIT FEED</div>
        </header>

        <div class="menu-layout">
          <div class="menu-hero">
            <p class="eyebrow"><span>01</span> UNDERGROUND RACING DIVISION</p>
            <h1 id="menu-title" class="game-title" data-autofocus tabindex="-1">HUNGER<br><span>APEX</span><sup>®</sup></h1>
            <p class="menu-tagline">Chase the limit. Own the night.</p>
            <nav class="menu-actions" aria-label="Main menu">
              <button class="menu-action menu-action-primary" type="button" data-action="start">
                <span class="action-index">01</span>
                <span class="action-copy"><strong>RACE</strong><small>NEON DUSK · 3 LAPS</small></span>
                <svg class="icon" aria-hidden="true"><use href="#ha-arrow"></use></svg>
              </button>
              <button class="menu-action" type="button" data-action="garage">
                <span class="action-index">02</span>
                <span class="action-copy"><strong>GARAGE</strong><small>MAKE IT YOURS</small></span>
                <svg class="icon" aria-hidden="true"><use href="#ha-garage"></use></svg>
              </button>
              <button class="menu-action" type="button" data-action="settings">
                <span class="action-index">03</span>
                <span class="action-copy"><strong>SETTINGS</strong><small>TUNE THE EXPERIENCE</small></span>
                <svg class="icon" aria-hidden="true"><use href="#ha-settings"></use></svg>
              </button>
            </nav>
          </div>

          <aside class="circuit-card glass-panel" aria-label="Featured circuit">
            <div class="panel-topline"><span>FEATURED CIRCUIT</span><span>ND—07</span></div>
            <div class="circuit-art" aria-hidden="true">
              <svg viewBox="0 0 360 220" fill="none">
                <path class="circuit-shadow" d="M54 153c-31-31-17-76 20-97 36-21 42-35 85-30 44 5 55-21 101-4 45 16 52 55 32 82-20 28-56 21-70 53-13 29-44 34-72 26-29-8-59 5-96-30Z"/>
                <path class="circuit-line" d="M54 153c-31-31-17-76 20-97 36-21 42-35 85-30 44 5 55-21 101-4 45 16 52 55 32 82-20 28-56 21-70 53-13 29-44 34-72 26-29-8-59 5-96-30Z"/>
                <path class="circuit-start" d="m48 151 14-8"/>
                <circle class="circuit-node" cx="73" cy="56" r="4"/>
              </svg>
              <span class="circuit-coordinate">35°41′N / 139°41′E</span>
            </div>
            <p class="eyebrow">NEON METROPOLIS · SECTOR 07</p>
            <h2>NEON <span>DUSK</span></h2>
            <p class="circuit-description">Rain-slick asphalt. Elevated straights. One perfect line.</p>
            <dl class="circuit-stats">
              <div><dt>DISTANCE</dt><dd>0.76 <small>KM</small></dd></div>
              <div><dt>LAPS</dt><dd>03</dd></div>
              <div><dt>GRID</dt><dd>04</dd></div>
            </dl>
            <div class="circuit-status"><span><i aria-hidden="true"></i> DUSK / DAMP</span><span>DIFFICULTY <b>■■■□□</b></span></div>
          </aside>
        </div>

        <footer class="menu-footer">
          <div class="desktop-hints" aria-label="Desktop controls">
            <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> DRIVE</span>
            <span><kbd>SPACE</kbd> HANDBRAKE</span>
            <span><kbd>C</kbd> CAMERA</span>
            <span><kbd>R</kbd> RESET</span>
            <span><kbd>ESC</kbd> PAUSE</span>
          </div>
          <span class="build-label">HA / 2026.11 <i aria-hidden="true"></i> SYSTEM ONLINE</span>
        </footer>
      </section>

      <section class="ui-panel garage-screen" data-screen-panel="garage" aria-labelledby="garage-title" hidden>
        <header class="section-header">
          <button class="icon-button back-button" type="button" data-action="back" aria-label="Back to main menu">
            <svg class="icon" aria-hidden="true"><use href="#ha-back"></use></svg><span>BACK</span>
          </button>
          <div class="section-breadcrumb">HUNGER APEX <span>/</span> GARAGE</div>
          <span class="live-tag"><i aria-hidden="true"></i> LIVE PREVIEW</span>
        </header>
        <div class="garage-layout">
          <div class="garage-heading">
            <p class="eyebrow"><span>02</span> PERSONALIZATION</p>
            <h2 id="garage-title" data-autofocus tabindex="-1">YOUR<br><span>MACHINE.</span></h2>
            <p>Six finishes. One unmistakable presence.<br>Every change is reflected on the car.</p>
            <dl class="vehicle-specs">
              <div><dt>CLASS</dt><dd>APEX GT</dd></div>
              <div><dt>POWERTRAIN</dt><dd>TWIN-TURBO V8</dd></div>
              <div><dt>DRIVETRAIN</dt><dd>AWD</dd></div>
            </dl>
          </div>
          <div class="garage-car-space" aria-hidden="true"><span class="car-platform-label">HA—01 / PERFORMANCE PLATFORM</span></div>
          <div class="garage-controls glass-panel">
            <div class="panel-topline"><span>PAINT STUDIO</span><span>01 / 02</span></div>
            <div class="paint-summary"><span class="paint-chip" aria-hidden="true"></span><div><strong data-role="paint-name">Acid Lime</strong><span data-role="paint-hex">#D8FF3E</span></div></div>
            <fieldset class="swatch-fieldset">
              <legend>BODY COLOR</legend>
              <div class="paint-swatches">
                <button type="button" data-color="#d8ff3e" style="--swatch:#d8ff3e" aria-label="Acid Lime paint" aria-pressed="true"></button>
                <button type="button" data-color="#ff4d6d" style="--swatch:#ff4d6d" aria-label="Signal Red paint" aria-pressed="false"></button>
                <button type="button" data-color="#39d6ff" style="--swatch:#39d6ff" aria-label="Ion Blue paint" aria-pressed="false"></button>
                <button type="button" data-color="#f5f2e8" style="--swatch:#f5f2e8" aria-label="Ceramic White paint" aria-pressed="false"></button>
                <button type="button" data-color="#9b6dff" style="--swatch:#9b6dff" aria-label="Ultraviolet paint" aria-pressed="false"></button>
                <button type="button" data-color="#ff8a3d" style="--swatch:#ff8a3d" aria-label="Burnout Orange paint" aria-pressed="false"></button>
              </div>
            </fieldset>
            <fieldset class="finish-fieldset">
              <legend>SURFACE FINISH</legend>
              <div class="segmented-control finish-control">
                <button type="button" data-finish="metallic" aria-pressed="true">METALLIC</button>
                <button type="button" data-finish="pearl" aria-pressed="false">PEARL</button>
                <button type="button" data-finish="satin" aria-pressed="false">SATIN</button>
              </div>
            </fieldset>
            <p class="finish-description" data-role="finish-description">Deep reflections with a precision metallic flake.</p>
            <button class="button button-primary button-wide" type="button" data-action="start"><span>TAKE IT TO THE CIRCUIT</span><svg class="icon" aria-hidden="true"><use href="#ha-arrow"></use></svg></button>
          </div>
        </div>
      </section>

      <section class="ui-panel settings-screen" data-screen-panel="settings" aria-labelledby="settings-title" hidden>
        <header class="section-header">
          <button class="icon-button back-button" type="button" data-action="back" aria-label="Back to main menu">
            <svg class="icon" aria-hidden="true"><use href="#ha-back"></use></svg><span>BACK</span>
          </button>
          <div class="section-breadcrumb">HUNGER APEX <span>/</span> SETTINGS</div>
          <span class="settings-saved">AUTO-SAVED LOCALLY</span>
        </header>
        <div class="settings-layout">
          <div class="settings-heading">
            <p class="eyebrow"><span>03</span> SYSTEM CONFIGURATION</p>
            <h2 id="settings-title" data-autofocus tabindex="-1">RACE<br><span>SETUP.</span></h2>
            <p>Dial in the machine.<br>Keep the focus on the racing line.</p>
          </div>
          <div class="settings-groups">
            <section class="settings-group glass-panel" aria-labelledby="visual-settings-title">
              <div class="panel-topline"><h3 id="visual-settings-title">VISUALS & CONDITIONS</h3><span>01</span></div>
              <div class="setting-row quality-row">
                <div class="setting-copy"><label id="quality-label">RENDER QUALITY</label><p>Resolution, shadows and effects</p></div>
                <div class="segmented-control quality-control" role="group" aria-labelledby="quality-label">
                  <button type="button" data-quality="low" aria-pressed="false">LOW</button>
                  <button type="button" data-quality="medium" aria-pressed="false">MED</button>
                  <button type="button" data-quality="high" aria-pressed="true">HIGH</button>
                  <button type="button" data-quality="ultra" aria-pressed="false">ULTRA</button>
                </div>
              </div>
              <div class="setting-row">
                <div class="setting-copy"><label for="setting-wetness">TRACK WETNESS</label><p>Road grip and visual spray</p></div>
                <div class="range-control"><input id="setting-wetness" type="range" min="0" max="1" step="0.01" value="0.18" aria-label="Track wetness"><output for="setting-wetness" data-role="wetness-output">18%</output></div>
              </div>
            </section>
            <section class="settings-group glass-panel" aria-labelledby="audio-settings-title">
              <div class="panel-topline"><h3 id="audio-settings-title">AUDIO & DISPLAY</h3><span>02</span></div>
              <div class="setting-row">
                <div class="setting-copy"><label for="setting-volume">MASTER VOLUME</label><p>Engine, tires and interface</p></div>
                <div class="range-control"><input id="setting-volume" type="range" min="0" max="1" step="0.01" value="0.32" aria-label="Master volume"><output for="setting-volume" data-role="volume-output">32%</output></div>
              </div>
              <div class="setting-row button-setting-row">
                <div class="setting-copy"><span class="setting-label">AUDIO OUTPUT</span><p>Quick mute control</p></div>
                <button class="button button-secondary" type="button" data-action="mute" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#ha-mute"></use></svg><span data-role="mute-label">MUTE AUDIO</span></button>
              </div>
              <div class="setting-row button-setting-row">
                <div class="setting-copy"><span class="setting-label">FULLSCREEN</span><p>Immersive edge-to-edge view</p></div>
                <button class="button button-secondary" type="button" data-action="fullscreen"><svg class="icon" aria-hidden="true"><use href="#ha-fullscreen"></use></svg><span data-role="fullscreen-label">ENTER FULLSCREEN</span></button>
              </div>
            </section>
            <section class="settings-group glass-panel" aria-labelledby="assist-settings-title">
              <div class="panel-topline"><h3 id="assist-settings-title">DRIVING ASSISTS</h3><span>03</span></div>
              <div class="setting-row">
                <div class="setting-copy"><label for="setting-steering-sensitivity">STEERING SENSITIVITY</label><p>Lower values give a smoother, wider steering response</p></div>
                <div class="range-control"><input id="setting-steering-sensitivity" type="range" min="0.35" max="1" step="0.01" value="0.72" aria-label="Steering sensitivity"><output for="setting-steering-sensitivity" data-role="steering-sensitivity-output">72%</output></div>
              </div>
              <label class="toggle-row" for="setting-steering-assist">
                <span><strong>STEERING ASSIST</strong><small>Smooths high-speed steering inputs</small></span>
                <input id="setting-steering-assist" type="checkbox" role="switch" checked><i aria-hidden="true"></i>
              </label>
              <label class="toggle-row" for="setting-camera-shake">
                <span><strong>CAMERA SHAKE</strong><small>Dynamic impact and speed feedback</small></span>
                <input id="setting-camera-shake" type="checkbox" role="switch" checked><i aria-hidden="true"></i>
              </label>
            </section>
          </div>
        </div>
      </section>

      <section class="race-hud" data-screen-panel="race" aria-label="Race telemetry" hidden>
        <div class="hud-topbar">
          <div class="position-block">
            <span class="hud-label">POSITION</span>
            <div><strong data-role="position">01</strong><span>/ <b data-role="racer-count">04</b></span></div>
          </div>
          <div class="lap-block glass-panel">
            <div class="lap-counter"><span class="hud-label">LAP</span><strong><span data-role="lap">01</span> <small>/ <span data-role="total-laps">03</span></small></strong></div>
            <div class="time-counter"><span class="hud-label">RACE TIME</span><strong data-role="race-time">00:00.000</strong></div>
            <div class="checkpoint-block"><span class="hud-label">CHECKPOINT</span><div class="checkpoint-pips" aria-hidden="true"><i class="is-current"></i><i></i><i></i></div><span class="sr-only" data-role="checkpoint">Checkpoint 1 of 3</span></div>
          </div>
          <div class="hud-actions">
            <button class="icon-button" type="button" data-action="camera" aria-label="Change camera" title="Change camera (C)"><svg class="icon" aria-hidden="true"><use href="#ha-camera"></use></svg></button>
            <button class="icon-button" type="button" data-action="reset" aria-label="Reset vehicle" title="Reset vehicle (R)"><svg class="icon" aria-hidden="true"><use href="#ha-reset"></use></svg></button>
            <button class="icon-button" type="button" data-action="mute" aria-label="Mute audio" title="Mute audio (M)"><svg class="icon" aria-hidden="true"><use href="#ha-volume"></use></svg><span class="sr-only" data-role="hud-mute-label">Mute audio</span></button>
            <button class="icon-button pause-button" type="button" data-action="pause" aria-label="Pause race" title="Pause (Esc)"><svg class="icon" aria-hidden="true"><use href="#ha-pause"></use></svg></button>
          </div>
        </div>

        <div class="race-indicators" aria-live="polite">
          <div class="race-indicator indicator-warning" data-role="wrong-way" role="status" hidden><svg class="icon" aria-hidden="true"><use href="#ha-flag"></use></svg><strong>WRONG WAY</strong><span>TURN AROUND</span></div>
          <div class="race-indicator" data-role="offroad" role="status" hidden><strong>OFF ROAD</strong><span>REDUCED GRIP</span></div>
          <div class="race-indicator indicator-accent" data-role="drift" role="status" hidden><strong>DRIFT</strong><span>HOLD THE LINE</span></div>
        </div>

        <div class="timing-strip">
          <div><span class="hud-label">CURRENT LAP</span><strong data-role="lap-time">00:00.000</strong></div>
          <div><span class="hud-label">BEST LAP</span><strong data-role="best-lap">--:--.---</strong></div>
        </div>

        <div class="minimap-panel glass-panel">
          <div class="panel-topline"><span>NEON DUSK</span><span>ND—07</span></div>
          <canvas data-role="minimap" role="img" aria-label="Circuit minimap with racer positions">Circuit minimap</canvas>
          <div class="minimap-legend"><span><i class="legend-player" aria-hidden="true"></i> YOU</span><span><i aria-hidden="true"></i> RIVALS</span></div>
        </div>

        <div class="speed-cluster" aria-label="Vehicle speed">
          <div class="gear-block"><span class="hud-label">GEAR</span><strong data-role="gear">N</strong></div>
          <div class="speed-block">
            <div class="rpm-track" aria-hidden="true"><i data-role="rpm-fill"></i><span class="rpm-redline"></span></div>
            <div class="speed-readout"><strong data-role="speed">000</strong><span>KM/H</span></div>
            <div class="rpm-scale" aria-hidden="true"><span>0</span><span>2</span><span>4</span><span>6</span><span>8 × 1000 RPM</span></div>
          </div>
        </div>

        <div class="touch-controls" aria-label="Touch driving controls">
          <div class="touch-steering">
            <button type="button" data-control="steer-left" aria-label="Steer left"><svg class="icon" aria-hidden="true"><use href="#ha-left"></use></svg></button>
            <button type="button" data-control="steer-right" aria-label="Steer right"><svg class="icon" aria-hidden="true"><use href="#ha-right"></use></svg></button>
          </div>
          <div class="touch-pedals">
            <button class="touch-handbrake" type="button" data-control="handbrake" aria-label="Handbrake"><svg class="icon" aria-hidden="true"><use href="#ha-handbrake"></use></svg><span>HB</span></button>
            <div class="touch-pedal-pair">
              <button class="touch-brake" type="button" data-control="brake" aria-label="Brake"><svg class="icon" aria-hidden="true"><use href="#ha-brake"></use></svg><span>BRAKE</span></button>
              <button class="touch-throttle" type="button" data-control="throttle" aria-label="Throttle"><svg class="icon" aria-hidden="true"><use href="#ha-throttle"></use></svg><span>GAS</span></button>
            </div>
          </div>
        </div>
      </section>

      <div class="countdown" data-role="countdown" role="status" aria-live="assertive" hidden>
        <span class="countdown-kicker" data-role="countdown-kicker">ENGINES ONLINE</span>
        <strong data-role="countdown-value">3</strong>
        <span class="countdown-line" aria-hidden="true"></span>
      </div>

      <section class="modal-backdrop pause-screen" data-role="pause-panel" role="dialog" aria-modal="true" aria-labelledby="pause-title" hidden>
        <div class="modal-panel pause-panel glass-panel">
          <div class="panel-topline"><span>RACE CONTROL</span><span>SESSION PAUSED</span></div>
          <svg class="emblem modal-emblem" aria-hidden="true"><use href="#ha-emblem"></use></svg>
          <p class="eyebrow">TAKE A BREATH</p>
          <h2 id="pause-title">PIT<br><span>WALL.</span></h2>
          <p class="modal-description">The clock is stopped. Your racing line is waiting.</p>
          <nav class="modal-actions" aria-label="Pause menu">
            <button class="button button-primary" type="button" data-action="resume" data-autofocus><svg class="icon" aria-hidden="true"><use href="#ha-play"></use></svg><span>RESUME RACE</span><kbd>ESC</kbd></button>
            <button class="button button-secondary" type="button" data-action="restart"><svg class="icon" aria-hidden="true"><use href="#ha-reset"></use></svg><span>RESTART RACE</span></button>
            <button class="button button-quiet" type="button" data-action="back"><svg class="icon" aria-hidden="true"><use href="#ha-back"></use></svg><span>MAIN MENU</span></button>
          </nav>
        </div>
      </section>

      <section class="modal-backdrop results-screen" data-screen-panel="results" role="dialog" aria-modal="true" aria-labelledby="results-title" hidden>
        <div class="results-panel">
          <div class="results-heading">
            <p class="eyebrow"><span>ND—07</span> FINAL CLASSIFICATION</p>
            <h2 id="results-title" data-role="result-title" data-autofocus tabindex="-1">VICTORY</h2>
            <p data-role="result-subtitle">Neon Dusk · Three laps · Final result</p>
            <span class="record-badge glass-panel" data-role="result-record" hidden><svg class="icon" aria-hidden="true"><use href="#ha-trophy"></use></svg> NEW LAP RECORD</span>
          </div>
          <div class="results-body glass-panel">
            <div class="result-position-row">
              <div class="result-position"><span class="hud-label">FINISH POSITION</span><div><strong data-role="result-position">1</strong><sup data-role="result-ordinal">st</sup><span>/ <b data-role="result-field">4</b></span></div></div>
              <svg class="emblem result-emblem" aria-hidden="true"><use href="#ha-emblem"></use></svg>
            </div>
            <dl class="result-times">
              <div><dt>TOTAL TIME</dt><dd data-role="result-time">00:00.000</dd></div>
              <div><dt>BEST LAP</dt><dd class="accent-text" data-role="result-best">00:00.000</dd></div>
            </dl>
            <div class="lap-splits"><div class="panel-topline"><span>LAP SPLITS</span><span>03 LAPS</span></div><ol data-role="result-laps"></ol></div>
            <div class="result-actions">
              <button class="button button-primary" type="button" data-action="restart"><svg class="icon" aria-hidden="true"><use href="#ha-reset"></use></svg><span>RACE AGAIN</span></button>
              <button class="button button-secondary" type="button" data-action="back"><svg class="icon" aria-hidden="true"><use href="#ha-back"></use></svg><span>MAIN MENU</span></button>
            </div>
          </div>
        </div>
      </section>

      <div class="toast glass-panel" data-role="toast" role="status" aria-live="polite" hidden><i aria-hidden="true"></i><span data-role="toast-message"></span></div>
    `;

    this.panels = Array.from(root.querySelectorAll<HTMLElement>('[data-screen-panel]'));
    this.colorButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-color]'));
    this.finishButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-finish]'));
    this.qualityButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-quality]'));
    this.checkpointPips = Array.from(root.querySelectorAll<HTMLElement>('.checkpoint-pips i'));

    this.paintName = this.require('[data-role="paint-name"]');
    this.paintHex = this.require('[data-role="paint-hex"]');
    this.wetnessInput = this.require<HTMLInputElement>('#setting-wetness');
    this.wetnessOutput = this.require('[data-role="wetness-output"]');
    this.volumeInput = this.require<HTMLInputElement>('#setting-volume');
    this.volumeOutput = this.require('[data-role="volume-output"]');
    this.steeringSensitivityInput = this.require<HTMLInputElement>('#setting-steering-sensitivity');
    this.steeringSensitivityOutput = this.require('[data-role="steering-sensitivity-output"]');
    this.steeringAssistInput = this.require<HTMLInputElement>('#setting-steering-assist');
    this.cameraShakeInput = this.require<HTMLInputElement>('#setting-camera-shake');
    this.muteButton = this.require<HTMLButtonElement>('[data-screen-panel="settings"] [data-action="mute"]');
    this.muteLabel = this.require('[data-role="mute-label"]');
    this.hudMuteLabel = this.require('[data-role="hud-mute-label"]');
    this.fullscreenLabel = this.require('[data-role="fullscreen-label"]');

    this.positionValue = this.require('[data-role="position"]');
    this.racerCountValue = this.require('[data-role="racer-count"]');
    this.lapValue = this.require('[data-role="lap"]');
    this.totalLapsValue = this.require('[data-role="total-laps"]');
    this.raceTimeValue = this.require('[data-role="race-time"]');
    this.lapTimeValue = this.require('[data-role="lap-time"]');
    this.bestLapValue = this.require('[data-role="best-lap"]');
    this.checkpointValue = this.require('[data-role="checkpoint"]');
    this.speedValue = this.require('[data-role="speed"]');
    this.gearValue = this.require('[data-role="gear"]');
    this.rpmFill = this.require('[data-role="rpm-fill"]');
    this.wrongWayIndicator = this.require('[data-role="wrong-way"]');
    this.offroadIndicator = this.require('[data-role="offroad"]');
    this.driftIndicator = this.require('[data-role="drift"]');

    this.countdown = this.require('[data-role="countdown"]');
    this.countdownValue = this.require('[data-role="countdown-value"]');
    this.countdownKicker = this.require('[data-role="countdown-kicker"]');
    this.pausePanel = this.require('[data-role="pause-panel"]');
    this.resultPosition = this.require('[data-role="result-position"]');
    this.resultOrdinal = this.require('[data-role="result-ordinal"]');
    this.resultField = this.require('[data-role="result-field"]');
    this.resultTitle = this.require('[data-role="result-title"]');
    this.resultTime = this.require('[data-role="result-time"]');
    this.resultBest = this.require('[data-role="result-best"]');
    this.resultLaps = this.require('[data-role="result-laps"]');
    this.resultRecord = this.require('[data-role="result-record"]');
    this.toast = this.require('[data-role="toast"]');

    this.minimap = this.require<HTMLCanvasElement>('[data-role="minimap"]');
    this.minimapContext = this.minimap.getContext('2d');
    this.minimapObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const width = Math.round(entry.contentRect.width);
        const height = Math.round(entry.contentRect.height);
        if (width !== this.minimapSize.width || height !== this.minimapSize.height) {
          this.minimapSize = { width, height };
          this.minimapCache = null;
        }
      });
    this.minimapObserver?.observe(this.minimap);

    root.addEventListener('click', this.onClick);
    root.addEventListener('change', this.onChange);
    root.addEventListener('input', this.onInput);
    root.addEventListener('keydown', this.onKeyDown, true);
    root.addEventListener('pointerdown', this.onPointerDown, true);
    window.addEventListener('storage', this.onStorage);
    document.addEventListener('fullscreenchange', this.onFullscreenChange);

    root.dataset.screen = this.screen;
    root.dataset.paused = 'false';
    this.renderGarage();
    this.renderSettings();
  }

  showLoading(progress: number, status: string): void {
    if (this.disposed) return;
    const normalized = progress > 1 && progress <= 100 ? progress / 100 : progress;
    const value = clamp(Number.isFinite(normalized) ? normalized : 0, 0, 1);
    this.loadingVisible = true;
    this.activateScreen('loading', false);
    if (this.loadingScreen) {
      setHidden(this.loadingScreen, !this.visible);
      this.loadingScreen.setAttribute('aria-busy', 'true');
      const track = this.loadingScreen.querySelector<HTMLElement>('.loading-track');
      if (track) {
        track.setAttribute('role', 'progressbar');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', '100');
        track.setAttribute('aria-valuenow', String(Math.round(value * 100)));
        const fill = track.querySelector<HTMLElement>('i');
        if (fill) setStyle(fill, 'transform', `scaleX(${value})`);
      }
      setText(this.loadingScreen.querySelector<HTMLElement>('#loading-status') ?? this.loadingScreen, status);
    }
  }

  hideLoading(): void {
    if (this.disposed) return;
    this.loadingVisible = false;
    if (this.loadingScreen) {
      setHidden(this.loadingScreen, true);
      this.loadingScreen.setAttribute('aria-busy', 'false');
    }
  }

  showMenu(): void {
    if (this.disposed) return;
    this.settings = this.readSettings();
    this.renderGarage();
    this.renderSettings();
    this.hideLoading();
    this.hideCountdown();
    this.setPaused(false);
    this.activateScreen('menu');
  }

  showRace(): void {
    if (this.disposed) return;
    this.hideLoading();
    this.hideCountdown();
    this.setPaused(false);
    this.activateScreen('race', false);
  }

  setCountdown(text: string): void {
    if (this.disposed) return;
    setHidden(this.countdown, false);
    setText(this.countdownValue, text);
    setAttribute(this.countdown, 'data-kind', /go/i.test(text) ? 'go' : 'number');
    setText(this.countdownKicker, /go/i.test(text) ? 'FULL THROTTLE' : 'ENGINES ONLINE');
    this.countdownAnimation?.cancel();
    this.countdownAnimation = null;
    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.countdownAnimation = this.countdownValue.animate(
        [
          { opacity: 0, transform: 'translateY(18px) scale(1.28)', filter: 'blur(10px)' },
          { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)', offset: 0.2 },
          { opacity: 1, transform: 'translateY(0) scale(1)', offset: 0.78 },
          { opacity: 0, transform: 'translateY(-14px) scale(.94)', filter: 'blur(3px)' },
        ],
        { duration: /go/i.test(text) ? 720 : 900, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'none' },
      );
    }
  }

  hideCountdown(): void {
    this.countdownAnimation?.cancel();
    this.countdownAnimation = null;
    setHidden(this.countdown, true);
  }

  setPaused(paused: boolean): void {
    if (this.disposed) return;
    this.paused = paused;
    setAttribute(this.root, 'data-paused', String(paused));
    setHidden(this.pausePanel, !paused);
    if (paused) this.pausePanel.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true });
  }

  showResults(result: RaceResult): void {
    if (this.disposed) return;
    this.hideLoading();
    this.hideCountdown();
    this.setPaused(false);
    const position = clamp(Math.round(result.position) || 1, 1, Math.max(1, result.totalRacers));
    const field = Math.max(position, Math.round(result.totalRacers) || position);
    setText(this.resultPosition, String(position));
    setText(this.resultOrdinal, ordinal(position));
    setText(this.resultField, String(field).padStart(2, '0'));
    setText(this.resultTitle, position === 1 ? 'VICTORY' : 'RACE COMPLETE');
    setText(this.resultTime, formatTime(result.raceTime));
    setText(this.resultBest, formatTime(result.bestLap));
    setHidden(this.resultRecord, !result.isNewRecord);

    const fragment = this.document.createDocumentFragment();
    const best = Math.min(result.bestLap, ...result.laps, Number.POSITIVE_INFINITY);
    result.laps.forEach((lapTime, index) => {
      const row = this.document.createElement('li');
      if (Number.isFinite(lapTime) && Math.abs(lapTime - best) < 0.0005) row.className = 'is-best';
      const number = this.document.createElement('span');
      number.className = 'split-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const time = this.document.createElement('strong');
      time.textContent = formatTime(lapTime);
      const badge = this.document.createElement('small');
      badge.textContent = Number.isFinite(lapTime) && Math.abs(lapTime - best) < 0.0005 ? 'BEST' : '';
      row.append(number, time, badge);
      fragment.append(row);
    });
    if (result.laps.length === 0) {
      const row = this.document.createElement('li');
      row.className = 'empty-splits';
      row.textContent = 'No completed laps';
      fragment.append(row);
    }
    this.resultLaps.replaceChildren(fragment);
    this.activateScreen('results');
  }

  update(
    telemetry: Telemetry,
    track: Track,
    racers: ReadonlyArray<{ position: import('three').Vector3; isPlayer: boolean }>,
  ): void {
    if (this.disposed || !this.visible || this.screen !== 'race' || this.paused) return;

    const totalLaps = Math.max(1, Math.round(telemetry.totalLaps));
    const lap = clamp(Math.round(telemetry.lap) || 1, 1, totalLaps);
    const totalRacers = Math.max(1, Math.round(telemetry.totalRacers));
    const position = clamp(Math.round(telemetry.position) || 1, 1, totalRacers);
    const checkpoint = clamp(Math.round(telemetry.checkpoint) || 0, 0, 2);
    const speed = Math.round(Math.abs(telemetry.speed));
    const rpm = clamp(telemetry.rpm / 8000, 0, 1);

    setText(this.positionValue, String(position).padStart(2, '0'));
    setText(this.racerCountValue, String(totalRacers).padStart(2, '0'));
    setText(this.lapValue, String(lap).padStart(2, '0'));
    setText(this.totalLapsValue, String(totalLaps).padStart(2, '0'));
    setText(this.raceTimeValue, formatTime(telemetry.raceTime));
    setText(this.lapTimeValue, formatTime(telemetry.lapTime));
    setText(this.bestLapValue, telemetry.bestLap === null ? '--:--.---' : formatTime(telemetry.bestLap));
    setText(this.checkpointValue, `Checkpoint ${checkpoint + 1} of 3`);
    setText(this.speedValue, String(speed).padStart(3, '0'));
    setText(this.gearValue, telemetry.gear < 0 ? 'R' : telemetry.gear === 0 ? 'N' : String(telemetry.gear));
    setStyle(this.rpmFill, 'transform', `scaleX(${rpm.toFixed(3)})`);
    setAttribute(this.rpmFill.parentElement ?? this.rpmFill, 'aria-label', `${Math.round(telemetry.rpm)} RPM`);

    this.checkpointPips.forEach((pip, index) => {
      pip.classList.toggle('is-complete', index < checkpoint);
      pip.classList.toggle('is-current', index === checkpoint);
    });
    setHidden(this.wrongWayIndicator, !telemetry.wrongWay);
    setHidden(this.offroadIndicator, !telemetry.offroad);
    setHidden(this.driftIndicator, !telemetry.drifting);
    this.drawMinimap(track, racers);
  }

  notify(message: string): void {
    if (this.disposed) return;
    if (this.toastTimer !== null) clearTimeout(this.toastTimer);
    setText(this.require('[data-role="toast-message"]'), message);
    setHidden(this.toast, false);
    this.toast.classList.remove('is-visible');
    void this.toast.offsetWidth;
    this.toast.classList.add('is-visible');
    this.toastTimer = setTimeout(() => {
      this.toast.classList.remove('is-visible');
      this.toastTimer = setTimeout(() => setHidden(this.toast, true), 220);
    }, 2800);
  }

  setVisible(visible: boolean): void {
    if (this.disposed) return;
    this.visible = visible;
    setHidden(this.root, !visible);
    if (this.loadingScreen) setHidden(this.loadingScreen, !visible || !this.loadingVisible);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.root.removeEventListener('click', this.onClick);
    this.root.removeEventListener('change', this.onChange);
    this.root.removeEventListener('input', this.onInput);
    this.root.removeEventListener('keydown', this.onKeyDown, true);
    this.root.removeEventListener('pointerdown', this.onPointerDown, true);
    window.removeEventListener('storage', this.onStorage);
    this.document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    this.minimapObserver?.disconnect();
    this.countdownAnimation?.cancel();
    if (this.toastTimer !== null) clearTimeout(this.toastTimer);
    this.minimapCache = null;
    this.minimapContext = null;
    this.root.replaceChildren();
  }

  private require<T extends HTMLElement = HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) throw new Error(`UI element not found: ${selector}`);
    return element;
  }

  private readSettings(): GameSettings {
    try {
      const stored = window.localStorage.getItem(SETTINGS_KEY);
      return normalizeSettings(stored === null ? null : JSON.parse(stored));
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  private commitSettings(patch: Partial<GameSettings>): GameSettings {
    const next = normalizeSettings({ ...this.readSettings(), ...patch });
    this.settings = next;
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // Storage can be unavailable in private/embedded contexts; the session still works.
    }
    setStyle(this.root, '--paint-color', next.paintColor);
    return next;
  }

  private activateScreen(screen: Screen, focus = true): void {
    this.screen = screen;
    setAttribute(this.root, 'data-screen', screen);
    this.panels.forEach((panel) => setHidden(panel, panel.dataset.screenPanel !== screen));
    if (focus) {
      this.root.querySelector<HTMLElement>(`[data-screen-panel="${screen}"] [data-autofocus]`)?.focus({ preventScroll: true });
    }
  }

  private showGarage(): void {
    this.settings = this.readSettings();
    this.renderGarage();
    this.hideLoading();
    this.setPaused(false);
    this.activateScreen('garage');
  }

  private showSettings(): void {
    this.settings = this.readSettings();
    this.renderSettings();
    this.hideLoading();
    this.setPaused(false);
    this.activateScreen('settings');
  }

  private renderGarage(): void {
    const color = this.settings.paintColor;
    const paint = PAINTS.find((entry) => entry.hex === color);
    setText(this.paintName, paint?.name ?? 'Custom Paint');
    setText(this.paintHex, color.toUpperCase());
    setStyle(this.root, '--paint-color', color);
    this.colorButtons.forEach((button) => {
      setAttribute(button, 'aria-pressed', String(button.dataset.color?.toLowerCase() === color));
    });
    this.finishButtons.forEach((button) => {
      setAttribute(button, 'aria-pressed', String(button.dataset.finish === this.settings.paintFinish));
    });
    const descriptions: Record<PaintFinish, string> = {
      metallic: 'Deep reflections with a precision metallic flake.',
      pearl: 'Luminous depth with a soft, color-shifting finish.',
      satin: 'Low-gloss precision with a clean motorsport character.',
    };
    setText(this.require('[data-role="finish-description"]'), descriptions[this.settings.paintFinish]);
  }

  private renderSettings(): void {
    this.qualityButtons.forEach((button) => {
      setAttribute(button, 'aria-pressed', String(button.dataset.quality === this.settings.quality));
    });
    if (this.wetnessInput.value !== String(this.settings.wetness)) this.wetnessInput.value = String(this.settings.wetness);
    if (this.volumeInput.value !== String(this.settings.volume)) this.volumeInput.value = String(this.settings.volume);
    setText(this.wetnessOutput, `${Math.round(this.settings.wetness * 100)}%`);
    setText(this.volumeOutput, `${Math.round(this.settings.volume * 100)}%`);
    if (this.steeringSensitivityInput.value !== String(this.settings.steeringSensitivity)) this.steeringSensitivityInput.value = String(this.settings.steeringSensitivity);
    setText(this.steeringSensitivityOutput, `${Math.round(this.settings.steeringSensitivity * 100)}%`);
    this.steeringAssistInput.checked = this.settings.steeringAssist;
    this.cameraShakeInput.checked = this.settings.cameraShake;
    setText(this.muteLabel, this.settings.muted ? 'UNMUTE AUDIO' : 'MUTE AUDIO');
    setText(this.hudMuteLabel, this.settings.muted ? 'Unmute audio' : 'Mute audio');
    setAttribute(this.muteButton, 'aria-pressed', String(this.settings.muted));
    setAttribute(this.muteButton, 'aria-label', this.settings.muted ? 'Unmute audio' : 'Mute audio');
    const hudMute = this.root.querySelector<HTMLElement>('[data-screen-panel="race"] [data-action="mute"]');
    if (hudMute) setAttribute(hudMute, 'aria-label', this.settings.muted ? 'Unmute audio' : 'Mute audio');
    setText(this.fullscreenLabel, this.document.fullscreenElement ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN');
  }

  private dispatchAction(action: UIAction): void {
    switch (action) {
      case 'garage':
        this.showGarage();
        break;
      case 'settings':
        this.showSettings();
        break;
      case 'back':
        this.showMenu();
        break;
      case 'pause':
        this.setPaused(true);
        break;
      case 'resume':
        this.setPaused(false);
        break;
      case 'restart':
        this.setPaused(false);
        break;
      case 'mute': {
        const muted = !this.readSettings().muted;
        this.commitSettings({ muted });
        this.renderSettings();
        break;
      }
      default:
        break;
    }
    this.callbacks.onAction(action);
  }

  private readonly onClick = (event: MouseEvent): void => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('button, a, input');
    if (!target || !this.root.contains(target)) return;
    event.stopPropagation();

    const action = target.closest<HTMLElement>('[data-action]')?.dataset.action as UIAction | undefined;
    if (action && ACTIONS.has(action)) {
      if (target instanceof HTMLAnchorElement) event.preventDefault();
      this.dispatchAction(action);
      return;
    }

    const color = target.closest<HTMLElement>('[data-color]')?.dataset.color;
    if (color && /^#[0-9a-f]{6}$/i.test(color) && PAINTS.some((paint) => paint.hex === color.toLowerCase())) {
      this.commitSettings({ paintColor: color.toLowerCase() });
      this.renderGarage();
      this.callbacks.onColor(color.toLowerCase());
      return;
    }

    const finish = target.closest<HTMLElement>('[data-finish]')?.dataset.finish as PaintFinish | undefined;
    if (finish && FINISHES.includes(finish)) {
      this.commitSettings({ paintFinish: finish });
      this.renderGarage();
      this.callbacks.onFinish(finish);
      return;
    }

    const quality = target.closest<HTMLElement>('[data-quality]')?.dataset.quality as QualityPreset | undefined;
    if (quality && QUALITIES.includes(quality)) {
      this.commitSettings({ quality });
      this.renderSettings();
      this.callbacks.onQuality(quality);
    }
  };

  private readonly onInput = (event: Event): void => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    event.stopPropagation();
    if (input === this.wetnessInput) {
      const value = clamp(Number.parseFloat(input.value) || 0, 0, 1);
      this.commitSettings({ wetness: value });
      setText(this.wetnessOutput, `${Math.round(value * 100)}%`);
      this.callbacks.onWetness(value);
    } else if (input === this.volumeInput) {
      const value = clamp(Number.parseFloat(input.value) || 0, 0, 1);
      this.commitSettings({ volume: value });
      setText(this.volumeOutput, `${Math.round(value * 100)}%`);
      this.callbacks.onVolume(value);
    } else if (input === this.steeringSensitivityInput) {
      const value = clamp(Number.parseFloat(input.value) || DEFAULT_SETTINGS.steeringSensitivity, 0.35, 1);
      this.commitSettings({ steeringSensitivity: value });
      setText(this.steeringSensitivityOutput, `${Math.round(value * 100)}%`);
      this.callbacks.onSteeringSensitivity(value);
    }
  };

  private readonly onChange = (event: Event): void => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    event.stopPropagation();
    if (input !== this.steeringAssistInput && input !== this.cameraShakeInput) return;
    this.commitSettings({ steeringAssist: this.steeringAssistInput.checked, cameraShake: this.cameraShakeInput.checked });
    this.callbacks.onAssists(this.steeringAssistInput.checked, this.cameraShakeInput.checked);
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !this.root.contains(target)) return;
    const interactive = target.closest<HTMLElement>('button, a[href], input, select, textarea, [role="switch"]');
    if (!interactive) return;
    // Preserve native activation/range keys while leaving Esc/C/R/M/F gameplay shortcuts intact.
    if (interactive.matches('input, select, textarea') || event.code === 'Enter' || event.code === 'Space') {
      event.stopPropagation();
    }
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-control], [data-action], input, label');
    if (!target || !this.root.contains(target)) return;
    // Touch driving events must reach InputManager; menu/HUD pointers must not reach the canvas.
    if (!target.closest('[data-control]')) event.stopPropagation();
  };

  private readonly onStorage = (event: StorageEvent): void => {
    if (event.key !== null && event.key !== SETTINGS_KEY) return;
    this.settings = this.readSettings();
    this.renderGarage();
    this.renderSettings();
  };

  private readonly onFullscreenChange = (): void => {
    this.renderSettings();
  };

  private ensureMinimapCache(track: Track): MinimapCache | null {
    if (!this.minimapContext) return null;
    const width = this.minimapSize.width || this.minimap.clientWidth || 180;
    const height = this.minimapSize.height || this.minimap.clientHeight || 140;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    if (this.minimapCache?.track === track
      && this.minimapCache.width === width
      && this.minimapCache.height === height
      && this.minimapCache.dpr === dpr) return this.minimapCache;

    const canvas = this.document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const points: Array<{ x: number; z: number }> = [];
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minZ = Number.POSITIVE_INFINITY;
    let maxZ = Number.NEGATIVE_INFINITY;
    const stride = Math.max(1, Math.floor(track.samples.length / 240));
    for (let index = 0; index < track.samples.length; index += stride) {
      const position = track.samples[index].position;
      points.push({ x: position.x, z: position.z });
      minX = Math.min(minX, position.x);
      maxX = Math.max(maxX, position.x);
      minZ = Math.min(minZ, position.z);
      maxZ = Math.max(maxZ, position.z);
    }
    if (points.length === 0 || !Number.isFinite(minX + maxX + minZ + maxZ)) return null;

    const padding = Math.min(22, Math.min(width, height) * 0.14);
    const scale = Math.min(
      (width - padding * 2) / Math.max(1, maxX - minX),
      (height - padding * 2) / Math.max(1, maxZ - minZ),
    );
    const offsetX = (width - (maxX - minX) * scale) / 2;
    const offsetY = (height - (maxZ - minZ) * scale) / 2;
    const project = (x: number, z: number): { x: number; y: number } => ({
      x: offsetX + (x - minX) * scale,
      y: offsetY + (maxZ - z) * scale,
    });

    context.strokeStyle = 'rgba(216,255,62,.055)';
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 12; x < width; x += 24) {
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }
    for (let y = 12; y < height; y += 24) {
      context.moveTo(0, y);
      context.lineTo(width, y);
    }
    context.stroke();

    const path = new Path2D();
    points.forEach((point, index) => {
      const mapped = project(point.x, point.z);
      if (index === 0) path.moveTo(mapped.x, mapped.y);
      else path.lineTo(mapped.x, mapped.y);
    });
    path.closePath();
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = 'rgba(0,0,0,.85)';
    context.lineWidth = 10;
    context.stroke(path);
    context.strokeStyle = 'rgba(255,255,255,.24)';
    context.lineWidth = 4;
    context.stroke(path);
    context.strokeStyle = 'rgba(255,255,255,.08)';
    context.lineWidth = 1;
    context.stroke(path);

    const startIndex = Math.round((track.startDistance / track.totalLength) * track.samples.length) % track.samples.length;
    const start = track.samples[startIndex];
    const normalLength = 7 / Math.max(0.001, scale);
    const nx = -start.tangent.z * normalLength;
    const nz = start.tangent.x * normalLength;
    const startA = project(start.position.x + nx, start.position.z + nz);
    const startB = project(start.position.x - nx, start.position.z - nz);
    context.strokeStyle = '#d8ff3e';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(startA.x, startA.y);
    context.lineTo(startB.x, startB.y);
    context.stroke();

    context.fillStyle = 'rgba(255,255,255,.35)';
    context.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
    context.textAlign = 'right';
    context.fillText('N', width - 9, 14);

    this.minimapSize = { width, height };
    this.minimapCache = { track, width, height, dpr, canvas, project };
    if (this.minimap.width !== canvas.width) this.minimap.width = canvas.width;
    if (this.minimap.height !== canvas.height) this.minimap.height = canvas.height;
    return this.minimapCache;
  }

  private drawMinimap(
    track: Track,
    racers: ReadonlyArray<{ position: import('three').Vector3; isPlayer: boolean }>,
  ): void {
    const context = this.minimapContext;
    const cache = this.ensureMinimapCache(track);
    if (!context || !cache) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.minimap.width, this.minimap.height);
    context.drawImage(cache.canvas, 0, 0);
    context.setTransform(cache.dpr, 0, 0, cache.dpr, 0, 0);

    const drawRacer = (racer: { position: import('three').Vector3; isPlayer: boolean }): void => {
      if (!Number.isFinite(racer.position.x + racer.position.z)) return;
      const point = cache.project(racer.position.x, racer.position.z);
      context.beginPath();
      context.arc(point.x, point.y, racer.isPlayer ? 4.2 : 3, 0, Math.PI * 2);
      context.fillStyle = racer.isPlayer ? '#d8ff3e' : 'rgba(245,247,242,.86)';
      context.shadowColor = racer.isPlayer ? '#d8ff3e' : 'rgba(255,255,255,.35)';
      context.shadowBlur = racer.isPlayer ? 9 : 4;
      context.fill();
      context.shadowBlur = 0;
      if (racer.isPlayer) {
        context.strokeStyle = 'rgba(8,10,11,.9)';
        context.lineWidth = 1.5;
        context.stroke();
      }
    };
    racers.filter((racer) => !racer.isPlayer).forEach(drawRacer);
    racers.filter((racer) => racer.isPlayer).forEach(drawRacer);
  }
}
