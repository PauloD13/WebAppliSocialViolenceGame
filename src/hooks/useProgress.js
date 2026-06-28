import { useCallback, useMemo, useState } from "react";
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from "../utils/browserStorage.js";
import { categories as fallbackCategories } from "../data/categories.js";

// ---------------------------------------------------------------------------
// Pure helpers (no hooks)
// ---------------------------------------------------------------------------

const calculatePoints = (categoryErrors = 0) => Math.max(40, 120 - categoryErrors * 20);

const getCategoryQuestionIds = (questions, categoryId) =>
  questions.filter((q) => Number(q.categoria_id) === Number(categoryId)).map((q) => q.id);

const getNextCategoryId = (categories, categoryId) => {
  const sorted = [...categories].sort((a, b) => a.ordem - b.ordem);
  const idx = sorted.findIndex((c) => Number(c.id) === Number(categoryId));
  return idx >= 0 ? sorted[idx + 1]?.id : undefined;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Gerencia todo o estado de progresso do jogo.
 *
 * @param {object} options
 * @param {object[]} options.categories  - Lista de categorias (da API ou local)
 * @param {object[]} options.questions   - Lista de perguntas (da API ou local)
 * @param {function} options.onScoreUpdate - Callback (nextScore, nextCompleted) invocado ao acertar
 */
export function useProgress({ categories, questions, onScoreUpdate }) {
  const firstCategoryId = categories[0]?.id ?? fallbackCategories[0]?.id ?? 1;

  const [unlockedCategories, setUnlockedCategories] = useState(() =>
    readJsonStorage(STORAGE_KEYS.unlocked, [firstCategoryId]),
  );
  const [completedCategories, setCompletedCategories] = useState(() =>
    readJsonStorage(STORAGE_KEYS.completed, []),
  );
  const [currentPool, setCurrentPool] = useState(() => readJsonStorage(STORAGE_KEYS.pool, {}));
  const [attempts, setAttempts] = useState(() => readJsonStorage(STORAGE_KEYS.attempts, {}));
  const [errors, setErrors] = useState(() => readJsonStorage(STORAGE_KEYS.errors, {}));
  const [history, setHistory] = useState(() => readJsonStorage(STORAGE_KEYS.history, []));
  const [score, setScore] = useState(() => Number(readJsonStorage(STORAGE_KEYS.score, 0)) || 0);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ---------------------------------------------------------------------------
  // Persistence helper
  // ---------------------------------------------------------------------------

  const save = useCallback((key, value) => {
    writeJsonStorage(key, value);
  }, []);

  // ---------------------------------------------------------------------------
  // Pool helpers
  // ---------------------------------------------------------------------------

  const getPoolForCategory = useCallback(
    (categoryId) => {
      const ids = getCategoryQuestionIds(questions, categoryId);
      const saved = currentPool[categoryId];
      const valid = Array.isArray(saved) ? saved.filter((id) => ids.includes(id)) : [];
      return valid.length > 0 ? valid : ids;
    },
    [currentPool, questions],
  );

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const drawQuestion = useCallback(
    (categoryId) => {
      const pool = getPoolForCategory(categoryId);
      if (pool.length === 0) {
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

      // Always track attempts
      const nextAttempts = { ...attempts, [categoryId]: (attempts[categoryId] || 0) + 1 };
      setAttempts(nextAttempts);
      save(STORAGE_KEYS.attempts, nextAttempts);

      if (isCorrect) {
        const nextCategoryId = getNextCategoryId(categories, categoryId);
        const nextUnlocked = nextCategoryId
          ? [...new Set([...unlockedCategories, nextCategoryId])]
          : unlockedCategories;
        const nextCompleted = [...new Set([...completedCategories, Number(categoryId)])];

        const alreadyCompleted = completedCategories.includes(Number(categoryId));
        const earnedPoints = alreadyCompleted ? 0 : calculatePoints(errors[categoryId] || 0);
        const nextScore = score + earnedPoints;

        const nextPool = { ...currentPool };
        delete nextPool[categoryId];

        setUnlockedCategories(nextUnlocked);
        setCompletedCategories(nextCompleted);
        setCurrentPool(nextPool);
        setScore(nextScore);
        setShowError(false);
        setSelectedOption(null);

        save(STORAGE_KEYS.unlocked, nextUnlocked);
        save(STORAGE_KEYS.completed, nextCompleted);
        save(STORAGE_KEYS.pool, nextPool);
        save(STORAGE_KEYS.score, nextScore);

        if (!alreadyCompleted) {
          onScoreUpdate?.(nextScore, nextCompleted);
        }

        return { correct: true, feedback: question.feedback_acerto, points: earnedPoints };
      }

      // Wrong answer — remove from pool, track error
      const pool = getPoolForCategory(categoryId);
      const nextPoolIds = pool.filter((id) => String(id) !== String(questionId));
      const resetIds = getCategoryQuestionIds(questions, categoryId);
      const nextPool = {
        ...currentPool,
        [categoryId]: nextPoolIds.length === 0 ? resetIds : nextPoolIds,
      };
      const nextErrors = { ...errors, [categoryId]: (errors[categoryId] || 0) + 1 };

      setCurrentPool(nextPool);
      setErrors(nextErrors);
      setShowError(true);
      setErrorMessage("Resposta incorreta, tente novamente");

      save(STORAGE_KEYS.pool, nextPool);
      save(STORAGE_KEYS.errors, nextErrors);

      return { correct: false };
    },
    [
      attempts,
      categories,
      completedCategories,
      currentPool,
      errors,
      getPoolForCategory,
      onScoreUpdate,
      questions,
      save,
      score,
      unlockedCategories,
    ],
  );

  const resetTrail = useCallback(() => {
    // Archive current run to history if fully complete
    if (completedCategories.length === categories.length && categories.length > 0) {
      const entry = {
        date: new Date().toISOString(),
        attempts: { ...attempts },
        errors: { ...errors },
        score,
      };
      const nextHistory = [...history, entry];
      setHistory(nextHistory);
      save(STORAGE_KEYS.history, nextHistory);
    }

    setUnlockedCategories([firstCategoryId]);
    setCompletedCategories([]);
    setCurrentPool({});
    setAttempts({});
    setErrors({});
    setScore(0);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowError(false);

    save(STORAGE_KEYS.unlocked, [firstCategoryId]);
    save(STORAGE_KEYS.completed, []);
    save(STORAGE_KEYS.pool, {});
    save(STORAGE_KEYS.attempts, {});
    save(STORAGE_KEYS.errors, {});
    save(STORAGE_KEYS.score, 0);

    onScoreUpdate?.(0, []);
  }, [
    attempts,
    categories,
    completedCategories,
    errors,
    firstCategoryId,
    history,
    onScoreUpdate,
    save,
    score,
  ]);

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  const completedCount = useMemo(
    () => categories.filter((c) => completedCategories.includes(c.id)).length,
    [categories, completedCategories],
  );

  const isTrailComplete = categories.length > 0 && completedCount === categories.length;

  const getCategoryStats = useCallback(
    () =>
      categories.map((cat) => ({
        ...cat,
        unlocked: unlockedCategories.includes(cat.id),
        completed: completedCategories.includes(cat.id),
        attempts: attempts[cat.id] || 0,
        errors: errors[cat.id] || 0,
      })),
    [attempts, categories, completedCategories, errors, unlockedCategories],
  );

  return {
    // State
    unlockedCategories,
    completedCategories,
    currentPool,
    attempts,
    errors,
    history,
    score,
    currentQuestion,
    selectedOption,
    setSelectedOption,
    showError,
    errorMessage,
    // Actions
    drawQuestion,
    submitAnswer,
    resetTrail,
    // Derived
    isTrailComplete,
    completedCount,
    getCategoryStats,
  };
}
