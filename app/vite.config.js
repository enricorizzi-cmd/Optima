import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer,
            ],
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173,
        },
    },
    preview: {
        port: 3000,
        strictPort: true,
        allowedHosts: ['optima-2l2r.onrender.com'],
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    supabase: ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast', '@radix-ui/react-slot'],
                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
                    charts: ['recharts'],
                    utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
                },
            },
        },
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
});
