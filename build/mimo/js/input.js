/* MIMO VELOCITY — input (keyboard + gamepad) */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';

const keys = {};
const pressed = {};   // edge-triggered, consumed by game

const Input = {
  keys, pressed,
  steerTouch: 0
};
M.input = Input;

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = e.code;
  keys[k] = true;
  pressed[k] = true;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(k)) e.preventDefault();
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

Input.consume = function (code) {
  if (pressed[code]) { pressed[code] = false; return true; }
  return false;
};
Input.clearEdges = function () { for (const k in pressed) pressed[k] = false; };

Input.hasGamepad = function () {
  const gps = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const g of gps) if (g && g.connected) return true;
  return false;
};
Input.gamepadButton = function (idx) {
  const gps = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const g of gps) if (g && g.connected) return g.buttons[idx] && g.buttons[idx].pressed;
  return false;
};

// returns driving input {throttle, brake, steer, nitro, handbrake}
Input.driving = function () {
  let throttle = (keys.KeyW || keys.ArrowUp) ? 1 : 0;
  let brake = (keys.KeyS || keys.ArrowDown) ? 1 : 0;
  let left = (keys.KeyA || keys.ArrowLeft) ? 1 : 0;
  let right = (keys.KeyD || keys.ArrowRight) ? 1 : 0;
  let nitro = !!(keys.ShiftLeft || keys.ShiftRight);
  let handbrake = !!keys.Space;
  let steer = right - left;   // +1 = right

  // gamepad
  const gps = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const g of gps) {
    if (!g || !g.connected) continue;
    const ax = g.axes[0] || 0;
    if (Math.abs(ax) > 0.08) steer = ax;
    const rt = g.buttons[7] ? g.buttons[7].value : 0;   // right trigger
    const lt = g.buttons[6] ? g.buttons[6].value : 0;   // left trigger
    if (rt > 0.05) throttle = Math.max(throttle, rt);
    if (lt > 0.05) brake = Math.max(brake, lt);
    if (g.buttons[0] && g.buttons[0].pressed) nitro = true;      // A
    if (g.buttons[1] && g.buttons[1].pressed) handbrake = true;  // B
    break;
  }
  return { throttle, brake, steer, nitro, handbrake };
};

// camera / menu buttons with edge detection
Input.menuPressed = function (code) { return Input.consume(code); };

})(window.MIMO);
