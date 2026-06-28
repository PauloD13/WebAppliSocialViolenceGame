import { useCallback, useState } from "react";
import { SESSION_TTL_SECONDS } from "../config/api.js";
import { reserveNickname } from "../services/gameApi.js";
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

// ---------------------------------------------------------------------------
// Session validation helpers
// ---------------------------------------------------------------------------

const isSessionValid = (session) => {
  if (!session?.id || !session?.nickname) return false;
  if (!session.expiresAt) return true;
  return new Date(session.expiresAt).getTime() > Date.now();
};

const getRemainingSeconds = (expiresAt) => {
  if (!expiresAt) return SESSION_TTL_SECONDS;
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
};

/**
 * Lê a sessão salva no cookie e no localStorage.
 * Retorna null se inexistente ou expirada.
 */
export const restoreSession = () => {
  const session = readJsonCookie(STORAGE_KEYS.session, null);
  if (!isSessionValid(session)) {
    removeCookie(STORAGE_KEYS.session);
    removeStorage(STORAGE_KEYS.user);
    return null;
  }
  const savedUser = readJsonStorage(STORAGE_KEYS.user, {});
  return { ...savedUser, ...session };
};

// ---------------------------------------------------------------------------
// Cookie persistence
// ---------------------------------------------------------------------------

export const persistSessionCookie = ({ user, score, unlockedCategories, completedCategories }) => {
  if (!user) return;

  const remainingSeconds = getRemainingSeconds(user.expiresAt);
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

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Gerencia a sessão do jogador: nickname, cookie e localStorage.
 *
 * @returns {{
 *   user: object|null,
 *   setNickname: (nickname: string) => Promise<{ok: boolean, message?: string}>,
 *   nicknameError: string,
 * }}
 */
export function useSession() {
  const [user, setUser] = useState(() => restoreSession());
  const [nicknameError, setNicknameError] = useState("");

  const setNickname = useCallback(async (nickname) => {
    const trimmed = nickname.trim().slice(0, 24);

    if (!trimmed) {
      const message = "Informe um apelido para começar.";
      setNicknameError(message);
      return { ok: false, message };
    }

    const clientId = createClientId();
    const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

    const result = await reserveNickname({ nickname: trimmed, clientId, expiresAt });

    if (!result.ok) {
      setNicknameError(result.message ?? "Não foi possível reservar esse apelido.");
      return result;
    }

    const userData = {
      id: result.user.id ?? clientId,
      clientId: result.user.clientId ?? clientId,
      nickname: result.user.nickname ?? trimmed,
      expiresAt: result.user.expiresAt ?? expiresAt,
      source: result.user.source,
    };

    setUser(userData);
    setNicknameError("");
    writeJsonStorage(STORAGE_KEYS.user, userData);

    return { ok: true, user: userData };
  }, []);

  return { user, setUser, setNickname, nicknameError };
}
