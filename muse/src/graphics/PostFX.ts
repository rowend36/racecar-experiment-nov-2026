import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Subtle cinematic grade: bloom (neon/headlights) + vignette/grain + chromatic edge.
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uVignette: { value: 0.42 }, uSpeed: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uVignette; uniform float uSpeed;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    void main(){
      vec2 uv = vUv;
      // chromatic aberration grows with speed
      float ab = 0.0006 + uSpeed * 0.0022;
      vec2 dir = uv - 0.5;
      float r = texture2D(tDiffuse, uv - dir * ab).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv + dir * ab).b;
      vec3 col = vec3(r, g, b);
      // vignette
      float d = distance(uv, vec2(0.5));
      col *= smoothstep(0.95, 0.35, d * (1.0 + uVignette));
      // subtle teal-orange grade
      col = mix(col, col * vec3(1.02, 0.99, 1.06), 0.5);
      col += (hash(uv * 913.0 + uTime) - 0.5) * 0.028;
      // speed-line darkening at edges
      col = mix(col, col * 0.85, uSpeed * smoothstep(0.35, 0.75, d));
      gl_FragColor = vec4(col, 1.0);
    }`
};

export class PostFX {
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  grade: ShaderPass;
  enabled = true;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.55, 0.7, 0.82);
    this.composer.addPass(this.bloom);
    this.grade = new ShaderPass(GradeShader as never);
    this.composer.addPass(this.grade);
    this.composer.addPass(new OutputPass());
    window.addEventListener('resize', () => this.composer.setSize(innerWidth, innerHeight));
  }

  render(dt: number, speed01: number, nitro: boolean) {
    (this.grade.uniforms as unknown as { uTime: { value: number } }).uTime.value += dt;
    (this.grade.uniforms as unknown as { uSpeed: { value: number } }).uSpeed.value += ((nitro ? 1 : speed01) - (this.grade.uniforms as unknown as { uSpeed: { value: number } }).uSpeed.value) * 0.06;
    this.bloom.strength = nitro ? 0.85 : 0.45 + speed01 * 0.25;
    this.composer.render();
  }
}
