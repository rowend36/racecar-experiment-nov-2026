# MUSE Apex Protocol — Engineering Handoff

## Project Snapshot

- **Location:** `/Users/fresh/Work/racecar/muse`
- **Stack:** TypeScript, Three.js 0.170.0, Vite 6 (no test framework yet)
- **Target:** Cross-platform browser / installable PWA
- **Scope:** Playable, stylish 3D arcade-racing vertical slice with fully procedural assets
- **Race format:** 4 cars (1 player + 3 AI), 3 laps, ~1.69 km coastal circuit
- **Status:** Production build, type checking, and manual preview verified. **No automated tests exist yet.**

This is not yet an Asphalt-scale commercial game. It is a strong driving-feel and presentation foundation. Cars, track, city, and effects are procedural and original; no licensed assets are included. Per driver feedback, **steering/controls are this build's edge — preserve the feel.**

---

## Run Commands

```bash
cd /Users/fresh/Work/racecar/muse
npm install
npm run dev
```

Development URL: `http://localhost:5173`

```bash
npm run build      # tsc + production Vite build
npm run preview    # Serve the production build
npm run typecheck  # Strict TypeScript check only
```

Git repo lives at `racecar/` root (`main`); only `muse/` + root `.gitignore` are tracked. Sibling folders (`deepseek/`, `hunger/`, `mimo/`) are other agents' work — do not touch.

---

## Implemented Gameplay

- Three-lap race against three AI rivals
- Standing grid: 2 columns staggered ~12/23 samples behind the start line
- Fixed-step arcade simulation at 120 Hz (capped frame delta)
- Acceleration, braking, reverse, drag + rolling resistance
- Speed-sensitive steering with smoothed input
- Drift model: brake + steer at speed breaks traction, widens steering, charges nitro faster
- Nitro: Shift/Shift-equivalent, drains 28/s, regens 4.5/s (9/s while drifting), FOV kick + bloom swell
- Soft wall constraint with scrape slowdown (no hard bounce)
- Start-line crossing detection with forward-motion gating; reversing back over the line undoes the count
- Positions from continuous unwrapped distance (immune to start-line index wrap)
- Wrong-way indicator, drift indicator, live minimap, FPS meter
- `R` resets onto the track centerline **without** losing laps/progress
- Chase, hood, and cinematic cameras (`C`), speed-reactive FOV
- Countdown (3-2-1-GO), results screen with total time + top speed
- Touch, keyboard, and standard gamepad driving (touch gets 0.65 auto-gas)

### Current Controls

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Accelerate | `W` / Up | A / RT | GAS (auto-gas when idle) |
| Brake / reverse | `S` / Down | B / LT | BRAKE |
| Steer | A/D or Left/Right | Left stick | Left/right buttons |
| Nitro | `Shift` | X / RB | N₂O |
| Drift/Brake | `Space` (handbrake) | — | BRAKE |
| Camera | `C` | — | — |
| Reset | `R` | — | — |
| Start race | `Enter` | — | START RACE button |

Mute and quality are menu buttons only (no hotkeys). **There is no pause, no garage, no settings persistence, no best-lap/lap-time tracking, no vehicle-vehicle collision, and no offroad/grass slowdown model.**

### Car Roster (`vehicles/Car.ts`)

| Car | Top speed | Accel | Grip | Nitro boost |
|---|---|---|---|---|
| VOLT GT-R | ~295 km/h | 34 | 1.00 | +26 |
| CRIMSON X | ~310 km/h | 31 | 0.94 | +30 |
| AURUM S | ~288 km/h | 37 | 1.06 | +24 |

---

## Rendering and Art

- Procedural supercars: extruded silhouette body, glass canopy, carbon splitter/wing, headlight/taillight bars, underglow point light, headlight spot beams, spinning + visually steering wheels
- PBR car paint: metalness + clearcoat + procedural flake via `onBeforeCompile`
- Closed coastal GP circuit (~1.69 km, elevation, corners widen road up to +35%)
  - Procedural asphalt texture, center dashes, red/white curbs, dark walls with cyan neon top strips
  - Checkered start line, start gantry with banner (8 m overhead — intentional, not an obstacle)
- Sunset `Sky` + PMREM-baked image-based lighting, ACES tone mapping
- Camera-following directional sun (2048px PCF soft shadows), hemisphere fill, exp fog
- Instanced city towers, palms, floodlights (with real point lights every 4th), mountains, ocean plane
- Post: EffectComposer → bloom → custom grade (vignette/grain/chromatic aberration/speed darkening) → OutputPass
- Quality toggle: ULTRA (full bloom + shadows) vs PERFORMANCE (reduced bloom, shadows off) + adaptive resolution 0.55–1.0× to hold 60 fps

### Important Coordinate Convention

- Vehicle forward is local **+Z**: `fwd = (sin(dir), 0, cos(dir))`.
- Steering input `+1` = screen-right = **decreasing** yaw (`dir -= …`). Increasing yaw turns toward +X, which reads as screen-LEFT from the chase camera.
- The chase camera sits behind the car looking along +Z, so screen-right is world −X when facing +Z.
- Driver screen-right vector ≈ `(-forward.z, 0, forward.x)`; this equals `Track.frameAt().side`.
- Front-wheel visual yaw and body roll use the negated sign accordingly (`Car.ts`).

