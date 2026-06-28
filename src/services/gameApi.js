import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT_MS } from "../config/api.js";
import { categories as localCategories } from "../data/categories.js";
import { questions as localQuestions } from "../data/questions.js";

const hasRemoteApi = Boolean(API_BASE_URL);

// ---------------------------------------------------------------------------
// HTTP client
// ---------------------------------------------------------------------------

const request = async (path, options = {}) => {
  if (!hasRemoteApi) throw new Error("API base URL não configurada.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      const err = new Error(payload?.detail || payload?.message || "Falha ao comunicar com a API.");
      err.status = response.status;
      err.payload = payload;
      throw err;
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
};

// ---------------------------------------------------------------------------
// Collection extractor (handles array, {data:[...]}, {items:[...]}, etc.)
// ---------------------------------------------------------------------------

const pickCollection = (payload, keys) => {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

/**
 * Normaliza uma categoria da API (apenas {id, nome}) com os dados visuais locais.
 * O banco fornece o conteúdo; o frontend fornece cor, ícone e classes CSS.
 */
const normalizeCategory = (category, index) => {
  const id = Number(category.id ?? category.categoria_id ?? category.categoryId ?? index + 1);
  const order = Number(category.ordem ?? category.order ?? category.position ?? id);
  const fallback = localCategories.find((item) => item.id === id) || localCategories[index] || {};

  return {
    ...fallback, // spread visual data first (lowest priority)
    ...category, // API data overwrites where keys match
    id,
    ordem: order,
    nome: category.nome ?? category.name ?? category.title ?? fallback.nome,
    cor: category.cor ?? category.color ?? fallback.cor,
    icon: category.icon ?? category.icone ?? fallback.icon,
  };
};

/**
 * Normaliza alternativas: aceita array [{letra, texto}] ou dict {"A": "texto"}.
 */
const normalizeAlternatives = (alternativas) => {
  if (!alternativas) return [];

  // Formato array (preferido): [{letra: "A", texto: "..."}, ...]
  if (Array.isArray(alternativas)) {
    return alternativas.map((alt, index) => ({
      letra: alt.letra ?? alt.letter ?? alt.key ?? String.fromCharCode(65 + index),
      texto: alt.texto ?? alt.text ?? alt.label ?? alt.description ?? "",
    }));
  }

  // Formato dict: {"A": "texto A", "B": "texto B"}
  if (typeof alternativas === "object") {
    return Object.entries(alternativas).map(([letra, value]) => ({
      letra,
      texto: typeof value === "string" ? value : (value?.texto ?? value?.text ?? ""),
    }));
  }

  return [];
};

/**
 * Normaliza uma pergunta da API para o formato interno do frontend.
 *
 * API field → Frontend field:
 *   pergunta  → texto
 *   resposta  → resposta_correta
 *   feedback  → feedback_acerto
 *   categoria → categoria_id  (campo legado antes da correção do schema)
 */
const normalizeQuestion = (question, index) => ({
  ...question,
  id: question.id ?? question.questionId ?? question.uuid ?? index + 1,

  categoria_id: Number(
    question.categoria_id ??
      question.categoria ?? // campo legado da API (antes da correção do schema)
      question.category_id ??
      question.categoryId ??
      question.category?.id ??
      1,
  ),

  numero: question.numero ?? question.number ?? question.code ?? `${index + 1}`,

  tipo_pergunta: question.tipo_pergunta ?? question.type ?? question.kind ?? "Pergunta",

  // API devolve "pergunta", frontend usa "texto"
  texto:
    question.texto ??
    question.text ??
    question.pergunta ?? // campo da API
    question.statement ??
    question.title ??
    "",

  dica: question.dica ?? question.hint ?? question.tip ?? "",

  alternativas: normalizeAlternatives(
    question.alternativas ?? question.options ?? question.answers,
  ),

  // API devolve "resposta", frontend usa "resposta_correta"
  resposta_correta:
    question.resposta_correta ??
    question.correct_answer ??
    question.correctAnswer ??
    question.resposta ?? // campo da API
    question.answer ??
    question.answerKey,

  // "feedback" é o campo da API; "feedback_acerto" é o campo interno
  feedback_acerto:
    question.feedback_acerto ??
    question.success_feedback ??
    question.successFeedback ??
    question.feedback ?? // campo da API
    "",
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const getFallbackContent = () => ({
  categories: localCategories,
  questions: localQuestions,
  source: "local",
  error: null,
});

/**
 * Carrega categorias e perguntas da API.
 * Em caso de falha (API offline, dados vazios) retorna os dados locais.
 */
export const loadGameContent = async () => {
  if (!hasRemoteApi) return getFallbackContent();

  try {
    const [categoriesPayload, questionsPayload] = await Promise.all([
      request(API_ENDPOINTS.categories),
      request(API_ENDPOINTS.questions),
    ]);

    const categories = pickCollection(categoriesPayload, ["categories", "categorias"])
      .map(normalizeCategory)
      .sort((a, b) => a.ordem - b.ordem);

    const questions = pickCollection(questionsPayload, ["questions", "perguntas"])
      .map(normalizeQuestion)
      .filter((q) => q.texto && q.alternativas.length > 0);

    if (categories.length === 0 || questions.length === 0) {
      throw new Error("A API retornou categorias ou perguntas vazias.");
    }

    return { categories, questions, source: "api", error: null };
  } catch (error) {
    console.warn("[gameApi] API indisponível — usando dados locais.", error?.message);
    return { ...getFallbackContent(), source: "fallback", error };
  }
};

/**
 * Reserva um nickname no backend (sessionless — sem senha).
 * Retorna { ok: true, user } ou { ok: false, reason, message }.
 */
export const reserveNickname = async ({ nickname, clientId, expiresAt }) => {
  const localUser = { id: clientId, clientId, nickname, expiresAt, source: "local" };

  if (!hasRemoteApi) return { ok: true, user: localUser };

  try {
    const payload = await request(API_ENDPOINTS.playerSession, {
      method: "POST",
      body: JSON.stringify({ nickname, clientId, expiresAt }),
    });

    return {
      ok: true,
      user: {
        ...localUser,
        id: payload?.id ?? clientId,
        nickname: payload?.nickname ?? nickname,
        clientId: payload?.clientId ?? clientId,
        expiresAt: payload?.expiresAt ?? expiresAt,
        source: "api",
      },
    };
  } catch (error) {
    if (error.status === 409) {
      return {
        ok: false,
        reason: "nickname_in_use",
        message: error.payload?.detail || "Esse apelido já está em uso. Tente outro.",
      };
    }

    // API offline — permite jogar localmente
    console.warn("[gameApi] Sessão remota indisponível; seguindo offline.", error?.message);
    return { ok: true, user: { ...localUser, source: "offline" } };
  }
};

/**
 * Envia a pontuação final para a API REST (complementar ao WebSocket).
 * Falha silenciosa — o WebSocket é a fonte primária de ranking.
 */
export const submitScore = async (scorePayload) => {
  if (!hasRemoteApi) return { ok: false, reason: "api_not_configured" };

  try {
    await request(API_ENDPOINTS.score, {
      method: "POST",
      body: JSON.stringify(scorePayload),
    });
    return { ok: true };
  } catch (error) {
    console.warn("[gameApi] Não foi possível sincronizar pontuação REST.", error?.message);
    return { ok: false, reason: "sync_failed" };
  }
};
