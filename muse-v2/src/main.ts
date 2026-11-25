import * as THREE from 'three';
import './style.css';
import { Engine } from './game/Engine';
import { Track } from './world/Track';
import { Environment } from './world/Environment';
import { CameraRig } from './game/CameraRig';
import { Effects } from './game/Effects';
import { Race } from './game/Race';
import { Input } from './core/Input';
import { AudioSystem } from './core/Audio';
import { createTextures } from './core/Textures';
import { UI, loadSettings, saveSettings } from './ui/UI';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const settings = loadSettings();

const engine = new Engine(canvas);
engine.setQuality(settings.quality);

const textures = createTextures();
const track = new Track(textures);
const env = new Environment(track, textures);
engine.scene.add(track.group, env.group);

const effects = new Effects(engine.scene, textures);
const cameraRig = new CameraRig(engine.camera);
const input = new Input();
input.attach(canvas);
const audio = new AudioSystem();
audio.setMuted(settings.muted);

const ui = new UI(settings, input, audio, engine, track);

const race = new Race(
  engine.scene,
  track,
  env,
  cameraRig,
  input,
  audio,
  textures,
  settings,
  {
    onCountdown: (label) => ui.onCountdown(label),
    onMessage: (text, dur) => ui.onMessage(text, dur),
    onFinish: (results, newBest) => ui.onFinish(results, newBest),
    onStateChange: (s) => ui.onStateChange(s),
  },
);
ui.attach(race);

// Menu showcase: slow orbit around a grid car until the race starts.
const menuCamPos = new THREE.Vector3();
let menuAngle = 0;

function menuCamera(dt: number): void {
  menuAngle += dt * 0.12;
  const p = race.player;
  const cx = p.pos.x;
  const cz = p.pos.z;
  menuCamPos.set(cx + Math.sin(menuAngle) * 14, p.midY + 4.5, cz + Math.cos(menuAngle) * 14);
  engine.camera.position.lerp(menuCamPos, 1 - Math.exp(-2 * dt));
  engine.camera.lookAt(p.pos.x, p.midY + 0.6, p.pos.z);
}

// Diagnostics + test hook (mirrors hunger/deepseek convention).
(window as unknown as { __apex: unknown }).__apex = { race, engine, ui, input, audio, track };

document.addEventListener('visibilitychange', () => {
  if (document.hidden && race.state === 'racing') race.pause();
});

let last = performance.now() / 1000;
function frame(): void {
  requestAnimationFrame(frame);
  const now = performance.now() / 1000;
  const dt = Math.min(now - last, 0.05);
  last = now;

  input.update(dt);
  race.update(dt);

  if (race.state === 'menu') {
    menuCamera(dt);
    audio.engineSilent();
  } else {
    effects.update(dt, race.player);
    env.update(race.player.pos);
    engine.speedAmount = race.player.speedAbs / 95;
  }
  ui.updateHUD(race.snapshot(engine.fps), race);
  engine.adapt(dt);
  engine.render(dt, now);
  void saveSettings;
}

ui.onStateChange('menu');
frame();
