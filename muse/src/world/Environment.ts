import * as THREE from 'three';
import type { Track } from './Track';
import { makeGlowStrip } from '../graphics/Materials';

// Instanced city + palms + floodlights + ocean + mountains. All pooled, zero per-frame alloc.
export class Environment {
  group = new THREE.Group();
  private poleLights: THREE.PointLight[] = [];

  constructor(private track: Track) {
    this.buildGround();
    this.buildOcean();
    this.buildMountains();
    this.buildCity();
    this.buildPalms();
    this.buildFloodlights();
  }

  private buildGround() {
    const g = new THREE.CircleGeometry(1400, 48);
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#1a2230'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5000; i++) {
      const v = 20 + Math.random() * 25;
      ctx.fillStyle = `rgb(${v * 0.8},${v},${v * 0.75})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(40, 40);
    tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tex, roughness: 1, metalness: 0 }));
    m.rotation.x = -Math.PI / 2; m.position.y = -0.35; m.receiveShadow = true;
    this.group.add(m);
  }

  private buildOcean() {
    const geo = new THREE.PlaneGeometry(2800, 900, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x06283d, roughness: 0.15, metalness: 0.7, envMapIntensity: 1.2, transparent: true, opacity: 0.96 });
    const sea = new THREE.Mesh(geo, mat);
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(500, -1.2, 700);
    this.group.add(sea);
  }

  private buildMountains() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x131c2b, roughness: 1, flatShading: true });
    const geo = new THREE.ConeGeometry(1, 1, 5);
    const inst = new THREE.InstancedMesh(geo, mat, 26);
    const m4 = new THREE.Matrix4(); const q = new THREE.Quaternion(); const e = new THREE.Euler();
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const r = 950 + Math.random() * 350;
      const h = 160 + Math.random() * 240; const w = 220 + Math.random() * 260;
      e.set(0, Math.random() * Math.PI, 0); q.setFromEuler(e);
      m4.compose(new THREE.Vector3(Math.cos(a) * r, h / 2 - 10, Math.sin(a) * r), q, new THREE.Vector3(w, h, w));
      inst.setMatrixAt(i, m4);
    }
    inst.instanceMatrix.needsUpdate = true;
    this.group.add(inst);
  }

  private buildCity() {
    // instanced towers on the outside of the circuit
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x141b2a, roughness: 0.4, metalness: 0.5, envMapIntensity: 0.8 });
    const COUNT = 130;
    const inst = new THREE.InstancedMesh(box, mat, COUNT);
    inst.castShadow = false; inst.receiveShadow = false;
    const m4 = new THREE.Matrix4(); const q = new THREE.Quaternion();
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffc46b });
    const winGeo = new THREE.PlaneGeometry(1, 1);
    const wins = new THREE.InstancedMesh(winGeo, winMat, COUNT * 3);
    let wi = 0;
    for (let i = 0; i < COUNT; i++) {
      const t = (i / COUNT) * this.track.centerPoints.length;
      const idx = Math.floor(t) % this.track.centerPoints.length;
      const c = this.track.centerPoints[idx];
      const side = Math.random() > 0.5 ? 1 : -1;
      const off = 70 + Math.random() * 220;
      const dir = this.track.centerPoints[(idx + 5) % this.track.centerPoints.length].clone().sub(c).normalize();
      const perp = new THREE.Vector3(-dir.z, 0, dir.x);
      const p = c.clone().addScaledVector(perp, off * side);
      p.y = 0;
      const w = 14 + Math.random() * 22, h = 25 + Math.random() * 110, d = 14 + Math.random() * 22;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI);
      m4.compose(p, q, new THREE.Vector3(w, h, d));
      inst.setMatrixAt(i, m4);
      for (let k = 0; k < 3 && wi < COUNT * 3; k++) {
        const wp = p.clone(); wp.y = h * (0.3 + Math.random() * 0.6); wp.x += (Math.random() - 0.5) * w;
        const wm = new THREE.Matrix4().makeTranslation(wp.x, wp.y, wp.z);
        wins.setMatrixAt(wi++, wm);
      }
    }
    inst.instanceMatrix.needsUpdate = true;
    wins.count = wi; wins.instanceMatrix.needsUpdate = true;
    this.group.add(inst, wins);

    // emissive billboards *beside* the track (never over the road surface)
    const strip = makeGlowStrip('#ff2d78');
    for (let i = 0; i < 12; i++) {
      const idx = Math.floor((i / 12) * this.track.centerPoints.length);
      const c = this.track.centerPoints[idx];
      const nxt = this.track.centerPoints[(idx + 8) % this.track.centerPoints.length];
      const dir = nxt.clone().sub(c); dir.y = 0; dir.normalize();
      const perp = new THREE.Vector3(-dir.z, 0, dir.x);
      const side = i % 2 === 0 ? 1 : -1;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(14, 5, 0.6), strip);
      panel.position.copy(c).addScaledVector(perp, side * (this.track.widths[idx] / 2 + 16));
      panel.position.y = c.y + 5;
      // face the track so drivers see the emissive face, not the dark box side
      panel.lookAt(c.x, panel.position.y, c.z);
      this.group.add(panel);
    }
  }

  private buildPalms() {
    const trunkG = new THREE.CylinderGeometry(0.35, 0.55, 7, 6);
    trunkG.translate(0, 3.5, 0);
    const trunkM = new THREE.MeshStandardMaterial({ color: 0x4a3421, roughness: 1 });
    const leafG = new THREE.ConeGeometry(2.6, 2.2, 7);
    const leafM = new THREE.MeshStandardMaterial({ color: 0x1d5c33, roughness: 0.9, flatShading: true });
    const N = 120;
    const trunks = new THREE.InstancedMesh(trunkG, trunkM, N);
    const leaves = new THREE.InstancedMesh(leafG, leafM, N);
    trunks.castShadow = true;
    const m4 = new THREE.Matrix4(); const q = new THREE.Quaternion(); const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < N; i++) {
      const idx = Math.floor(Math.random() * this.track.centerPoints.length);
      const c = this.track.centerPoints[idx];
      const dir = this.track.centerPoints[(idx + 5) % this.track.centerPoints.length].clone().sub(c).normalize();
      const perp = new THREE.Vector3(-dir.z, 0, dir.x);
      const side = Math.random() > 0.5 ? 1 : -1;
      const p = c.clone().addScaledVector(perp, side * (this.track.widths[idx] / 2 + 10 + Math.random() * 14));
      p.y = c.y - 0.2;
      q.setFromAxisAngle(up, Math.random() * Math.PI * 2);
      const s = 0.8 + Math.random() * 0.7;
      m4.compose(p, q, new THREE.Vector3(s, s, s));
      trunks.setMatrixAt(i, m4);
      const lp = p.clone(); lp.y += 7 * s;
      m4.compose(lp, q, new THREE.Vector3(s, s, s));
      leaves.setMatrixAt(i, m4);
    }
    trunks.instanceMatrix.needsUpdate = true; leaves.instanceMatrix.needsUpdate = true;
    this.group.add(trunks, leaves);
  }

  private buildFloodlights() {
    const poleG = new THREE.CylinderGeometry(0.25, 0.35, 14, 6);
    poleG.translate(0, 7, 0);
    const poleM = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.5, metalness: 0.7 });
    const headG = new THREE.BoxGeometry(3.4, 1, 0.8);
    const headM = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xfff2d9, emissiveIntensity: 4 });
    const N = 24;
    const poles = new THREE.InstancedMesh(poleG, poleM, N);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < N; i++) {
      const idx = Math.floor((i / N) * this.track.centerPoints.length);
      const c = this.track.centerPoints[idx];
      const nxt = this.track.centerPoints[(idx + 8) % this.track.centerPoints.length];
      const dir = nxt.clone().sub(c).normalize();
      const perp = new THREE.Vector3(-dir.z, 0, dir.x);
      const p = c.clone().addScaledVector(perp, this.track.widths[idx] / 2 + 5);
      m4.makeTranslation(p.x, p.y, p.z);
      poles.setMatrixAt(i, m4);
      const head = new THREE.Mesh(headG, headM);
      head.position.set(p.x, p.y + 14, p.z);
      head.lookAt(c.x, 0, c.z);
      this.group.add(head);
      if (i % 4 === 0) {
        const pl = new THREE.PointLight(0xfff0d0, 900, 90, 1.9);
        pl.position.set(p.x, p.y + 13, p.z);
        this.group.add(pl); this.poleLights.push(pl);
      }
    }
    poles.instanceMatrix.needsUpdate = true;
    this.group.add(poles);
  }
}
