import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Self-hosted fonts (work offline, no Google Fonts round-trip)
import '@fontsource-variable/inter';
import '@fontsource-variable/plus-jakarta-sans';

// CSS layers — order matters
import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/widgets.css';
import './styles/pages.css';
import './styles/polish.css'; // visual refresh layer — must load last

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
