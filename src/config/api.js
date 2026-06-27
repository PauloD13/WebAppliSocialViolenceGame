const normalizeUrl = (url) => (url ? url.replace(/\/+$/, "") : "");

const getEnv = (key, fallback = "") => {
  const value = import.meta.env?.[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;
};

const apiBaseUrl = normalizeUrl(getEnv("VITE_API_BASE_URL"));
const explicitWsUrl = getEnv("VITE_WS_URL");

export const API_BASE_URL = apiBaseUrl;
export const API_TIMEOUT_MS = Number(getEnv("VITE_API_TIMEOUT_MS", "5000")) || 5000;
export const SESSION_TTL_SECONDS = Number(getEnv("VITE_SESSION_TTL_SECONDS", "86400")) || 86400;
export const WS_URL =
  explicitWsUrl || (apiBaseUrl ? `${apiBaseUrl.replace(/^http/i, "ws")}/ranking` : "");

export const API_ENDPOINTS = {
  categories: "/categories",
  questions: "/questions",
  nicknameSession: "/players/session",
  score: "/ranking",
};
