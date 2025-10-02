export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://skmljuuxwnikfthgjrkg.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_f6EeR1QTtoRze95KWOmmfA_USJ0DS-z',
  backendUrl: '/api', // Use local API endpoint
  vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BKGOjf7mF8qJ1kK2pJdqBk2xW7K5tY7QnD5pM8wL2V5fR9rS6mH3nT4wU7iY2jO6pE3sA5dF8g',
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
