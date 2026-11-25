import * as THREE from 'three';

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SKY_FRAG = /* glsl */ `
precision highp float;
varying vec3 vDir;

uniform vec3 uSunDir;
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uGround;
uniform vec3 uSunColor;
uniform vec3 uCloudColor;
uniform float uTime;
uniform float uClouds;
uniform float uFlash;
uniform float uStorm;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.1, 9.3);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 d = normalize(vDir);
  float y = d.y;
  float up = clamp(y, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(up, 0.58));

  float sunAmt = max(dot(d, normalize(uSunDir)), 0.0);
  // Broad atmospheric scattering, tight forward glow and the disc.
  col += uSunColor * pow(sunAmt, 3.5) * 0.11;
  col += uSunColor * pow(sunAmt, 24.0) * 0.32;
  col += uSunColor * smoothstep(0.99925, 0.99985, sunAmt) * 2.6;

  // Warm band hugging the horizon towards the sun.
  vec2 dh = normalize(d.xz + vec2(0.0001));
  vec2 sh = normalize(uSunDir.xz + vec2(0.0001));
  float az = max(dot(dh, sh), 0.0);
  col += uSunColor * pow(1.0 - abs(y), 9.0) * pow(az, 3.0) * 0.34;

  // Stars, only high in the sky and when the sky is deep enough.
  float starField = hash21(floor(d.xz * 900.0 / (0.2 + abs(d.y))));
  col += vec3(0.8, 0.9, 1.0) * smoothstep(0.9985, 1.0, starField) * smoothstep(0.15, 0.55, y) * 0.7;

  // Clouds projected on the sky dome with slow drift.
  if (uClouds > 0.001 && y > -0.02) {
    vec2 uv = vec2(atan(d.z, d.x) * 1.55, asin(clamp(d.y, -1.0, 1.0)) * 2.4);
    vec2 drift = vec2(uTime * 0.0055, uTime * 0.0012);
    float n = fbm(uv * 1.35 + drift + fbm(uv * 2.4 - drift * 2.0) * 0.35);
    float mask = smoothstep(0.42, 0.66, n) * uClouds * smoothstep(-0.012, 0.22, y);
    vec3 cloud = uCloudColor;
    cloud += uSunColor * pow(sunAmt, 5.0) * 0.65;
    cloud *= 0.85 + n * 0.35;
    col = mix(col, cloud, mask * 0.92);
  }

  // Storm wall / lightning rim.
  if (uStorm > 0.5) {
    col += vec3(0.35, 0.45, 0.7) * uFlash * (0.4 + fbm(vec2(uTime * 3.0, 4.0)) * 0.8);
  }

  // Ground haze below the horizon.
  col = mix(uGround, col, smoothstep(-0.085, 0.005, y));

  gl_FragColor = vec4(col, 1.0);
}
`;

export interface SkyPalette {
  zenith: number;
  horizon: number;
  ground: number;
  sun: number;
  cloud: number;
  fog: number;
  fogDensity: number;
  light: number;
  lightIntensity: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  sunDir: THREE.Vector3;
  clouds: number;
  exposure: number;
  bloom: number;
  envIntensity: number;
}

export const SUNSET: SkyPalette = {
  zenith: 0x121a3b,
  horizon: 0xff7a45,
  ground: 0x1a1219,
  sun: 0xffc890,
  cloud: 0x644550,
  fog: 0xa8705a,
  fogDensity: 0.00078,
  light: 0xffb37d,
  lightIntensity: 3.4,
  hemiSky: 0x8fa8ff,
  hemiGround: 0x2a1a16,
  hemiIntensity: 1.05,
  sunDir: new THREE.Vector3(0.985, 0.3, -0.174).normalize(),
  clouds: 0.95,
  exposure: 1.01,
  bloom: 0.34,
  envIntensity: 0.66,
};

export const STORM: SkyPalette = {
  zenith: 0x070b14,
  horizon: 0x49546b,
  ground: 0x0a0c12,
  sun: 0xa8bad8,
  cloud: 0x141923,
  fog: 0x3c4554,
  fogDensity: 0.0011,
  light: 0x9fb2d6,
  lightIntensity: 1.35,
  hemiSky: 0x6b7ea6,
  hemiGround: 0x11151d,
  hemiIntensity: 1.05,
  sunDir: new THREE.Vector3(-0.42, 0.42, 0.68).normalize(),
  clouds: 1.0,
  exposure: 1.04,
  bloom: 0.55,
  envIntensity: 0.66,
};

export class Sky {
  readonly mesh: THREE.Mesh;
  readonly material: THREE.ShaderMaterial;
  readonly envScene: THREE.Scene;
  private envMesh: THREE.Mesh;
  private envTarget: THREE.Texture | null = null;
  private pmrem: THREE.PMREMGenerator;
  private renderer: THREE.WebGLRenderer;
  palette: SkyPalette = SUNSET;
  storm = false;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.pmrem.compileEquirectangularShader();

    const geo = new THREE.SphereGeometry(1, 48, 32);
    this.material = new THREE.ShaderMaterial({
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uSunDir: { value: this.palette.sunDir.clone() },
        uZenith: { value: new THREE.Color(this.palette.zenith) },
        uHorizon: { value: new THREE.Color(this.palette.horizon) },
        uGround: { value: new THREE.Color(this.palette.ground) },
        uSunColor: { value: new THREE.Color(this.palette.sun) },
        uCloudColor: { value: new THREE.Color(this.palette.cloud) },
        uTime: { value: 0 },
        uClouds: { value: this.palette.clouds },
        uFlash: { value: 0 },
        uStorm: { value: 0 },
      },
    });

    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.scale.setScalar(4200);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -1000;

    this.envScene = new THREE.Scene();
    this.envMesh = new THREE.Mesh(geo, this.material);
    this.envMesh.scale.setScalar(40);
    this.envScene.add(this.envMesh);
  }

  setPalette(p: SkyPalette, storm: boolean): void {
    this.palette = p;
    this.storm = storm;
    const u = this.material.uniforms;
    (u.uZenith.value as THREE.Color).set(p.zenith);
    (u.uHorizon.value as THREE.Color).set(p.horizon);
    (u.uGround.value as THREE.Color).set(p.ground);
    (u.uSunColor.value as THREE.Color).set(p.sun);
    (u.uCloudColor.value as THREE.Color).set(p.cloud);
    (u.uSunDir.value as THREE.Vector3).copy(p.sunDir);
    u.uClouds.value = p.clouds;
    u.uStorm.value = storm ? 1 : 0;
    this.material.needsUpdate = true;
    this.renderEnvironment();
  }

  /** Prefiltered IBL from the procedural sky so every PBR surface reflects the sunset. */
  renderEnvironment(): THREE.Texture {
    if (this.envTarget) this.envTarget.dispose();
    const target = this.pmrem.fromScene(this.envScene, 0, 0.1, 100);
    this.envTarget = target.texture;
    return target.texture;
  }

  get environment(): THREE.Texture | null {
    return this.envTarget;
  }

  setFlash(v: number): void {
    this.material.uniforms.uFlash.value = v;
  }

  update(dt: number, cameraPosition: THREE.Vector3): void {
    this.material.uniforms.uTime.value += dt;
    this.mesh.position.copy(cameraPosition);
  }

  dispose(): void {
    this.envTarget?.dispose();
    this.pmrem.dispose();
    this.material.dispose();
    this.mesh.geometry.dispose();
  }
}
