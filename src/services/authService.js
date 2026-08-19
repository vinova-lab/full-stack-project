import { get, set, remove, KEYS } from './storage.js';

export const DEMO_CREDENTIALS = { email: 'demo@nutriflow.app', password: 'demo1234' };

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Authenticate a user.
 * Returns { success, user, isDemo, error }
 */
export function login(email, password) {
  const e = email.trim().toLowerCase();

  // Demo account
  if (e === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    const session = { email: e, name: 'Vino', isDemo: true, token: 'demo-token' };
    set(KEYS.AUTH, session);
    return { success: true, user: session, isDemo: true };
  }

  // Registered accounts
  const accounts = get(KEYS.ACCOUNTS) ?? {};
  const account = accounts[e];
  if (!account) return { success: false, error: 'No account found with that email.' };
  if (account.password !== password)
    return { success: false, error: 'Incorrect password. Please try again.' };

  const session = { email: e, name: account.name, isDemo: false, token: `tok-${Date.now()}` };
  set(KEYS.AUTH, session);
  return { success: true, user: session, isDemo: false };
}

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Register a new account.
 * Returns { success, user, error }
 */
export function register(name, email, password) {
  const e = email.trim().toLowerCase();

  if (e === DEMO_CREDENTIALS.email)
    return { success: false, error: 'That email address is reserved. Please use another.' };

  const accounts = get(KEYS.ACCOUNTS) ?? {};
  if (accounts[e]) return { success: false, error: 'An account with that email already exists.' };

  accounts[e] = { name: name.trim(), password };
  set(KEYS.ACCOUNTS, accounts);

  const session = { email: e, name: name.trim(), isDemo: false, token: `tok-${Date.now()}` };
  set(KEYS.AUTH, session);
  return { success: true, user: session };
}

// ─── Session ──────────────────────────────────────────────────────────────────

export function getSession() {
  return get(KEYS.AUTH);
}

export function logout() {
  remove(KEYS.AUTH);
}
