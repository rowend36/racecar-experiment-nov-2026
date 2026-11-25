# MIMO VELOCITY — Engineering Handoff

## Project Snapshot

- **Location:** `/Users/fresh/Work/racecar/mimo`
- **Stack:** Vanilla JavaScript (ES2022), custom WebGL2 engine, Web Audio API — **zero dependencies, zero build step**
- **Target:** Cross-platform desktop browser (double-click `index.html` over `file://`, or any static server)
- **Scope:** Playable, polished 3D arcade racer with fully original procedural assets
- **Race format:** 6 cars (player + 5 AI), 3 laps, approximately 1.39 km circuit
- **Status:** Playwright/Brave end-to-end suite passes with 0 console errors at ~60 FPS; geometry and placement audits report 0 defects

This is not an Asphalt-scale commercial game. It is a strong technical and gameplay foundation: every mesh, texture, shader, sound, and UI element is generated at runtime — no licensed vehicle, environment, or audio assets are included, and there are no third-party runtime libraries at all.

---

## Run Commands

No install, no build, no server required:

```bash
open /Users/fresh/Work/racecar/mimo/index.html      # macOS
# or any static server:
cd /Users/fresh/Work/racecar/mimo && python3 -m http.server
```

Development diagnostics are exposed on `window.MIMO_GAME` (game state, cars, track, renderer).

### Verification harness (dev-only)

```bash
cd mimo/tests
npm install                     # installs playwright-core only
node final_check.js             # 14-point end-to-end regression suite (Brave)
node winding.js                 # mesh winding + building-clearance audit
node capture.js                 # token-stamped canvas screenshots -> ./out/
```

