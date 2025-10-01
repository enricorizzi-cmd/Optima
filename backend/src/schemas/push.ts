import { z } from 'zod';

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export const pushSubscribeBodySchema = z.object({
  subscription: pushSubscriptionSchema,
  user_agent: z.string().optional(),
});

export const pushTestBodySchema = z.object({
  subscription_id: z.string(),
  title: z.string().default('Test notification'),
  body: z.string().default('Notifica di test da Optima Production Suite'),
});
