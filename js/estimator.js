/*
 * FPS estimation model. Pure logic, no DOM. Depends on the global data objects
 * (GPU_DATA, CPU_DATA, GAME_DATA, FPS_CONFIG) loaded before this file.
 *
 * Two ceilings are computed and the lower one wins (that's the bottleneck):
 *
 *   gpuBoundFps = gpuFactor * gpuScore * resScale * presetGpu * upscale * rt
 *   cpuBoundFps = cpuFactor * cpuScore * presetCpu
 *   fps         = min(gpuBoundFps, cpuBoundFps) * ramFactor   (then clamp to cap)
 *
 * The per-game baseline is NATIVE-resolution RASTER. Ray tracing multiplies the
 * GPU-bound number down (game.rt); upscaling multiplies it up (config.upscaling)
 * but never raises the CPU ceiling — so heavy upscaling can leave you CPU-bound.
 */

/**
 * @param {{game,gpu,cpu,resolution,preset,ram, rt?:boolean, upscaling?:string}} sel
 */
function estimateFps(sel) {
  const cfg = FPS_CONFIG;
  const { game, gpu, cpu, resolution, preset, ram } = sel;

  const resScale = cfg.resolutionScale[resolution];
  const presetGpu = cfg.presetGpuScale[preset];
  const presetCpu = cfg.presetCpuScale[preset];

  // Ray tracing: only if the game supports it (game.rt is the raster→RT factor).
  const rtActive = !!(sel.rt && game.rt);
  const rtMult = rtActive ? game.rt : 1;

  // Upscaling: only if the game supports it and a mode other than "Off".
  const upMode = sel.upscaling || "Off";
  const upActive = !!(game.up && upMode !== "Off");
  const upMult = upActive ? cfg.upscaling[upMode][resolution] : 1;

  // Two independent ceilings.
  const gpuBoundFps = game.gpuFactor * gpu.score * resScale * presetGpu * rtMult * upMult;
  const cpuBoundFps = game.cpuFactor * cpu.score * presetCpu;

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
    rtActive,
    upActive,
    upMode,
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
      return `GPU-bound — your ${shortName(sel.gpu.name)} is the main limiter. Lowering the resolution or preset${sel.game.up ? ", or turning on upscaling," : ""} will help the most.`;
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
