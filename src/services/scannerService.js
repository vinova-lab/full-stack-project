/**
 * Food Scanner service — simulated AI image analysis.
 * Deterministic: the same filename → same result (stable demo experience).
 *
 * Future REST endpoint: POST /api/scanner/analyze (FormData with image)
 * The backend would call a vision API and return the same NutritionResult shape.
 */

const SCAN_FOODS = [
  { name: 'Vegetable Fried Rice', kcal: 420, p: 12, c: 68, f: 11, confidence: 0.94 },
  { name: 'Greek Yoghurt Parfait', kcal: 240, p: 18, c: 28, f: 6, confidence: 0.91 },
  { name: 'Avocado Toast', kcal: 310, p: 10, c: 34, f: 16, confidence: 0.88 },
  { name: 'Banana Smoothie Bowl', kcal: 380, p: 9, c: 72, f: 7, confidence: 0.93 },
  { name: 'Chickpea Salad', kcal: 280, p: 14, c: 36, f: 8, confidence: 0.87 },
  { name: 'Lentil Soup', kcal: 220, p: 16, c: 32, f: 3, confidence: 0.92 },
  { name: 'Whole Grain Pasta', kcal: 340, p: 12, c: 62, f: 5, confidence: 0.89 },
  { name: 'Mixed Berry Salad', kcal: 120, p: 2, c: 28, f: 1, confidence: 0.96 },
  { name: 'Grilled Chicken Wrap', kcal: 460, p: 32, c: 48, f: 14, confidence: 0.90 },
  { name: 'Veggie Omelette', kcal: 290, p: 22, c: 8, f: 18, confidence: 0.93 },
];

/** Simple hash of a string → integer */
function strHash(str) {
  return Array.from(str ?? 'food').reduce(
    (a, c) => (Math.imul(31, a) + c.charCodeAt(0)) | 0,
    0
  );
}

/**
 * Simulate AI food analysis.
 * @param {File} file  The uploaded image file.
 * @returns {Promise<NutritionResult>}
 *
 * NutritionResult: { name, kcal, p, c, f, confidence, label: 'Estimated nutrition' }
 */
export async function analyzeFood(file) {
  // Simulate network / inference delay (1.5-2.2 s)
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 700));

  const idx = Math.abs(strHash(file?.name ?? '')) % SCAN_FOODS.length;
  const food = SCAN_FOODS[idx];

  // Add ±5% random variance to each macro so repeated scans of the same image
  // look slightly different (realistic AI behaviour).
  const vary = (v) => Math.round(v * (0.95 + Math.random() * 0.10));

  return {
    ...food,
    kcal: vary(food.kcal),
    p: vary(food.p),
    c: vary(food.c),
    f: vary(food.f),
    label: 'Estimated nutrition',  // always "Estimated nutrition" per spec
  };
}
