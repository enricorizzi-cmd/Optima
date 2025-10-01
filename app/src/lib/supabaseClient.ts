import { createBrowserSupabaseClient } from '@supabase/auth-helpers-react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createBrowserSupabaseClient({
      supabaseUrl: env.supabaseUrl,
      supabaseKey: env.supabaseAnonKey,
    });
  }
  return client;
}
