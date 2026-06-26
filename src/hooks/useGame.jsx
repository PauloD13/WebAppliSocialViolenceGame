import React, { createContext, useContext, useState, useCallback } from 'react';
import { categories, questions } from '../data/gameData.jsx';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('awareness_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [unlockedCategories, setUnlockedCategories] = useState(() => {
    const saved = localStorage.getItem('awareness_unlocked');
    return saved ? JSON.parse(saved) : [1];
  });

  const [completedCategories, setCompletedCategories] = useState(() => {
    const saved = localStorage.getItem('awareness_completed');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPool, setCurrentPool] = useState(() => {
    const saved = localStorage.getItem('awareness_pool');
    return saved ? JSON.parse(saved) : {};
  });

  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem('awareness_attempts');
    return saved ? JSON.parse(saved) : {};
  });

  const [errors, setErrors] = useState(() => {
    const saved = localStorage.getItem('awareness_errors');
    return saved ? JSON.parse(saved) : {};
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('awareness_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const saveToStorage = useCallback((key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const setNickname = useCallback((nickname) => {
    const userData = { nickname, id: Date.now().toString() };
    setUser(userData);
    saveToStorage('awareness_user', userData);
  }, [saveToStorage]);

  const getPoolForCategory = useCallback((categoryId) => {
    const pool = currentPool[categoryId];
    if (!pool || pool.length === 0) {
      const catQuestions = questions.filter(q => q.categoria_id === categoryId);
      return catQuestions.map(q => q.id);
    }
    return pool;
  }, [currentPool]);

  const drawQuestion = useCallback((categoryId) => {
    const pool = getPoolForCategory(categoryId);
    const randomId = pool[Math.floor(Math.random() * pool.length)];
    const question = questions.find(q => q.id === randomId);
    setCurrentQuestion(question);
    return question;
  }, [getPoolForCategory]);

  const submitAnswer = useCallback((categoryId, questionId, answer) => {
    const question = questions.find(q => q.id === questionId);
    const isCorrect = answer === question.resposta_correta;

    if (isCorrect) {
      // Acertou: desbloqueia próxima categoria
      const nextCategory = categoryId + 1;
      const newUnlocked = [...new Set([...unlockedCategories, nextCategory])];
      const newCompleted = [...new Set([...completedCategories, categoryId])];

      setUnlockedCategories(newUnlocked);
      setCompletedCategories(newCompleted);
      saveToStorage('awareness_unlocked', newUnlocked);
      saveToStorage('awareness_completed', newCompleted);

      // Zera pool
      const newPool = { ...currentPool };
      delete newPool[categoryId];
      setCurrentPool(newPool);
      saveToStorage('awareness_pool', newPool);

      // Atualiza tentativas
      const newAttempts = { ...attempts, [categoryId]: (attempts[categoryId] || 0) + 1 };
      setAttempts(newAttempts);
      saveToStorage('awareness_attempts', newAttempts);

      setShowError(false);
      setSelectedOption(null);
      return { correct: true, feedback: question.feedback_acerto };
    } else {
      // Errou: remove do pool
      const pool = getPoolForCategory(categoryId);
      const newPoolIds = pool.filter(id => id !== questionId);

      if (newPoolIds.length === 0) {
        // Reset pool
        const catQuestions = questions.filter(q => q.categoria_id === categoryId);
        const resetPool = catQuestions.map(q => q.id);
        const newPool = { ...currentPool, [categoryId]: resetPool };
        setCurrentPool(newPool);
        saveToStorage('awareness_pool', newPool);
      } else {
        const newPool = { ...currentPool, [categoryId]: newPoolIds };
        setCurrentPool(newPool);
        saveToStorage('awareness_pool', newPool);
      }

      const newErrors = { ...errors, [categoryId]: (errors[categoryId] || 0) + 1 };
      setErrors(newErrors);
      saveToStorage('awareness_errors', newErrors);

      const newAttempts = { ...attempts, [categoryId]: (attempts[categoryId] || 0) + 1 };
      setAttempts(newAttempts);
      saveToStorage('awareness_attempts', newAttempts);

      setShowError(true);
      setErrorMessage('Resposta incorreta, tente novamente');
      return { correct: false };
    }
  }, [unlockedCategories, completedCategories, currentPool, attempts, errors, getPoolForCategory, saveToStorage]);

  const resetTrail = useCallback(() => {
    // Salva histórico
    if (completedCategories.length === 6) {
      const newHistoryEntry = {
        date: new Date().toISOString(),
        attempts: { ...attempts },
        errors: { ...errors },
      };
      const newHistory = [...history, newHistoryEntry];
      setHistory(newHistory);
      saveToStorage('awareness_history', newHistory);
    }

    // Reset progresso
    setUnlockedCategories([1]);
    setCompletedCategories([]);
    setCurrentPool({});
    setAttempts({});
    setErrors({});
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowError(false);

    saveToStorage('awareness_unlocked', [1]);
    saveToStorage('awareness_completed', []);
    saveToStorage('awareness_pool', {});
    saveToStorage('awareness_attempts', {});
    saveToStorage('awareness_errors', {});
  }, [completedCategories, attempts, errors, history, saveToStorage]);

  const isTrailComplete = completedCategories.length === 6;

  const getCategoryStats = useCallback(() => {
    return categories.map(cat => ({
      ...cat,
      unlocked: unlockedCategories.includes(cat.id),
      completed: completedCategories.includes(cat.id),
      attempts: attempts[cat.id] || 0,
      errors: errors[cat.id] || 0,
    }));
  }, [unlockedCategories, completedCategories, attempts, errors]);

  const value = {
    user,
    setNickname,
    categories,
    questions,
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
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
