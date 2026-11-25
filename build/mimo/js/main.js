/* MIMO VELOCITY — bootstrap & main loop */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';

const loadFill = document.getElementById('load-fill');
const loadText = document.getElementById('load-text');
function stage(pct, text) {
  loadFill.style.width = pct + '%';
  loadText.textContent = text;
}
const tick = () => new Promise(r => setTimeout(r, 30));

async function boot() {
  const canvas = document.getElementById('gl');
  let gl;
  try {
    gl = M.gl.init(canvas);
  } catch (e) {
    stage(100, 'WEBGL2 NOT SUPPORTED — ' + e.message);
    throw e;
  }

  stage(10, 'COMPILING SHADERS…');
  await tick();
  const renderer = new M.Renderer(gl, canvas);
  stage(35, 'SYNTHESIZING TEXTURES…');
  await tick();

  const game = new M.Game(gl, canvas);
  game.renderer = renderer;
  game.buildScene();
  stage(60, 'GENERATING CIRCUIT…');
  await tick();

  game.buildCars();
  game.particles = new M.Particles(gl, game.tex.atlas, 1400);
  stage(80, 'WARMING UP GPU…');
  await tick();

  M.hud.init();
  game.applyResolution();
  // warm-up render (compiles remaining paths, fills pipeline)
  game.toMenu();
  game.updateCamera(0.016);
  game.renderFrame();
  stage(100, 'READY');
  await tick();
  document.getElementById('loading').classList.add('done');

  // ---------- menus ----------
  M.hud.bindMenus({
    start: () => game.startRace(),
    garage: () => {
      game.state = 'garage';
      M.hud.showOverlay('menu-garage');
      M.hud.buildGarage(game.selectedCar, garagePick);
    },
    settings: () => M.hud.showOverlay('menu-settings'),
    controls: () => M.hud.showOverlay('menu-controls'),
    back: () => { game.state = 'menu'; M.hud.showOverlay('menu-title'); },
    resume: () => game.resume(),
    restart: () => game.startRace(),
    quit: () => game.toMenu()
  });

  // garage needs a stable callback (arguments.callee is strict-mode unsafe)
  const garagePick = (i) => {
    game.selectedCar = i;
    game.buildCars();
    M.hud.buildGarage(i, garagePick);
  };
  M.hud.buildGarage(game.selectedCar, garagePick);

  // ---------- settings ----------
  const qSel = document.getElementById('set-quality');
  qSel.value = game.qualityName;
  qSel.addEventListener('change', () => {
    game.qualityName = qSel.value;
    game.renderScale = 1;
    game.applyResolution();
    M.audio.ui();
  });
  const res = document.getElementById('set-res');
  const resVal = document.getElementById('set-res-val');
  res.addEventListener('input', () => {
    game.userRes = res.value / 100;
    resVal.textContent = res.value + '%';
    game.applyResolution();
  });
  const fov = document.getElementById('set-fov');
  const fovVal = document.getElementById('set-fov-val');
  fov.value = game.fov;
  fovVal.textContent = game.fov;
  fov.addEventListener('input', () => {
    game.fov = +fov.value;
    fovVal.textContent = fov.value;
  });
  const mus = document.getElementById('set-music');
  mus.addEventListener('change', () => { M.audio.ensure(); M.audio.setMusic(mus.checked); });
  const sfx = document.getElementById('set-sfx');
  sfx.addEventListener('change', () => { M.audio.ensure(); M.audio.setSfxVol(sfx.checked ? 1 : 0); });

  // first gesture unlocks audio
  const unlock = () => { M.audio.ensure(); };
  window.addEventListener('pointerdown', unlock, { once: false });
  window.addEventListener('keydown', unlock, { once: false });

  // ---------- resize ----------
  window.addEventListener('resize', () => game.applyResolution());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && (game.state === 'racing' || game.state === 'countdown')) game.pause();
  });
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stage(100, 'GRAPHICS CONTEXT LOST — RELOAD THE PAGE');
    document.getElementById('loading').classList.remove('done');
  });

  // ---------- main loop ----------
  let last = performance.now();
  let firstFrame = true;
  function frame(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (!(dt > 0)) dt = 0.016;
    dt = Math.min(dt, 0.1);
    try {
      game.update(dt);
      game.autoScale(dt);
      game.applyResolution();
      game.renderFrame();
    } catch (err) {
      console.error(err);
      stage(100, 'RUNTIME ERROR: ' + err.message);
      document.getElementById('loading').classList.remove('done');
      return; // stop loop on hard failure
    }
    M.input.clearEdges();
    if (firstFrame) { firstFrame = false; console.log('[MIMO] first frame rendered'); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // expose for debugging / tests
  window.MIMO_GAME = game;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})(window.MIMO);
