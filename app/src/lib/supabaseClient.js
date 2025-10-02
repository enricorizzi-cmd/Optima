import { createClient } from '@supabase/supabase-js';
import { env } from './env';
let client = null;
export function getSupabaseClient() {
    if (!client) {
        client = createClient(env.supabaseUrl, env.supabaseAnonKey);
    }
    return client;
}
