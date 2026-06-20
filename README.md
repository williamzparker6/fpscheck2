# 🎮 FPS Estimator

A clean, modern web app that estimates the **average FPS** you can expect in
popular PC games based on your **GPU, CPU, resolution, graphics preset and RAM** —
with a qualitative rating and a GPU‑ vs CPU‑bound bottleneck read‑out.

> ⚠️ These are **rough approximations** from a tuneable model, not real
> benchmarks. Actual FPS varies with drivers, in‑game settings, background apps
> and individual scenes.

![FPS Estimator](https://img.shields.io/badge/stack-vanilla%20HTML%20%2F%20CSS%20%2F%20JS-6366f1) ![No build step](https://img.shields.io/badge/build-none-22c55e)

---

## Features

- **Searchable dropdowns** for ~20 popular games, ~45 GPUs and ~35 CPUs
- **Resolution** (1080p / 1440p / 4K), **preset** (Low / Medium / High / Ultra) and **RAM** (8–64 GB)
- **Ray tracing** and **DLSS / FSR / XeSS upscaling** toggles — the two biggest real‑world FPS levers, auto‑disabled for games that don't support them
- **Live results** — no submit button; everything updates as you change a control
- A **prominent FPS number** with an animated gauge and a qualitative rating
  (*Unplayable → Playable → Smooth → Excellent → Elite*)
- A **bottleneck note** (GPU‑bound, CPU‑bound, balanced, or frame‑capped)
- **Light / dark mode** (remembers your choice, respects your system setting)
- **Responsive** — works on desktop and mobile
- **Zero dependencies** and **no build step** for the app itself

---

## Run it

It's just static files. Pick whichever is easiest:

```bash
# Option A — Node (zero dependencies)
npm start                 # serves http://localhost:8000

# Option B — Python
python3 -m http.server 8000

# Option C — just open index.html in your browser
```

Then open <http://localhost:8000>.

---

## How the estimate works

The model is transparent and **anchored to real published benchmarks**. Every
device has a relative performance **score**, every game has **demand factors**,
and we compute two independent ceilings and take the lower one — that component
is your bottleneck:

```
gpuBoundFps = game.gpuFactor × gpu.score × resolutionScale × presetGpuScale × rtMult × upscaleMult
cpuBoundFps = game.cpuFactor × cpu.score × presetCpuScale

fps = min(gpuBoundFps, cpuBoundFps) × ramFactor      → then clamp to any engine cap
```

- **GPU / CPU scores** are relative indices (RTX 4090 ≈ 100, Ryzen 7 7800X3D ≈ 100).
- **Baseline = native‑resolution rasterization** at the chosen preset, calibrated
  so an RTX 4090 + 7800X3D matches published 1440p/Ultra numbers.
- **Ray tracing** multiplies the GPU‑bound number *down* by a per‑game factor
  (e.g. Cyberpunk ≈ 0.39); **upscaling** multiplies it *up* (DLSS/FSR Quality →
  Performance), but **never raises the CPU ceiling** — which is exactly why heavy
  upscaling can leave you CPU‑bound.
- **Resolution** scales the GPU‑bound number; the CPU ceiling is largely
  resolution‑independent, which naturally shifts a rig from GPU‑bound at 4K to
  CPU‑bound at 1080p.
- **RAM** below a game's recommendation applies a stutter penalty; **caps** model
  hard engine limits (e.g. Elden Ring locks to 60 FPS).

### Calibration & sources

Scaling factors and the per‑game raster baselines are anchored to real benchmark
data on an RTX 4090 / Ryzen 7 7800X3D‑class testbed. Headline titles are
cross‑checked against published reviews; the rest sit on the same real‑data scale
by genre/engine. **These remain approximations, not measurements** — actual FPS
varies with drivers, patches, scenes and settings. Reference sources include:

- [Tom's Hardware — GPU Benchmarks Hierarchy](https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html) (relative GPU performance, testing methodology)
- [TechPowerUp](https://www.techpowerup.com/review/cyberpunk-2077-phantom-liberty-benchmark-test-performance-analysis/) & [TechSpot](https://www.techspot.com/review/2743-cyberpunk-phantom-liberty-benchmark/) (per‑game raster vs ray‑tracing benchmarks)
- [PC Gamer / NVIDIA](https://www.pcgamer.com/nvidias-rtx-4090-targets-300-fps-at-1440p-with-low-latency-for-competitive-shooters/) (competitive‑shooter FPS ceilings)

---

## Editing the data (tuning estimates)

All numbers live in plain, commented config files under [`/data`](./data) — edit a
value, refresh the page, and every estimate updates. No build, no tooling.

| File | What's in it |
| --- | --- |
| [`data/gpus.js`](./data/gpus.js) | GPU list + relative `score` (and VRAM) |
| [`data/cpus.js`](./data/cpus.js) | CPU list + relative `score` |
| [`data/games.js`](./data/games.js) | Per‑game `gpuFactor`, `cpuFactor`, `recRam`, optional `fpsCap`, `rt` (ray‑tracing factor), `up` (upscaling support), tags |
| [`data/config.js`](./data/config.js) | Resolution/preset scaling, **upscaling** uplift, RAM penalties, rating bands, gauge max |

### Add a GPU

```js
// in data/gpus.js — set score by comparing to nearby cards
{ name: "NVIDIA RTX 5080", score: 95, vram: 16, brand: "NVIDIA" },
```

### Add a game

```js
// in data/games.js
// gpuFactor ≈ (4090's native-raster 1440p/Ultra FPS ÷ 59.5); cpuFactor ≈ top-CPU ceiling ÷ 100
// rt: raster→ray-tracing multiplier (omit if no RT). up: true if DLSS/FSR/XeSS supported.
{ name: "Helldivers 2", gpuFactor: 2.2, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Co-op"] },
{ name: "Cyberpunk 2077", gpuFactor: 3.23, cpuFactor: 2.3, recRam: 16, rt: 0.39, up: true, tags: ["RPG"] },
```

---

## Project structure

```
.
├── index.html            # markup + script/style includes
├── css/styles.css        # all styling, theming via CSS variables
├── data/                 # ← editable config (the tunable bits)
│   ├── gpus.js
│   ├── cpus.js
│   ├── games.js
│   └── config.js
├── js/
│   ├── estimator.js      # pure estimation model (no DOM)
│   ├── ui.js             # reusable searchable-select + segmented-control
│   └── app.js            # state + live rendering + theme toggle
└── tools/
    ├── serve.js          # zero-dependency static server (npm start)
    └── screenshot.js     # OPTIONAL dev helper for headless screenshots
```

The estimation logic (`js/estimator.js`) is **pure** and DOM‑free, so it's easy
to unit‑test or reuse.

---

## Optional: screenshot tool

`tools/screenshot.js` renders the app with headless Chromium for visual checks.
It is **not needed to use the app** — only install the dev dependencies if you
want it:

```bash
npm install            # pulls puppeteer-core + @sparticuz/chromium (dev only)
npm start &            # serve the app
node tools/screenshot.js http://localhost:8000 shot.png 1280 1000 dark
```

---

## License

MIT
