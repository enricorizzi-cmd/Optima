import { supabaseAdmin } from '../lib/supabase';
import { featureSchema } from '../schemas/features';
import { z } from 'zod';

type Feature = z.infer<typeof featureSchema>;

export async function listOrgFeatures(orgId: string): Promise<Feature[]> {
  const { data, error } = await supabaseAdmin
    .from('features')
    .select('*')
    .eq('org_id', orgId)
    .order('key');
  if (error) {
    throw error;
  }
  return (data ?? []) as Feature[];
}
