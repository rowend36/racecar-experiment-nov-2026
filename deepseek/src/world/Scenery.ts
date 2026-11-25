import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Track, TrackFrame, WALL_LAT } from './Track';
import { TextureSet } from '../core/Textures';
import { clamp, lerp, mulberry32, TAU } from '../core/Math';
import { SUNSET } from './Sky';

const UP = new THREE.Vector3(0, 1, 0);

/** All non-interactive world dressing, instanced and merged to keep draw calls low. */
export class Scenery {
  readonly group = new THREE.Group();
  readonly startLights: THREE.MeshStandardMaterial[] = [];
  private track: Track;
  private textures: TextureSet;
  private rng = mulberry32(9631);

  constructor(track: Track, textures: TextureSet) {
    this.track = track;
    this.textures = textures;
    this.group.name = 'scenery';
    this.buildCity();
    this.buildMountains();
    this.buildPalms();
    this.buildStreetLights();
    this.buildGrandstands();
    this.buildBillboards();
    this.buildGantry();
    this.group.matrixAutoUpdate = false;
    this.group.updateMatrixWorld(true);
  }

  private surfacePoint(frame: TrackFrame, lateral: number): THREE.Vector3 {
    const y = frame.pos.y + Math.tan(frame.bank) * lateral;
    return new THREE.Vector3(
      frame.pos.x + frame.right.x * lateral,
      y,
      frame.pos.z + frame.right.z * lateral,
    );
  }

