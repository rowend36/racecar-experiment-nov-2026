import './styles.css';
import { Game } from './core/Game';

declare global {
  interface Window {
    hungerGame?: Game;
  }
}

async function bootstrap(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
  const uiRoot = document.querySelector<HTMLElement>('#ui-root');
  const loadingStatus = document.querySelector<HTMLElement>('#loading-status');
  if (!canvas || !uiRoot || !loadingStatus) throw new Error('The game shell is incomplete.');

  const game = new Game(canvas, uiRoot);
  window.hungerGame = game;
  await game.init();
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }
}

bootstrap().catch((error: unknown) => {
  console.error('HUNGER APEX failed to start:', error);
  const status = document.querySelector<HTMLElement>('#loading-status');
  const loading = document.querySelector<HTMLElement>('#loading-screen');
  if (status) {
    status.textContent = 'A WebGL 2 capable browser and hardware acceleration are required.';
    status.style.maxWidth = '32rem';
    status.style.textAlign = 'center';
  }
  if (loading) {
    const retry = document.createElement('button');
    retry.className = 'primary-button';
    retry.textContent = 'RETRY';
    retry.addEventListener('click', () => window.location.reload());
    loading.append(retry);
  }
});
