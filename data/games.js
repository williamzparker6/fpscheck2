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
 *   tags       : cosmetic labels shown in the UI / used for search
 */
const GAME_DATA = [
  // ── Competitive / esports (light, high frame rates) ──
  { name: "Counter-Strike 2",                 gpuFactor: 5.0, cpuFactor: 6.5, recRam: 8,  tags: ["Esports", "Light"] },
  { name: "Valorant",                         gpuFactor: 7.0, cpuFactor: 9.0, recRam: 8,  tags: ["Esports", "Very light"] },
  { name: "League of Legends",                gpuFactor: 7.0, cpuFactor: 9.0, recRam: 8,  tags: ["MOBA", "Very light"] },
  { name: "Dota 2",                           gpuFactor: 4.5, cpuFactor: 5.5, recRam: 8,  tags: ["MOBA"] },
  { name: "Overwatch 2",                      gpuFactor: 4.0, cpuFactor: 5.0, recRam: 8,  fpsCap: 600, tags: ["Hero shooter", "Light"] },
  { name: "Rainbow Six Siege",                gpuFactor: 4.0, cpuFactor: 4.5, recRam: 8,  tags: ["Tactical FPS"] },
  { name: "Rocket League",                    gpuFactor: 5.0, cpuFactor: 7.0, recRam: 8,  tags: ["Sports", "Light"] },
  { name: "Team Fortress 2",                  gpuFactor: 4.5, cpuFactor: 5.0, recRam: 8,  tags: ["FPS", "Light"] },
  { name: "Apex Legends",                     gpuFactor: 2.8, cpuFactor: 3.4, recRam: 16, fpsCap: 300, tags: ["Battle Royale"] },
  { name: "Fortnite",                         gpuFactor: 2.3, cpuFactor: 3.6, recRam: 16, tags: ["Battle Royale"] },
  { name: "PUBG: Battlegrounds",              gpuFactor: 2.3, cpuFactor: 1.9, recRam: 16, tags: ["Battle Royale", "CPU-heavy"] },
  { name: "Call of Duty: Warzone",            gpuFactor: 2.0, cpuFactor: 2.3, recRam: 16, tags: ["Battle Royale"] },
  { name: "Marvel Rivals",                    gpuFactor: 2.0, cpuFactor: 2.5, recRam: 16, tags: ["Hero shooter"] },
  { name: "The Finals",                       gpuFactor: 2.2, cpuFactor: 2.6, recRam: 16, tags: ["FPS", "CPU-heavy"] },
  { name: "Naraka: Bladepoint",               gpuFactor: 2.5, cpuFactor: 3.0, recRam: 16, tags: ["Battle Royale"] },
  { name: "Dead by Daylight",                 gpuFactor: 4.0, cpuFactor: 5.0, recRam: 8,  tags: ["Horror", "Multiplayer"] },
  { name: "Fall Guys",                        gpuFactor: 4.5, cpuFactor: 6.0, recRam: 8,  tags: ["Party", "Light"] },

  // ── Shooters (campaign / PvE) ──
  { name: "Call of Duty: Black Ops 6",        gpuFactor: 1.9, cpuFactor: 2.3, recRam: 16, tags: ["FPS"] },
  { name: "Call of Duty: Modern Warfare III", gpuFactor: 1.9, cpuFactor: 2.3, recRam: 16, tags: ["FPS"] },
  { name: "Battlefield 2042",                 gpuFactor: 1.8, cpuFactor: 2.4, recRam: 16, tags: ["FPS"] },
  { name: "Battlefield V",                    gpuFactor: 2.5, cpuFactor: 3.0, recRam: 16, tags: ["FPS"] },
  { name: "Battlefield 1",                    gpuFactor: 2.8, cpuFactor: 3.2, recRam: 16, tags: ["FPS"] },
  { name: "Destiny 2",                        gpuFactor: 2.8, cpuFactor: 3.0, recRam: 16, tags: ["Looter shooter"] },
  { name: "Halo Infinite",                    gpuFactor: 2.2, cpuFactor: 2.5, recRam: 16, tags: ["FPS"] },
  { name: "DOOM Eternal",                     gpuFactor: 3.2, cpuFactor: 3.6, recRam: 16, tags: ["FPS", "Well optimized"] },
  { name: "DOOM (2016)",                      gpuFactor: 3.6, cpuFactor: 4.0, recRam: 8,  tags: ["FPS"] },
  { name: "Titanfall 2",                      gpuFactor: 3.5, cpuFactor: 4.0, recRam: 8,  tags: ["FPS"] },
  { name: "Escape from Tarkov",               gpuFactor: 1.5, cpuFactor: 1.2, recRam: 16, tags: ["FPS", "Very CPU-heavy"] },
  { name: "Hell Let Loose",                   gpuFactor: 1.8, cpuFactor: 2.0, recRam: 16, tags: ["FPS"] },
  { name: "Left 4 Dead 2",                    gpuFactor: 6.0, cpuFactor: 7.0, recRam: 8,  tags: ["Co-op", "Light"] },
  { name: "Helldivers 2",                     gpuFactor: 2.0, cpuFactor: 2.2, recRam: 16, tags: ["Co-op shooter"] },
  { name: "Deep Rock Galactic",               gpuFactor: 3.5, cpuFactor: 4.0, recRam: 8,  tags: ["Co-op"] },
  { name: "Insurgency: Sandstorm",            gpuFactor: 2.5, cpuFactor: 3.0, recRam: 16, tags: ["FPS"] },

  // ── Survival / sandbox / crafting ──
  { name: "Minecraft (Java)",                 gpuFactor: 4.5, cpuFactor: 4.0, recRam: 8,  tags: ["Sandbox"] },
  { name: "Rust",                             gpuFactor: 1.8, cpuFactor: 1.8, recRam: 16, tags: ["Survival"] },
  { name: "ARK: Survival Ascended",           gpuFactor: 0.9, cpuFactor: 1.2, recRam: 16, tags: ["Survival", "Very demanding"] },
  { name: "Valheim",                          gpuFactor: 3.0, cpuFactor: 3.0, recRam: 8,  tags: ["Survival"] },
  { name: "Terraria",                         gpuFactor: 10,  cpuFactor: 12,  recRam: 8,  tags: ["2D", "Very light"] },
  { name: "7 Days to Die",                    gpuFactor: 2.5, cpuFactor: 2.5, recRam: 16, tags: ["Survival"] },
  { name: "DayZ",                             gpuFactor: 2.0, cpuFactor: 1.8, recRam: 16, tags: ["Survival", "CPU-heavy"] },
  { name: "Palworld",                         gpuFactor: 2.5, cpuFactor: 2.5, recRam: 16, tags: ["Survival"] },
  { name: "Sons of the Forest",               gpuFactor: 1.8, cpuFactor: 2.0, recRam: 16, tags: ["Survival horror"] },
  { name: "The Forest",                       gpuFactor: 2.8, cpuFactor: 3.0, recRam: 8,  tags: ["Survival horror"] },
  { name: "Subnautica",                       gpuFactor: 3.0, cpuFactor: 3.5, recRam: 8,  tags: ["Survival"] },
  { name: "No Man's Sky",                     gpuFactor: 2.5, cpuFactor: 2.8, recRam: 16, tags: ["Exploration"] },
  { name: "Satisfactory",                     gpuFactor: 2.2, cpuFactor: 2.0, recRam: 16, tags: ["Factory", "CPU-heavy"] },
  { name: "Factorio",                         gpuFactor: 6.0, cpuFactor: 3.0, recRam: 8,  tags: ["Factory", "CPU-heavy"] },
  { name: "Stardew Valley",                   gpuFactor: 12,  cpuFactor: 14,  recRam: 8,  tags: ["Indie", "Very light"] },
  { name: "Sea of Thieves",                   gpuFactor: 3.0, cpuFactor: 3.5, recRam: 8,  tags: ["Adventure"] },
  { name: "V Rising",                         gpuFactor: 3.0, cpuFactor: 3.2, recRam: 16, tags: ["Survival"] },
  { name: "Enshrouded",                       gpuFactor: 2.0, cpuFactor: 2.0, recRam: 16, tags: ["Survival"] },
  { name: "Grounded",                         gpuFactor: 3.0, cpuFactor: 3.2, recRam: 8,  tags: ["Survival"] },
  { name: "Raft",                             gpuFactor: 4.0, cpuFactor: 4.5, recRam: 8,  tags: ["Survival", "Light"] },

  // ── RPG / action-RPG ──
  { name: "Cyberpunk 2077",                   gpuFactor: 1.6, cpuFactor: 2.1, recRam: 16, tags: ["RPG", "Demanding"] },
  { name: "The Witcher 3 (Next-Gen)",         gpuFactor: 1.4, cpuFactor: 1.7, recRam: 12, tags: ["RPG"] },
  { name: "Elden Ring",                       gpuFactor: 1.3, cpuFactor: 1.2, recRam: 12, fpsCap: 60, tags: ["Souls", "60 FPS cap"] },
  { name: "Baldur's Gate 3",                  gpuFactor: 1.8, cpuFactor: 1.2, recRam: 16, tags: ["RPG", "CPU-heavy"] },
  { name: "Starfield",                        gpuFactor: 1.0, cpuFactor: 1.1, recRam: 16, tags: ["RPG", "Demanding"] },
  { name: "Diablo IV",                        gpuFactor: 2.5, cpuFactor: 3.0, recRam: 16, tags: ["Action RPG"] },
  { name: "Diablo III",                       gpuFactor: 5.0, cpuFactor: 6.0, recRam: 8,  tags: ["Action RPG", "Light"] },
  { name: "Path of Exile",                    gpuFactor: 2.5, cpuFactor: 2.0, recRam: 8,  tags: ["Action RPG", "CPU-heavy"] },
  { name: "Path of Exile 2",                  gpuFactor: 2.2, cpuFactor: 2.5, recRam: 16, tags: ["Action RPG"] },
  { name: "The Elder Scrolls V: Skyrim SE",   gpuFactor: 3.5, cpuFactor: 3.0, recRam: 8,  tags: ["RPG"] },
  { name: "Fallout 4",                        gpuFactor: 3.0, cpuFactor: 2.5, recRam: 8,  tags: ["RPG", "CPU-heavy"] },
  { name: "Monster Hunter: World",            gpuFactor: 2.0, cpuFactor: 2.0, recRam: 16, tags: ["Action RPG"] },
  { name: "Monster Hunter Wilds",             gpuFactor: 1.0, cpuFactor: 1.3, recRam: 16, tags: ["Action RPG", "Demanding"] },
  { name: "Dragon's Dogma 2",                 gpuFactor: 1.2, cpuFactor: 1.0, recRam: 16, tags: ["RPG", "CPU-heavy"] },
  { name: "Lies of P",                        gpuFactor: 2.0, cpuFactor: 2.2, recRam: 16, tags: ["Souls-like"] },
  { name: "Dark Souls III",                   gpuFactor: 2.5, cpuFactor: 2.0, recRam: 8,  fpsCap: 60, tags: ["Souls", "60 FPS cap"] },
  { name: "Sekiro: Shadows Die Twice",        gpuFactor: 2.0, cpuFactor: 1.8, recRam: 8,  fpsCap: 60, tags: ["Action", "60 FPS cap"] },
  { name: "Nioh 2",                           gpuFactor: 2.5, cpuFactor: 2.2, recRam: 8,  fpsCap: 120, tags: ["Souls-like"] },
  { name: "Remnant II",                       gpuFactor: 1.6, cpuFactor: 1.8, recRam: 16, tags: ["Action RPG"] },
  { name: "Final Fantasy XIV",                gpuFactor: 3.0, cpuFactor: 3.5, recRam: 8,  tags: ["MMO"] },
  { name: "Genshin Impact",                   gpuFactor: 4.0, cpuFactor: 5.0, recRam: 16, fpsCap: 60, tags: ["RPG", "60 FPS cap"] },
  { name: "Honkai: Star Rail",                gpuFactor: 4.5, cpuFactor: 5.5, recRam: 8,  fpsCap: 120, tags: ["RPG"] },
  { name: "Wuthering Waves",                  gpuFactor: 3.0, cpuFactor: 3.5, recRam: 16, fpsCap: 120, tags: ["RPG"] },
  { name: "S.T.A.L.K.E.R. 2",                 gpuFactor: 0.9, cpuFactor: 1.3, recRam: 16, tags: ["FPS RPG", "Very demanding"] },
  { name: "Dragon Age: The Veilguard",        gpuFactor: 1.4, cpuFactor: 1.8, recRam: 16, tags: ["RPG"] },
  { name: "Kingdom Come: Deliverance II",     gpuFactor: 1.3, cpuFactor: 1.4, recRam: 16, tags: ["RPG", "Demanding"] },
  { name: "Persona 5 Royal",                  gpuFactor: 6.0, cpuFactor: 6.0, recRam: 8,  tags: ["JRPG", "Light"] },

  // ── Open-world / cinematic AAA ──
  { name: "Grand Theft Auto V",               gpuFactor: 2.5, cpuFactor: 1.9, recRam: 8,  tags: ["Open world", "CPU-heavy"] },
  { name: "Red Dead Redemption 2",            gpuFactor: 1.3, cpuFactor: 1.8, recRam: 16, tags: ["Open world", "Demanding"] },
  { name: "Hogwarts Legacy",                  gpuFactor: 1.2, cpuFactor: 1.4, recRam: 16, tags: ["Open world", "Demanding"] },
  { name: "Marvel's Spider-Man Remastered",   gpuFactor: 2.0, cpuFactor: 1.5, recRam: 16, tags: ["Action", "CPU-heavy"] },
  { name: "Black Myth: Wukong",               gpuFactor: 1.05, cpuFactor: 2.0, recRam: 16, tags: ["Action RPG", "Very demanding"] },
  { name: "Assassin's Creed Valhalla",        gpuFactor: 1.5, cpuFactor: 1.8, recRam: 16, tags: ["Open world"] },
  { name: "Assassin's Creed Shadows",         gpuFactor: 1.1, cpuFactor: 1.4, recRam: 16, tags: ["Open world", "Demanding"] },
  { name: "God of War",                       gpuFactor: 1.8, cpuFactor: 2.2, recRam: 16, tags: ["Action"] },
  { name: "God of War Ragnarök",              gpuFactor: 1.6, cpuFactor: 2.0, recRam: 16, tags: ["Action"] },
  { name: "Horizon Zero Dawn",                gpuFactor: 1.8, cpuFactor: 2.0, recRam: 16, tags: ["Open world"] },
  { name: "Horizon Forbidden West",           gpuFactor: 1.4, cpuFactor: 1.8, recRam: 16, tags: ["Open world", "Demanding"] },
  { name: "The Last of Us Part I",            gpuFactor: 1.4, cpuFactor: 1.6, recRam: 16, tags: ["Action"] },
  { name: "Ghost of Tsushima",                gpuFactor: 1.8, cpuFactor: 2.2, recRam: 16, tags: ["Open world"] },
  { name: "Alan Wake 2",                      gpuFactor: 0.95, cpuFactor: 1.8, recRam: 16, tags: ["Horror", "Very demanding"] },
  { name: "Control",                          gpuFactor: 1.6, cpuFactor: 2.0, recRam: 16, tags: ["Action"] },

  // ── Strategy / sim / sports ──
  { name: "Cities: Skylines II",              gpuFactor: 1.0, cpuFactor: 0.85, recRam: 16, tags: ["City builder", "Very CPU-heavy"] },
  { name: "Total War: Warhammer III",         gpuFactor: 1.8, cpuFactor: 1.2, recRam: 16, tags: ["Strategy", "CPU-heavy"] },
  { name: "Sid Meier's Civilization VI",      gpuFactor: 4.0, cpuFactor: 2.0, recRam: 8,  tags: ["Strategy", "CPU-heavy"] },
  { name: "Age of Empires IV",                gpuFactor: 3.0, cpuFactor: 2.5, recRam: 16, tags: ["Strategy"] },
  { name: "Football Manager 2024",            gpuFactor: 8.0, cpuFactor: 6.0, recRam: 8,  tags: ["Sim", "CPU-heavy"] },
  { name: "Forza Horizon 5",                  gpuFactor: 1.7, cpuFactor: 2.0, recRam: 16, tags: ["Racing"] },
  { name: "Forza Motorsport",                 gpuFactor: 1.6, cpuFactor: 2.0, recRam: 16, tags: ["Racing"] },
  { name: "EA Sports FC 25",                  gpuFactor: 3.0, cpuFactor: 3.5, recRam: 8,  tags: ["Sports"] },
  { name: "Microsoft Flight Simulator",       gpuFactor: 1.1, cpuFactor: 0.75, recRam: 32, tags: ["Sim", "Very CPU-heavy"] },

  // ── Fighting / horror / co-op ──
  { name: "Tekken 8",                         gpuFactor: 3.0, cpuFactor: 3.5, recRam: 16, fpsCap: 60, tags: ["Fighting", "60 FPS cap"] },
  { name: "Street Fighter 6",                 gpuFactor: 3.0, cpuFactor: 3.5, recRam: 16, fpsCap: 60, tags: ["Fighting", "60 FPS cap"] },
  { name: "Resident Evil 4 (Remake)",         gpuFactor: 2.0, cpuFactor: 2.5, recRam: 16, tags: ["Horror"] },
  { name: "Resident Evil Village",            gpuFactor: 2.5, cpuFactor: 3.0, recRam: 16, tags: ["Horror"] },
  { name: "Lethal Company",                   gpuFactor: 5.0, cpuFactor: 6.0, recRam: 8,  tags: ["Co-op horror", "Light"] },
  { name: "Phasmophobia",                     gpuFactor: 3.5, cpuFactor: 4.0, recRam: 8,  tags: ["Co-op horror"] },
  { name: "Content Warning",                  gpuFactor: 4.5, cpuFactor: 5.0, recRam: 8,  tags: ["Co-op", "Light"] },

  // ── Indie / casual (popular & very light) ──
  { name: "The Sims 4",                       gpuFactor: 4.0, cpuFactor: 4.0, recRam: 8,  tags: ["Life sim"] },
  { name: "Hades",                            gpuFactor: 6.0, cpuFactor: 8.0, recRam: 8,  tags: ["Roguelike", "Light"] },
  { name: "Hollow Knight",                    gpuFactor: 8.0, cpuFactor: 10,  recRam: 8,  tags: ["Metroidvania", "Light"] },
  { name: "Hollow Knight: Silksong",          gpuFactor: 7.0, cpuFactor: 9.0, recRam: 8,  tags: ["Metroidvania", "Light"] },
  { name: "Cuphead",                          gpuFactor: 8.0, cpuFactor: 10,  recRam: 8,  tags: ["Run & gun", "Light"] },
  { name: "Vampire Survivors",                gpuFactor: 10,  cpuFactor: 12,  recRam: 8,  tags: ["Roguelike", "Very light"] },
  { name: "Balatro",                          gpuFactor: 12,  cpuFactor: 14,  recRam: 8,  tags: ["Card", "Very light"] },
];

if (typeof module !== "undefined" && module.exports) module.exports = { GAME_DATA };
