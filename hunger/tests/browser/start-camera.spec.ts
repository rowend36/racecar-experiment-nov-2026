import { expect, test } from '@playwright/test';
import type { PerspectiveCamera, Quaternion, Vector3 } from 'three';

test('attract camera stays clear of the start gantry', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.hungerGame?.phase === 'menu', undefined, { timeout: 90_000 });
  await page.waitForFunction(() => {
    const game = window.hungerGame as unknown as { menuTime: number };
    return game.menuTime > 12;
  }, undefined, { timeout: 30_000 });

  const view = await page.evaluate(() => {
    const game = window.hungerGame as unknown as {
      camera: PerspectiveCamera;
      playerVisual: { root: { visible: boolean; position: Vector3 } };
      track: { startDistance: number; gridDistance: number; roadHalfWidth: number; sampleAt(distance: number): { position: Vector3; right: Vector3 } };
    };
    const line = game.track.sampleAt(game.track.startDistance);
    const grid = game.track.sampleAt(game.track.gridDistance);
    const postOffset = game.track.roadHalfWidth + 1.1;
    const distances = [-1, 1].map((side) => {
      const postX = line.position.x + line.right.x * postOffset * side;
      const postZ = line.position.z + line.right.z * postOffset * side;
      return Math.hypot(game.camera.position.x - postX, game.camera.position.z - postZ);
    });
    return {
      clearance: Math.min(...distances),
      angle: Math.atan2(game.camera.position.z - grid.position.z, game.camera.position.x - grid.position.x),
      gridToLine: line.position.distanceTo(grid.position),
      playerProjection: game.playerVisual.root.position.clone().project(game.camera),
      playerVisible: game.playerVisual.root.visible,
    };
  });
  await page.screenshot({ path: 'test-results/menu-camera-showcase.png', fullPage: true });
  expect(view.clearance).toBeGreaterThan(0.75);
  expect(view.gridToLine).toBeGreaterThan(15);
  expect(Math.abs(view.angle - 2.15)).toBeLessThan(0.25);
  expect(view.playerVisible).toBe(true);
  expect(Math.abs(view.playerProjection.x)).toBeLessThan(1);
  expect(Math.abs(view.playerProjection.y)).toBeLessThan(1);
  expect(view.playerProjection.z).toBeGreaterThan(-1);
  expect(view.playerProjection.z).toBeLessThan(1);
});

test('D and A steer toward screen-right and screen-left', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.hungerGame?.phase === 'menu', undefined, { timeout: 90_000 });
  await page.locator('[data-action="start"]').first().click();
  await page.waitForFunction(() => window.hungerGame?.phase === 'racing', undefined, { timeout: 15_000 });

  const cameraRight = await page.evaluate(() => {
    const game = window.hungerGame as unknown as { camera: { matrixWorld: { elements: number[] } } };
    return game.camera.matrixWorld.elements.slice(0, 3);
  });
  const yaw = async () => page.evaluate(() => (window.hungerGame as unknown as { playerPhysics: { yaw: number } }).playerPhysics.yaw);
  const initialYaw = await yaw();
  await page.keyboard.down('KeyW');
  await page.keyboard.down('KeyD');
  await page.waitForTimeout(650);
  await page.keyboard.up('KeyD');
  await page.keyboard.up('KeyW');
  const rightYaw = await yaw();
  const rightTurn = [
    Math.sin(rightYaw) - Math.sin(initialYaw),
    0,
    Math.cos(rightYaw) - Math.cos(initialYaw),
  ];
  const rightDot = rightTurn[0] * cameraRight[0] + rightTurn[2] * cameraRight[2];
  expect(rightDot).toBeGreaterThan(0.02);

  await page.keyboard.press('KeyR');
  await page.waitForTimeout(150);
  const resetYaw = await yaw();
  await page.keyboard.down('KeyW');
  await page.keyboard.down('KeyA');
  await page.waitForTimeout(650);
  await page.keyboard.up('KeyA');
  await page.keyboard.up('KeyW');
  const leftYaw = await yaw();
  const leftTurn = [
    Math.sin(leftYaw) - Math.sin(resetYaw),
    0,
    Math.cos(leftYaw) - Math.cos(resetYaw),
  ];
  const leftDot = leftTurn[0] * cameraRight[0] + leftTurn[2] * cameraRight[2];
  expect(leftDot).toBeLessThan(-0.02);
});

test('grid cars face and travel along the racing direction', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.hungerGame?.phase === 'menu', undefined, { timeout: 90_000 });
  await page.locator('[data-action="start"]').first().click();
  await page.waitForFunction(() => window.hungerGame?.phase === 'racing', undefined, { timeout: 15_000 });

  const initial = await page.evaluate(() => {
    const game = window.hungerGame as unknown as {
      track: { gridDistance: number; sampleAt(distance: number): { tangent: Vector3 } };
      playerVisual: { root: { quaternion: Quaternion; position: Vector3 } };
      opponents: Array<{ distance: number; speed: number; visual: { root: { quaternion: Quaternion; position: Vector3 } } }>;
    };
    const playerTangent = game.track.sampleAt(game.track.gridDistance).tangent;
    const playerForward = game.playerVisual.root.position.clone().set(0, 0, 1).applyQuaternion(game.playerVisual.root.quaternion);
    return {
      playerAlignment: playerForward.dot(playerTangent),
      opponentAlignments: game.opponents.map((opponent) => {
        const tangent = game.track.sampleAt(game.track.gridDistance + opponent.distance).tangent;
        const forward = opponent.visual.root.position.clone().set(0, 0, 1).applyQuaternion(opponent.visual.root.quaternion);
        return forward.dot(tangent);
      }),
      distance: game.opponents[0].distance,
    };
  });
  expect(initial.playerAlignment).toBeGreaterThan(0.98);
  for (const alignment of initial.opponentAlignments) expect(alignment).toBeGreaterThan(0.98);

  await page.waitForTimeout(800);
  const movement = await page.evaluate(() => {
    const game = window.hungerGame as unknown as {
      opponents: Array<{ distance: number; speed: number }>;
      track: { gridDistance: number; sampleAt(distance: number): { tangent: { x: number; z: number } } };
    };
    const opponent = game.opponents[0];
    const tangent = game.track.sampleAt(game.track.gridDistance + opponent.distance).tangent;
    return { speed: opponent.speed, tangent };
  });
  const finalDistance = await page.evaluate(() => (window.hungerGame as unknown as { opponents: Array<{ distance: number }> }).opponents[0].distance);
  expect(finalDistance - initial.distance).toBeGreaterThan(0.5);
  expect(movement.speed).toBeGreaterThan(0);
  expect(Math.hypot(movement.tangent.x, movement.tangent.z)).toBeCloseTo(1, 4);
});
