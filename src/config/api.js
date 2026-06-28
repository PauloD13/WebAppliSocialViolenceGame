const normalizeUrl = (url) => (url ? url.replace(/\/+$/, "") : "");

const getEnv = (key, fallback = "") => {
  const value = import.meta.env?.[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;
};

const apiBaseUrl = normalizeUrl(getEnv("VITE_API_BASE_URL"));
const explicitWsUrl = getEnv("VITE_WS_URL");

/** URL base da API REST (ex: http://localhost:8000) */
export const API_BASE_URL = apiBaseUrl;

/** Timeout padrão de chamadas REST em milissegundos */
export const API_TIMEOUT_MS = Number(getEnv("VITE_API_TIMEOUT_MS", "5000")) || 5000;

/** Duração da sessão de nickname em segundos (padrão: 24h) */
export const SESSION_TTL_SECONDS = Number(getEnv("VITE_SESSION_TTL_SECONDS", "86400")) || 86400;

/**
 * URL do WebSocket de ranking.
 * Derivada automaticamente da API_BASE_URL se não configurada explicitamente.
 * Ex: http://localhost:8000 → ws://localhost:8000/ranking
 */
export const WS_URL =
  explicitWsUrl || (apiBaseUrl ? `${apiBaseUrl.replace(/^http/i, "ws")}/ranking` : "");

/**
 * Endpoints REST que o frontend consome.
 * Os aliases /categories e /questions são expostos pelo gateway_router no FastAPI.
 */
export const API_ENDPOINTS = {
  categories: "/categories", // alias → /categoria/read
  questions: "/questions", // alias → /pergunta/read
  playerSession: "/players/session", // sessão passwordless
  score: "/ranking", // POST de score (se implementado como REST)
};
