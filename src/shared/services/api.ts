import axios from 'axios';
import { useSessionStore } from '../../features/nickname/hooks/useSessionStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição para injetar a identificação do usuário
api.interceptors.request.use(
  (config) => {
    // Acessa o estado de forma não-reativa para evitar ciclos no React
    const { userId } = useSessionStore.getState();

    if (userId) {
      // Injeta o ID nos cabeçalhos padrão para rastreamento no backend
      config.headers['X-User-ID'] = userId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);