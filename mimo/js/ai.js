/* MIMO VELOCITY — AI drivers */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';
const U = M.util;

function initAI(car, skill) {
  car.ai = {
    skill: skill,
    nitroT: 0,
    nitroCd: 1 + Math.random() * 3,
    avoid: 0,
    stuckT: 0,
    wrongT: 0,
    lastLat: 0
  };
}
M.initAI = initAI;

// returns input {throttle, brake, steer, nitro, handbrake}
M.aiThink = function (car, dt, track, cars) {
  const ai = car.ai;
  const speed = Math.abs(car.vF);
  const L = track.length;
  const N = track.N;
  const per = L / N;
  const idx = (s) => track.indexAt(s).i;

  // ---- lookahead target on racing line ----
  const look = 10 + speed * 0.62;
  const sAhead = car.s + look;
  const idxAhead = idx(sAhead);
  const lineLat = track.lineOff[idxAhead];

  // ---- obstacle avoidance: offset laterally if a car is close ahead ----
  let avoidTarget = 0;
  const myFwd = { x: Math.sin(car.yaw), z: Math.cos(car.yaw) };
  for (let i = 0; i < cars.length; i++) {
    const o = cars[i];
    if (o === car) continue;
    const dx = o.pos.x - car.pos.x, dz = o.pos.z - car.pos.z;
    const ahead = dx * myFwd.x + dz * myFwd.z;
    if (ahead < 1 || ahead > 16 + speed * 0.3) continue;
    const side = dx * (-myFwd.z) + dz * (myFwd.x); // >0 = right of us
    if (Math.abs(side) > 3.4) continue;
    // choose side with more room
    const prefer = side >= 0 ? -1 : 1; // pass opposite side
    avoidTarget = prefer * 2.8;
    // if very close, brake a touch
    if (ahead < 9) avoidTarget = prefer * 3.2;
  }
  ai.avoid = U.damp(ai.avoid, avoidTarget, 3.2, dt);

  let targetLat = lineLat + ai.avoid;
  // wall repulsion (keep off the barriers)
  if (car.lat > 4.5) targetLat -= (car.lat - 4.5) * 0.9;
  else if (car.lat < -4.5) targetLat += (-4.5 - car.lat) * 0.9;
  targetLat = U.clamp(targetLat, -(track.halfWidth - 2.6), track.halfWidth - 2.6);

  // ---- pure pursuit steering (+1 = right; yaw increases to the LEFT) ----
  const p = track.pointAt(sAhead, targetLat);
  const dx = p.x - car.pos.x, dz = p.z - car.pos.z;
  const desiredYaw = Math.atan2(dx, dz);
  const err = U.wrapPi(desiredYaw - car.yaw);
  let steer = U.clamp(-err * 2.4, -1, 1);
  // damp steering near target to avoid oscillation
  steer *= U.clamp(1 + speed * 0.01, 1, 1.6);

  // ---- speed target (skill-scaled) ----
  let target = Infinity;
  const window = Math.floor(look / per) + 2;
  for (let k = 0; k < window; k++) {
    target = Math.min(target, track.lineSpeed[idx(car.s + k * per)]);
  }
  target *= ai.skill;

  // rubber-band (subtle): catch up if behind player, ease if far ahead
  const diff = car.progress - car.__playerProgress;
  if (diff !== undefined) {
    if (diff < -60) target *= 1.045;
    else if (diff > 90) target *= 0.965;
  }

  let throttle = 1, brake = 0;
  if (speed > target * 1.02) {
    throttle = 0;
    brake = U.clamp((speed - target) / Math.max(6, target * 0.22), 0, 1);
  } else if (speed > target * 0.9) {
    throttle = 0.55;
  }

  // stuck / wrong-way recovery
  if (speed < 2.5 && throttle > .5) ai.stuckT += dt; else ai.stuckT = Math.max(0, ai.stuckT - dt * 0.7);
  if (ai.stuckT > 3.5) {
    car.respawn(track);
    ai.stuckT = 0;
  }
  if (car.wrongWay > 0.9) ai.wrongT += dt; else ai.wrongT = Math.max(0, ai.wrongT - dt * 1.5);
  if (ai.wrongT > 2.5) {
    car.respawn(track);
    ai.wrongT = 0;
  }
  if (car.wrongWay > 0.5 && speed < 14) {
    const sp = track.spline.samples[idx(car.s)];
    const tYaw = Math.atan2(sp.tx, sp.tz);
    steer = U.clamp(-U.wrapPi(tYaw - car.yaw) * 2, -1, 1);
    brake = 0; throttle = 1;
  }

  // ---- nitro on straights ----
  let nitro = false;
  ai.nitroCd -= dt;
  if (ai.nitroT > 0) { ai.nitroT -= dt; nitro = true; }
  else if (ai.nitroCd <= 0 && throttle > .9 && speed > 24 && speed < target * .92) {
    const curv = Math.abs(track.curv[idx(car.s)]);
    if (curv < 0.004) { ai.nitroT = 1.6 + Math.random() * 1.4; ai.nitroCd = 6 + Math.random() * 6; }
    else ai.nitroCd = 1.5;
  }

  return { throttle, brake, steer, nitro, handbrake: false };
};

})(window.MIMO);
