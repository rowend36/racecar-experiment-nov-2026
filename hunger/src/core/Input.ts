import type { InputFrame, UIAction } from '../game/types';

type TouchControl = 'steer-left' | 'steer-right' | 'throttle' | 'brake' | 'handbrake';

const DRIVING_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space',
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
]);

/** Unified keyboard, gamepad and multi-touch input with edge-triggered UI actions. */
export class InputManager {
  private readonly keys = new Set<string>();
  private readonly touches = new Set<TouchControl>();
  private readonly pointerControls = new Map<number, TouchControl>();
  private readonly actions: UIAction[] = [];
  private readonly root: HTMLElement;
  private attached = false;
  private previousPause = false;
  private previousCamera = false;
  private previousReset = false;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  attach(): void {
    if (this.attached) return;
    this.attached = true;
    window.addEventListener('keydown', this.onKeyDown, { passive: false });
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.clear);
    this.root.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    this.root.addEventListener('contextmenu', this.onContextMenu);
  }

  sample(): InputFrame {
    const left = this.keys.has('ArrowLeft') || this.keys.has('KeyA') || this.touches.has('steer-left');
    const right = this.keys.has('ArrowRight') || this.keys.has('KeyD') || this.touches.has('steer-right');
    const keyboardThrottle = this.keys.has('ArrowUp') || this.keys.has('KeyW');
    const keyboardBrake = this.keys.has('ArrowDown') || this.keys.has('KeyS');
    const keyboardHandbrake = this.keys.has('Space');
    let throttle = (keyboardThrottle || this.touches.has('throttle')) ? 1 : 0;
    let brake = (keyboardBrake || this.touches.has('brake')) ? 1 : 0;
    let steer = (right ? 1 : 0) - (left ? 1 : 0);
    let handbrake = keyboardHandbrake || this.touches.has('handbrake');

    const gamepad = navigator.getGamepads?.()[0];
    if (gamepad) {
      const axis = Math.abs(gamepad.axes[0] ?? 0) > 0.12 ? gamepad.axes[0] : 0;
      if (Math.abs(axis) > Math.abs(steer)) steer = axis;
      throttle = Math.max(throttle, gamepad.buttons[0]?.value ?? 0, gamepad.buttons[7]?.value ?? 0);
      brake = Math.max(brake, gamepad.buttons[1]?.value ?? 0, gamepad.buttons[6]?.value ?? 0);
      handbrake ||= (gamepad.buttons[2]?.value ?? 0) > 0.5;
      const pause = (gamepad.buttons[9]?.value ?? 0) > 0.5;
      const camera = (gamepad.buttons[3]?.value ?? 0) > 0.5;
      const reset = (gamepad.buttons[8]?.value ?? 0) > 0.5;
      if (pause && !this.previousPause) this.actions.push('pause');
      if (camera && !this.previousCamera) this.actions.push('camera');
      if (reset && !this.previousReset) this.actions.push('reset');
      this.previousPause = pause;
      this.previousCamera = camera;
      this.previousReset = reset;
    } else {
      this.previousPause = false;
      this.previousCamera = false;
      this.previousReset = false;
    }

    return { throttle, brake, steer, handbrake };
  }

  consumeActions(): UIAction[] {
    if (this.actions.length === 0) return [];
    return this.actions.splice(0, this.actions.length);
  }

  dispose(): void {
    if (!this.attached) return;
    this.attached = false;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.clear);
    this.root.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    this.root.removeEventListener('contextmenu', this.onContextMenu);
    this.clear();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (DRIVING_KEYS.has(event.code)) event.preventDefault();
    if (!event.repeat) this.queueAction(event.code);
    this.keys.add(event.code);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-control], [data-action]');
    if (!target) return;
    event.preventDefault();
    try { target.setPointerCapture?.(event.pointerId); } catch { /* synthetic or already-released pointer */ }
    const control = target.dataset.control as TouchControl | undefined;
    if (control) {
      this.pointerControls.set(event.pointerId, control);
      this.touches.add(control);
    }
    const action = target.dataset.action as UIAction | undefined;
    if (action) this.actions.push(action);
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    const control = this.pointerControls.get(event.pointerId);
    if (control) {
      this.pointerControls.delete(event.pointerId);
      this.touches.delete(control);
    }
  };

  private readonly onContextMenu = (event: Event): void => {
    if ((event.target as HTMLElement | null)?.closest('[data-control]')) event.preventDefault();
  };

  private readonly clear = (): void => {
    this.keys.clear();
    this.touches.clear();
    this.pointerControls.clear();
  };

  private queueAction(code: string): void {
    switch (code) {
      case 'Escape':
      case 'KeyP':
        this.actions.push('pause');
        break;
      case 'KeyC':
        this.actions.push('camera');
        break;
      case 'KeyR':
        this.actions.push('reset');
        break;
      case 'KeyM':
        this.actions.push('mute');
        break;
      case 'KeyF':
        this.actions.push('fullscreen');
        break;
      case 'Enter':
        this.actions.push('start');
        break;
      default:
        break;
    }
  }
}
