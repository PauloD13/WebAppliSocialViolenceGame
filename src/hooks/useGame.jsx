import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SESSION_TTL_SECONDS } from "../config/api.js";
import {
  categories as fallbackCategories,
  questions as fallbackQuestions,
} from "../data/gameData.jsx";
import { loadGameContent, reserveNickname, submitScore } from "../services/gameApi.js";
import { createRankingConnection, mergeRankingEntry } from "../services/realtimeRanking.js";
import {
  STORAGE_KEYS,
  createClientId,
  readJsonCookie,
  readJsonStorage,
  removeCookie,
  removeStorage,
  writeJsonCookie,
  writeJsonStorage,
} from "../utils/browserStorage.js";

const GameContext = createContext();

const isSessionValid = (session) => {
  if (!session?.id || !session?.nickname) return false;
  if (!session.expiresAt) return true;
  return new Date(session.expiresAt).getTime() > Date.now();
};

const getInitialUser = () => {
  const session = readJsonCookie(STORAGE_KEYS.session, null);

  if (isSessionValid(session)) {
    const savedUser = readJsonStorage(STORAGE_KEYS.user, {});
    return { ...savedUser, ...session };
  }

  removeCookie(STORAGE_KEYS.session);
  removeStorage(STORAGE_KEYS.user);
  return null;
};

const getRemainingSessionSeconds = (user) => {
  if (!user?.expiresAt) return SESSION_TTL_SECONDS;
  return Math.max(0, Math.ceil((new Date(user.expiresAt).getTime() - Date.now()) / 1000));
};

const persistSessionCookie = ({ user, score, unlockedCategories, completedCategories }) => {
  if (!user) return;

  const remainingSeconds = getRemainingSessionSeconds(user);
  if (remainingSeconds <= 0) {
    removeCookie(STORAGE_KEYS.session);
    return;
  }

  writeJsonCookie(
    STORAGE_KEYS.session,
    {
      id: user.id,
      clientId: user.clientId,
      nickname: user.nickname,
      expiresAt: user.expiresAt,
      score,
      unlockedCategories,
      completedCategories,
    },
    remainingSeconds,
  );
};

const getCategoryQuestionIds = (questionList, categoryId) =>
  questionList
    .filter((question) => Number(question.categoria_id) === Number(categoryId))
    .map((question) => question.id);

const getNextCategoryId = (categoryList, categoryId) => {
  const orderedCategories = [...categoryList].sort((a, b) => a.ordem - b.ordem);
  const currentIndex = orderedCategories.findIndex(
    (category) => Number(category.id) === Number(categoryId),
  );
  return currentIndex >= 0 ? orderedCategories[currentIndex + 1]?.id : undefined;
};

const calculatePoints = (categoryErrors = 0) => Math.max(40, 120 - categoryErrors * 20);

