# HUNGER APEX — Engineering Handoff

## Project Snapshot

- **Location:** `/Users/fresh/Work/racecar/hunger`
- **Stack:** TypeScript, Three.js r187, Vite 8, Vitest, Playwright
- **Target:** Cross-platform browser / installable PWA
- **Scope:** Playable, polished 3D racing vertical slice with original procedural assets
- **Race format:** 4 cars, 3 laps, approximately 0.76 km circuit
- **Status:** Production build, type checking, unit tests, and Brave browser tests pass

This is not yet an Asphalt-scale commercial game. It is a strong technical and gameplay foundation. Cars, tracks, buildings, and effects are procedural and original; no licensed vehicle or environment assets are included.

---

## Run Commands

```bash
cd /Users/fresh/Work/racecar/hunger
npm install
npm run dev
```

Development URL: `http://localhost:5173`

```bash
npm run build          # TypeScript check + production Vite build
npm run preview        # Serve the production build
npm run typecheck      # Strict TypeScript check only
npm test               # Vitest unit/integration suite
npm run test:browser   # Build + Playwright suite in Brave
npm run test:watch     # Vitest watch mode
```

After updating a cached production/PWA build, hard-refresh with **Cmd+Shift+R**.

---

## Implemented Gameplay

- Three-lap race against three opponents
- Standing grid approximately 18 m behind the start gantry
- Fixed-step vehicle simulation at 120 Hz
- Acceleration, braking, reverse, rolling resistance, and aerodynamic drag
- Speed-sensitive steering with configurable sensitivity
- Steering assist, reduced high-speed throttle while turning
- Handbrake drifting and reduced lateral grip
- Grass/offroad slowdown and reduced grip
- Barrier collision response, impact particles, camera shake, and synthesized impact audio
- Player/opponent collision response
- Checkpoint-validated lap timing; reversing invalidates checkpoint progress
- Race position, current lap, lap time, best lap, splits, and results
- Best-lap persistence
- Vehicle recovery with `R`
- Chase, close, and hood cameras
- Countdown, pause/resume, restart, and return-to-menu flows
- Wrong-way, offroad, and drift indicators
- Touch, keyboard, and standard gamepad driving

### Current Controls

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Accelerate | `W` / Up | A / RT | GAS |
| Brake / reverse | `S` / Down | B / LT | BRAKE |
| Steer | A/D or Left/Right | Left stick | Left/right buttons |
| Handbrake | Space | X | HB |
| Camera | C | Y | HUD camera button |
| Recover | R | Back | HUD reset button |
| Pause | Esc / P | Start | HUD pause button |
| Mute | M | — | HUD/settings button |
| Fullscreen | F | — | Settings button |

There is currently **no nitro/boost system**. The garage’s “TWIN-TURBO V8” text is cosmetic.

---

## Rendering and Art

- Original procedural mid-engine supercars
  - Sculpted lofted body and canopy
  - Carbon aero parts, splitter, diffuser, spoiler
  - Detailed tires, rims, spokes, brake discs, and calipers
  - Rolling wheels and steering front wheels
  - Active-style spoiler behavior
  - Brake-light intensification
  - Emissive headlights/tail lights and contact shadows
  - Merged static geometry to reduce draw calls
- Elevated closed city circuit
  - Procedural asphalt shader with aggregate, tire wear, edge lines, dashes, and wetness
  - Red/white curbs, guardrails, posts, reflectors, start grid, checker line, and gantry
  - Distance boards, hazard boards, tire barriers, and cones
- Sunset environment
  - Three.js `Sky` and PMREM environment reflections
  - Camera-following directional sun and soft shadows
  - Exponential fog
  - Instanced city buildings with procedural lit windows
  - Mountains, trees, grandstands, light poles, and wet ground patches
- Post-processing
  - HDR half-float render targets
  - Bloom
  - Cinematic color grade, vignette, grain, chromatic aberration, and speed effects
  - FXAA on High/Ultra
  - SSAO on Ultra
- Quality presets: Low, Medium, High, Ultra
- Dynamic pixel-ratio scaling based on measured FPS
- Fixed-size pooled tire smoke, dust, and spark particles

### Important Coordinate Convention

- Vehicle forward is local **+Z**.
- Positive screen-right steering input must produce **negative yaw**.
- `Track.right` is the geometric lateral basis `(tangent.z, 0, -tangent.x)`. For a +Z-facing vehicle this is not the driver’s screen-right vector.
- Driver screen-right is approximately `(-forward.z, 0, forward.x)`.
- Trackside frame matrices must call `matrix.setPosition(sample.position)` after `makeBasis(...)`.

These conventions caused earlier steering and trackside-placement regressions. Preserve them.

---

## AI and Race Session

- Opponents use a spline-following, speed-target controller rather than the full player physics model.
- They calculate corner speed from upcoming curvature and brake toward a target speed.
- Opponents are configured for the full three-lap race distance.
- Race session progress uses wrapped track deltas and anti-cheat checkpoint thresholds.
- Player physics uses richer momentum, friction, grip, and collision behavior than the AI.

### Known AI Fairness Issue

The AI can feel frictionless and too strong because it:

- Follows the racing line directly
- Does not accumulate lateral momentum or scrub speed in corners
- Ignores rolling/aero drag in the same way as the player
- Does not receive equivalent collision momentum loss
- Never makes driving mistakes

Raw acceleration is currently higher for the player (`15.8`) than the AI (`11.2`), but the AI’s perfect line makes it pull away in practice.

Recommended follow-up: either tune AI drag/corner loss/collisions first, or migrate opponents onto `VehiclePhysics` with pure-pursuit steering.

---

## UI and Settings

