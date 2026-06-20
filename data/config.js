/*
 * Global tuning config for the FPS estimator. Everything here is editable —
 * tweak a number, reload the page, and every estimate updates.
 */
const FPS_CONFIG = {
  // How FPS scales with output resolution (relative to 1080p = 1.0).
  // Higher resolution = more pixels for the GPU = lower multiplier.
  resolutionScale: {
    "1080p": 1.0,
    "1440p": 0.64,
    "4K": 0.38,
  },

  // How the graphics preset scales the GPU-bound FPS (High = 1.0 reference).
  presetGpuScale: {
    Low: 1.6,
    Medium: 1.25,
    High: 1.0,
    Ultra: 0.78,
  },

  // Presets affect the CPU far less than the GPU (draw calls, physics, etc.).
  presetCpuScale: {
    Low: 1.08,
    Medium: 1.04,
    High: 1.0,
    Ultra: 0.96,
  },

  // RAM penalty. ratio = installedRam / game.recRam.
  //   >= 1.0  -> no penalty
  //   >= 0.5  -> one tier short: occasional texture streaming / stutter
  //   <  0.5  -> well under spec: frequent hitching drags the average down
  ram: {
    enoughFactor: 1.0,
    oneTierShortFactor: 0.9,
    wellUnderFactor: 0.72,
  },

  // Qualitative rating bands, keyed by minimum average FPS (must be ascending).
  // `key` maps to a colour set in CSS.
  ratings: [
    { min: 0,   label: "Unplayable", key: "bad",       blurb: "Choppy and hard to control. Drop the resolution or preset." },
    { min: 30,  label: "Playable",   key: "ok",        blurb: "Runs, but not silky. Fine for slower-paced games." },
    { min: 60,  label: "Smooth",     key: "good",      blurb: "A solid, responsive experience at this setting." },
    { min: 100, label: "Excellent",  key: "great",     blurb: "High, fluid frame rates — great for fast-paced play." },
    { min: 144, label: "Elite",      key: "elite",     blurb: "Competition-ready frames for high-refresh monitors." },
  ],

  // Bottleneck classification. If the two ceilings are within `balanceBand`
  // of each other (fraction), call it balanced; otherwise name the lower one.
  bottleneck: {
    balanceBand: 0.12,
  },

  // Upper bound of the visual gauge (FPS at a full arc).
  gaugeMaxFps: 240,
};

if (typeof module !== "undefined" && module.exports) module.exports = { FPS_CONFIG };
