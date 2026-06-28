import React, { useCallback, useEffect } from "react";
import GameContext from "./GameContext.js";
import { useContent } from "../hooks/useContent.js";
import { useSession, persistSessionCookie } from "../hooks/useSession.js";
import { useProgress } from "../hooks/useProgress.js";
import { useRanking } from "../hooks/useRanking.js";
import { submitScore } from "../services/gameApi.js";

/**
 * GameProvider
 *
 * Orquestra os quatro hooks especializados e expõe o contexto unificado.
 *
 * Fluxo de dados:
 *   useContent  →  categories + questions
 *   useSession  →  user (cookie/API)
 *   useRanking  →  WebSocket + ranking state
 *   useProgress →  estado de jogo, consume onScoreUpdate
 *
 *   onScoreUpdate (acerto) → sendScore (WebSocket) + submitScore (REST)
 *   session cookie é sincronizado toda vez que score/progresso mudam
 */
export function GameProvider({ children }) {
  const content = useContent();
  const session = useSession();
  const ranking = useRanking({ user: session.user });

  // ------------------------------------------------------------------
  // Score publish: wires progress → ranking & REST API
  // ------------------------------------------------------------------

  const handleScoreUpdate = useCallback(
    (nextScore, nextCompleted) => {
      if (!session.user) return;

      const payload = {
        id: session.user.id,
        userId: session.user.id,
        nickname: session.user.nickname,
        score: nextScore,
        completedCategories: nextCompleted.length,
        totalCategories: content.categories.length,
        updatedAt: new Date().toISOString(),
      };

      ranking.sendScore(payload); // WebSocket broadcast + optimistic local update
      submitScore(payload); // REST fallback (fire-and-forget)
    },
    [content.categories.length, ranking, session.user],
  );

  const progress = useProgress({
    categories: content.categories,
    questions: content.questions,
    onScoreUpdate: handleScoreUpdate,
  });

  // ------------------------------------------------------------------
  // Sync session cookie whenever score or progress state changes
  // ------------------------------------------------------------------

  useEffect(() => {
    persistSessionCookie({
      user: session.user,
      score: progress.score,
      unlockedCategories: progress.unlockedCategories,
      completedCategories: progress.completedCategories,
    });
  }, [session.user, progress.score, progress.unlockedCategories, progress.completedCategories]);

  // ------------------------------------------------------------------
  // Guard: reset unlocked if categories reloaded from API with new IDs
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!content.categories.length) return;
    const stillValid = progress.unlockedCategories.some((id) =>
      content.categories.some((cat) => cat.id === id),
    );
    if (!stillValid) {
      // Categories changed (API reload); reset to first
      progress.resetTrail();
    }
    // Intentionally omitting resetTrail from deps to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.categories]);

  // ------------------------------------------------------------------
  // Context value — flat merge for backwards compatibility
  // ------------------------------------------------------------------

  const value = {
    // Content
    categories: content.categories,
    questions: content.questions,
    contentStatus: content.contentStatus,
    contentError: content.contentError,

    // Session
    user: session.user,
    setUser: session.setUser,
    setNickname: session.setNickname,
    nicknameError: session.nicknameError,

    // Progress
    ...progress,

    // Ranking
    ranking: ranking.ranking,
    rankingStatus: ranking.rankingStatus,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
