/* MIMO VELOCITY — WebAudio: synthesized engine, tires, nitro, impacts, music */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';

const A = { ready: false, muted: false, sfxVol: 1, musicVol: 1 };
M.audio = A;

let ctx = null;
let master, sfxBus, musicBus, noiseBuf;

function makeNoise(ctx) {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function shaperCurve(amount) {
  const n = 1024, c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = i * 2 / n - 1;
    c[i] = Math.tanh(x * amount) / Math.tanh(amount);
  }
  return c;
}

A.ensure = function () {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) { return false; }
  master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
  sfxBus = ctx.createGain(); sfxBus.gain.value = A.sfxVol; sfxBus.connect(master);
  musicBus = ctx.createGain(); musicBus.gain.value = A.musicVol * 0.5; musicBus.connect(master);
  noiseBuf = makeNoise(ctx);

  // ---- engine chain ----
  eng = { oscA: ctx.createOscillator(), oscB: ctx.createOscillator(), sub: ctx.createOscillator(),
          shaper: ctx.createWaveShaper(), lp: ctx.createBiquadFilter(), gain: ctx.createGain(),
          whine: ctx.createOscillator(), whineGain: ctx.createGain() };
  eng.oscA.type = 'sawtooth'; eng.oscB.type = 'square'; eng.sub.type = 'sine';
  eng.oscA.frequency.value = 60; eng.oscB.frequency.value = 120; eng.sub.frequency.value = 30;
  eng.oscB.detune.value = -6;
  eng.shaper.curve = shaperCurve(3.2);
  eng.lp.type = 'lowpass'; eng.lp.frequency.value = 900; eng.lp.Q.value = 1.1;
  eng.gain.gain.value = 0;
  eng.whine.type = 'sine'; eng.whine.frequency.value = 2000; eng.whineGain.gain.value = 0;
  eng.oscA.connect(eng.shaper); eng.oscB.connect(eng.shaper); eng.sub.connect(eng.shaper);
  eng.shaper.connect(eng.lp); eng.lp.connect(eng.gain); eng.gain.connect(sfxBus);
  eng.whine.connect(eng.whineGain); eng.whineGain.connect(sfxBus);
  eng.oscA.start(); eng.oscB.start(); eng.sub.start(); eng.whine.start();

  // ---- wind / road noise ----
  wind = { src: ctx.createBufferSource(), lp: ctx.createBiquadFilter(), bp: ctx.createBiquadFilter(), gain: ctx.createGain() };
  wind.src.buffer = noiseBuf; wind.src.loop = true;
  wind.lp.type = 'lowpass'; wind.lp.frequency.value = 500;
  wind.bp.type = 'bandpass'; wind.bp.frequency.value = 420; wind.bp.Q.value = 0.7;
  wind.gain.gain.value = 0;
  wind.src.connect(wind.lp); wind.lp.connect(wind.gain); wind.gain.connect(sfxBus);
  wind.src.start();

  // ---- tire screech ----
  scr = { src: ctx.createBufferSource(), bp: ctx.createBiquadFilter(), gain: ctx.createGain() };
  scr.src.buffer = noiseBuf; scr.src.loop = true;
  scr.bp.type = 'bandpass'; scr.bp.frequency.value = 2400; scr.bp.Q.value = 6;
  scr.gain.gain.value = 0;
  scr.src.connect(scr.bp); scr.bp.connect(scr.gain); scr.gain.connect(sfxBus);
  scr.src.start();

  // ---- nitro hiss ----
  nit = { src: ctx.createBufferSource(), bp: ctx.createBiquadFilter(), gain: ctx.createGain() };
  nit.src.buffer = noiseBuf; nit.src.loop = true;
  nit.bp.type = 'bandpass'; nit.bp.frequency.value = 3400; nit.bp.Q.value = 1.4;
  nit.gain.gain.value = 0;
  nit.src.connect(nit.bp); nit.bp.connect(nit.gain); nit.gain.connect(sfxBus);
  nit.src.start();

  A.ready = true;
  A.ctx = ctx;
  return true;
};

let eng = null, wind = null, scr = null, nit = null;

// called every frame
A.engine = function (rpm, throttle, load, speed, nitroOn) {
  if (!A.ready || A.muted) return;
  const t = ctx.currentTime;
  const f = Math.max(20, rpm / 60 * 2.05);           // firing frequency
  eng.oscA.frequency.setTargetAtTime(f, t, 0.03);
  eng.oscB.frequency.setTargetAtTime(f * 2.005, t, 0.03);
  eng.sub.frequency.setTargetAtTime(f * 0.5, t, 0.03);
  eng.whine.frequency.setTargetAtTime(f * 9.5, t, 0.05);
  const cut = 420 + (rpm / 8500) * 2600 + throttle * 900;
  eng.lp.frequency.setTargetAtTime(cut, t, 0.05);
  const vol = (0.10 + throttle * 0.13 + load * 0.05) * (0.55 + 0.45 * Math.min(1, rpm / 3000));
  eng.gain.gain.setTargetAtTime(vol, t, 0.05);
  eng.whineGain.gain.setTargetAtTime((rpm > 4200 ? (rpm - 4200) / 4300 : 0) * 0.012 * (0.3 + throttle), t, 0.08);
  // wind
  wind.gain.gain.setTargetAtTime(Math.min(0.12, speed / 90 * 0.12), t, 0.15);
  wind.lp.frequency.setTargetAtTime(300 + speed * 14, t, 0.15);
};

A.screech = function (slip, speed) {
  if (!A.ready || A.muted) return;
  const t = ctx.currentTime;
  const g = Math.max(0, slip - 0.32) * Math.min(1, speed / 14) * 0.5;
  scr.gain.gain.setTargetAtTime(g, t, 0.06);
  scr.bp.frequency.setTargetAtTime(1900 + slip * 1400 + Math.random() * 200, t, 0.08);
};

