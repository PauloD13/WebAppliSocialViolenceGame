import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Instanciamos o cliente fora do componente para evitar recriações em renderizações
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita requisições desnecessárias ao mudar de aba
      retry: 1, // Tenta apenas mais 1 vez em caso de falha
      staleTime: 1000 * 60 * 5, // Mantém os dados em cache por 5 minutos
    },
  },
});

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};