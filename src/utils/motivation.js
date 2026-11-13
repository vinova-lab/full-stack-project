/**
 * Deterministic motivation quote system.
 * Same date + same progress band → same quote every time (stable for the day).
 */

const BANDS = {
  start: [ // < 30 %
    { text: "Every journey begins with a single step. You've taken yours.", author: 'Marcus Aurelius (adapted)' },
    { text: "Small daily improvements are the key to staggering long-term results.", author: 'Unknown' },
    { text: "The secret of getting ahead is getting started.", author: 'Mark Twain' },
    { text: "You don't have to be great to start, but you have to start to be great.", author: 'Zig Ziglar' },
    { text: "Action is the foundational key to all success.", author: 'Pablo Picasso' },
  ],
  building: [ // 30 – 59 %
    { text: "Momentum is the result of consistent, purposeful effort.", author: 'NutriFlow' },
    { text: "Halfway there means you know the path. Keep going.", author: 'NutriFlow' },
    { text: "The middle of the journey is where commitment separates from intention.", author: 'Unknown' },
    { text: "Progress, no matter how slow, is still progress.", author: 'Unknown' },
    { text: "You're building the version of yourself you'll thank later.", author: 'NutriFlow' },
  ],
  strong: [ // 60 – 89 %
    { text: "You're in the zone. This is where champions are made.", author: 'NutriFlow' },
    { text: "Excellence is not a singular act but a habit. You are what you repeatedly do.", author: 'Aristotle' },
    { text: "The closer you get, the more your past self admires you.", author: 'NutriFlow' },
    { text: "Consistency is the hallmark of the unexceptional rising to excellence.", author: 'Unknown' },
    { text: "Keep showing up. The results will reflect the effort.", author: 'NutriFlow' },
  ],
  peak: [ // 90 – 99 %
    { text: "Almost there. Don't break the streak — finish what you started today.", author: 'NutriFlow' },
    { text: "The last 10% is where most people stop. That's why you'll be different.", author: 'NutriFlow' },
    { text: "Close enough is never good enough when the goal is in sight.", author: 'Unknown' },
    { text: "Push through — your future self is watching this moment.", author: 'NutriFlow' },
    { text: "Victory is near. Make today count completely.", author: 'NutriFlow' },
  ],
  complete: [ // 100 %
    { text: "🎉 Goal achieved! Today you proved consistency beats perfection.", author: 'NutriFlow' },
    { text: "You did it. Every full day compounds into the person you're becoming.", author: 'NutriFlow' },
    { text: "100% complete. Rest, recover, and come back stronger tomorrow.", author: 'NutriFlow' },
    { text: "Champions complete the day. You are today's champion.", author: 'NutriFlow' },
    { text: "Perfect day. Perfect effort. See you tomorrow, champion.", author: 'NutriFlow' },
  ],
};

/** Simple deterministic hash from a string → integer */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Select band based on overall progress percentage */
function selectBand(pct) {
  if (pct >= 100) return 'complete';
  if (pct >= 90) return 'peak';
  if (pct >= 60) return 'strong';
  if (pct >= 30) return 'building';
  return 'start';
}

/**
 * Returns { text, author } for today based on progress percentage.
 * Deterministic: same day + same band → same quote.
 */
export function dailyQuote(overallPct = 0) {
  const today = new Date().toISOString().slice(0, 10);
  const band = selectBand(overallPct);
  const quotes = BANDS[band];
  const idx = hash(today + band) % quotes.length;
  return quotes[idx];
}

/** All band keys for reference */
export const QUOTE_BANDS = Object.keys(BANDS);
