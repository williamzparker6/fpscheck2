/*
 * Per-game demand data.
 *
 * The estimator computes two ceilings and takes the lower one:
 *   gpuBoundFps = gpuFactor * gpuScore * resScale * presetGpu * rtMult * upMult
 *   cpuBoundFps = cpuFactor * cpuScore * presetCpu
 *   fps         = min(gpuBoundFps, cpuBoundFps) * ramFactor   (then clamp to fpsCap)
 *
 * Baseline = NATIVE-resolution RASTER at the chosen preset, calibrated so that an
 * RTX 4090 + 7800X3D at 1440p/Ultra matches published benchmark numbers
 * (gpuFactor ≈ that 1440p-Ultra FPS ÷ 59.5). Headline titles (Cyberpunk,
 * Valorant, Fortnite, Apex, CS2, RDR2, Black Myth, Alan Wake 2 …) are
 * cross-checked against real reviews; the rest sit on the same scale by genre/
 * engine. See README for sources.
 *
 *   gpuFactor : raster GPU-bound FPS coefficient (higher = lighter on the GPU)
 *   cpuFactor : CPU FPS-ceiling coefficient    (higher = higher CPU ceiling)
 *   recRam    : RAM (GB) at/above which there's no memory penalty
 *   fpsCap    : optional hard engine cap (e.g. Elden Ring locks to 60)
 *   rt        : raster→ray-tracing multiplier IF the game supports RT (else omit)
 *   up        : true if the game supports DLSS / FSR / XeSS upscaling
 *   tags      : cosmetic labels shown in the UI / used for search
 */
