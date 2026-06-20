/*
 * GPU performance data.
 *
 * `score` is a RELATIVE raster-gaming performance index, normalised so that an
 * RTX 4090 ≈ 100. It is roughly proportional to real-world average FPS at 1440p.
 * These are approximations meant for tuning — adjust freely.
 *
 * To add a card: copy a line, set a sensible `score` by comparing it to nearby
 * cards, and (optionally) `vram` in GB. `tier` is cosmetic grouping only.
 */
const GPU_DATA = [
  // --- NVIDIA RTX 40 series ---
  { name: "NVIDIA RTX 4090",          score: 100, vram: 24, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4080 Super",    score: 87,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4080",          score: 84,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4070 Ti Super", score: 76,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4070 Ti",       score: 71,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4070 Super",    score: 66,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4070",          score: 57,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4060 Ti",       score: 44,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 4060",          score: 36,  vram: 8,  brand: "NVIDIA" },

  // --- NVIDIA RTX 30 series ---
  { name: "NVIDIA RTX 3090 Ti",       score: 78,  vram: 24, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3090",          score: 73,  vram: 24, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3080 Ti",       score: 72,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3080",          score: 67,  vram: 10, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3070 Ti",       score: 57,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 3070",          score: 53,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 3060 Ti",       score: 47,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 3060",          score: 34,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3050",          score: 24,  vram: 8,  brand: "NVIDIA" },

  // --- NVIDIA RTX 20 series ---
  { name: "NVIDIA RTX 2080 Ti",       score: 49,  vram: 11, brand: "NVIDIA" },
  { name: "NVIDIA RTX 2070 Super",    score: 40,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 2060 Super",    score: 35,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 2060",          score: 30,  vram: 6,  brand: "NVIDIA" },

  // --- NVIDIA GTX 16 / 10 series ---
  { name: "NVIDIA GTX 1660 Ti",       score: 28,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1660 Super",    score: 27,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1660",          score: 24,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1080 Ti",       score: 42,  vram: 11, brand: "NVIDIA" },
  { name: "NVIDIA GTX 1080",          score: 33,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1070 Ti",       score: 31,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1070",          score: 27,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1060 6GB",      score: 18,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1050 Ti",       score: 10,  vram: 4,  brand: "NVIDIA" },

  // --- AMD Radeon RX 7000 ---
  { name: "AMD RX 7900 XTX",          score: 90,  vram: 24, brand: "AMD" },
  { name: "AMD RX 7900 XT",           score: 80,  vram: 20, brand: "AMD" },
  { name: "AMD RX 7900 GRE",          score: 70,  vram: 16, brand: "AMD" },
  { name: "AMD RX 7800 XT",           score: 64,  vram: 16, brand: "AMD" },
  { name: "AMD RX 7700 XT",           score: 54,  vram: 12, brand: "AMD" },
  { name: "AMD RX 7600",              score: 38,  vram: 8,  brand: "AMD" },

  // --- AMD Radeon RX 6000 ---
  { name: "AMD RX 6950 XT",           score: 72,  vram: 16, brand: "AMD" },
  { name: "AMD RX 6900 XT",           score: 68,  vram: 16, brand: "AMD" },
  { name: "AMD RX 6800 XT",           score: 65,  vram: 16, brand: "AMD" },
  { name: "AMD RX 6800",              score: 58,  vram: 16, brand: "AMD" },
  { name: "AMD RX 6700 XT",           score: 50,  vram: 12, brand: "AMD" },
  { name: "AMD RX 6650 XT",           score: 40,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 6600",              score: 34,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 5700 XT",           score: 36,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 580 8GB",           score: 18,  vram: 8,  brand: "AMD" },

  // --- Intel Arc ---
  { name: "Intel Arc B580",           score: 48,  vram: 12, brand: "Intel" },
  { name: "Intel Arc A770",           score: 40,  vram: 16, brand: "Intel" },
  { name: "Intel Arc A750",           score: 36,  vram: 8,  brand: "Intel" },
];

if (typeof module !== "undefined" && module.exports) module.exports = { GPU_DATA };
