/** Unified keyboard / gamepad / touch input.Physics never reads DOM or navigator. */

export interface DriveInput {
  throttle: number;
  brake: number;
  steer: number;
  handbrake: boolean;
  nitro: boolean;
}

export type Action = 'camera' | 'reset' | 'pause' | 'mute' | 'fullscreen' | 'confirm' | 'restart';

export function createInput(): DriveInput {
  return { throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };
}

const KEY_ACTIONS: Record<string, Action> = {
  KeyC: 'camera',
  KeyR: 'reset',
  Escape: 'pause',
  KeyP: 'pause',
  KeyM: 'mute',
  KeyF: 'fullscreen',
  Enter: 'confirm',
  KeyT: 'restart',
};

export class Input {
  readonly drive = createInput();
  /** Edge-triggered actions; consumed once per frame via consume(). */
  private pending = new Set<Action>();
  private keys = new Set<string>();
  private touch = { throttle: 0, brake: 0, left: 0, right: 0, handbrake: 0, nitro: 0 };
  private activeGamepad = -1;
  private onAction?: (action: Action) => void;

  constructor(private target: HTMLElement = document.body) {
    window.addEventListener('keydown', this.keyDown, { passive: false });
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('blur', this.blur);
    this.bindTouch();
  }

  setActionListener(listener: (action: Action) => void): void {
    this.onAction = listener;
  }

  /** True when a modal UI control owns the keyboard; Escape still works there. */
  private inUI(): boolean {
    const el = document.activeElement;
    if (!(el instanceof HTMLElement)) return false;
    return el instanceof HTMLInputElement
      || el instanceof HTMLTextAreaElement
      || el instanceof HTMLSelectElement
      || !!el.closest('#menu, #pause, #results, .overlay');
  }

  private keyDown = (e: KeyboardEvent): void => {
    if (e.repeat) return;
    if (this.inUI()) {
      // Leave Enter/Space/Arrows to the browser so buttons and sliders work.
      // Escape remains a global pause/resume shortcut.
      if (e.code === 'Escape') {
        e.preventDefault();
        this.pending.add('pause');
        this.onAction?.('pause');
      }
      return;
    }
    this.keys.add(e.code);
    const action = KEY_ACTIONS[e.code];
    if (action) {
      e.preventDefault();
      this.pending.add(action);
      this.onAction?.(action);
    }
    if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
  };

  private keyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private blur = (): void => {
    this.keys.clear();
    this.drive.throttle = 0;
    this.drive.brake = 0;
    this.drive.steer = 0;
    this.drive.handbrake = false;
    this.drive.nitro = false;
  };

  private bindTouch(): void {
    const map: Array<[string, keyof typeof this.touch]> = [
      ['gas', 'throttle'],
      ['brake', 'brake'],
      ['left', 'left'],
      ['right', 'right'],
      ['drift', 'handbrake'],
      ['nitro', 'nitro'],
    ];
    for (const [name, key] of map) {
      const buttons = this.target.querySelectorAll<HTMLElement>(`[data-touch="${name}"]`);
      for (const button of buttons) {
        const press = (e: Event): void => {
          e.preventDefault();
          this.touch[key] = 1;
          button.classList.add('pressed');
        };
        const release = (e: Event): void => {
          e.preventDefault();
          this.touch[key] = 0;
          button.classList.remove('pressed');
        };
        button.addEventListener('pointerdown', press);
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('pointerleave', release);
      }
    }
    for (const [name, action] of [['camera', 'camera'], ['pause', 'pause'], ['reset', 'reset'], ['nitro', 'nitro']] as const) {
      const buttons = this.target.querySelectorAll<HTMLElement>(`[data-action="${name}"]`);
      for (const button of buttons) {
        button.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (name === 'nitro') return; // held via data-touch
          this.pending.add(action as Action);
          this.onAction?.(action as Action);
        });
      }
    }
  }

  /** Refresh digital state. Call once per rendered frame before stepping physics. */
  poll(): void {
    const d = this.drive;
    const k = this.keys;
    let throttle = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) || this.touch.throttle;
    let brake = (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) || this.touch.brake;
    let steer = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    steer += this.touch.right - this.touch.left;
    let handbrake = k.has('Space') || this.touch.handbrake > 0;
    let nitro = k.has('ShiftLeft') || k.has('ShiftRight') || this.touch.nitro > 0;

    const pads = navigator.getGamepads?.() ?? [];
    let pad: Gamepad | null = null;
    if (this.activeGamepad >= 0) pad = pads[this.activeGamepad] ?? null;
    if (!pad) {
      for (let i = 0; i < pads.length; i += 1) {
        const candidate = pads[i];
        if (candidate && candidate.connected) {
          pad = candidate;
          this.activeGamepad = i;
          break;
        }
      }
    }
    if (pad) {
      const dead = (v: number): number => (Math.abs(v) < 0.12 ? 0 : v);
      const axis = dead(pad.axes[0] ?? 0);
      steer += axis;
      // Standard mapping: button 7 = RT (throttle), 6 = LT (brake); fall back to axes 4/5.
      const rt = pad.buttons[7]?.value ?? 0;
      const lt = pad.buttons[6]?.value ?? 0;
      const rtAxis = Math.max(0, pad.axes[5] ?? 0);
      const ltAxis = Math.max(0, pad.axes[4] ?? 0);
      throttle = Math.max(throttle, rt, rtAxis);
      brake = Math.max(brake, lt, ltAxis);
      if ((pad.buttons[0]?.pressed ?? false)) throttle = 1; // A
      if ((pad.buttons[1]?.pressed ?? false)) brake = 1; // B
      if ((pad.buttons[2]?.pressed ?? false)) handbrake = true; // X
      if ((pad.buttons[5]?.pressed ?? false) || (pad.buttons[4]?.pressed ?? false)) nitro = true;
      const dpad = (pad.buttons[15]?.pressed ? 1 : 0) - (pad.buttons[14]?.pressed ? 1 : 0);
      if (dpad) steer += dpad;

      for (const [index, action] of [[3, 'camera'], [8, 'reset'], [9, 'pause'], [12, 'confirm']] as const) {
        if (pad.buttons[index]?.pressed && !this.padPrev.has(index)) {
          this.pending.add(action);
          this.onAction?.(action);
        }
      }
      this.padPrev.clear();
      for (const index of [3, 8, 9, 12]) if (pad.buttons[index]?.pressed) this.padPrev.add(index);
    }

    d.throttle = Math.min(1, Math.max(0, throttle));
    d.brake = Math.min(1, Math.max(0, brake));
    d.steer = Math.min(1, Math.max(-1, steer));
    d.handbrake = handbrake;
    d.nitro = nitro;
  }

  private padPrev = new Set<number>();

  consume(action: Action): boolean {
    if (!this.pending.has(action)) return false;
    this.pending.delete(action);
    return true;
  }

  clearPending(): void {
    this.pending.clear();
  }

  reset(): void {
    this.drive.throttle = 0;
    this.drive.brake = 0;
    this.drive.steer = 0;
    this.drive.handbrake = false;
    this.drive.nitro = false;
    this.clearPending();
  }

  dispose(): void {
    window.removeEventListener('keydown', this.keyDown);
    window.removeEventListener('keyup', this.keyUp);
    window.removeEventListener('blur', this.blur);
  }
}