An earlier build had this backwards (controls felt "flipped"). **Preserve the current signs.**

### Scenery Placement Rule (learned the hard way)

Nothing gameplay-blocking may sit on the road surface. Billboards live at `width/2 + 16` alternating sides and face the track; palms at `width/2 + 10` minimum with slim canopies. An earlier revision parked 12 billboards directly over the centerline — do not regress this.

---

## AI and Race Session

- Rivals share the **same physics model** as the player (unlike hunger, where AI is kinematic) with a target-speed spline-following controller.
- Corner speed from lookahead curvature; rubber-banding on unwrapped distance (±60 index units); lane offsets ±5 with organic wobble; nitro on straights.
- Difficulty: base 0.55 + 0.08 per grid slot.
- Countdown holds all cars; AI inputs zeroed until GO.

### Known AI Issue

Rivals can feel metronomic — they follow the line with no mistakes and no lateral-momentum penalty. Recommended follow-up: per-driver error injection (occasional wide lines, delayed nitro), and two-way collision response if car-car collision is ever added.

---

## UI

- Menu: title, 3-car select chips, RACE / QUALITY / SOUND buttons, control hints
- HUD: LAP / POS / TIME pills, big speed readout, nitro bar + label, DRIFT + WRONG WAY indicators, live minimap, FPS meter, center countdown/message flashes
- Touch controls (shown on coarse pointers), results screen (position headline, time, top speed)
- No persisted settings, no garage tuning, no accessibility pass yet.

---

## Audio

All audio is synthesized with Web Audio; no external files.

- Dual-oscillator engine (saw + square through RPM-tracking lowpass)
- Band-passed noise for skid, high-passed noise swell for nitro
- Countdown/UI beeps, user-gesture unlock, menu mute toggle

---

## Performance Work

- Instanced city/palms/floodlights/dashes; pooled vectors (no per-frame allocation in hot paths)
- Fixed 120 Hz physics decoupled from render rate
- Hinted windowed nearest-track search (±30 samples)
- Adaptive internal resolution + Ultra/Performance preset
- Single 579 kB JS bundle (151 kB gzip)

---

## Testing

**Status: no automated tests.** Verified by `typecheck` + `build` + served-preview smoke test (HTTP 200).

Recommended (hunger proves the pattern works):

1. Vitest unit tests: lap counting across the wrap, position ordering, steering-sign regression (right key → screen-right), reset preserves laps.
2. Playwright smoke on **Brave** (`/Applications/Brave Browser.app/Contents/MacOS/Brave Browser` via `executablePath`, port-pinned preview server) — menu renders, race starts, canvas produces frames, D/A steer screen-correctly.

---

## Major Fixes Already Landed

- Corrected inverted steering sign (right key turned left from chase cam); matched AI, wheel visuals, body roll
- Moved 12 billboard boxes off the road surface (were parked over the centerline); pulled palms back
- Rewrote lap/position logic: old checkpoint scheme updated its reference every frame so `lap++` could never fire and positions flipped at the start line — replaced with crossing detection + unwrapped distance

---

## Key Files

```text
src/
  main.ts                       Bootstrap, canvas, Game entry
  style.css                     Menu/HUD/touch styling
  core/
    Engine.ts                   HDR renderer, ACES, shadows, adaptive resolution
    Input.ts                    Keyboard + touch + gamepad, smoothed steer
    Audio.ts                    Synth engine/skid/nitro/UI
  graphics/
    Materials.ts                Car paint, asphalt, curbs, glow, glass, lights
    Sky.ts                      Sunset sky, sun light, PMREM environment
    PostFX.ts                   Bloom + cinematic grade composer
  world/
    Track.ts                    Spline circuit, road/curb/wall/gantry geometry, nearest-index query
    Environment.ts              Ground, ocean, mountains, city, palms, floodlights
  vehicles/
    Car.ts                      Procedural supercar mesh + animation (specs: CAR_SPECS)
    Physics.ts                  120 Hz arcade physics, drift, nitro, laps, wrong-way
    AI.ts                       Spline follower, rubber-band, lanes, nitro
  game/
    Game.ts                     Race flow, countdown, cameras, HUD wiring, finish
    HUD.ts                      Menu/HUD/results DOM
    Minimap.ts                  Pre-rendered circuit map + dots

index.html / vite.config.ts / tsconfig.json / public/manifest.webmanifest
```

No diagnostics hook exists yet — recommend exposing the game as `window.museGame` (hunger does `window.hungerGame`) for Playwright assertions.

---

## Recommended Next Work

1. **Clearance discipline:** `ROAD_HALF` constant + explicit margins (buildings +34, trees +21, props +13) verified against `nearest()`; push city exclusion wider where the map allows.
2. **Track lookup upgrade:** segment-projected `nearest()` with global fallback + arc-length `sampleAt()` (hunger's approach) for stabler wall behavior and respawns.
3. **Race depth:** lap times, best lap (+ persistence), FINAL LAP callout, position-gap readout.
4. **Tests:** vitest suite + Brave Playwright smoke (see Testing).
5. **Feel:** banked corners, car-car collision, offroad slowdown, pause menu, settings persistence.
6. **Packaging:** evaluate Tauri/Capacitor if a native/Steam/mobile-store shell is required; current delivery is browser/PWA.
