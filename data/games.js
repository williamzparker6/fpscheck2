/*
 * Per-game demand data.
 *
 * The estimator computes two ceilings and takes the lower one:
 *   gpuBoundFps = gpuFactor * gpuScore * resolutionScale * presetGpuScale
 *   cpuBoundFps = cpuFactor * cpuScore * presetCpuScale
 *   fps         = min(gpuBoundFps, cpuBoundFps) * ramFactor   (then clamp to fpsCap)
 *
 * Calibration reference: gpuScore 100 (RTX 4090) + cpuScore 100 (7800X3D),
 * at 1080p / High. So `gpuFactor` ≈ the FPS a 4090 gets at 1080p High, and
 * `cpuFactor` ≈ the FPS ceiling a top-end CPU can feed in that title.
 *
 *   gpuFactor  : higher = lighter on the GPU (more FPS)
 *   cpuFactor  : higher = lighter on the CPU (higher FPS ceiling)
 *   recRam     : RAM (GB) at/above which there's no memory penalty
 *   fpsCap     : optional hard engine cap (e.g. Elden Ring locks to 60)
 *   tags       : cosmetic labels shown in the UI
 */
const GAME_DATA = [
  { name: "Counter-Strike 2",                 gpuFactor: 5.0, cpuFactor: 6.5, recRam: 8,  tags: ["Esports", "Light"] },
  { name: "Valorant",                         gpuFactor: 7.0, cpuFactor: 9.0, recRam: 8,  tags: ["Esports", "Very light"] },
  { name: "League of Legends",                gpuFactor: 7.0, cpuFactor: 9.0, recRam: 8,  tags: ["MOBA", "Very light"] },
  { name: "Fortnite",                         gpuFactor: 2.3, cpuFactor: 3.6, recRam: 16, tags: ["Battle Royale"] },
  { name: "Apex Legends",                     gpuFactor: 2.8, cpuFactor: 3.4, recRam: 16, fpsCap: 300, tags: ["Battle Royale"] },
  { name: "Overwatch 2",                      gpuFactor: 4.0, cpuFactor: 5.0, recRam: 8,  fpsCap: 600, tags: ["Hero shooter", "Light"] },
  { name: "PUBG: Battlegrounds",              gpuFactor: 2.3, cpuFactor: 1.9, recRam: 16, tags: ["Battle Royale", "CPU-heavy"] },
  { name: "Call of Duty: Warzone",            gpuFactor: 2.0, cpuFactor: 2.3, recRam: 16, tags: ["Battle Royale"] },
  { name: "Grand Theft Auto V",               gpuFactor: 2.5, cpuFactor: 1.9, recRam: 8,  tags: ["Open world", "CPU-heavy"] },
  { name: "Elden Ring",                       gpuFactor: 1.3, cpuFactor: 1.2, recRam: 12, fpsCap: 60, tags: ["Souls", "60 FPS cap"] },
  { name: "The Witcher 3 (Next-Gen)",         gpuFactor: 1.4, cpuFactor: 1.7, recRam: 12, tags: ["RPG"] },
  { name: "Cyberpunk 2077",                   gpuFactor: 1.6, cpuFactor: 2.1, recRam: 16, tags: ["RPG", "Demanding"] },
  { name: "Red Dead Redemption 2",            gpuFactor: 1.3, cpuFactor: 1.8, recRam: 16, tags: ["Open world", "Demanding"] },
  { name: "Starfield",                        gpuFactor: 1.0, cpuFactor: 1.1, recRam: 16, tags: ["RPG", "Demanding"] },
  { name: "Baldur's Gate 3",                  gpuFactor: 1.8, cpuFactor: 1.2, recRam: 16, tags: ["RPG", "CPU-heavy"] },
  { name: "Hogwarts Legacy",                  gpuFactor: 1.2, cpuFactor: 1.4, recRam: 16, tags: ["Open world", "Demanding"] },
  { name: "Forza Horizon 5",                  gpuFactor: 1.7, cpuFactor: 2.0, recRam: 16, tags: ["Racing"] },
  { name: "Marvel's Spider-Man Remastered",   gpuFactor: 2.0, cpuFactor: 1.5, recRam: 16, tags: ["Action", "CPU-heavy"] },
  { name: "Microsoft Flight Simulator",       gpuFactor: 1.1, cpuFactor: 0.75, recRam: 32, tags: ["Sim", "Very CPU-heavy"] },
  { name: "Black Myth: Wukong",               gpuFactor: 1.05, cpuFactor: 2.0, recRam: 16, tags: ["Action RPG", "Very demanding"] },
];

if (typeof module !== "undefined" && module.exports) module.exports = { GAME_DATA };
