/** Fully synthesised audio — no external files. Unlocked on first user gesture. */

export interface AudioTelemetry {
  rpm01: number;
  throttle: number;
  speed01: number;
  slip: number;
  nitro: boolean;
  offRoad: boolean;
  rain: number;
  impact: number;
}

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private engineGain!: GainNode;
  private engineFilter!: BiquadFilterNode;
  private oscA!: OscillatorNode;
  private oscB!: OscillatorNode;
  private oscC!: OscillatorNode;
  private tyreGain!: GainNode;
  private windGain!: GainNode;
  private nitroGain!: GainNode;
  private rainGain!: GainNode;
  private musicGain!: GainNode;
  private noiseBuffer!: AudioBuffer;
  private started = false;
  private musicTimer = 0;
  private musicStep = 0;
  private nextNoteTime = 0;
  private volume = 0.75;
  private muted = false;
  private musicEnabled = true;

  constructor() {
    const unlock = (): void => {
      void this.init();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
  }

  async init(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      return;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.volume;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -9;
    limiter.knee.value = 12;
    limiter.ratio.value = 9;
    limiter.attack.value = 0.004;
    limiter.release.value = 0.18;
    this.master.connect(limiter).connect(ctx.destination);

    // Shared white-noise buffer.
    const len = Math.floor(ctx.sampleRate * 2);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = white * 0.7 + last * 2.5;
    }
    this.noiseBuffer = buffer;

    // Engine: three detuned oscillators through a resonant low-pass + soft clip.
    this.engineFilter = ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 500;
    this.engineFilter.Q.value = 4.5;
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < curve.length; i += 1) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(x * 2.2) * 0.8;
    }
    shaper.curve = curve;
    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0;
    this.engineFilter.connect(shaper).connect(this.engineGain).connect(this.master);

    this.oscA = ctx.createOscillator();
    this.oscA.type = 'sawtooth';
    this.oscB = ctx.createOscillator();
    this.oscB.type = 'square';
    this.oscC = ctx.createOscillator();
    this.oscC.type = 'sawtooth';
    const aGain = ctx.createGain(); aGain.gain.value = 0.5;
    const bGain = ctx.createGain(); bGain.gain.value = 0.16;
    const cGain = ctx.createGain(); cGain.gain.value = 0.3;
    this.oscA.connect(aGain).connect(this.engineFilter);
    this.oscB.connect(bGain).connect(this.engineFilter);
    this.oscC.connect(cGain).connect(this.engineFilter);
    this.oscA.start(); this.oscB.start(); this.oscC.start();

    // Noise beds.
    this.tyreGain = this.makeNoiseBand('bandpass', 1450, 2.2, 0);
    this.windGain = this.makeNoiseBand('lowpass', 520, 0.7, 0);
    this.nitroGain = this.makeNoiseBand('highpass', 2400, 0.8, 0);
    this.rainGain = this.makeNoiseBand('lowpass', 3200, 0.6, 0);
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.0;
    this.musicGain.connect(this.master);

    this.started = true;
    this.nextNoteTime = ctx.currentTime;
  }

  private makeNoiseBand(type: BiquadFilterType, freq: number, q: number, gain: number): GainNode {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const out = ctx.createGain();
    out.gain.value = gain;
    src.connect(filter).connect(out).connect(this.master);
    src.start();
    return out;
  }

  setVolume(v: number): void {
    this.volume = Math.min(1, Math.max(0, v));
    this.applyMaster();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyMaster();
  }

  setMusic(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(enabled ? 0.16 : 0, this.ctx!.currentTime, 0.4);
  }

  private applyMaster(): void {
    if (!this.ctx) return;
    this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
  }

  update(t: AudioTelemetry, dt: number): void {
    if (!this.started || !this.ctx) return;
    const now = this.ctx.currentTime;
    const rpm = 45 + t.rpm01 * 185;
    this.oscA.frequency.setTargetAtTime(rpm, now, 0.045);
    this.oscB.frequency.setTargetAtTime(rpm * 0.5, now, 0.045);
    this.oscC.frequency.setTargetAtTime(rpm * 1.5, now, 0.045);
    this.engineFilter.frequency.setTargetAtTime(380 + t.rpm01 * 2800 + t.throttle * 900, now, 0.06);
    this.engineGain.gain.setTargetAtTime(0.055 + t.throttle * 0.11 + t.rpm01 * 0.04, now, 0.08);
    this.tyreGain.gain.setTargetAtTime(Math.min(0.26, t.slip * 0.3 + (t.offRoad ? 0.1 : 0)) * (0.3 + t.speed01), now, 0.08);
    this.windGain.gain.setTargetAtTime(Math.pow(t.speed01, 2.2) * 0.16, now, 0.15);
    this.nitroGain.gain.setTargetAtTime(t.nitro ? 0.11 : 0, now, 0.08);
    this.rainGain.gain.setTargetAtTime(t.rain * 0.1, now, 0.3);
    if (t.impact > 0.02) this.impact(t.impact);
    if (this.musicEnabled) this.scheduleMusic(dt);
  }

  beep(freq = 720, duration = 0.12, volume = 0.18, type: OscillatorType = 'sine'): void {
    if (!this.ctx || !this.started) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), ctx.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.03);
  }

  countdown(go: boolean): void {
    this.beep(go ? 1180 : 620, go ? 0.42 : 0.14, 0.24, 'square');
  }

  impact(strength: number): void {
    if (!this.ctx || !this.started) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 180 + strength * 420;
    filter.Q.value = 0.9;
    const gain = ctx.createGain();
    const amp = Math.min(0.3, strength * 0.32);
    gain.gain.setValueAtTime(amp, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    src.stop(ctx.currentTime + 0.25);
  }

  private scheduleMusic(dt: number): void {
    const ctx = this.ctx!;
    this.musicTimer -= dt;
    if (this.musicTimer > 0) return;
    this.musicTimer = 60 / 96 / 4; // 16th notes at 96 BPM
    const step = this.musicStep % 32;
    const roots = [55, 49, 58.27, 51.91]; // A1 G1 Bb1 Eb1 — 8 steps per chord
    const root = roots[Math.floor(step / 8) % roots.length];
    const t = Math.max(ctx.currentTime, this.nextNoteTime);
    this.nextNoteTime = t + this.musicTimer;

    // Sub bass on every 8th.
    if (step % 2 === 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = root;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      osc.connect(g).connect(this.musicGain);
      osc.start(t);
      osc.stop(t + 0.24);
    }
    // Arp on offbeats.
    if (step % 2 === 1) {
      const pattern = [0, 7, 12, 15, 12, 7, 3, 7];
      const semis = pattern[step % pattern.length];
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = root * 8 * Math.pow(2, semis / 12);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      osc.connect(g).connect(this.musicGain);
      osc.start(t);
      osc.stop(t + 0.16);
    }
    // Kick on quarters, hat on eighths.
    if (step % 4 === 0) this.percussion(t, 'kick');
    if (step % 2 === 0) this.percussion(t, 'hat');
    this.musicStep += 1;
  }

  private percussion(t: number, kind: 'kick' | 'hat'): void {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = kind === 'kick' ? 'lowpass' : 'highpass';
    filter.frequency.value = kind === 'kick' ? 120 : 7000;
    const gain = ctx.createGain();
    const dur = kind === 'kick' ? 0.2 : 0.035;
    gain.gain.setValueAtTime(kind === 'kick' ? 0.2 : 0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter).connect(gain).connect(this.musicGain);
    src.start(t);
    src.stop(t + dur + 0.02);
  }
}
