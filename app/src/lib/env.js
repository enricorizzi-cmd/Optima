export const env = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    backendUrl: import.meta.env.VITE_BACKEND_URL,
    vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
};
if (import.meta.env.DEV) {
    const missing = Object.entries(env)
        .filter(([_, value]) => value === undefined || value === null || value === '')
        .map(([key]) => key);
    if (missing.length > 0) {
        // eslint-disable-next-line no-console
        console.warn('Missing environment variables:', missing.join(', '));
    }
}
