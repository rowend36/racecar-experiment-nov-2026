import * as THREE from 'three';
import { TextureSet } from '../core/Textures';
import { Track } from './Track';
import { mulberry32 } from '../core/Math';

/**
 * Sunset city environment. Placement rule (learned from four predecessors):
 * NOTHING gameplay-blocking may sit near the road. Every trackside object
 * is validated against Track.nearest() with an explicit margin, and objects
 * that fail the margin are pushed out or skipped.
 */
export class Environment {
  readonly group = new THREE.Group();
  readonly sun: THREE.DirectionalLight;
  private hemi: THREE.HemisphereLight;
  private fill: THREE.DirectionalLight;
  private focusLight: THREE.PointLight;
  private skyMat: THREE.ShaderMaterial;

  constructor(private track: Track, private textures: TextureSet) {
    this.group.name = 'environment';

    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        sunDir: { value: new THREE.Vector3(-0.62, 0.28, -0.45).normalize() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vDir;
        uniform vec3 sunDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = clamp(d.y, -0.2, 1.0);
          vec3 top = vec3(0.08, 0.14, 0.30);
          vec3 mid = vec3(0.45, 0.22, 0.35);
          vec3 hor = vec3(1.00, 0.48, 0.20);
          vec3 col = mix(hor, mid, smoothstep(0.0, 0.22, h));
          col = mix(col, top, smoothstep(0.2, 0.75, h));
          float sunAmt = max(dot(d, sunDir), 0.0);
          col += vec3(1.0, 0.55, 0.25) * pow(sunAmt, 220.0) * 2.4;
          col += vec3(1.0, 0.45, 0.18) * pow(sunAmt, 8.0) * 0.55;
          // Faint drifting cloud bands.
          float cl = sin(d.x * 14.0 + d.y * 30.0) * sin(d.z * 11.0 - d.y * 22.0);
          col += vec3(0.10, 0.05, 0.06) * smoothstep(0.55, 0.95, cl) * smoothstep(0.03, 0.3, d.y);
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(2400, 24, 16), this.skyMat);
    sky.frustumCulled = false;
    this.group.add(sky);

    this.sun = new THREE.DirectionalLight(0xffb36b, 3.0);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 10;
    this.sun.shadow.camera.far = 700;
    const ext = 160;
    this.sun.shadow.camera.left = -ext;
    this.sun.shadow.camera.right = ext;
    this.sun.shadow.camera.top = ext;
    this.sun.shadow.camera.bottom = -ext;
    this.sun.shadow.bias = -0.0004;
    this.group.add(this.sun, this.sun.target);

    this.hemi = new THREE.HemisphereLight(0x9a8bd8, 0x2a3040, 1.0);
    this.group.add(this.hemi);
    this.fill = new THREE.DirectionalLight(0x5a70ff, 0.5);
    this.fill.position.set(300, 200, 400);
    this.group.add(this.fill);

    this.focusLight = new THREE.PointLight(0xffc07a, 60, 60, 1.9);
    this.group.add(this.focusLight);

    this.buildMountains();
    this.buildCity();
    this.buildPalms();
    this.buildStreetlights();
    this.buildGrandstands();
    this.buildBillboards();
    this.buildGantry();
  }

  /** Follow the focus car with sun + shadow frustum + warm fill. */
  update(focus: THREE.Vector3): void {
    const sunDir = new THREE.Vector3(-0.62, 0.42, -0.45).normalize();
    this.sun.position.copy(focus).addScaledVector(sunDir, 320);
    this.sun.target.position.copy(focus);
    this.focusLight.position.set(focus.x, focus.y + 6, focus.z);
  }

  setQuality(ultra: boolean): void {
    this.sun.castShadow = ultra;
    this.sun.shadow.mapSize.set(ultra ? 2048 : 1024, ultra ? 2048 : 1024);
    if (this.sun.shadow.map) {
      this.sun.shadow.map.dispose();
      this.sun.shadow.map = null as never;
    }
  }

