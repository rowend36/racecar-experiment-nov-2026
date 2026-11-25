# VANTA GP — Engineering Handoff

## Project Snapshot

- **Location:** `/Users/fresh/Work/racecar/deepseek`
- **Stack:** TypeScript, Three.js 0.170.0, Vite 6, Playwright-core (dev smoke only)
- **Target:** Cross-platform browser / installable PWA
- **Scope:** Playable, cinematic 3D arcade-racing vertical slice, fully procedural assets
- **Race format:** 6 cars (1 player + 5 AI), 3 laps, 2.294 km circuit
- **Status:** Typecheck, production build, and headless Brave smoke test pass. **No Vitest/Playwright test suite exists yet.**
- **Latest validation:** `npm run smoke` → menu → countdown → racing, 6 cars, player around 292 km/h, HUD active, no console errors

This is not an Asphalt-scale commercial game. It is a strong driving-feel and presentation foundation. Cars, circuit, city, effects, textures and audio are original and procedural; no licensed assets are included. The high-speed steering feel was explicitly approved by the driver — **preserve it**.

Sibling folders (`muse/`, `hunger/`, `mimo/`) are other agents' work — do not touch. The git repo is at `racecar/` root; only work inside `deepseek/`.

---

## Run Commands

```bash
cd /Users/fresh/Work/racecar/deepseek
npm install
npm run dev
```

Development URL: `http://localhost:5173`

```bash
npm run build      # tsc --noEmit + Vite production build
npm run preview    # Serve dist/
npm run typecheck  # Strict TypeScript check only
npm run smoke      # Build + headless Brave smoke test (macOS)
```

`npm run smoke` launches the installed Brave build, never Playwright's bundled Chromium:

```text
/Applications/Brave Browser.app/Contents/MacOS/Brave Browser
```

It uses port `4173` (override with `SMOKE_PORT`) and `BRAVE_PATH` for a non-default Brave install. It starts the race with autopilot, waits five seconds, asserts state/cars/speed/HUD, and fails on console errors. The preview server is killed as a process group so no orphan Node server remains.

After changing cached production/PWA files, hard-refresh with **Cmd+Shift+R**. If serving `dist/`, rebuild first.

---

## Implemented Gameplay

- Three-lap race against five AI rivals; **6 cars total**
- Standing grid, player starts 5th (slot 4), countdown lights + 3-2-1-GO
- Fixed-step vehicle simulation at **120 Hz**, render frame delta clamped
- Signed-drive longitudinal model: throttle, brake, reverse, rolling resistance, aero/off-road drag
- Reverse capped at **13 m/s (~47 km/h)**; reverse HUD gear indicator `R`
- Speed-sensitive steering, handbrake drift, nitro, off-road grip loss
- Barrier collision with along-wall sliding, sparks, camera shake, impact audio
- Player/opponent circle collision with momentum exchange
- Wall escape works from curbs, run-off, and parallel/nose-in barrier contact
- Lap timing, best lap, positions, FINAL LAP callout, results with gaps / `+N LAP`
- Best-lap persistence; new-best badge
- Chase, hood, wide cameras; speed FOV; camera shake; aspect-aware FOV
- Sunset and Storm conditions; rain, wet-road response, lightning, thunder
- Pause/resume, restart, quit-to-menu, audio mute
- Keyboard, standard gamepad, multi-touch controls
- Adaptive resolution and quality presets
- Photo-style start showcase camera behind the menu

### Current Controls

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Accelerate | `W` / Up | A / RT | GAS |
| Brake / reverse | `S` / Down | B / LT | BRAKE |
| Steer | A/D or Left/Right | Left stick (axis 0) | Left/right buttons |
| Handbrake / drift | `Space` | X / square | DRIFT |
| Nitro | `Shift` | X / RB (button 2/5) | N₂O |
| Camera | `C` | Y (button 3) | — |
| Reset | `R` | Back (button 8) | — |
| Pause | `Esc` / `P` | Start (button 9) | HUD pause |
| Mute | `M` | — | Menu sound button |
| Start / restart | `Enter` | — | START RACE |

There is no steering-sensitivity UI yet. Low/high steering rates are hard-coded in `Vehicle.ts` — see the tuning values below before changing them.

---

## Vehicles and Handling

Three selectable cars (same procedural body, different stats, eight paint finishes):

