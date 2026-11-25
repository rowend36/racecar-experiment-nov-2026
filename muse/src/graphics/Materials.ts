import * as THREE from 'three';

// Professional PBR material factory: car paint w/ clearcoat + metallic flake,
// asphalt w/ procedural detail, emissive strips, glass.
export function makeCarPaint(color: number): THREE.MeshPhysicalMaterial {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.85,
    roughness: 0.28,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.4,
  });
  // subtle metallic flake via onBeforeCompile noise
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace(
      '#include <roughnessmap_fragment>',
      `#include <roughnessmap_fragment>
       float flake = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
       roughnessFactor = clamp(roughnessFactor + (flake - 0.5) * 0.08, 0.05, 1.0);`
    );
  };
  return m;
}

export function makeAsphalt(): THREE.MeshStandardMaterial {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#23262c'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) {
    const v = 25 + Math.random() * 40;
    g.fillStyle = `rgb(${v},${v + 2},${v + 5})`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 1.4, 1.4);
  }
  g.strokeStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 8; i++) {
    g.beginPath(); g.moveTo(Math.random()*256, 0); g.lineTo(Math.random()*256, 256); g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0.05, envMapIntensity: 0.35 });
  return m;
}

export function makeCurb(): THREE.MeshStandardMaterial {
  const c = document.createElement('canvas'); c.width = 128; c.height = 16;
  const g = c.getContext('2d')!;
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#d21f3c' : '#f2f2f2'; g.fillRect(i * 16, 0, 16, 16); }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.0 });
}

export function makeGlowStrip(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: '#0a0a0a', emissive: new THREE.Color(color), emissiveIntensity: 3.2, roughness: 0.4 });
}

export function makeGlass(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: 0x0b1622, metalness: 0.1, roughness: 0.05,
    transparent: true, opacity: 0.82, clearcoat: 1, envMapIntensity: 1.6,
  });
}

export function makeHeadlight(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xcfeaff, emissiveIntensity: 5, roughness: 0.2 });
}

export function makeTaillight(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: 0x330000, emissive: 0xff0a2a, emissiveIntensity: 4, roughness: 0.3 });
}
