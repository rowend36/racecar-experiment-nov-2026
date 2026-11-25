export class HUD {
  root!: HTMLElement;
  private el = (id: string) => document.getElementById(id)!;
  private lastNitroW = -1;

  build() {
    this.root = document.createElement('div');
    this.root.innerHTML = `
    <div id="hud">
      <div id="vignette-speed"></div>
      <div class="hud-top">
        <div class="pill"><small>LAP</small><strong id="lap">1/3</strong></div>
        <div class="pill"><small>POS</small><strong id="pos">4/4</strong></div>
        <div class="pill"><small>TIME</small><strong id="time">0:00.0</strong></div>
      </div>
      <div id="fps"></div>
      <div class="hud-right"><canvas id="minimap" width="336" height="336"></canvas></div>
      <div class="hud-bottom-left"><div id="drift">DRIFT!</div><div id="wrongway" style="color:#ff3b30;font-weight:900;font-style:italic;display:none">WRONG WAY!</div></div>
      <div class="hud-bottom-right">
        <div id="speed">0<small> KM/H</small></div>
        <div id="nitro-bar"><div id="nitro-fill"></div></div>
        <div id="nitro-label">NITRO — SHIFT / SPACE</div>
      </div>
      <div id="message-center"></div>
      <div id="touch">
        <div class="tcluster"><button class="tbtn" id="t-left">◀</button><button class="tbtn" id="t-right">▶</button></div>
        <div class="tcluster"><button class="tbtn nitro" id="t-nitro">N₂O</button><button class="tbtn" id="t-brake">▼</button><button class="tbtn" id="t-gas">▲</button></div>
      </div>
    </div>
    <div id="menu" class="screen">
      <div class="logo-kicker">MUSE RACING DIVISION</div>
      <div class="logo-title">APEX PROTOCOL</div>
      <div class="logo-sub">Coastal GP • 3 Laps • 4 Rivals • HDR-PBR</div>
      <div class="car-select" id="car-select"></div>
      <div class="btn-row"><button class="pro primary" id="btn-race">▶ &nbsp;START RACE</button>
      <button class="pro" id="btn-quality">QUALITY: ULTRA</button>
      <button class="pro" id="btn-mute">🔊 SOUND</button></div>
      <div class="hint"><kbd>W A S D</kbd> / <kbd>← ↑ ↓ →</kbd> drive &nbsp; <kbd>SHIFT</kbd> nitro &nbsp; <kbd>SPACE</kbd> drift/brake &nbsp; <kbd>R</kbd> reset &nbsp; <kbd>C</kbd> camera &nbsp; Gamepad + touch supported.<br/>Cross-platform build: <b>npm run build</b> → deploy <b>dist/</b> anywhere, or wrap with Tauri/Electron for Steam/mobile.</div>
    </div>
    <div id="end" class="screen hidden">
      <div class="logo-kicker" id="end-kicker">RACE COMPLETE</div>
      <div class="logo-title" id="end-title">P1 — VICTORY</div>
      <div class="logo-sub" id="end-sub"></div>
      <div class="btn-row"><button class="pro primary" id="btn-again">↻ RACE AGAIN</button></div>
    </div>`;
    document.getElementById('app')!.appendChild(this.root);
  }

  showHUD(v: boolean) { this.el('hud').classList.toggle('visible', v); }
  hideMenu() { this.el('menu').classList.add('hidden'); }
  showEnd(title: string, sub: string) {
    this.el('end').classList.remove('hidden');
    this.el('end-title').textContent = title;
    this.el('end-sub').textContent = sub;
  }
  hideEnd() { this.el('end').classList.add('hidden'); }

  message(t: string) {
    const m = this.el('message-center');
    m.textContent = t;
    m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop');
  }

  setLap(a: number, b: number) { this.el('lap').textContent = `${Math.min(a, b)}/${b}`; }
  setPos(a: number, b: number) { this.el('pos').textContent = `${a}/${b}`; }
  setTime(s: number) {
    const m = Math.floor(s / 60); const sec = s - m * 60;
    this.el('time').textContent = `${m}:${sec.toFixed(1).padStart(4, '0')}`;
  }
  setSpeed(kmh: number, nitro01: number, nitroOn: boolean, drift: boolean, wrongWay: boolean) {
    this.el('speed').innerHTML = `${Math.round(kmh)}<small> KM/H</small>`;
    const w = Math.round(nitro01 * 100);
    if (w !== this.lastNitroW) { this.el('nitro-fill').style.width = `${w}%`; this.lastNitroW = w; }
    this.el('nitro-label').classList.toggle('active', nitroOn);
    this.el('nitro-label').textContent = nitroOn ? '★ NITRO ENGAGED ★' : 'NITRO — SHIFT / SPACE';
    this.el('drift').classList.toggle('on', drift);
    (this.el('wrongway') as HTMLElement).style.display = wrongWay ? 'block' : 'none';
    (document.getElementById('vignette-speed') as HTMLElement).style.opacity = nitroOn ? '1' : String(Math.min(0.7, Math.max(0, (kmh - 160) / 180)));
  }
  setFps(fps: number) { this.el('fps').textContent = `${fps.toFixed(0)} fps`; }
}