| Car | Top speed | Accel | Grip | Brake | Nitro |
|---|---|---|---|---|---|
| VXR-01 | 91 m/s (~328 km/h) | 12.6 | 1.35 | 35 | 1.00 |
| PHANTOM X | 97 m/s (~349 km/h) | 11.9 | 1.22 | 32 | 1.12 |
| RS APEX | 87 m/s (~313 km/h) | 13.5 | 1.52 | 38 | 0.92 |

Speedometer display maxes at 340 km/h, so Phantom X can exceed the dial.

### Steering / longitudinal tuning — preserve unless retesting feel

```ts
// Longitudinal drive (Vehicle.update)
drive = clamp(throttle - brake, -1, 1)
// forward: engine accel; if reversing, adds 0.55 * brake as a strong service brake
// reverse: 7.6 m/s² on tarmac, 0.6× off-road; cap -13 m/s
// anti-creep ONLY when coasting:
if (Math.abs(vLong) < 0.25 && Math.abs(drive) < 0.02) vLong *= 0.85;

// Steering
inputResponse = lerp(16, 22, |vLong| / 28)        // input damping
steerResponse = lerp(17, 22, |vLong| / 28)        // steering-angle damping
maxSteer      = lerp(0.60, 0.20, speedFactor)
grip yaw cap  = 9.81 * grip * 1.42 / max(6, |vLong|)
yawResponse   = handbrake ? 4.2 : lerp(9.0, 11.5, |vLong| / 28)

// Arcade turn-in assist (beyond pure tyre grip)
assistGain = isPlayer ? 0.50 : 0.22
assist     = assistGain * clamp((|vLong| - 4) / 40, 0, 1) * sign(vLong)
yawTarget += -steerInput * assist

// Low-speed smoothing; disappears at racing speed
lowSpeedYawCap = clamp(1.55 + (|vLong| - 4) * 0.035, 1.55, 3.2)
yawTarget = clamp(yawTarget, -lowSpeedYawCap, lowSpeedYawCap)
```

Measured steering response in the current build:

- ~35–45 km/h: **~1.6–1.7 rad/s** peak
- ~60 km/h: **~1.3 rad/s**
- ~75 km/h: **~1.0 rad/s**
- 160+ km/h: **~0.88 rad/s** (the approved high-speed feel)

The player assist is deliberately stronger than the AI's (`0.50` vs `0.22`). Low-speed smoothing was raised after driver feedback; the previous values were either too janky or too heavy. Retest a low-speed slalom, a barrier scrape, and reverse-at-curb after touching any of these numbers.

### Important Regression Traps

1. **Never make anti-creep apply while reversing.**
   - The original line `if (vLong < threshold && throttle < 0.05) vLong *= 0.85` ran during reverse. Off-road reverse acceleration is lower, so the car got trapped at −0.11 m/s on curbs — while reverse at the start line worked. It must be gated on neutral drive.
2. **Never reintroduce whole-velocity wall scrub.**
   - Multiplying the full velocity by `0.82` every physics step at 120 Hz glued the car to barriers and prevented reversing away. Remove only the outward component; apply modest friction to the along-wall component (`friction = clamp(impact * 0.012, 0, 0.18)`).
3. **Do not re-project the old world velocity after applying engine forces.**
   - The local velocity must be rotated into the new heading after the forces are applied. Re-deriving `vLong/vLat` from the previous world velocity discards throttle/brake.
4. **Camera roll must use `camera.rotateZ(...)`, never overwrite Euler `rotation.z` after `lookAt`.**
   - A near-vertical pitch decomposition can flip the camera 180°. This was a real bug and made the world appear upside down.
5. **The chase camera tracks the car's translation explicitly.**
   - `smoothPos += carDelta` each frame, then damp only the relative offset. Otherwise the camera lags metres behind at 300 km/h and the car shrinks into the distance.
6. **Ridge seam vertices must match.**
   - The mountain-ring sine frequencies must be integers (`3, 7, 13`) or the last column's height differs from the first, leaving a 1-pixel bright seam in the sky.
7. **Instanced-mesh capacity must be `ceil` where loop counts are not exact.**
   - The barrier-post InstancedMesh previously allocated `floor` instances and drew one extra pair, causing GL_INVALID_OPERATION warnings.
8. **Wheel visuals:** spin is `rotation.x += speed/r*dt`; front steer is `rotation.y = -steer * 0.4` (the model faces +Z).
9. **Track UI must read 2.3 km**, not the earlier 2.1 km placeholder.

---

## Rendering and Art

