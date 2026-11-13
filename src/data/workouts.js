/**
 * Workout library — used by the Workout Timer page.
 * durations are in seconds.
 */

export const WORKOUTS = [
  {
    id: 'full-body-30',
    title: 'Full Body Blast',
    subtitle: '30 min · 6 exercises · All levels',
    totalMin: 30,
    difficulty: 'Intermediate',
    equipment: 'None',
    targetTime: '19:00–19:30',
    exercises: [
      { id: 'e1', name: 'Warm-Up', emoji: '🌅', duration: 180, description: 'Light movement, joint rotations and dynamic stretches.' },
      { id: 'e2', name: 'Squats', emoji: '🦵', duration: 360, description: '3 sets × 15 reps. Keep chest up and knees over toes.' },
      { id: 'e3', name: 'Push-Ups', emoji: '💪', duration: 300, description: '3 sets × 12 reps. Maintain a straight line from head to heel.' },
      { id: 'e4', name: 'Lunges', emoji: '🏃', duration: 360, description: '3 sets × 12 each leg. Step forward, lower back knee toward floor.' },
      { id: 'e5', name: 'Plank', emoji: '🧘', duration: 300, description: '3 × 30-second holds. Engage core, keep hips neutral.' },
      { id: 'e6', name: 'Cool-Down', emoji: '🌙', duration: 300, description: 'Static stretches: hamstrings, quads, chest, shoulders.' },
    ],
  },
  {
    id: 'hiit-20',
    title: 'HIIT Burn',
    subtitle: '20 min · 5 exercises · Advanced',
    totalMin: 20,
    difficulty: 'Advanced',
    equipment: 'None',
    targetTime: 'Flexible',
    exercises: [
      { id: 'h1', name: 'Warm-Up', emoji: '🌅', duration: 120, description: 'Jog in place, arm circles.' },
      { id: 'h2', name: 'Burpees', emoji: '⚡', duration: 240, description: '4 sets × 10 reps. Full explosive movement.' },
      { id: 'h3', name: 'High Knees', emoji: '🏃', duration: 180, description: '4 × 30 seconds. Drive knees to chest.' },
      { id: 'h4', name: 'Jump Squats', emoji: '💥', duration: 240, description: '4 sets × 12 reps. Land softly.' },
      { id: 'h5', name: 'Cool-Down', emoji: '🌙', duration: 120, description: 'Light stretching and deep breathing.' },
    ],
  },
];

/** Default workout shown on the timer page */
export const DEFAULT_WORKOUT_ID = 'full-body-30';