- Premium motorsport menu, Garage, Settings, HUD, pause, countdown, and results
- Responsive desktop and phone-landscape layouts
- Acid-lime / near-black visual identity
- Six paint colors and Metallic, Pearl, and Satin finishes
- Live paint updates
- Cached-DPR minimap
- Accessible buttons, labels, focus states, and reduced-motion support

### Persisted Settings

LocalStorage key:

```text
hunger-apex-settings-v1
```

Settings include:

- Render quality
- Paint color and finish
- Track wetness
- Master volume and mute
- Steering sensitivity (`0.35`–`1`, default `0.72`)
- Steering assist
- Camera shake

Best lap key:

```text
hunger-apex-best-lap-v1
```

---

## Audio

All audio is synthesized with Web Audio; there are no external audio files.

- Layered engine oscillators with RPM/throttle filtering
- Tire noise
- Wind noise
- Countdown and UI beeps
- Collision impact bursts
- User-gesture audio unlock
- Master volume and mute

---

## Performance Work

- Instanced buildings, trees, grandstands, curbs, rails, posts, lamps, and other repeated geometry
- Merged static vehicle meshes
- Shared procedural materials
- Fixed 120 Hz physics with capped frame delta
- Cached track samples and hinted nearest-point searches
- Particle pooling
- Quality-dependent SSAO, bloom, FXAA, shadows, and pixel ratio
- Dynamic resolution adjustment
- Shader precompilation during loading
- Separate Three.js production chunk
- Production dependency audit previously reported zero vulnerabilities

---

## Testing

### Unit / Integration

Latest verified result: **23 tests passed** across 5 files.

Coverage includes:

- Closed-track sampling and seam wrapping
- Nearest-point projection and signed lateral offset
- Acceleration, braking, gear, and speed limiting
- Screen-correct left/right steering
- Steering sensitivity behavior
- Barrier containment and wrong-way recovery
- Checkpoint validation and reverse invalidation
- Three-lap race completion
- Race position and reset state
- Opponent pace, corner braking, and three-lap completion
- Autonomous three-lap drive using public controls

### Brave / Playwright

Latest verified result: **8 tests passed**.

Playwright always launches:

```text
/Applications/Brave Browser.app/Contents/MacOS/Brave Browser
```

Dedicated test port: `43821`

Coverage includes:

- Menu rendering and playable race smoke test
- HUD speed units and player camera framing
- Pause, camera, recovery, and return-to-menu flow
- Garage and Ultra graphics settings persistence
- Touch driving on a phone-sized landscape viewport
- Start-grid physical clearance and top-down layout verification
- Start gantry camera clearance
- Screen-relative D/A steering
- Player/AI forward alignment and travel direction
- Three-quarter sunset white-out regression

Browser tests use generous startup timeouts because shader compilation can be slow under heavy system load.

---

## Major Fixes Already Landed

- Corrected road shader uniform declarations
- Updated SSAO usage for Three.js r187
- Fixed double km/h conversion in the HUD
- Replaced the menu’s full orbit with a safe showcase sway
- Corrected swapped left/right yaw mapping
- Retuned steering and added a sensitivity slider
- Moved the starting grid behind the start line
- Fixed missing world translation in circuit/environment frame matrices
  - This had placed grandstands, curbs, rails, and lights near the world origin
- Extended AI from one lap to the full three-lap race
- Reduced the overly bright start point light
- Identified the three-quarter white-out as head-on sun alignment, not a point light
- Moved the sunset azimuth and added automatic glare exposure

---

## Key Files

```text
src/
  main.ts                       Bootstrap, error fallback, service-worker registration
  styles.css                    Responsive motorsport UI styling
  core/
    Game.ts                     Main loop, race flow, camera, settings, collisions, glare exposure
    Track.ts                    Circuit curve, samples, nearest-point lookup
    VehiclePhysics.ts           Player vehicle dynamics
    Opponent.ts                 AI speed targets and spline following
    RaceSession.ts              Checkpoints, laps, timing, position, results
    Input.ts                    Keyboard, gamepad, touch, UI input hooks
    Audio.ts                    Synthesized engine/tire/wind/UI audio
  game/
    types.ts                    Shared settings, telemetry, callbacks, constants
  render/
    materials.ts                Asphalt, grass, paint, and building shaders
    vehicle.ts                  Procedural supercar geometry and animation
    circuit.ts                  Road, curbs, rails, grid, gantry, trackside objects
    environment.ts              Sky, lights, city, mountains, grandstands, wet patches
    postprocessing.ts           HDR bloom, grade, FXAA, SSAO
    Particles.ts                Pooled smoke/dust/spark particles
  ui/
    UI.ts                       Menu, garage, settings, HUD, minimap, results

tests/
  *.test.ts                    Unit and integration tests
  browser/*.spec.ts            Brave end-to-end and regression tests

public/
  manifest.webmanifest         PWA metadata
  sw.js                        Offline cache
  favicon.svg                  Original HUNGER emblem

playwright.config.ts            Brave launch configuration
```

For diagnostics, the running game is exposed as `window.hungerGame`.

---

## Recommended Next Work

1. **AI fairness pass**
   - Add AI drag and corner-speed loss
   - Add two-way collision momentum response
   - Compare AI/player lap times automatically
   - Longer term: use the same physics model with pure-pursuit steering
2. **Optional nitro**
   - Rechargeable boost meter
   - Shift/gamepad/touch input
   - Acceleration and top-speed increase
   - Exhaust/flame visuals, FOV kick, audio, and HUD
3. **Content expansion**
   - More circuits and environments
   - Career/championship progression
   - Additional vehicles and customization
4. **Production realism**
   - Licensed or custom high-fidelity vehicle/track assets
   - More detailed damage, weather, and audio
5. **Native packaging**
   - Evaluate Tauri/Capacitor or another native shell if required
   - Current cross-platform delivery is browser/PWA
