# MUSE — Apex Protocol

Ultra-realistic cross-platform 3D arcade racing game (Asphalt-style). Web-first for maximum reach + native wrappers for Steam/mobile.

**Stack:** TypeScript + Three.js (WebGL2 HDR pipeline, ACES, PBR clearcoat car paint, PMREM IBL, PCF soft shadows, UnrealBloom + cinematic grade pass) — zero binary assets, everything procedural for instant load and 60fps.

## Run

```bash
cd muse
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/ (deploy anywhere)
npm run preview
```

## Controls

- `WASD` / arrows — steer + gas/brake, `SHIFT` nitro, `SPACE` drift/brake, `R` reset, `C` camera, `ENTER` start
- Gamepad + touch (auto gas + N₂O button) supported

## Features

- 3-lap Coastal GP closed-loop circuit with elevation, widened corners, curbs, neon walls, start gantry
- Arcade drift physics @120Hz fixed-step, wall scrape, wrong-way + lap logic
- 3 AI rivals with rubber-banding, lane choice, corner braking, nitro
- Chase / hood / cinematic cameras with speed FOV kick + dynamic shadow frustum
- Adaptive resolution scaling to lock 60fps, instanced city/palms/floodlights, pooled vectors
- Procedural WebAudio: RPM engine synth, skid, nitro wind, countdown beeps
- HUD: lap/pos/time, speed, nitro bar, drift + wrong-way indicators, live minimap, fps
- Quality toggle (Ultra/Performance), mute, 3 selectable cars

## Cross-platform

- Web build (`dist/`) runs on Windows/macOS/Linux/iOS/Android — PWA-ready (`manifest.webmanifest`)
- Native: wrap with **Tauri** (`tauri init` → point at `dist/`) or **Electron/Capacitor** for Steam/Play/App Store
- Performance: `ULTRA` = full bloom + shadows; `PERFORMANCE` = reduced bloom, shadows off, auto resolution 0.55–1.0x

## Tuning

- `src/vehicles/Car.ts` → `CAR_SPECS`
- `src/vehicles/Physics.ts` → grip/accel/drift
- `src/vehicles/AI.ts` → difficulty/aggression
- `src/world/Track.ts` → circuit layout points
- `src/graphics/*` → sky time, bloom, grade