- Original procedural hypercar
  - Lofted body, dark canopy, carbon splitter/skirts/diffuser/wing, mirrors, vents
  - Detailed wheels, rims, spokes, discs, calipers; steering and rolling animation
  - PBR clearcoat paint with iridescence, glass canopy, chrome exhausts
  - Emissive headlights, taillight bar, accent strips, underglow, contact shadow
  - Merged body geometry by material
- 2.294 km closed coastal circuit
  - Spline-sampled banked road, 1,200 samples, 17 m wide
  - Asphalt albedo/roughness/normal textures generated on canvas
  - White edge lines and dashed centerline, red/white curbs, run-off, neon barriers, posts
  - Checker start line, start gantry with banner and five countdown lights
- Sunset / storm procedural sky shader
  - Atmospheric gradient, sun disc/glow, drifting clouds, storm flash
  - PMREM-baked environment for PBR and glass
- Environment
  - Instanced lit-window city, aircraft beacons, palms, streetlights, grandstands, billboards
  - Distant mountain ridge, ocean plane, terrain height field following the circuit
- Lighting
  - Camera-following directional sun with PCF soft shadows (quality-scaled)
  - Hemisphere fill, cool directional fill, local point fill following the focus car
- Post-processing
  - HalfFloat HDR composer, UnrealBloom, custom ACES + grade pass, FXAA
  - Radial speed blur, chromatic aberration, vignette, film grain, storm flash
- Quality
  - Ultra: pixel cap 2, 2048 shadows
  - High: 1.5, 1536 shadows
  - Performance: 1.1, 1024 shadows
  - Adaptive render scale ~0.62–1.0 with hysteresis
  - Defaults: Ultra desktop, High on coarse pointers

### Coordinate Convention

- Vehicle forward is local **+Z**, world forward `(sin(yaw), 0, cos(yaw))`.
- Steering input **+1 = right**, which produces **negative yaw**. Increasing yaw turns left when facing +Z.
- `Track.right = tangent × up`; positive lateral is the car's right side.
- Front-wheel visual yaw is the **negated** steering input.
- Chassis basis: `x = cross(up, fwd)`, `y = surface normal`, `z = fwd`; banked corners use the track normal.
- Trackside objects use `basisAt()` and the surface point; do not skip the world position.

---

## AI and Race Session

- Five rivals use the **same `Vehicle` physics** as the player plus `AIDriver` (pure-pursuit steering, corner-speed preview, lane bias, avoidance, nitro, recovery).
- AI steering assist is lower (`0.22`) than the player's for stability.
- Rubber-banding is ±60 m distance based, pace clamps 0.94–1.07.
- AI think rate is 20 Hz; physics remains 120 Hz.
- Standing-grid slots 0–5; player slot 4; grid is behind the start line.
- Lap crossing increments `lap`; first crossing starts lap 1 timing; race ends when lap > 3.
- `progress = lap * length + s`; positions sorted with finished cars by finish time first.
- AI stability in regression runs: 15–21 s autopilot tests keep all cars on track, lateral within ±1.4 m.
- Results gaps show `+N LAP` when lapped, otherwise `+Xs`.

### Known AI Limitations

- The AI follows a clean line and never makes deliberate mistakes; it can feel metronomic over long runs.
- AI uses the same physics but gets a smaller turn-in assist; it is not a separate kinematic controller.
- No per-driver skill variance beyond fixed per-car skill values.
- Two-way collision momentum exists, but AI does not deliberately defend or attack.

Recommended follow-up: per-driver error injection, pace/lap-time telemetry comparison, and an optional difficulty selector.

---

## UI and Persistence

- Menu: brand, hero, car select, eight paints, weather, quality, sound, best lap, race start
- HUD: position, lap, lap time, best lap, minimap, speedometer + needle/arc, gear, nitro, drift bar, FPS, countdown, wrong-way
- Reverse shows **`R`** in the gear readout.
- Pause panel: resume, restart, main menu
- Results panel: position, total time, best lap, lap times, standings, gaps/`+N LAP`, new-best badge
- Mobile/landscape layouts with dedicated compact HUD and touch controls
- `prefers-reduced-motion` honored
- On coarse pointers, menu settings are hidden (mobile defaults to High quality); no in-race settings drawer yet.

### LocalStorage Keys

```text
vanta-gp-config-v1   { carId, color, accent, weather, quality }
vanta-gp-best-v1     best lap seconds (single circuit)
vanta-gp-muted       "1" / "0"
```

No steering, volume, camera-shake, or per-car best-lap persistence yet.