A.nitro = function (on) {
  if (!A.ready || A.muted) return;
  const t = ctx.currentTime;
  nit.gain.gain.setTargetAtTime(on ? 0.16 : 0, t, on ? 0.03 : 0.12);
};

A.impact = function (strength) {
  if (!A.ready || A.muted) return;
  const t = ctx.currentTime;
  const s = Math.min(1, strength);
  // thump
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(120 + s * 60, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.22);
  g.gain.setValueAtTime(0.5 * s, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + 0.32);
  // crunch noise
  const n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
  n.buffer = noiseBuf; n.playbackRate.value = 0.7 + Math.random() * 0.6;
  nf.type = 'lowpass'; nf.frequency.value = 1400 + s * 2600;
  ng.gain.setValueAtTime(0.4 * s, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  n.connect(nf); nf.connect(ng); ng.connect(sfxBus);
  n.start(t, Math.random()); n.stop(t + 0.2);
};

A.beep = function (freq, dur, vol, type) {
  if (!A.ready || A.muted) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type || 'square'; o.frequency.value = freq;
  g.gain.setValueAtTime(vol || 0.25, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(sfxBus);
  o.start(t); o.stop(t + dur + 0.02);
};

A.ui = function () { A.beep(660, 0.06, 0.12, 'triangle'); };
A.startSting = function () {
  if (!A.ready || A.muted) return;
  A.beep(880, 0.5, 0.3, 'sawtooth');
  setTimeout(() => A.beep(1320, 0.7, 0.25, 'sawtooth'), 90);
};

A.shift = function () {
  if (!A.ready || A.muted) return;
  const t = ctx.currentTime;
  const n = ctx.createBufferSource(), g = ctx.createGain();
  n.buffer = noiseBuf;
  g.gain.setValueAtTime(0.06, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  n.connect(g); g.connect(sfxBus);
  n.start(t, Math.random()); n.stop(t + 0.06);
};

// ---------------- procedural synthwave music ----------------
const music = { on: false, step: 0, nextTime: 0, timer: null };
const BPM = 124;
const STEP = 60 / BPM / 4; // 16th notes
const BASS = [45, 45, 57, 45, 43, 43, 55, 43, 41, 41, 53, 41, 48, 48, 43, 43]; // midi roots
const CHORDS = [[65, 69, 72], [65, 69, 72], [63, 67, 70], [63, 67, 70],
                [62, 65, 69], [62, 65, 69], [64, 67, 71], [64, 67, 71]];
const LEAD = [77, 0, 84, 0, 80, 0, 77, 75, 0, 72, 0, 75, 0, 77, 0, 0];

function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

function scheduleStep(step, time) {
  const bar = Math.floor(step / 16) % 8;
  const s = step % 16;
  // bass
  if (s % 2 === 0) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.value = midiHz(BASS[s]);
    f.type = 'lowpass'; f.frequency.value = 700; f.Q.value = 5;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.24, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, time + STEP * 1.7);
    o.connect(f); f.connect(g); g.connect(musicBus);
    o.start(time); o.stop(time + STEP * 2);
  }
  // chord stab every 4 steps
  if (s % 4 === 0) {
    const ch = CHORDS[bar];
    for (const m of ch) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.value = midiHz(m); o.detune.value = (Math.random() - .5) * 8;
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.045, time + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, time + STEP * 3.4);
      o.connect(g); g.connect(musicBus);
      o.start(time); o.stop(time + STEP * 4);
    }
  }
  // lead arp
  const lm = LEAD[s];
  if (lm) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'square'; o.frequency.value = midiHz(lm);
    f.type = 'lowpass'; f.frequency.value = 3200;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.07, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, time + STEP * 0.9);
    o.connect(f); f.connect(g); g.connect(musicBus);
    o.start(time); o.stop(time + STEP);
  }
  // hat
  if (s % 2 === 1) {
    const n = ctx.createBufferSource(), g = ctx.createGain(), hp = ctx.createBiquadFilter();
    n.buffer = noiseBuf; hp.type = 'highpass'; hp.frequency.value = 7000;
    g.gain.setValueAtTime(0.05, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    n.connect(hp); hp.connect(g); g.connect(musicBus);
    n.start(time, Math.random()); n.stop(time + 0.06);
  }
  // kick
  if (s === 0 || s === 4 || s === 8 || s === 10) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(150, time);
    o.frequency.exponentialRampToValueAtTime(48, time + 0.1);
    g.gain.setValueAtTime(0.5, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.24);
    o.connect(g); g.connect(musicBus);
    o.start(time); o.stop(time + 0.26);
  }
}

A.musicStart = function () {
  if (!A.ready || music.on) return;
  music.on = true;
  music.step = 0;
  music.nextTime = ctx.currentTime + 0.1;
  music.timer = setInterval(() => {
    if (!music.on || A.muted) return;
    while (music.nextTime < ctx.currentTime + 0.25) {
      scheduleStep(music.step, music.nextTime);
      music.step++;
      music.nextTime += STEP;
    }
  }, 80);
};
A.musicStop = function () {
  music.on = false;
  if (music.timer) { clearInterval(music.timer); music.timer = null; }
};
A.setMusic = function (on) { on ? A.musicStart() : A.musicStop(); };
A.setSfxVol = function (v) { A.sfxVol = v; if (sfxBus) sfxBus.gain.value = v; };
A.setMusicVol = function (v) { A.musicVol = v; if (musicBus) musicBus.gain.value = v * 0.5; };
A.setMuted = function (m) {
  A.muted = m;
  if (master) master.gain.value = m ? 0 : 0.9;
};

})(window.MIMO);
