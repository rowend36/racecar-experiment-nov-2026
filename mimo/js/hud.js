/* MIMO VELOCITY — HUD: speedometer, minimap, messages, menus */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';
const U = M.util;

const HUD = {};
M.hud = HUD;

let els = {};
let speedoCtx, mapCtx;
let mapPath = null;       // function(x,z)->[px,py]
let msgTimer = null;
let lastGear = 1;

HUD.init = function (track) {
  els = {
    hud: document.getElementById('hud'),
    posNum: document.getElementById('pos-num'),
    posSuf: document.getElementById('pos-suffix'),
    lapNum: document.getElementById('lap-num'),
    lapTotal: document.getElementById('lap-total'),
    timeCur: document.getElementById('time-cur'),
    timeBest: document.getElementById('time-best'),
    centerMsg: document.getElementById('hud-center-msg'),
    nitroFill: document.getElementById('nitro-fill'),
    gearNum: document.getElementById('gear-num'),
    speedo: document.getElementById('speedo'),
    minimap: document.getElementById('minimap')
  };
  speedoCtx = els.speedo.getContext('2d');
  mapCtx = els.minimap.getContext('2d');
  if (track) HUD.setTrack(track);
};

HUD.setTrack = function (track) {
  mapPath = track.minimapPath(220, 26);
  HUD._track = track;
};

HUD.show = function (on) { els.hud.classList.toggle('hidden', !on); };

HUD.message = function (text, cls, ms) {
  const el = els.centerMsg;
  el.className = cls || '';
  el.textContent = text;
  el.classList.remove('hidden');
  // restart animation
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
  if (msgTimer) clearTimeout(msgTimer);
  if (ms) msgTimer = setTimeout(() => el.classList.add('hidden'), ms);
};
HUD.hideMessage = function () {
  if (msgTimer) clearTimeout(msgTimer);
  els.centerMsg.classList.add('hidden');
};

// ---------- speedometer ----------
function drawSpeedo(kmh, rpm, nitro, boost) {
  const c = speedoCtx, W = 300, cx = 150, cy = 150;
  c.clearRect(0, 0, W, W);
  const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;   // 270° sweep

  // rpm arc (outer)
  const rpmN = U.clamp(rpm / 9000, 0, 1);
  c.lineWidth = 13;
  c.strokeStyle = 'rgba(12,22,44,.85)';
  c.beginPath(); c.arc(cx, cy, 126, a0, a1); c.stroke();
  const grad = c.createLinearGradient(0, 0, W, W);
  grad.addColorStop(0, '#1b7dff'); grad.addColorStop(.55, '#39d7ff'); grad.addColorStop(.8, '#ffe14d'); grad.addColorStop(1, '#ff3d5e');
  c.strokeStyle = grad;
  c.lineCap = 'round';
  c.beginPath(); c.arc(cx, cy, 126, a0, a0 + (a1 - a0) * rpmN); c.stroke();

  // redline flash
  if (rpmN > .93) {
    c.strokeStyle = 'rgba(255,60,90,' + (0.4 + 0.4 * Math.sin(performance.now() * .02)) + ')';
    c.lineWidth = 5;
    c.beginPath(); c.arc(cx, cy, 135, a0 + (a1 - a0) * .93, a1); c.stroke();
  }

  // speed ticks
  c.lineCap = 'butt';
  const maxK = 360;
  for (let v = 0; v <= maxK; v += 20) {
    const t = v / maxK;
    const a = a0 + (a1 - a0) * t;
    const major = v % 60 === 0;
    c.strokeStyle = major ? 'rgba(190,225,255,.85)' : 'rgba(140,180,230,.35)';
    c.lineWidth = major ? 3 : 1.5;
    const r0 = major ? 104 : 110, r1 = 116;
    c.beginPath();
    c.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    c.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    c.stroke();
    if (major && v > 0) {
      c.fillStyle = 'rgba(160,200,240,.7)';
      c.font = '700 11px Arial';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(String(v), cx + Math.cos(a) * 88, cy + Math.sin(a) * 88);
    }
  }

  // speed needle
  const spN = U.clamp(kmh / maxK, 0, 1);
  const sa = a0 + (a1 - a0) * spN;
  c.save();
  c.translate(cx, cy); c.rotate(sa);
  c.fillStyle = boost ? '#7dffea' : '#ff3d8b';
  c.shadowColor = boost ? '#39d7ff' : '#ff3d8b';
  c.shadowBlur = 12;
  c.beginPath();
  c.moveTo(-14, -3); c.lineTo(112, -1.4); c.lineTo(118, 0); c.lineTo(112, 1.4); c.lineTo(-14, 3);
  c.closePath(); c.fill();
  c.restore();

  // hub
  c.shadowBlur = 0;
  c.fillStyle = '#0a1428';
  c.beginPath(); c.arc(cx, cy, 22, 0, 7); c.fill();
  c.strokeStyle = '#39d7ff'; c.lineWidth = 2;
  c.beginPath(); c.arc(cx, cy, 22, 0, 7); c.stroke();

  // digital speed
  c.fillStyle = '#eafaff';
  c.font = '900 italic 52px "Segoe UI", Arial';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(57,215,255,.9)'; c.shadowBlur = 16;
  c.fillText(String(Math.round(kmh)), cx, cy + 58);
  c.shadowBlur = 0;
  c.fillStyle = '#5f86b4';
  c.font = '800 13px Arial';
  c.fillText('KM/H', cx, cy + 88);

  // nitro ring under speedo
  if (nitro < 100 || boost) {
    c.strokeStyle = boost ? 'rgba(120,240,255,.95)' : 'rgba(57,215,255,.5)';
    c.lineWidth = 4;
    c.beginPath(); c.arc(cx, cy, 140, a0, a0 + (a1 - a0) * (nitro / 100)); c.stroke();
  }
}

