/**
 * Achievement definitions.
 * Each achievement has a `check` function that receives { streak, totalDays, hydrationDays, workoutDays, nutritionDays }.
 */

export const ACHIEVEMENTS = [
  {
    id: 'streak7',
    title: '7-Day Streak',
    emoji: '🔥',
    description: 'Complete 7 consecutive wellness days.',
    rarity: 'Common',
    check: ({ streak }) => streak >= 7,
  },
  {
    id: 'streak14',
    title: '14-Day Streak',
    emoji: '⚡',
    description: 'Maintain a 14-day consistency streak.',
    rarity: 'Uncommon',
    check: ({ streak }) => streak >= 14,
  },
  {
    id: 'streak30',
    title: '30-Day Champion',
    emoji: '👑',
    description: 'Achieve a 30-consecutive-day streak.',
    rarity: 'Rare',
    check: ({ streak }) => streak >= 30,
  },
  {
    id: 'hydration-hero',
    title: 'Hydration Hero',
    emoji: '💧',
    description: 'Hit your water goal for 7 days.',
    rarity: 'Common',
    check: ({ hydrationDays }) => hydrationDays >= 7,
  },
  {
    id: 'workout-warrior',
    title: 'Workout Warrior',
    emoji: '🏋️',
    description: 'Complete 10 workout sessions.',
    rarity: 'Uncommon',
    check: ({ workoutDays }) => workoutDays >= 10,
  },
  {
    id: 'nutrition-master',
    title: 'Nutrition Master',
    emoji: '🥗',
    description: 'Log all meals accurately for 14 days.',
    rarity: 'Rare',
    check: ({ nutritionDays }) => nutritionDays >= 14,
  },
];

/** Rarity badge colours */
export const RARITY_COLORS = {
  Common: 'var(--text-3)',
  Uncommon: 'var(--accent)',
  Rare: 'var(--c-violet)',
};
