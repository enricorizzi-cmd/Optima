export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://skmljuuxwnikfthgjrkg.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbWxqdXV4d25pa2Z0aGdqcmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU1NzgsImV4cCI6MjA3NDkwMTU3OH0.DNhbvmtWCj3C8hnjhVxfh0E-zunfu2X4oLlI5kRlnrs',
  backendUrl: 'https://optima-2l2r.onrender.com', // Same service serves both frontend + backend
  vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BB-W4zWV57OhQJHiD68SH8aMMP4t0gYT1T_QTs5mrhUiyxH4aG_jpxWL8J8zDECbyRFUWauUdf5affBVigJmk7c',
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
