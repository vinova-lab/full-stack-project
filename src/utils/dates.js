/** Format a Date (or today) as YYYY-MM-DD storage key */
export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/** Array of YYYY-MM-DD strings for the last N days (oldest → newest) */
export function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return todayKey(d);
  });
}

/** Short display label for a date key: "Mon", "Today", "Yesterday" */
export function dayLabel(key) {
  const today = todayKey();
  const yesterday = todayKey(new Date(Date.now() - 864e5));
  if (key === today) return 'Today';
  if (key === yesterday) return 'Yesterday';
  return new Date(key + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

/** "Mon 14" style label */
export function dayShort(key) {
  const d = new Date(key + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

/** Week number label from YYYY-MM-DD */
export function weekLabel(key) {
  const d = new Date(key + 'T12:00:00');
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return 'Wk ' + start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Month label from YYYY-MM-DD */
export function monthLabel(key) {
  return new Date(key + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' });
}

/** Time-based greeting */
export function greeting(name = '') {
  const h = new Date().getHours();
  const salutation = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${salutation}, ${name} 👋` : salutation;
}

/** Convert minutes to "Xh Ym" or "Ym" */
export function minToHM(min) {
  if (!min && min !== 0) return '—';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** "HH:MM" 24-hour string from a Date */
export function toTimeStr(d = new Date()) {
  return d.toTimeString().slice(0, 5);
}

/** "9:30 AM" style display from "HH:MM" */
export function displayTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}
