/**
 * Utilitários de persistência em localStorage.
 * Cookies e clientId foram removidos — a autenticação agora é por conta (nome + senha).
 */

export const STORAGE_KEYS = {
  user: "awareness_user", // dados da conta logada {id, nome, nivel, acerto_total, erro_total}
  unlocked: "awareness_unlocked", // [categoryId, ...] categorias desbloqueadas nesta sessão
  completed: "awareness_completed", // [categoryId, ...] categorias concluídas nesta sessão
  pool: "awareness_pool", // {categoryId: [questionId, ...]} pool restante
  attempts: "awareness_attempts", // {categoryId: number} tentativas por categoria
  errors: "awareness_errors", // {categoryId: number} erros por categoria
  history: "awareness_history", // [...] histórico de trilhas completadas
  score: "awareness_score", // number pontuação da sessão atual (5 pts / acerto)
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

/** Remove todas as chaves de progresso e autenticação do localStorage. */
export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS).forEach(removeStorage);
};
