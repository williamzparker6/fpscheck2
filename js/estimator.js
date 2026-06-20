/*
 * FPS estimation model. Pure logic, no DOM. Depends on the global data objects
 * (GPU_DATA, CPU_DATA, GAME_DATA, FPS_CONFIG) loaded before this file.
 *
 * The model is intentionally simple and transparent:
 *   - Each GPU/CPU has a relative performance score.
 *   - Each game has GPU and CPU demand factors.
 *   - We compute a GPU-bound FPS and a CPU-bound FPS, take the lower of the two
 *     (that component is the bottleneck), then apply a RAM penalty and any cap.
 */

/**
 * @param {{game:object, gpu:object, cpu:object, resolution:string, preset:string, ram:number}} sel
 * @returns {{fps:number, rawFps:number, gpuBoundFps:number, cpuBoundFps:number,
 *            bottleneck:'GPU'|'CPU'|'Balanced', rating:object, ramLimited:boolean,
 *            capped:boolean, gaugePct:number}}
 */
function estimateFps(sel) {
  const cfg = FPS_CONFIG;
  const { game, gpu, cpu, resolution, preset, ram } = sel;

  const resScale = cfg.resolutionScale[resolution];
  const presetGpu = cfg.presetGpuScale[preset];
  const presetCpu = cfg.presetCpuScale[preset];

  // Two independent ceilings.
  const gpuBoundFps = game.gpuFactor * gpu.score * resScale * presetGpu;
  const cpuBoundFps = game.cpuFactor * cpu.score * presetCpu;

  // The lower ceiling wins — that's the real-world frame rate before RAM/caps.
  let fps = Math.min(gpuBoundFps, cpuBoundFps);

  // RAM penalty.
  const ramRatio = ram / game.recRam;
  let ramFactor = cfg.ram.enoughFactor;
  if (ramRatio < 0.5) ramFactor = cfg.ram.wellUnderFactor;
  else if (ramRatio < 1) ramFactor = cfg.ram.oneTierShortFactor;
  const ramLimited = ramFactor < 1;
  fps *= ramFactor;

  const rawFps = fps;

  // Hard engine cap (e.g. Elden Ring @ 60).
  let capped = false;
  if (game.fpsCap && fps > game.fpsCap) {
    fps = game.fpsCap;
    capped = true;
  }

  fps = Math.max(1, Math.round(fps));

  return {
    fps,
    rawFps,
    gpuBoundFps,
    cpuBoundFps,
    bottleneck: classifyBottleneck(gpuBoundFps, cpuBoundFps, capped, cfg),
    rating: ratingFor(fps, cfg),
    ramLimited,
    capped,
    gaugePct: Math.max(0, Math.min(1, fps / cfg.gaugeMaxFps)),
  };
}

/** Which component is holding frames back? */
function classifyBottleneck(gpuBoundFps, cpuBoundFps, capped, cfg) {
  if (capped) return "Capped";
  const lower = Math.min(gpuBoundFps, cpuBoundFps);
  const higher = Math.max(gpuBoundFps, cpuBoundFps);
  if ((higher - lower) / higher <= cfg.bottleneck.balanceBand) return "Balanced";
  return gpuBoundFps < cpuBoundFps ? "GPU" : "CPU";
}

/** Pick the rating band for a given FPS (bands are ascending by `min`). */
function ratingFor(fps, cfg) {
  let match = cfg.ratings[0];
  for (const band of cfg.ratings) {
    if (fps >= band.min) match = band;
  }
  return match;
}

/** Human-readable explanation of the bottleneck, given the resolved result. */
function bottleneckText(result, sel) {
  switch (result.bottleneck) {
    case "GPU":
      return `GPU-bound — your ${shortName(sel.gpu.name)} is the main limiter. Lowering the resolution or preset will help the most.`;
    case "CPU":
      return `CPU-bound — your ${shortName(sel.cpu.name)} is the main limiter. Lowering resolution won't help much; this game leans hard on the processor.`;
    case "Capped":
      return `Frame-capped — ${shortName(sel.game.name)} limits this to ${sel.game.fpsCap} FPS, which your hardware reaches comfortably.`;
    default:
      return `Well balanced — your GPU and CPU are fairly matched for ${shortName(sel.game.name)} at this setting.`;
  }
}

/** Drop the brand prefix for tidier sentences ("NVIDIA RTX 4070" -> "RTX 4070"). */
function shortName(name) {
  return name.replace(/^(NVIDIA|AMD|Intel)\s+/, "");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { estimateFps, bottleneckText, ratingFor, shortName };
}