  /** True when a world XZ point is at least `margin` metres from the road edge. */
  private clearOfRoad(x: number, z: number, margin: number): boolean {
    const hit = this.track.nearest(new THREE.Vector3(x, 0, z), -1);
    return Math.abs(hit.lateral) >= 8.5 + margin;
  }

  private buildMountains(): void {
    // Integer sine frequencies so the ridge seam matches exactly.
    const geo = new THREE.CylinderGeometry(1500, 1500, 260, 180, 1, true);
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const a = Math.atan2(z, x);
      const h = 130 + 60 * Math.sin(a * 3 + 1.2) + 34 * Math.sin(a * 7 + 0.5) + 16 * Math.sin(a * 13);
      pos.setY(i, pos.getY(i) + h * 0.5);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshBasicMaterial({ color: 0x2a1e33, side: THREE.DoubleSide, fog: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -20;
    this.group.add(mesh);
  }

  private buildCity(): void {
    const rand = mulberry32(20260);
    const towerGeo = new THREE.BoxGeometry(1, 1, 1);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x141824, roughness: 0.9 });
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffffff, emissiveMap: this.textures.windows,
      emissiveIntensity: 1.1, roughness: 0.6,
    });
    const spots: Array<{ x: number; z: number; w: number; h: number; d: number; rot: number }> = [];
    for (let i = 0; i < 260; i++) {
      const x = (rand() - 0.5) * 1500;
      const z = (rand() - 0.5) * 1500;
      if (!this.clearOfRoad(x, z, 34)) continue;
      const distToCentre = Math.hypot(x, z);
      if (distToCentre > 700) continue;
      spots.push({ x, z, w: 12 + rand() * 22, h: 25 + rand() * 95, d: 12 + rand() * 22, rot: rand() * Math.PI });
    }
    const towers = new THREE.InstancedMesh(towerGeo, wallMat, spots.length);
    const glass = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), winMat, spots.length * 2);
    const dummy = new THREE.Object3D();
    let gi = 0;
    spots.forEach((s, i) => {
      const base = this.track.terrainHeightAt(s.x, s.z);
      dummy.position.set(s.x, base + s.h / 2 - 2, s.z);
      dummy.scale.set(s.w, s.h, s.d);
      dummy.rotation.set(0, s.rot, 0);
      dummy.updateMatrix();
      towers.setMatrixAt(i, dummy.matrix);
      for (const face of [0, 1]) {
        dummy.position.set(s.x, base + s.h / 2 - 2, s.z);
        dummy.scale.set(s.w * 0.9, s.h * 0.85, 1);
        dummy.rotation.set(0, s.rot + (face === 0 ? 0 : Math.PI / 2), 0);
        dummy.translateZ((face === 0 ? s.d : s.w) / 2 + 0.15);
        dummy.updateMatrix();
        if (gi < glass.count) glass.setMatrixAt(gi++, dummy.matrix);
      }
    });
    towers.instanceMatrix.needsUpdate = true;
    glass.count = gi;
    glass.instanceMatrix.needsUpdate = true;
    this.group.add(towers, glass);

    // Aircraft warning beacons on the tallest towers.
    const beaconGeo = new THREE.SphereGeometry(0.7, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff2a2a });
    const beacons: THREE.InstancedMesh = new THREE.InstancedMesh(beaconGeo, beaconMat, 24);
    const dummy2 = new THREE.Object3D();
    let bi = 0;
    const tall = [...spots].sort((a, b) => b.h - a.h).slice(0, 24);
    for (const s of tall) {
      dummy2.position.set(s.x, this.track.terrainHeightAt(s.x, s.z) + s.h - 2, s.z);
      dummy2.updateMatrix();
      beacons.setMatrixAt(bi++, dummy2.matrix);
    }
    beacons.count = bi;
    beacons.instanceMatrix.needsUpdate = true;
    this.group.add(beacons);
  }

  private buildPalms(): void {
    const rand = mulberry32(99);
    const trunkGeo = new THREE.CylinderGeometry(0.28, 0.45, 7, 6);
    trunkGeo.translate(0, 3.5, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3826, roughness: 1 });
    const crownGeo = new THREE.IcosahedronGeometry(2.6, 0);
    crownGeo.scale(1, 0.55, 1);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x1f6b2e, roughness: 1 });
    const spots: THREE.Vector3[] = [];
    for (let i = 0; i < 400 && spots.length < 240; i++) {
      const s = this.track.frameAt(rand() * this.track.length);
      const side = rand() > 0.5 ? 1 : -1;
      const lat = side * (14 + rand() * 24);
      const x = s.pos.x + s.right.x * lat;
      const z = s.pos.z + s.right.z * lat;
      if (!this.clearOfRoad(x, z, 5)) continue;
      spots.push(new THREE.Vector3(x, this.track.terrainHeightAt(x, z), z));
    }
    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, spots.length);
    const crowns = new THREE.InstancedMesh(crownGeo, crownMat, spots.length);
    const dummy = new THREE.Object3D();
    spots.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.rotation.set(0, rand() * Math.PI, 0);
      dummy.scale.setScalar(0.85 + rand() * 0.5);
      dummy.updateMatrix();
      trunks.setMatrixAt(i, dummy.matrix);
      dummy.position.y = p.y + 7 * dummy.scale.x;
      dummy.updateMatrix();
      crowns.setMatrixAt(i, dummy.matrix);
    });
    trunks.instanceMatrix.needsUpdate = true;
    crowns.instanceMatrix.needsUpdate = true;
    crowns.castShadow = true;
    this.group.add(trunks, crowns);
  }

  private buildStreetlights(): void {
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 9, 6);
    poleGeo.translate(0, 4.5, 0);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x30343e, roughness: 0.6, metalness: 0.5 });
    const headGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0 });
    const n = this.track.samples.length;
    const step = 40;
    const count = Math.floor(n / step);
    const poles = new THREE.InstancedMesh(poleGeo, poleMat, count * 2);
    const heads = new THREE.InstancedMesh(headGeo, headMat, count * 2);
    const dummy = new THREE.Object3D();
    let pi = 0;
    for (let i = 0; i < n && pi < count * 2; i += step) {
      const s = this.track.samples[i];
      for (const side of [-1, 1]) {
        const lat = side * 14.5;
        const x = s.pos.x + s.right.x * lat;
        const z = s.pos.z + s.right.z * lat;
        if (!this.clearOfRoad(x, z, 4)) continue;
        const y = this.track.terrainHeightAt(x, z);
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        poles.setMatrixAt(pi, dummy.matrix);
        dummy.position.y = y + 9;
        dummy.updateMatrix();
        heads.setMatrixAt(pi, dummy.matrix);
        pi++;
      }
    }
    poles.count = pi;
    heads.count = pi;
    poles.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
    this.group.add(poles, heads);
  }

  private buildGrandstands(): void {
    const rand = mulberry32(5150);
    const geo = new THREE.BoxGeometry(24, 9, 12);
    const mat = new THREE.MeshStandardMaterial({ color: 0x39415a, roughness: 0.9 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xc8ff2e, roughness: 0.7 });
    const placed: THREE.Vector3[] = [];
    for (let i = 0; i < 60 && placed.length < 10; i++) {
      const s = this.track.frameAt(rand() * this.track.length);
      const side = rand() > 0.5 ? 1 : -1;
      const lat = side * (26 + rand() * 20);
      const x = s.pos.x + s.right.x * lat;
      const z = s.pos.z + s.right.z * lat;
      if (!this.clearOfRoad(x, z, 13)) continue;
      placed.push(new THREE.Vector3(x, this.track.terrainHeightAt(x, z), z));
    }
    const stands = new THREE.InstancedMesh(geo, mat, Math.max(1, placed.length));
    const roofs = new THREE.InstancedMesh(new THREE.BoxGeometry(26, 0.6, 14), roofMat, Math.max(1, placed.length));
    const dummy = new THREE.Object3D();
    placed.forEach((p, i) => {
      dummy.position.set(p.x, p.y + 4, p.z);
      dummy.rotation.set(0, rand() * Math.PI, 0);
      dummy.updateMatrix();
      stands.setMatrixAt(i, dummy.matrix);
      dummy.position.y = p.y + 9;
      dummy.updateMatrix();
      roofs.setMatrixAt(i, dummy.matrix);
    });
    stands.count = placed.length;
    roofs.count = placed.length;
    stands.instanceMatrix.needsUpdate = true;
    roofs.instanceMatrix.needsUpdate = true;
    this.group.add(stands, roofs);
  }

  private buildBillboards(): void {
    const rand = mulberry32(31337);
    const panelGeo = new THREE.PlaneGeometry(12, 5);
    const panelMat = new THREE.MeshBasicMaterial({ map: this.textures.banner, side: THREE.DoubleSide });
    const legGeo = new THREE.BoxGeometry(0.5, 9, 0.5);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x22262f, roughness: 0.8 });
    for (let i = 0; i < 40; i++) {
      const s = this.track.frameAt(rand() * this.track.length);
      const side = i % 2 === 0 ? 1 : -1;
      const lat = side * (16 + rand() * 14);
      const x = s.pos.x + s.right.x * lat;
      const z = s.pos.z + s.right.z * lat;
      if (!this.clearOfRoad(x, z, 7)) continue;
      const y = this.track.terrainHeightAt(x, z);
      const yaw = Math.atan2(s.tangent.x, s.tangent.z) + (side > 0 ? -Math.PI / 2 : Math.PI / 2);
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(x, y + 9, z);
      panel.rotation.y = yaw;
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y + 4.5, z);
      this.group.add(panel, leg);
    }
  }

  private buildGantry(): void {
    // Start gantry: 8 m overhead clearance — spans the road, never blocks it.
    const f = this.track.frameAt(0);
    const basis = this.track.basisAt(f);
    const gantry = new THREE.Group();
    const postGeo = new THREE.BoxGeometry(1.2, 9.5, 1.2);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x1c2029, roughness: 0.6, metalness: 0.5 });
    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(f.pos.x + basis.x.x * side * 11.5, f.pos.y + 4.75, f.pos.z + basis.x.z * side * 11.5);
      post.castShadow = true;
      gantry.add(post);
    }
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(25, 2.2, 1.4),
      new THREE.MeshBasicMaterial({ map: this.textures.banner }),
    );
    beam.position.set(f.pos.x, f.pos.y + 9.2, f.pos.z);
    beam.rotation.y = Math.atan2(basis.x.x, basis.x.z) + Math.PI / 2;
    gantry.add(beam);
    // Five countdown lights.
    const lightGeo = new THREE.SphereGeometry(0.35, 10, 10);
    for (let i = 0; i < 5; i++) {
      const lamp = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0x330000 }));
      lamp.name = `gantry-light-${i}`;
      const off = (i - 2) * 2.2;
      lamp.position.set(
        f.pos.x + basis.x.x * off, f.pos.y + 7.4, f.pos.z + basis.x.z * off);
      gantry.add(lamp);
    }
    this.group.add(gantry);
  }

  /** Tint gantry countdown lamps: lit = first `count` of 5 in red. */
  setGantryLights(count: number): void {
    const gantry = this.group.children[this.group.children.length - 1];
    for (let i = 0; i < 5; i++) {
      const lamp = gantry.getObjectByName(`gantry-light-${i}`) as THREE.Mesh | undefined;
      if (!lamp) continue;
      (lamp.material as THREE.MeshBasicMaterial).color.set(i < count ? 0xff2222 : 0x330000);
    }
  }
}
