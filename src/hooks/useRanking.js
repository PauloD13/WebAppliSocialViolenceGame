import { useEffect, useRef, useState } from "react";
import { createRankingConnection, mergeRankingEntry } from "../services/realtimeRanking.js";
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from "../utils/browserStorage.js";

/**
 * Gerencia a conexão WebSocket de ranking e o estado da lista de jogadores.
 *
 * @param {{ user: object|null }} options
 * @returns {{
 *   ranking: object[],
 *   rankingStatus: "connecting"|"connected"|"offline",
 *   sendScore: (payload: object) => void,
 * }}
 */
export function useRanking({ user }) {
  const [ranking, setRanking] = useState(() => readJsonStorage(STORAGE_KEYS.ranking, []));
  const [rankingStatus, setRankingStatus] = useState("offline");
  const connectionRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setRankingStatus("offline");
      return;
    }

    const connection = createRankingConnection({
      user,
      onRanking: (nextRanking) => {
        setRanking(nextRanking);
        writeJsonStorage(STORAGE_KEYS.ranking, nextRanking);
      },
      onStatus: setRankingStatus,
    });

    connectionRef.current = connection;

    return () => {
      connection.close();
      connectionRef.current = null;
    };
  }, [user]);

  /**
   * Envia atualização de score via WebSocket e atualiza o ranking local
   * de forma otimista (sem esperar confirmação do servidor).
   */
  const sendScore = (payload) => {
    // Atualização otimista local
    setRanking((prev) => {
      const next = mergeRankingEntry(prev, payload);
      writeJsonStorage(STORAGE_KEYS.ranking, next);
      return next;
    });

    // Broadcast para todos via servidor
    connectionRef.current?.sendScore(payload);
  };

  return { ranking, rankingStatus, sendScore };
}
