/**
 * API Client — services adapter seam.
 *
 * All service files import from here.  When you wire a real backend,
 * replace the BASE_URL and un-stub these helpers; every call site in
 * contexts and components automatically gains live data.
 *
 * REST contract reference (swap localStorage stubs for these):
 *
 * Auth
 *   POST /api/auth/login           { email, password } → { token, user }
 *   POST /api/auth/register        { name, email, password } → { token, user }
 *   POST /api/auth/logout          {} → 200
 *
 * User / Profile
 *   GET  /api/user/profile         → Profile
 *   PUT  /api/user/profile         Profile → Profile
 *
 * Day Log
 *   GET  /api/log/:date            → DayLog
 *   POST /api/log/:date/meal       Meal → DayLog
 *   PUT  /api/log/:date/meal/:id   Meal → DayLog
 *   DEL  /api/log/:date/meal/:id   → DayLog
 *   PUT  /api/log/:date/water      { waterMl } → DayLog
 *   PUT  /api/log/:date/workout    { workoutMin, done } → DayLog
 *   PUT  /api/log/:date/sleep      { sleepMin } → DayLog
 *
 * History / Analytics
 *   GET  /api/analytics/daily      ?metric&n  → [{ key, value }]
 *   GET  /api/analytics/weekly     ?metric&n  → [{ key, label, value }]
 *   GET  /api/analytics/monthly    ?metric&n  → [{ key, label, value }]
 *
 * Goals
 *   GET  /api/goals                → Goals
 *   PUT  /api/goals                Goals → Goals
 *
 * Achievements
 *   GET  /api/achievements         → [{ id, unlockedAt }]
 *
 * Food / Scanner
 *   POST /api/scanner/analyze      FormData(image) → NutritionResult
 *   GET  /api/foods/quick          → QuickFood[]
 *   GET  /api/foods/search?q=      → Food[]
 *
 * Diet Plans
 *   GET  /api/plans                → DietPlan[]
 *   POST /api/plans/generate       { profile } → DietPlan
 *
 * AI Chat
 *   POST /api/ai/chat              { messages, context } → { reply }
 */

export const BASE_URL = import.meta.env.VITE_API_URL ?? '';

/** Attach auth token to headers (un-stub when backend is live) */
export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Generic fetch wrapper (ready for production use).
 * Currently unused — all data flows through localStorage services.
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}
