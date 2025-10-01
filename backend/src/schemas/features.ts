import { z } from 'zod';

export const featureSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  key: z.string(),
  enabled: z.boolean(),
  value: z.record(z.any()).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
