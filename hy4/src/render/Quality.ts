import type { QualityName } from '../core/Storage';

/**
 * Single source of truth for graphics fidelity.
 *
 * Every field must be monotonically non-decreasing from low to ultra: a higher
 * preset may add fidelity but must never turn off or degrade a visual feature.
 * The colour grade and bloom run at every tier, so switching presets never
 * changes the look — only its sharpness, shadow fidelity and detail density.
 */
export interface QualityPreset {
  label: string;
  /** Cap on device pixel ratio used for the internal render target. */
  dpr: number;
  /** Shadow map resolution; 0 means shadows disabled. */
  shadow: number;
  /** FXAA post pass. */
  fxaa: boolean;
  /** Bloom render target scale relative to the viewport. */
  bloomScale: number;
  /** Fraction of scenery props instantiated. */
  density: number;
  /** Maximum number of real trackside point lights. */
  pointLights: number;
  /** Minimum internal scale the adaptive scaler may fall to. */
  adaptiveMin: number;
}

export const QUALITY_ORDER: QualityName[] = ['low', 'medium', 'high', 'ultra'];

export const QUALITY_PRESETS: Record<QualityName, QualityPreset> = {
  low: {
    label: 'LOW', dpr: 1.0, shadow: 0, fxaa: false, bloomScale: 0.5,
    density: 0.34, pointLights: 2, adaptiveMin: 0.62,
  },
  medium: {
    label: 'MEDIUM', dpr: 1.25, shadow: 1024, fxaa: true, bloomScale: 0.65,
    density: 0.55, pointLights: 4, adaptiveMin: 0.75,
  },
  high: {
    label: 'HIGH', dpr: 1.65, shadow: 1536, fxaa: true, bloomScale: 0.8,
    density: 0.78, pointLights: 6, adaptiveMin: 0.9,
  },
  ultra: {
    label: 'ULTRA', dpr: 2.2, shadow: 2048, fxaa: true, bloomScale: 1.0,
    density: 1.0, pointLights: 8, adaptiveMin: 1.0,
  },
};
