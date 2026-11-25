import { clamp } from './Math';

export type Action = 'pause' | 'camera' | 'reset' | 'mute' | 'start';

/** Keyboard + gamepad + multi-touch, normalised into one driving input. */
export class Input {
  throttle = 0;
  brake = 0;
  steer = 0;
  handbrake = false;
  nitro = false;
  private keys = new Set<string>();
  private actions = new Set<Action>();
  private touch = { left: false, right: false, gas: false, brake: false, drift: false, nitro: false };
  private padIndex = -1;
  private prevPadButtons: boolean[] = [];

  constructor() {
    window.addEventListener('keydown', this.onKeyDown, { passive: false });
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('gamepadconnected', (e) => {
      this.padIndex = (e as GamepadEvent).gamepad.index;
    });
    window.addEventListener('gamepaddisconnected', () => {
      this.padIndex = -1;
    });
    this.bindTouch();
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    const code = e.code;
    if (
      ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(code)
    ) {
      e.preventDefault();
    }
    if (e.repeat) {
      this.keys.add(code);
      return;
    }
    this.keys.add(code);
    if (code === 'Escape' || code === 'KeyP') this.actions.add('pause');
    if (code === 'KeyC') this.actions.add('camera');
    if (code === 'KeyR') this.actions.add('reset');
    if (code === 'KeyM') this.actions.add('mute');
    if (code === 'Enter') this.actions.add('start');
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private onBlur = (): void => {
    this.keys.clear();
    this.touch.left = this.touch.right = this.touch.gas = this.touch.brake = false;
    this.touch.drift = this.touch.nitro = false;
  };

  private bindTouch(): void {
    document.querySelectorAll<HTMLElement>('[data-touch]').forEach((el) => {
      const key = el.dataset.touch as keyof typeof this.touch;
      const down = (e: PointerEvent): void => {
        e.preventDefault();
        el.classList.add('pressed');
        this.touch[key] = true;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      };
      const up = (): void => {
        el.classList.remove('pressed');
        this.touch[key] = false;
      };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('lostpointercapture', up);
    });
    document.querySelectorAll<HTMLElement>('[data-action]').forEach((el) => {
      el.addEventListener('click', () => {
        this.actions.add(el.dataset.action as Action);
      });
    });
  }

  update(): void {
    this.readKeyboard();
    this.readGamepad();
  }

  private readKeyboard(): void {
    const k = this.keys;
    const left = k.has('KeyA') || k.has('ArrowLeft');
    const right = k.has('KeyD') || k.has('ArrowRight');
    const gas = k.has('KeyW') || k.has('ArrowUp');
    const brake = k.has('KeyS') || k.has('ArrowDown');
    const handbrake = k.has('Space');
    const nitro = k.has('ShiftLeft') || k.has('ShiftRight');

    let steer = 0;
    if (left) steer -= 1;
    if (right) steer += 1;
    if (this.touch.left) steer -= 1;
    if (this.touch.right) steer += 1;
    this.steer = clamp(steer, -1, 1);
    this.throttle = gas || this.touch.gas ? 1 : 0;
    this.brake = brake || this.touch.brake ? 1 : 0;
    this.handbrake = handbrake || this.touch.drift;
    this.nitro = nitro || this.touch.nitro;
  }

  private readGamepad(): void {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let pad: Gamepad | null = null;
    if (this.padIndex >= 0) pad = pads[this.padIndex] ?? null;
    if (!pad) {
      for (const p of pads) {
        if (p && p.connected) {
          pad = p;
          break;
        }
      }
    }
    if (!pad) return;
    this.padIndex = pad.index;

    const axis = pad.axes[0] ?? 0;
    if (Math.abs(axis) > 0.12) this.steer = clamp(axis, -1, 1);
    const rt = pad.buttons[7]?.value ?? 0;
    const lt = pad.buttons[6]?.value ?? 0;
    const triggerAxisGas = pad.axes[5] !== undefined ? (pad.axes[5] + 1) / 2 : 0;
    const triggerAxisBrake = pad.axes[4] !== undefined ? (pad.axes[4] + 1) / 2 : 0;
    const gas = Math.max(rt, triggerAxisGas);
    const brake = Math.max(lt, triggerAxisBrake);
    if (gas > 0.08) this.throttle = gas;
    if (brake > 0.08) this.brake = brake;
    if (pad.buttons[0]?.pressed) this.handbrake = true;
    if (pad.buttons[2]?.pressed || pad.buttons[5]?.pressed) this.nitro = true;

    const readEdge = (index: number, action: Action): void => {
      const pressed = pad!.buttons[index]?.pressed ?? false;
      if (pressed && !this.prevPadButtons[index]) this.actions.add(action);
      this.prevPadButtons[index] = pressed;
    };
    readEdge(3, 'camera');
    readEdge(9, 'pause');
    readEdge(8, 'reset');
  }

  consume(action: Action): boolean {
    if (!this.actions.has(action)) return false;
    this.actions.delete(action);
    return true;
  }

  clearActions(): void {
    this.actions.clear();
  }
}
