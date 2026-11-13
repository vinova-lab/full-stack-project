/**
 * Preset diet plans shown on the Diet Plans page.
 * Each plan includes 4 meals per day × 7 days.
 */

export const DIET_PLANS = [
  {
    id: 'veg-balance',
    title: 'Vegetarian Balance',
    tag: 'Most Popular',
    tagColor: 'accent',
    diet: 'vegetarian',
    calories: 1850,
    description: 'A wholesome vegetarian plan rich in plant protein and complex carbs.',
    color: 'var(--accent)',
    days: [
      {
        day: 'Monday',
        meals: [
          { type: 'breakfast', name: 'Oatmeal with Berries & Seeds', time: '08:00', kcal: 340, p: 14, c: 58, f: 8 },
          { type: 'lunch', name: 'Quinoa Buddha Bowl', time: '13:00', kcal: 480, p: 22, c: 68, f: 14 },
          { type: 'snack', name: 'Greek Yoghurt & Honey', time: '16:00', kcal: 150, p: 12, c: 18, f: 2 },
          { type: 'dinner', name: 'Palak Paneer with Brown Rice', time: '19:30', kcal: 460, p: 24, c: 52, f: 16 },
        ],
      },
      {
        day: 'Tuesday',
        meals: [
          { type: 'breakfast', name: 'Green Smoothie Bowl', time: '08:00', kcal: 290, p: 10, c: 52, f: 7 },
          { type: 'lunch', name: 'Lentil Soup with Whole Grain Bread', time: '13:00', kcal: 380, p: 20, c: 58, f: 7 },
          { type: 'snack', name: 'Mixed Nuts & Dried Fruit', time: '16:00', kcal: 190, p: 6, c: 18, f: 12 },
          { type: 'dinner', name: 'Stir-Fried Tofu & Vegetables', time: '19:30', kcal: 380, p: 22, c: 42, f: 14 },
        ],
      },
    ],
  },
  {
    id: 'plant-power',
    title: 'Plant Power',
    tag: 'Vegan',
    tagColor: 'accent-3',
    diet: 'vegan',
    calories: 1800,
    description: 'Completely plant-based with complete proteins from legumes and grains.',
    color: 'var(--accent-3)',
    days: [
      {
        day: 'Monday',
        meals: [
          { type: 'breakfast', name: 'Chia Pudding with Mango', time: '08:00', kcal: 280, p: 8, c: 46, f: 10 },
          { type: 'lunch', name: 'Tempeh & Kale Bowl', time: '13:00', kcal: 440, p: 24, c: 52, f: 16 },
          { type: 'snack', name: 'Edamame (100g)', time: '16:00', kcal: 120, p: 12, c: 10, f: 5 },
          { type: 'dinner', name: 'Coconut Chickpea Curry', time: '19:30', kcal: 420, p: 16, c: 58, f: 14 },
        ],
      },
    ],
  },
  {
    id: 'high-protein',
    title: 'High Protein',
    tag: 'Build Muscle',
    tagColor: 'violet',
    diet: 'balanced',
    calories: 2200,
    description: 'Protein-forward plan with 35%+ of calories from lean protein sources.',
    color: 'var(--c-violet)',
    days: [
      {
        day: 'Monday',
        meals: [
          { type: 'breakfast', name: 'Protein Pancakes with Berries', time: '07:30', kcal: 380, p: 34, c: 42, f: 8 },
          { type: 'lunch', name: 'Grilled Chicken & Quinoa Bowl', time: '13:00', kcal: 520, p: 42, c: 48, f: 14 },
          { type: 'snack', name: 'Cottage Cheese & Nuts', time: '16:00', kcal: 200, p: 18, c: 12, f: 10 },
          { type: 'dinner', name: 'Baked Salmon with Asparagus & Rice', time: '19:00', kcal: 520, p: 42, c: 46, f: 16 },
        ],
      },
    ],
  },
];