export function GameProvider({ children }) {
  const rankingConnectionRef = useRef(null);

  const [categories, setCategories] = useState(fallbackCategories);
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [contentStatus, setContentStatus] = useState("loading");
  const [contentError, setContentError] = useState(null);

  const [user, setUser] = useState(getInitialUser);
  const [nicknameError, setNicknameError] = useState("");

  const [unlockedCategories, setUnlockedCategories] = useState(() =>
    readJsonStorage(STORAGE_KEYS.unlocked, [fallbackCategories[0]?.id || 1]),
  );

  const [completedCategories, setCompletedCategories] = useState(() =>
    readJsonStorage(STORAGE_KEYS.completed, []),
  );

  const [currentPool, setCurrentPool] = useState(() => readJsonStorage(STORAGE_KEYS.pool, {}));

  const [attempts, setAttempts] = useState(() => readJsonStorage(STORAGE_KEYS.attempts, {}));

  const [errors, setErrors] = useState(() => readJsonStorage(STORAGE_KEYS.errors, {}));

  const [history, setHistory] = useState(() => readJsonStorage(STORAGE_KEYS.history, []));

  const [score, setScore] = useState(() => Number(readJsonStorage(STORAGE_KEYS.score, 0)) || 0);

  const [ranking, setRanking] = useState(() => readJsonStorage(STORAGE_KEYS.ranking, []));

  const [rankingStatus, setRankingStatus] = useState("offline");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const saveToStorage = useCallback((key, value) => {
    writeJsonStorage(key, value);
  }, []);

  const publishScore = useCallback(
    (nextScore, nextCompletedCategories) => {
      if (!user) return;

      const payload = {
        id: user.id,
        userId: user.id,
        nickname: user.nickname,
        score: nextScore,
        completedCategories: nextCompletedCategories.length,
        totalCategories: categories.length,
        updatedAt: new Date().toISOString(),
      };

      setRanking((previousRanking) => {
        const nextRanking = mergeRankingEntry(previousRanking, payload);
        writeJsonStorage(STORAGE_KEYS.ranking, nextRanking);
        return nextRanking;
      });

      rankingConnectionRef.current?.sendScore(payload);
      submitScore(payload);
    },
    [categories.length, user],
  );

  const setNickname = useCallback(
    async (nickname) => {
      const normalizedNickname = nickname.trim().slice(0, 24);

      if (!normalizedNickname) {
        const message = "Informe um apelido para começar.";
        setNicknameError(message);
        return { ok: false, message };
      }

      const clientId = createClientId();
      const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
      const result = await reserveNickname({ nickname: normalizedNickname, clientId, expiresAt });

      if (!result.ok) {
        setNicknameError(result.message);
        return result;
      }

      const userData = {
        ...result.user,
        id: result.user.id || clientId,
        clientId: result.user.clientId || clientId,
        nickname: result.user.nickname || normalizedNickname,
        expiresAt: result.user.expiresAt || expiresAt,
      };

      setUser(userData);
      setNicknameError("");
      saveToStorage(STORAGE_KEYS.user, userData);
      persistSessionCookie({
        user: userData,
        score,
        unlockedCategories,
        completedCategories,
      });

      return { ok: true, user: userData };
    },
    [completedCategories, saveToStorage, score, unlockedCategories],
  );

  const getPoolForCategory = useCallback(
    (categoryId) => {
      const questionIds = getCategoryQuestionIds(questions, categoryId);
      const savedPool = currentPool[categoryId];
      const pool = Array.isArray(savedPool)
        ? savedPool.filter((questionId) => questionIds.includes(questionId))
        : [];

      if (pool?.length > 0) return pool;
      return questionIds;
    },
    [currentPool, questions],
  );

  const drawQuestion = useCallback(
    (categoryId) => {
      const pool = getPoolForCategory(categoryId);

      if (pool.length === 0) {
        setCurrentQuestion(null);
        return null;
      }

      const randomId = pool[Math.floor(Math.random() * pool.length)];
      const question = questions.find((item) => String(item.id) === String(randomId)) || null;

      setCurrentQuestion(question);
      setSelectedOption(null);
      return question;
    },
    [getPoolForCategory, questions],
  );

  const submitAnswer = useCallback(
    (categoryId, questionId, answer) => {
      const question = questions.find((item) => String(item.id) === String(questionId));

      if (!question) {
        setShowError(true);
        setErrorMessage("Pergunta não encontrada. Tente novamente.");
        return { correct: false };
      }

      const isCorrect =
        String(answer).toUpperCase() === String(question.resposta_correta).toUpperCase();
      const nextAttempts = { ...attempts, [categoryId]: (attempts[categoryId] || 0) + 1 };

      setAttempts(nextAttempts);
      saveToStorage(STORAGE_KEYS.attempts, nextAttempts);

      if (isCorrect) {
        const nextCategoryId = getNextCategoryId(categories, categoryId);
        const nextUnlocked = nextCategoryId
          ? [...new Set([...unlockedCategories, nextCategoryId])]
          : unlockedCategories;
        const nextCompleted = [...new Set([...completedCategories, Number(categoryId)])];
        const nextPool = { ...currentPool };
        const alreadyCompleted = completedCategories.includes(Number(categoryId));
        const earnedPoints = alreadyCompleted ? 0 : calculatePoints(errors[categoryId] || 0);
        const nextScore = score + earnedPoints;

        delete nextPool[categoryId];

        setUnlockedCategories(nextUnlocked);
        setCompletedCategories(nextCompleted);
        setCurrentPool(nextPool);
        setScore(nextScore);
        setShowError(false);
        setSelectedOption(null);

        saveToStorage(STORAGE_KEYS.unlocked, nextUnlocked);
        saveToStorage(STORAGE_KEYS.completed, nextCompleted);
        saveToStorage(STORAGE_KEYS.pool, nextPool);
        saveToStorage(STORAGE_KEYS.score, nextScore);
        if (!alreadyCompleted) {
          publishScore(nextScore, nextCompleted);
        }

        return {
          correct: true,
          feedback: question.feedback_acerto,
          points: earnedPoints,
        };
      }

      const pool = getPoolForCategory(categoryId);
      const nextPoolIds = pool.filter((id) => String(id) !== String(questionId));
      const resetPool = getCategoryQuestionIds(questions, categoryId);
      const nextPool = {
        ...currentPool,
        [categoryId]: nextPoolIds.length === 0 ? resetPool : nextPoolIds,
      };
      const nextErrors = { ...errors, [categoryId]: (errors[categoryId] || 0) + 1 };

      setCurrentPool(nextPool);
      setErrors(nextErrors);
      setShowError(true);
      setErrorMessage("Resposta incorreta, tente novamente");

      saveToStorage(STORAGE_KEYS.pool, nextPool);
      saveToStorage(STORAGE_KEYS.errors, nextErrors);

      return { correct: false };
    },
    [
      attempts,
      categories,
      completedCategories,
      currentPool,
      errors,
      getPoolForCategory,
      publishScore,
      questions,
      saveToStorage,
      score,
      unlockedCategories,
    ],
  );

  const resetTrail = useCallback(() => {
    if (completedCategories.length === categories.length && categories.length > 0) {
      const historyEntry = {
        date: new Date().toISOString(),
        user,
        attempts: { ...attempts },
        errors: { ...errors },
        score,
      };
      const nextHistory = [...history, historyEntry];
      setHistory(nextHistory);
      saveToStorage(STORAGE_KEYS.history, nextHistory);
    }

    const firstCategoryId = categories[0]?.id || 1;

    setUnlockedCategories([firstCategoryId]);
    setCompletedCategories([]);
    setCurrentPool({});
    setAttempts({});
    setErrors({});
    setScore(0);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowError(false);

    saveToStorage(STORAGE_KEYS.unlocked, [firstCategoryId]);
    saveToStorage(STORAGE_KEYS.completed, []);
    saveToStorage(STORAGE_KEYS.pool, {});
    saveToStorage(STORAGE_KEYS.attempts, {});
    saveToStorage(STORAGE_KEYS.errors, {});
    saveToStorage(STORAGE_KEYS.score, 0);
    publishScore(0, []);
  }, [
    attempts,
    categories,
    completedCategories,
    errors,
    history,
    publishScore,
    saveToStorage,
    score,
    user,
  ]);

  const completedCount = useMemo(
    () => categories.filter((category) => completedCategories.includes(category.id)).length,
    [categories, completedCategories],
  );

  const isTrailComplete = categories.length > 0 && completedCount === categories.length;

  const getCategoryStats = useCallback(() => {
    return categories.map((category) => ({
      ...category,
      unlocked: unlockedCategories.includes(category.id),
      completed: completedCategories.includes(category.id),
      attempts: attempts[category.id] || 0,
      errors: errors[category.id] || 0,
    }));
  }, [attempts, categories, completedCategories, errors, unlockedCategories]);

  useEffect(() => {
    let isActive = true;

    loadGameContent().then((content) => {
      if (!isActive) return;

      setCategories(content.categories);
      setQuestions(content.questions);
      setContentStatus(content.source);
      setContentError(content.error?.message || null);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!categories.length) return;

    const knownUnlocked = unlockedCategories.some((categoryId) =>
      categories.some((category) => category.id === categoryId),
    );

    if (!knownUnlocked) {
      const nextUnlocked = [categories[0].id];
      setUnlockedCategories(nextUnlocked);
      saveToStorage(STORAGE_KEYS.unlocked, nextUnlocked);
    }
  }, [categories, saveToStorage, unlockedCategories]);

  useEffect(() => {
    persistSessionCookie({
      user,
      score,
      unlockedCategories,
      completedCategories,
    });
  }, [completedCategories, score, unlockedCategories, user]);

  useEffect(() => {
    if (!user) {
      setRankingStatus("offline");
      return undefined;
    }

    const connection = createRankingConnection({
      user,
      onRanking: (nextRanking) => {
        setRanking(nextRanking);
        writeJsonStorage(STORAGE_KEYS.ranking, nextRanking);
      },
      onStatus: setRankingStatus,
    });

    rankingConnectionRef.current = connection;

    return () => {
      connection.close();
      if (rankingConnectionRef.current === connection) {
        rankingConnectionRef.current = null;
      }
    };
  }, [user]);

  const value = {
    user,
    setNickname,
    nicknameError,
    categories,
    questions,
    contentStatus,
    contentError,
    unlockedCategories,
    completedCategories,
    currentQuestion,
    selectedOption,
    setSelectedOption,
    showError,
    errorMessage,
    drawQuestion,
    submitAnswer,
    resetTrail,
    isTrailComplete,
    getCategoryStats,
    history,
    score,
    ranking,
    rankingStatus,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
