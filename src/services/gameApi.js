import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT_MS } from "../config/api.js";
import { categories as localCategories, questions as localQuestions } from "../data/gameData.jsx";

const hasRemoteApi = Boolean(API_BASE_URL);

// ---------------------------------------------------------------------------
// HTTP client
// ---------------------------------------------------------------------------

/**
 * Faz uma requisição REST para a API.
 * @param {string} path
 * @param {RequestInit & { authNome?: string }} options
 *   authNome → quando informado, adiciona o header `nome` exigido pela API.
 */
const request = async (path, options = {}) => {
  if (!hasRemoteApi) throw new Error("VITE_API_BASE_URL não configurado.");

  const { authNome, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(authNome ? { nome: authNome } : {}),
        ...(fetchOptions.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      const err = new Error(payload?.detail || payload?.message || `HTTP ${response.status}`);
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
// Auth
// ---------------------------------------------------------------------------

/**
 * Autentica o usuário e retorna seus dados completos.
 *
 * Fluxo da API:
 *   1. POST /auth/login  — verifica credenciais (retorna apenas {mensagem})
 *   2. GET  /auth/meus-dados (Header: nome) — retorna {id, nome, nivel, acerto_total, erro_total}
 *
 * Nota: o serviço /auth/login tem um bug conhecido onde qualquer exceção
 * interna retorna 500 ao invés de 401/404. Tratamos todos os erros como
 * "credenciais inválidas" para não expor detalhes ao usuário.
 *
 * @returns {{ ok: true, user: object } | { ok: false, message: string }}
 */
export const loginUser = async (nome, senha) => {
  if (!hasRemoteApi) {
    // Modo offline: aceita qualquer nome/senha para desenvolvimento local
    return {
      ok: true,
      user: { id: 1, nome, nivel: 0, acerto_total: 0, erro_total: 0 },
    };
  }

  try {
    // Passo 1: verificar credenciais
    await request(API_ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify({ nome, senha }),
    });

    // Passo 2: buscar dados completos do usuário
    const userData = await request(API_ENDPOINTS.myData, { authNome: nome });

    return {
      ok: true,
      user: {
        id: userData.id,
        nome: userData.nome ?? nome,
        nivel: userData.nivel ?? 0,
        acerto_total: userData.acerto_total ?? 0,
        erro_total: userData.erro_total ?? 0,
      },
    };
  } catch (err) {
    // 404 = usuário não encontrado, 401 = senha errada, 500 = bug da API (mesma causa)
    return {
      ok: false,
      message: "Nome de usuário ou senha incorretos.",
    };
  }
};

/**
 * Cria uma nova conta e em seguida autentica automaticamente.
 *
 * Nota: POST /auth/registro tem um mismatch de response_model na API original,
 * mas o usuário é criado no banco independentemente disso. Por isso fazemos
 * o login logo após o registro para obter os dados reais.
 *
 * @returns {{ ok: true, user: object } | { ok: false, message: string }}
 */
export const registerUser = async (nome, senha) => {
  if (!hasRemoteApi) {
    return {
      ok: true,
      user: { id: Date.now(), nome, nivel: 0, acerto_total: 0, erro_total: 0 },
    };
  }

  try {
    await request(API_ENDPOINTS.register, {
      method: "POST",
      body: JSON.stringify({ nome, senha }),
    });
  } catch (err) {
    // 400 = nome já em uso
    if (err.status === 400) {
      return { ok: false, message: "Esse nome de usuário já está em uso." };
    }
    return { ok: false, message: "Não foi possível criar a conta. Tente novamente." };
  }

  // Auto-login após registro bem-sucedido
  return loginUser(nome, senha);
};

// ---------------------------------------------------------------------------
// Progress saving
// ---------------------------------------------------------------------------

/**
 * Salva o progresso acumulado do usuário no banco.
 * Chamado após cada resposta (correta ou incorreta).
 * Falha silenciosa — o progresso local não é afetado se a API estiver fora.
 */
export const saveProgress = async (userId, acertoTotal, erroTotal) => {
  if (!hasRemoteApi || !userId) return;

  try {
    await request(API_ENDPOINTS.updateProgress(userId), {
      method: "PUT",
      body: JSON.stringify({ acerto_total: acertoTotal, erro_total: erroTotal }),
    });
  } catch (err) {
    console.warn("[gameApi] Falha ao salvar progresso no banco:", err?.message);
  }
};

/**
 * Registra a conclusão de uma categoria para o usuário.
 * Cria um registro na tabela Registro com acerto_categoria = 1.
 * Falha silenciosa.
 */
export const saveRegistro = async (userId, categoriaId) => {
  if (!hasRemoteApi || !userId || !categoriaId) return;

  try {
    await request(API_ENDPOINTS.createRegistro, {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        categoria_id: categoriaId,
        acerto_categoria: 1,
      }),
    });
  } catch (err) {
    console.warn("[gameApi] Falha ao registrar categoria concluída:", err?.message);
  }
};

