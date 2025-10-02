export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://skmljuuxwnikfthgjrkg.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbWxqdXV4d25pa2Z0aGdqcmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU1NzgsImV4cCI6MjA3NDkwMTU3OH0.rrFjqVJmM0l4y5tNjwS0nqzUfpJqOpx0Y0aQfWgS3L',
  backendUrl: '/api', // Use local API endpoint
  vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BKGOjf7mF8qJ1kK2pJdqBk2xW7K5tY7QnD5pM8wL2vE5fR9rS6mH3nT4wU7iY2jO6pE3sA5dF8g',
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
