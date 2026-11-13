/**
 * NutriAI Chat service.
 *
 * Current implementation: pattern-matched canned responses.
 * Future hookup: POST /api/ai/chat { messages, context } → { reply }
 * (see apiClient.js for the REST contract)
 *
 * The `context` argument carries live stats so responses feel personalised.
 */

const DELAY_MS = 900; // typing simulation delay

// ─── Response bank ────────────────────────────────────────────────────────────

const RESPONSES = [
  {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    reply: (ctx) =>
      `Hi ${ctx.name ?? 'there'}! 👋 I'm NutriAI, your personal wellness assistant. Ask me about your nutrition, workouts, hydration — anything health-related!`,
  },
  {
    patterns: ['calorie', 'calories', 'how much', 'eaten', 'intake'],
    reply: (ctx) =>
      `You've consumed **${ctx.calories ?? 0} kcal** today out of your **${ctx.calorieTarget ?? 1850} kcal** goal. That's ${ctx.calorieTarget ? Math.round((ctx.calories / ctx.calorieTarget) * 100) : 0}% complete. ${
        ctx.calories < (ctx.calorieTarget ?? 1850) * 0.7
          ? 'You still have room for a nutritious meal or snack!'
          : ctx.calories > (ctx.calorieTarget ?? 1850)
          ? 'You\'ve exceeded your target — consider lighter options for your next meal.'
          : 'You\'re right on track! 🎯'
      }`,
  },
  {
    patterns: ['protein', 'macro', 'macros'],
    reply: (ctx) =>
      `Your protein intake is **${ctx.protein ?? 0}g** today (goal: ${ctx.proteinGoal ?? 110}g). Protein is critical for muscle repair and satiety. Great sources include legumes, tofu, eggs, and Greek yoghurt.`,
  },
  {
    patterns: ['water', 'hydration', 'drink', 'hydrated'],
    reply: (ctx) => {
      const pct = ctx.waterGoal ? Math.round((ctx.water / ctx.waterGoal) * 100) : 0;
      return `You've had **${ctx.water ? (ctx.water / 1000).toFixed(1) : 0}L** of water today (${pct}% of your goal). ${
        pct < 50
          ? 'Try to drink a glass of water right now! Staying hydrated improves energy, focus, and metabolism.'
          : pct >= 100
          ? 'Amazing hydration! 💧 You\'ve hit your water goal.'
          : 'Keep it up! You\'re on a good pace.'
      }`;
    },
  },
  {
    patterns: ['workout', 'exercise', 'gym', 'training', 'fitness'],
    reply: (ctx) =>
      `${ctx.workoutDone ? '🏋️ Great work — workout logged today!' : 'Your workout is still pending for today.'} Consistent exercise improves insulin sensitivity, mood, and sleep quality. Would you like tips on optimising your session?`,
  },
  {
    patterns: ['sleep', 'rest', 'tired', 'fatigue'],
    reply: (ctx) =>
      `Your logged sleep is **${ctx.sleepMin ? Math.floor(ctx.sleepMin / 60) + 'h ' + (ctx.sleepMin % 60) + 'm' : 'not yet recorded'}** (goal: ${ctx.sleepGoal ? Math.floor(ctx.sleepGoal / 60) + 'h' : '8h'}). Quality sleep is foundational — it controls hunger hormones, supports recovery, and sharpens focus.`,
  },
  {
    patterns: ['streak', 'day', 'progress', 'doing'],
    reply: (ctx) =>
      `Your wellness score today is **${ctx.score ?? 0}/100** with a 🔥 ${ctx.streak ?? 0}-day streak. You're building a great habit! Streaks are powerful — every day you complete the loop reinforces the behaviour.`,
  },
  {
    patterns: ['bmi', 'weight', 'body'],
    reply: (ctx) =>
      `BMI is a general reference tool, not a complete picture of health. Factors like muscle mass, sleep, and stress all matter. Focus on consistent habits — that's what NutriFlow tracks for you.`,
  },
  {
    patterns: ['tip', 'advice', 'suggest', 'recommend', 'help'],
    reply: (ctx) => {
      const tips = [
        'Eat slowly and mindfully — it takes ~20 minutes for your brain to register fullness.',
        'Front-load calories earlier in the day; lighter dinners often improve sleep quality.',
        'Pair carbohydrates with protein to stabilise blood sugar levels.',
        'Meal prepping on weekends can reduce decision fatigue and improve consistency.',
        'Drinking a glass of water before meals can help with portion awareness.',
      ];
      return '💡 Tip: ' + tips[Math.floor(Math.random() * tips.length)];
    },
  },
  {
    patterns: ['motivat', 'inspir', 'push', 'struggle'],
    reply: (ctx) =>
      `"Discipline is choosing between what you want now and what you want most." Every healthy choice today compounds into the person you become. You're ${ctx.score ?? 0}% of the way to today's goal — finish strong!`,
  },
  {
    patterns: ['thank', 'thanks', 'awesome', 'great', 'good job'],
    reply: () =>
      `You're very welcome! 😊 That's what I'm here for. Keep up the great work — consistency is everything. Is there anything else you'd like to know?`,
  },
];

const FALLBACK =
  "That's a great question! For personalised medical or dietary advice, always consult a registered dietitian or healthcare professional. I can help with nutrition tracking, hydration, workout tips, and reading your NutriFlow data. What would you like to explore?";

// ─── Pattern matcher ──────────────────────────────────────────────────────────

function match(message, patterns) {
  const lower = message.toLowerCase();
  return patterns.some((p) => lower.includes(p));
}

function pickResponse(message, context) {
  for (const item of RESPONSES) {
    if (match(message, item.patterns)) {
      return item.reply(context);
    }
  }
  return FALLBACK;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a message to NutriAI and receive a reply.
 * @param {string} message   User's message text
 * @param {object} context   Live stats from contexts (calories, water, etc.)
 * @returns {Promise<string>} Bot reply (may contain **markdown** bold)
 */
export async function sendMessage(message, context = {}) {
  await new Promise((r) => setTimeout(r, DELAY_MS));
  return pickResponse(message, context);
}

/** Quick-prompt suggestions shown in the chat UI */
export const QUICK_PROMPTS = [
  'How are my calories today?',
  'Give me a nutrition tip',
  'How\'s my hydration?',
  'Check my streak',
  'Motivate me!',
];
