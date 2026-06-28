/**
 * Utilitários de persistência local.
 * Abstrai localStorage e cookies com serialização JSON segura.
 */

export const STORAGE_KEYS = {
  user: "awareness_user",
  session: "awareness_session",
  clientId: "awareness_client_id",
  unlocked: "awareness_unlocked",
  completed: "awareness_completed",
  pool: "awareness_pool",
  attempts: "awareness_attempts",
  errors: "awareness_errors",
  history: "awareness_history",
  score: "awareness_score",
  ranking: "awareness_ranking",
};

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

// ---------------------------------------------------------------------------
// localStorage
// ---------------------------------------------------------------------------

export const readJsonStorage = (key, fallback) => {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJsonStorage = (key, value) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceededError — ignora silenciosamente
  }
};

export const removeStorage = (key) => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
};

// ---------------------------------------------------------------------------
// Cookies
// ---------------------------------------------------------------------------

export const readJsonCookie = (key, fallback) => {
  if (!isBrowser()) return fallback;
  const entry = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${encodeURIComponent(key)}=`));
  if (!entry) return fallback;
  try {
    const value = entry.split("=").slice(1).join("=");
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return fallback;
  }
};

export const writeJsonCookie = (key, value, maxAgeSeconds) => {
  if (!isBrowser()) return;
  document.cookie = [
    `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`,
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
};

export const removeCookie = (key) => {
  if (!isBrowser()) return;
  document.cookie = `${encodeURIComponent(key)}=; Max-Age=0; Path=/; SameSite=Lax`;
};

// ---------------------------------------------------------------------------
// Client ID (gerado uma única vez por dispositivo)
// ---------------------------------------------------------------------------

export const createClientId = () => {
  const existing = readJsonStorage(STORAGE_KEYS.clientId, null);
  if (existing) return existing;

  const next =
    globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  writeJsonStorage(STORAGE_KEYS.clientId, next);
  return next;
};
