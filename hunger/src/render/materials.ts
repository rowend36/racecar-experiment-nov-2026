import {
  DataTexture,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NearestFilter,
  RepeatWrapping,
} from 'three';
import type { ColorRepresentation } from 'three';
import type { PaintFinish } from '../game/types';

export interface MaterialController {
  update(time: number): void;
  dispose(): void;
}

// Shared, allocation-free GLSL noise helpers. Names are prefixed to avoid chunk collisions.
const PROCEDURAL_NOISE_GLSL = /* glsl */ `
float raceHash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float raceNoise21(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 blend = local * local * (3.0 - 2.0 * local);

  float a = raceHash21(cell);
  float b = raceHash21(cell + vec2(1.0, 0.0));
  float c = raceHash21(cell + vec2(0.0, 1.0));
  float d = raceHash21(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
}

float raceFbm21(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
  for (int octave = 0; octave < 4; octave++) {
    value += amplitude * raceNoise21(p);
    p = rotation * p * 2.03 + 17.17;
    amplitude *= 0.5;
  }
  return value;
}

float raceBand(float distanceToCenter, float halfWidth, float antialias) {
  float aa = max(antialias, 0.00001);
  return 1.0 - smoothstep(max(halfWidth - aa, 0.0), halfWidth + aa, abs(distanceToCenter));
}
`;

