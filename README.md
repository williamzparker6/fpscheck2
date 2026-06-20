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

The model is intentionally simple and transparent. Every device has a relative
performance **score**, every game has **demand factors**, and we compute two
independent ceilings and take the lower one — that component is your bottleneck:

```
gpuBoundFps = game.gpuFactor × gpu.score × resolutionScale × presetGpuScale
cpuBoundFps = game.cpuFactor × cpu.score × presetCpuScale

fps = min(gpuBoundFps, cpuBoundFps) × ramFactor      → then clamp to any engine cap
```

- **GPU / CPU scores** are relative indices (RTX 4090 ≈ 100, Ryzen 7 7800X3D ≈ 100).
- **Resolution** scales the GPU‑bound number (more pixels = fewer frames); the
  CPU ceiling is largely resolution‑independent, which is what naturally shifts a
  setup from GPU‑bound at 4K to CPU‑bound at 1080p.
- **RAM** below a game's recommendation applies a stutter penalty.
- **Caps** model hard engine limits (e.g. Elden Ring locks to 60 FPS).

---

## Editing the data (tuning estimates)

All numbers live in plain, commented config files under [`/data`](./data) — edit a
value, refresh the page, and every estimate updates. No build, no tooling.

| File | What's in it |
| --- | --- |
| [`data/gpus.js`](./data/gpus.js) | GPU list + relative `score` (and VRAM) |
| [`data/cpus.js`](./data/cpus.js) | CPU list + relative `score` |
| [`data/games.js`](./data/games.js) | Per‑game `gpuFactor`, `cpuFactor`, `recRam`, optional `fpsCap`, tags |
| [`data/config.js`](./data/config.js) | Resolution/preset scaling, RAM penalties, rating bands, gauge max |

### Add a GPU

```js
// in data/gpus.js — set score by comparing to nearby cards
{ name: "NVIDIA RTX 5080", score: 95, vram: 16, brand: "NVIDIA" },
```

### Add a game

```js
// in data/games.js
// gpuFactor ≈ FPS a 4090 gets at 1080p/High; cpuFactor ≈ top-CPU FPS ceiling
{ name: "Helldivers 2", gpuFactor: 1.7, cpuFactor: 2.0, recRam: 16, tags: ["Co-op"] },
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
