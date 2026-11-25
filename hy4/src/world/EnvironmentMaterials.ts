import * as THREE from 'three';
import { roadMaterial, surfaces } from '../render/Materials';

export interface EnvMaterials {
  asphalt: THREE.MeshStandardMaterial;
  runoff: THREE.MeshStandardMaterial;
  curb: THREE.MeshStandardMaterial;
  line: THREE.MeshStandardMaterial;
  barrier: THREE.MeshStandardMaterial;
  neon: [THREE.MeshBasicMaterial, THREE.MeshBasicMaterial];
  barrierPost: THREE.MeshStandardMaterial;
  checker: THREE.MeshStandardMaterial;
  gantry: THREE.MeshStandardMaterial;
  banner: THREE.MeshBasicMaterial;
  lightOff: THREE.MeshBasicMaterial;
  ocean: THREE.MeshStandardMaterial;
  ground: THREE.MeshStandardMaterial;
  mountain: THREE.MeshStandardMaterial;
  building: THREE.MeshStandardMaterial;
  trunk: THREE.MeshStandardMaterial;
  palm: THREE.MeshStandardMaterial;
  mast: THREE.MeshStandardMaterial;
  lampHead: THREE.MeshBasicMaterial;
  standBase: THREE.MeshStandardMaterial;
  standSeats: THREE.MeshStandardMaterial;
  billboard: THREE.MeshBasicMaterial;
}

function label(text: string, sub: string, bg: string, fg: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = fg;
  ctx.font = '900 62px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 256, 76);
  ctx.font = '600 20px Arial, sans-serif';
  ctx.globalAlpha = 0.7;
  ctx.fillText(sub, 256, 108);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let cache: EnvMaterials | null = null;
let wetCache = -1;

/** Shared world materials — recreated only when wetness actually changes. */
export function surfaceMaterials(wet: number): EnvMaterials {
  if (cache && Math.abs(wet - wetCache) < 0.01) return cache;
  wetCache = wet;
  cache = {
    asphalt: roadMaterial(2400, wet),
    runoff: new THREE.MeshStandardMaterial({ color: 0x4a4c4b, roughness: 0.98, metalness: 0 }),
    curb: new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.62, metalness: 0.02 }),
    line: new THREE.MeshStandardMaterial({ color: 0xf2f5f8, roughness: 0.55, metalness: 0 }),
    barrier: new THREE.MeshStandardMaterial({ color: 0x20242d, roughness: 0.58, metalness: 0.5, side: THREE.DoubleSide }),
    neon: [
      new THREE.MeshBasicMaterial({ color: 0x2fd0ff, toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: 0xff3d78, toneMapped: false }),
    ],
    barrierPost: new THREE.MeshStandardMaterial({ color: 0x9aa4b2, roughness: 0.45, metalness: 0.8 }),
    checker: new THREE.MeshStandardMaterial({ map: surfaces().checker, roughness: 0.7 }),
    gantry: new THREE.MeshStandardMaterial({ color: 0x20232c, roughness: 0.5, metalness: 0.7 }),
    banner: new THREE.MeshBasicMaterial({ map: label('REDLINE GP', 'COASTLINE CIRCUIT  •  NEON BAY', '#0b0d16', '#ff3d6e'), toneMapped: false }),
    lightOff: new THREE.MeshBasicMaterial({ color: 0x3d4656, toneMapped: false }),
    ocean: new THREE.MeshStandardMaterial({ color: 0x0a1c2c, roughness: 0.16, metalness: 0.7, envMapIntensity: 1.4 }),
    ground: new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 1, metalness: 0 }),
    mountain: new THREE.MeshStandardMaterial({ color: 0x18202c, roughness: 1, metalness: 0, side: THREE.DoubleSide }),
    building: new THREE.MeshStandardMaterial({
      map: surfaces().windows,
      emissiveMap: surfaces().windows,
      emissive: 0xffffff,
      emissiveIntensity: 0.85,
      color: 0x5a6577,
      roughness: 0.82,
      metalness: 0.16,
    }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x4b4036, roughness: 0.95 }),
    palm: new THREE.MeshStandardMaterial({ color: 0x1e4a38, roughness: 0.9, side: THREE.DoubleSide }),
    mast: new THREE.MeshStandardMaterial({ color: 0x707a88, roughness: 0.5, metalness: 0.7 }),
    lampHead: new THREE.MeshBasicMaterial({ color: 0xc9e6ff, toneMapped: false }),
    standBase: new THREE.MeshStandardMaterial({ color: 0x242833, roughness: 0.85, metalness: 0.1 }),
    standSeats: new THREE.MeshStandardMaterial({ color: 0x3b4a63, roughness: 0.7, metalness: 0.2 }),
    billboard: new THREE.MeshBasicMaterial({
      map: label('REDLINE', 'PURE ADRENALINE', '#10131d', '#ff2f6d'),
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  };
  return cache;
}

/** Countdown lamp state, toggled by the race director. */
export function setStartLights(mesh: THREE.InstancedMesh, active: number, go: boolean): void {
  const red = new THREE.Color(0xff2b3c);
  const amber = new THREE.Color(0xffc23a);
  const green = new THREE.Color(0x39ff8b);
  const off = new THREE.Color(0x2b3442);
  const color = new THREE.Color();
  for (let i = 0; i < 5; i += 1) {
    if (go) color.copy(green);
    else if (i < active) color.copy(i === 4 ? amber : red);
    else color.copy(off);
    mesh.setColorAt(i, color);
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}
