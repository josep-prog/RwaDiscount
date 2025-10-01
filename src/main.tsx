import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { 
  registerServiceWorker, 
  setupInstallPrompt, 
  setupNetworkStatusDetection 
} from './lib/sw';

// Initialize PWA features
if (import.meta.env.PROD) {
  // Register service worker in production only
  registerServiceWorker().then((result) => {
    if (result.success) {
      console.log('[PWA] Service Worker registered successfully');
    } else {
      console.warn('[PWA] Service Worker registration failed:', result.error);
    }
  });
}

// Setup PWA install prompt and network detection in all environments
setupInstallPrompt();
setupNetworkStatusDetection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
