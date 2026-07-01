import { create } from 'zustand';

export type SessionState = {
  sessionId: string | null;
  nickname: string | null;
  setSession: (sessionId: string, nickname: string) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  nickname: null,
  setSession: (sessionId, nickname) => set({ sessionId, nickname }),
  clearSession: () => set({ sessionId: null, nickname: null }),
}));
