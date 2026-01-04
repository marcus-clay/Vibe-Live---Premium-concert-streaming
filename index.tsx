
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * React 19 / Error #93 Fix:
 * Ensure we only create the root once. In some development environments,
 * the entry point script might be executed multiple times.
 */
declare global {
  interface Window {
    __vibe_root?: Root;
  }
}

if (!window.__vibe_root) {
  const root = createRoot(rootElement);
  window.__vibe_root = root;
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
