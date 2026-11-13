import { lastNDays, weekLabel, monthLabel } from './dates.js';
import { get, set } from '../services/storage.js';

// ─── Storage key ──────────────────────────────────────────────────────────────
const HISTORY_KEY = 'history';

// ─── Deterministic demo metric generator ─────────────────────────────────────

/** Simple seeded hash → float in [0,1) */
function seededRand(seed) {
  let s = seed;
  s = (Math.imul(1664525, s) + 1013904223) >>> 0;
  return s / 4294967296;
}

/**
 * Generate a deterministic metric value for a given date key + metric name.
 * Recent 12 days are biased high (≥ 65%) to produce the demo 12-day streak.
 * @param {string} dateKey  YYYY-MM-DD
 * @param {string} metric   unique metric name for seeding
 * @param {number} min      minimum value (default 0)
 * @param {number} max      maximum value (default 100)
 */
export function demoMetric(dateKey, metric, min = 0, max = 100) {
  const seed = Array.from(dateKey + metric).reduce((a, c) => (Math.imul(31, a) + c.charCodeAt(0)) | 0, 0);
  const rand = seededRand(Math.abs(seed));

  // Check if within last 12 days → bias high
  const today = new Date();
  const d = new Date(dateKey + 'T12:00:00');
  const diffDays = Math.round((today - d) / 864e5);
  const biased = diffDays < 12 ? 0.65 + rand * 0.35 : rand;

  return Math.round(min + biased * (max - min));
}

// ─── Load / Save history ──────────────────────────────────────────────────────

export function loadHistory() {
  return get(HISTORY_KEY) ?? {};
}

export function saveHistory(history) {
  set(HISTORY_KEY, history);
}

/**
 * Save or merge a summary entry for a specific day.
 * @param {string} dateKey
 * @param {object} summary { calories, protein, water, workoutMin, sleepMin, wellnessScore }
 */
export function saveDaySummary(dateKey, summary) {
  const history = loadHistory();
  history[dateKey] = { ...(history[dateKey] ?? {}), ...summary, dateKey };
  saveHistory(history);
}

// ─── Series builders ──────────────────────────────────────────────────────────

/**
 * Build chart-ready series for the last N days.
 * Falls back to demoMetric for days without saved history.
 */
export function getDailySeries(metric, { n = 7, min = 0, max = 100, calorieTarget = 1850 } = {}) {
  const history = loadHistory();
  return lastNDays(n).map((key) => {
    const saved = history[key]?.[metric];
    const value = saved !== undefined ? saved : demoMetric(key, metric, min, max);
    return { key, value };
  });
}

/**
 * Aggregate daily data into weekly buckets (last N weeks).
 * Uses Monday as week start.
 */
export function getWeeklySeries(metric, { n = 8, min = 0, max = 100 } = {}) {
  const days = lastNDays(n * 7);
  const weeks = {};
  const history = loadHistory();

  days.forEach((key) => {
    const wLabel = weekLabel(key);
    if (!weeks[wLabel]) weeks[wLabel] = { total: 0, count: 0, key };
    const saved = history[key]?.[metric];
    const value = saved !== undefined ? saved : demoMetric(key, metric, min, max);
    weeks[wLabel].total += value;
    weeks[wLabel].count += 1;
  });

  return Object.entries(weeks)
    .slice(-n)
    .map(([label, { total, count, key }]) => ({
      key, label, value: Math.round(total / count),
    }));
}

/**
 * Aggregate daily data into monthly buckets (last N months).
 */
export function getMonthlySeries(metric, { n = 6, min = 0, max = 100 } = {}) {
  const days = lastNDays(n * 30);
  const months = {};
  const history = loadHistory();

  days.forEach((key) => {
    const mLabel = monthLabel(key);
    if (!months[mLabel]) months[mLabel] = { total: 0, count: 0, key };
    const saved = history[key]?.[metric];
    const value = saved !== undefined ? saved : demoMetric(key, metric, min, max);
    months[mLabel].total += value;
    months[mLabel].count += 1;
  });

  return Object.entries(months)
    .slice(-n)
    .map(([label, { total, count, key }]) => ({
      key, label, value: Math.round(total / count),
    }));
}

// ─── Streak calculation ───────────────────────────────────────────────────────

/**
 * Walk back from today counting consecutive days where wellnessScore >= 70
 * (or demoMetric fallback). Returns integer streak count.
 */
export function calcStreak() {
  const history = loadHistory();
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const score = history[key]?.wellnessScore ?? demoMetric(key, 'wellnessScore', 40, 100);
    if (score >= 70) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
