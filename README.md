# 4 Agents, 1 Prompt — How Far AI Got in 2026

One evening. One task. Four AI agents, each in its own folder, racing the clock.

## The Original Prompt

> *I want to make a professional 3D racing game like Asphalt — ultra-realistic,
> professional shaders, etc. Build in any language of your choice but
> cross-platform. Highest optimal performance.*

Same prompt, four folders (`deepseek/`, `hunger/`, `mimo/`, `muse/`), zero human
code. Everything below is read straight out of the opencode session database —
message counts, active minutes, wall-clock spans — plus the actual source trees.

## The Scoreboard

Active minutes = distinct minutes containing at least one agent message (wall
spans include long idle gaps, so active time is the honest measure).

| Agent | Build | Model (billing) | Wall (UTC, locked) | Active | Msgs | Code |
|---|---|---|---|---|---|---|
| deepseek | **VANTA GP** — Sunset Circuit | deepseek-v4.1-flash (sub) | 01:46 → 08:46 (~7h) | ~128 min | 255 | ~6.2k lines TS |
| hunger | **HUNGER APEX** | hungerg-free (free preview) + 3 parallel subagents | 01:44 → 08:11 (~6.5h) | ~110 min | 337 + 119 | ~6.3k lines TS |
| mimo | **MIMO VELOCITY** — Ultra Racing | mimo-v2.6-flash (sub) | 02:18 → 10:46 (~8.5h) | ~160 min | 252 | ~5.9k lines JS |
| muse | **MUSE — Apex Protocol** | muse-spark-1.3 (sub) | 01:42:54 → 01:55:41 (**~13 min**, locked) | **~10 min** | 62 | ~3.1k lines TS |
| muse-v2 | **APEX VELOCITY v2** (2nd gen, informed) | muse-spark-1.3 (sub) | 09:35 → 09:47 (~13 min) | ~13 min | 76 | ~4k lines TS |
| hy4 | **REDLINE GP** (2nd gen, informed) | hy4-flash-free (free preview) | 09:40 → 11:05 (~85 min) | ~57 min | 238 | ~4.8k lines TS |

All six clocks are frozen at each agent's last game-code edit —
anything after that was meta-work (summaries, handoffs, these very stats) and
is excluded. The bottom two rows are second-generation hybrids, built sighted:
they studied the four blind builds first, so they race in a separate class.

## Methodology Footnote (the cheat, disclosed)

This was not a fair race, and the table above should be read accordingly:

- **Muse got one run.** It was pulled off its codebase after its first
  complete pass (~13 min) and reassigned to analysis and meta-work: spying on
  the other builds, git duty, handoffs, stats, this README. It never received
  fix cycles for its steering, buildings, or lap logic the way the others did —
  those fixes landed *inside* the 13 minutes or not at all.
- **The others kept iterating.** Deepseek, hunger, and mimo all got repeated
  chances to find and fix their mistakes.
- **Cross-exposure meant quarantine.** Once muse started reading other
  codebases, it was barred from touching its own again — no cherry-picking
  hunger's lofted cars or deepseek's HUD allowed. (This is why muse went
  read-only mid-evening.)
- So the times above measure different things: **time-to-first-artifact**
  (muse) vs **time-to-polished-artifact** (everyone else). These builds are
  museum artifacts of different moments in different processes — not
  contemporary paintings from the same sitting.

## What It Cost (estimated)

Per-request pricing (user-supplied OpenCode Go table), using locked message
counts as a rough proxy for requests — order-of-magnitude, not audited:

| Agent | Model | Reqs (locked msgs) | Rate / 1k req | Est. build cost |
|---|---|---|---|---|
| muse | Muse Spark 1.3 | 62 | $0.04 | **$0.0025** |
| muse-v2 | Muse Spark 1.3 | 76 | $0.04 | **$0.0030** |
| deepseek | DeepSeek V4.1 Flash | 255 | $0.05 | **~$0.013** |
| mimo | MiMo-V2.6-Flash | 252 | $0.07 | **~$0.018** |
| hunger (+subs) | hungerg-free | 456 | free | **$0** |
| hy4 | hy4-flash-free | 238 | free | **$0** |

**Whole evening: under five cents.** Monthly request quotas run 150k–226k per
model; the busiest builder used a few hundred — around a tenth of a percent.
The db's `cost 0.0` column was absence of data, not evidence; this table is the
real answer, and the answer is that compute was never the constraint. Time,
taste, and quota patience were.

## How Each One Played It

**deepseek — the artist.** Three.js, all-in on presentation: sunset city with
lit windows and aircraft beacons, banked corners, analog speedometer with gear
and N₂O, lap-time tower with best lap, FINAL LAP callouts, and 9 screenshots
proving it. Biggest exclusion zone in the field (62 m) — nothing on its road.

