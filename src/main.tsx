import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import App from './App';
import './index.css';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <Router>
    <App />
  </Router>
), root!);
