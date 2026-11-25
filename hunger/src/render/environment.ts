import {
  BoxGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  FogExp2,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Light,
  MathUtils,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Quaternion,
  Scene,
  Vector3,
} from 'three';
import type { BufferGeometry, Material, WebGLRenderer } from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import type { Track } from '../core/Track';
import { createBuildingMaterial, createGrassMaterial } from './materials';

export interface EnvironmentVisual {
  root: import('three').Group;
  update(deltaTime: number, cameraTarget: import('three').Vector3): void;
  setWetness(value: number): void;
  dispose(): void;
}

interface TrackFrame {
  position: Vector3;
  quaternion: Quaternion;
  matrix: Matrix4;
}

const GROUND_Y = -0.16;
const WORLD_UP = new Vector3(0, 1, 0);
const PUDDLE_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function frameAt(track: Track, distance: number): TrackFrame {
  const sample = track.sampleAt(distance);
  const up = new Vector3().crossVectors(sample.tangent, sample.right).normalize();
  const matrix = new Matrix4().makeBasis(sample.right, up, sample.tangent);
  matrix.setPosition(sample.position);
  return {
    position: sample.position.clone(),
    quaternion: new Quaternion().setFromRotationMatrix(matrix),
    matrix,
  };
}

export function createEnvironment(renderer: WebGLRenderer, track: Track): EnvironmentVisual {
  const root = new Group();
  root.name = 'HUNGER_Environment';
  const random = seededRandom(0x48a9c31);
  const unitBox = new BoxGeometry(1, 1, 1);
  const unitCylinder = new CylinderGeometry(1, 1, 1, 8);
  const localMatrix = new Matrix4();
  const worldMatrix = new Matrix4();
  const localPosition = new Vector3();
  const localScale = new Vector3();
  const localQuaternion = new Quaternion();

  const placeLocal = (
    mesh: InstancedMesh,
    index: number,
    frame: TrackFrame,
    x: number,
    y: number,
    z: number,
    scaleX: number,
    scaleY: number,
    scaleZ: number,
    yaw = 0,
  ): void => {
    localPosition.set(x, y, z);
    localScale.set(scaleX, scaleY, scaleZ);
    localQuaternion.setFromAxisAngle(WORLD_UP, yaw);
    localMatrix.compose(localPosition, localQuaternion, localScale);
    worldMatrix.multiplyMatrices(frame.matrix, localMatrix);
    mesh.setMatrixAt(index, worldMatrix);
  };

  const placeWorld = (
    mesh: InstancedMesh,
    index: number,
    position: Vector3,
    quaternion: Quaternion,
    scale: Vector3,
  ): void => {
    worldMatrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, worldMatrix);
  };

  const sunDirection = new Vector3(-0.91, 0.24, 0.33).normalize();
  const sky = new Sky();
  sky.name = 'HUNGER_SunsetSky';
  sky.scale.setScalar(450000);
  sky.frustumCulled = false;
  sky.renderOrder = -1000;
  sky.material.uniforms.turbidity.value = 6.8;
  sky.material.uniforms.rayleigh.value = 1.85;
  sky.material.uniforms.mieCoefficient.value = 0.004;
  sky.material.uniforms.mieDirectionalG.value = 0.82;
  sky.material.uniforms.sunPosition.value.copy(sunDirection).multiplyScalar(1000);
  sky.material.depthWrite = false;
  sky.material.fog = false;

  const environmentScene = new Scene();
  environmentScene.add(sky);
  const pmrem = new PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environmentScene, 0.035, 0.1, 2000);
  environmentTarget.texture.name = 'HUNGER_PMREM_Sunset';
  environmentScene.remove(sky);
  pmrem.dispose();
  root.add(sky);

  const fog = new FogExp2(0x6f7280, 0.00115);
  fog.name = 'HUNGER_SunsetFog';
  const dryFogColor = fog.color.clone();
  const wetFogColor = new Color(0x555c66);
  let attachedScene: Scene | null = null;
  sky.onBeforeRender = (_renderer, scene) => {
    attachedScene = scene;
    if (scene.environment !== environmentTarget.texture) scene.environment = environmentTarget.texture;
    if (scene.fog !== fog) scene.fog = fog;
    scene.environmentIntensity = 0.62;
  };
  root.userData.environment = environmentTarget.texture;
  root.userData.environmentMap = environmentTarget.texture;
  root.userData.fog = fog;

  const sunOffset = sunDirection.clone().multiplyScalar(185);
  const initialTarget = track.sampleAt(track.startDistance).position;
  const sun = new DirectionalLight(0xffc28d, 2.7);
  sun.name = 'HUNGER_Sun';
  sun.position.copy(initialTarget).add(sunOffset);
  sun.target.position.copy(initialTarget);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -72;
  sun.shadow.camera.right = 72;
  sun.shadow.camera.top = 72;
  sun.shadow.camera.bottom = -72;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 340;
  sun.shadow.bias = -0.00018;
  sun.shadow.normalBias = 0.045;
  sun.shadow.radius = 3;
  sun.shadow.camera.updateProjectionMatrix();
  root.add(sun, sun.target);
  root.userData.sun = sun;

  const hemisphere = new HemisphereLight(0x9eb5d2, 0x34372c, 0.82);
  hemisphere.name = 'HUNGER_Hemisphere';
  root.add(hemisphere);

  const grassController = createGrassMaterial();
  const grassMaterial = grassController.material;
  grassMaterial.name = 'HUNGER_GrassMaterial';
  const dryGrassColor = grassMaterial.color.clone();
  const wetGrassColor = dryGrassColor.clone().multiplyScalar(0.63);
  const ground = new Mesh(new PlaneGeometry(2600, 2600), grassMaterial);
  ground.name = 'HUNGER_Ground';
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  ground.receiveShadow = true;
  root.add(ground);

  const buildingController = createBuildingMaterial();
  const buildingMaterial = buildingController.material;
  buildingMaterial.name = 'HUNGER_BuildingMaterial';
  const buildingCapacity = 360;
  const buildings = new InstancedMesh(unitBox, buildingMaterial, buildingCapacity);
  buildings.name = 'HUNGER_CityBuildings';
  const rooftops = new InstancedMesh(unitBox, new MeshStandardMaterial({
    color: 0x303940,
    metalness: 0.38,
    roughness: 0.62,
  }), buildingCapacity);
  rooftops.name = 'HUNGER_CityRooftops';
  const buildingPalette = [
    new Color(0x8996a3),
    new Color(0x9b9187),
    new Color(0x697b89),
    new Color(0xa4a19a),
    new Color(0x747f89),
  ];
  const probe = new Vector3();
  const buildingPosition = new Vector3();
  const buildingScale = new Vector3();
  const buildingQuaternion = new Quaternion();
  const roofPosition = new Vector3();
  const roofScale = new Vector3();
  const roofQuaternion = new Quaternion();
  let buildingCount = 0;
  let rooftopCount = 0;
  for (let z = -370; z <= 470 && buildingCount < buildingCapacity; z += 28) {
    for (let x = -390; x <= 610 && buildingCount < buildingCapacity; x += 28) {
      const px = x + (random() - 0.5) * 11;
      const pz = z + (random() - 0.5) * 11;
      probe.set(px, 0, pz);
      const nearest = track.nearest(probe, -1);
      const trackDistance = nearest.position.distanceTo(probe);
      if (trackDistance < track.roadHalfWidth + 34) continue;
      const width = 10 + random() * 13;
      const depth = 10 + random() * 13;
      const height = 9 + random() * 24 + Math.min(56, Math.max(0, trackDistance - 70) * 0.13);
      buildingPosition.set(px, GROUND_Y + height * 0.5, pz);
      buildingQuaternion.setFromAxisAngle(WORLD_UP, Math.floor(random() * 4) * Math.PI * 0.5);
      buildingScale.set(width, height, depth);
      placeWorld(buildings, buildingCount, buildingPosition, buildingQuaternion, buildingScale);
      buildings.setColorAt(buildingCount, buildingPalette[Math.floor(random() * buildingPalette.length)]);
      buildingCount += 1;
      if (random() > 0.38) {
        roofPosition.set(px, GROUND_Y + height + 1.25, pz);
        roofScale.set(width * (0.3 + random() * 0.25), 2.5, depth * (0.3 + random() * 0.25));
        placeWorld(rooftops, rooftopCount++, roofPosition, roofQuaternion, roofScale);
      }
    }
  }
  buildings.count = buildingCount;
  rooftops.count = rooftopCount;
  buildings.instanceMatrix.needsUpdate = true;
  rooftops.instanceMatrix.needsUpdate = true;
  if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
  buildings.castShadow = true;
  buildings.receiveShadow = true;
  rooftops.castShadow = true;
  root.add(buildings, rooftops);

  const mountainMaterial = new MeshStandardMaterial({
    color: 0x48515c,
    roughness: 1,
    flatShading: true,
  });
  const farMountainMaterial = new MeshStandardMaterial({
    color: 0x606777,
    roughness: 1,
    flatShading: true,
  });
  const mountainGeometry = new ConeGeometry(1, 1, 6, 1);
  const mountains = new InstancedMesh(mountainGeometry, mountainMaterial, 34);
  const farMountains = new InstancedMesh(mountainGeometry, farMountainMaterial, 30);
  mountains.name = 'HUNGER_Mountains';
  farMountains.name = 'HUNGER_DistantMountains';
  const mountainPosition = new Vector3();
  const mountainScale = new Vector3();
  const mountainQuaternion = new Quaternion();
  for (let index = 0; index < 34; index += 1) {
    const angle = (index / 34) * Math.PI * 2 + random() * 0.08;
    const radius = 850 + random() * 180;
    const height = 95 + random() * 165;
    mountainPosition.set(105 + Math.cos(angle) * radius, GROUND_Y + height * 0.5 - 8, 72 + Math.sin(angle) * radius);
    mountainQuaternion.setFromAxisAngle(WORLD_UP, random() * Math.PI);
    mountainScale.set(95 + random() * 100, height, 75 + random() * 90);
    placeWorld(mountains, index, mountainPosition, mountainQuaternion, mountainScale);
  }
  for (let index = 0; index < 30; index += 1) {
    const angle = (index / 30) * Math.PI * 2 + 0.08 + random() * 0.07;
    const radius = 1130 + random() * 190;
    const height = 140 + random() * 210;
    mountainPosition.set(105 + Math.cos(angle) * radius, GROUND_Y + height * 0.5 - 12, 72 + Math.sin(angle) * radius);
    mountainQuaternion.setFromAxisAngle(WORLD_UP, random() * Math.PI);
    mountainScale.set(140 + random() * 130, height, 100 + random() * 120);
    placeWorld(farMountains, index, mountainPosition, mountainQuaternion, mountainScale);
  }
  mountains.instanceMatrix.needsUpdate = true;
  farMountains.instanceMatrix.needsUpdate = true;
  root.add(mountains, farMountains);

  const treeCapacity = 190;
  const trunks = new InstancedMesh(unitCylinder, new MeshStandardMaterial({
    color: 0x493b2e,
    roughness: 1,
  }), treeCapacity);
  const crowns = new InstancedMesh(new IcosahedronGeometry(1, 1), new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.96,
    flatShading: true,
  }), treeCapacity * 2);
  trunks.name = 'HUNGER_TreeTrunks';
  crowns.name = 'HUNGER_TreeCrowns';
  const treePalette = [new Color(0x314c35), new Color(0x3e5a38), new Color(0x4a603b), new Color(0x2d4636)];
  const treePosition = new Vector3();
  const treeScale = new Vector3();
  const treeQuaternion = new Quaternion();
  let treeCount = 0;
  let attempts = 0;
  while (treeCount < treeCapacity && attempts < 1800) {
    attempts += 1;
    const x = -290 + random() * 800;
    const z = -270 + random() * 690;
    probe.set(x, 0, z);
    const nearest = track.nearest(probe, -1);
    const distance = nearest.position.distanceTo(probe);
    if (distance < track.roadHalfWidth + 21 || distance > 330) continue;
    const height = 3.8 + random() * 3.8;
    treePosition.set(x, GROUND_Y + height * 0.5, z);
    treeQuaternion.identity();
    treeScale.set(0.16 + random() * 0.1, height, 0.16 + random() * 0.1);
    placeWorld(trunks, treeCount, treePosition, treeQuaternion, treeScale);
    const crownSize = 1.9 + random() * 1.45;
    treePosition.set(x, GROUND_Y + height + crownSize * 0.62, z);
    treeQuaternion.setFromAxisAngle(WORLD_UP, random() * Math.PI * 2);
    treeScale.set(crownSize, crownSize * (1.05 + random() * 0.35), crownSize);
    placeWorld(crowns, treeCount * 2, treePosition, treeQuaternion, treeScale);
    crowns.setColorAt(treeCount * 2, treePalette[Math.floor(random() * treePalette.length)]);
    treePosition.x += crownSize * 0.55;
    treePosition.y += crownSize * 0.42;
    treePosition.z -= crownSize * 0.3;
    treeScale.multiplyScalar(0.68);
    placeWorld(crowns, treeCount * 2 + 1, treePosition, treeQuaternion, treeScale);
    crowns.setColorAt(treeCount * 2 + 1, treePalette[Math.floor(random() * treePalette.length)]);
    treeCount += 1;
  }
  trunks.count = treeCount;
  crowns.count = treeCount * 2;
  trunks.instanceMatrix.needsUpdate = true;
  crowns.instanceMatrix.needsUpdate = true;
  if (crowns.instanceColor) crowns.instanceColor.needsUpdate = true;
  trunks.castShadow = true;
  crowns.castShadow = true;
  crowns.receiveShadow = true;
  root.add(trunks, crowns);

  const poleStride = 55;
  const poleCount = Math.max(3, Math.floor(track.totalLength / poleStride));
  const poleMaterial = new MeshStandardMaterial({ color: 0x3c464b, metalness: 0.76, roughness: 0.36 });
  const lampMaterial = new MeshStandardMaterial({
    color: 0xffe2b1,
    emissive: 0xffc47c,
    emissiveIntensity: 3.8,
    roughness: 0.25,
  });
  const poles = new InstancedMesh(unitCylinder, poleMaterial, poleCount);
  const arms = new InstancedMesh(unitBox, poleMaterial, poleCount);
  const lamps = new InstancedMesh(unitBox, lampMaterial, poleCount);
  poles.name = 'HUNGER_LightPoles';
  arms.name = 'HUNGER_LightPoleArms';
  lamps.name = 'HUNGER_TracksideLamps';
  const lampWorldPositions: Vector3[] = [];
  for (let index = 0; index < poleCount; index += 1) {
    const side = index % 2 === 0 ? 1 : -1;
    const frame = frameAt(track, track.startDistance + index * poleStride);
    const poleX = side * (track.roadHalfWidth + 4.4);
    placeLocal(poles, index, frame, poleX, GROUND_Y + 3.25, 0, 0.095, 6.5, 0.095);
    placeLocal(arms, index, frame, poleX - side * 1.02, GROUND_Y + 6.34, 0, 2.15, 0.09, 0.09);
    const lampX = poleX - side * 1.96;
    const isStartLamp = index === 0;
    placeLocal(
      lamps,
      index,
      frame,
      lampX,
      GROUND_Y + 6.24,
      0,
      isStartLamp ? 0.5 : 0.74,
      isStartLamp ? 0.08 : 0.11,
      isStartLamp ? 0.22 : 0.3,
    );
    lampWorldPositions.push(new Vector3(lampX, GROUND_Y + 6.12, 0).applyMatrix4(frame.matrix));
  }
  for (const mesh of [poles, arms, lamps]) {
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    root.add(mesh);
  }
  const pointLightIndices = [0, Math.floor(poleCount / 3), Math.floor((poleCount * 2) / 3)];
  pointLightIndices.forEach((lampIndex, index) => {
    const isStartLight = index === 0;
    const light = new PointLight(0xffbd79, isStartLight ? 8 : 46, isStartLight ? 16 : 24, 2);
    light.name = `HUNGER_TracksidePointLight_${index + 1}`;
    light.position.copy(lampWorldPositions[lampIndex % lampWorldPositions.length]);
    root.add(light);
  });

  const concreteMaterial = new MeshStandardMaterial({ color: 0x777b79, roughness: 0.88 });
  const roofMaterial = new MeshStandardMaterial({ color: 0x252f36, metalness: 0.58, roughness: 0.4 });
  const seatMaterial = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.68 });
  const structureMatrices: Matrix4[] = [];
  const standRoofMatrices: Matrix4[] = [];
  const seatMatrices: Matrix4[] = [];
  const seatColors: Color[] = [];
  const seatPalette = [new Color(0xd8ff3e), new Color(0xff6545), new Color(0x4285d0), new Color(0xe4e2d7)];
  const appendLocalMatrix = (
    target: Matrix4[],
    frame: TrackFrame,
    x: number,
    y: number,
    z: number,
    scaleX: number,
    scaleY: number,
    scaleZ: number,
  ): void => {
    localPosition.set(x, y, z);
    localScale.set(scaleX, scaleY, scaleZ);
    localQuaternion.identity();
    localMatrix.compose(localPosition, localQuaternion, localScale);
    target.push(new Matrix4().multiplyMatrices(frame.matrix, localMatrix));
  };
  const standDefinitions = [
    { distance: track.startDistance + 72, side: 1 },
    { distance: track.totalLength * 0.37, side: -1 },
    { distance: track.totalLength * 0.73, side: 1 },
  ];
  standDefinitions.forEach((definition, standIndex) => {
    const frame = frameAt(track, definition.distance);
    for (let row = 0; row < 5; row += 1) {
      const x = definition.side * (track.roadHalfWidth + 11.2 + row * 1.48);
      const top = 0.42 + row * 0.43;
      appendLocalMatrix(structureMatrices, frame, x, (GROUND_Y + top) * 0.5, 0, 1.52, top - GROUND_Y, 32);
      for (let seat = 0; seat < 27; seat += 1) {
        appendLocalMatrix(seatMatrices, frame, x, top + 0.13, -14.3 + seat * 1.1, 0.62, 0.2, 0.62);
        seatColors.push(seatPalette[(seat + row * 2 + standIndex) % seatPalette.length]);
      }
    }
    const roofX = definition.side * (track.roadHalfWidth + 14.9);
    appendLocalMatrix(standRoofMatrices, frame, roofX, 6.25, 0, 10.8, 0.2, 34.5);
    for (const xSide of [10.4, 19.2]) {
      for (const z of [-14.8, 14.8]) {
        appendLocalMatrix(structureMatrices, frame, definition.side * (track.roadHalfWidth + xSide), 3.05, z, 0.18, 6.3, 0.18);
      }
    }
    appendLocalMatrix(structureMatrices, frame, definition.side * (track.roadHalfWidth + 10.35), 1.02, 0, 0.09, 0.09, 32);
    appendLocalMatrix(structureMatrices, frame, definition.side * (track.roadHalfWidth + 19.6), 2.55, 0, 0.16, 2.1, 32);
  });
  const standStructure = new InstancedMesh(unitBox, concreteMaterial, structureMatrices.length);
  const standRoofs = new InstancedMesh(unitBox, roofMaterial, standRoofMatrices.length);
  const seats = new InstancedMesh(unitBox, seatMaterial, seatMatrices.length);
  standStructure.name = 'HUNGER_GrandstandStructure';
  standRoofs.name = 'HUNGER_GrandstandRoofs';
  seats.name = 'HUNGER_GrandstandSeats';
  structureMatrices.forEach((matrix, index) => standStructure.setMatrixAt(index, matrix));
  standRoofMatrices.forEach((matrix, index) => standRoofs.setMatrixAt(index, matrix));
  seatMatrices.forEach((matrix, index) => {
    seats.setMatrixAt(index, matrix);
    seats.setColorAt(index, seatColors[index]);
  });
  for (const mesh of [standStructure, standRoofs, seats]) {
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
  }
  if (seats.instanceColor) seats.instanceColor.needsUpdate = true;

  const puddleMaterial = new MeshPhysicalMaterial({
    color: 0x657174,
    metalness: 0.52,
    roughness: 0.055,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: DoubleSide,
    envMapIntensity: 1.5,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  const puddles = new InstancedMesh(new CircleGeometry(1, 24), puddleMaterial, 18);
  puddles.name = 'HUNGER_WetGroundPatches';
  const puddlePosition = new Vector3();
  const puddleScale = new Vector3();
  let puddleCount = 0;
  attempts = 0;
  while (puddleCount < 18 && attempts < 600) {
    attempts += 1;
    const x = -220 + random() * 620;
    const z = -210 + random() * 540;
    probe.set(x, 0, z);
    const nearest = track.nearest(probe, -1);
    if (nearest.position.distanceTo(probe) < track.roadHalfWidth + 13) continue;
    const radius = 3.5 + random() * 7.5;
    puddlePosition.set(x, GROUND_Y + 0.018, z);
    puddleScale.set(radius, radius * (0.42 + random() * 0.3), 1);
    placeWorld(puddles, puddleCount++, puddlePosition, PUDDLE_ROTATION, puddleScale);
  }
  puddles.count = puddleCount;
  puddles.instanceMatrix.needsUpdate = true;
  puddles.renderOrder = 1;
  root.add(puddles);

  let elapsed = 0;
  let wetness = 0;
  let disposed = false;
  return {
    root,
    update(deltaTime, cameraTarget) {
      if (disposed) return;
      elapsed += Math.max(0, Math.min(deltaTime, 0.05));
      sun.position.copy(cameraTarget).addScaledVector(sunOffset, 1);
      sun.target.position.copy(cameraTarget);
      sun.target.updateMatrixWorld();
      grassController.update(elapsed);
      buildingController.update(elapsed);
      lampMaterial.emissiveIntensity = 3.8 + Math.sin(elapsed * 0.73) * 0.045;
    },
    setWetness(value) {
      if (disposed) return;
      wetness = Number.isFinite(value) ? MathUtils.clamp(value, 0, 1) : 0;
      grassMaterial.color.lerpColors(dryGrassColor, wetGrassColor, wetness);
      grassMaterial.metalness = wetness * 0.08;
      buildingMaterial.roughness = MathUtils.lerp(0.78, 0.64, wetness);
      puddleMaterial.opacity = wetness * 0.3;
      puddles.visible = wetness > 0.015;
      fog.color.lerpColors(dryFogColor, wetFogColor, wetness);
      fog.density = MathUtils.lerp(0.00115, 0.00135, wetness);
      root.userData.wetness = wetness;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (attachedScene?.environment === environmentTarget.texture) attachedScene.environment = null;
      if (attachedScene?.fog === fog) attachedScene.fog = null;
      attachedScene = null;
      const geometries = new Set<BufferGeometry>();
      const materials = new Set<Material>();
      root.traverse((object) => {
        if (object instanceof InstancedMesh) object.dispose();
        if (object instanceof Light) object.dispose();
        const renderable = object as Mesh;
        if (renderable.geometry) geometries.add(renderable.geometry);
        if (renderable.material) {
          const objectMaterials = Array.isArray(renderable.material) ? renderable.material : [renderable.material];
          objectMaterials.forEach((material) => materials.add(material));
        }
      });
      materials.delete(grassMaterial);
      materials.delete(buildingMaterial);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      grassController.dispose();
      buildingController.dispose();
      environmentTarget.dispose();
      root.userData.environment = null;
      root.userData.environmentMap = null;
      root.userData.fog = null;
      root.userData.sun = null;
      root.removeFromParent();
      root.clear();
    },
  };
}
