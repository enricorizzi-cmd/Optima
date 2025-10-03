export const env = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://skmljuuxwnikfthgjrkg.supabase.co',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbWxqdXV4d25pa2Z0aGdqcmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU1NzgsImV4cCI6MjA3NDkwMTU3OH0.DNhbvmtWCj3C8hnjhVxfh0E-zunfu2X4oLlI5kRlnrs',
    backendUrl: 'https://optima-2l2r.onrender.com', // TEMPORARY: Keep both backend + Supabase working
    vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BCT_O3sEqSD8H6xz6dZ277hGyoBCtKZBjygunKBlONmDCCexfIKY334L-6VzHRflP3DTudJg4PwkdLTbg3uRI50',
    // New flag to enable hybrid mode
    useHybridMode: true,
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