import { WS_URL } from "../config/api.js";

// ---------------------------------------------------------------------------
// Normalizer
// ---------------------------------------------------------------------------

const normalizeEntry = (item, index) => ({
  id: item.id ?? item.userId ?? item.playerId ?? item.nickname ?? index,
  nickname: item.nickname ?? item.name ?? "Jogador",
  score: Number(item.score ?? item.points ?? item.pontos ?? 0),
  completedCategories: Number(item.completedCategories ?? item.completed ?? 0),
  updatedAt: item.updatedAt ?? item.date ?? new Date().toISOString(),
});

const normalizeRanking = (items = []) =>
  [...items]
    .map(normalizeEntry)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

// ---------------------------------------------------------------------------
// Message parser
// ---------------------------------------------------------------------------

const extractRanking = (message) => {
  // Suporta: array direto, {ranking:[...]}, {data:[...]}, {type, ranking:[...]}
  if (Array.isArray(message)) return message;
  if (Array.isArray(message?.ranking)) return message.ranking;
  if (Array.isArray(message?.data)) return message.data;
  if (Array.isArray(message?.payload?.ranking)) return message.payload.ranking;
  return null;
};

// ---------------------------------------------------------------------------
// Connection factory
// ---------------------------------------------------------------------------

/**
 * Abre e gerencia a conexão WebSocket com o servidor de ranking.
 *
 * @param {object} options
 * @param {{ id: string, nickname: string }} options.user
 * @param {(ranking: object[]) => void} options.onRanking
 * @param {(status: "connecting"|"connected"|"offline") => void} options.onStatus
 * @returns {{ sendScore: (payload: object) => void, close: () => void }}
 */
export const createRankingConnection = ({ user, onRanking, onStatus }) => {
  if (!WS_URL || typeof WebSocket === "undefined") {
    onStatus?.("offline");
    return { sendScore: () => {}, close: () => {} };
  }

  let socket;
  let reconnectTimer;
  let reconnectAttempts = 0;
  let closedByClient = false;

  const send = (type, payload) => {
    if (socket?.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type, payload }));
  };

  const connect = () => {
    onStatus?.("connecting");
    socket = new WebSocket(WS_URL);

    socket.addEventListener("open", () => {
      reconnectAttempts = 0;
      onStatus?.("connected");
      // Apresenta o jogador ao servidor para registro no mapa de conexões
      send("player:join", { userId: user.id, nickname: user.nickname });
    });

    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        const rawRanking = extractRanking(message);
        if (rawRanking) onRanking?.(normalizeRanking(rawRanking));
      } catch {
        // Mensagens malformadas são ignoradas
      }
    });

    socket.addEventListener("close", () => {
      onStatus?.("offline");
      if (closedByClient) return;

      // Backoff exponencial: 1s → 2s → 4s → ... → 10s (máx)
      reconnectAttempts += 1;
      const delay = Math.min(10_000, 1_000 * 2 ** reconnectAttempts);
      reconnectTimer = setTimeout(connect, delay);
    });

    socket.addEventListener("error", () => {
      onStatus?.("offline");
    });
  };

  connect();

  return {
    sendScore: (payload) => send("score:update", payload),
    close: () => {
      closedByClient = true;
      clearTimeout(reconnectTimer);
      socket?.close();
    },
  };
};

// ---------------------------------------------------------------------------
// Ranking merge utility
// ---------------------------------------------------------------------------

/**
 * Insere ou atualiza uma entrada no ranking local (sem re-ordenar todo o array).
 * Útil para atualizar o estado React otimisticamente antes da confirmação do servidor.
 */
export const mergeRankingEntry = (ranking, entry) => {
  const normalized = normalizeEntry(entry, 0);
  const without = ranking.filter(
    (item) => item.id !== normalized.id && item.nickname !== normalized.nickname,
  );
  return normalizeRanking([normalized, ...without]);
};
