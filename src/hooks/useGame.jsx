import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  categories as fallbackCategories,
  questions as fallbackQuestions,
} from "../data/gameData.jsx";
import {
  loadGameContent,
  loginUser  as apiLogin,
  registerUser as apiRegister,
  saveProgress,
  saveRegistro,
} from "../services/gameApi.js";
import {
  STORAGE_KEYS,
  clearAllStorage,
  readJsonStorage,
  removeStorage,
  writeJsonStorage,
} from "../utils/browserStorage.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POINTS_PER_CORRECT = 5;

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

const getCategoryQuestionIds = (questionList, categoryId) =>
  questionList
    .filter((q) => Number(q.categoria_id) === Number(categoryId))
    .map((q) => q.id);

const getNextCategoryId = (categoryList, categoryId) => {
  const ordered = [...categoryList].sort((a, b) => a.ordem - b.ordem);
  const idx = ordered.findIndex((c) => Number(c.id) === Number(categoryId));
  return idx >= 0 ? ordered[idx + 1]?.id : undefined;
};

const getInitialUser = () =>
  readJsonStorage(STORAGE_KEYS.user, null);

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const GameContext = createContext();

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function GameProvider({ children }) {
  // ------ Content ------
  const [categories, setCategories] = useState(fallbackCategories);
  const [questions, setQuestions]   = useState(fallbackQuestions);
  const [contentStatus, setContentStatus] = useState("loading");
  const [contentError, setContentError]   = useState(null);

  // ------ Auth ------
  const [user, setUser] = useState(getInitialUser);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // ------ Game progress ------
  const [unlockedCategories, setUnlockedCategories] = useState(() =>
    readJsonStorage(STORAGE_KEYS.unlocked, [fallbackCategories[0]?.id || 1]),
  );
  const [completedCategories, setCompletedCategories] = useState(() =>
    readJsonStorage(STORAGE_KEYS.completed, []),
  );
  const [currentPool, setCurrentPool] = useState(() =>
    readJsonStorage(STORAGE_KEYS.pool, {}),
  );
  const [attempts, setAttempts] = useState(() =>
    readJsonStorage(STORAGE_KEYS.attempts, {}),
  );
  const [errors, setErrors] = useState(() =>
    readJsonStorage(STORAGE_KEYS.errors, {}),
  );
  const [history, setHistory] = useState(() =>
    readJsonStorage(STORAGE_KEYS.history, []),
  );

  // score = pontuação acumulada nesta sessão (5 pts / acerto)
  const [score, setScore] = useState(
    () => Number(readJsonStorage(STORAGE_KEYS.score, 0)) || 0,
  );

  // ------ Question state ------
  const [currentQuestion, setCurrentQuestion]   = useState(null);
  const [selectedOption, setSelectedOption]     = useState(null);
  const [showError, setShowError]               = useState(false);
  const [errorMessage, setErrorMessage]         = useState("");

  // Ref para acerto_total e erro_total acumulados no banco
  // Usamos ref para evitar deps desnecessárias no submitAnswer
  const dbAcertoRef = useRef(user?.acerto_total ?? 0);
  const dbErroRef   = useRef(user?.erro_total   ?? 0);

  // Sincroniza refs quando o user muda (login/logout)
  useEffect(() => {
    dbAcertoRef.current = user?.acerto_total ?? 0;
    dbErroRef.current   = user?.erro_total   ?? 0;
  }, [user]);

  // ---------------------------------------------------------------------------
  // Storage helper
  // ---------------------------------------------------------------------------

  const save = useCallback((key, value) => writeJsonStorage(key, value), []);

  // ---------------------------------------------------------------------------
  // Load game content
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let active = true;
    loadGameContent().then((content) => {
      if (!active) return;
      setCategories(content.categories);
      setQuestions(content.questions);
      setContentStatus(content.source);
      setContentError(content.error?.message ?? null);
    });
    return () => { active = false; };
  }, []);

  // Reinicia categorias desbloqueadas se os IDs mudaram (API reload)
  useEffect(() => {
    if (!categories.length) return;
    const valid = unlockedCategories.some((id) =>
      categories.some((c) => c.id === id),
    );
    if (!valid) {
      const next = [categories[0].id];
      setUnlockedCategories(next);
      save(STORAGE_KEYS.unlocked, next);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // ---------------------------------------------------------------------------
  // Auth — login
  // ---------------------------------------------------------------------------

  const loginUserFn = useCallback(async (nome, senha) => {
    setAuthError("");
    setAuthLoading(true);

    const result = await apiLogin(nome.trim(), senha);

    setAuthLoading(false);

    if (!result.ok) {
      setAuthError(result.message);
      return result;
    }

    setUser(result.user);
    // Sincroniza contadores do banco com os refs
    dbAcertoRef.current = result.user.acerto_total ?? 0;
    dbErroRef.current   = result.user.erro_total   ?? 0;
    save(STORAGE_KEYS.user, result.user);

    return { ok: true };
  }, [save]);

  // ---------------------------------------------------------------------------
  // Auth — register
  // ---------------------------------------------------------------------------

  const registerUserFn = useCallback(async (nome, senha) => {
    setAuthError("");
    setAuthLoading(true);

    const result = await apiRegister(nome.trim(), senha);

    setAuthLoading(false);

    if (!result.ok) {
      setAuthError(result.message);
      return result;
    }

    setUser(result.user);
    dbAcertoRef.current = result.user.acerto_total ?? 0;
    dbErroRef.current   = result.user.erro_total   ?? 0;
    save(STORAGE_KEYS.user, result.user);

    return { ok: true };
  }, [save]);

  // ---------------------------------------------------------------------------
  // Auth — logout
  // ---------------------------------------------------------------------------

  const logoutUser = useCallback(() => {
    setUser(null);
    setAuthError("");
    dbAcertoRef.current = 0;
    dbErroRef.current   = 0;

    // Limpa TUDO do localStorage (progresso + conta)
    clearAllStorage();

    // Reinicia estados de jogo para os valores iniciais
    const firstId = categories[0]?.id || 1;
    setUnlockedCategories([firstId]);
    setCompletedCategories([]);
    setCurrentPool({});
    setAttempts({});
    setErrors({});
    setHistory([]);
    setScore(0);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowError(false);
  }, [categories]);

  // ---------------------------------------------------------------------------
  // Pool helpers
  // ---------------------------------------------------------------------------

  const getPoolForCategory = useCallback(
    (categoryId) => {
      const allIds  = getCategoryQuestionIds(questions, categoryId);
      const saved   = currentPool[categoryId];
      const valid   = Array.isArray(saved)
        ? saved.filter((id) => allIds.includes(id))
        : [];
      return valid.length > 0 ? valid : allIds;
    },
    [currentPool, questions],
  );

  // ---------------------------------------------------------------------------
  // Draw question
  // Usa uma ref para a função para evitar que a troca de pool (erro)
  // dispare um re-draw não intencional no useEffect de Question.jsx
  // ---------------------------------------------------------------------------

  const drawQuestionFn = useCallback(
    (categoryId) => {
      const pool = getPoolForCategory(categoryId);
      if (!pool.length) {
        setCurrentQuestion(null);
        return null;
      }
      const randomId = pool[Math.floor(Math.random() * pool.length)];
      const question = questions.find((q) => String(q.id) === String(randomId)) ?? null;
      setCurrentQuestion(question);
      setSelectedOption(null);
      return question;
    },
    [getPoolForCategory, questions],
  );

  // Ref estável para drawQuestion — evita que Question.jsx faça re-draw
  // quando apenas o pool muda (ex: após resposta errada)
  const drawQuestionRef = useRef(drawQuestionFn);
  useEffect(() => { drawQuestionRef.current = drawQuestionFn; });

  const drawQuestion = useCallback((categoryId) => {
    drawQuestionRef.current(categoryId);
  }, []);

  // ---------------------------------------------------------------------------
  // Submit answer
  // ---------------------------------------------------------------------------

  const submitAnswer = useCallback(
    (categoryId, questionId, answer) => {
      const question = questions.find((q) => String(q.id) === String(questionId));

      if (!question) {
        setShowError(true);
        setErrorMessage("Pergunta não encontrada. Tente novamente.");
        return { correct: false };
      }

      const isCorrect =
        String(answer).toUpperCase() === String(question.resposta_correta).toUpperCase();

      // Registra tentativa
      const nextAttempts = { ...attempts, [categoryId]: (attempts[categoryId] || 0) + 1 };
      setAttempts(nextAttempts);
      save(STORAGE_KEYS.attempts, nextAttempts);

      // ------ ACERTO ------
      if (isCorrect) {
        const alreadyCompleted = completedCategories.includes(Number(categoryId));

        const nextCompleted  = [...new Set([...completedCategories, Number(categoryId)])];
        const nextCategoryId = getNextCategoryId(categories, categoryId);
        const nextUnlocked   = nextCategoryId
          ? [...new Set([...unlockedCategories, nextCategoryId])]
          : unlockedCategories;

        // 5 pts por acerto, mas apenas uma vez por categoria
        const earnedPoints = alreadyCompleted ? 0 : POINTS_PER_CORRECT;
        const nextScore    = score + earnedPoints;

        const nextPool = { ...currentPool };
        delete nextPool[categoryId];

        setCompletedCategories(nextCompleted);
        setUnlockedCategories(nextUnlocked);
        setCurrentPool(nextPool);
        setScore(nextScore);
        setShowError(false);
        setSelectedOption(null);

        save(STORAGE_KEYS.completed, nextCompleted);
        save(STORAGE_KEYS.unlocked, nextUnlocked);
        save(STORAGE_KEYS.pool, nextPool);
        save(STORAGE_KEYS.score, nextScore);

        // Sincroniza com o banco (fire-and-forget)
        if (!alreadyCompleted && user?.id) {
          dbAcertoRef.current += 1;
          const currentAcerto = dbAcertoRef.current;
          const currentErro   = dbErroRef.current;

          saveProgress(user.id, currentAcerto, currentErro);
          saveRegistro(user.id, categoryId);
        }

        return {
          correct: true,
          feedback: question.feedback_acerto,
          points: earnedPoints,
        };
      }

      // ------ ERRO ------
      const pool       = getPoolForCategory(categoryId);
      const remaining  = pool.filter((id) => String(id) !== String(questionId));
      const resetPool  = getCategoryQuestionIds(questions, categoryId);
      const nextPool   = {
        ...currentPool,
        [categoryId]: remaining.length === 0 ? resetPool : remaining,
      };
      const nextErrors = { ...errors, [categoryId]: (errors[categoryId] || 0) + 1 };

      setCurrentPool(nextPool);
      setErrors(nextErrors);
      setShowError(true);
      setErrorMessage("Resposta incorreta, tente novamente");

      save(STORAGE_KEYS.pool, nextPool);
      save(STORAGE_KEYS.errors, nextErrors);

      // Salva erro no banco também (fire-and-forget)
      if (user?.id) {
        dbErroRef.current += 1;
        saveProgress(user.id, dbAcertoRef.current, dbErroRef.current);
      }

      return { correct: false };
    },
    [
      attempts, categories, completedCategories, currentPool,
      errors, getPoolForCategory, questions, save, score,
      unlockedCategories, user,
    ],
  );

  // ---------------------------------------------------------------------------
  // Reset trail
  // ---------------------------------------------------------------------------

  const resetTrail = useCallback(() => {
    // Arquiva sessão encerrada no histórico local
    if (completedCategories.length === categories.length && categories.length > 0) {
      const entry = {
        date: new Date().toISOString(),
        nome: user?.nome,
        attempts: { ...attempts },
        errors:   { ...errors },
        score,
      };
      const nextHistory = [...history, entry];
      setHistory(nextHistory);
      save(STORAGE_KEYS.history, nextHistory);
    }

    const firstId = categories[0]?.id || 1;

    setUnlockedCategories([firstId]);
    setCompletedCategories([]);
    setCurrentPool({});
    setAttempts({});
    setErrors({});
    setScore(0);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowError(false);

    save(STORAGE_KEYS.unlocked, [firstId]);
    save(STORAGE_KEYS.completed, []);
    save(STORAGE_KEYS.pool, {});
    save(STORAGE_KEYS.attempts, {});
    save(STORAGE_KEYS.errors, {});
    save(STORAGE_KEYS.score, 0);
  }, [
    attempts, categories, completedCategories,
    errors, history, save, score, user,
  ]);

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  const completedCount = useMemo(
    () => categories.filter((c) => completedCategories.includes(c.id)).length,
    [categories, completedCategories],
  );

  const isTrailComplete =
    categories.length > 0 && completedCount === categories.length;

  const getCategoryStats = useCallback(
    () =>
      categories.map((cat) => ({
        ...cat,
        unlocked:  unlockedCategories.includes(cat.id),
        completed: completedCategories.includes(cat.id),
        attempts:  attempts[cat.id]  || 0,
        errors:    errors[cat.id]    || 0,
      })),
    [attempts, categories, completedCategories, errors, unlockedCategories],
  );

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------

  const value = {
    // Auth
    user,
    authError,
    authLoading,
    loginUser:    loginUserFn,
    registerUser: registerUserFn,
    logoutUser,

    // Content
    categories,
    questions,
    contentStatus,
    contentError,

    // Game state
    unlockedCategories,
    completedCategories,
    currentQuestion,
    selectedOption,
    setSelectedOption,
    showError,
    errorMessage,
    score,
    history,

    // Actions
    drawQuestion,
    submitAnswer,
    resetTrail,

    // Derived
    isTrailComplete,
    completedCount,
    getCategoryStats,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame deve ser usado dentro de <GameProvider>");
  return context;
}
