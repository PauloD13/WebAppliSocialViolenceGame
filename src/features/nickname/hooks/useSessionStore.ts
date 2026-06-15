import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  // Identificador único do usuário
  userId: string | null; 
  // Apelido escolhido (cadeia de caracteres)
  nickname: string | null;
  // Métodos de mutação
  setSession: (userId: string, nickname: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      nickname: null,
      
      setSession: (userId, nickname) => set({ userId, nickname }),
      
      clearSession: () => set({ userId: null, nickname: null }),
    }),
    {
      name: 'awareness-trail-session', // Chave de armazenamento no localStorage
    }
  )
);