// Centralized input: keyboard + touch + gamepad. Normalized to -1..1.
export class Input {
  steer = 0;      // -1 left, +1 right
  throttle = 0;   // 0..1
  brake = 0;      // 0..1
  nitro = false;
  usingTouch = false;

  private keys = new Set<string>();
  private touch = { left: false, right: false, gas: false, brake: false, nitro: false };
  private gamepadSteer = 0;
  private gamepadThrottle = 0;
  private gamepadBrake = 0;
  private gamepadNitro = false;

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
      this.keys.add(e.key.toLowerCase());
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => this.keys.clear());
    this.bindTouch();
  }

  private bindTouch() {
    const bind = (id: string, down: () => void, up: () => void) => {
      const el = document.getElementById(id);
      if (!el) return;
      const on = (e: Event) => { e.preventDefault(); this.usingTouch = true; down(); };
      const off = (e: Event) => { e.preventDefault(); up(); };
      el.addEventListener('pointerdown', on);
      el.addEventListener('pointerup', off);
      el.addEventListener('pointercancel', off);
      el.addEventListener('pointerleave', off);
    };
    // elements are created by HUD; retry after DOM ready
    const tryBind = () => {
      if (!document.getElementById('t-left')) { setTimeout(tryBind, 200); return; }
      bind('t-left', () => this.touch.left = true, () => this.touch.left = false);
      bind('t-right', () => this.touch.right = true, () => this.touch.right = false);
      bind('t-gas', () => this.touch.gas = true, () => this.touch.gas = false);
      bind('t-brake', () => this.touch.brake = true, () => this.touch.brake = false);
      bind('t-nitro', () => this.touch.nitro = true, () => this.touch.nitro = false);
    };
    tryBind();
  }

  private pollGamepad() {
    this.gamepadSteer = 0; this.gamepadThrottle = 0; this.gamepadBrake = 0; this.gamepadNitro = false;
    try {
      const pads = navigator.getGamepads?.() ?? [];
      const gp = pads && pads[0];
      if (!gp) return;
      const ax = gp.axes[0] ?? 0;
      if (Math.abs(ax) > 0.08) this.gamepadSteer = ax;
      const rt = gp.buttons[7]?.value ?? 0;
      const lt = gp.buttons[6]?.value ?? 0;
      const a = gp.buttons[0]?.pressed ? 1 : 0;
      this.gamepadThrottle = Math.max(rt, a);
      this.gamepadBrake = lt || (gp.buttons[1]?.pressed ? 1 : 0);
      this.gamepadNitro = !!gp.buttons[3]?.pressed || !!gp.buttons[5]?.pressed;
    } catch { /* no gamepad */ }
  }

  update() {
    this.pollGamepad();
    const k = this.keys;
    const left = k.has('arrowleft') || k.has('a');
    const right = k.has('arrowright') || k.has('d');
    const gas = k.has('arrowup') || k.has('w');
    const brake = k.has('arrowdown') || k.has('s');
    const nitro = k.has('shift') || k.has(' ') || k.has('n');

    let steer = (right ? 1 : 0) - (left ? 1 : 0);
    if (this.touch.left) steer -= 1;
    if (this.touch.right) steer += 1;
    steer += this.gamepadSteer;

    let throttle = (gas ? 1 : 0) + (this.touch.gas ? 1 : 0) + this.gamepadThrottle;
    // auto-accelerate on touch devices when no pedal pressed (arcade feel)
    if (this.usingTouch && throttle === 0 && !this.touch.brake && this.gamepadBrake === 0 && !brake) throttle = 0.65;
    // default auto-gas for keyboard-less idle? no — keep manual on desktop.

    let brk = (brake ? 1 : 0) + (this.touch.brake ? 1 : 0) + this.gamepadBrake;

    // smooth steering
    const target = Math.max(-1, Math.min(1, steer));
    const rate = 6.5;
    this.steer += (target - this.steer) * Math.min(1, rate * (1 / 60));

    this.throttle = Math.max(0, Math.min(1, throttle));
    this.brake = Math.max(0, Math.min(1, brk));
    this.nitro = !!(nitro || this.touch.nitro || this.gamepadNitro);
  }

  get handbrake() { return this.keys.has(' ') || this.touch.brake; }
}
