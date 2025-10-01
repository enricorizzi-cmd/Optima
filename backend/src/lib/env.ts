import { z } from 'zod';
import 'dotenv/config';

type Env = z.infer<typeof envSchema>;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
  VAPID_PUBLIC: z.string().optional(),
  VAPID_PRIVATE: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

let cached: Env | null = null;

export function getEnv(): Env {
  if (!cached) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
      throw new Error('Invalid environment configuration');
    }
    cached = parsed.data;
  }
  return cached;
}