---

## Audio

All synthesized with Web Audio; **no external audio files**.

- Layered saw/square engine with RPM-tracking low-pass, distortion and LFO
- Band-passed tyre noise, low-pass wind, high-pass nitro, rain loop
- Impact/scrape bursts, countdown beeps, shift pop, thunder
- Scheduled 96 BPM synthwave score (bass, pad, arp, kick, snare, hats)
- User-gesture unlock; mute persists; no volume slider, no per-bus mixer UI

---

## Performance Work

- 120 Hz fixed-step physics decoupled from render
- AI think at 20 Hz; player physics 120 Hz
- Instanced city, palms, lights, posts, rocks, beacons
- Merged static car geometry and stand/roadside geometry
- Pooled smoke/spark/flame particles; ring-buffer skid marks
- Hinted nearest-track lookups; no per-frame allocation in the hot loop
- Adaptive internal resolution with hysteresis, quality presets
- Shader precompilation during loading
- Measured one race frame: ~270 draw calls, ~175k triangles (scene pass)
- Headless Brave on this M5: 200–500 fps at 1440×900 / 1280×720; mobile emulation ~140+ fps at DPR 2. Headless numbers are not a device guarantee.

---

## Testing

### Current

- `npm run typecheck` — clean
- `npm run build` — clean
- `npm run smoke` — Brave headless, build + preview, start race, autopilot, asserts 6 cars, speed > 30 km/h, HUD visible, no console errors
- Manual headless traces used during development for:
  - steering yaw rate at low/high speed
  - reverse escape distances from curb/run-off/barrier positions
  - AI/autopilot stability over 15–21 s
- Screenshot gallery in `screenshots/`:
  - `menu.png`, `countdown.png`, `race.png`, `storm.png`, `results.png`
  - `mobile-menu.png`, `mobile-race.png`, `mobile-pause.png`, `mobile-results.png`

**There is no unit or integration test suite.** The smoke test does not currently cover reverse, wall escape, steering sign, lap timing, or results.

### Recommended

1. **Vitest** unit/integration tests for:
   - Reverse from a stopped/curb/off-road state; throttle cancels reverse
   - Wall contact preserves tangential velocity; reverse escapes parallel/nose-in contact
   - Steering sign (right key produces screen-right) and high-speed assist retained
   - Lap crossing, lap times, positions, finish order, `+N LAP` gaps
   - Best-lap persistence and results
2. **Playwright in Brave** (`executablePath` required by project rules), similar to `hunger/`:
   - menu → race → pause/resume → restart → results
   - reverse at curb + barrier escape
   - touch controls and landscape HUD
   - no console/WebGL errors
3. Add a steering-sensitivity slider (persisted) if drivers want to tune the low-speed feel without code changes.

Use generous startup timeouts: shader compilation under SwiftShader/Metal headless can be slow.

---

## Major Fixes Already Landed

- Fixed longitudinal force being discarded by re-projecting the old world velocity
- Fixed camera 180° roll from writing Euler `rotation.z` after `lookAt`
- Fixed chase-camera speed lag with car-translation feed-forward
- Fixed AI high-speed slalom/wall-sticking; stable pure-pursuit + corner-speed preview
- Fixed InstancedMesh post-buffer overflow (`floor` → `ceil`)
- Fixed mountain-ring sky seam by using integer frequencies and matching end vertices
- Fixed reverse being trapped by anti-creep damping on curbs (`throttle < 0.05` guard)
- Fixed barrier whole-velocity scrub that glued the car and blocked reverse
- Raised/adjusted steering response; added player-specific high-speed turn-in assist
- Restored low-speed steering authority after a too-conservative yaw cap
- Fixed wheel spin direction and front-wheel visual steer sign
- Made brake lights actually brighten under braking
- Added `R` reverse gear indication and sane reverse RPM
- Fixed lap-progress bookkeeping at the line and results gap text
- Fixed delayed menu reappearing over a fast race start
- Fixed instanced post/build warnings, ridge seam, and track length label (2.3 km)
- Tuned sunset exposure, bloom, wet-road specular, car fill light, asphalt texture and shadows
- Added mobile/landscape compact HUD, touch controls, short-screen overlays
- Added auto-pause when the tab is hidden

---

## Key Files

