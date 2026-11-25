import { clamp } from './Math';

interface Voice {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  filter: BiquadFilterNode;
  gain: GainNode;
}

/** Fully synthesized audio: engine, skid, wind, nitro, impacts, UI. No assets. */
export class AudioSystem {
  muted = false;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private voice: Voice | null = null;
  private skidGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private nitroGain: GainNode | null = null;

  /** Must be called from a user gesture. Safe to call repeatedly. */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
    } catch {
      return;
    }
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.55;
    this.master.connect(this.ctx.destination);
    this.startEngine();
    this.startNoise();
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(m ? 0 : 0.55, this.ctx.currentTime, 0.05);
    }
  }

  private startEngine(): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 70;
    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.value = 35;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 2.5;
    const gain = ctx.createGain();
    gain.gain.value = 0.16;
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    osc1.start();
    osc2.start();
    this.voice = { osc1, osc2, filter, gain };
  }

  private noiseBuffer(): AudioBuffer {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  private startNoise(): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const buf = this.noiseBuffer();
    const mk = (type: BiquadFilterType, freq: number, q: number): { src: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = freq;
      filter.Q.value = q;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.master!);
      src.start();
      return { src, filter, gain };
    };
    const skid = mk('bandpass', 1400, 1.2);
    const wind = mk('lowpass', 500, 0.6);
    const nitro = mk('highpass', 2600, 0.8);
    this.skidGain = skid.gain;
    this.windGain = wind.gain;
    this.windFilter = wind.filter;
    this.nitroGain = nitro.gain;
  }

  /** Per-frame vehicle audio. All inputs normalized. */
  updateEngine(rpm: number, speedAbs: number, skid: number, nitro: boolean, dt: number): void {
    if (!this.ctx || !this.voice) return;
    const t = this.ctx.currentTime;
    const rev = clamp(rpm / 8000, 0, 1);
    const f = 55 + rev * 260;
    this.voice.osc1.frequency.setTargetAtTime(f, t, 0.03);
    this.voice.osc2.frequency.setTargetAtTime(f * 0.5 + 3, t, 0.03);
    this.voice.filter.frequency.setTargetAtTime(500 + rev * 3200, t, 0.05);
    this.skidGain?.gain.setTargetAtTime(clamp(skid, 0, 1) * 0.14, t, 0.06);
    this.windGain?.gain.setTargetAtTime(clamp(speedAbs / 90, 0, 1) * 0.1, t, 0.1);
    this.windFilter?.frequency.setTargetAtTime(300 + clamp(speedAbs / 90, 0, 1) * 1400, t, 0.1);
    this.nitroGain?.gain.setTargetAtTime(nitro ? 0.09 : 0, t, 0.08);
    void dt;
  }

  engineSilent(): void {
    if (!this.ctx || !this.voice) return;
    const t = this.ctx.currentTime;
    this.voice.gain.gain.setTargetAtTime(0.0, t, 0.1);
    this.skidGain?.gain.setTargetAtTime(0, t, 0.1);
    this.windGain?.gain.setTargetAtTime(0, t, 0.1);
    this.nitroGain?.gain.setTargetAtTime(0, t, 0.1);
  }

  engineAudible(): void {
    if (!this.ctx || !this.voice) return;
    this.voice.gain.gain.setTargetAtTime(0.16, this.ctx.currentTime, 0.2);
  }

  beep(freq = 660, dur = 0.09, type: OscillatorType = 'sine', vol = 0.25): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g);
    g.connect(this.master);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  }

  countdown(final: boolean): void {
    this.beep(final ? 880 : 440, final ? 0.35 : 0.14, 'square', 0.18);
  }

  impact(strength: number): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const dur = 0.18;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.value = clamp(strength, 0, 1) * 0.5;
    src.connect(f);
    f.connect(g);
    g.connect(this.master);
    src.start();
  }
}
