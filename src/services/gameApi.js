import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT_MS } from "../config/api.js";
import { categories as localCategories, questions as localQuestions } from "../data/gameData.jsx";

const hasRemoteApi = Boolean(API_BASE_URL);

const pickCollection = (payload, keys) => {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const request = async (path, options = {}) => {
  if (!hasRemoteApi) {
    throw new Error("API base URL não configurada.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      const error = new Error(payload?.message || "Falha ao comunicar com a API.");
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
};

const normalizeCategory = (category, index) => {
  const id = Number(category.id ?? category.categoria_id ?? category.categoryId ?? index + 1);
  const order = Number(category.ordem ?? category.order ?? category.position ?? id);
  const fallback = localCategories.find((item) => item.id === id) || localCategories[index] || {};

  return {
    ...fallback,
    ...category,
    id,
    ordem: order,
    nome: category.nome ?? category.name ?? category.title ?? fallback.nome,
    cor: category.cor ?? category.color ?? category.hexColor ?? fallback.cor,
    icon: category.icon ?? category.icone ?? fallback.icon,
  };
};

const normalizeAlternative = (alternative, index) => ({
  ...alternative,
  letra:
    alternative.letra ?? alternative.letter ?? alternative.key ?? String.fromCharCode(65 + index),
  texto:
    alternative.texto ?? alternative.text ?? alternative.label ?? alternative.description ?? "",
});

const normalizeQuestion = (question, index) => {
  const alternativas = question.alternativas ?? question.options ?? question.answers ?? [];

  return {
    ...question,
    id: question.id ?? question.questionId ?? question.uuid ?? index + 1,
    categoria_id: Number(
      question.categoria_id ??
        question.category_id ??
        question.categoryId ??
        question.category?.id ??
        1,
    ),
    numero: question.numero ?? question.number ?? question.code ?? `${index + 1}`,
    tipo_pergunta: question.tipo_pergunta ?? question.type ?? question.kind ?? "Pergunta",
    texto: question.texto ?? question.text ?? question.statement ?? question.title ?? "",
    dica: question.dica ?? question.hint ?? question.tip ?? "",
    alternativas: alternativas.map(normalizeAlternative),
    resposta_correta:
      question.resposta_correta ??
      question.correct_answer ??
      question.correctAnswer ??
      question.answer ??
      question.answerKey,
    feedback_acerto:
      question.feedback_acerto ??
      question.success_feedback ??
      question.successFeedback ??
      question.feedback ??
      "",
  };
};

export const getFallbackContent = () => ({
  categories: localCategories,
  questions: localQuestions,
  source: "local",
  error: null,
});

export const loadGameContent = async () => {
  if (!hasRemoteApi) {
    return getFallbackContent();
  }

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
      .filter((question) => question.texto && question.alternativas.length > 0);

    if (categories.length === 0 || questions.length === 0) {
      throw new Error("A API retornou categorias ou perguntas vazias.");
    }

    return {
      categories,
      questions,
      source: "api",
      error: null,
    };
  } catch (error) {
    console.warn("Usando dados locais porque a API não respondeu corretamente.", error);
    return {
      ...getFallbackContent(),
      source: "fallback",
      error,
    };
  }
};

export const reserveNickname = async ({ nickname, clientId, expiresAt }) => {
  const localUser = {
    id: clientId,
    clientId,
    nickname,
    expiresAt,
    source: "local",
  };

  if (!hasRemoteApi) {
    return { ok: true, user: localUser };
  }

  try {
    const payload = await request(API_ENDPOINTS.nicknameSession, {
      method: "POST",
      body: JSON.stringify({ nickname, clientId, expiresAt }),
    });

    const data = payload?.data || payload || {};

    return {
      ok: true,
      user: {
        ...localUser,
        ...data,
        id: data.id ?? data.userId ?? data.playerId ?? clientId,
        nickname: data.nickname ?? nickname,
        clientId: data.clientId ?? clientId,
        expiresAt: data.expiresAt ?? expiresAt,
        source: "api",
      },
    };
  } catch (error) {
    if (error.status === 409) {
      return {
        ok: false,
        reason: "nickname_in_use",
        message: error.payload?.message || "Esse apelido já está em uso. Tente outro.",
      };
    }

    console.warn("Sessão remota indisponível; seguindo com sessão local.", error);
    return {
      ok: true,
      user: {
        ...localUser,
        source: "offline",
      },
    };
  }
};

export const submitScore = async (scorePayload) => {
  if (!hasRemoteApi) return { ok: false, reason: "api_not_configured" };

  try {
    await request(API_ENDPOINTS.score, {
      method: "POST",
      body: JSON.stringify(scorePayload),
    });
    return { ok: true };
  } catch (error) {
    console.warn("Não foi possível sincronizar pontuação com a API.", error);
    return { ok: false, reason: "sync_failed" };
  }
};
