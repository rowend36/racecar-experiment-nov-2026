import { clamp } from './Math';

/**
 * Fully procedural audio: layered engine synthesis, tyre/wind/nitro noise,
 * impacts, countdown beeps and a scheduled synthwave score. Zero assets.
 */
export class AudioSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private engine: {
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    sub: OscillatorNode;
    filter: BiquadFilterNode;
    gain: GainNode;
    noiseGain: GainNode;
    noiseFilter: BiquadFilterNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
  } | null = null;

  private tireGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private nitroGain: GainNode | null = null;
  private rainGain: GainNode | null = null;

  private musicTimer: number | null = null;
  private nextNote = 0;
  private step = 0;
  private musicOn = false;
  private lastImpact = 0;
  private muted = false;
  private lastGear = 0;

  init(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;
    void ctx.resume();

    const master = ctx.createGain();
    master.gain.value = this.muted ? 0.0001 : 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 22;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.22;
    master.connect(comp).connect(ctx.destination);
    this.master = master;

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.85;
    this.sfxBus.connect(master);
    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0.33;
    this.musicBus.connect(master);

    this.noiseBuffer = this.makeNoise(ctx, 2.0);
    this.buildEngine();
    this.buildLoops();
  }

  private makeNoise(ctx: AudioContext, seconds: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buffer;
  }

  private noiseSource(loop = false): AudioBufferSourceNode | null {
    if (!this.ctx || !this.noiseBuffer) return null;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = loop;
    return src;
  }

  private buildEngine(): void {
    const ctx = this.ctx;
    const bus = this.sfxBus;
    if (!ctx || !bus) return;
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.detune.value = 9;
    const sub = ctx.createOscillator();
    sub.type = 'square';

    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.32;
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      curve[i] = Math.tanh(x * 2.6);
    }
    shaper.curve = curve;
    shaper.oversample = '2x';

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 5.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.0001;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 6;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain).connect(filter.frequency);

    osc1.connect(oscGain);
    osc2.connect(oscGain);
    sub.connect(oscGain);
    oscGain.connect(shaper).connect(filter).connect(gain).connect(bus);

    const noise = this.noiseSource(true);
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 420;
    noiseFilter.Q.value = 1.1;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.0001;
    if (noise) noise.connect(noiseFilter).connect(noiseGain).connect(bus);
    noise?.start();

    osc1.start();
    osc2.start();
    sub.start();
    lfo.start();

    this.engine = { osc1, osc2, sub, filter, gain, noiseGain, noiseFilter, lfo, lfoGain };
  }

  private buildLoops(): void {
    const ctx = this.ctx;
    const bus = this.sfxBus;
    if (!ctx || !bus) return;

    const makeNoiseLoop = (type: BiquadFilterType, freq: number, q: number): GainNode => {
      const src = this.noiseSource(true);
      const filter = ctx.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = freq;
      filter.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      if (src) src.connect(filter).connect(g).connect(bus);
      src?.start();
      return g;
    };
    this.tireGain = makeNoiseLoop('bandpass', 1650, 3.2);
    this.windGain = makeNoiseLoop('lowpass', 620, 0.7);
    this.nitroGain = makeNoiseLoop('highpass', 1100, 0.8);
    this.rainGain = makeNoiseLoop('lowpass', 2400, 0.5);
  }

  updateEngine(rpm: number, throttle: number, speed01: number, boost: boolean, gear: number, active: boolean): void {
    const ctx = this.ctx;
    const eng = this.engine;
    if (!ctx || !eng) return;
    const t = ctx.currentTime;
    const base = 26 + (rpm / 8000) * 146;
    eng.osc1.frequency.setTargetAtTime(base, t, 0.04);
    eng.osc2.frequency.setTargetAtTime(base * 1.006, t, 0.04);
    eng.sub.frequency.setTargetAtTime(base * 0.5, t, 0.04);
    const cutoff = 240 + (rpm / 8000) * 2400 + throttle * 900 + (boost ? 500 : 0);
    eng.filter.frequency.setTargetAtTime(cutoff, t, 0.05);
    eng.lfo.frequency.setTargetAtTime(3.5 + (rpm / 8000) * 8, t, 0.1);
    const target = active ? 0.045 + throttle * 0.055 + speed01 * 0.025 + (boost ? 0.02 : 0) : 0.0001;
    eng.gain.gain.setTargetAtTime(target, t, 0.08);
    eng.noiseFilter.frequency.setTargetAtTime(320 + throttle * 500 + (rpm / 8000) * 260, t, 0.06);
    eng.noiseGain.gain.setTargetAtTime(active ? 0.008 + throttle * 0.018 : 0.0001, t, 0.09);
    if (gear !== this.lastGear) {
      if (active && this.lastGear !== 0) this.shiftPop();
      this.lastGear = gear;
    }
  }

  updateTyres(slip: number, speed01: number): void {
    if (!this.ctx || !this.tireGain) return;
    const target = clamp(slip * 0.19 + (slip > 0.35 ? 0.03 : 0), 0, 0.22) * clamp(speed01 * 2.5, 0, 1);
    this.tireGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
  }

  updateWind(speed01: number): void {
    if (!this.ctx || !this.windGain) return;
    const target = clamp(speed01 * speed01 * 0.14, 0, 0.13);
    this.windGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.2);
  }

  updateNitro(active: boolean): void {
    if (!this.ctx || !this.nitroGain) return;
    this.nitroGain.gain.setTargetAtTime(active ? 0.085 : 0.0001, this.ctx.currentTime, 0.09);
  }

  setRain(on: boolean): void {
    if (!this.ctx || !this.rainGain) return;
    this.rainGain.gain.setTargetAtTime(on ? 0.045 : 0.0001, this.ctx.currentTime, 0.5);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(muted ? 0.0001 : 0.9, this.ctx.currentTime, 0.05);
    }
  }

  get isMuted(): boolean {
    return this.muted;
  }

  private tone(
    freq: number,
    start: number,
    duration: number,
    type: OscillatorType,
    peak: number,
    dest: AudioNode,
    filterFreq?: number,
    attack = 0.008,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    let node: AudioNode = gain;
    if (filterFreq) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = filterFreq;
      filter.Q.value = 1.2;
      gain.connect(filter);
      node = filter;
    }
    osc.connect(gain);
    node.connect(dest);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  private noiseBurst(
    start: number,
    duration: number,
    peak: number,
    filterType: BiquadFilterType,
    freq: number,
    q: number,
    dest: AudioNode,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const src = this.noiseSource(false);
    if (!src) return;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.max(0.0002, peak), start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    src.connect(filter).connect(gain).connect(dest);
    src.start(start);
    src.stop(start + duration + 0.05);
  }

  private kick(start: number): void {
    const ctx = this.ctx;
    const dest = this.musicBus;
    if (!ctx || !dest) return;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(132, start);
    osc.frequency.exponentialRampToValueAtTime(42, start + 0.16);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.26);
    osc.connect(gain).connect(dest);
    osc.start(start);
    osc.stop(start + 0.3);
  }

  private shiftPop(): void {
    if (!this.ctx || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    this.noiseBurst(t, 0.07, 0.06, 'bandpass', 900, 1.5, this.sfxBus);
    this.tone(90, t, 0.06, 'square', 0.05, this.sfxBus, 700);
  }

  impact(strength: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const now = performance.now();
    if (now - this.lastImpact < 70) return;
    this.lastImpact = now;
    const t = this.ctx.currentTime;
    const s = clamp(strength, 0.1, 1);
    this.noiseBurst(t, 0.18 + s * 0.16, 0.18 * s, 'lowpass', 900, 0.8, this.sfxBus);
    this.tone(70 - s * 20, t, 0.22, 'sine', 0.22 * s, this.sfxBus, 220);
  }

  scrape(strength: number): void {
    if (!this.ctx || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    this.noiseBurst(t, 0.1, 0.05 * strength, 'bandpass', 2600, 2.4, this.sfxBus);
  }

  beep(freq = 660, duration = 0.14, volume = 0.18, type: OscillatorType = 'square'): void {
    if (!this.ctx || !this.sfxBus) return;
    this.tone(freq, this.ctx.currentTime + 0.01, duration, type, volume, this.sfxBus, 1800, 0.01);
  }

  countdown(n: number): void {
    if (n > 0) this.beep(520, 0.11, 0.16, 'square');
    else this.beep(1180, 0.5, 0.2, 'sawtooth');
  }

  thunder(): void {
    if (!this.ctx || !this.sfxBus) return;
    const t = this.ctx.currentTime;
    this.noiseBurst(t + 0.05, 1.8, 0.2, 'lowpass', 160, 0.6, this.sfxBus);
  }

  startMusic(): void {
    if (!this.ctx || this.musicOn) return;
    this.musicOn = true;
    this.nextNote = this.ctx.currentTime + 0.12;
    this.step = 0;
    this.musicTimer = window.setInterval(() => this.scheduleMusic(), 90);
    this.scheduleMusic();
  }

  stopMusic(): void {
    this.musicOn = false;
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private scheduleMusic(): void {
    const ctx = this.ctx;
    const bus = this.musicBus;
    if (!ctx || !bus || !this.musicOn) return;
    if (ctx.state !== 'running') return;
    if (this.nextNote < ctx.currentTime - 0.5) this.nextNote = ctx.currentTime + 0.05;
    const stepDur = 60 / 96 / 4;
    const chords = [
      [220.0, 261.63, 329.63],
      [174.61, 220.0, 261.63],
      [261.63, 329.63, 392.0],
      [196.0, 246.94, 293.66],
    ];
    const roots = [55.0, 43.65, 65.41, 49.0];
    while (this.nextNote < ctx.currentTime + 0.28) {
      const t = this.nextNote;
      const step = this.step % 64;
      const bar = Math.floor(step / 16) % 4;
      const s = step % 16;
      const chord = chords[bar];
      const root = roots[bar];

      if (s % 4 === 0) this.kick(t);
      if (s === 4 || s === 12) this.noiseBurst(t, 0.16, 0.14, 'highpass', 1400, 0.8, bus);
      if (s % 2 === 0) this.noiseBurst(t + 0.02, 0.045, 0.035, 'highpass', 7200, 0.7, bus);

      if ([0, 3, 6, 8, 11, 14].includes(s)) {
        const note = s === 6 ? root * 1.5 : s === 14 ? root * 2 : root;
        this.tone(note, t, stepDur * 1.8, 'sawtooth', 0.085, bus, 380, 0.02);
      }

      // Pad at the top of each bar.
      if (s === 0) {
        for (let i = 0; i < chord.length; i++) {
          const osc = this.ctx!.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.value = chord[i] * 0.5;
          osc.detune.value = (i - 1) * 7;
          const filter = this.ctx!.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 900;
          const gain = this.ctx!.createGain();
          const dur = stepDur * 15;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.linearRampToValueAtTime(0.022, t + 0.45);
          gain.gain.setValueAtTime(0.022, t + dur - 0.6);
          gain.gain.linearRampToValueAtTime(0.0001, t + dur);
          osc.connect(filter).connect(gain).connect(bus);
          osc.start(t);
          osc.stop(t + dur + 0.1);
        }
      }

      // Arpeggio.
      if (s % 2 === 1) {
        const note = chord[(Math.floor(step / 2) % 6) % 3] * 2;
        this.tone(note, t, stepDur * 0.9, 'triangle', 0.036, bus, 2400, 0.005);
      }

      this.nextNote += stepDur;
      this.step++;
    }
  }
}
