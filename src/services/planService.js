/**
 * Diet Plan generation service.
 * Future REST endpoint: POST /api/plans/generate { profile, preferences }
 */

import { calcCalorieTarget, calcMacros } from '../utils/calculations.js';

const MEAL_TEMPLATES = {
  vegetarian: {
    breakfast: [
      { name: 'Oatmeal with Berries & Seeds', kcal: 340, p: 14, c: 58, f: 8 },
      { name: 'Green Smoothie Bowl', kcal: 290, p: 10, c: 52, f: 7 },
      { name: 'Avocado Toast with Egg', kcal: 360, p: 16, c: 36, f: 18 },
    ],
    lunch: [
      { name: 'Quinoa Buddha Bowl', kcal: 480, p: 22, c: 68, f: 14 },
      { name: 'Lentil & Spinach Soup', kcal: 320, p: 18, c: 42, f: 6 },
      { name: 'Chickpea Wrap', kcal: 420, p: 16, c: 58, f: 12 },
    ],
    snack: [
      { name: 'Mixed Nuts & Fruit', kcal: 190, p: 6, c: 18, f: 12 },
      { name: 'Greek Yoghurt', kcal: 130, p: 12, c: 14, f: 2 },
      { name: 'Hummus & Veggies', kcal: 160, p: 6, c: 18, f: 8 },
    ],
    dinner: [
      { name: 'Stir-fried Tofu & Vegetables', kcal: 380, p: 22, c: 42, f: 14 },
      { name: 'Paneer Tikka with Rice', kcal: 460, p: 24, c: 52, f: 16 },
      { name: 'Black Bean Tacos', kcal: 420, p: 18, c: 58, f: 12 },
    ],
  },
  vegan: {
    breakfast: [
      { name: 'Chia Pudding with Mango', kcal: 280, p: 8, c: 46, f: 10 },
      { name: 'Peanut Butter Banana Toast', kcal: 340, p: 12, c: 48, f: 14 },
      { name: 'Acai Smoothie Bowl', kcal: 320, p: 8, c: 58, f: 9 },
    ],
    lunch: [
      { name: 'Tempeh & Kale Bowl', kcal: 440, p: 24, c: 52, f: 16 },
      { name: 'Red Lentil Dal', kcal: 360, p: 20, c: 56, f: 6 },
      { name: 'Falafel Pita Wrap', kcal: 420, p: 16, c: 58, f: 14 },
    ],
    snack: [
      { name: 'Edamame', kcal: 120, p: 12, c: 10, f: 5 },
      { name: 'Date & Almond Energy Balls', kcal: 180, p: 5, c: 26, f: 8 },
      { name: 'Rice Cakes with Nut Butter', kcal: 160, p: 5, c: 20, f: 8 },
    ],
    dinner: [
      { name: 'Coconut Chickpea Curry', kcal: 420, p: 16, c: 58, f: 14 },
      { name: 'Spaghetti Bolognese (Lentil)', kcal: 460, p: 22, c: 70, f: 8 },
      { name: 'Stuffed Bell Peppers', kcal: 380, p: 14, c: 56, f: 10 },
    ],
  },
  balanced: {
    breakfast: [
      { name: 'Scrambled Eggs with Whole Grain Toast', kcal: 380, p: 22, c: 38, f: 16 },
      { name: 'Protein Pancakes with Berries', kcal: 340, p: 24, c: 42, f: 8 },
      { name: 'Greek Yoghurt Parfait', kcal: 280, p: 18, c: 36, f: 6 },
    ],
    lunch: [
      { name: 'Grilled Chicken Caesar Salad', kcal: 420, p: 34, c: 22, f: 18 },
      { name: 'Turkey & Avocado Wrap', kcal: 460, p: 28, c: 48, f: 16 },
      { name: 'Salmon Grain Bowl', kcal: 520, p: 36, c: 52, f: 18 },
    ],
    snack: [
      { name: 'Cottage Cheese & Fruit', kcal: 160, p: 14, c: 18, f: 3 },
      { name: 'Hard-boiled Eggs', kcal: 140, p: 12, c: 1, f: 10 },
      { name: 'Protein Bar', kcal: 200, p: 20, c: 22, f: 6 },
    ],
    dinner: [
      { name: 'Baked Salmon with Asparagus', kcal: 440, p: 38, c: 18, f: 22 },
      { name: 'Chicken Stir-fry with Brown Rice', kcal: 480, p: 34, c: 56, f: 12 },
      { name: 'Lean Beef Tacos', kcal: 460, p: 32, c: 44, f: 16 },
    ],
  },
};

function pickMeal(meals, dateOffset, mealIdx) {
  const seed = (dateOffset * 7 + mealIdx) % meals.length;
  return meals[seed];
}

/**
 * Generate a 7-day personalised plan.
 * @param {object} profile User profile (from UserContext)
 * @returns {object} { calorieTarget, macros, days: [{ day, meals }] }
 */
export function generatePlan(profile) {
  const diet = profile?.dietPreference ?? 'balanced';
  const templates = MEAL_TEMPLATES[diet] ?? MEAL_TEMPLATES.balanced;
  const calorieTarget = calcCalorieTarget(profile);
  const macros = calcMacros(calorieTarget, profile?.goal);

  const days = Array.from({ length: 7 }, (_, dayIdx) => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];
    const meals = mealTypes.map((type, mealIdx) => ({
      type,
      time: { breakfast: '08:00', lunch: '13:00', snack: '16:00', dinner: '19:30' }[type],
      ...pickMeal(templates[type], dayIdx, mealIdx),
    }));
    return { day: dayNames[dayIdx], meals };
  });

  return { calorieTarget, macros, days, diet };
}