All browser tests launch Brave at `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser` (never Playwright's Chromium). Screenshots are tagged with a colored token bar so a stale image read can always be identified; `png_probe.js` reads raw PNG pixels for tool-independent verification.

---

## Implemented Gameplay

- Three-lap race against five opponents on a standing grid staggered behind the start line
- Fixed-step vehicle simulation at 120 Hz (accumulator, capped substeps)
- Torque-curve acceleration, 6-gear RPM simulation, braking, reverse, rolling resistance, aerodynamic drag with natural top-speed equilibrium
- Speed-sensitive steering with slip-angle self-aligning torque (stable high-speed corners, natural oversteer)
- Handbrake drifting with reduced lateral grip; **drifting refills nitro**
- Nitro boost: extra acceleration, +16% top speed, FOV kick, exhaust flames, speed streaks, HUD drain/refill
- Off-track grip/speed penalty, wall scraping with bounce impulse, sparks, camera shake, impact audio
- Car-to-car collision response with separation, impulse exchange, and spark bursts
- Robust lap/position logic using **cumulative arc distance** (wrap-safe, reverse-safe, independent of wrong-way flags)
- Race position, current lap, lap time, best lap, splits, and results with time gaps
- Wrong-way indicator, FINAL LAP and LAP messages, `R` recovery, stuck/wrong-way AI auto-respawn
- Chase, far-chase, and hood cameras with shake, speed vibration, and speed-scaled FOV
- Countdown, pause/resume, restart, and return-to-menu flows
- Garage with six cars and stat bars; quality, resolution-scale, FOV, and audio settings

### Current Controls

| Action | Keyboard | Gamepad |
|---|---|---|
| Accelerate | `W` / Up | RT |
| Brake / reverse | `S` / Down | LT |
| Steer | A/D or Left/Right | Left stick |
| Nitro | Shift | A |
| Handbrake / drift | Space | B |
| Camera | C | — |
| Recover | R | — |
| Pause | Esc | — |
| Mute | M | — |

There are currently **no touch controls**; gamepad code is present and standard-mapped but was not verifiable in the headless test environment.

---

## Rendering and Art

Custom WebGL2 engine written for this project (no Three.js, no wrappers):

- **Forward+ style pipeline with MRT G-buffer-lite**: attachment0 = HDR color (RGBA16F), attachment1 = world normal + roughness (drives SSR and soft particles), depth texture
- **PBR**: Cook-Torrance GGX, Smith-G1, Schlick fresnel, split-sum environment BRDF approximation
- **Image-based lighting**: procedural HDR sky rendered to a cubemap at boot, mip chain for roughness, plus a cosine-weighted irradiance convolution pass
- **Clearcoat car paint** with procedural metallic flake sparkle and per-car paint uniform
- **Cascaded shadow maps**: 2 cascades, texel-snapped ortho fitting, 3×3 PCF, polygon-offset depth pass
- **Screen-space reflections** on wet asphalt and car bodies (ray march + binary refine against the depth buffer, roughness-masked)
- **Soft particles** via a depth blit into the particle framebuffer
- **Post chain**: 6-level progressive bloom + anamorphic horizontal streak → radial motion blur → ACES tonemap → color grade (lift/gain/saturation/split-tone) → vignette, film grain, radial chromatic aberration, nitro/speed streak lines → FXAA
- **Fully procedural assets**:
  - Lofted supercar body from cross-section stations (paint/glass/trim/tire/rim/headlight/taillight materials baked per-face), detailed wheels with recessed rims
  - Circuit ribbon with banking, kerbs, W-beam guardrails with posts, terrain shell that meets the road edge exactly, start gantry with banner, cones, street lamps with ground light pools
  - Tileable asphalt albedo/normal, concrete, kerb, and a particle sprite atlas — all synthesized on canvas
  - Night city: instanced towers with procedural lit windows and neon strips, stars, clouds, exponential fog with sun tint
- **Headlights**: up to six dynamic spotlights (player + nearest rivals) with wet-road specular streaks
- **Quality presets** Ultra/High/Medium/Low (SSR, bloom, resolution scale) plus FPS-driven adaptive resolution (0.55–1.0) and DPR cap of 2

### Important Coordinate Convention

These conventions caused several regressions during development. Preserve them:

- Vehicle forward is local **+Z**; world yaw uses `fwd = (sin(yaw), 0, cos(yaw))`.
- Positive screen-right steering input must produce **negative yaw** (`steer +1` = right ⇒ `desiredYaw = -steer * k`).
- Lateral right basis is `right = cross(forward, up) = (-fwd.z, 0, fwd.x)`; positive track `lat` is the right side.
- `quat.fromYawPitchRoll` must compose **Ry(yaw)·Rx(pitch)·Rz(roll)** — an earlier version applied yaw about Z and rolled every car into the ground.
- Track arc-length → sample index must use the **binary search over real `u` values** (`Track.indexAt`); assuming uniform spacing (`s / (L/N)`) silently offset every lookup on an uneven spline.

---

## AI and Race Session

- AI uses the **same vehicle physics as the player** with a pure-pursuit steering controller (`-wrapPi(targetYaw - yaw) * 2.4`), so it drifts, scrubs speed, and collides like a real car.
- Speed target from `lineSpeed[]`: per-sample `sqrt(13.5 / curvature)` capped at 92 m/s, forward-smoothed with a braking-distance window, scaled by per-driver skill (0.955–0.995).
- Behaviors: racing-line offset, lateral avoidance of nearby cars, wall repulsion, subtle rubber-band, nitro on straights with cooldown, stuck (>3.5 s) and wrong-way (>2.5 s) respawns.
- Progress/rank uses cumulative signed arc distance (`totalDist`), initialized at `s - L` so the grid start is negative; laps are `floor(totalDist / L)` — this replaced fragile start-line crossing detection that mis-counted under the wrong-way flag and while reversing.
- Race session: countdown locks throttle, positions recomputed each frame, results sort finished cars by finish time and others by progress gap at 42 m/s.

### Known Limitations

- AI is competitive but not perfect: it can over-defend a line under sustained avoidance switching, and it never makes deliberate mistakes (rubber-band is subtle: ±4.5%).
- No draft/slipstream system and no damage model.
- Results gaps for unfinished cars are estimated, not measured finish times.

---

## UI and Settings

- Neon night-race identity: dark glass panels, cyan/magenta accents, italic display type
- Canvas speedometer (RPM arc with redline flash, needle, digital km/h), gear box, nitro bar, position/lap/timing stack, live minimap with per-car dots
- Title, Garage (six cars with stat bars), Settings, Controls, Pause, and Results overlays
- Countdown / GO / FINAL LAP / WRONG WAY center messages with pop animation
- Responsive scaling for smaller viewports (speedo and minimap downscale under 760 px)

### Persisted Settings

**None yet.** Quality, FOV, volume, and selected car reset on reload. Adding LocalStorage persistence (as hunger did) is recommended next work.

---

## Audio

All audio is synthesized with Web Audio; there are no audio files.

- Layered engine (detuned saw/square/sine through waveshaper + lowpass) driven by the RPM simulation, with supercharger whine
- Tire screech (bandpass noise keyed to slip), wind/road noise keyed to speed
- Nitro hiss, collision impacts (pitch-dropping sine + filtered noise burst), gear-shift clicks
- Countdown beeps, start sting, UI clicks; user-gesture audio unlock
- Procedural synthwave music sequencer (124 BPM bass/chords/arp/hats/kick) with music/SFX volume controls and mute

---

## Performance Work

- ~60 draw calls/frame: merged static geometry (road, kerbs, rails, terrain, lamps, cones baked into single meshes), instanced buildings, one shared mesh + per-car uniforms for all six cars
- Fixed 120 Hz physics with capped substeps; no per-frame allocation in hot paths (SoA particle pool, reused matrices, cached uniforms)
- Binary-search track localization with hint-based fast path
- Quality-dependent SSR/bloom/resolution; adaptive render scale measured on a smoothed frame-time average
- Half-float HDR only where needed; shadow maps 2048/1024
- Verified: **~56–60 FPS headless** at 1280×720 on Apple M5 (Metal ANGLE), exposure stats sane (avg ~60/255, <1% blown pixels)

---

## Testing

All verification ran through Playwright driving Brave. The harness originally lived in a session temp directory; the valuable scripts are now committed under `tests/` (see Run Commands).

### Latest verified results

- **`final_check.js`: 14/14 PASS, 0 console errors**
  - boot → menu, FPS ≥ 30 (60 measured), quality/resolution settings applied, garage car selection, countdown → racing, driving/camera/respawn, Escape pause, resume, nitro drain, mid-race position ordering `123456`, results overlay (6 rows), race-again → countdown, quit → menu, exposure sanity
- **`winding.js`: 0 inverted triangles** — car body 0/444, wheel 0/198 (per-triangle outward-normal audit), **building-to-track clearance 26.2 m minimum** across all 120 buildings
- **AI race watch**: five AI complete consecutive laps (~33 s each) with stable ordering and no wall wedges
- Visual captures verified via token bars and raw PNG pixel probes (the image-read path intermittently served stale frames during development — always confirm a screenshot by its token or `png_probe.js`)

---

## Major Fixes Already Landed

- **Shader bring-up**: `sampler2DShadow` precision qualifiers; int/float mix in the streak shader; vec3/vec4 array uniform setters (`uniform3fv/4fv`); `uUseTex` float vs int
- **Instancing stride bug** (64 → 16 bytes per instance column) that collapsed building draws
- **MRT discipline**: SSR runs before particles, merge passes restrict `drawBuffers` to attachment 0 so the normal/roughness buffer is never corrupted
- **Specular white-out**: replaced the Smith term that degraded to `1/NoV²` at grazing angles with the G1-product form plus a specular clamp; raised bloom threshold
- **`fromYawPitchRoll` axis swap** — yaw was rotating about Z, so every car rendered rolled into the ground (the "flat sled" bug)
- **AI steering sign inversion** and negative-index wraps (`-1 % N` in JS) that wedged opponents into barriers
- **Circuit redesign**: the original control points doubled back 150° across the start/finish line, which broke lap detection and made AI spin out
- **Lap logic rewrite** to cumulative arc distance; **arc-length LUT** for all `s`-based lookups
- **Terrain occlusion**: flat ground plane sat above road dips (buried the grid) and the shell extrapolated road bank across its full width — rebuilt with edge-height falloff converging below the base plane
- **Car materials**: glass/trim/tires were baked white (shared-mesh paint); introduced a material color table with `uPaint` override, darkened glass, tuned clearcoat
- **Backface culling**: the body loft was wound inside-out (356/444 triangles) and the wheel recess was inverted — fixed and locked in with the `winding.js` audit
- **Buildings on track**: the distant skyline ring had no clearance test (a 53×55 m tower sat at 0 m clearance) — all placement now routed through `tryPlace`
- **Sweep clearances**: start-gate pillars and apex cones moved outside the car's swept path
- **Tuning passes**: horizon/cloud emissive levels, wet-road ambient boost, headlight spot intensity, camera framing, flake sparkle density

---

## Key Files

```text
index.html                     DOM shell: canvas, HUD, all overlays, script order
css/style.css                  Neon UI, HUD, overlays, responsive rules
js/
  util.js                      Math (vec3/quat/mat4), Catmull-Rom spline, RNG, helpers
  glcore.js                    WebGL2 core: programs, meshes, instancing, FBOs, shadow FBOs
  shaders.js                   All GLSL: PBR/road/car/building/sky, SSR, bloom, post chain
  textures.js                  Canvas texture synthesis (asphalt, concrete, kerb, atlas)
  geometry.js                  Mesh builders: car loft, wheels, road, terrain, rails, props
  track.js                     Circuit control points, banking, racing line, props, minimap
  sky.js                       Environment constants + HDR cubemap/irradiance build
  vehicle.js                   Vehicle physics, car catalogue, lap/progress logic
  ai.js                        Pure-pursuit AI controller
  particles.js                 SoA billboard particle pool (smoke/spark/flame/streak)
  audio.js                     Web Audio synthesis + music sequencer
  input.js                     Keyboard + gamepad
  hud.js                       Speedo, minimap, messages, menus, results
  renderer.js                  Frame orchestration: cascades, MRT scene, SSR, post chain
  game.js                      State machine, camera, race flow, quality, glue
  main.js                      Bootstrap, loading stages, main loop
tests/
  final_check.js               14-point Brave end-to-end regression suite
  winding.js                   Triangle-winding + building-clearance audit
  capture.js                   Token-stamped canvas screenshots
  png_probe.js                 Raw PNG pixel reader (tool-independent verification)
  ascii.js                     PNG → ASCII luminance grid for text-based image checks
handoff.md                     This document
```

---

## Recommended Next Work

1. **Promote the harness in-repo**
   - Add `playwright.config.ts` (Brave executable path, generous shader-compile timeouts) and port the remaining probes (AI lap watch, token captures) as specs
   - Add a lint/format pass; the codebase has no tooling beyond `node --check`
2. **Settings persistence** — LocalStorage for quality/FOV/volumes/selected car (mirror hunger's pattern)
3. **Touch controls** — the game runs on phones but currently has no touch driving UI
4. **Content expansion** — more circuits and environments, skid-mark decals painted to a track-space canvas, damage/scratch effects, championship progression
5. **Hardware verification pass** — confirm audio output, gamepad mapping, and non-headless FPS on real machines; the headless environment could not exercise them
6. **Optional realism upgrades** — slipstream, dynamic weather/wetness variation, time-of-day presets, light-trail history buffer for true per-object motion blur
