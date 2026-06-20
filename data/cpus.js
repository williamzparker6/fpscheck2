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
  // --- AMD Ryzen (X3D / 9000 / 7000) ---
  { name: "AMD Ryzen 7 9800X3D",   score: 106, brand: "AMD" },
  { name: "AMD Ryzen 9 7950X3D",   score: 100, brand: "AMD" },
  { name: "AMD Ryzen 7 7800X3D",   score: 100, brand: "AMD" },
  { name: "AMD Ryzen 9 7900X",     score: 90,  brand: "AMD" },
  { name: "AMD Ryzen 7 7700X",     score: 86,  brand: "AMD" },
  { name: "AMD Ryzen 5 7600X",     score: 80,  brand: "AMD" },
  { name: "AMD Ryzen 5 7600",      score: 77,  brand: "AMD" },

  // --- AMD Ryzen 5000 ---
  { name: "AMD Ryzen 7 5800X3D",   score: 88,  brand: "AMD" },
  { name: "AMD Ryzen 9 5950X",     score: 82,  brand: "AMD" },
  { name: "AMD Ryzen 9 5900X",     score: 80,  brand: "AMD" },
  { name: "AMD Ryzen 7 5800X",     score: 74,  brand: "AMD" },
  { name: "AMD Ryzen 5 5600X",     score: 68,  brand: "AMD" },
  { name: "AMD Ryzen 5 5600",      score: 66,  brand: "AMD" },

  // --- AMD Ryzen 3000 / 2000 ---
  { name: "AMD Ryzen 7 3700X",     score: 58,  brand: "AMD" },
  { name: "AMD Ryzen 5 3600",      score: 52,  brand: "AMD" },
  { name: "AMD Ryzen 7 2700X",     score: 48,  brand: "AMD" },
  { name: "AMD Ryzen 5 2600",      score: 42,  brand: "AMD" },
  { name: "AMD Ryzen 5 1600",      score: 38,  brand: "AMD" },

  // --- Intel Core (12th–14th gen) ---
  { name: "Intel Core i9-14900K",  score: 98,  brand: "Intel" },
  { name: "Intel Core i7-14700K",  score: 92,  brand: "Intel" },
  { name: "Intel Core i5-14600K",  score: 84,  brand: "Intel" },
  { name: "Intel Core i9-13900K",  score: 96,  brand: "Intel" },
  { name: "Intel Core i7-13700K",  score: 89,  brand: "Intel" },
  { name: "Intel Core i5-13600K",  score: 82,  brand: "Intel" },
  { name: "Intel Core i9-12900K",  score: 84,  brand: "Intel" },
  { name: "Intel Core i7-12700K",  score: 80,  brand: "Intel" },
  { name: "Intel Core i5-12600K",  score: 74,  brand: "Intel" },
  { name: "Intel Core i5-12400",   score: 66,  brand: "Intel" },

  // --- Intel Core (8th–10th gen) ---
  { name: "Intel Core i9-10900K",  score: 68,  brand: "Intel" },
  { name: "Intel Core i7-10700K",  score: 62,  brand: "Intel" },
  { name: "Intel Core i5-10400",   score: 50,  brand: "Intel" },
  { name: "Intel Core i7-9700K",   score: 56,  brand: "Intel" },
  { name: "Intel Core i5-9600K",   score: 50,  brand: "Intel" },
  { name: "Intel Core i7-8700K",   score: 54,  brand: "Intel" },
  { name: "Intel Core i5-8400",    score: 44,  brand: "Intel" },
  { name: "Intel Core i5-7600K",   score: 38,  brand: "Intel" },
];

if (typeof module !== "undefined" && module.exports) module.exports = { CPU_DATA };
