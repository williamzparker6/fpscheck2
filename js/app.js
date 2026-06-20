/*
 * App wiring: build the controls from the data files, keep a small selection
 * state, and re-render the result live on every change.
 */
(function () {
  "use strict";

  // ── Default selection (a popular, demanding showcase setup) ──────────────
  const state = {
    game: findBy(GAME_DATA, "Cyberpunk 2077"),
    gpu: findBy(GPU_DATA, "NVIDIA RTX 4070"),
    cpu: findBy(CPU_DATA, "AMD Ryzen 7 7800X3D"),
    resolution: "1080p",
    preset: "High",
    ram: 16,
    rt: false,
    upscaling: "Off",
  };

  const RATING_COLORS = {
    bad: "var(--bad)",
    ok: "var(--ok)",
    good: "var(--good)",
    great: "var(--great)",
    elite: "var(--elite)",
  };

  // ── Build searchable selects ─────────────────────────────────────────────
  const gameSelect = createSearchableSelect(byAttr("data-select", "game"), {
    items: GAME_DATA,
    getLabel: (g) => g.name,
    getMeta: (g) => (g.tags ? g.tags[0] : null),
    getKey: (g) => g.name,
    searchText: (g) => g.name + " " + (g.tags || []).join(" "),
    placeholder: "Search games…",
    onChange: (g) => set("game", g),
  });

  const gpuSelect = createSearchableSelect(byAttr("data-select", "gpu"), {
    items: GPU_DATA,
    getLabel: (g) => g.name,
    getMeta: (g) => g.vram + " GB",
    getKey: (g) => g.name,
    searchText: (g) => g.name,
    placeholder: "Search graphics cards…",
    onChange: (g) => set("gpu", g),
  });

  const cpuSelect = createSearchableSelect(byAttr("data-select", "cpu"), {
    items: CPU_DATA,
    getLabel: (c) => c.name,
    getMeta: () => null,
    getKey: (c) => c.name,
    searchText: (c) => c.name,
    placeholder: "Search processors…",
    onChange: (c) => set("cpu", c),
  });

  // ── Build segmented controls ─────────────────────────────────────────────
  createSegmented(byAttr("data-segmented", "resolution"), {
    options: [
      { label: "1080p", value: "1080p" },
      { label: "1440p", value: "1440p" },
      { label: "4K", value: "4K" },
    ],
    value: state.resolution,
    onChange: (v) => set("resolution", v),
  });

  createSegmented(byAttr("data-segmented", "preset"), {
    options: ["Low", "Medium", "High", "Ultra"].map((p) => ({ label: p, value: p })),
    value: state.preset,
    onChange: (v) => set("preset", v),
  });

  createSegmented(byAttr("data-segmented", "ram"), {
    options: [8, 16, 32, 64].map((r) => ({ label: r + " GB", value: r })),
    value: state.ram,
    onChange: (v) => set("ram", v),
  });

  const rtSeg = createSegmented(byAttr("data-segmented", "rt"), {
    options: [
      { label: "Off", value: false },
      { label: "On", value: true },
    ],
    value: state.rt,
    onChange: (v) => set("rt", v),
  });

  const upSeg = createSegmented(byAttr("data-segmented", "upscaling"), {
    options: ["Off", "Quality", "Balanced", "Performance"].map((u) => ({ label: u, value: u })),
    value: state.upscaling,
    onChange: (v) => set("upscaling", v),
  });

  const rtLabel = document.getElementById("rtLabel");
  const upLabel = document.getElementById("upLabel");

  // Enable/disable the RT + upscaling controls based on what the game supports.
  function applyGameCapabilities() {
    const g = state.game;
    if (g.rt) {
      rtSeg.setDisabled(false);
      rtLabel.innerHTML = "Ray tracing";
    } else {
      state.rt = false;
      rtSeg.setValue(false);
      rtSeg.setDisabled(true);
      rtLabel.innerHTML = 'Ray tracing <span class="label-note">· not supported</span>';
    }
    if (g.up) {
      upSeg.setDisabled(false);
      upLabel.innerHTML = 'Upscaling <span class="label-note">(DLSS / FSR / XeSS)</span>';
    } else {
      state.upscaling = "Off";
      upSeg.setValue("Off");
      upSeg.setDisabled(true);
      upLabel.innerHTML = 'Upscaling <span class="label-note">· not supported</span>';
    }
  }

  // Seed the selects with their default values.
  gameSelect.setValue(state.game);
  gpuSelect.setValue(state.gpu);
  cpuSelect.setValue(state.cpu);

  // ── State + render ───────────────────────────────────────────────────────
  function set(key, value) {
    state[key] = value;
    if (key === "game") applyGameCapabilities();
    render();
  }

  const elFps = document.getElementById("fpsNumber");
  const elGauge = document.getElementById("gaugeValue");
  const elBadge = document.getElementById("ratingBadge");
  const elBlurb = document.getElementById("ratingBlurb");
  const elBottleText = document.getElementById("bottleneckText");
  const elBottleIcon = document.getElementById("bottleneckIcon");
  const elContext = document.getElementById("resultContext");
  const resultCard = document.querySelector(".card.result");
  const GAUGE_LEN = 377; // ≈ π · r(120)

  let lastFps = 0;

  function render() {
    const result = estimateFps(state);

    // Rating colour drives the number, badge and gauge accent.
    resultCard.style.setProperty("--rating-color", RATING_COLORS[result.rating.key]);

    animateNumber(lastFps, result.fps);
    lastFps = result.fps;

    elGauge.style.strokeDashoffset = String(GAUGE_LEN * (1 - result.gaugePct));

    elBadge.textContent = result.rating.label;
    elBlurb.textContent = result.rating.blurb;

    elBottleText.innerHTML = bottleneckText(result, state);
    elBottleIcon.textContent = bottleneckGlyph(result.bottleneck);
    elBottleIcon.style.background =
      "color-mix(in srgb, " + bottleneckColor(result.bottleneck) + " 18%, transparent)";
    elBottleIcon.style.color = bottleneckColor(result.bottleneck);

    let ctx = `${state.resolution} · ${state.preset}`;
    if (result.rtActive) ctx += " · RT on";
    if (result.upActive) ctx += ` · ${result.upMode} upscaling`;
    ctx += ` · ${state.ram} GB`;
    elContext.textContent = ctx;
  }

  function animateNumber(from, to) {
    elFps.classList.remove("bump");
    void elFps.offsetWidth; // restart animation
    elFps.classList.add("bump");

    const dur = 480;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      elFps.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(step);
      else elFps.textContent = to;
    }
    requestAnimationFrame(step);
  }

  function bottleneckGlyph(b) {
    return { GPU: "G", CPU: "C", Balanced: "⇄", Capped: "▲" }[b] || "•";
  }
  function bottleneckColor(b) {
    return { GPU: "var(--accent-2)", CPU: "var(--elite)", Balanced: "var(--good)", Capped: "var(--ok)" }[b] || "var(--accent)";
  }

  // ── Theme toggle (persisted) ─────────────────────────────────────────────
  const root = document.documentElement;
  const saved = localStorage.getItem("fps-theme");
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches)
    root.setAttribute("data-theme", "light");

  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("fps-theme", next);
  });

  // ── Utilities ────────────────────────────────────────────────────────────
  function byAttr(attr, val) {
    return document.querySelector(`[${attr}="${val}"]`);
  }
  function findBy(arr, name) {
    return arr.find((x) => x.name === name) || arr[0];
  }

  // First paint.
  applyGameCapabilities();
  render();
})();
