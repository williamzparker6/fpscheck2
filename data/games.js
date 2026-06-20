/*
 * Per-game demand data.
 *
 * The estimator computes two ceilings and takes the lower one:
 *   gpuBoundFps = gpuFactor * gpuScore * resScale * presetGpu * rtMult * upMult
 *   cpuBoundFps = cpuFactor * cpuScore * presetCpu
 *   fps         = min(gpuBoundFps, cpuBoundFps) * ramFactor  (× frameGen, clamp to cap)
 *
 * Baseline = NATIVE-resolution RASTER at the chosen preset, calibrated so that an
 * RTX 4090 + 7800X3D at 1440p/Ultra matches published benchmark numbers
 * (gpuFactor ≈ that 1440p-Ultra FPS ÷ 59.5). See README for sources.
 *
 *   gpuFactor : raster GPU-bound FPS coefficient (higher = lighter on the GPU)
 *   cpuFactor : CPU FPS-ceiling coefficient    (higher = higher CPU ceiling)
 *   recRam    : RAM (GB) at/above which there's no memory penalty
 *   fpsCap    : optional hard engine cap (e.g. Elden Ring locks to 60)
 *   rt        : raster→ray-tracing multiplier IF the game supports RT (else omit)
 *   up        : true if the game supports DLSS / FSR / XeSS upscaling
 *   fg        : true if the game supports DLSS 3 / FSR 3 Frame Generation
 *   tags      : cosmetic labels shown in the UI / used for search
 *   note      : optional short tip shown with the result
 */