```text
src/
  main.ts                 Bootstrap, loading, UI→game wiring, loop, visibility pause
  style.css               Menu/HUD/results/touch design system + responsive rules
  core/
    Engine.ts             WebGL2 renderer, HDR composer, bloom, grade, FXAA, adaptive res
    Input.ts              Keyboard, gamepad, multi-touch, actions
    Audio.ts              Synthesized engine/tyres/wind/nitro/rain/impacts/music
    Textures.ts           Procedural asphalt, terrain, carbon, windows, sprites, signs
    Math.ts               clamp/lerp/damp, PRNG, formatting
  world/
    Track.ts              Spline, samples, banking, road/curbs/run-off/walls/markings, terrain
    Scenery.ts            City, ridge, palms, lights, stands, billboards, gantry, start lights
    Sky.ts                Custom sky shader, PMREM environment, sunset/storm palettes
  vehicle/
    CarModel.ts           Procedural car mesh, wheels, lights, contact shadow, disposal
    Vehicle.ts           120 Hz physics, reverse, steering, drift, collisions; AIDriver
  game/
    Race.ts               Race flow, grid, laps, positions, weather, pause, results
    CameraRig.ts          Chase/hood/wide/showcase, translation tracking, FOV, shake
    Effects.ts            Smoke, sparks, flames, rain, skid marks
    HUD.ts                Speedo, minimap, timer, countdown, messages, reverse gear
  ui/
    UI.ts                 Menu, car/paint/settings, pause/results, persistence, loading
index.html                Menu/HUD/overlay markup, SVG speedometer
public/manifest.webmanifest, icon.svg
scripts/smoke.mjs         Brave headless smoke test
screenshots/              Final visual gallery
```

For diagnostics, the running game is exposed as `window.__vanta`:

```ts
{ game: RaceGame, engine: Engine, ui: UI, audio: AudioSystem, input: Input }
```

Useful for tests: `window.__vanta.ui.onStart()`, `game.state`, `game.player.speed`, `game.cars`, `game.debugAutopilot = true`, `game.track.length`, `game.finishPlayer()`, `engine.fps`.

---

## Known Issues / Gaps

- **Steering feel is the most sensitive area.** High-speed assist is approved; low-speed was tuned after feedback. Do not casually change `assistGain`, `lowSpeedYawCap`, or the response ramps.
- Reverse is intentionally blocked when the **rear bumper** is against a barrier (you cannot push through geometry); nose-in/parallel reverse now escapes. If a player reports "stuck", first inspect whether the rear is against the wall.
- Camera has no wall/terrain collision and can clip scenery in extreme positions.
- Storm is visual/audio only; grip is not reduced in rain.
- AI has no deliberate mistakes, defense, or per-driver skill variation.
- Only one circuit, one race mode, no championship/career, no damage, no online multiplayer.
- No service worker/offline caching; PWA manifest exists but the app is online-only.
- Mobile settings are hidden; quality defaults to High on coarse pointers.
- Gamepad trigger axes are read from both buttons and axes 4/5; some non-standard pads can report phantom trigger values. Buttons 6/7 are the reliable path if this is reported.
- No native wrappers are bundled; the current delivery is browser/PWA. Wrap `dist/` with Tauri, Electron, or Capacitor if store builds are needed.
- No unit/CI tests. Smoke is the only automated check.
- All art is procedural and stylized-realistic, not photoreal. A scanned asset/HDRI pipeline and WebGPU are the path to higher fidelity.

---

## Recommended Next Work

1. **Lock the feel with tests**
   - Vitest: reverse/curb escape, wall tangential response, steering sign, high-speed yaw, lap timing, results gaps.
   - Playwright in Brave: menu→race→pause→results, reverse at curb, touch HUD, no console errors.
2. **Driver-facing steering sensitivity**
   - Persisted setting that scales low-speed yaw cap and input response without touching the approved high-speed assist.
   - Potentially expose AI difficulty in the same panel.
3. **AI fairness and variety**
   - Per-driver pace/error injection, collision loss, occasional wide lines, defensive lane choice.
   - Add AI/player lap-time telemetry comparison.
4. **Content**
   - Additional circuits, reverse layouts, time trial/ghost, championship, more cars/paints.
5. **Production realism**
   - GLTF/scanned vehicles, HDRIs, high-resolution surface detail, animated crowds, damage, proper wet-weather grip.
6. **Packaging**
   - Service worker for offline/PWA store readiness.
   - Tauri/Capacitor/Electron wrapper and native input/audio review.
7. **Polish**
   - Camera wall avoidance, rain-on-windshield effects, per-car best laps, volume mixer, accessibility remapping, mobile settings drawer.
