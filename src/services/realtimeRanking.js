import { WS_URL } from "../config/api.js";

const normalizeRanking = (items = []) =>
  items
    .map((item, index) => ({
      id: item.id ?? item.userId ?? item.playerId ?? item.nickname ?? index,
      nickname: item.nickname ?? item.name ?? "Jogador",
      score: Number(item.score ?? item.points ?? item.pontos ?? 0),
      completedCategories: Number(item.completedCategories ?? item.completed ?? 0),
      updatedAt: item.updatedAt ?? item.date ?? new Date().toISOString(),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

const getRankingFromMessage = (message) => {
  if (Array.isArray(message)) return message;
  if (Array.isArray(message?.ranking)) return message.ranking;
  if (Array.isArray(message?.data)) return message.data;
  if (Array.isArray(message?.payload?.ranking)) return message.payload.ranking;
  return null;
};

export const createRankingConnection = ({ user, onRanking, onStatus }) => {
  if (!WS_URL || typeof WebSocket === "undefined") {
    onStatus?.("offline");
    return {
      sendScore: () => {},
      close: () => {},
    };
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
      send("player:join", {
        userId: user.id,
        nickname: user.nickname,
      });
    });

    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        const ranking = getRankingFromMessage(message);
        if (ranking) onRanking?.(normalizeRanking(ranking));
      } catch {
        // Mensagens não JSON são ignoradas para manter o canal resiliente.
      }
    });

    socket.addEventListener("close", () => {
      onStatus?.("offline");
      if (closedByClient) return;

      reconnectAttempts += 1;
      const delay = Math.min(10000, 1000 * 2 ** reconnectAttempts);
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

export const mergeRankingEntry = (ranking, entry) => {
  const withoutCurrent = ranking.filter(
    (item) => item.id !== entry.id && item.nickname !== entry.nickname,
  );
  return normalizeRanking([entry, ...withoutCurrent]);
};
