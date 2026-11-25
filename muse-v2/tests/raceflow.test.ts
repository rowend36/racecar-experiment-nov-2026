import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { Track } from '../src/world/Track';
import { Environment } from '../src/world/Environment';
import { CameraRig } from '../src/game/CameraRig';
import { Race, RaceSettings } from '../src/game/Race';
import { Input } from '../src/core/Input';
import { AudioSystem } from '../src/core/Audio';
import { stubTextures } from '../src/core/Textures';

beforeEach(() => {
  const store = new Map<string, string>();
  (globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
  };
});

function makeRace(): Race {
  const textures = stubTextures();
  const scene = new THREE.Scene();
  const track = new Track(textures);
  const env = new Environment(track, textures);
  const camera = new THREE.PerspectiveCamera(68, 1.6, 0.1, 3000);
  const rig = new CameraRig(camera);
  const input = new Input();
  const audio = new AudioSystem();
  const settings: RaceSettings = {
    carId: 'volt', paint: 0xd2102f, quality: 'performance', muted: true, sensitivity: 0.72,
  };
  return new Race(scene, track, env, rig, input, audio, textures, settings, {
    onCountdown: () => {},
    onMessage: () => {},
    onFinish: () => {},
    onStateChange: () => {},
  });
}

describe('Race flow', () => {
  it('runs menu -> countdown -> racing with car slots on the grid', () => {
    const race = makeRace();
    expect(race.state).toBe('menu');
    race.startRace();
    expect(race.state).toBe('countdown');
    expect(race.cars).toHaveLength(4);
    // Grid slots: player last, all stationary.
    for (const c of race.cars) expect(c.speedAbs).toBe(0);
    // Fast-forward the countdown.
    for (let i = 0; i < 300; i++) race.update(1 / 60);
    expect(race.state).toBe('racing');
  });

  it('supports pause / resume / restart / quit', () => {
    const race = makeRace();
    race.startRace();
    for (let i = 0; i < 300; i++) race.update(1 / 60);
    expect(race.state).toBe('racing');
    race.pause();
    expect(race.state).toBe('paused');
    const s = race.player.s;
    for (let i = 0; i < 60; i++) race.update(1 / 60);
    expect(race.player.s).toBe(s); // frozen
    race.resume();
    expect(race.state).toBe('racing');
    race.restart();
    expect(race.state).toBe('countdown');
    for (let i = 0; i < 300; i++) race.update(1 / 60);
    race.quitToMenu();
    expect(race.state).toBe('menu');
  });

  it('completes a full 3-lap race on autopilot with ordered results', () => {
    const race = makeRace();
    race.startRace();
    race.debugAutopilot = true;
    let frames = 0;
    while (race.state !== 'finished' && frames < 60 * 420) {
      race.update(1 / 60);
      frames++;
    }
    expect(race.state).toBe('finished');
    expect(race.results).toHaveLength(4);
    const me = race.results.find((r) => r.isPlayer)!;
    expect(me.lapTimes.length).toBeGreaterThanOrEqual(3);
    // Positions are unique and cover 1..4.
    const positions = race.results.map((r) => r.position).sort();
    expect(positions).toEqual([1, 2, 3, 4]);
    const best = Number(localStorage.getItem('apex-v2-best-lap-v1') ?? 0);
    expect(best).toBeGreaterThan(0);
  }, 120000);
});
