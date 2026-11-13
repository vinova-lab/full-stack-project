/**
 * Day Log service.
 * Manages the current day's meals, water, workout, sleep, and celebrations.
 *
 * Future REST endpoint: GET/PUT /api/log/:date  (see apiClient.js)
 */

import { get, set, KEYS } from './storage.js';
import { todayKey } from '../utils/dates.js';

// ─── Demo seed data ───────────────────────────────────────────────────────────

export const DEMO_MEALS = [
  { id: 'm1', type: 'breakfast', name: 'Oatmeal with Berries', time: '08:15', kcal: 320, p: 14, c: 52, f: 7, done: true },
  { id: 'm2', type: 'breakfast', name: 'Green Smoothie', time: '08:30', kcal: 180, p: 6, c: 32, f: 4, done: true },
  { id: 'm3', type: 'lunch', name: 'Quinoa Buddha Bowl', time: '13:00', kcal: 480, p: 22, c: 68, f: 14, done: true },
  { id: 'm4', type: 'snack', name: 'Mixed Nuts', time: '16:00', kcal: 190, p: 6, c: 8, f: 16, done: true },
  { id: 'm5', type: 'dinner', name: 'Stir-fried Tofu & Veggies', time: '19:30', kcal: 250, p: 34, c: 28, f: 9, done: false },
];
// Completed meals sum: m1+m2+m3+m4 = 1170 kcal, 48p, 160c, 41f
// When dinner is done too: 1420 kcal, 82p, 188c, 50f

function buildDemoLog(dateKey) {
  return {
    dateKey,
    meals: DEMO_MEALS,
    waterMl: 1800,
    workoutMin: 0,
    workoutDone: false,
    sleepMin: 462, // 7h 42m
    celebrated: {},
  };
}

// ─── Load / Save ──────────────────────────────────────────────────────────────

function allLogs() {
  return get(KEYS.DAY_LOG) ?? {};
}

function saveLogs(logs) {
  set(KEYS.DAY_LOG, logs);
}

export function loadDayLog(dateKey = todayKey(), isDemo = false) {
  const logs = allLogs();
  if (logs[dateKey]) return logs[dateKey];

  // Demo: seed today's log with prebuilt data
  if (isDemo) {
    const demo = buildDemoLog(dateKey);
    logs[dateKey] = demo;
    saveLogs(logs);
    return demo;
  }

  // New day: empty log
  const empty = {
    dateKey,
    meals: [],
    waterMl: 0,
    workoutMin: 0,
    workoutDone: false,
    sleepMin: 0,
    celebrated: {},
  };
  logs[dateKey] = empty;
  saveLogs(logs);
  return empty;
}

export function saveDayLog(log) {
  const logs = allLogs();
  logs[log.dateKey] = log;
  saveLogs(logs);
}

// ─── Meal helpers ─────────────────────────────────────────────────────────────

export function addMeal(dateKey, meal, isDemo) {
  const log = loadDayLog(dateKey, isDemo);
  const id = 'meal-' + Date.now();
  log.meals = [...log.meals, { ...meal, id, done: false }];
  saveDayLog(log);
  return log;
}

export function updateMeal(dateKey, mealId, updates, isDemo) {
  const log = loadDayLog(dateKey, isDemo);
  log.meals = log.meals.map((m) => (m.id === mealId ? { ...m, ...updates } : m));
  saveDayLog(log);
  return log;
}

export function removeMeal(dateKey, mealId, isDemo) {
  const log = loadDayLog(dateKey, isDemo);
  log.meals = log.meals.filter((m) => m.id !== mealId);
  saveDayLog(log);
  return log;
}

export function toggleMeal(dateKey, mealId, isDemo) {
  const log = loadDayLog(dateKey, isDemo);
  log.meals = log.meals.map((m) =>
    m.id === mealId ? { ...m, done: !m.done } : m
  );
  saveDayLog(log);
  return log;
}
