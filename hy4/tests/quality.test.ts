import { describe, expect, it } from 'vitest';
import { QUALITY_ORDER, QUALITY_PRESETS } from '../src/render/Quality';

/** Fidelity must never regress as the preset rises. */
describe('quality scaler', () => {
  const fields = ['dpr', 'shadow', 'bloomScale', 'density', 'pointLights', 'adaptiveMin'] as const;

  it('defines every preset in the documented order', () => {
    expect(QUALITY_ORDER).toEqual(['low', 'medium', 'high', 'ultra']);
    for (const q of QUALITY_ORDER) expect(QUALITY_PRESETS[q]).toBeDefined();
  });

  it('increases every fidelity field monotonically', () => {
    for (const field of fields) {
      const values = QUALITY_ORDER.map((q) => QUALITY_PRESETS[q][field]);
      for (let i = 1; i < values.length; i += 1) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
      }
      expect(values[values.length - 1]).toBeGreaterThan(values[0]);
    }
  });

  it('never disables bloom or the colour grade at a higher tier', () => {
    // FXAA turns on as tiers rise, and shadows go from off to on; neither may
    // switch back off. Encoded as booleans that only ever go false -> true.
    const fxaa = QUALITY_ORDER.map((q) => QUALITY_PRESETS[q].fxaa);
    const shadows = QUALITY_ORDER.map((q) => QUALITY_PRESETS[q].shadow > 0);
    for (const flags of [fxaa, shadows]) {
      for (let i = 1; i < flags.length; i += 1) {
        if (flags[i - 1]) expect(flags[i]).toBe(true);
      }
    }
  });

  it('keeps the adaptive floor at or below the tier resolution cap', () => {
    for (const q of QUALITY_ORDER) {
      expect(QUALITY_PRESETS[q].adaptiveMin).toBeLessThanOrEqual(QUALITY_PRESETS[q].dpr);
      expect(QUALITY_PRESETS[q].dpr).toBeGreaterThanOrEqual(1);
    }
  });
});