export function createRoadMaterial(): MaterialController & {
  material: MeshStandardMaterial;
  setWetness(value: number): void;
} {
  // A neutral generated map enables Three's stable vMapUv varying without an asset dependency.
  const neutralMap = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  neutralMap.name = 'RoadUvCarrier';
  neutralMap.magFilter = NearestFilter;
  neutralMap.minFilter = NearestFilter;
  neutralMap.wrapS = RepeatWrapping;
  neutralMap.wrapT = RepeatWrapping;
  neutralMap.generateMipmaps = false;
  neutralMap.needsUpdate = true;

  const material = new MeshStandardMaterial({
    name: 'ProceduralAsphalt',
    color: 0x343638,
    roughness: 0.91,
    metalness: 0.02,
    map: neutralMap,
    envMapIntensity: 0.42,
    dithering: true,
  });

  const uniforms = {
    uTime: { value: 0 },
    uWetness: { value: 0 },
  };
  let disposed = false;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uWetness = uniforms.uWetness;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>\nuniform float uTime;\nuniform float uWetness;\n${PROCEDURAL_NOISE_GLSL}`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      /* glsl */ `
      #include <map_fragment>

      // Road UV convention: u spans the full width; v follows the track.
      vec2 roadUv = vMapUv;
      vec2 roadAa = max(fwidth(roadUv), vec2(0.00001));
      float aggregate = raceNoise21(roadUv * vec2(620.0, 1800.0));
      float fineGrain = raceNoise21(roadUv * vec2(145.0, 430.0));
      float broadGrain = raceFbm21(roadUv * vec2(16.0, 72.0));
      float grain = aggregate * 0.52 + fineGrain * 0.31 + broadGrain * 0.17;

      float wearWarp = (raceNoise21(vec2(roadUv.y * 19.0, roadUv.x * 8.0)) - 0.5) * 0.018;
      float leftTire = raceBand(roadUv.x - 0.315 + wearWarp, 0.043, roadAa.x * 1.5);
      float rightTire = raceBand(roadUv.x - 0.685 - wearWarp, 0.043, roadAa.x * 1.5);
      float tireWear = max(leftTire, rightTire);

      float edgeLines = max(
        raceBand(roadUv.x - 0.026, 0.0055, roadAa.x),
        raceBand(roadUv.x - 0.974, 0.0055, roadAa.x)
      );
      float dashPhase = fract(roadUv.y * 34.0);
      float dashAa = fwidth(roadUv.y) * 34.0;
      float dash = smoothstep(0.08 - dashAa, 0.08 + dashAa, dashPhase)
        * (1.0 - smoothstep(0.47 - dashAa, 0.47 + dashAa, dashPhase));
      float centerLine = raceBand(roadUv.x - 0.5, 0.0035, roadAa.x) * dash;

      float puddleField = raceFbm21(roadUv * vec2(5.0, 28.0) + vec2(11.7, uTime * 0.006));
      float puddle = smoothstep(0.57, 0.73, puddleField);
      float water = uWetness * mix(0.16, 1.0, puddle);

      diffuseColor.rgb *= 0.80 + grain * 0.34;
      diffuseColor.rgb *= 1.0 - tireWear * 0.25;
      diffuseColor.rgb *= 1.0 - water * 0.30;
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.72, 0.735, 0.70), edgeLines * 0.90);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.43, 0.44, 0.41), centerLine * 0.52);
      `,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <roughnessmap_fragment>',
      /* glsl */ `
      #include <roughnessmap_fragment>

      float paintedRoad = max(edgeLines * 0.9, centerLine * 0.52);
      float dryRoughness = clamp(
        roughnessFactor + (grain - 0.5) * 0.16 - tireWear * 0.08,
        0.48,
        0.98
      );
      dryRoughness = mix(dryRoughness, 0.34 + aggregate * 0.05, paintedRoad);
      float wetRoughness = 0.065 + aggregate * 0.035;
      roughnessFactor = mix(dryRoughness, wetRoughness, water);
      `,
    );
  };

  // Different material instances share one compiled program while keeping separate uniforms.
  material.customProgramCacheKey = () => 'RaceRoadMaterial.v1';

  return {
    material,
    setWetness(value: number): void {
      uniforms.uWetness.value = Number.isFinite(value)
        ? Math.min(1, Math.max(0, value))
        : 0;
    },
    update(time: number): void {
      if (!disposed && Number.isFinite(time)) uniforms.uTime.value = time % 1024;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      neutralMap.dispose();
      material.dispose();
    },
  };
}

export function createGrassMaterial(): MaterialController & {
  material: MeshStandardMaterial;
} {
  const material = new MeshStandardMaterial({
    name: 'ProceduralGrass',
    color: 0x467335,
    roughness: 0.96,
    metalness: 0,
    envMapIntensity: 0.25,
    dithering: true,
  });
  const uniforms = { uTime: { value: 0 } };
  let disposed = false;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      'varying vec3 vGrassWorldPosition;\n#include <common>',
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      /* glsl */ `
      #include <worldpos_vertex>
      vec4 grassWorldPosition = vec4(transformed, 1.0);
      #ifdef USE_BATCHING
        grassWorldPosition = batchingMatrix * grassWorldPosition;
      #endif
      #ifdef USE_INSTANCING
        grassWorldPosition = instanceMatrix * grassWorldPosition;
      #endif
      vGrassWorldPosition = (modelMatrix * grassWorldPosition).xyz;
      `,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>\nvarying vec3 vGrassWorldPosition;\nuniform float uTime;\n${PROCEDURAL_NOISE_GLSL}`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      /* glsl */ `
      #include <map_fragment>
      float grassPatch = raceNoise21(vGrassWorldPosition.xz * 0.085);
      float grassDetail = raceNoise21(vGrassWorldPosition.xz * 2.6);
      float grassVariation = grassPatch * 0.68 + grassDetail * 0.32;
      diffuseColor.rgb *= mix(0.74, 1.14, grassVariation);
      diffuseColor.rgb *= 1.0 + 0.012 * sin(
        uTime * 0.55 + vGrassWorldPosition.x * 0.31 + vGrassWorldPosition.z * 0.23
      );
      `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <roughnessmap_fragment>',
      /* glsl */ `
      #include <roughnessmap_fragment>
      roughnessFactor = clamp(roughnessFactor + (grassDetail - 0.5) * 0.07, 0.72, 1.0);
      `,
    );
  };
  material.customProgramCacheKey = () => 'RaceGrassMaterial.v1';

  return {
    material,
    update(time: number): void {
      if (!disposed && Number.isFinite(time)) uniforms.uTime.value = time % 1024;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      material.dispose();
    },
  };
}

export function createCarPaintMaterial(
  color: ColorRepresentation,
  finish: PaintFinish,
): MeshPhysicalMaterial {
  const material = new MeshPhysicalMaterial({
    name: `CarPaint.${finish}`,
    color,
    roughness: 0.24,
    metalness: 0.82,
    clearcoat: 1,
    clearcoatRoughness: 0.075,
    ior: 1.5,
    envMapIntensity: 1.35,
    dithering: true,
  });

  if (finish === 'pearl') {
    material.roughness = 0.27;
    material.metalness = 0.48;
    material.clearcoat = 1;
    material.clearcoatRoughness = 0.09;
    material.iridescence = 0.34;
    material.iridescenceIOR = 1.3;
    material.iridescenceThicknessRange = [180, 420];
  } else if (finish === 'satin') {
    material.roughness = 0.49;
    material.metalness = 0.3;
    material.clearcoat = 0.34;
    material.clearcoatRoughness = 0.34;
    material.iridescence = 0;
  }

  return material;
}

