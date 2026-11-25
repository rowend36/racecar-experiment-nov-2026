import './style.css';
import { Game } from './game/Game';

declare global {
  interface Window {
    __redline?: Game;
  }
}

function boot(): void {
  const canvas = document.getElementById('game') as HTMLCanvasElement | null;
  if (!canvas) throw new Error('Game canvas missing');
  const game = new Game(canvas);
  window.__redline = game;
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      void navigator.serviceWorker.register('./sw.js').catch(() => undefined);
    });
  }
}

try {
  boot();
} catch (error) {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.innerHTML = `<div class="loader-mark">ERROR</div><div class="loader-text">${String(error)}</div>`;
  }
  throw error;
}
