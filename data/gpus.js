/*
 * GPU performance data.
 *
 * `score` is a RELATIVE raster-gaming performance index, normalised so that an
 * RTX 4090 ≈ 100. It is roughly proportional to real-world average FPS at 1440p.
 * These are approximations meant for tuning — adjust freely.
 *
 * To add a card: copy a line, set a sensible `score` by comparing it to nearby
 * cards, and (optionally) `vram` in GB. `brand` is cosmetic grouping only.
 */
const GPU_DATA = [
  // ── NVIDIA RTX 50 series (Blackwell) ──
  { name: "NVIDIA RTX 5090",          score: 134, vram: 32, brand: "NVIDIA" },
  { name: "NVIDIA RTX 5080",          score: 94,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 5070 Ti",       score: 80,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 5070",          score: 64,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 5060 Ti",       score: 50,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 5060",          score: 41,  vram: 8,  brand: "NVIDIA" },

  // ── NVIDIA RTX 40 series (Ada) ──
  { name: "NVIDIA RTX 4090",          score: 100, vram: 24, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4080 Super",    score: 87,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4080",          score: 84,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4070 Ti Super", score: 76,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4070 Ti",       score: 71,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4070 Super",    score: 66,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4070",          score: 57,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4060 Ti 16GB",  score: 46,  vram: 16, brand: "NVIDIA" },
  { name: "NVIDIA RTX 4060 Ti",       score: 44,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 4060",          score: 36,  vram: 8,  brand: "NVIDIA" },

  // ── NVIDIA RTX 30 series (Ampere) ──
  { name: "NVIDIA RTX 3090 Ti",       score: 78,  vram: 24, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3090",          score: 73,  vram: 24, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3080 Ti",       score: 72,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3080 12GB",     score: 70,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3080",          score: 67,  vram: 10, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3070 Ti",       score: 57,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 3070",          score: 53,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 3060 Ti",       score: 47,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 3060",          score: 34,  vram: 12, brand: "NVIDIA" },
  { name: "NVIDIA RTX 3060 8GB",      score: 32,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 3050",          score: 24,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 3050 6GB",      score: 17,  vram: 6,  brand: "NVIDIA" },

  // ── NVIDIA RTX 20 series (Turing) ──
  { name: "NVIDIA RTX 2080 Ti",       score: 49,  vram: 11, brand: "NVIDIA" },
  { name: "NVIDIA RTX 2080 Super",    score: 44,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 2080",          score: 42,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 2070 Super",    score: 40,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 2070",          score: 36,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 2060 Super",    score: 34,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA RTX 2060",          score: 30,  vram: 6,  brand: "NVIDIA" },

  // ── NVIDIA GTX 16 series ──
  { name: "NVIDIA GTX 1660 Ti",       score: 28,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1660 Super",    score: 27,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1660",          score: 24,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1650 Super",    score: 21,  vram: 4,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1650",          score: 16,  vram: 4,  brand: "NVIDIA" },

  // ── NVIDIA GTX 10 series (Pascal) ──
  { name: "NVIDIA GTX 1080 Ti",       score: 42,  vram: 11, brand: "NVIDIA" },
  { name: "NVIDIA GTX 1080",          score: 33,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1070 Ti",       score: 31,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1070",          score: 27,  vram: 8,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1060 6GB",      score: 18,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1060 3GB",      score: 16,  vram: 3,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1050 Ti",       score: 10,  vram: 4,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 1050",          score: 8,   vram: 2,  brand: "NVIDIA" },

  // ── NVIDIA GTX 900 / 700 (legacy, still common) ──
  { name: "NVIDIA GTX 980 Ti",        score: 30,  vram: 6,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 980",           score: 25,  vram: 4,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 970",           score: 22,  vram: 4,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 960",           score: 13,  vram: 2,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 780 Ti",        score: 22,  vram: 3,  brand: "NVIDIA" },
  { name: "NVIDIA GTX 750 Ti",        score: 7,   vram: 2,  brand: "NVIDIA" },

  // ── AMD Radeon RX 9000 (RDNA 4) ──
  { name: "AMD RX 9070 XT",           score: 88,  vram: 16, brand: "AMD" },
  { name: "AMD RX 9070",              score: 76,  vram: 16, brand: "AMD" },
  { name: "AMD RX 9060 XT",           score: 52,  vram: 16, brand: "AMD" },

  // ── AMD Radeon RX 7000 (RDNA 3) ──
  { name: "AMD RX 7900 XTX",          score: 90,  vram: 24, brand: "AMD" },
  { name: "AMD RX 7900 XT",           score: 80,  vram: 20, brand: "AMD" },
  { name: "AMD RX 7900 GRE",          score: 70,  vram: 16, brand: "AMD" },
  { name: "AMD RX 7800 XT",           score: 64,  vram: 16, brand: "AMD" },
  { name: "AMD RX 7700 XT",           score: 54,  vram: 12, brand: "AMD" },
  { name: "AMD RX 7600 XT",           score: 40,  vram: 16, brand: "AMD" },
  { name: "AMD RX 7600",              score: 38,  vram: 8,  brand: "AMD" },

  // ── AMD Radeon RX 6000 (RDNA 2) ──
  { name: "AMD RX 6950 XT",           score: 72,  vram: 16, brand: "AMD" },
  { name: "AMD RX 6900 XT",           score: 68,  vram: 16, brand: "AMD" },
  { name: "AMD RX 6800 XT",           score: 65,  vram: 16, brand: "AMD" },
  { name: "AMD RX 6800",              score: 58,  vram: 16, brand: "AMD" },
  { name: "AMD RX 6750 XT",           score: 53,  vram: 12, brand: "AMD" },
  { name: "AMD RX 6700 XT",           score: 50,  vram: 12, brand: "AMD" },
  { name: "AMD RX 6700",              score: 44,  vram: 10, brand: "AMD" },
  { name: "AMD RX 6650 XT",           score: 40,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 6600 XT",           score: 38,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 6600",              score: 34,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 6500 XT",           score: 18,  vram: 4,  brand: "AMD" },
  { name: "AMD RX 6400",              score: 13,  vram: 4,  brand: "AMD" },

  // ── AMD Radeon RX 5000 / 500 / Vega (legacy) ──
  { name: "AMD RX 5700 XT",           score: 36,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 5700",              score: 33,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 5600 XT",           score: 30,  vram: 6,  brand: "AMD" },
  { name: "AMD RX 5500 XT",           score: 20,  vram: 8,  brand: "AMD" },
  { name: "AMD Radeon VII",           score: 38,  vram: 16, brand: "AMD" },
  { name: "AMD RX Vega 64",           score: 34,  vram: 8,  brand: "AMD" },
  { name: "AMD RX Vega 56",           score: 30,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 590",               score: 20,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 580 8GB",           score: 18,  vram: 8,  brand: "AMD" },
  { name: "AMD RX 570",               score: 15,  vram: 4,  brand: "AMD" },
  { name: "AMD RX 560",               score: 9,   vram: 4,  brand: "AMD" },
  { name: "AMD R9 390",               score: 18,  vram: 8,  brand: "AMD" },

  // ── Intel Arc ──
  { name: "Intel Arc B580",           score: 48,  vram: 12, brand: "Intel" },
  { name: "Intel Arc B570",           score: 42,  vram: 10, brand: "Intel" },
  { name: "Intel Arc A770 16GB",      score: 40,  vram: 16, brand: "Intel" },
  { name: "Intel Arc A750",           score: 36,  vram: 8,  brand: "Intel" },
  { name: "Intel Arc A580",           score: 32,  vram: 8,  brand: "Intel" },
  { name: "Intel Arc A380",           score: 16,  vram: 6,  brand: "Intel" },

  // ── Integrated / Handheld (shared memory) ──
  { name: "AMD Radeon 780M (iGPU)",   score: 14,  vram: 8,  brand: "Integrated" },
  { name: "AMD Radeon 760M (iGPU)",   score: 10,  vram: 6,  brand: "Integrated" },
  { name: "Steam Deck (Van Gogh)",    score: 9,   vram: 4,  brand: "Integrated" },
  { name: "Intel Arc 140V (iGPU)",    score: 13,  vram: 8,  brand: "Integrated" },
  { name: "Intel Iris Xe (96 EU)",    score: 6,   vram: 4,  brand: "Integrated" },
];

if (typeof module !== "undefined" && module.exports) module.exports = { GPU_DATA };
