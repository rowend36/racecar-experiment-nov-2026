import * as THREE from 'three';
import type { WeatherName } from '../core/Storage';

const VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec3 vDir;
uniform vec3 uSunDir, uZenith, uHorizon, uGround, uSunColor, uCloudColor;
uniform float uTime, uClouds, uFlash, uStars;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.1, 9.3); a *= 0.5; }
  return v;
}
void main() {
  vec3 d = normalize(vDir);
  float y = d.y;
  vec3 col = mix(uHorizon, uZenith, pow(clamp(y, 0.0, 1.0), 0.58));
  float sun = max(dot(d, normalize(uSunDir)), 0.0);
  col += uSunColor * pow(sun, 3.5) * 0.11;
  col += uSunColor * pow(sun, 26.0) * 0.34;
  col += uSunColor * smoothstep(0.99925, 0.99985, sun) * 2.8;
  vec2 dh = normalize(d.xz + vec2(0.0001));
  vec2 sh = normalize(uSunDir.xz + vec2(0.0001));
  float az = max(dot(dh, sh), 0.0);
  col += uSunColor * pow(1.0 - abs(y), 9.0) * pow(az, 3.0) * 0.36;
  if (uStars > 0.01 && y > 0.05) {
    float s = hash21(floor(d.xz * 900.0 / (0.2 + abs(d.y))));
    col += vec3(0.85, 0.92, 1.0) * smoothstep(0.9975, 1.0, s) * smoothstep(0.12, 0.5, y) * uStars;
  }
  if (uClouds > 0.001 && y > -0.02) {
    vec2 uv = vec2(atan(d.z, d.x) * 1.55, asin(clamp(d.y, -1.0, 1.0)) * 2.4);
    vec2 drift = vec2(uTime * 0.0055, uTime * 0.0012);
    float n = fbm(uv * 1.35 + drift + fbm(uv * 2.4 - drift * 2.0) * 0.35);
    float mask = smoothstep(0.42, 0.66, n) * uClouds * smoothstep(-0.012, 0.22, y);
    vec3 cloud = uCloudColor + uSunColor * pow(sun, 5.0) * 0.65;
    cloud *= 0.85 + n * 0.35;
    col = mix(col, cloud, mask * 0.92);
  }
  col += vec3(0.45, 0.55, 0.75) * uFlash * (0.4 + fbm(vec2(uTime * 3.0, 4.0)) * 0.8);
  col = mix(uGround, col, smoothstep(-0.085, 0.005, y));
  gl_FragColor = vec4(col, 1.0);
}`;

export interface Palette {
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
  sunDir: [number, number, number];
  clouds: number;
  stars: number;
  exposure: number;
  bloom: number;
  envIntensity: number;
  wet: number;
}

export const PALETTES: Record<WeatherName, Palette> = {
  sunset: {
    zenith: 0x101636, horizon: 0xff7a45, ground: 0x180f18, sun: 0xffc890,
    cloud: 0x6a4752, fog: 0x9c6a5a, fogDensity: 0.00062,
    light: 0xffb882, lightIntensity: 3.3, hemiSky: 0x8fa8ff, hemiGround: 0x2a1a16,
    hemiIntensity: 1.05, sunDir: [0.96, 0.26, -0.18], clouds: 0.9, stars: 0.0,
    exposure: 1.0, bloom: 0.42, envIntensity: 0.72, wet: 0.0,
  },
  night: {
    zenith: 0x040611, horizon: 0x16244a, ground: 0x05070f, sun: 0x9dc2ff,
    cloud: 0x1b2440, fog: 0x101a34, fogDensity: 0.00085,
    light: 0x9ab8ff, lightIntensity: 1.0, hemiSky: 0x4a6ab0, hemiGround: 0x070a12,
    hemiIntensity: 0.6, sunDir: [-0.4, 0.7, 0.5], clouds: 0.45, stars: 1.0,
    exposure: 1.22, bloom: 0.72, envIntensity: 0.5, wet: 0.45,
  },
  storm: {
    zenith: 0x0a0f1c, horizon: 0x394457, ground: 0x090c12, sun: 0xa8b6cc,
    cloud: 0x252d3b, fog: 0x39465a, fogDensity: 0.00125,
    light: 0xb9c9de, lightIntensity: 1.45, hemiSky: 0x6b7894, hemiGround: 0x11161c,
    hemiIntensity: 0.8, sunDir: [0.35, 0.62, -0.7], clouds: 1.0, stars: 0.0,
    exposure: 1.05, bloom: 0.5, envIntensity: 0.55, wet: 0.85,
  },
};

export class SkySystem {
  readonly mesh: THREE.Mesh;
  readonly sun: THREE.DirectionalLight;
  readonly hemi: THREE.HemisphereLight;
  readonly material: THREE.ShaderMaterial;
  private palette: Palette;
  private flash = 0;
  private flashTimer = 4;
  private env: THREE.Texture | null = null;
  private pmrem: THREE.PMREMGenerator;

  constructor(
    private scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    weather: WeatherName,
  ) {
    this.palette = PALETTES[weather];
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uSunDir: { value: new THREE.Vector3(...this.palette.sunDir).normalize() },
        uZenith: { value: new THREE.Color(this.palette.zenith) },
        uHorizon: { value: new THREE.Color(this.palette.horizon) },
        uGround: { value: new THREE.Color(this.palette.ground) },
        uSunColor: { value: new THREE.Color(this.palette.sun) },
        uCloudColor: { value: new THREE.Color(this.palette.cloud) },
        uTime: { value: 0 },
        uClouds: { value: this.palette.clouds },
        uFlash: { value: 0 },
        uStars: { value: this.palette.stars },
      },
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(4200, 32, 20), this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -1000;
    scene.add(this.mesh);

    this.sun = new THREE.DirectionalLight(this.palette.light, this.palette.lightIntensity);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 320;
    this.sun.shadow.camera.left = -115;
    this.sun.shadow.camera.right = 115;
    this.sun.shadow.camera.top = 115;
    this.sun.shadow.camera.bottom = -115;
    this.sun.shadow.bias = -0.00018;
    this.sun.shadow.normalBias = 0.035;
    scene.add(this.sun, this.sun.target);

    this.hemi = new THREE.HemisphereLight(this.palette.hemiSky, this.palette.hemiGround, this.palette.hemiIntensity);
    scene.add(this.hemi);

    scene.fog = new THREE.FogExp2(this.palette.fog, this.palette.fogDensity);
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.bakeEnvironment();
  }

  private bakeEnvironment(): void {
    const envScene = new THREE.Scene();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(100, 24, 16), this.material);
    envScene.add(dome);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshBasicMaterial({ color: this.palette.ground, side: THREE.DoubleSide }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    envScene.add(ground);
    const target = this.pmrem.fromScene(envScene, 0.04);
    this.env?.dispose();
    this.env = target.texture;
    this.scene.environment = this.env;
    dome.geometry.dispose();
    ground.geometry.dispose();
    (ground.material as THREE.Material).dispose();
  }

  /** Applied by the quality scaler; 0 disables shadow casting entirely. */
  setShadowSize(size: number): void {
    this.sun.castShadow = size > 0;
    if (size > 0) {
      this.sun.shadow.mapSize.set(size, size);
      this.sun.shadow.map?.dispose();
      this.sun.shadow.map = null;
      this.sun.shadow.needsUpdate = true;
    }
  }

  setWeather(weather: WeatherName): void {
    this.palette = PALETTES[weather];
    const p = this.palette;
    const u = this.material.uniforms;
    (u.uSunDir.value as THREE.Vector3).set(...p.sunDir).normalize();
    (u.uZenith.value as THREE.Color).set(p.zenith);
    (u.uHorizon.value as THREE.Color).set(p.horizon);
    (u.uGround.value as THREE.Color).set(p.ground);
    (u.uSunColor.value as THREE.Color).set(p.sun);
    (u.uCloudColor.value as THREE.Color).set(p.cloud);
    u.uClouds.value = p.clouds;
    u.uStars.value = p.stars;
    this.sun.color.set(p.light);
    this.sun.intensity = p.lightIntensity;
    this.hemi.color.set(p.hemiSky);
    this.hemi.groundColor.set(p.hemiGround);
    this.hemi.intensity = p.hemiIntensity;
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.set(p.fog);
      this.scene.fog.density = p.fogDensity;
    }
    this.bakeEnvironment();
  }

  get current(): Palette {
    return this.palette;
  }

  update(dt: number, time: number, camera: THREE.Camera): void {
    this.material.uniforms.uTime.value = time;
    this.mesh.position.copy(camera.position);
    const dir = this.material.uniforms.uSunDir.value as THREE.Vector3;
    this.sun.position.copy(camera.position).addScaledVector(dir, 180);
    this.sun.target.position.copy(camera.position);
    this.sun.target.updateMatrixWorld();
    if (this.palette.stars > 0.5 || this.palette.clouds > 0.99) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        this.flash = 1;
        this.flashTimer = 5 + Math.random() * 11;
      }
      this.flash = Math.max(0, this.flash - dt * (2.4 + Math.random() * 3));
    } else {
      this.flash = 0;
    }
    this.material.uniforms.uFlash.value = this.flash;
  }

  dispose(): void {
    this.env?.dispose();
    this.pmrem.dispose();
  }
}
