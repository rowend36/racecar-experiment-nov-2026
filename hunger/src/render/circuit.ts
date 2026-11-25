import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  TorusGeometry,
  Uint16BufferAttribute,
  Vector3,
} from 'three';
import type { Material } from 'three';
import type { Track } from '../core/Track';
import { createRoadMaterial } from './materials';

export interface CircuitVisual {
  root: import('three').Group;
  dispose(): void;
}

interface TrackFrame {
  position: Vector3;
  quaternion: Quaternion;
  matrix: Matrix4;
}

const WORLD_UP = new Vector3(0, 1, 0);

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

function ribbonGeometry(track: Track, halfWidth: number, height: number): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const count = track.samples.length;
  for (let index = 0; index <= count; index += 1) {
    const sample = track.samples[index % count];
    const distance = index === count ? track.totalLength : sample.distance;
    positions.push(
      sample.position.x - sample.right.x * halfWidth,
      sample.position.y + height,
      sample.position.z - sample.right.z * halfWidth,
      sample.position.x + sample.right.x * halfWidth,
      sample.position.y + height,
      sample.position.z + sample.right.z * halfWidth,
    );
    uvs.push(0, distance / 8, 1, distance / 8);
  }
  for (let index = 0; index < count; index += 1) {
    const left = index * 2;
    const right = left + 1;
    const nextLeft = left + 2;
    const nextRight = left + 3;
    indices.push(left, nextLeft, right, nextLeft, nextRight, right);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(new Uint16BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function makeBannerTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#090d10';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const acid = '#d8ff3e';
    context.fillStyle = acid;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(250, 0);
    context.lineTo(116, 256);
    context.lineTo(0, 256);
    context.closePath();
    context.fill();
    context.beginPath();
    context.moveTo(1024, 0);
    context.lineTo(824, 0);
    context.lineTo(920, 256);
    context.lineTo(1024, 256);
    context.closePath();
    context.fill();
    context.strokeStyle = '#ff5c35';
    context.lineWidth = 9;
    context.beginPath();
    context.moveTo(190, 28);
    context.lineTo(834, 28);
    context.moveTo(176, 228);
    context.lineTo(848, 228);
    context.stroke();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '900 104px Arial, sans-serif';
    context.fillStyle = '#f4f6ed';
    context.fillText('HUNGER APEX', 512, 119);
    context.font = '700 22px Arial, sans-serif';
    context.fillStyle = acid;
    context.fillText('MIDNIGHT CITY CIRCUIT  /  SECTOR 01', 512, 194);
    context.fillStyle = '#090d10';
    context.font = '900 25px Arial, sans-serif';
    context.save();
    context.translate(86, 133);
    context.rotate(-Math.PI / 2);
    context.fillText('H // A', 0, 0);
    context.restore();
  }
  const texture = new CanvasTexture(canvas);
  texture.name = 'HUNGER_APEX_GantryBanner';
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeBoardTexture(title: string, subtitle: string, accent = '#d8ff3e'): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#0b1013';
    context.fillRect(0, 0, 512, 256);
    context.fillStyle = accent;
    context.fillRect(0, 0, 18, 256);
    context.fillRect(494, 0, 18, 256);
    context.strokeStyle = accent;
    context.lineWidth = 5;
    context.strokeRect(30, 22, 452, 212);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#f4f5ed';
    context.font = '900 112px Arial, sans-serif';
    context.fillText(title, 256, 112);
    context.fillStyle = accent;
    context.font = '700 25px Arial, sans-serif';
    context.fillText(subtitle, 256, 192);
  }
  const texture = new CanvasTexture(canvas);
  texture.name = `CircuitBoard_${title}`;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function addBox(
  parent: Object3D,
  geometry: BoxGeometry,
  material: MeshStandardMaterial | MeshBasicMaterial,
  position: [number, number, number],
  scale: [number, number, number],
): Mesh {
  const mesh = new Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createCircuit(track: Track): CircuitVisual {
  const root = new Group();
  root.name = 'HUNGER_Circuit';
  const textures = new Set<CanvasTexture>();
  const unitBox = new BoxGeometry(1, 1, 1);
  const darkSteel = new MeshStandardMaterial({ color: 0x242b2e, metalness: 0.72, roughness: 0.43 });
  const railMaterial = new MeshStandardMaterial({ color: 0x909a9d, metalness: 0.86, roughness: 0.31 });
  const shoulderMaterial = new MeshStandardMaterial({ color: 0x202628, roughness: 0.94, metalness: 0.03 });
  const curbMaterial = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.76, metalness: 0.02 });
  const reflectorMaterial = new MeshStandardMaterial({
    color: 0xffc46b,
    emissive: 0xff8b2e,
    emissiveIntensity: 1.9,
    roughness: 0.32,
  });
  const coneMaterial = new MeshStandardMaterial({ color: 0xff6636, roughness: 0.7 });
  const tireBarrierMaterial = new MeshStandardMaterial({ color: 0x111416, roughness: 0.92 });

  const roadController = createRoadMaterial();
  const roadMaterial = roadController.material;
  roadMaterial.name = 'HUNGER_RoadMaterial';
  const wettableRoadMaterial = roadMaterial as MeshStandardMaterial & {
    setWetness(value: number): void;
    update(time: number): void;
  };
  wettableRoadMaterial.setWetness = roadController.setWetness;
  wettableRoadMaterial.update = roadController.update;
  roadMaterial.userData.setWetness = roadController.setWetness;

  const shoulder = new Mesh(
    ribbonGeometry(track, track.roadHalfWidth + 0.62, 0.012),
    shoulderMaterial,
  );
  shoulder.name = 'HUNGER_RoadShoulder';
  shoulder.receiveShadow = true;
  root.add(shoulder);

  const road = new Mesh(ribbonGeometry(track, track.roadHalfWidth, 0.034), roadMaterial);
  road.name = 'HUNGER_Road';
  road.onBeforeRender = () => roadController.update(performance.now() / 1000);
  road.receiveShadow = true;
  road.userData.setWetness = roadController.setWetness;
  root.add(road);
  root.userData.road = road;
  root.userData.setRoadWetness = roadController.setWetness;

  const localMatrix = new Matrix4();
  const worldMatrix = new Matrix4();
  const localPosition = new Vector3();
  const localScale = new Vector3();
  const localQuaternion = new Quaternion();
  const setInstance = (
    mesh: InstancedMesh,
    index: number,
    frame: TrackFrame,
    x: number,
    y: number,
    z: number,
    scaleX: number,
    scaleY: number,
    scaleZ: number,
    rotationY = 0,
  ): void => {
    localPosition.set(x, y, z);
    localScale.set(scaleX, scaleY, scaleZ);
    localQuaternion.setFromAxisAngle(WORLD_UP, rotationY);
    localMatrix.compose(localPosition, localQuaternion, localScale);
    worldMatrix.multiplyMatrices(frame.matrix, localMatrix);
    mesh.setMatrixAt(index, worldMatrix);
  };

  const sampleCount = track.samples.length;
  const averageSegment = track.totalLength / sampleCount;
  const curbStride = 3;
  const curbCountPerSide = Math.ceil(sampleCount / curbStride);
  const curbs = new InstancedMesh(unitBox, curbMaterial, curbCountPerSide * 2);
  curbs.name = 'HUNGER_Curbs';
  const curbRed = new Color(0xd94a3b);
  const curbWhite = new Color(0xe9e7d9);
  let curbInstance = 0;
  for (let index = 0; index < sampleCount; index += curbStride) {
    const frame = frameAt(track, track.samples[index].distance);
    const length = averageSegment * curbStride * 1.035;
    for (const side of [-1, 1]) {
      setInstance(
        curbs,
        curbInstance,
        frame,
        side * (track.roadHalfWidth + 0.29),
        0.072,
        0,
        0.58,
        0.115,
        length,
      );
      curbs.setColorAt(curbInstance, Math.floor(index / curbStride) % 2 === 0 ? curbRed : curbWhite);
      curbInstance += 1;
    }
  }
  curbs.count = curbInstance;
  curbs.instanceMatrix.needsUpdate = true;
  if (curbs.instanceColor) curbs.instanceColor.needsUpdate = true;
  curbs.receiveShadow = true;
  root.add(curbs);

  const railStride = 4;
  const railCountPerSide = Math.ceil(sampleCount / railStride);
  const railOffset = track.roadHalfWidth + 2.02;
  const upperRails = new InstancedMesh(unitBox, railMaterial, railCountPerSide * 2);
  const lowerRails = new InstancedMesh(unitBox, railMaterial, railCountPerSide * 2);
  const posts = new InstancedMesh(unitBox, darkSteel, railCountPerSide * 2);
  upperRails.name = 'HUNGER_GuardrailsUpper';
  lowerRails.name = 'HUNGER_GuardrailsLower';
  posts.name = 'HUNGER_GuardrailPosts';
  let railInstance = 0;
  for (let index = 0; index < sampleCount; index += railStride) {
    const frame = frameAt(track, track.samples[index].distance);
    const length = averageSegment * railStride * 1.075;
    for (const side of [-1, 1]) {
      const x = side * railOffset;
      setInstance(upperRails, railInstance, frame, x, 0.83, 0, 0.12, 0.19, length);
      setInstance(lowerRails, railInstance, frame, x, 0.49, 0, 0.1, 0.12, length);
      setInstance(posts, railInstance, frame, x, 0.49, 0, 0.17, 0.98, 0.17);
      railInstance += 1;
    }
  }
  upperRails.count = railInstance;
  lowerRails.count = railInstance;
  posts.count = railInstance;
  for (const mesh of [upperRails, lowerRails, posts]) {
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
  }

  const reflectorStride = 12;
  const reflectorCountPerSide = Math.ceil(sampleCount / reflectorStride);
  const reflectors = new InstancedMesh(unitBox, reflectorMaterial, reflectorCountPerSide * 2);
  reflectors.name = 'HUNGER_Reflectors';
  let reflectorInstance = 0;
  for (let index = 0; index < sampleCount; index += reflectorStride) {
    const frame = frameAt(track, track.samples[index].distance);
    for (const side of [-1, 1]) {
      setInstance(reflectors, reflectorInstance, frame, side * (railOffset - 0.075), 0.86, 0, 0.135, 0.075, 0.04);
      reflectorInstance += 1;
    }
  }
  reflectors.count = reflectorInstance;
  reflectors.instanceMatrix.needsUpdate = true;
  root.add(reflectors);

  const startFrame = frameAt(track, track.startDistance);
  const gridFrame = frameAt(track, track.gridDistance);
  const checkerColumns = 18;
  const checkerRows = 2;
  const checkerMaterial = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.82 });
  const checker = new InstancedMesh(unitBox, checkerMaterial, checkerColumns * checkerRows);
  checker.name = 'HUNGER_StartFinishChecker';
  const checkerDark = new Color(0x111619);
  const checkerLight = new Color(0xf1f0e4);
  const tileWidth = (track.roadHalfWidth * 2) / checkerColumns;
  let checkerInstance = 0;
  for (let row = 0; row < checkerRows; row += 1) {
    for (let column = 0; column < checkerColumns; column += 1) {
      setInstance(
        checker,
        checkerInstance,
        startFrame,
        -track.roadHalfWidth + (column + 0.5) * tileWidth,
        0.061,
        (row - 0.5) * 0.62,
        tileWidth * 0.985,
        0.016,
        0.61,
      );
      checker.setColorAt(checkerInstance, (row + column) % 2 === 0 ? checkerLight : checkerDark);
      checkerInstance += 1;
    }
  }
  checker.instanceMatrix.needsUpdate = true;
  if (checker.instanceColor) checker.instanceColor.needsUpdate = true;
  checker.receiveShadow = true;
  root.add(checker);

  const gridMarkerMaterial = new MeshStandardMaterial({ color: 0xd8ddd5, roughness: 0.8 });
  const gridMarkers = new InstancedMesh(unitBox, gridMarkerMaterial, 16);
  gridMarkers.name = 'HUNGER_StartGrid';
  let gridInstance = 0;
  const gridLanes = [0, 2.25, -2.25, 2.25];
  for (let row = 0; row < gridLanes.length; row += 1) {
    const x = gridLanes[row];
    const z = -row * 6;
    setInstance(gridMarkers, gridInstance++, gridFrame, x - 0.92, 0.063, z, 0.09, 0.015, 3.8);
    setInstance(gridMarkers, gridInstance++, gridFrame, x + 0.92, 0.063, z, 0.09, 0.015, 3.8);
    setInstance(gridMarkers, gridInstance++, gridFrame, x, 0.063, z - 1.9, 1.92, 0.015, 0.09);
  }
  gridMarkers.count = gridInstance;
  gridMarkers.instanceMatrix.needsUpdate = true;
  root.add(gridMarkers);

  const gantry = new Group();
  gantry.name = 'HUNGER_StartGantry';
  gantry.position.copy(startFrame.position);
  gantry.quaternion.copy(startFrame.quaternion);
  root.add(gantry);
  const gantryHalfWidth = track.roadHalfWidth + 1.1;
  addBox(gantry, unitBox, darkSteel, [-gantryHalfWidth, 3.35, 0], [0.3, 6.7, 0.34]);
  addBox(gantry, unitBox, darkSteel, [gantryHalfWidth, 3.35, 0], [0.3, 6.7, 0.34]);
  addBox(gantry, unitBox, darkSteel, [0, 6.55, 0], [gantryHalfWidth * 2 + 0.4, 0.32, 0.4]);
  addBox(gantry, unitBox, darkSteel, [0, 4.34, 0], [gantryHalfWidth * 2 + 0.15, 0.13, 0.25]);
  const bannerTexture = makeBannerTexture();
  textures.add(bannerTexture);
  const bannerMaterial = new MeshBasicMaterial({
    map: bannerTexture,
    side: DoubleSide,
    toneMapped: false,
  });
  const banner = new Mesh(new PlaneGeometry(gantryHalfWidth * 2 - 0.12, 2.08), bannerMaterial);
  banner.name = 'HUNGER_APEX_Banner';
  banner.position.set(0, 5.43, 0.04);
  gantry.add(banner);
  for (const side of [-1, 1]) {
    addBox(gantry, unitBox, reflectorMaterial, [side * (gantryHalfWidth - 0.36), 6.56, 0.24], [0.46, 0.12, 0.08]);
  }

  const boardDefinitions = [
    { distance: track.startDistance + 50, title: '50', subtitle: 'METRES TO LINE' },
    { distance: track.startDistance + 100, title: '100', subtitle: 'METRES TO LINE' },
    { distance: track.startDistance + 200, title: '200', subtitle: 'METRES TO LINE' },
    { distance: track.startDistance + 300, title: '300', subtitle: 'METRES TO LINE', accent: '#ff6845' },
  ];
  const boardSupports = new InstancedMesh(unitBox, darkSteel, boardDefinitions.length * 2);
  boardSupports.name = 'HUNGER_DistanceBoardSupports';
  let boardSupportInstance = 0;
  boardDefinitions.forEach((definition, index) => {
    const frame = frameAt(track, definition.distance);
    const board = new Group();
    board.name = `HUNGER_DistanceBoard_${definition.title}`;
    board.position.copy(frame.position);
    board.quaternion.copy(frame.quaternion);
    root.add(board);
    const x = track.roadHalfWidth + 3.45;
    setInstance(boardSupports, boardSupportInstance++, frame, x, 0.75, 0, 0.12, 1.5, 0.12);
    const texture = makeBoardTexture(definition.title, definition.subtitle, definition.accent);
    textures.add(texture);
    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide, toneMapped: false });
    const panel = new Mesh(new PlaneGeometry(2.15, 1.08), material);
    panel.position.set(x, 1.6, -0.02);
    panel.rotation.y = Math.PI;
    board.add(panel);
    addBox(board, unitBox, index % 2 === 0 ? reflectorMaterial : coneMaterial, [x, 2.22, 0], [2.28, 0.07, 0.09]);
  });
  boardSupports.count = boardSupportInstance;
  boardSupports.instanceMatrix.needsUpdate = true;
  boardSupports.castShadow = true;
  root.add(boardSupports);

  const hazardTransforms: Array<{ frame: TrackFrame; outside: number }> = [];
  for (let index = 90; index < sampleCount; index += 72) {
    const sample = track.samples[index];
    if (Math.abs(sample.curvature) > 0.0025) {
      hazardTransforms.push({
        frame: frameAt(track, sample.distance),
        outside: sample.curvature > 0 ? 1 : -1,
      });
    }
  }
  const hazardBoards = new InstancedMesh(unitBox, curbMaterial, hazardTransforms.length * 5);
  hazardBoards.name = 'HUNGER_ApexHazardBoards';
  const hazardDark = new Color(0x171c1f);
  const hazardYellow = new Color(0xe6c84c);
  let hazardInstance = 0;
  hazardTransforms.forEach(({ frame, outside }, transformIndex) => {
    for (let boardIndex = -2; boardIndex <= 2; boardIndex += 1) {
      setInstance(
        hazardBoards,
        hazardInstance,
        frame,
        outside * (track.roadHalfWidth + 1.3),
        0.62,
        boardIndex * 1.18,
        0.11,
        0.64,
        1.12,
      );
      hazardBoards.setColorAt(hazardInstance, (boardIndex + transformIndex) % 2 === 0 ? hazardYellow : hazardDark);
      hazardInstance += 1;
    }
  });
  hazardBoards.count = hazardInstance;
  hazardBoards.instanceMatrix.needsUpdate = true;
  if (hazardBoards.instanceColor) hazardBoards.instanceColor.needsUpdate = true;
  hazardBoards.castShadow = true;
  root.add(hazardBoards);

  const tireGeometry = new TorusGeometry(0.4, 0.135, 8, 18);
  const tireBarriers = new InstancedMesh(tireGeometry, tireBarrierMaterial, 36);
  tireBarriers.name = 'HUNGER_TireBarriers';
  let tireInstance = 0;
  for (let stack = 0; stack < 6; stack += 1) {
    const frame = frameAt(track, track.startDistance + 10 + stack * 1.05);
    for (let tier = 0; tier < 3; tier += 1) {
      for (let row = 0; row < 2; row += 1) {
        setInstance(
          tireBarriers,
          tireInstance++,
          frame,
          track.roadHalfWidth + 3.15 + row * 0.82,
          0.15 + tier * 0.265,
          (stack - 2.5) * 0.38,
          1,
          1,
          1,
        );
      }
    }
  }
  tireBarriers.instanceMatrix.needsUpdate = true;
  tireBarriers.castShadow = true;
  root.add(tireBarriers);

  const coneGeometry = new ConeGeometry(0.16, 0.48, 9);
  const cones = new InstancedMesh(coneGeometry, coneMaterial, 24);
  cones.name = 'HUNGER_MarshalCones';
  let coneInstance = 0;
  for (let index = 0; index < 24; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const frame = frameAt(track, track.startDistance - 10 + Math.floor(index / 2) * 1.8);
    setInstance(
      cones,
      coneInstance++,
      frame,
      side * (track.roadHalfWidth + 4.7 + (index % 3) * 0.48),
      0.26,
      (index % 4) * 0.45,
      1,
      1,
      1,
    );
  }
  cones.instanceMatrix.needsUpdate = true;
  cones.castShadow = true;
  root.add(cones);

  let disposed = false;
  return {
    root,
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
      materials.delete(roadMaterial);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      roadController.dispose();
      root.userData.road = null;
      root.userData.setRoadWetness = null;
      root.removeFromParent();
      root.clear();
    },
  };
}
