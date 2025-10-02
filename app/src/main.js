import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { createQueryClient } from './lib/queryClient';
import { env } from './lib/env';
import './styles/tailwind.css';
const supabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
const queryClient = createQueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(SessionContextProvider, { supabaseClient: supabaseClient, initialSession: null, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { future: {
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }, children: _jsx(App, {}) }) }) }) }));
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .catch((error) => console.error('SW registration failed', error));
    });
}
