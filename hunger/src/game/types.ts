import type { ColorRepresentation } from 'three';

export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';
export type CameraMode = 'chase' | 'close' | 'hood';
export type RacePhase = 'menu' | 'countdown' | 'racing' | 'paused' | 'finished';
export type PaintFinish = 'metallic' | 'pearl' | 'satin';

export interface GameSettings {
  quality: QualityPreset;
  paintColor: string;
  paintFinish: PaintFinish;
  wetness: number;
  volume: number;
  steeringSensitivity: number;
  steeringAssist: boolean;
  cameraShake: boolean;
  muted: boolean;
}

export interface InputFrame {
  throttle: number;
  brake: number;
  steer: number;
  handbrake: boolean;
}

export interface RaceResult {
  position: number;
  totalRacers: number;
  raceTime: number;
  bestLap: number;
  laps: number[];
  isNewRecord: boolean;
}

export interface Telemetry {
  speed: number;
  rpm: number;
  gear: number;
  lap: number;
  totalLaps: number;
  position: number;
  totalRacers: number;
  raceTime: number;
  lapTime: number;
  bestLap: number | null;
  checkpoint: number;
  wrongWay: boolean;
  offroad: boolean;
  drifting: boolean;
  progress: number;
}

export type UIAction =
  | 'start'
  | 'pause'
  | 'resume'
  | 'restart'
  | 'garage'
  | 'settings'
  | 'back'
  | 'camera'
  | 'reset'
  | 'mute'
  | 'fullscreen';

export interface UICallbacks {
  onAction: (action: UIAction) => void;
  onColor: (color: string) => void;
  onFinish: (finish: PaintFinish) => void;
  onQuality: (quality: QualityPreset) => void;
  onWetness: (wetness: number) => void;
  onVolume: (volume: number) => void;
  onSteeringSensitivity: (sensitivity: number) => void;
  onAssists: (steeringAssist: boolean, cameraShake: boolean) => void;
}

export interface VehiclePaintOptions {
  color?: ColorRepresentation;
  finish?: PaintFinish;
  isPlayer?: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  quality: 'high',
  paintColor: '#d8ff3e',
  paintFinish: 'metallic',
  wetness: 0.18,
  volume: 0.32,
  steeringSensitivity: 0.72,
  steeringAssist: true,
  cameraShake: true,
  muted: false,
};

export const TOTAL_LAPS = 3;
export const TOTAL_RACERS = 4;
