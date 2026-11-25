// Procedural WebAudio: engine synth + skid + nitro + UI. Zero assets, tiny CPU.
export class GameAudio {
  private ctx: AudioContext | null = null;
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private skidGain: GainNode | null = null;
  private skidSrc: AudioBufferSourceNode | null = null;
  private nitroGain: GainNode | null = null;
  private nitroSrc: AudioBufferSourceNode | null = null;
  muted = false;

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') void this.ctx.resume(); return; }
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
    } catch { return; }
    const ctx = this.ctx!;
    // engine: two detuned saws through lowpass
    this.engineGain = ctx.createGain(); this.engineGain.gain.value = 0.0;
    this.engineFilter = ctx.createBiquadFilter(); this.engineFilter.type = 'lowpass'; this.engineFilter.frequency.value = 900; this.engineFilter.Q.value = 2;
    this.engineOsc1 = ctx.createOscillator(); this.engineOsc1.type = 'sawtooth'; this.engineOsc1.frequency.value = 60;
    this.engineOsc2 = ctx.createOscillator(); this.engineOsc2.type = 'square'; this.engineOsc2.frequency.value = 30;
    const g2 = ctx.createGain(); g2.gain.value = 0.5;
    this.engineOsc1.connect(this.engineFilter); this.engineOsc2.connect(g2); g2.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain); this.engineGain.connect(ctx.destination);
    this.engineOsc1.start(); this.engineOsc2.start();

    // noise buffer for skid + nitro wind
    const len = ctx.sampleRate * 1.5;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    // skid: bandpass noise
    this.skidSrc = ctx.createBufferSource(); this.skidSrc.buffer = buf; this.skidSrc.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 1.2;
    this.skidGain = ctx.createGain(); this.skidGain.gain.value = 0;
    this.skidSrc.connect(bp); bp.connect(this.skidGain); this.skidGain.connect(ctx.destination);
    this.skidSrc.start();

    // nitro: highpass noise swell
    this.nitroSrc = ctx.createBufferSource(); this.nitroSrc.buffer = buf; this.nitroSrc.loop = true; this.nitroSrc.playbackRate.value = 0.7;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
    this.nitroGain = ctx.createGain(); this.nitroGain.gain.value = 0;
    this.nitroSrc.connect(hp); hp.connect(this.nitroGain); this.nitroGain.connect(ctx.destination);
    this.nitroSrc.start();
  }

  setEngine(rpm01: number, throttle: number, active: boolean) {
    if (!this.ctx || !this.engineOsc1 || !this.engineOsc2 || !this.engineGain || !this.engineFilter) return;
    if (this.muted || !active) { this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1); return; }
    const t = this.ctx.currentTime;
    const f = 55 + rpm01 * 220 + throttle * 30;
    this.engineOsc1.frequency.setTargetAtTime(f, t, 0.05);
    this.engineOsc2.frequency.setTargetAtTime(f * 0.5 + 2, t, 0.05);
    this.engineFilter.frequency.setTargetAtTime(700 + rpm01 * 2600 + throttle * 800, t, 0.08);
    this.engineGain.gain.setTargetAtTime(0.05 + throttle * 0.06, t, 0.08);
  }

  setSkid(amount01: number) {
    if (!this.ctx || !this.skidGain) return;
    this.skidGain.gain.setTargetAtTime(this.muted ? 0 : Math.min(0.25, amount01 * 0.25), this.ctx.currentTime, 0.06);
  }

  setNitro(on: boolean) {
    if (!this.ctx || !this.nitroGain) return;
    this.nitroGain.gain.setTargetAtTime(on && !this.muted ? 0.12 : 0, this.ctx.currentTime, 0.15);
  }

  beep(freq = 880, dur = 0.12, type: OscillatorType = 'sine', vol = 0.2) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx; const t = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
  }

  toggleMute() { this.muted = !this.muted; return this.muted; }
}
