import './style.css';
import * as THREE from 'three';
import { Engine } from './core/Engine';
import { createTextures } from './core/Textures';
import { AudioSystem } from './core/Audio';
import { Input } from './core/Input';
import { UI } from './ui/UI';
import { RaceGame } from './game/Race';

async function boot(): Promise<void> {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const ui = new UI();
  const audio = new AudioSystem();
  audio.setMuted(localStorage.getItem('vanta-gp-muted') === '1');
  ui.setSound(audio.isMuted);

  let engine: Engine;
  try {
    engine = new Engine(canvas);
  } catch (err) {
    ui.setLoading('WEBGL2 IS REQUIRED', 0);
    const label = document.getElementById('loading-label');
    if (label) label.textContent = `WEBGL2 UNAVAILABLE — ${String(err).slice(0, 80)}`;
    console.error(err);
    return;
  }

  const textures = createTextures(engine.renderer.capabilities.getMaxAnisotropy());
  const input = new Input();
  const game = new RaceGame(engine, textures, audio, input, ui.config);

  (window as unknown as { __vanta: unknown }).__vanta = { game, engine, ui, audio, input };

  const startRace = (): void => {
    audio.init();
    audio.startMusic();
    ui.hideMenu();
    ui.hidePause();
    ui.hideResults();
    game.startRace();
    document.body.classList.add('in-race');
  };

  const quitToMenu = (): void => {
    game.quitToMenu();
    ui.hideResults();
    ui.hidePause();
    ui.showMenu(ui.bestLap());
    document.body.classList.remove('in-race');
  };

  ui.onStart = startRace;
  ui.onRestart = startRace;
  ui.onResume = (): void => game.togglePause();
  ui.onQuit = quitToMenu;
  ui.onConfigChange = (config): void => game.applyConfig(config);
  ui.onToggleSound = (): void => {
    audio.init();
    audio.setMuted(!audio.isMuted);
    ui.setSound(audio.isMuted);
  };

  game.onPauseChanged = (paused: boolean): void => {
    if (paused) {
      ui.showPause();
      document.body.classList.remove('in-race');
    } else {
      ui.hidePause();
      if (game.state === 'racing' || game.state === 'countdown') {
        document.body.classList.add('in-race');
      }
    }
  };

  game.onFinish = (data): void => {
    const newBest = ui.saveBestLap(data.bestLap);
    ui.showResults({ ...data, newBest });
    document.body.classList.remove('in-race');
  };

  const unlock = (): void => {
    audio.init();
    audio.startMusic();
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  };
  document.addEventListener('pointerdown', unlock, { once: false });
  document.addEventListener('keydown', unlock, { once: false });

  try {
    await game.init((label, p) => ui.setLoading(label, p));
  } catch (err) {
    console.error(err);
    ui.setLoading('FAILED TO BUILD THE CIRCUIT', 0);
    const label = document.getElementById('loading-label');
    if (label) label.textContent = `BOOT ERROR — ${String(err).slice(0, 120)}`;
    return;
  }

  ui.hideLoading();
  window.setTimeout(() => {
    if (game.state === 'menu') ui.showMenu(ui.bestLap());
  }, 250);

  const clock = new THREE.Clock();

  const frame = (): void => {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    input.update();

    if (input.consume('mute')) {
      audio.init();
      audio.setMuted(!audio.isMuted);
      ui.setSound(audio.isMuted);
    }
    if (input.consume('start')) {
      if (game.state === 'menu') startRace();
      else if (game.state === 'finished') startRace();
    }

    game.update(dt);
    engine.render(dt, game.getSpeedBlur());
    if (game.hud) game.hud.setFps(engine.fps);
  };

  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state === 'racing') game.togglePause();
  });
}

void boot();

