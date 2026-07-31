import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Tokens and reset first: component stylesheets must be able to win on equal
// specificity (e.g. a row that is both `.work-row` and `.reveal` needs its own
// `transition` shorthand to survive).
import './styles/base.css';
import App from './App';
import { initAnalytics } from './analytics';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// After render, not before: the tracker is not on the path to first paint.
initAnalytics();
