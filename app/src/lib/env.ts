export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  backendUrl: import.meta.env.VITE_BACKEND_URL as string,
  vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined,
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