// ---------- minimap ----------
function drawMinimap(player, cars, track) {
  const c = mapCtx;
  c.clearRect(0, 0, 220, 220);
  if (!mapPath) return;

  // track ribbon
  const S = track.spline.samples;
  c.lineJoin = 'round';
  c.strokeStyle = 'rgba(10,20,40,.9)';
  c.lineWidth = 11;
  c.beginPath();
  for (let i = 0; i <= S.length; i++) {
    const s = S[i % S.length];
    const [px, py] = mapPath.to(s.x, s.z);
    i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
  }
  c.closePath(); c.stroke();
  c.strokeStyle = 'rgba(90,170,255,.75)';
  c.lineWidth = 3;
  c.stroke();

  // start line
  const p0 = mapPath.to(S[0].x, S[0].z);
  const p1 = mapPath.to(S[0].x + S[0].rx * 6, S[0].z + S[0].rz * 6);
  c.strokeStyle = '#fff'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke();

  // cars
  for (const car of cars) {
    const [px, py] = mapPath.to(car.pos.x, car.pos.z);
    if (car === player) {
      c.fillStyle = '#7dffff';
      c.shadowColor = '#39d7ff'; c.shadowBlur = 10;
      c.beginPath(); c.arc(px, py, 5.5, 0, 7); c.fill();
      c.shadowBlur = 0;
      c.strokeStyle = '#04203a'; c.lineWidth = 1.5;
      c.stroke();
    } else {
      const col = car.color;
      c.fillStyle = 'rgb(' + (col[0] * 230 | 0) + ',' + (col[1] * 230 | 0) + ',' + (col[2] * 230 | 0) + ')';
      c.beginPath(); c.arc(px, py, 4, 0, 7); c.fill();
      c.strokeStyle = 'rgba(0,0,0,.6)'; c.lineWidth = 1;
      c.stroke();
    }
  }
}

// ---------- per-frame update ----------
HUD.update = function (st) {
  // st: {player, cars, lap, lapTotal, timeMs, bestMs, position, nitro, kmh, gear, rpm, showMap}
  drawSpeedo(st.kmh, st.rpm, st.nitro, st.boost);
  drawMinimap(st.player, st.cars, HUD._track);

  els.posNum.textContent = st.position;
  els.posSuf.textContent = (function (n) {
    const v = n % 100;
    if (v >= 11 && v <= 13) return 'th';
    switch (n % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
  })(st.position);
  els.lapNum.textContent = Math.min(st.lap + 1, st.lapTotal);
  els.lapTotal.textContent = st.lapTotal;
  els.timeCur.textContent = U.fmtTime(st.timeMs);
  els.timeBest.textContent = U.fmtTime(st.bestMs);
  els.nitroFill.style.width = st.nitro + '%';
  els.nitroFill.classList.toggle('empty', st.nitro < 3);
  if (st.gear !== lastGear) {
    lastGear = st.gear;
    M.audio.shift && M.audio.shift();
  }
  els.gearNum.textContent = st.gear === 0 ? 'R' : String(st.gear);
};

// ---------- menus ----------
HUD.bindMenus = function (cb) {
  const on = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => { M.audio.ensure(); M.audio.ui(); fn(); });
  };
  on('btn-start', cb.start);
  on('btn-garage', cb.garage);
  on('btn-settings', cb.settings);
  on('btn-controls', cb.controls);
  on('btn-garage-back', cb.back);
  on('btn-settings-back', cb.back);
  on('btn-controls-back', cb.back);
  on('btn-resume', cb.resume);
  on('btn-restart', cb.restart);
  on('btn-quit', cb.quit);
  on('btn-again', cb.restart);
  on('btn-menu', cb.quit);
};

HUD.showOverlay = function (id) {
  ['menu-title', 'menu-garage', 'menu-settings', 'menu-controls', 'menu-pause', 'menu-results']
    .forEach(o => document.getElementById(o).classList.toggle('hidden', o !== id));
};
HUD.hideOverlays = function () {
  ['menu-title', 'menu-garage', 'menu-settings', 'menu-controls', 'menu-pause', 'menu-results']
    .forEach(o => document.getElementById(o).classList.add('hidden'));
};

HUD.buildGarage = function (selectedIdx, onPick) {
  const list = document.getElementById('car-list');
  const stats = document.getElementById('car-stats');
  list.innerHTML = '';
  M.CARS.forEach((car, i) => {
    const chip = document.createElement('div');
    chip.className = 'car-chip' + (i === selectedIdx ? ' sel' : '');
    chip.textContent = car.name;
    chip.onclick = () => { M.audio.ui(); onPick(i); };
    list.appendChild(chip);
  });
  const car = M.CARS[selectedIdx];
  stats.innerHTML = '';
  for (const k of ['SPEED', 'ACCEL', 'GRIP', 'NITRO']) {
    const label = document.createElement('div'); label.textContent = k;
    const bar = document.createElement('div'); bar.className = 'stat-bar';
    const fill = document.createElement('i');
    fill.style.width = Math.round(car.stats[k] * 100) + '%';
    bar.appendChild(fill);
    const val = document.createElement('div'); val.textContent = Math.round(car.stats[k] * 100);
    stats.append(label, bar, val);
  }
};

HUD.buildResults = function (rows, title) {
  document.getElementById('results-title').textContent = title;
  const list = document.getElementById('results-list');
  list.innerHTML = '';
  rows.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'res-row' + (r.me ? ' me' : '');
    div.innerHTML = '<span class="' + (i === 0 ? 'p1' : '') + '">' + (i + 1) + '. ' + r.name + '</span>' +
      '<span>' + r.time + '</span>';
    list.appendChild(div);
  });
};

})(window.MIMO);
