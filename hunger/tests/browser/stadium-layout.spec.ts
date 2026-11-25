import { expect, test } from '@playwright/test';

test('starting grid has physical clearance from trackside structures', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.hungerGame?.phase === 'menu', undefined, { timeout: 90_000 });

  const layout = await page.evaluate(() => {
    const game = window.hungerGame as unknown as {
      scene: {
        updateMatrixWorld(force: boolean): void;
        getObjectByName(name: string): unknown;
      };
      track: { startDistance: number; gridDistance: number; nearest(position: unknown, hint: number): { lateral: number; position: { distanceTo(position: unknown): number } } };
      playerPhysics: { position: unknown };
      camera: { position: { set(x: number, y: number, z: number): void }; lookAt(position: unknown): void; updateMatrixWorld(force: boolean): void };
    };
    game.scene.updateMatrixWorld(true);
    const structures = game.scene.getObjectByName('HUNGER_GrandstandStructure') as {
      count: number;
      instanceMatrix: { array: Float32Array };
    };
    const roofs = game.scene.getObjectByName('HUNGER_GrandstandRoofs') as {
      count: number;
      instanceMatrix: { array: Float32Array };
    };
    const instanceData = (mesh: typeof structures) => {
      const rows: Array<{ center: number[]; scale: number[] }> = [];
      for (let index = 0; index < mesh.count; index += 1) {
        const offset = index * 16;
        const e = mesh.instanceMatrix.array;
        const center = [e[offset + 12], e[offset + 13], e[offset + 14]];
        const scale = [
          Math.hypot(e[offset], e[offset + 1], e[offset + 2]),
          Math.hypot(e[offset + 4], e[offset + 5], e[offset + 6]),
          Math.hypot(e[offset + 8], e[offset + 9], e[offset + 10]),
        ];
        rows.push({ center, scale });
      }
      return rows;
    };
    const gantry = game.scene.getObjectByName('HUNGER_StartGantry') as { position: { toArray(): number[] } };
    const startLight = game.scene.getObjectByName('HUNGER_TracksidePointLight_1') as { intensity: number; distance: number };
    const lamps = game.scene.getObjectByName('HUNGER_TracksideLamps') as { instanceMatrix: { array: Float32Array } };
    const nearest = game.track.nearest(game.playerPhysics.position, -1);
    return {
      player: (game.playerPhysics.position as { toArray(): number[] }).toArray(),
      camera: (game.camera.position as unknown as { toArray(): number[] }).toArray(),
      lateral: nearest.lateral,
      gridToLine: nearest.position.distanceTo(gantry.position),
      gantry: gantry.position.toArray(),
      startLightIntensity: startLight.intensity,
      startLightDistance: startLight.distance,
      startLampWidth: Math.hypot(lamps.instanceMatrix.array[0], lamps.instanceMatrix.array[1], lamps.instanceMatrix.array[2]),
      structures: instanceData(structures),
      roofs: instanceData(roofs),
    };
  });
  const player = layout.player;
  await page.evaluate(() => {
      const game = window.hungerGame as unknown as {
        phase: string;
        playerPhysics: { position: { x: number; y: number; z: number } };
        camera: { position: { set(x: number, y: number, z: number): void }; lookAt(position: unknown): void; updateMatrixWorld(force: boolean): void };
      };
      game.phase = 'paused';
      const position = game.playerPhysics.position;
      game.camera.position.set(position.x, position.y + 85, position.z + 0.01);
      game.camera.lookAt(position);
      game.camera.updateMatrixWorld(true);
      const ui = document.querySelector<HTMLElement>('#ui-root');
      if (ui) ui.style.display = 'none';
    });
  await page.waitForTimeout(150);
  await page.screenshot({ path: 'test-results/start-grid-topdown.png', fullPage: true });

  expect(Math.abs(layout.lateral)).toBeLessThan(0.01);
  expect(layout.gridToLine).toBeGreaterThan(15);
  expect(layout.startLightIntensity).toBeLessThanOrEqual(12);
  expect(layout.startLightDistance).toBeLessThanOrEqual(18);
  expect(layout.startLampWidth).toBeLessThanOrEqual(0.6);
  expect(layout.roofs).toHaveLength(3);
  for (const roof of layout.roofs) {
    const distance = Math.hypot(roof.center[0] - player[0], roof.center[2] - player[2]);
    expect(distance).toBeGreaterThan(40);
  }
  expect(layout.structures.length).toBeGreaterThan(20);
  expect(player[1]).toBeLessThan(2);
});