  private buildCity(): void {
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const mat = new THREE.MeshStandardMaterial({
      map: this.textures.windows,
      emissiveMap: this.textures.windowsLit,
      emissive: 0xffffff,
      emissiveIntensity: 1.35,
      roughness: 0.62,
      metalness: 0.32,
      envMapIntensity: 0.7,
      color: 0x8b93a6,
    });
    const count = 175;
    const mesh = new THREE.InstancedMesh(box, mat, count);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();
    const tips: THREE.Vector3[] = [];
    const tints = [0x8fa0bd, 0x6e7d99, 0xa28fa0, 0x7e8a8f, 0x596780];
    let placed = 0;
    let guard = 0;
    const sunAngle = Math.atan2(SUNSET.sunDir.z, SUNSET.sunDir.x);
    while (placed < count && guard++ < 4000) {
      const angle = this.rng() * TAU;
      const radius = 165 + Math.pow(this.rng(), 0.68) * 640;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const hit = this.track.nearest(new THREE.Vector3(x, 0, z));
      if (Math.sqrt(hit.distSq) < 62) continue;
      if (Math.hypot(x, z) > 820) continue;
      const w = 15 + this.rng() * 26;
      const d = 15 + this.rng() * 26;
      let h = 16 + Math.pow(this.rng(), 1.5) * 118;
      // Keep a low-rise window open toward the sun so the sunset reads over the city.
      let da = Math.atan2(z, x) - sunAngle;
      while (da > Math.PI) da -= TAU;
      while (da < -Math.PI) da += TAU;
      if (Math.abs(da) < 0.3 && radius < 760) h = Math.min(h, 22 + this.rng() * 14);
      const y = this.track.terrainHeightAt(x, z) - 1.2;
      q.setFromEuler(new THREE.Euler(0, this.rng() * TAU, 0));
      scale.set(w, h, d);
      m.compose(new THREE.Vector3(x, y, z), q, scale);
      mesh.setMatrixAt(placed, m);
      color.setHex(tints[Math.floor(this.rng() * tints.length)]);
      mesh.setColorAt(placed, color);
      if (h > 70) tips.push(new THREE.Vector3(x, y + h + 0.8, z));
      placed++;
    }
    mesh.count = placed;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
    this.group.add(mesh);

    // Aircraft warning beacons on the tallest towers.
    if (tips.length > 0) {
      const beaconGeo = new THREE.SphereGeometry(0.55, 8, 6);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0x220000,
        emissive: 0xff1a3a,
        emissiveIntensity: 8,
        toneMapped: true,
      });
      const beacons = new THREE.InstancedMesh(beaconGeo, beaconMat, tips.length);
      const bm = new THREE.Matrix4();
      for (let i = 0; i < tips.length; i++) {
        bm.makeTranslation(tips[i].x, tips[i].y, tips[i].z);
        beacons.setMatrixAt(i, bm);
      }
      beacons.instanceMatrix.needsUpdate = true;
      beacons.frustumCulled = false;
      this.group.add(beacons);
    }
  }

  private buildMountains(): void {
    const segments = 200;
    const rows = [
      { radius: 1580, yScale: 0.0 },
      { radius: 1380, yScale: 0.34 },
      { radius: 1240, yScale: 0.72 },
      { radius: 1150, yScale: 1.0 },
    ];
    const heights: number[] = [];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * TAU;
      const h =
        58 +
        95 * (0.5 + 0.5 * Math.sin(a * 3 + 1.7)) +
        38 * (0.5 + 0.5 * Math.sin(a * 7 + 0.4)) +
        18 * (0.5 + 0.5 * Math.sin(a * 13 + 2.2));
      heights.push(h);
    }
    heights[segments] = heights[0];
    const verts: number[] = [];
    const idx: number[] = [];
    for (let r = 0; r < rows.length; r++) {
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * TAU;
        const h = heights[i];
        const row = rows[r];
        const jitter = 1 + Math.sin(a * 17 + r * 2.1) * 0.035;
        verts.push(
          Math.cos(a) * row.radius * jitter,
          -6 + h * row.yScale + (r === rows.length - 1 ? 0 : 0),
          Math.sin(a) * row.radius * jitter,
        );
      }
    }
    const rowLen = segments + 1;
    for (let r = 0; r < rows.length - 1; r++) {
      for (let i = 0; i < segments; i++) {
        const a = r * rowLen + i;
        const b = a + 1;
        const c = (r + 1) * rowLen + i;
        const d = c + 1;
        idx.push(a, b, c, c, b, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x18202e,
      roughness: 1,
      metalness: 0,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    const ridge = new THREE.Mesh(geo, mat);
    ridge.frustumCulled = false;
    this.group.add(ridge);
  }

  private buildPalms(): void {
    const trunkGeo = new THREE.CylinderGeometry(0.16, 0.34, 7.4, 6, 1);
    trunkGeo.translate(0, 3.7, 0);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4c3d2c,
      roughness: 0.92,
      flatShading: true,
    });

    const fronds: THREE.BufferGeometry[] = [];
    const frondCount = 9;
    for (let i = 0; i < frondCount; i++) {
      const g = new THREE.PlaneGeometry(3.9, 1.15, 1, 1);
      g.translate(1.95, 0, 0);
      g.rotateZ(-0.42 - this.rng() * 0.18);
      g.rotateY((i / frondCount) * TAU + this.rng() * 0.2);
      g.translate(0, 7.25, 0);
      fronds.push(g);
    }
    const crownGeo = mergeGeometries(fronds, false);
    if (!crownGeo) return;
    const crownMat = new THREE.MeshStandardMaterial({
      map: this.textures.palmFrond,
      alphaTest: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.85,
      color: 0xb9d3a7,
      envMapIntensity: 0.5,
    });

    const transforms: Array<{ p: THREE.Vector3; yaw: number; s: number }> = [];
    const n = this.track.samples.length;
    for (let i = 0; i < n; i += 23) {
      const side = Math.floor(i / 23) % 2 === 0 ? 1 : -1;
      const f = this.track.frameAt((i / n) * this.track.length);
      const lateral = side * (WALL_LAT + 5 + this.rng() * 10);
      const p = this.surfacePoint(f, lateral);
      const hit = this.track.nearest(p);
      if (Math.abs(hit.lateral) < WALL_LAT + 2.5) continue;
      p.y = this.track.terrainHeightAt(p.x, p.z) - 0.2;
      transforms.push({ p, yaw: this.rng() * TAU, s: 0.75 + this.rng() * 0.5 });
    }
    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, transforms.length);
    const crowns = new THREE.InstancedMesh(crownGeo, crownMat, transforms.length);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    transforms.forEach((t, i) => {
      q.setFromEuler(new THREE.Euler(0, t.yaw, 0));
      m.compose(t.p, q, new THREE.Vector3(t.s, t.s, t.s));
      trunks.setMatrixAt(i, m);
      crowns.setMatrixAt(i, m);
    });
    trunks.instanceMatrix.needsUpdate = true;
    crowns.instanceMatrix.needsUpdate = true;
    trunks.castShadow = true;
    crowns.castShadow = false;
    this.group.add(trunks, crowns);
  }

  private buildStreetLights(): void {
    const poleParts: THREE.BufferGeometry[] = [];
    const pole = new THREE.CylinderGeometry(0.09, 0.13, 7.6, 6);
    pole.translate(0, 3.8, 0);
    poleParts.push(pole);
    const arm = new THREE.BoxGeometry(1.5, 0.1, 0.12);
    arm.translate(0.75, 7.45, 0);
    poleParts.push(arm);
    const merged = mergeGeometries(poleParts, false);
    if (!merged) return;
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x181c23,
      roughness: 0.42,
      metalness: 0.8,
    });
    const lampGeo = new THREE.BoxGeometry(0.82, 0.1, 0.3);
    const lampMat = new THREE.MeshStandardMaterial({
      color: 0x0a1014,
      emissive: 0xd8ecff,
      emissiveIntensity: 9,
    });

    const points: Array<{ p: THREE.Vector3; basis: THREE.Vector3; z: THREE.Vector3 }> = [];
    const n = this.track.samples.length;
    for (let i = 0; i < n; i += 27) {
      const side = Math.floor(i / 27) % 2 === 0 ? 1 : -1;
      const f = this.track.frameAt((i / n) * this.track.length);
      const lateral = side * 16.5;
      const p = this.surfacePoint(f, lateral);
      p.y = this.track.terrainHeightAt(p.x, p.z) - 0.35;
      const toward = f.right.clone().multiplyScalar(-side);
      points.push({ p, basis: toward, z: f.tangent.clone() });
    }
    const poles = new THREE.InstancedMesh(merged, poleMat, points.length);
    const lamps = new THREE.InstancedMesh(lampGeo, lampMat, points.length);
    const m = new THREE.Matrix4();
    const x = new THREE.Vector3();
    const y = new THREE.Vector3();
    const z = new THREE.Vector3();
    const basis = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const one = new THREE.Vector3(1, 1, 1);
    points.forEach((pt, i) => {
      x.copy(pt.basis).normalize();
      y.copy(UP);
      z.crossVectors(x, y).normalize();
      y.crossVectors(z, x).normalize();
      basis.makeBasis(x, y, z);
      quat.setFromRotationMatrix(basis);
      m.compose(pt.p, quat, one);
      poles.setMatrixAt(i, m);
      const lampPos = pt.p.clone().addScaledVector(x, 1.42);
      lampPos.y += 7.45;
      m.makeTranslation(lampPos.x, lampPos.y, lampPos.z);
      lamps.setMatrixAt(i, m);
    });
    poles.instanceMatrix.needsUpdate = true;
    lamps.instanceMatrix.needsUpdate = true;
    poles.castShadow = false;
    this.group.add(poles, lamps);
  }

  private standGeometry(
    centerS: number,
    side: number,
  ): { structure: THREE.BufferGeometry; crowd: THREE.BufferGeometry; roof: THREE.BufferGeometry; glow: THREE.BufferGeometry } {
    const f = this.track.frameAt(centerS);
    const lateral = side * 25;
    const base = this.surfacePoint(f, lateral);
    base.y = this.track.terrainHeightAt(base.x, base.z) - 0.4;
    const toward = f.right.clone().multiplyScalar(-side).normalize();
    const along = f.tangent.clone();
    along.addScaledVector(toward, -along.dot(toward)).normalize();
    const yAxis = new THREE.Vector3().crossVectors(toward, along).normalize();
    const mat4 = new THREE.Matrix4().makeBasis(along, yAxis, toward);
    mat4.setPosition(base);

    const structure: THREE.BufferGeometry[] = [];
    const crowd: THREE.BufferGeometry[] = [];
    const roof: THREE.BufferGeometry[] = [];
    const glows: THREE.BufferGeometry[] = [];
    const width = 46;
    const tiers = 5;
    for (let i = 0; i < tiers; i++) {
      const step = new THREE.BoxGeometry(width, 0.9, 2.7);
      step.translate(0, 0.45 + i * 0.82, -i * 2.55);
      structure.push(step);
      const band = new THREE.PlaneGeometry(width - 1, 0.7);
      band.translate(0, 0.9 + i * 0.82, -i * 2.55 + 1.36);
      crowd.push(band);
    }
    const back = new THREE.BoxGeometry(width, 7.5, 0.6);
    back.translate(0, 3.75, -tiers * 2.55 - 0.3);
    structure.push(back);
    for (const sx of [-width / 2 + 1, width / 2 - 1]) {
      const post = new THREE.BoxGeometry(0.5, 8.6, 0.5);
      post.translate(sx, 4.3, -tiers * 2.55 + 1.2);
      structure.push(post);
    }
    const canopy = new THREE.BoxGeometry(width + 2, 0.35, 13.6);
    canopy.translate(0, 9.4, -5.9);
    roof.push(canopy);
    const trim = new THREE.BoxGeometry(width + 2, 0.14, 0.2);
    trim.translate(0, 9.25, 0.85);
    roof.push(trim);
    const under = new THREE.BoxGeometry(width, 0.1, 0.1);
    under.translate(0, 9.2, -12.6);
    roof.push(under);
    const neon = new THREE.BoxGeometry(width + 2, 0.09, 0.09);
    neon.translate(0, 9.2, -0.82);
    glows.push(neon);

    const apply = (geos: THREE.BufferGeometry[]): THREE.BufferGeometry => {
      const out = geos.map((g) => {
        g.applyMatrix4(mat4);
        return g;
      });
      const merged = mergeGeometries(out, false);
      if (!merged) throw new Error('stand merge failed');
      return merged;
    };
    return { structure: apply(structure), crowd: apply(crowd), roof: apply(roof), glow: apply(glows) };
  }

  private buildGrandstands(): void {
    const concrete = new THREE.MeshStandardMaterial({
      color: 0x30343c,
      roughness: 0.85,
      metalness: 0.1,
    });
    const crowdMat = new THREE.MeshStandardMaterial({
      map: this.textures.crowd,
      emissiveMap: this.textures.crowd,
      emissive: 0xffffff,
      emissiveIntensity: 1.15,
      roughness: 0.9,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x1b2028,
      roughness: 0.55,
      metalness: 0.5,
    });
    const parts = [
      this.standGeometry(this.track.length * 0.012, 1),
      this.standGeometry(this.track.length * 0.32, -1),
      this.standGeometry(this.track.length * 0.63, 1),
      this.standGeometry(this.track.length * 0.81, -1),
    ];
    const structures = mergeGeometries(parts.map((p) => p.structure), false);
    const crowds = mergeGeometries(parts.map((p) => p.crowd), false);
    const roofs = mergeGeometries(parts.map((p) => p.roof), false);
    const glowGeos = mergeGeometries(parts.map((p) => p.glow), false);
    if (structures) this.group.add(new THREE.Mesh(structures, concrete));
    if (crowds) this.group.add(new THREE.Mesh(crowds, crowdMat));
    if (roofs) this.group.add(new THREE.Mesh(roofs, roofMat));
    if (glowGeos) {
      const glowMat = new THREE.MeshStandardMaterial({ color: 0x05070a, emissive: 0x35e6ff, emissiveIntensity: 3.2, roughness: 0.4 });
      this.group.add(new THREE.Mesh(glowGeos, glowMat));
    }
  }

  private buildBillboards(): void {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0d1017,
      roughness: 0.4,
      metalness: 0.85,
    });
    const sValues = [0.085, 0.19, 0.28, 0.40, 0.52, 0.61, 0.72, 0.86];
    sValues.forEach((frac, idx) => {
      const side = idx % 2 === 0 ? 1 : -1;
      const f = this.track.frameAt(this.track.length * frac);
      const lateral = side * 26;
      const p = this.surfacePoint(f, lateral);
      p.y = this.track.terrainHeightAt(p.x, p.z);
      const tex = this.textures.billboards[idx % this.textures.billboards.length];

      const group = new THREE.Group();
      const panelMat = new THREE.MeshStandardMaterial({
        map: tex,
        emissiveMap: tex,
        emissive: 0xffffff,
        emissiveIntensity: 1.55,
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 4.8), panelMat);
      panel.position.y = 6.8;
      group.add(panel);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(10.1, 5.3, 0.22), frameMat);
      frame.position.set(0, 6.8, -0.14);
      group.add(frame);
      for (const sx of [-3.2, 3.2]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, 6.8, 0.32), frameMat);
        post.position.set(sx, 3.4, -0.25);
        group.add(post);
      }
      group.position.copy(p);
      const target = f.pos.clone();
      target.y = p.y + 5.5;
      group.lookAt(target);
      this.group.add(group);
    });
  }

  private buildGantry(): void {
    const s = 8;
    const f = this.track.frameAt(s);
    const basis = this.track.basisAt(f);
    const group = new THREE.Group();
    const mat = new THREE.Matrix4().makeBasis(basis.x, basis.y, basis.z);
    group.quaternion.setFromRotationMatrix(mat);
    group.position.copy(f.pos).addScaledVector(basis.y, 0.02);

    const metal = new THREE.MeshStandardMaterial({
      color: 0x171c25,
      roughness: 0.34,
      metalness: 0.82,
    });
    const neon = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      emissive: 0x2fe8ff,
      emissiveIntensity: 5,
    });
    const half = 10.6;
    for (const sx of [-half, half]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.75, 7.2, 0.75), metal);
      leg.position.set(sx, 3.6, 0);
      group.add(leg);
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 6.2, 0.82), neon);
      strip.position.set(sx, 3.4, 0);
      group.add(strip);
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(22, 1.15, 0.95), metal);
    beam.position.y = 6.7;
    group.add(beam);

    const signMat = new THREE.MeshStandardMaterial({
      map: this.textures.startSign,
      emissiveMap: this.textures.startSign,
      emissive: 0xffffff,
      emissiveIntensity: 3,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.4,
    });
    const housing = new THREE.MeshStandardMaterial({
      color: 0x08090c,
      roughness: 0.5,
      metalness: 0.4,
    });
    for (const sz of [-0.5, 0.5]) {
      const backing = new THREE.Mesh(new THREE.BoxGeometry(12.1, 2.65, 0.12), housing);
      backing.position.set(0, 6.72, sz * 0.86);
      group.add(backing);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 2.2), signMat);
      sign.position.set(0, 6.72, sz);
      if (sz < 0) sign.rotation.y = Math.PI;
      group.add(sign);
    }

    for (let i = 0; i < 5; i++) {
      const x = -3.6 + i * 1.8;
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.5), housing);
      box.position.set(x, 5.72, 0);
      group.add(box);
      const matLight = new THREE.MeshStandardMaterial({
        color: 0x200000,
        emissive: 0x250004,
        emissiveIntensity: 2,
        roughness: 0.3,
      });
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), matLight);
      light.position.set(x, 5.72, 0.27);
      group.add(light);
      this.startLights.push(matLight);
    }

    this.group.add(group);
  }

  setStartLights(lit: number, green: boolean): void {
    this.startLights.forEach((mat, i) => {
      if (green) {
        mat.emissive.setHex(0x22ff88);
        mat.emissiveIntensity = 9;
      } else if (i < lit) {
        mat.emissive.setHex(0xff1a2e);
        mat.emissiveIntensity = 9;
      } else {
        mat.emissive.setHex(0x250004);
        mat.emissiveIntensity = 1.5;
      }
    });
  }
}
