// CoupleFit's only persistence layer: browser localStorage, read and written
// exclusively through this module. Previously every screen (App, Dashboard,
// TrainingMode, Onboarding, LanguageContext) parsed and stringified the same
// keys independently — this file is the single place that knows the on-disk
// shape of each one, so a future schema change touches one file instead of
// five.
//
// Workout logs are stored as a flat JSON array shared across every profile
// (michael / lina / test), each entry tagged with a `user` field. There is
// no server and no per-device sync: clearing site data or switching browsers
// loses this history, so treat destructive operations here carefully.
import { STORAGE_KEYS } from '../constants/storageKeys';

function safeGetJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (e) {
    console.warn(`workoutStore: failed to read "${key}", falling back to default`, e);
    return fallback;
  }
}

function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`workoutStore: failed to write "${key}"`, e);
    return false;
  }
}

function safeGetString(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSetString(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`workoutStore: failed to write "${key}"`, e);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Workout logs
// ---------------------------------------------------------------------------

/** Every logged session, for every profile, most recent first. */
export function getAllLogs() {
  const logs = safeGetJSON(STORAGE_KEYS.WORKOUT_LOGS, []);
  return Array.isArray(logs) ? logs : [];
}

/** Logged sessions for a single profile, most recent first. */
export function getLogsForUser(user) {
  return getAllLogs().filter((log) => log.user === user);
}

/** Prepends a freshly-finished session to the shared log. */
export function saveSession(session) {
  const logs = getAllLogs();
  logs.unshift(session);
  return safeSetJSON(STORAGE_KEYS.WORKOUT_LOGS, logs);
}

/**
 * Applies `updater(session)` to the stored session with the given id and
 * persists the result. Returns the updated session, or null if no session
 * matched.
 */
export function updateSession(sessionId, updater) {
  const logs = getAllLogs();
  let updatedSession = null;
  const next = logs.map((log) => {
    if (log.id !== sessionId) return log;
    updatedSession = updater(log);
    return updatedSession;
  });
  if (updatedSession) safeSetJSON(STORAGE_KEYS.WORKOUT_LOGS, next);
  return updatedSession;
}

/** Removes one session by id. */
export function deleteSession(sessionId) {
  const logs = getAllLogs();
  const next = logs.filter((log) => log.id !== sessionId);
  return safeSetJSON(STORAGE_KEYS.WORKOUT_LOGS, next);
}

/**
 * Replaces every logged session for `user` with `newLogs`, leaving every
 * other profile's history untouched. Used to regenerate the demo Test User's
 * data without wiping Michael's or Lina's real sessions.
 */
export function replaceLogsForUser(user, newLogs) {
  const others = getAllLogs().filter((log) => log.user !== user);
  return safeSetJSON(STORAGE_KEYS.WORKOUT_LOGS, [...newLogs, ...others]);
}

// ---------------------------------------------------------------------------
// Simple preferences
// ---------------------------------------------------------------------------

export function getActiveUser(fallback = 'michael') {
  return safeGetString(STORAGE_KEYS.ACTIVE_USER, fallback);
}
export function setActiveUser(user) {
  return safeSetString(STORAGE_KEYS.ACTIVE_USER, user);
}

export function getSelectedDay(fallback = 'D1') {
  return safeGetString(STORAGE_KEYS.SELECTED_DAY, fallback);
}
export function setSelectedDay(day) {
  return safeSetString(STORAGE_KEYS.SELECTED_DAY, day);
}

export function getLanguage(fallback = null) {
  return safeGetString(STORAGE_KEYS.LANGUAGE, fallback);
}
export function setLanguage(locale) {
  return safeSetString(STORAGE_KEYS.LANGUAGE, locale);
}

export function getShowTestUser() {
  return safeGetString(STORAGE_KEYS.SHOW_TEST_USER, 'false') === 'true';
}
export function setShowTestUser(value) {
  return safeSetString(STORAGE_KEYS.SHOW_TEST_USER, value ? 'true' : 'false');
}