**hunger — the engineer.** Three.js r187 with arc-length-parameterized track,
clearance rules measured from the road edge, seeded RNG, and the only test
suite on the grid: 23 vitest unit tests + 8 Playwright end-to-end tests running
in Brave. Also the only one to parallelize — three background subagents
(shaders, vehicle+circuit, UI) swarming in the 02:00 hour. Its 616-line lofted
car dates to 02:16 — half an hour in, first pass, never touched again; the
later hours went to track, physics, tests, and small corrections (blinding
lights, steering, misplaced objects). Caveat from its own test screenshot:
grandstand slabs overlap the track edge.

**mimo — the hardcore.** *Still on track.* Zero dependencies, no build step —
hand-rolled WebGL2 with a 980-line, 17-program GLSL shader library (PBR, SSR,
bloom chain, motion blur, FXAA). The only entry that refused the engine entirely
and wrote the GPU code by hand.

**muse — the sprinter (one shot, no fix cycles — see methodology).** Three.js
arcade build in ~13 minutes: 120 Hz fixed-step drift physics, procedural
everything, adaptive resolution. Smallest codebase — and per driver feedback,
the best steering feel.

## Category Crowns (user verdicts, final)

**Overall winner: mimo.** Best game on the grid — textured roads, realistic
lights, "not a toy." One round of fixes, zero steering corrections.

1. **Car design** — hunger > mimo > deepseek, mimo possibly ahead of hy4 (both muses excluded from this competition)
2. **World visuals** — mimo > deepseek > hunger
3. **UI** — hunger > deepseek ≈ mimo (website-like, not game-like) > muse
4. **Steering feel** — hy4 > mimo (good from day one) > muse > hunger (needed retune) > deepseek (unknown)
5. **Engineering discipline** — hunger, uncontested (tests, track math, clearance rules)
6. **Fewest mistakes** — deepseek (62 m rule, no drama, no brilliance)
7. **Speed (effort)** — muse first (~13 min), mimo last (~8.5h); the slowest run produced the winner

Competition over. Post-race notes: hy4's handling won on feel but its keyboard
defect survived two fix rounds (specs green, game still broken — the agent
could describe the fix better than it could ship it), and the grain was only
partly tamed. Final lesson: green tests are not a working game; only hands-on
playtesting caught what mattered, all evening.

Failure modes observed across the field:

| Failure mode | muse | hunger | mimo | deepseek |
|---|---|---|---|---|
| Objects on road | ✅ billboards (fixed) | ✅ grandstands (partial) | ✅ building (live) | ❌ immune (62 m rule) |
| Steering sign/feel | ✅ inverted (fixed) | ✅ swapped + retuned | ❌ good day one | ❓ no evidence |
| Backface-culled car | ❌ engine handles it | ❌ engine handles it | ✅ live (winding bug vs global `cullFace(BACK)`) | ❌ engine handles it |
| Lap logic broken | ✅ (fixed) | ❌ checkpoint-tested | ❓ unknown | ❌ checkpoint-based |

Reading: frameworks prevent winding bugs but cause none of the placement bugs —
placement is judgement, not math. And the experiment's sharpest finding: agents
differ in *spike profile*, while human taste (corrections + crown calls) is what
converts spikes into quality.

## The Seventh Entry (unranked — the control group)

Haiku (web chat, free tier) submitted `apex-drift.zip`: a single 15,849-byte
HTML file. It hotlinks Three.js r158 from a CDN — the only entry that cannot
run offline — builds its world from boxes (8 `BoxGeometry` calls, 5 functions
total), and borrows its typography from Google Fonts. Excluded from the
scoreboard on scope grounds; preserved here deliberately. This is what the same
prompt produces with no agent harness around it: no file tools, no iteration
loop, no verification pass, nobody to say the steering is backwards. The joke
writes itself. The lesson is real: the harness is the product.

## What 2026 Looks Like From Here

- **All four shipped a playable 3D racer in one sitting**, from one paragraph.
  Two with PBR pipelines, one with a full test suite, one with a from-scratch
  GPU renderer.
- **Specialization emerged unprompted**: visuals, engineering rigor, raw
  performance, speed. No one told them to differentiate.
- **The bugs were human-grade**: inverted steering signs (two agents
  independently discovered that screen-right means *negative* yaw),
  buildings parked on the road, a lap counter that could never count.
  Each was diagnosed and fixed from evidence like a human would.
- **The gaps are also human-grade**: no pause menus, no persistence, no
  playtesting beyond screenshots. The last mile is still judgement.

## Run Them

```bash
# deepseek / hunger / muse (Vite + Three.js)
cd <folder> && npm install && npm run dev

# mimo (zero deps, static files — serve the folder any way you like)
cd mimo && npx serve .   # or: python3 -m http.server
```

Stats sourced from `~/.local/share/opencode/opencode.db` (`session_v2` +
`session_message`). Muse's game-work cutoff: last `muse/src` edit; mimo's row
is interim and gets finalized when it crosses the line. Only hunger ran free
(preview); the rest billed to the OpenCode Go sub — the db records `cost 0.0`
for all rows, so that column is absence of data, not a price comparison.
