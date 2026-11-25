import { clamp, damp } from './Math';

export interface DriveActions {
  throttle: number;
  brake: number;
  steer: number; // +1 = screen-right
  handbrake: boolean;
  nitro: boolean;
}

export interface ButtonEvents {
  camera: boolean;
  reset: boolean;
  pause: boolean;
  mute: boolean;
  confirm: boolean;
}

/**
 * Keyboard + gamepad + touch input. Steering is smoothed; buttons are
 * edge-triggered via `consume()`.
 */
export class Input {
  actions: DriveActions = { throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };
  private pressed: ButtonEvents = { camera: false, reset: false, pause: false, mute: false, confirm: false };
  private keys = new Set<string>();
  private steerTarget = 0;
  private steerSmooth = 0;
  touch = { gas: false, brake: false, left: false, right: false, nitro: false, drift: false };
  usingTouch = false;
  enabled = true;

  attach(canvas: HTMLElement): void {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.code);
      this.mapButton(e.code);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
    canvas.style.touchAction = 'none';
  }

  private mapButton(code: string): void {
    switch (code) {
      case 'KeyC': this.pressed.camera = true; break;
      case 'KeyR': this.pressed.reset = true; break;
      case 'Escape': case 'KeyP': this.pressed.pause = true; break;
      case 'KeyM': this.pressed.mute = true; break;
      case 'Enter': this.pressed.confirm = true; break;
    }
  }

  press(name: keyof ButtonEvents): void {
    this.pressed[name] = true;
  }

  consume(): ButtonEvents {
    const out = { ...this.pressed };
    this.pressed = { camera: false, reset: false, pause: false, mute: false, confirm: false };
    return out;
  }

  private pad(): DriveActions {
    const out: DriveActions = { throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };
    try {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const p of pads) {
        if (!p || !p.connected) continue;
        const dz = (v: number) => (Math.abs(v) < 0.12 ? 0 : v);
        const ax = dz(p.axes[0] ?? 0);
        if (Math.abs(ax) > Math.abs(out.steer)) out.steer = clamp(ax, -1, 1);
        const rt = p.buttons[7]?.value ?? 0;
        const lt = p.buttons[6]?.value ?? 0;
        if ((p.buttons[0]?.pressed || rt > 0.1) && rt >= 0) out.throttle = Math.max(out.throttle, Math.max(rt, p.buttons[0]?.pressed ? 1 : 0));
        if ((p.buttons[1]?.pressed || lt > 0.1) && lt >= 0) out.brake = Math.max(out.brake, Math.max(lt, p.buttons[1]?.pressed ? 1 : 0));
        if (p.buttons[2]?.pressed || p.buttons[5]?.pressed) out.nitro = true;
        if (p.buttons[4]?.pressed) out.handbrake = true;
        if (p.buttons[3]?.pressed) this.pressed.camera = true;
        if (p.buttons[8]?.pressed) this.pressed.reset = true;
        if (p.buttons[9]?.pressed) this.pressed.pause = true;
        break;
      }
    } catch { /* gamepad unavailable */ }
    return out;
  }

  /** Poll once per frame with the frame dt. */
  update(dt: number): DriveActions {
    const k = this.keys;
    const a = this.actions;
    const drive = this.enabled ? 1 : 0;

    const throttleKey = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) * drive;
    const brakeKey = (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) * drive;
    let steerKey = 0;
    if (this.enabled) {
      if (k.has('KeyA') || k.has('ArrowLeft')) steerKey -= 1;
      if (k.has('KeyD') || k.has('ArrowRight')) steerKey += 1;
    }
    const handbrakeKey = this.enabled && k.has('Space');
    const nitroKey = this.enabled && (k.has('ShiftLeft') || k.has('ShiftRight'));

    const pad = this.enabled ? this.pad() : { throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };

    const t = this.touch;
    const touchThrottle = this.enabled && (t.gas || (!this.usingTouch ? false : t.gas)) ? 1 : 0;
    const touchAutoGas = this.enabled && this.usingTouch && !t.brake ? 0.65 : 0;
    const touchBrake = this.enabled && t.brake ? 1 : 0;
    let touchSteer = 0;
    if (this.enabled) {
      if (t.left) touchSteer -= 1;
      if (t.right) touchSteer += 1;
    }

    a.throttle = clamp(Math.max(throttleKey, pad.throttle, touchThrottle, touchAutoGas), 0, 1);
    a.brake = clamp(Math.max(brakeKey, pad.brake, touchBrake), 0, 1);
    this.steerTarget = clamp(steerKey + pad.steer + touchSteer, -1, 1);
    this.steerSmooth = damp(this.steerSmooth, this.steerTarget, 18, dt);
    if (Math.abs(this.steerSmooth) < 0.002 && this.steerTarget === 0) this.steerSmooth = 0;
    a.steer = clamp(this.steerSmooth, -1, 1);
    a.handbrake = handbrakeKey || pad.handbrake || (this.enabled && t.drift);
    a.nitro = nitroKey || pad.nitro || (this.enabled && t.nitro);
    return a;
  }
}