// ---------------------------------------------------------------------------
// Game content (categorias + perguntas)
// ---------------------------------------------------------------------------

const pickCollection = (payload, keys) => {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeCategory = (category, index) => {
  const id = Number(category.id ?? category.categoria_id ?? index + 1);
  const order = Number(category.ordem ?? category.order ?? id);
  const fallback = localCategories.find((c) => c.id === id) || localCategories[index] || {};

  return {
    ...fallback,
    ...category,
    id,
    ordem: order,
    nome: category.nome ?? category.name ?? fallback.nome,
    cor: category.cor ?? fallback.cor,
    icon: category.icon ?? category.icone ?? fallback.icon,
  };
};

const normalizeAlternative = (alt, index) => ({
  ...alt,
  letra: alt.letra ?? alt.letter ?? String.fromCharCode(65 + index),
  texto: alt.texto ?? alt.text ?? alt.label ?? "",
});

const normalizeQuestion = (question, index) => {
  const alternativas = question.alternativas ?? question.options ?? question.answers ?? [];
  return {
    ...question,
    id: question.id ?? index + 1,
    categoria_id: Number(question.categoria_id ?? question.categoria ?? question.category_id ?? 1),
    numero: question.numero ?? `${index + 1}`,
    tipo_pergunta: question.tipo_pergunta ?? "Pergunta",
    texto: question.texto ?? question.text ?? question.pergunta ?? "",
    dica: question.dica ?? question.hint ?? "",
    alternativas: Array.isArray(alternativas)
      ? alternativas.map(normalizeAlternative)
      : Object.entries(alternativas).map(([letra, texto], i) =>
          normalizeAlternative({ letra, texto }, i),
        ),
    resposta_correta:
      question.resposta_correta ?? question.resposta ?? question.correct_answer ?? question.answer,
    feedback_acerto: question.feedback_acerto ?? question.feedback ?? "",
  };
};

export const getFallbackContent = () => ({
  categories: localCategories,
  questions: localQuestions,
  source: "local",
  error: null,
});

/**
 * Carrega categorias e perguntas da API com fallback para dados locais.
 */
export const loadGameContent = async () => {
  if (!hasRemoteApi) return getFallbackContent();

  try {
    const [catPayload, qPayload] = await Promise.all([
      request(API_ENDPOINTS.categories),
      request(API_ENDPOINTS.questions),
    ]);

    const categories = pickCollection(catPayload, ["categories", "categorias"])
      .map(normalizeCategory)
      .sort((a, b) => a.ordem - b.ordem);

    const questions = pickCollection(qPayload, ["questions", "perguntas"])
      .map(normalizeQuestion)
      .filter((q) => q.texto && q.alternativas.length > 0);

    if (!categories.length || !questions.length) {
      throw new Error("API retornou dados vazios.");
    }

    return { categories, questions, source: "api", error: null };
  } catch (err) {
    console.warn("[gameApi] Usando dados locais:", err?.message);
    return { ...getFallbackContent(), source: "fallback", error: err };
  }
};
