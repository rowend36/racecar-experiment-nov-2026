import { expect, test } from '@playwright/test';
import type { Vector3 } from 'three';

test('three-quarter sunset does not white out the scene', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.hungerGame?.phase === 'menu', undefined, { timeout: 90_000 });

  const diagnostics = await page.evaluate(() => {
    const game = window.hungerGame as unknown as {
      phase: string;
      track: { totalLength: number; sampleAt(distance: number): { position: Vector3; tangent: Vector3 } };
      playerPhysics: { reset(distance: number, lateral: number): void; position: unknown };
      playerVisual: { root: { position: { copy(position: unknown): void } } };
      camera: { position: { set(x: number, y: number, z: number): void }; lookAt(position: unknown): void; updateMatrixWorld(force: boolean): void };
      renderer: { toneMappingExposure: number };
      scene: { getObjectByName(name: string): unknown; traverse(callback: (object: unknown) => void): void };
    };
    const sample = game.track.sampleAt(game.track.totalLength * 0.75);
    const position = sample.position.clone();
    const tangent = sample.tangent;
    game.phase = 'paused';
    game.playerPhysics.reset(game.track.totalLength * 0.75, 0);
    game.playerVisual.root.position.copy(game.playerPhysics.position);
    const cameraPosition = position.clone() as { x: number; y: number; z: number };
    cameraPosition.x -= tangent.x * 8;
    cameraPosition.y += 3;
    cameraPosition.z -= tangent.z * 8;
    game.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    const lookAt = position.clone() as { x: number; y: number; z: number };
    lookAt.x += tangent.x * 12;
    lookAt.y += 1;
    lookAt.z += tangent.z * 12;
    game.camera.lookAt(lookAt);
    game.camera.updateMatrixWorld(true);

    const lamps = game.scene.getObjectByName('HUNGER_TracksideLamps') as {
      count: number;
      instanceMatrix: { array: Float32Array };
      material: { emissiveIntensity: number };
    };
    const nearbyLamps: Array<{ index: number; distance: number; center: number[]; scale: number[] }> = [];
    for (let index = 0; index < lamps.count; index += 1) {
      const offset = index * 16;
      const values = lamps.instanceMatrix.array;
      const center = [values[offset + 12], values[offset + 13], values[offset + 14]];
      const distance = Math.hypot(center[0] - cameraPosition.x, center[1] - cameraPosition.y, center[2] - cameraPosition.z);
      nearbyLamps.push({
        index,
        distance,
        center,
        scale: [
          Math.hypot(values[offset], values[offset + 1], values[offset + 2]),
          Math.hypot(values[offset + 4], values[offset + 5], values[offset + 6]),
          Math.hypot(values[offset + 8], values[offset + 9], values[offset + 10]),
        ],
      });
    }
    nearbyLamps.sort((a, b) => a.distance - b.distance);

    const pointLights: Array<{ name: string; distance: number; intensity: number; range: number; position: number[] }> = [];
    game.scene.traverse((object) => {
      const light = object as { isPointLight?: boolean; name?: string; intensity?: number; distance?: number; position?: { toArray(): number[] } };
      if (!light.isPointLight || !light.position) return;
      const center = light.position.toArray();
      pointLights.push({
        name: light.name ?? '',
        distance: Math.hypot(center[0] - cameraPosition.x, center[1] - cameraPosition.y, center[2] - cameraPosition.z),
        intensity: light.intensity ?? 0,
        range: light.distance ?? 0,
        position: center,
      });
    });
    pointLights.sort((a, b) => a.distance - b.distance);
    const sun = game.scene.getObjectByName('HUNGER_Sun') as {
      position: { x: number; y: number; z: number };
      target: { position: { x: number; y: number; z: number } };
    };
    const sunVector = [sun.position.x - sun.target.position.x, sun.position.y - sun.target.position.y, sun.position.z - sun.target.position.z];
    const sunLength = Math.hypot(...sunVector);
    const viewVector = [lookAt.x - cameraPosition.x, lookAt.y - cameraPosition.y, lookAt.z - cameraPosition.z];
    const viewLength = Math.hypot(...viewVector);
    const sunAlignment = (sunVector[0] * viewVector[0] + sunVector[1] * viewVector[1] + sunVector[2] * viewVector[2]) / (sunLength * viewLength);
    const ui = document.querySelector<HTMLElement>('#ui-root');
    if (ui) ui.style.display = 'none';
    return {
      trackDistance: game.track.totalLength * 0.75,
      camera: cameraPosition,
      nearbyLamps: nearbyLamps.slice(0, 4),
      pointLights,
      lampEmissive: lamps.material.emissiveIntensity,
      sunAlignment,
      exposure: game.renderer.toneMappingExposure,
    };
  });
  await page.waitForTimeout(750);
  const adaptedExposure = await page.evaluate(() => (window.hungerGame as unknown as { renderer: { toneMappingExposure: number } }).renderer.toneMappingExposure);
  await page.screenshot({ path: 'test-results/three-quarter-light.png', fullPage: true });

  expect(diagnostics.nearbyLamps.length).toBeGreaterThan(0);
  expect(diagnostics.pointLights.length).toBe(3);
  expect(diagnostics.pointLights[0].distance).toBeGreaterThan(50);
  expect(diagnostics.sunAlignment).toBeLessThan(0.8);
  expect(adaptedExposure).toBeGreaterThan(0.85);
});
