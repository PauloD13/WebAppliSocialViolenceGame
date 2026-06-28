const normalizeUrl = (url) => (url ? url.replace(/\/+$/, "") : "");

const getEnv = (key, fallback = "") => {
  const value = import.meta.env?.[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;
};

const apiBaseUrl = normalizeUrl(getEnv("VITE_API_BASE_URL"));

/** URL base da API REST (ex: http://localhost:8000) */
export const API_BASE_URL = apiBaseUrl;

/** Timeout padrão de chamadas REST em milissegundos */
export const API_TIMEOUT_MS = Number(getEnv("VITE_API_TIMEOUT_MS", "6000")) || 6000;

/**
 * Endpoints da API.
 * O padrão de autenticação é headerless:
 *   - POST /auth/login  → body {nome, senha}
 *   - GET  /auth/meus-dados → Header: nome
 *   PUT /usuario/update/:id e POST /registro/create não exigem header.
 */
export const API_ENDPOINTS = {
  // Conteúdo do jogo
  categories: "/categories",
  questions:  "/questions",

  // Autenticação
  login:    "/auth/login",
  register: "/auth/registro",
  myData:   "/auth/meus-dados",

  // Progresso
  updateProgress: (userId) => `/usuario/update/${userId}`,
  createRegistro: "/registro/create",
};
