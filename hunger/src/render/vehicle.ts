import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LatheGeometry,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MathUtils,
  Object3D,
  PlaneGeometry,
  Quaternion,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Uint16BufferAttribute,
  Vector2,
  Vector3,
} from 'three';
import type { ColorRepresentation, Material } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createCarPaintMaterial } from './materials';

export interface VehicleVisual {
  root: import('three').Group;
  update(deltaTime: number, speed: number, steer: number, throttle: number, handbrake: boolean, braking: boolean): void;
  setPaint(color: import('three').ColorRepresentation): void;
  dispose(): void;
}

interface LoftStation {
  z: number;
  ring: Array<[number, number]>;
}

const WHEEL_RADIUS = 0.355;
const FRONT_AXLE = 1.36;
const REAR_AXLE = -1.39;
const UP = new Vector3(0, 1, 0);
const AXLE_X = new Vector3(1, 0, 0);

function loftGeometry(stations: LoftStation[]): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const ringSize = stations[0].ring.length;

  stations.forEach((station, stationIndex) => {
    station.ring.forEach(([x, y], ringIndex) => {
      positions.push(x, y, station.z);
      uvs.push(ringIndex / ringSize, stationIndex / (stations.length - 1));
    });
  });

  for (let stationIndex = 0; stationIndex < stations.length - 1; stationIndex += 1) {
    for (let ringIndex = 0; ringIndex < ringSize; ringIndex += 1) {
      const nextRing = (ringIndex + 1) % ringSize;
      const a = stationIndex * ringSize + ringIndex;
      const b = (stationIndex + 1) * ringSize + ringIndex;
      const c = stationIndex * ringSize + nextRing;
      const d = (stationIndex + 1) * ringSize + nextRing;
      indices.push(a, b, c, b, d, c);
    }
  }

  const frontCenter = positions.length / 3;
  positions.push(0, 0.5, stations[stations.length - 1].z);
  uvs.push(0.5, 1);
  const rearCenter = positions.length / 3;
  positions.push(0, 0.5, stations[0].z);
  uvs.push(0.5, 0);
  for (let ringIndex = 0; ringIndex < ringSize; ringIndex += 1) {
    const nextRing = (ringIndex + 1) % ringSize;
    indices.push(frontCenter, nextRing, ringIndex);
    indices.push(rearCenter, ringIndex, nextRing);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(new Uint16BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function quadGeometry(a: Vector3, b: Vector3, c: Vector3, d: Vector3): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([
    a.x, a.y, a.z,
    b.x, b.y, b.z,
    c.x, c.y, c.z,
    d.x, d.y, d.z,
  ], 3));
  geometry.setAttribute('uv', new Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.computeVertexNormals();
  return geometry;
}

function canopyPatchGeometry(
  stations: Array<{ z: number; width: number; base: number; height: number }>,
  startT: number,
  endT: number,
  lift: number,
): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const across = 8;
  for (let stationIndex = 0; stationIndex < stations.length; stationIndex += 1) {
    const station = stations[stationIndex];
    for (let column = 0; column <= across; column += 1) {
      const t = MathUtils.lerp(startT, endT, column / across);
      const x = station.width * (t * 2 - 1);
      const y = station.base + station.height * Math.pow(Math.sin(Math.PI * t), 0.72) + lift;
      positions.push(x, y, station.z);
      uvs.push(column / across, stationIndex / (stations.length - 1));
    }
  }
  const row = across + 1;
  for (let stationIndex = 0; stationIndex < stations.length - 1; stationIndex += 1) {
    for (let column = 0; column < across; column += 1) {
      const a = stationIndex * row + column;
      const b = (stationIndex + 1) * row + column;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function rodBetween(
  start: Vector3,
  end: Vector3,
  radius: number,
  material: MeshStandardMaterial,
  geometry: CylinderGeometry,
): Mesh {
  const direction = end.clone().sub(start);
  const mesh = new Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(radius, direction.length(), radius);
  mesh.quaternion.setFromUnitVectors(UP, direction.normalize());
  mesh.castShadow = true;
  return mesh;
}

function mergeStaticMeshes(root: Group, dynamicRoots: Object3D[]): void {
  const dynamic = new Set<Object3D>(dynamicRoots);
  const isDynamic = (object: Object3D): boolean => {
    let current: Object3D | null = object;
    while (current && current !== root) {
      if (dynamic.has(current)) return true;
      current = current.parent;
    }
    return false;
  };
  root.updateMatrixWorld(true);
  const inverseRoot = root.matrixWorld.clone().invert();
  const buckets = new Map<Material, Mesh[]>();
  root.traverse((object) => {
    if (!(object instanceof Mesh) || object instanceof InstancedMesh || isDynamic(object)) return;
    if (Array.isArray(object.material)) return;
    const bucket = buckets.get(object.material);
    if (bucket) bucket.push(object);
    else buckets.set(object.material, [object]);
  });

  const removedGeometries = new Set<BufferGeometry>();
  buckets.forEach((meshes, material) => {
    if (meshes.length < 2) return;
    const transformed = meshes.map((mesh) => {
      removedGeometries.add(mesh.geometry);
      const relativeMatrix = new Matrix4().multiplyMatrices(inverseRoot, mesh.matrixWorld);
      return mesh.geometry.clone().applyMatrix4(relativeMatrix);
    });
    const mergedGeometry = mergeGeometries(transformed, false);
    transformed.forEach((geometry) => geometry.dispose());
    if (!mergedGeometry) return;
    mergedGeometry.computeBoundingSphere();
    const merged = new Mesh(mergedGeometry, material);
    merged.name = `Merged_${material.name || material.type}`;
    merged.castShadow = meshes.some((mesh) => mesh.castShadow);
    merged.receiveShadow = meshes.some((mesh) => mesh.receiveShadow);
    meshes.forEach((mesh) => mesh.removeFromParent());
    root.add(merged);
  });

  const remainingGeometries = new Set<BufferGeometry>();
  root.traverse((object) => {
    const renderable = object as Mesh;
    if (renderable.geometry) remainingGeometries.add(renderable.geometry);
  });
  removedGeometries.forEach((geometry) => {
    if (!remainingGeometries.has(geometry)) geometry.dispose();
  });
}

function makeContactShadow(): { texture: CanvasTexture; material: MeshBasicMaterial; geometry: PlaneGeometry } {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 62);
    gradient.addColorStop(0, 'rgba(0,0,0,0.72)');
    gradient.addColorStop(0.52, 'rgba(0,0,0,0.38)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.68,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  const geometry = new PlaneGeometry(2.75, 5.25);
  return { texture, material, geometry };
}

export function createVehicle(color: ColorRepresentation, isPlayer = false): VehicleVisual {
  const root = new Group();
  root.name = isPlayer ? 'Player supercar' : 'Rival supercar';

  const paint = createCarPaintMaterial(color, 'metallic');
  const carbon = new MeshStandardMaterial({ color: 0x11151a, metalness: 0.62, roughness: 0.34 });
  const carbonSoft = new MeshStandardMaterial({ color: 0x20252a, metalness: 0.35, roughness: 0.52 });
  const tireMaterial = new MeshStandardMaterial({ color: 0x090a0b, metalness: 0.02, roughness: 0.88 });
  const rimMaterial = new MeshStandardMaterial({ color: 0x353b40, metalness: 0.94, roughness: 0.22 });
  const rimEdgeMaterial = new MeshStandardMaterial({ color: 0x9ba3a8, metalness: 1, roughness: 0.18 });
  const discMaterial = new MeshStandardMaterial({ color: 0x62696d, metalness: 0.9, roughness: 0.42 });
  const caliperMaterial = new MeshStandardMaterial({ color: 0xd8ff3e, metalness: 0.42, roughness: 0.3 });
  const glass = new MeshPhysicalMaterial({
    color: 0x15232d,
    metalness: 0.12,
    roughness: 0.12,
    transmission: 0.18,
    transparent: true,
    opacity: 0.82,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    side: DoubleSide,
    depthWrite: false,
  });
  const mirrorGlass = new MeshStandardMaterial({ color: 0xb9d2dc, metalness: 1, roughness: 0.08 });
  const headlightMaterial = new MeshStandardMaterial({
    color: 0xe9f5ff,
    emissive: 0xc6e8ff,
    emissiveIntensity: 3.2,
    roughness: 0.2,
    metalness: 0.1,
  });
  const tailMaterial = new MeshStandardMaterial({
    color: 0x8d0710,
    emissive: 0xff1025,
    emissiveIntensity: 1.7,
    roughness: 0.25,
    metalness: 0.15,
  });
  const exhaustMaterial = new MeshStandardMaterial({
    color: 0x5d2a16,
    emissive: 0xff5a18,
    emissiveIntensity: 0.15,
    roughness: 0.4,
    metalness: 0.75,
  });
  const seamMaterial = new LineBasicMaterial({ color: 0x111619, transparent: true, opacity: 0.8 });

  const bodyStations: LoftStation[] = [
    { z: 2.31, ring: [[-0.43, 0.25], [-0.7, 0.27], [-0.72, 0.39], [-0.61, 0.48], [-0.34, 0.51], [0.34, 0.51], [0.61, 0.48], [0.72, 0.39], [0.7, 0.27], [0.43, 0.25]] },
    { z: 2.12, ring: [[-0.53, 0.18], [-0.9, 0.2], [-0.91, 0.47], [-0.78, 0.59], [-0.43, 0.62], [0.43, 0.62], [0.78, 0.59], [0.91, 0.47], [0.9, 0.2], [0.53, 0.18]] },
    { z: 1.76, ring: [[-0.58, 0.17], [-0.96, 0.25], [-0.98, 0.57], [-0.82, 0.68], [-0.44, 0.69], [0.44, 0.69], [0.82, 0.68], [0.98, 0.57], [0.96, 0.25], [0.58, 0.17]] },
    { z: 1.36, ring: [[-0.6, 0.17], [-0.99, 0.75], [-1.0, 0.7], [-0.86, 0.77], [-0.45, 0.72], [0.45, 0.72], [0.86, 0.77], [1.0, 0.7], [0.99, 0.75], [0.6, 0.17]] },
    { z: 0.94, ring: [[-0.6, 0.17], [-0.97, 0.25], [-0.98, 0.67], [-0.84, 0.75], [-0.45, 0.72], [0.45, 0.72], [0.84, 0.75], [0.98, 0.67], [0.97, 0.25], [0.6, 0.17]] },
    { z: 0.42, ring: [[-0.6, 0.17], [-0.95, 0.2], [-0.97, 0.69], [-0.83, 0.77], [-0.44, 0.74], [0.44, 0.74], [0.83, 0.77], [0.97, 0.69], [0.95, 0.2], [0.6, 0.17]] },
    { z: -0.2, ring: [[-0.6, 0.18], [-0.96, 0.21], [-0.98, 0.73], [-0.84, 0.82], [-0.44, 0.77], [0.44, 0.77], [0.84, 0.82], [0.98, 0.73], [0.96, 0.21], [0.6, 0.18]] },
    { z: -0.82, ring: [[-0.6, 0.19], [-0.99, 0.24], [-1.01, 0.83], [-0.87, 0.9], [-0.45, 0.8], [0.45, 0.8], [0.87, 0.9], [1.01, 0.83], [0.99, 0.24], [0.6, 0.19]] },
    { z: -1.39, ring: [[-0.6, 0.2], [-1.01, 0.76], [-1.03, 0.86], [-0.89, 0.94], [-0.45, 0.82], [0.45, 0.82], [0.89, 0.94], [1.03, 0.86], [1.01, 0.76], [0.6, 0.2]] },
    { z: -1.83, ring: [[-0.58, 0.23], [-0.99, 0.3], [-1.0, 0.77], [-0.86, 0.84], [-0.44, 0.78], [0.44, 0.78], [0.86, 0.84], [1.0, 0.77], [0.99, 0.3], [0.58, 0.23]] },
    { z: -2.23, ring: [[-0.5, 0.29], [-0.88, 0.33], [-0.9, 0.62], [-0.75, 0.7], [-0.4, 0.68], [0.4, 0.68], [0.75, 0.7], [0.9, 0.62], [0.88, 0.33], [0.5, 0.29]] },
    { z: -2.32, ring: [[-0.42, 0.34], [-0.74, 0.37], [-0.76, 0.54], [-0.63, 0.61], [-0.34, 0.61], [0.34, 0.61], [0.63, 0.61], [0.76, 0.54], [0.74, 0.37], [0.42, 0.34]] },
  ];
  const body = new Mesh(loftGeometry(bodyStations), paint);
  body.castShadow = true;
  body.receiveShadow = true;
  root.add(body);

  const canopyStations = [
    { z: 0.96, width: 0.73, base: 0.7, height: 0.04 },
    { z: 0.58, width: 0.71, base: 0.71, height: 0.34 },
    { z: 0.08, width: 0.6, base: 0.72, height: 0.57 },
    { z: -0.48, width: 0.59, base: 0.74, height: 0.56 },
    { z: -0.96, width: 0.66, base: 0.76, height: 0.39 },
    { z: -1.34, width: 0.73, base: 0.77, height: 0.06 },
  ];
  const canopy = new Mesh(loftGeometry(canopyStations.map((station) => {
    const ring: Array<[number, number]> = [];
    for (let index = 0; index <= 10; index += 1) {
      const t = index / 10;
      ring.push([
        station.width * (t * 2 - 1),
        station.base + station.height * Math.pow(Math.sin(Math.PI * t), 0.72),
      ]);
    }
    ring.push([station.width * 0.86, station.base - 0.035]);
    ring.push([-station.width * 0.86, station.base - 0.035]);
    return { z: station.z, ring };
  })), glass);
  canopy.renderOrder = 2;
  root.add(canopy);

  const roofPatchStations = [
    { z: 0.3, width: 0.605, base: 0.722, height: 0.566 },
    { z: -0.12, width: 0.592, base: 0.728, height: 0.568 },
    { z: -0.55, width: 0.595, base: 0.742, height: 0.553 },
    { z: -0.78, width: 0.625, base: 0.752, height: 0.492 },
  ];
  const roofPatch = new Mesh(canopyPatchGeometry(roofPatchStations, 0.24, 0.76, 0.014), carbon);
  roofPatch.castShadow = true;
  root.add(roofPatch);

  const unitBox = new BoxGeometry(1, 1, 1);
  const unitCylinder = new CylinderGeometry(1, 1, 1, 10);
  const archGeometry = new TorusGeometry(0.435, 0.032, 7, 28, Math.PI);
  archGeometry.rotateY(Math.PI / 2);
  const projectorGeometry = new CircleGeometry(0.047, 16);
  const mirrorHousingGeometry = new SphereGeometry(1, 12, 8);
  const addBox = (
    size: [number, number, number],
    position: [number, number, number],
    material: MeshStandardMaterial | MeshPhysicalMaterial | MeshBasicMaterial,
    parent: Object3D = root,
  ): Mesh => {
    const mesh = new Mesh(unitBox, material);
    mesh.scale.set(...size);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  addBox([1.9, 0.055, 0.46], [0, 0.145, 2.15], carbon);
  addBox([1.66, 0.07, 0.34], [0, 0.13, 2.31], carbon);
  addBox([1.24, 0.19, 0.045], [0, 0.345, 2.315], carbonSoft);
  addBox([0.5, 0.11, 0.05], [-0.39, 0.345, 2.343], carbon);
  addBox([0.5, 0.11, 0.05], [0.39, 0.345, 2.343], carbon);

  for (const side of [-1, 1]) {
    const canard = addBox([0.26, 0.035, 0.34], [side * 0.91, 0.235, 2.12], carbon);
    canard.rotation.y = side * 0.16;
    addBox([0.12, 0.085, 2.42], [side * 0.945, 0.205, -0.02], carbon);
    addBox([0.36, 0.028, 0.62], [side * 0.34, 0.672, 1.43], carbonSoft).rotation.x = 0.085;
    for (let index = 0; index < 4; index += 1) {
      addBox([0.29, 0.018, 0.025], [side * 0.34, 0.692 - index * 0.012, 1.2 + index * 0.13], carbon).rotation.x = 0.085;
    }

    const outerTop = new Vector3(side * 0.79, 0.595, 2.075);
    const innerTop = new Vector3(side * 0.29, 0.635, 2.15);
    const outerBottom = new Vector3(side * 0.77, 0.505, 2.205);
    const innerBottom = new Vector3(side * 0.3, 0.525, 2.255);
    const housing = new Mesh(quadGeometry(outerTop, innerTop, innerBottom, outerBottom), carbon);
    root.add(housing);
    const ledCurve = new CatmullRomCurve3([
      new Vector3(side * 0.74, 0.568, 2.13),
      new Vector3(side * 0.57, 0.583, 2.17),
      new Vector3(side * 0.36, 0.598, 2.2),
    ]);
    const led = new Mesh(new TubeGeometry(ledCurve, 10, 0.014, 5, false), headlightMaterial);
    root.add(led);
    for (let index = 0; index < 2; index += 1) {
      const projector = new Mesh(projectorGeometry, headlightMaterial);
      projector.position.set(side * (0.43 + index * 0.14), 0.555 - index * 0.008, 2.225 - index * 0.022);
      root.add(projector);
    }

    const intakeOuter = new Vector3(side * 1.005, 0.79, -0.36);
    const intakeInner = new Vector3(side * 0.985, 0.71, -0.78);
    const intakeLowerInner = new Vector3(side * 0.985, 0.34, -0.94);
    const intakeLowerOuter = new Vector3(side * 1.01, 0.4, -0.45);
    const intake = new Mesh(quadGeometry(intakeOuter, intakeInner, intakeLowerInner, intakeLowerOuter), carbon);
    intake.material.side = DoubleSide;
    root.add(intake);
    for (let index = 0; index < 3; index += 1) {
      addBox([0.028, 0.026, 0.48], [side * 1.02, 0.45 + index * 0.09, -0.68], carbonSoft).rotation.x = -0.12;
    }

    const mirrorStalk = rodBetween(
      new Vector3(side * 0.78, 0.78, 0.55),
      new Vector3(side * 1.04, 0.86, 0.5),
      0.022,
      carbon,
      unitCylinder,
    );
    root.add(mirrorStalk);
    const mirrorHousing = new Mesh(mirrorHousingGeometry, carbon);
    mirrorHousing.scale.set(0.17, 0.075, 0.115);
    mirrorHousing.position.set(side * 1.07, 0.865, 0.49);
    mirrorHousing.castShadow = true;
    root.add(mirrorHousing);
    addBox([0.13, 0.055, 0.012], [side * 1.07, 0.865, 0.385], mirrorGlass);

    const seamPoints = [
      new Vector3(side * 0.972, 0.73, 0.61),
      new Vector3(side * 0.995, 0.62, 0.35),
      new Vector3(side * 0.995, 0.31, -0.48),
      new Vector3(side * 0.985, 0.28, -0.83),
    ];
    root.add(new Line(new BufferGeometry().setFromPoints(seamPoints), seamMaterial));
    addBox([0.035, 0.028, 0.18], [side * 0.995, 0.7, -0.12], carbonSoft);

    for (const axle of [FRONT_AXLE, REAR_AXLE]) {
      const arch = new Mesh(archGeometry, paint);
      arch.position.set(side * 0.995, WHEEL_RADIUS, axle);
      arch.castShadow = true;
      root.add(arch);
    }
  }

  addBox([1.57, 0.3, 0.052], [0, 0.535, -2.315], carbon);
  addBox([1.74, 0.09, 0.48], [0, 0.225, -2.14], carbon);
  for (let index = -3; index <= 3; index += 1) {
    addBox([0.035, 0.18, 0.43], [index * 0.22, 0.17, -2.17], carbonSoft);
  }
  const exhaustGeometry = new CylinderGeometry(0.082, 0.092, 0.19, 16, 1, true);
  const exhaustGlowGeometry = new CircleGeometry(0.071, 16);
  for (const side of [-1, 1]) {
    addBox([0.67, 0.038, 0.032], [side * 0.43, 0.625, -2.349], tailMaterial);
    addBox([0.14, 0.04, 0.035], [side * 0.76, 0.61, -2.34], tailMaterial);
    const exhaust = new Mesh(exhaustGeometry, rimEdgeMaterial);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(side * 0.29, 0.335, -2.36);
    root.add(exhaust);
    const exhaustGlow = new Mesh(exhaustGlowGeometry, exhaustMaterial);
    exhaustGlow.position.set(side * 0.29, 0.335, -2.458);
    exhaustGlow.rotation.y = Math.PI;
    root.add(exhaustGlow);
  }

  const spoiler = new Group();
  spoiler.position.set(0, 1.015, -1.94);
  spoiler.rotation.x = 0.11;
  root.add(spoiler);
  for (const side of [-1, 1]) {
    root.add(rodBetween(
      new Vector3(side * 0.57, 0.76, -1.91),
      new Vector3(side * 0.57, 1.08, -1.94),
      0.032,
      carbon,
      unitCylinder,
    ));
    addBox([0.045, 0.19, 0.42], [side * 0.86, 0.07, 0], carbon, spoiler);
  }
  const wing = addBox([1.76, 0.055, 0.39], [0, 0.075, 0], carbon, spoiler);
  wing.rotation.x = -0.035;
  addBox([1.58, 0.018, 0.055], [0, 0.11, 0.13], carbonSoft, spoiler);

  const tireProfile = [
    new Vector2(0.225, -0.145),
    new Vector2(0.292, -0.145),
    new Vector2(0.335, -0.125),
    new Vector2(0.352, -0.085),
    new Vector2(0.355, 0),
    new Vector2(0.352, 0.085),
    new Vector2(0.335, 0.125),
    new Vector2(0.292, 0.145),
    new Vector2(0.225, 0.145),
  ];
  const tireGeometry = new LatheGeometry(tireProfile, 32);
  tireGeometry.rotateZ(Math.PI / 2);
  const rimGeometry = new CylinderGeometry(0.242, 0.242, 0.19, 24, 1, true);
  rimGeometry.rotateZ(Math.PI / 2);
  const rimLipGeometry = new TorusGeometry(0.235, 0.012, 6, 28);
  rimLipGeometry.rotateY(Math.PI / 2);
  const discGeometry = new CylinderGeometry(0.198, 0.198, 0.022, 28);
  discGeometry.rotateZ(Math.PI / 2);
  const hubGeometry = new CylinderGeometry(0.062, 0.062, 0.215, 16);
  hubGeometry.rotateZ(Math.PI / 2);
  const spokeGeometry = new BoxGeometry(0.034, 0.205, 0.042);
  const caliperGeometry = new BoxGeometry(0.075, 0.17, 0.09);
  const wheelSpins: Group[] = [];
  const wheelPivots: Group[] = [];
  const frontSteers: Group[] = [];
  const temporaryMatrix = new Matrix4();
  const temporaryQuaternion = new Quaternion();
  const temporaryPosition = new Vector3();
  const temporaryScale = new Vector3(1, 1, 1);

  for (const side of [-1, 1]) {
    for (const axle of [FRONT_AXLE, REAR_AXLE]) {
      const steerPivot = new Group();
      steerPivot.position.set(side * 0.93, WHEEL_RADIUS, axle);
      root.add(steerPivot);
      wheelPivots.push(steerPivot);
      const spin = new Group();
      steerPivot.add(spin);
      wheelSpins.push(spin);
      if (axle === FRONT_AXLE) frontSteers.push(steerPivot);

      const tire = new Mesh(tireGeometry, tireMaterial);
      tire.castShadow = true;
      tire.receiveShadow = true;
      spin.add(tire);
      const barrel = new Mesh(rimGeometry, rimMaterial);
      spin.add(barrel);
      const lip = new Mesh(rimLipGeometry, rimEdgeMaterial);
      lip.position.x = side * 0.145;
      spin.add(lip);
      const disc = new Mesh(discGeometry, discMaterial);
      disc.position.x = side * 0.076;
      spin.add(disc);
      const hub = new Mesh(hubGeometry, rimEdgeMaterial);
      spin.add(hub);

      const spokes = new InstancedMesh(spokeGeometry, rimMaterial, 10);
      for (let index = 0; index < 10; index += 1) {
        const angle = (index / 10) * Math.PI * 2;
        temporaryPosition.set(side * 0.153, Math.cos(angle) * 0.115, Math.sin(angle) * 0.115);
        temporaryQuaternion.setFromAxisAngle(AXLE_X, angle);
        temporaryMatrix.compose(temporaryPosition, temporaryQuaternion, temporaryScale);
        spokes.setMatrixAt(index, temporaryMatrix);
      }
      spokes.instanceMatrix.needsUpdate = true;
      spokes.castShadow = true;
      spin.add(spokes);

      const caliper = new Mesh(caliperGeometry, caliperMaterial);
      caliper.position.set(side * 0.092, 0.025, 0.155);
      caliper.rotation.x = -0.18;
      caliper.castShadow = true;
      steerPivot.add(caliper);
    }
  }

  const shadow = makeContactShadow();
  const contactShadow = new Mesh(shadow.geometry, shadow.material);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.009;
  contactShadow.renderOrder = 1;
  root.add(contactShadow);
  mergeStaticMeshes(root, [spoiler, ...wheelPivots]);

  let currentSpoilerAngle = spoiler.rotation.x;
  let currentBrakeIntensity = tailMaterial.emissiveIntensity;
  let currentExhaustIntensity = exhaustMaterial.emissiveIntensity;
  let disposed = false;

  return {
    root,
    update(deltaTime, speed, steer, throttle, handbrake, braking) {
      if (disposed) return;
      const safeDelta = Math.max(0, deltaTime);
      const roll = (speed * safeDelta) / WHEEL_RADIUS;
      for (const spin of wheelSpins) spin.rotation.x += roll;
      const steeringAngle = MathUtils.clamp(steer, -1, 1) * 0.43;
      for (const pivot of frontSteers) {
        pivot.rotation.y = MathUtils.damp(pivot.rotation.y, steeringAngle, 12, safeDelta);
      }
      const wingTarget = handbrake ? 0.24 : throttle > 0.72 && speed > 24 ? -0.035 : 0.1;
      currentSpoilerAngle = MathUtils.damp(currentSpoilerAngle, wingTarget, 4.5, safeDelta);
      spoiler.rotation.x = currentSpoilerAngle;
      const brakeTarget = braking ? (isPlayer ? 7.5 : 5.2) : 1.7;
      currentBrakeIntensity = MathUtils.damp(currentBrakeIntensity, brakeTarget, 14, safeDelta);
      tailMaterial.emissiveIntensity = currentBrakeIntensity;
      tailMaterial.color.setRGB(0.56 + currentBrakeIntensity * 0.035, 0.018, 0.035);
      const exhaustTarget = 0.12 + Math.max(0, throttle) * (handbrake ? 2.8 : 1.25);
      currentExhaustIntensity = MathUtils.damp(currentExhaustIntensity, exhaustTarget, 7, safeDelta);
      exhaustMaterial.emissiveIntensity = currentExhaustIntensity;
    },
    setPaint(nextColor) {
      if (!disposed) paint.color.set(nextColor);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      const geometries = new Set<BufferGeometry>();
      const materials = new Set<Material>();
      root.traverse((object) => {
        if (object instanceof InstancedMesh) object.dispose();
        const renderable = object as Mesh;
        if (renderable.geometry) geometries.add(renderable.geometry);
        if (renderable.material) {
          const objectMaterials = Array.isArray(renderable.material) ? renderable.material : [renderable.material];
          objectMaterials.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      shadow.texture.dispose();
      root.removeFromParent();
      root.clear();
    },
  };
}
