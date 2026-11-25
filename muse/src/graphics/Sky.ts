import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

// Sunset coastal sky + sun + hemisphere/ambient tuning for PBR IBL feel.
export function setupSky(scene: THREE.Scene, renderer: THREE.WebGLRenderer): { sun: THREE.Vector3; sky: Sky } {
  const sky = new Sky();
  sky.scale.setScalar(6000);
  scene.add(sky);
  const uni = sky.material.uniforms;
  uni['turbidity'].value = 6;
  uni['rayleigh'].value = 1.8;
  uni['mieCoefficient'].value = 0.006;
  uni['mieDirectionalG'].value = 0.85;

  const sun = new THREE.Vector3();
  const elevation = 9; const azimuth = 145;
  const phi = THREE.MathUtils.degToRad(90 - elevation);
  const theta = THREE.MathUtils.degToRad(azimuth);
  sun.setFromSphericalCoords(1, phi, theta);
  uni['sunPosition'].value.copy(sun);

  // key directional light (sun) with shadows
  const dir = new THREE.DirectionalLight(0xffd9b0, 2.6);
  dir.position.copy(sun).multiplyScalar(400);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  dir.shadow.camera.near = 10; dir.shadow.camera.far = 900;
  const S = 160;
  dir.shadow.camera.left = -S; dir.shadow.camera.right = S;
  dir.shadow.camera.top = S; dir.shadow.camera.bottom = -S;
  dir.shadow.bias = -0.0004;
  dir.shadow.normalBias = 0.5;
  scene.add(dir); scene.add(dir.target);

  const hemi = new THREE.HemisphereLight(0x8db8ff, 0x2a1f18, 0.55);
  scene.add(hemi);

  scene.fog = new THREE.FogExp2(0x0e1626, 0.0016);
  renderer.toneMappingExposure = 1.12;
  return { sun, sky };
}

// Image-based lighting without HDR assets: PMREM from the sky itself.
export function bakeEnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tmp = new THREE.Scene();
  // gradient env: cheap but gives cars believable reflections
  const geo = new THREE.SphereGeometry(50, 16, 12);
  const mat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true });
  const colors: number[] = []; const pos = geo.attributes.position;
  const top = new THREE.Color(0x3a6bd8); const mid = new THREE.Color(0xff9a5c); const bot = new THREE.Color(0x0a0d14);
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 50;
    const c = y > 0.25 ? top.clone().lerp(mid, 1 - y) : mid.clone().lerp(bot, Math.min(1, (0.25 - y) * 2));
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  tmp.add(new THREE.Mesh(geo, mat));
  const env = pmrem.fromScene(tmp, 0.06);
  scene.environment = env.texture;
  pmrem.dispose();
}
