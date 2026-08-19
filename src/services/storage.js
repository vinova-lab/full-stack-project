/**
 * localStorage wrapper with `nutriflow:` namespace prefix.
 * All persistent state flows through these helpers.
 */

const NS = 'nutriflow:';

export function get(key) {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch (e) {
    console.warn('[storage] set failed:', key, e);
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(NS + key);
  } catch {}
}

/** Remove all nutriflow: keys */
export function clearAll() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(NS));
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

/** Storage key constants — keeps typo-safe access across the app */
export const KEYS = {
  AUTH: 'auth',
  USER: 'user',
  SETTINGS: 'settings',
  GOALS: 'goals',
  DAY_LOG: 'daylog',        // { [dateKey]: DayLog }
  HISTORY: 'history',       // { [dateKey]: DaySummary }
  STREAK: 'streak',
  ACHIEVEMENTS: 'achievements',
  ACCOUNTS: 'accounts',     // registered user accounts
};
