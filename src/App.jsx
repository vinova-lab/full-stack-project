import { HashRouter } from 'react-router-dom';
import { AppProviders } from './context/AppProviders.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <HashRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </HashRouter>
  );
}

