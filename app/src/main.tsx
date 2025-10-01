import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { createQueryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';
import { env } from './lib/env';
import './styles/tailwind.css';

const supabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
const queryClient = createQueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={null}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </SessionContextProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((error) => console.error('SW registration failed', error));
  });
}
