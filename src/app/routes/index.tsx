import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { EntrancePage } from '../../features/nickname/pages/EntrancePage';
import { TrailsPage } from '../../features/trails/pages/TrailsPage';
import { ContextPage } from '../../features/content/pages/ContextPage';
import { QuizPage } from '../../features/quiz/pages/QuizPage';

// Placeholder para a tela final de resultados
const ResultsPlaceholder = () => (
  <div className="flex items-center justify-center min-h-screen bg-brand-bg text-brand-success font-bold text-xl">
    🎉 Trilha Concluída! Calculando XP...
  </div>
);

const router = createBrowserRouter([
  { path: '/', element: <EntrancePage /> },
  { path: '/trails', element: <TrailsPage /> },
  { path: '/content/:slug', element: <ContextPage /> },
  { path: '/quiz/:slug', element: <QuizPage /> },
  { path: '/results/:slug', element: <ResultsPlaceholder /> }
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};