const GAME_DATA = [
  // ── Competitive / esports (CPU-bound at high FPS) ──
  { name: "Counter-Strike 2",                 gpuFactor: 6.7, cpuFactor: 5.0, recRam: 8,  up: false, tags: ["Esports", "Light"] },
  { name: "Valorant",                         gpuFactor: 10,  cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Esports", "Very light"] },
  { name: "League of Legends",                gpuFactor: 10,  cpuFactor: 4.0, recRam: 8,  up: false, tags: ["MOBA", "Very light"] },
  { name: "Dota 2",                           gpuFactor: 5.0, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["MOBA"] },
  { name: "Overwatch 2",                      gpuFactor: 6.7, cpuFactor: 4.5, recRam: 8,  fpsCap: 600, up: false, tags: ["Hero shooter", "Light"] },
  { name: "Rainbow Six Siege",                gpuFactor: 8.4, cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Tactical FPS"] },
  { name: "Rocket League",                    gpuFactor: 8.4, cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Sports", "Light"] },
  { name: "Team Fortress 2",                  gpuFactor: 6.7, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["FPS", "Light"] },
  { name: "Apex Legends",                     gpuFactor: 4.2, cpuFactor: 3.0, recRam: 16, fpsCap: 300, up: false, tags: ["Battle Royale"] },
  { name: "Fortnite",                         gpuFactor: 3.0, cpuFactor: 2.8, recRam: 16, rt: 0.5, up: true, tags: ["Battle Royale"] },
  { name: "PUBG: Battlegrounds",              gpuFactor: 4.2, cpuFactor: 2.0, recRam: 16, up: false, tags: ["Battle Royale", "CPU-heavy"] },
  { name: "Call of Duty: Warzone",            gpuFactor: 3.0, cpuFactor: 2.2, recRam: 16, up: true, tags: ["Battle Royale"] },
  { name: "Marvel Rivals",                    gpuFactor: 3.0, cpuFactor: 2.2, recRam: 16, rt: 0.7, up: true, tags: ["Hero shooter"] },
  { name: "The Finals",                       gpuFactor: 2.7, cpuFactor: 2.0, recRam: 16, up: true, tags: ["FPS", "CPU-heavy"] },
  { name: "Naraka: Bladepoint",               gpuFactor: 3.0, cpuFactor: 2.3, recRam: 16, up: true, tags: ["Battle Royale"] },
  { name: "Dead by Daylight",                 gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Horror", "Multiplayer"] },
  { name: "Fall Guys",                        gpuFactor: 5.0, cpuFactor: 3.5, recRam: 8,  up: false, tags: ["Party", "Light"] },

  // ── Shooters (campaign / PvE) ──
  { name: "Call of Duty: Black Ops 6",        gpuFactor: 3.0, cpuFactor: 2.3, recRam: 16, up: true, tags: ["FPS"] },
  { name: "Call of Duty: Modern Warfare III", gpuFactor: 3.0, cpuFactor: 2.3, recRam: 16, up: true, tags: ["FPS"] },
  { name: "Battlefield 2042",                 gpuFactor: 2.5, cpuFactor: 2.2, recRam: 16, up: true, tags: ["FPS"] },
  { name: "Battlefield V",                    gpuFactor: 3.4, cpuFactor: 2.5, recRam: 16, rt: 0.7, up: true, tags: ["FPS"] },
  { name: "Battlefield 1",                    gpuFactor: 3.7, cpuFactor: 2.8, recRam: 16, up: false, tags: ["FPS"] },
  { name: "Destiny 2",                        gpuFactor: 3.4, cpuFactor: 2.5, recRam: 16, up: false, tags: ["Looter shooter"] },
  { name: "Halo Infinite",                    gpuFactor: 2.7, cpuFactor: 2.0, recRam: 16, up: false, tags: ["FPS"] },
  { name: "DOOM Eternal",                     gpuFactor: 4.7, cpuFactor: 3.5, recRam: 16, rt: 0.8, up: true, tags: ["FPS", "Well optimized"] },
  { name: "DOOM (2016)",                      gpuFactor: 5.0, cpuFactor: 3.8, recRam: 8,  up: false, tags: ["FPS"] },
  { name: "Titanfall 2",                      gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["FPS"] },
  { name: "Escape from Tarkov",               gpuFactor: 2.0, cpuFactor: 1.1, recRam: 16, up: false, tags: ["FPS", "Very CPU-heavy"] },
  { name: "Hell Let Loose",                   gpuFactor: 2.2, cpuFactor: 1.5, recRam: 16, up: false, tags: ["FPS"] },
  { name: "Left 4 Dead 2",                    gpuFactor: 6.7, cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Co-op", "Light"] },
  { name: "Helldivers 2",                     gpuFactor: 2.2, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Co-op shooter"] },
  { name: "Deep Rock Galactic",               gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Co-op"] },
  { name: "Insurgency: Sandstorm",            gpuFactor: 3.0, cpuFactor: 2.2, recRam: 16, up: false, tags: ["FPS"] },

  // ── Survival / sandbox / crafting ──
  { name: "Minecraft (Java)",                 gpuFactor: 5.0, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Sandbox"] },
  { name: "Rust",                             gpuFactor: 2.4, cpuFactor: 1.3, recRam: 16, up: true, tags: ["Survival"] },
  { name: "ARK: Survival Ascended",           gpuFactor: 1.2, cpuFactor: 0.9, recRam: 16, rt: 0.7, up: true, tags: ["Survival", "Very demanding"] },
  { name: "Valheim",                          gpuFactor: 3.4, cpuFactor: 2.0, recRam: 8,  up: false, tags: ["Survival"] },
  { name: "Terraria",                         gpuFactor: 10,  cpuFactor: 6.0, recRam: 8,  up: false, tags: ["2D", "Very light"] },
  { name: "7 Days to Die",                    gpuFactor: 2.5, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Survival"] },
  { name: "DayZ",                             gpuFactor: 2.4, cpuFactor: 1.1, recRam: 16, up: false, tags: ["Survival", "CPU-heavy"] },
  { name: "Palworld",                         gpuFactor: 2.5, cpuFactor: 1.6, recRam: 16, up: true, tags: ["Survival"] },
  { name: "Sons of the Forest",               gpuFactor: 2.0, cpuFactor: 1.4, recRam: 16, up: true, tags: ["Survival horror"] },
  { name: "The Forest",                       gpuFactor: 3.4, cpuFactor: 2.2, recRam: 8,  up: false, tags: ["Survival horror"] },
  { name: "Subnautica",                       gpuFactor: 3.7, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Survival"] },
  { name: "No Man's Sky",                     gpuFactor: 2.7, cpuFactor: 1.8, recRam: 16, up: true, tags: ["Exploration"] },
  { name: "Satisfactory",                     gpuFactor: 2.5, cpuFactor: 1.4, recRam: 16, up: true, tags: ["Factory", "CPU-heavy"] },
  { name: "Factorio",                         gpuFactor: 5.0, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Factory", "CPU-heavy"] },
  { name: "Stardew Valley",                   gpuFactor: 10,  cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Indie", "Very light"] },
  { name: "Sea of Thieves",                   gpuFactor: 3.4, cpuFactor: 2.2, recRam: 8,  up: false, tags: ["Adventure"] },
  { name: "V Rising",                         gpuFactor: 3.4, cpuFactor: 2.2, recRam: 16, up: true, tags: ["Survival"] },
  { name: "Enshrouded",                       gpuFactor: 2.2, cpuFactor: 1.4, recRam: 16, up: true, tags: ["Survival"] },
  { name: "Grounded",                         gpuFactor: 3.4, cpuFactor: 2.2, recRam: 8,  up: false, tags: ["Survival"] },
  { name: "Raft",                             gpuFactor: 4.7, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Survival", "Light"] },

  // ── RPG / action-RPG ──
  { name: "Cyberpunk 2077",                   gpuFactor: 3.23, cpuFactor: 2.3, recRam: 16, rt: 0.39, up: true, tags: ["RPG", "Demanding"] },
  { name: "The Witcher 3 (Next-Gen)",         gpuFactor: 2.27, cpuFactor: 1.6, recRam: 12, rt: 0.5, up: true, tags: ["RPG"] },
  { name: "Elden Ring",                       gpuFactor: 2.0, cpuFactor: 1.2, recRam: 12, fpsCap: 60, rt: 0.75, up: false, tags: ["Souls", "60 FPS cap"] },
  { name: "Baldur's Gate 3",                  gpuFactor: 2.5, cpuFactor: 1.2, recRam: 16, up: true, tags: ["RPG", "CPU-heavy"] },
  { name: "Starfield",                        gpuFactor: 1.7, cpuFactor: 1.1, recRam: 16, up: true, tags: ["RPG", "Demanding"] },
  { name: "Diablo IV",                        gpuFactor: 4.2, cpuFactor: 3.0, recRam: 16, rt: 0.7, up: true, tags: ["Action RPG"] },
  { name: "Diablo III",                       gpuFactor: 6.7, cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Action RPG", "Light"] },
  { name: "Path of Exile",                    gpuFactor: 3.4, cpuFactor: 1.5, recRam: 8,  up: false, tags: ["Action RPG", "CPU-heavy"] },
  { name: "Path of Exile 2",                  gpuFactor: 2.5, cpuFactor: 1.8, recRam: 16, up: true, tags: ["Action RPG"] },
  { name: "The Elder Scrolls V: Skyrim SE",   gpuFactor: 4.2, cpuFactor: 2.0, recRam: 8,  up: false, tags: ["RPG"] },
  { name: "Fallout 4",                        gpuFactor: 3.4, cpuFactor: 1.4, recRam: 8,  up: false, tags: ["RPG", "CPU-heavy"] },
  { name: "Monster Hunter: World",            gpuFactor: 2.5, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Action RPG"] },
  { name: "Monster Hunter Wilds",             gpuFactor: 1.3, cpuFactor: 1.1, recRam: 16, up: true, tags: ["Action RPG", "Demanding"] },
  { name: "Dragon's Dogma 2",                 gpuFactor: 1.5, cpuFactor: 0.8, recRam: 16, up: true, tags: ["RPG", "CPU-heavy"] },
  { name: "Lies of P",                        gpuFactor: 2.7, cpuFactor: 1.8, recRam: 16, up: true, tags: ["Souls-like"] },
  { name: "Dark Souls III",                   gpuFactor: 2.5, cpuFactor: 2.0, recRam: 8,  fpsCap: 60, up: false, tags: ["Souls", "60 FPS cap"] },
  { name: "Sekiro: Shadows Die Twice",        gpuFactor: 2.5, cpuFactor: 2.0, recRam: 8,  fpsCap: 60, up: false, tags: ["Action", "60 FPS cap"] },
  { name: "Nioh 2",                           gpuFactor: 3.0, cpuFactor: 2.5, recRam: 8,  fpsCap: 120, up: false, tags: ["Souls-like"] },
  { name: "Remnant II",                       gpuFactor: 2.0, cpuFactor: 1.5, recRam: 16, up: true, tags: ["Action RPG"] },
  { name: "Final Fantasy XIV",                gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["MMO"] },
  { name: "Genshin Impact",                   gpuFactor: 5.0, cpuFactor: 5.0, recRam: 16, fpsCap: 60, up: false, tags: ["RPG", "60 FPS cap"] },
  { name: "Honkai: Star Rail",                gpuFactor: 5.0, cpuFactor: 5.0, recRam: 8,  fpsCap: 120, up: false, tags: ["RPG"] },
  { name: "Wuthering Waves",                  gpuFactor: 4.0, cpuFactor: 4.0, recRam: 16, fpsCap: 120, up: false, tags: ["RPG"] },
  { name: "S.T.A.L.K.E.R. 2",                 gpuFactor: 1.26, cpuFactor: 1.1, recRam: 16, up: true, tags: ["FPS RPG", "Very demanding"] },
  { name: "Dragon Age: The Veilguard",        gpuFactor: 2.2, cpuFactor: 1.6, recRam: 16, rt: 0.7, up: true, tags: ["RPG"] },
  { name: "Kingdom Come: Deliverance II",     gpuFactor: 1.85, cpuFactor: 1.3, recRam: 16, up: true, tags: ["RPG", "Demanding"] },
  { name: "Persona 5 Royal",                  gpuFactor: 6.7, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["JRPG", "Light"] },

  // ── Open-world / cinematic AAA ──
  { name: "Grand Theft Auto V",               gpuFactor: 3.0, cpuFactor: 1.9, recRam: 8,  up: false, tags: ["Open world", "CPU-heavy"] },
  { name: "Red Dead Redemption 2",            gpuFactor: 2.27, cpuFactor: 1.7, recRam: 16, up: true, tags: ["Open world", "Demanding"] },
  { name: "Hogwarts Legacy",                  gpuFactor: 2.0, cpuFactor: 1.4, recRam: 16, rt: 0.6, up: true, tags: ["Open world", "Demanding"] },
  { name: "Marvel's Spider-Man Remastered",   gpuFactor: 2.5, cpuFactor: 1.3, recRam: 16, rt: 0.7, up: true, tags: ["Action", "CPU-heavy"] },
  { name: "Black Myth: Wukong",               gpuFactor: 1.1, cpuFactor: 1.4, recRam: 16, rt: 0.4, up: true, tags: ["Action RPG", "Very demanding"] },
  { name: "Assassin's Creed Valhalla",        gpuFactor: 2.35, cpuFactor: 1.7, recRam: 16, up: false, tags: ["Open world"] },
  { name: "Assassin's Creed Shadows",         gpuFactor: 1.5, cpuFactor: 1.2, recRam: 16, rt: 0.7, up: true, tags: ["Open world", "Demanding"] },
  { name: "God of War",                       gpuFactor: 2.5, cpuFactor: 2.0, recRam: 16, up: true, tags: ["Action"] },
  { name: "God of War Ragnarök",              gpuFactor: 2.5, cpuFactor: 1.9, recRam: 16, up: true, tags: ["Action"] },
  { name: "Horizon Zero Dawn",                gpuFactor: 2.7, cpuFactor: 1.8, recRam: 16, up: true, tags: ["Open world"] },
  { name: "Horizon Forbidden West",           gpuFactor: 2.0, cpuFactor: 1.6, recRam: 16, up: true, tags: ["Open world", "Demanding"] },
  { name: "The Last of Us Part I",            gpuFactor: 2.2, cpuFactor: 1.5, recRam: 16, up: true, tags: ["Action"] },
  { name: "Ghost of Tsushima",                gpuFactor: 2.7, cpuFactor: 2.0, recRam: 16, up: true, tags: ["Open world"] },
  { name: "Alan Wake 2",                      gpuFactor: 1.5, cpuFactor: 1.6, recRam: 16, rt: 0.45, up: true, tags: ["Horror", "Very demanding"] },
  { name: "Control",                          gpuFactor: 2.35, cpuFactor: 1.8, recRam: 16, rt: 0.6, up: true, tags: ["Action"] },

  // ── Strategy / sim / sports ──
  { name: "Cities: Skylines II",              gpuFactor: 1.2, cpuFactor: 0.6, recRam: 16, up: false, tags: ["City builder", "Very CPU-heavy"] },
  { name: "Total War: Warhammer III",         gpuFactor: 2.0, cpuFactor: 0.9, recRam: 16, up: false, tags: ["Strategy", "CPU-heavy"] },
  { name: "Sid Meier's Civilization VI",      gpuFactor: 5.0, cpuFactor: 2.0, recRam: 8,  up: false, tags: ["Strategy", "CPU-heavy"] },
  { name: "Age of Empires IV",                gpuFactor: 3.4, cpuFactor: 1.8, recRam: 16, up: false, tags: ["Strategy"] },
  { name: "Football Manager 2024",            gpuFactor: 6.7, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Sim", "CPU-heavy"] },
  { name: "Forza Horizon 5",                  gpuFactor: 2.85, cpuFactor: 2.0, recRam: 16, rt: 0.85, up: true, tags: ["Racing"] },
  { name: "Forza Motorsport",                 gpuFactor: 2.5, cpuFactor: 1.9, recRam: 16, rt: 0.8, up: true, tags: ["Racing"] },
  { name: "EA Sports FC 25",                  gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Sports"] },
  { name: "Microsoft Flight Simulator",       gpuFactor: 1.2, cpuFactor: 0.5, recRam: 32, up: true, tags: ["Sim", "Very CPU-heavy"] },

  // ── Fighting / horror / co-op ──
  { name: "Tekken 8",                         gpuFactor: 3.0, cpuFactor: 3.5, recRam: 16, fpsCap: 60, up: false, tags: ["Fighting", "60 FPS cap"] },
  { name: "Street Fighter 6",                 gpuFactor: 3.0, cpuFactor: 3.5, recRam: 16, fpsCap: 60, up: false, tags: ["Fighting", "60 FPS cap"] },
  { name: "Resident Evil 4 (Remake)",         gpuFactor: 3.4, cpuFactor: 2.5, recRam: 16, rt: 0.85, up: false, tags: ["Horror"] },
  { name: "Resident Evil Village",            gpuFactor: 4.2, cpuFactor: 3.0, recRam: 16, rt: 0.85, up: false, tags: ["Horror"] },
  { name: "Lethal Company",                   gpuFactor: 5.0, cpuFactor: 3.5, recRam: 8,  up: false, tags: ["Co-op horror", "Light"] },
  { name: "Phasmophobia",                     gpuFactor: 4.2, cpuFactor: 2.8, recRam: 8,  up: false, tags: ["Co-op horror"] },
  { name: "Content Warning",                  gpuFactor: 5.0, cpuFactor: 3.3, recRam: 8,  up: false, tags: ["Co-op", "Light"] },

  // ── Indie / casual (popular & very light) ──
  { name: "The Sims 4",                       gpuFactor: 4.2, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Life sim"] },
  { name: "Hades",                            gpuFactor: 6.7, cpuFactor: 5.0, recRam: 8,  up: false, tags: ["Roguelike", "Light"] },
  { name: "Hollow Knight",                    gpuFactor: 8.4, cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Metroidvania", "Light"] },
  { name: "Hollow Knight: Silksong",          gpuFactor: 7.6, cpuFactor: 5.5, recRam: 8,  up: false, tags: ["Metroidvania", "Light"] },
  { name: "Cuphead",                          gpuFactor: 6.7, cpuFactor: 5.0, recRam: 8,  up: false, tags: ["Run & gun", "Light"] },
  { name: "Vampire Survivors",                gpuFactor: 10,  cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Roguelike", "Very light"] },
  { name: "Balatro",                          gpuFactor: 10,  cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Card", "Very light"] },
];

if (typeof module !== "undefined" && module.exports) module.exports = { GAME_DATA };
