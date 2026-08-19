/** Quick foods shown in Add Meal modal — tap to select */
export const QUICK_FOODS = [
  { id: 'qf1', name: 'Oatmeal', kcal: 150, p: 5, c: 27, f: 3 },
  { id: 'qf2', name: 'Banana', kcal: 90, p: 1, c: 23, f: 0 },
  { id: 'qf3', name: 'Greek Yoghurt', kcal: 130, p: 12, c: 14, f: 2 },
  { id: 'qf4', name: 'Whole Grain Toast', kcal: 80, p: 3, c: 14, f: 1 },
  { id: 'qf5', name: 'Scrambled Eggs (2)', kcal: 180, p: 14, c: 2, f: 13 },
  { id: 'qf6', name: 'Mixed Nuts (30g)', kcal: 190, p: 5, c: 8, f: 16 },
  { id: 'qf7', name: 'Apple', kcal: 80, p: 0, c: 21, f: 0 },
  { id: 'qf8', name: 'Brown Rice (1 cup)', kcal: 216, p: 5, c: 45, f: 2 },
  { id: 'qf9', name: 'Chickpeas (100g)', kcal: 164, p: 9, c: 27, f: 3 },
  { id: 'qf10', name: 'Paneer (100g)', kcal: 265, p: 18, c: 4, f: 20 },
  { id: 'qf11', name: 'Lentils (1 cup)', kcal: 230, p: 18, c: 40, f: 1 },
  { id: 'qf12', name: 'Avocado (half)', kcal: 120, p: 1, c: 6, f: 11 },
  { id: 'qf13', name: 'Protein Smoothie', kcal: 220, p: 24, c: 22, f: 4 },
  { id: 'qf14', name: 'Black Coffee', kcal: 5, p: 0, c: 1, f: 0 },
];

/** Meal type options */
export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'snack', label: 'Snack', emoji: '🍎' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
];

/** Macro colour tokens for consistent chart/bar colouring */
export const MACRO_COLORS = {
  protein: 'var(--accent)',
  carbs: 'var(--accent-3)',
  fat: 'var(--c-warn)',
};