const GAME_DATA = [
  // ── Competitive / esports (CPU-bound at high FPS) ──
  { name: "Counter-Strike 2",                 gpuFactor: 6.7, cpuFactor: 5.0, recRam: 8,  up: false, tags: ["Esports", "Light"], note: "Your CPU sets the ceiling — runs on almost anything." },
  { name: "Valorant",                         gpuFactor: 10,  cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Esports", "Very light"], note: "Extremely light; CPU-limited at very high frame rates." },
  { name: "League of Legends",                gpuFactor: 10,  cpuFactor: 4.0, recRam: 8,  up: false, tags: ["MOBA", "Very light"] },
  { name: "Dota 2",                           gpuFactor: 5.0, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["MOBA"] },
  { name: "Overwatch 2",                      gpuFactor: 6.7, cpuFactor: 4.5, recRam: 8,  fpsCap: 600, up: false, tags: ["Hero shooter", "Light"] },
  { name: "Rainbow Six Siege",                gpuFactor: 8.4, cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Tactical FPS"] },
  { name: "Rocket League",                    gpuFactor: 8.4, cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Sports", "Light"] },
  { name: "Team Fortress 2",                  gpuFactor: 6.7, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["FPS", "Light"] },
  { name: "Apex Legends",                     gpuFactor: 4.2, cpuFactor: 3.0, recRam: 16, fpsCap: 300, up: false, tags: ["Battle Royale"], note: "Engine-capped at 300 FPS." },
  { name: "Fortnite",                         gpuFactor: 3.0, cpuFactor: 2.8, recRam: 16, rt: 0.5, up: true, fg: true, tags: ["Battle Royale"], note: "Performance mode runs far faster than the DX12 / Lumen renderer." },
  { name: "PUBG: Battlegrounds",              gpuFactor: 4.2, cpuFactor: 2.0, recRam: 16, up: false, tags: ["Battle Royale", "CPU-heavy"], note: "CPU-sensitive; stutters in crowded drops." },
  { name: "Call of Duty: Warzone",            gpuFactor: 3.0, cpuFactor: 2.2, recRam: 16, up: true, fg: true, tags: ["Battle Royale"] },
  { name: "Marvel Rivals",                    gpuFactor: 3.0, cpuFactor: 2.2, recRam: 16, rt: 0.7, up: true, fg: true, tags: ["Hero shooter"] },
  { name: "The Finals",                       gpuFactor: 2.7, cpuFactor: 2.0, recRam: 16, up: true, fg: true, tags: ["FPS", "CPU-heavy"], note: "Destruction physics lean hard on the CPU." },
  { name: "Naraka: Bladepoint",               gpuFactor: 3.0, cpuFactor: 2.3, recRam: 16, up: true, tags: ["Battle Royale"] },
  { name: "Dead by Daylight",                 gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Horror", "Multiplayer"] },
  { name: "Fall Guys",                        gpuFactor: 5.0, cpuFactor: 3.5, recRam: 8,  up: false, tags: ["Party", "Light"] },

  // ── Shooters (campaign / PvE) ──
  { name: "Call of Duty: Black Ops 6",        gpuFactor: 3.0, cpuFactor: 2.3, recRam: 16, up: true, fg: true, tags: ["FPS"] },
  { name: "Call of Duty: Modern Warfare III", gpuFactor: 3.0, cpuFactor: 2.3, recRam: 16, up: true, fg: true, tags: ["FPS"] },
  { name: "Battlefield 2042",                 gpuFactor: 2.5, cpuFactor: 2.2, recRam: 16, up: true, tags: ["FPS"] },
  { name: "Battlefield V",                    gpuFactor: 3.4, cpuFactor: 2.5, recRam: 16, rt: 0.7, up: true, tags: ["FPS"] },
  { name: "Battlefield 1",                    gpuFactor: 3.7, cpuFactor: 2.8, recRam: 16, up: false, tags: ["FPS"] },
  { name: "Destiny 2",                        gpuFactor: 3.4, cpuFactor: 2.5, recRam: 16, up: false, tags: ["Looter shooter"] },
  { name: "Halo Infinite",                    gpuFactor: 2.7, cpuFactor: 2.0, recRam: 16, up: false, tags: ["FPS"] },
  { name: "DOOM Eternal",                     gpuFactor: 4.7, cpuFactor: 3.5, recRam: 16, rt: 0.8, up: true, tags: ["FPS", "Well optimized"], note: "Superbly optimized — high FPS even on modest hardware." },
  { name: "DOOM (2016)",                      gpuFactor: 5.0, cpuFactor: 3.8, recRam: 8,  up: false, tags: ["FPS"] },
  { name: "Titanfall 2",                      gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["FPS"] },
  { name: "Escape from Tarkov",               gpuFactor: 2.0, cpuFactor: 1.1, recRam: 16, up: false, tags: ["FPS", "Very CPU-heavy"], note: "Notoriously CPU-bound and unoptimized — more RAM helps." },
  { name: "Hell Let Loose",                   gpuFactor: 2.2, cpuFactor: 1.5, recRam: 16, up: false, tags: ["FPS"] },
  { name: "Left 4 Dead 2",                    gpuFactor: 6.7, cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Co-op", "Light"] },
  { name: "Helldivers 2",                     gpuFactor: 2.2, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Co-op shooter"], note: "Heavier than it looks; busy fights dip the frame rate." },
  { name: "Deep Rock Galactic",               gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Co-op"] },
  { name: "Insurgency: Sandstorm",            gpuFactor: 3.0, cpuFactor: 2.2, recRam: 16, up: false, tags: ["FPS"] },

  // ── Survival / sandbox / crafting ──
  { name: "Minecraft (Java)",                 gpuFactor: 5.0, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Sandbox"], note: "Shaders and render distance change demand dramatically." },
  { name: "Rust",                             gpuFactor: 2.4, cpuFactor: 1.3, recRam: 16, up: true, fg: true, tags: ["Survival"], note: "Server population and draw distance drive performance." },
  { name: "ARK: Survival Ascended",           gpuFactor: 1.2, cpuFactor: 0.9, recRam: 16, rt: 0.7, up: true, fg: true, tags: ["Survival", "Very demanding"], note: "Among the most demanding games made — upscaling is essential." },
  { name: "Valheim",                          gpuFactor: 3.4, cpuFactor: 2.0, recRam: 8,  up: false, tags: ["Survival"] },
  { name: "Terraria",                         gpuFactor: 10,  cpuFactor: 6.0, recRam: 8,  up: false, tags: ["2D", "Very light"] },
  { name: "7 Days to Die",                    gpuFactor: 2.5, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Survival"] },
  { name: "DayZ",                             gpuFactor: 2.4, cpuFactor: 1.1, recRam: 16, up: false, tags: ["Survival", "CPU-heavy"], note: "CPU-bound, especially in cities and high-pop servers." },
  { name: "Palworld",                         gpuFactor: 2.5, cpuFactor: 1.6, recRam: 16, up: true, tags: ["Survival"] },
  { name: "Sons of the Forest",               gpuFactor: 2.0, cpuFactor: 1.4, recRam: 16, up: true, tags: ["Survival horror"] },
  { name: "The Forest",                       gpuFactor: 3.4, cpuFactor: 2.2, recRam: 8,  up: false, tags: ["Survival horror"] },
  { name: "Subnautica",                       gpuFactor: 3.7, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Survival"] },
  { name: "No Man's Sky",                     gpuFactor: 2.7, cpuFactor: 1.8, recRam: 16, up: true, fg: true, tags: ["Exploration"] },
  { name: "Satisfactory",                     gpuFactor: 2.5, cpuFactor: 1.4, recRam: 16, up: true, tags: ["Factory", "CPU-heavy"], note: "Sprawling factories become CPU-bound late-game." },
  { name: "Factorio",                         gpuFactor: 5.0, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Factory", "CPU-heavy"], note: "Late-game megabases are limited by CPU simulation (UPS)." },
  { name: "Stardew Valley",                   gpuFactor: 10,  cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Indie", "Very light"] },
  { name: "Sea of Thieves",                   gpuFactor: 3.4, cpuFactor: 2.2, recRam: 8,  up: false, tags: ["Adventure"] },
  { name: "V Rising",                         gpuFactor: 3.4, cpuFactor: 2.2, recRam: 16, up: true, tags: ["Survival"] },
  { name: "Enshrouded",                       gpuFactor: 2.2, cpuFactor: 1.4, recRam: 16, up: true, tags: ["Survival"] },
  { name: "Grounded",                         gpuFactor: 3.4, cpuFactor: 2.2, recRam: 8,  up: false, tags: ["Survival"] },
  { name: "Raft",                             gpuFactor: 4.7, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Survival", "Light"] },

  // ── RPG / action-RPG ──
  { name: "Cyberpunk 2077",                   gpuFactor: 3.23, cpuFactor: 2.3, recRam: 16, rt: 0.39, up: true, fg: true, tags: ["RPG", "Demanding"], note: "Path tracing is brutal — pair RT with upscaling + Frame Gen." },
  { name: "The Witcher 3 (Next-Gen)",         gpuFactor: 2.27, cpuFactor: 1.6, recRam: 12, rt: 0.5, up: true, fg: true, tags: ["RPG"], note: "RT is heavy; the classic DX11 mode runs much faster." },
  { name: "Elden Ring",                       gpuFactor: 2.0, cpuFactor: 1.2, recRam: 12, fpsCap: 60, rt: 0.75, up: false, tags: ["Souls", "60 FPS cap"], note: "Locked to 60 FPS in-game; mods can uncap it." },
  { name: "Baldur's Gate 3",                  gpuFactor: 2.5, cpuFactor: 1.2, recRam: 16, up: true, tags: ["RPG", "CPU-heavy"], note: "Act 3 (the city) is heavily CPU-bound." },
  { name: "Starfield",                        gpuFactor: 1.7, cpuFactor: 1.1, recRam: 16, up: true, fg: true, tags: ["RPG", "Demanding"], note: "Loves CPU and VRAM; cities tank the frame rate." },
  { name: "Diablo IV",                        gpuFactor: 4.2, cpuFactor: 3.0, recRam: 16, rt: 0.7, up: true, fg: true, tags: ["Action RPG"], note: "Smooth on most hardware; watch VRAM at 4K Ultra." },
  { name: "Diablo III",                       gpuFactor: 6.7, cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Action RPG", "Light"] },
  { name: "Path of Exile",                    gpuFactor: 3.4, cpuFactor: 1.5, recRam: 8,  up: false, tags: ["Action RPG", "CPU-heavy"], note: "Endgame map clears get CPU- and effect-heavy." },
  { name: "Path of Exile 2",                  gpuFactor: 2.5, cpuFactor: 1.8, recRam: 16, up: true, tags: ["Action RPG"] },
  { name: "The Elder Scrolls V: Skyrim SE",   gpuFactor: 4.2, cpuFactor: 2.0, recRam: 8,  up: false, tags: ["RPG"] },
  { name: "Fallout 4",                        gpuFactor: 3.4, cpuFactor: 1.4, recRam: 8,  up: false, tags: ["RPG", "CPU-heavy"], note: "Engine struggles in dense downtown Boston (CPU)." },
  { name: "Monster Hunter: World",            gpuFactor: 2.5, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Action RPG"] },
  { name: "Monster Hunter Wilds",             gpuFactor: 1.3, cpuFactor: 1.1, recRam: 16, up: true, fg: true, tags: ["Action RPG", "Demanding"], note: "Demanding; leans on Frame Gen to feel smooth." },
  { name: "Dragon's Dogma 2",                 gpuFactor: 1.5, cpuFactor: 0.8, recRam: 16, up: true, fg: true, tags: ["RPG", "CPU-heavy"], note: "CPU-bound in towns regardless of your GPU." },
  { name: "Lies of P",                        gpuFactor: 2.7, cpuFactor: 1.8, recRam: 16, up: true, tags: ["Souls-like"] },
  { name: "Dark Souls III",                   gpuFactor: 2.5, cpuFactor: 2.0, recRam: 8,  fpsCap: 60, up: false, tags: ["Souls", "60 FPS cap"], note: "Capped at 60 FPS." },
  { name: "Sekiro: Shadows Die Twice",        gpuFactor: 2.5, cpuFactor: 2.0, recRam: 8,  fpsCap: 60, up: false, tags: ["Action", "60 FPS cap"], note: "Capped at 60 FPS." },
  { name: "Nioh 2",                           gpuFactor: 3.0, cpuFactor: 2.5, recRam: 8,  fpsCap: 120, up: false, tags: ["Souls-like"], note: "Capped at 120 FPS." },
  { name: "Remnant II",                       gpuFactor: 2.0, cpuFactor: 1.5, recRam: 16, up: true, fg: true, tags: ["Action RPG"] },
  { name: "Final Fantasy XIV",                gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["MMO"] },
  { name: "Genshin Impact",                   gpuFactor: 5.0, cpuFactor: 5.0, recRam: 16, fpsCap: 60, up: false, tags: ["RPG", "60 FPS cap"], note: "Capped at 60 FPS." },
  { name: "Honkai: Star Rail",                gpuFactor: 5.0, cpuFactor: 5.0, recRam: 8,  fpsCap: 120, up: false, tags: ["RPG"], note: "Capped at 120 FPS." },
  { name: "Wuthering Waves",                  gpuFactor: 4.0, cpuFactor: 4.0, recRam: 16, fpsCap: 120, up: false, tags: ["RPG"] },
  { name: "S.T.A.L.K.E.R. 2",                 gpuFactor: 1.26, cpuFactor: 1.1, recRam: 16, up: true, fg: true, tags: ["FPS RPG", "Very demanding"], note: "UE5 + Lumen is heavy — upscaling strongly recommended." },
  { name: "Dragon Age: The Veilguard",        gpuFactor: 2.2, cpuFactor: 1.6, recRam: 16, rt: 0.7, up: true, fg: true, tags: ["RPG"] },
  { name: "Kingdom Come: Deliverance II",     gpuFactor: 1.85, cpuFactor: 1.3, recRam: 16, up: true, fg: true, tags: ["RPG", "Demanding"] },
  { name: "Persona 5 Royal",                  gpuFactor: 6.7, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["JRPG", "Light"] },

  // ── Open-world / cinematic AAA ──
  { name: "Grand Theft Auto V",               gpuFactor: 3.0, cpuFactor: 1.9, recRam: 8,  up: false, tags: ["Open world", "CPU-heavy"], note: "Old engine leans on a single fast CPU core." },
  { name: "Red Dead Redemption 2",            gpuFactor: 2.27, cpuFactor: 1.7, recRam: 16, up: true, tags: ["Open world", "Demanding"], note: "Use the Vulkan API; very demanding at max settings." },
  { name: "Hogwarts Legacy",                  gpuFactor: 2.0, cpuFactor: 1.4, recRam: 16, rt: 0.6, up: true, fg: true, tags: ["Open world", "Demanding"], note: "Can exceed 8 GB VRAM with RT — expect stutters on smaller cards." },
  { name: "Marvel's Spider-Man Remastered",   gpuFactor: 2.5, cpuFactor: 1.3, recRam: 16, rt: 0.7, up: true, fg: true, tags: ["Action", "CPU-heavy"], note: "Traversal is CPU-heavy; RT adds even more CPU load." },
  { name: "Black Myth: Wukong",               gpuFactor: 1.1, cpuFactor: 1.4, recRam: 16, rt: 0.4, up: true, fg: true, tags: ["Action RPG", "Very demanding"], note: "Very demanding — use upscaling; full RT needs a top-tier GPU." },
  { name: "Assassin's Creed Valhalla",        gpuFactor: 2.35, cpuFactor: 1.7, recRam: 16, up: false, tags: ["Open world"] },
  { name: "Assassin's Creed Shadows",         gpuFactor: 1.5, cpuFactor: 1.2, recRam: 16, rt: 0.7, up: true, fg: true, tags: ["Open world", "Demanding"] },
  { name: "God of War",                       gpuFactor: 2.5, cpuFactor: 2.0, recRam: 16, up: true, tags: ["Action"] },
  { name: "God of War Ragnarök",              gpuFactor: 2.5, cpuFactor: 1.9, recRam: 16, up: true, fg: true, tags: ["Action"] },
  { name: "Horizon Zero Dawn",                gpuFactor: 2.7, cpuFactor: 1.8, recRam: 16, up: true, tags: ["Open world"] },
  { name: "Horizon Forbidden West",           gpuFactor: 2.0, cpuFactor: 1.6, recRam: 16, up: true, fg: true, tags: ["Open world", "Demanding"] },
  { name: "The Last of Us Part I",            gpuFactor: 2.2, cpuFactor: 1.5, recRam: 16, up: true, fg: true, tags: ["Action"], note: "VRAM-hungry; shader compilation can stutter early on." },
  { name: "Ghost of Tsushima",                gpuFactor: 2.7, cpuFactor: 2.0, recRam: 16, up: true, fg: true, tags: ["Open world"] },
  { name: "Alan Wake 2",                      gpuFactor: 1.5, cpuFactor: 1.6, recRam: 16, rt: 0.45, up: true, fg: true, tags: ["Horror", "Very demanding"], note: "Cutting-edge visuals; mesh shaders need a newer GPU." },
  { name: "Control",                          gpuFactor: 2.35, cpuFactor: 1.8, recRam: 16, rt: 0.6, up: true, tags: ["Action"] },

  // ── Strategy / sim / sports ──
  { name: "Cities: Skylines II",              gpuFactor: 1.2, cpuFactor: 0.6, recRam: 16, up: false, tags: ["City builder", "Very CPU-heavy"], note: "Simulation is CPU-bound — big cities crawl on any GPU." },
  { name: "Total War: Warhammer III",         gpuFactor: 2.0, cpuFactor: 0.9, recRam: 16, up: false, tags: ["Strategy", "CPU-heavy"], note: "Huge battles hammer the CPU." },
  { name: "Sid Meier's Civilization VI",      gpuFactor: 5.0, cpuFactor: 2.0, recRam: 8,  up: false, tags: ["Strategy", "CPU-heavy"], note: "Late-game turn times depend on the CPU." },
  { name: "Age of Empires IV",                gpuFactor: 3.4, cpuFactor: 1.8, recRam: 16, up: false, tags: ["Strategy"] },
  { name: "Football Manager 2024",            gpuFactor: 6.7, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Sim", "CPU-heavy"], note: "The 3D match engine is light; CPU drives simulation speed." },
  { name: "Forza Horizon 5",                  gpuFactor: 2.85, cpuFactor: 2.0, recRam: 16, rt: 0.85, up: true, fg: true, tags: ["Racing"] },
  { name: "Forza Motorsport",                 gpuFactor: 2.5, cpuFactor: 1.9, recRam: 16, rt: 0.8, up: true, fg: true, tags: ["Racing"] },
  { name: "EA Sports FC 25",                  gpuFactor: 4.2, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Sports"] },
  { name: "Microsoft Flight Simulator",       gpuFactor: 1.2, cpuFactor: 0.5, recRam: 32, up: true, fg: true, tags: ["Sim", "Very CPU-heavy"], note: "Heavily CPU- and RAM-bound; the GPU matters least here." },

  // ── Fighting / horror / co-op ──
  { name: "Tekken 8",                         gpuFactor: 3.0, cpuFactor: 3.5, recRam: 16, fpsCap: 60, up: false, tags: ["Fighting", "60 FPS cap"], note: "Gameplay runs at a fixed 60 FPS." },
  { name: "Street Fighter 6",                 gpuFactor: 3.0, cpuFactor: 3.5, recRam: 16, fpsCap: 60, up: false, tags: ["Fighting", "60 FPS cap"], note: "Gameplay runs at a fixed 60 FPS." },
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

  // ════════════════════════ Additional titles ════════════════════════
  // Same calibration as above (native-raster 1440p/Ultra baseline). Demanding
  // 2024–25 titles cross-checked against published RTX 4090 reviews.

  // ── More shooters ──
  { name: "Call of Duty: Modern Warfare II (2022)", gpuFactor: 3.0, cpuFactor: 2.3, recRam: 16, up: true, tags: ["FPS"] },
  { name: "Battlefield 4",                    gpuFactor: 4.0, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["FPS"], note: "Scales with 64-player servers (CPU)." },
  { name: "Far Cry 6",                        gpuFactor: 2.2, cpuFactor: 2.0, recRam: 16, rt: 0.8, up: true, tags: ["Open world"], note: "VRAM-hungry HD textures; light on the CPU." },
  { name: "Metro Exodus Enhanced Edition",    gpuFactor: 2.0, cpuFactor: 2.2, recRam: 16, rt: 0.65, up: true, tags: ["FPS", "Demanding"], note: "Ray-traced lighting is always on in the Enhanced Edition." },
  { name: "Crysis Remastered",                gpuFactor: 2.2, cpuFactor: 1.5, recRam: 16, rt: 0.7, up: false, tags: ["FPS", "CPU-heavy"], note: "Still CPU-limited — yes, it runs Crysis." },
  { name: "Borderlands 3",                    gpuFactor: 2.8, cpuFactor: 2.5, recRam: 16, up: false, tags: ["Looter shooter"] },
  { name: "Hunt: Showdown 1896",             gpuFactor: 2.5, cpuFactor: 2.0, recRam: 16, up: true, tags: ["FPS"] },
  { name: "Ready or Not",                     gpuFactor: 2.5, cpuFactor: 2.2, recRam: 16, up: true, tags: ["Tactical FPS"] },
  { name: "Payday 3",                         gpuFactor: 2.8, cpuFactor: 2.5, recRam: 16, up: true, tags: ["Co-op FPS"] },
  { name: "Tom Clancy's The Division 2",      gpuFactor: 2.5, cpuFactor: 2.5, recRam: 16, up: false, tags: ["Looter shooter"] },
  { name: "Warframe",                         gpuFactor: 5.0, cpuFactor: 4.0, recRam: 8,  up: true, tags: ["Looter shooter", "Light"], note: "Very scalable — runs on almost anything." },
  { name: "Squad",                            gpuFactor: 2.0, cpuFactor: 1.5, recRam: 16, up: false, tags: ["FPS", "CPU-heavy"], note: "100-player battles are CPU-bound." },
  { name: "BattleBit Remastered",             gpuFactor: 8.0, cpuFactor: 6.0, recRam: 8,  up: false, tags: ["FPS", "Very light"], note: "Low-poly — runs on a potato." },
  { name: "Warhammer 40,000: Space Marine 2", gpuFactor: 1.7, cpuFactor: 1.4, recRam: 16, up: true, fg: true, tags: ["Co-op shooter", "CPU-heavy"], note: "Heavily CPU-bound, even at 4K." },
  { name: "Indiana Jones and the Great Circle", gpuFactor: 2.65, cpuFactor: 2.5, recRam: 16, rt: 0.32, up: true, fg: true, tags: ["Action", "Demanding"], note: "Ray tracing is always on; path tracing needs a top GPU + upscaling." },
  { name: "DOOM: The Dark Ages",              gpuFactor: 2.4, cpuFactor: 3.0, recRam: 16, rt: 0.45, up: true, fg: true, tags: ["FPS", "Demanding"], note: "Ray tracing is always on; idTech keeps it smooth." },

  // ── More multiplayer / MOBA ──
  { name: "Deadlock",                         gpuFactor: 3.5, cpuFactor: 3.0, recRam: 16, up: false, tags: ["MOBA shooter"], note: "Source 2; leans on the CPU in teamfights." },
  { name: "Among Us",                         gpuFactor: 12,  cpuFactor: 12,  recRam: 8,  up: false, tags: ["Party", "Very light"] },
  { name: "Brawlhalla",                       gpuFactor: 10,  cpuFactor: 10,  recRam: 8,  up: false, tags: ["Fighting", "Very light"] },
  { name: "Heroes of the Storm",              gpuFactor: 5.0, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["MOBA"] },
  { name: "Smite 2",                          gpuFactor: 4.0, cpuFactor: 3.5, recRam: 16, up: true, tags: ["MOBA"] },

  // ── More strategy / grand strategy / sim ──
  { name: "StarCraft II",                     gpuFactor: 5.0, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["RTS", "CPU-heavy"], note: "Big battles are single-thread CPU-bound." },
  { name: "Age of Empires II: Definitive Edition", gpuFactor: 5.0, cpuFactor: 3.5, recRam: 8, up: false, tags: ["RTS"] },
  { name: "Company of Heroes 3",              gpuFactor: 2.5, cpuFactor: 1.5, recRam: 16, up: false, tags: ["RTS", "CPU-heavy"] },
  { name: "Total War: Three Kingdoms",        gpuFactor: 2.2, cpuFactor: 1.2, recRam: 16, up: false, tags: ["Strategy", "CPU-heavy"], note: "Large battles are CPU-bound." },
  { name: "Sid Meier's Civilization VII",     gpuFactor: 4.5, cpuFactor: 1.8, recRam: 16, up: false, tags: ["Strategy", "CPU-heavy"], note: "Late-game turn times depend on the CPU." },
  { name: "Crusader Kings III",               gpuFactor: 6.0, cpuFactor: 2.0, recRam: 8,  up: false, tags: ["Grand strategy", "CPU-heavy"], note: "Late-game speed is CPU-bound, not the GPU." },
  { name: "Hearts of Iron IV",                gpuFactor: 6.0, cpuFactor: 1.5, recRam: 8,  up: false, tags: ["Grand strategy", "CPU-heavy"], note: "Late-game date processing is CPU-bound." },
  { name: "Stellaris",                        gpuFactor: 6.0, cpuFactor: 1.5, recRam: 8,  up: false, tags: ["Grand strategy", "CPU-heavy"], note: "End-game lag is CPU simulation, not the GPU." },
  { name: "Europa Universalis IV",            gpuFactor: 6.0, cpuFactor: 1.8, recRam: 8,  up: false, tags: ["Grand strategy"] },
  { name: "Anno 1800",                        gpuFactor: 2.5, cpuFactor: 1.2, recRam: 16, up: false, tags: ["City builder", "CPU-heavy"], note: "Sprawling islands are CPU-bound." },
  { name: "Manor Lords",                      gpuFactor: 2.5, cpuFactor: 1.5, recRam: 16, up: true, tags: ["City builder"] },
  { name: "Frostpunk 2",                      gpuFactor: 2.8, cpuFactor: 1.8, recRam: 16, up: false, tags: ["City builder"] },
  { name: "XCOM 2",                           gpuFactor: 3.5, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Strategy"] },
  { name: "Mount & Blade II: Bannerlord",     gpuFactor: 3.0, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Action RPG", "CPU-heavy"], note: "1000-unit battles are CPU-bound." },
  { name: "RimWorld",                         gpuFactor: 12,  cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Sim", "CPU-heavy"], note: "2D colony sim; big colonies tax the CPU." },
  { name: "Dyson Sphere Program",             gpuFactor: 5.0, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Factory", "CPU-heavy"] },
  { name: "Cities: Skylines",                 gpuFactor: 3.0, cpuFactor: 1.2, recRam: 16, up: false, tags: ["City builder", "CPU-heavy"], note: "Big modded cities are CPU-bound." },
  { name: "Age of Mythology: Retold",         gpuFactor: 3.5, cpuFactor: 2.0, recRam: 16, up: false, tags: ["RTS"] },

  // ── More RPG / JRPG / action-RPG / MMO ──
  { name: "World of Warcraft",                gpuFactor: 3.5, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["MMO"], note: "Raids and capital cities are CPU-bound." },
  { name: "The Elder Scrolls Online",         gpuFactor: 3.0, cpuFactor: 2.2, recRam: 8,  up: false, tags: ["MMO"] },
  { name: "Final Fantasy XVI",                gpuFactor: 1.4, cpuFactor: 1.8, recRam: 16, up: true, fg: true, tags: ["Action RPG", "Demanding"], note: "Demanding; leans on Frame Gen to feel smooth." },
  { name: "Final Fantasy VII Rebirth",        gpuFactor: 1.6, cpuFactor: 1.8, recRam: 16, up: true, fg: true, tags: ["Action RPG", "Demanding"] },
  { name: "Metaphor: ReFantazio",             gpuFactor: 3.0, cpuFactor: 2.5, recRam: 16, up: false, tags: ["JRPG"] },
  { name: "Persona 3 Reload",                 gpuFactor: 4.0, cpuFactor: 3.0, recRam: 16, up: false, tags: ["JRPG"] },
  { name: "Divinity: Original Sin 2",         gpuFactor: 4.0, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["RPG"] },
  { name: "Last Epoch",                       gpuFactor: 3.5, cpuFactor: 2.0, recRam: 16, up: false, tags: ["Action RPG", "CPU-heavy"], note: "Endgame builds get CPU- and effect-heavy." },
  { name: "Diablo II: Resurrected",           gpuFactor: 5.0, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["Action RPG"] },
  { name: "Grim Dawn",                        gpuFactor: 4.5, cpuFactor: 2.5, recRam: 8,  up: false, tags: ["Action RPG"] },
  { name: "Wo Long: Fallen Dynasty",          gpuFactor: 3.0, cpuFactor: 2.5, recRam: 16, up: true, tags: ["Souls-like"] },
  { name: "Stellar Blade",                    gpuFactor: 2.2, cpuFactor: 2.0, recRam: 16, up: true, fg: true, tags: ["Action"], note: "UE4; a well-optimized console port." },
  { name: "Clair Obscur: Expedition 33",      gpuFactor: 1.1, cpuFactor: 1.8, recRam: 16, up: true, fg: true, tags: ["RPG", "Demanding"], note: "UE5 + Lumen — upscaling recommended." },
  { name: "Avowed",                           gpuFactor: 2.0, cpuFactor: 1.6, recRam: 16, up: true, fg: true, tags: ["RPG"], note: "UE5; demanding in dense areas." },
  { name: "The Outer Worlds",                 gpuFactor: 3.0, cpuFactor: 2.2, recRam: 16, up: false, tags: ["RPG"] },
  { name: "Atomic Heart",                     gpuFactor: 2.5, cpuFactor: 2.5, recRam: 16, rt: 0.7, up: true, tags: ["FPS RPG"] },
  { name: "Lost Ark",                         gpuFactor: 4.0, cpuFactor: 3.0, recRam: 16, up: false, tags: ["MMO ARPG"] },
  { name: "Throne and Liberty",               gpuFactor: 2.5, cpuFactor: 2.0, recRam: 16, up: true, tags: ["MMO"] },
  { name: "New World: Aeternum",              gpuFactor: 2.8, cpuFactor: 2.2, recRam: 16, up: false, tags: ["MMO"] },
  { name: "Zenless Zone Zero",                gpuFactor: 5.0, cpuFactor: 5.0, recRam: 16, fpsCap: 60, up: false, tags: ["Action RPG", "60 FPS cap"], note: "Capped at 60 FPS." },
  { name: "Pathfinder: Wrath of the Righteous", gpuFactor: 4.0, cpuFactor: 2.5, recRam: 8, up: false, tags: ["RPG"] },
  { name: "Warhammer 40,000: Rogue Trader",   gpuFactor: 3.5, cpuFactor: 2.0, recRam: 16, up: false, tags: ["RPG"] },
  { name: "Hades II",                         gpuFactor: 6.0, cpuFactor: 5.0, recRam: 8,  up: false, tags: ["Roguelike", "Light"] },
  { name: "Risk of Rain 2",                   gpuFactor: 6.0, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["Roguelike"], note: "Late runs with hordes get CPU-bound." },
  { name: "Dead Cells",                       gpuFactor: 10,  cpuFactor: 8.0, recRam: 8,  up: false, tags: ["Roguelike", "Very light"] },
  { name: "Slay the Spire",                   gpuFactor: 12,  cpuFactor: 12,  recRam: 8,  up: false, tags: ["Card", "Very light"] },
  { name: "Cult of the Lamb",                 gpuFactor: 8.0, cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Roguelike", "Light"] },
  { name: "Celeste",                          gpuFactor: 10,  cpuFactor: 10,  recRam: 8,  up: false, tags: ["Platformer", "Very light"] },
  { name: "Outer Wilds",                      gpuFactor: 5.0, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["Adventure"] },
  { name: "Dave the Diver",                   gpuFactor: 8.0, cpuFactor: 6.0, recRam: 8,  up: false, tags: ["Indie", "Light"] },

  // ── More open-world / action / horror ──
  { name: "Dying Light 2 Stay Human",         gpuFactor: 2.0, cpuFactor: 2.0, recRam: 16, rt: 0.5, up: true, fg: true, tags: ["Open world"], note: "Ray-traced global illumination is heavy." },
  { name: "Dying Light",                      gpuFactor: 3.5, cpuFactor: 3.0, recRam: 8,  up: false, tags: ["Open world"] },
  { name: "Watch Dogs: Legion",               gpuFactor: 2.0, cpuFactor: 1.8, recRam: 16, rt: 0.55, up: true, tags: ["Open world", "CPU-heavy"], note: "RT reflections + dense city tax the CPU." },
  { name: "Saints Row (2022)",                gpuFactor: 2.5, cpuFactor: 2.0, recRam: 16, up: false, tags: ["Open world"] },
  { name: "Mafia: Definitive Edition",        gpuFactor: 3.0, cpuFactor: 2.8, recRam: 8,  up: false, tags: ["Action"] },
  { name: "Sleeping Dogs: Definitive Edition", gpuFactor: 4.0, cpuFactor: 3.5, recRam: 8, up: false, tags: ["Open world"] },
  { name: "Death Stranding Director's Cut",   gpuFactor: 3.0, cpuFactor: 3.0, recRam: 16, up: true, fg: true, tags: ["Action"], note: "Decima engine — beautifully optimized." },
  { name: "Star Wars Jedi: Survivor",         gpuFactor: 1.7, cpuFactor: 1.2, recRam: 16, up: true, fg: true, tags: ["Action", "CPU-heavy"], note: "CPU-bound and stutter-prone." },
  { name: "Star Wars Jedi: Fallen Order",     gpuFactor: 3.0, cpuFactor: 2.5, recRam: 16, up: false, tags: ["Action"] },
  { name: "Star Wars Outlaws",                gpuFactor: 0.9, cpuFactor: 1.6, recRam: 16, rt: 0.7, up: true, fg: true, tags: ["Open world", "Very demanding"], note: "Very demanding — relies on upscaling + Frame Gen." },
  { name: "Avatar: Frontiers of Pandora",     gpuFactor: 1.36, cpuFactor: 2.0, recRam: 16, up: true, fg: true, tags: ["Open world", "Very demanding"], note: "'Unobtanium' max settings need a top GPU + upscaling." },
  { name: "Shadow of the Tomb Raider",        gpuFactor: 3.0, cpuFactor: 2.8, recRam: 16, rt: 0.7, up: true, tags: ["Action"] },
  { name: "Uncharted: Legacy of Thieves",     gpuFactor: 2.5, cpuFactor: 2.0, recRam: 16, up: true, tags: ["Action"] },
  { name: "Sifu",                             gpuFactor: 4.0, cpuFactor: 3.5, recRam: 16, up: false, tags: ["Action"] },
  { name: "Stray",                            gpuFactor: 4.0, cpuFactor: 3.5, recRam: 16, up: true, tags: ["Adventure"] },
  { name: "It Takes Two",                     gpuFactor: 4.5, cpuFactor: 3.5, recRam: 16, up: false, tags: ["Co-op"] },
  { name: "Split Fiction",                    gpuFactor: 3.0, cpuFactor: 2.5, recRam: 16, up: true, fg: true, tags: ["Co-op"] },
  { name: "Dead Space (2023)",                gpuFactor: 1.9, cpuFactor: 1.8, recRam: 16, up: true, tags: ["Horror", "Demanding"], note: "VRAM-heavy; some traversal stutter." },
  { name: "Silent Hill 2 (2024)",             gpuFactor: 1.3, cpuFactor: 1.8, recRam: 16, up: true, fg: true, tags: ["Horror", "Demanding"], note: "UE5 — prone to traversal stutter." },
  { name: "The Callisto Protocol",            gpuFactor: 2.0, cpuFactor: 2.0, recRam: 16, rt: 0.6, up: true, tags: ["Horror"], note: "Infamous shader-compilation stutter." },
  { name: "Alien: Isolation",                 gpuFactor: 6.0, cpuFactor: 5.0, recRam: 8,  up: false, tags: ["Horror"] },
  { name: "The Outlast Trials",               gpuFactor: 3.5, cpuFactor: 3.0, recRam: 16, up: true, tags: ["Co-op horror"] },
  { name: "R.E.P.O.",                         gpuFactor: 5.0, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["Co-op horror", "Light"] },
  { name: "Schedule I",                       gpuFactor: 5.0, cpuFactor: 3.5, recRam: 8,  up: false, tags: ["Sim", "Light"] },
  { name: "PEAK",                             gpuFactor: 5.0, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["Co-op", "Light"] },

  // ── Racing / sports ──
  { name: "F1 24",                            gpuFactor: 2.5, cpuFactor: 2.5, recRam: 16, rt: 0.7, up: true, fg: true, tags: ["Racing"] },
  { name: "Assetto Corsa Competizione",       gpuFactor: 2.0, cpuFactor: 2.0, recRam: 16, up: true, tags: ["Racing", "Sim"] },
  { name: "Assetto Corsa",                    gpuFactor: 5.0, cpuFactor: 4.0, recRam: 8,  up: false, tags: ["Racing", "Sim"] },
  { name: "BeamNG.drive",                     gpuFactor: 3.5, cpuFactor: 1.5, recRam: 16, up: false, tags: ["Sim", "CPU-heavy"], note: "Soft-body crash physics is heavily CPU-bound." },
  { name: "EA Sports WRC",                    gpuFactor: 2.8, cpuFactor: 2.5, recRam: 16, up: true, tags: ["Racing"] },
  { name: "NBA 2K25",                         gpuFactor: 3.0, cpuFactor: 2.8, recRam: 16, up: false, tags: ["Sports"] },
  { name: "Need for Speed Unbound",           gpuFactor: 2.8, cpuFactor: 2.5, recRam: 16, up: true, tags: ["Racing"] },

  // ── More fighting ──
  { name: "Mortal Kombat 1",                  gpuFactor: 3.0, cpuFactor: 3.5, recRam: 16, up: false, tags: ["Fighting"] },
  { name: "Guilty Gear Strive",               gpuFactor: 5.0, cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Fighting"] },
  { name: "Dragon Ball: Sparking Zero",       gpuFactor: 3.0, cpuFactor: 3.0, recRam: 16, up: true, tags: ["Fighting"] },
  { name: "Dragon Ball FighterZ",             gpuFactor: 5.0, cpuFactor: 4.5, recRam: 8,  up: false, tags: ["Fighting"] },
];

if (typeof module !== "undefined" && module.exports) module.exports = { GAME_DATA };
