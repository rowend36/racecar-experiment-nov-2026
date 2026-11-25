# APEX VELOCITY v2

Informed-best 3D arcade racer: built with full read access to four prior attempts
at this prompt (`deepseek/`, `hunger/`, `mimo/`, `muse/`), keeping what each
proved and dropping what each got wrong.

**Stack:** TypeScript + Three.js 0.170 + Vite 6. Browser/PWA delivery, zero
binary assets — everything procedural. Wrap `dist/` with Tauri/Electron/
Capacitor for store shells.

## Run

```bash
cd muse-v2
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run smoke    # build + headless Brave autopilot check
npm test         # 22 vitest tests
```

## Controls

`WASD`/arrows drive · `SHIFT` nitro · `SPACE` drift · `C` camera · `R` reset ·
`ESC` pause · `M` mute · `ENTER` start. Gamepad + touch supported.

## What was taken from each sibling

- **deepseek (VANTA GP)** — vehicle physics + AI ported ~verbatim: signed-drive
  longitudinal model, reverse cap 13 m/s, anti-creep gated on neutral drive,
  outward-only wall response, assist 0.50/0.22, low-speed yaw cap, pure-pursuit
  AI with corner preview + rubber-banding, track query API
  (`frameAt`/`nearest`/`gridSlot`), camera feed-forward + `rotateZ` roll.
- **hunger (APEX)** — engineering discipline: vitest suite from day one,
  headless Brave smoke on the same executable path, pause/resume/restart,
  persisted settings + best lap, explicit scenery clearance margins.
- **muse (Apex Protocol)** — scope discipline: 4 cars / 3 laps, fixed 120 Hz
  sim, adaptive resolution, minimal menu→race→results flow.
- **mimo (VELOCITY)** — car-design ambition (lofted procedural body, canopy,
  aero, lit wheels) without the hand-rolled-WebGL risk; Three.js keeps the
  backface-culling class of bug impossible.

## Bugs pre-empted (each bitten by a sibling)

Steering sign (right = negative yaw, tested), billboards/grandstands on the
road (clearance-validated placement), lap counter that can't count
(crossing + unwinding, tested), wall glue (tangential preserved, tested),
reverse trapped by anti-creep (tested), camera 180° roll, instanced capacity
overflow, ridge seam mismatch, whole-velocity scrub.

## Found by its own tests

Final-lap time was dropped by the `lap <= LAPS` record guard — caught by the
headless full-race test, fixed so all 3 lap times record.

## Files

`src/core/` math/input/audio/textures · `src/world/` track + environment ·
`src/vehicle/` car model + physics/AI · `src/game/` engine/camera/effects/race ·
`src/ui/` menu+HUD+results · `tests/` 4 files · `scripts/` smoke + screenshots.
Diagnostics: `window.__apex`.
