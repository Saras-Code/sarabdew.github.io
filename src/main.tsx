import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/magazine.css';

const root = document.getElementById('root')!;
// The prerendered copy of the issue is for crawlers and no-JS readers; the app replaces it.
root.innerHTML = '';
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
