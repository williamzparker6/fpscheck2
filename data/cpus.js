/*
 * CPU performance data.
 *
 * `score` is a RELATIVE gaming performance index, normalised so that the best
 * gaming chips (e.g. Ryzen 7 7800X3D) ≈ 100. It reflects the FPS ceiling a CPU
 * can feed to the GPU — it matters most at low resolution, high refresh rates,
 * and in CPU-heavy games (sims, strategy, large multiplayer).
 *
 * To add a chip: copy a line and set `score` by comparing to nearby chips.
 */
const CPU_DATA = [
  // ── AMD Ryzen 9000 (Zen 5) ──
  { name: "AMD Ryzen 9 9950X3D",   score: 108, brand: "AMD" },
  { name: "AMD Ryzen 7 9800X3D",   score: 106, brand: "AMD" },
  { name: "AMD Ryzen 9 9900X3D",   score: 105, brand: "AMD" },
  { name: "AMD Ryzen 9 9950X",     score: 92,  brand: "AMD" },
  { name: "AMD Ryzen 9 9900X",     score: 88,  brand: "AMD" },
  { name: "AMD Ryzen 7 9700X",     score: 86,  brand: "AMD" },
  { name: "AMD Ryzen 5 9600X",     score: 80,  brand: "AMD" },

  // ── AMD Ryzen 7000 (Zen 4) ──
  { name: "AMD Ryzen 7 7800X3D",   score: 100, brand: "AMD" },
  { name: "AMD Ryzen 9 7950X3D",   score: 100, brand: "AMD" },
  { name: "AMD Ryzen 9 7900X3D",   score: 95,  brand: "AMD" },
  { name: "AMD Ryzen 9 7950X",     score: 90,  brand: "AMD" },
  { name: "AMD Ryzen 9 7900X",     score: 88,  brand: "AMD" },
  { name: "AMD Ryzen 7 7700X",     score: 86,  brand: "AMD" },
  { name: "AMD Ryzen 7 7700",      score: 84,  brand: "AMD" },
  { name: "AMD Ryzen 5 7600X",     score: 80,  brand: "AMD" },
  { name: "AMD Ryzen 5 7600",      score: 77,  brand: "AMD" },
  { name: "AMD Ryzen 5 7500F",     score: 74,  brand: "AMD" },

  // ── AMD Ryzen 5000 (Zen 3) ──
  { name: "AMD Ryzen 7 5800X3D",   score: 88,  brand: "AMD" },
  { name: "AMD Ryzen 7 5700X3D",   score: 85,  brand: "AMD" },
  { name: "AMD Ryzen 9 5950X",     score: 82,  brand: "AMD" },
  { name: "AMD Ryzen 9 5900X",     score: 80,  brand: "AMD" },
  { name: "AMD Ryzen 7 5800X",     score: 74,  brand: "AMD" },
  { name: "AMD Ryzen 7 5700X",     score: 70,  brand: "AMD" },
  { name: "AMD Ryzen 5 5600X",     score: 68,  brand: "AMD" },
  { name: "AMD Ryzen 5 5600",      score: 66,  brand: "AMD" },
  { name: "AMD Ryzen 5 5500",      score: 56,  brand: "AMD" },

  // ── AMD Ryzen 3000 (Zen 2) ──
  { name: "AMD Ryzen 9 3950X",     score: 64,  brand: "AMD" },
  { name: "AMD Ryzen 9 3900X",     score: 62,  brand: "AMD" },
  { name: "AMD Ryzen 7 3800X",     score: 60,  brand: "AMD" },
  { name: "AMD Ryzen 7 3700X",     score: 58,  brand: "AMD" },
  { name: "AMD Ryzen 5 3600X",     score: 54,  brand: "AMD" },
  { name: "AMD Ryzen 5 3600",      score: 52,  brand: "AMD" },
  { name: "AMD Ryzen 3 3300X",     score: 50,  brand: "AMD" },
  { name: "AMD Ryzen 3 3100",      score: 44,  brand: "AMD" },

  // ── AMD Ryzen 1000 / 2000 (Zen / Zen+) ──
  { name: "AMD Ryzen 7 2700X",     score: 48,  brand: "AMD" },
  { name: "AMD Ryzen 7 2700",      score: 46,  brand: "AMD" },
  { name: "AMD Ryzen 5 2600X",     score: 44,  brand: "AMD" },
  { name: "AMD Ryzen 5 2600",      score: 42,  brand: "AMD" },
  { name: "AMD Ryzen 7 1800X",     score: 42,  brand: "AMD" },
  { name: "AMD Ryzen 7 1700",      score: 40,  brand: "AMD" },
  { name: "AMD Ryzen 5 1600",      score: 38,  brand: "AMD" },

  // ── AMD APUs (integrated graphics chips) ──
  { name: "AMD Ryzen 5 8600G",     score: 70,  brand: "AMD" },
  { name: "AMD Ryzen 7 5700G",     score: 60,  brand: "AMD" },
  { name: "AMD Ryzen 5 5600G",     score: 56,  brand: "AMD" },

  // ── Intel Core Ultra (Arrow Lake, Series 2) ──
  { name: "Intel Core Ultra 9 285K", score: 96, brand: "Intel" },
  { name: "Intel Core Ultra 7 265K", score: 90, brand: "Intel" },
  { name: "Intel Core Ultra 5 245K", score: 82, brand: "Intel" },

  // ── Intel 14th gen (Raptor Lake Refresh) ──
  { name: "Intel Core i9-14900K",  score: 98,  brand: "Intel" },
  { name: "Intel Core i7-14700K",  score: 92,  brand: "Intel" },
  { name: "Intel Core i5-14600K",  score: 84,  brand: "Intel" },
  { name: "Intel Core i5-14400",   score: 70,  brand: "Intel" },
  { name: "Intel Core i3-14100",   score: 56,  brand: "Intel" },

  // ── Intel 13th gen (Raptor Lake) ──
  { name: "Intel Core i9-13900K",  score: 96,  brand: "Intel" },
  { name: "Intel Core i7-13700K",  score: 89,  brand: "Intel" },
  { name: "Intel Core i5-13600K",  score: 82,  brand: "Intel" },
  { name: "Intel Core i5-13400",   score: 68,  brand: "Intel" },
  { name: "Intel Core i3-13100",   score: 54,  brand: "Intel" },

  // ── Intel 12th gen (Alder Lake) ──
  { name: "Intel Core i9-12900K",  score: 84,  brand: "Intel" },
  { name: "Intel Core i7-12700K",  score: 80,  brand: "Intel" },
  { name: "Intel Core i5-12600K",  score: 74,  brand: "Intel" },
  { name: "Intel Core i5-12400",   score: 66,  brand: "Intel" },
  { name: "Intel Core i3-12100",   score: 52,  brand: "Intel" },

  // ── Intel 11th gen (Rocket Lake) ──
  { name: "Intel Core i9-11900K",  score: 70,  brand: "Intel" },
  { name: "Intel Core i7-11700K",  score: 66,  brand: "Intel" },
  { name: "Intel Core i5-11600K",  score: 62,  brand: "Intel" },
  { name: "Intel Core i5-11400",   score: 56,  brand: "Intel" },

  // ── Intel 10th gen (Comet Lake) ──
  { name: "Intel Core i9-10900K",  score: 68,  brand: "Intel" },
  { name: "Intel Core i7-10700K",  score: 62,  brand: "Intel" },
  { name: "Intel Core i5-10600K",  score: 58,  brand: "Intel" },
  { name: "Intel Core i5-10400",   score: 50,  brand: "Intel" },
  { name: "Intel Core i3-10100",   score: 40,  brand: "Intel" },

  // ── Intel 9th / 8th gen (Coffee Lake) ──
  { name: "Intel Core i9-9900K",   score: 62,  brand: "Intel" },
  { name: "Intel Core i7-9700K",   score: 56,  brand: "Intel" },
  { name: "Intel Core i5-9600K",   score: 50,  brand: "Intel" },
  { name: "Intel Core i5-9400F",   score: 44,  brand: "Intel" },
  { name: "Intel Core i7-8700K",   score: 54,  brand: "Intel" },
  { name: "Intel Core i5-8600K",   score: 48,  brand: "Intel" },
  { name: "Intel Core i5-8400",    score: 44,  brand: "Intel" },
  { name: "Intel Core i3-8100",    score: 34,  brand: "Intel" },

  // ── Intel 7th gen & older (legacy favourites) ──
  { name: "Intel Core i7-7700K",   score: 48,  brand: "Intel" },
  { name: "Intel Core i5-7600K",   score: 38,  brand: "Intel" },
  { name: "Intel Core i7-6700K",   score: 42,  brand: "Intel" },
  { name: "Intel Core i5-6600K",   score: 34,  brand: "Intel" },
  { name: "Intel Core i7-4790K",   score: 34,  brand: "Intel" },
  { name: "Intel Core i7-2600K",   score: 26,  brand: "Intel" },
];

if (typeof module !== "undefined" && module.exports) module.exports = { CPU_DATA };
