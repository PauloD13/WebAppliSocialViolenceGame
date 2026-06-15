import { QueryProvider } from './app/providers/QueryProvider';
import { AppRoutes } from './app/routes';

function App() {
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
}

export default App;