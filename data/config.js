/*
 * Global tuning config for the FPS estimator. Everything here is editable —
 * tweak a number, reload the page, and every estimate updates.
 *
 * Calibration notes (see README for sources):
 *   - Scales are anchored to published RTX 4090 benchmarks on a Ryzen 7 7800X3D
 *     / 9800X3D-class testbed (the same reference Tom's Hardware uses).
 *   - The per-game baseline is NATIVE-resolution RASTER at the chosen preset.
 *     Ray tracing and upscaling are applied on top (see games.js + estimator.js),
 *     which is how reviewers actually report numbers.
 */
const FPS_CONFIG = {
  // FPS vs output resolution, relative to 1080p = 1.0. Derived from real
  // GPU-bound raster scaling (e.g. 4090 Cyberpunk: 1080p≈230, 1440p≈192, 4K≈110).
  resolutionScale: {
    "1080p": 1.0,
    "1440p": 0.70,
    "1440p UW": 0.60, // 3440×1440 ultrawide (≈2.4× the pixels of 1080p)
    "4K": 0.42,
  },

  // GPU-bound FPS vs graphics preset (High = 1.0 reference).
  presetGpuScale: {
    Low: 1.55,
    Medium: 1.22,
    High: 1.0,
    Ultra: 0.85,
  },

  // Presets affect the CPU far less than the GPU.
  presetCpuScale: {
    Low: 1.08,
    Medium: 1.04,
    High: 1.0,
    Ultra: 0.97,
  },

  // Upscaling (DLSS / FSR / XeSS super-resolution) multiplies GPU-bound FPS.
  // It does NOT raise the CPU ceiling — which is exactly why heavy upscaling
  // can leave you CPU-bound. Bigger uplift at higher output resolutions
  // (more pixels saved). Frame-generation is intentionally excluded.
  upscaling: {
    Off: { "1080p": 1.0, "1440p": 1.0, "1440p UW": 1.0, "4K": 1.0 },
    Quality: { "1080p": 1.22, "1440p": 1.33, "1440p UW": 1.4, "4K": 1.5 },
    Balanced: { "1080p": 1.35, "1440p": 1.5, "1440p UW": 1.6, "4K": 1.75 },
    Performance: { "1080p": 1.5, "1440p": 1.7, "1440p UW": 1.85, "4K": 2.0 },
  },

  // RAM penalty. ratio = installedRam / game.recRam.
  ram: {
    enoughFactor: 1.0,
    oneTierShortFactor: 0.9,
    wellUnderFactor: 0.72,
  },

  // Qualitative rating bands, keyed by minimum average FPS (ascending).
  ratings: [
    { min: 0,   label: "Unplayable", key: "bad",   blurb: "Choppy and hard to control. Drop the resolution or preset, or turn on upscaling." },
    { min: 30,  label: "Playable",   key: "ok",    blurb: "Runs, but not silky. Fine for slower-paced games." },
    { min: 60,  label: "Smooth",     key: "good",  blurb: "A solid, responsive experience at this setting." },
    { min: 100, label: "Excellent",  key: "great", blurb: "High, fluid frame rates — great for fast-paced play." },
    { min: 144, label: "Elite",      key: "elite", blurb: "Competition-ready frames for high-refresh monitors." },
  ],

  // Bottleneck classification: within this fraction = "balanced".
  bottleneck: { balanceBand: 0.12 },

  // Frame Generation (DLSS 3 / FSR 3) multiplies the FINAL displayed FPS. Real
  // uplift is typically ~1.6–2.0× (it inserts interpolated frames). It does not
  // improve responsiveness — input latency tracks the pre-FG framerate.
  frameGenFactor: 1.8,

  // Upper bound of the visual gauge (FPS at a full arc).
  gaugeMaxFps: 240,
};

if (typeof module !== "undefined" && module.exports) module.exports = { FPS_CONFIG };
