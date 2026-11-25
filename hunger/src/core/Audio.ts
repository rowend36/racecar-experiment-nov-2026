/** Lightweight synthesized engine, wind, tire and UI audio — no downloaded assets. */
export class RaceAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private tireGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private noiseSources: AudioBufferSourceNode[] = [];
  private volume = 0.32;
  private muted = false;
  private enabled = false;

  async unlock(): Promise<void> {
    if (!this.context) this.create();
    if (this.context?.state === 'suspended') await this.context.resume();
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.applyMaster();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyMaster();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled) void this.unlock();
    this.applyMaster();
  }

  update(rpm: number, throttle: number, speed: number, drifting: boolean, offroad: boolean): void {
    if (!this.context || !this.engineGain || !this.engineFilter || this.oscillators.length < 2) return;
    const now = this.context.currentTime;
    const normalizedRpm = Math.max(0, Math.min(1, rpm / 8000));
    const baseFrequency = 42 + normalizedRpm * 175;
    this.oscillators[0].frequency.setTargetAtTime(baseFrequency, now, 0.045);
    this.oscillators[1].frequency.setTargetAtTime(baseFrequency * 2.02, now, 0.045);
    this.engineFilter.frequency.setTargetAtTime(320 + normalizedRpm * 2300 + throttle * 900, now, 0.06);
    this.engineGain.gain.setTargetAtTime(this.enabled ? 0.055 + throttle * 0.065 + normalizedRpm * 0.035 : 0, now, 0.08);
    this.tireGain?.gain.setTargetAtTime(this.enabled && (drifting || offroad) ? 0.035 + Math.min(0.05, speed / 1300) : 0, now, 0.05);
    this.windGain?.gain.setTargetAtTime(this.enabled ? Math.min(0.055, speed / 1800) : 0, now, 0.1);
  }

  beep(frequency = 740, duration = 0.1, type: OscillatorType = 'sine'): void {
    if (!this.context || !this.master || this.muted) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.14 * this.volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  impact(strength: number): void {
    if (!this.context || !this.master || this.muted || strength < 0.15) return;
    const duration = 0.18;
    const buffer = this.context.createBuffer(1, Math.ceil(this.context.sampleRate * duration), this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * Math.exp(-index / (data.length * 0.18));
    }
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 480;
    gain.gain.value = Math.min(0.4, strength * 0.3) * this.volume;
    source.connect(filter).connect(gain).connect(this.master);
    source.start();
  }

  dispose(): void {
    for (const oscillator of this.oscillators) {
      try { oscillator.stop(); } catch { /* already stopped */ }
    }
    for (const source of this.noiseSources) {
      try { source.stop(); } catch { /* already stopped */ }
    }
    void this.context?.close();
    this.context = null;
  }

  private create(): void {
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(this.context.destination);

    this.engineFilter = this.context.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.Q.value = 1.3;
    this.engineGain = this.context.createGain();
    this.engineGain.gain.value = 0;
    this.engineFilter.connect(this.engineGain).connect(this.master);

    const fundamental = this.context.createOscillator();
    fundamental.type = 'sawtooth';
    const harmonic = this.context.createOscillator();
    harmonic.type = 'square';
    const harmonicGain = this.context.createGain();
    harmonicGain.gain.value = 0.22;
    fundamental.connect(this.engineFilter);
    harmonic.connect(harmonicGain).connect(this.engineFilter);
    fundamental.start();
    harmonic.start();
    this.oscillators = [fundamental, harmonic];

    const noise = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
    const noiseData = noise.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) noiseData[index] = Math.random() * 2 - 1;

    const tireSource = this.context.createBufferSource();
    tireSource.buffer = noise;
    tireSource.loop = true;
    const tireFilter = this.context.createBiquadFilter();
    tireFilter.type = 'bandpass';
    tireFilter.frequency.value = 1050;
    tireFilter.Q.value = 0.65;
    this.tireGain = this.context.createGain();
    this.tireGain.gain.value = 0;
    tireSource.connect(tireFilter).connect(this.tireGain).connect(this.master);
    tireSource.start();
    this.noiseSources.push(tireSource);

    const windSource = this.context.createBufferSource();
    windSource.buffer = noise;
    windSource.loop = true;
    const windFilter = this.context.createBiquadFilter();
    windFilter.type = 'highpass';
    windFilter.frequency.value = 1800;
    this.windGain = this.context.createGain();
    this.windGain.gain.value = 0;
    windSource.connect(windFilter).connect(this.windGain).connect(this.master);
    windSource.start();
    this.noiseSources.push(windSource);
    this.applyMaster();
  }

  private applyMaster(): void {
    if (!this.context || !this.master) return;
    this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.context.currentTime, 0.03);
  }
}