export function createBuildingMaterial(): MaterialController & {
  material: MeshStandardMaterial;
} {
  const material = new MeshStandardMaterial({
    name: 'ProceduralBuilding',
    color: 0x777d86,
    roughness: 0.78,
    metalness: 0.06,
    envMapIntensity: 0.55,
    dithering: true,
  });
  const uniforms = { uTime: { value: 0 } };
  let disposed = false;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      'varying vec3 vBuildingWorldPosition;\nvarying vec3 vBuildingWorldNormal;\n#include <common>',
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <normal_vertex>',
      /* glsl */ `
      #include <normal_vertex>
      vBuildingWorldNormal = normalize(transformNormalByInverseViewMatrix(transformedNormal, viewMatrix));
      `,
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      /* glsl */ `
      #include <worldpos_vertex>
      vec4 buildingWorldPosition = vec4(transformed, 1.0);
      #ifdef USE_BATCHING
        buildingWorldPosition = batchingMatrix * buildingWorldPosition;
      #endif
      #ifdef USE_INSTANCING
        buildingWorldPosition = instanceMatrix * buildingWorldPosition;
      #endif
      vBuildingWorldPosition = (modelMatrix * buildingWorldPosition).xyz;
      `,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      /* glsl */ `
      #include <common>
      varying vec3 vBuildingWorldPosition;
      varying vec3 vBuildingWorldNormal;
      uniform float uTime;
      ${PROCEDURAL_NOISE_GLSL}
      `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      /* glsl */ `
      #include <map_fragment>

      vec3 buildingNormal = normalize(vBuildingWorldNormal);
      float xFacade = step(abs(buildingNormal.z), abs(buildingNormal.x));
      vec2 facade = vec2(
        mix(vBuildingWorldPosition.z, vBuildingWorldPosition.x, xFacade),
        vBuildingWorldPosition.y
      );
      vec2 buildingId = floor(vBuildingWorldPosition.xz / 18.0);
      vec2 windowScale = vec2(1.0 / 2.65, 1.0 / 3.25);
      vec2 windowGrid = facade * windowScale + vec2(
        raceHash21(buildingId + 4.7),
        raceHash21(buildingId + 19.3)
      );
      vec2 windowCell = floor(windowGrid);
      vec2 windowLocal = fract(windowGrid);
      vec2 windowAa = max(fwidth(facade * windowScale) * 0.8, vec2(0.00001));
      float windowFrame = smoothstep(0.17 - windowAa.x, 0.17 + windowAa.x, windowLocal.x)
        * (1.0 - smoothstep(0.83 - windowAa.x, 0.83 + windowAa.x, windowLocal.x))
        * smoothstep(0.18 - windowAa.y, 0.18 + windowAa.y, windowLocal.y)
        * (1.0 - smoothstep(0.80 - windowAa.y, 0.80 + windowAa.y, windowLocal.y));
      float verticalFace = 1.0 - smoothstep(0.55, 0.92, abs(buildingNormal.y));
      float aboveStreet = smoothstep(1.4, 3.1, vBuildingWorldPosition.y);
      float windowMask = windowFrame * verticalFace * aboveStreet;

      float windowRandom = raceHash21(windowCell + buildingId * 13.71);
      float occupied = step(0.43, windowRandom);
      float lit = occupied * (0.68 + 0.32 * raceHash21(windowCell + buildingId * 7.13 + 8.4));
      float coolWindow = step(0.79, raceHash21(windowCell + buildingId * 3.17 + 2.1));
      vec3 windowTint = mix(vec3(1.0, 0.63, 0.28), vec3(0.42, 0.68, 1.0), coolWindow);
      float flicker = 0.97 + 0.03 * sin(uTime * 0.8 + windowRandom * 31.0);
      vec3 unlitGlass = vec3(0.008, 0.015, 0.026);

      diffuseColor.rgb = mix(
        diffuseColor.rgb,
        mix(unlitGlass, windowTint * 0.30, occupied),
        windowMask * 0.94
      );
      totalEmissiveRadiance += windowTint * windowMask * lit * flicker * 1.45;
      `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <roughnessmap_fragment>',
      /* glsl */ `
      #include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.19, windowMask);
      `,
    );
  };
  material.customProgramCacheKey = () => 'RaceBuildingMaterial.v1';

  return {
    material,
    update(time: number): void {
      if (!disposed && Number.isFinite(time)) uniforms.uTime.value = time % 1024;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      material.dispose();
    },
  };
}
