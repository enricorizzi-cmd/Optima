import { supabaseAdmin } from '../lib/supabase';
import { featureSchema } from '../schemas/features';
import { z } from 'zod';

export async function listOrgFeatures(orgId: string) {
  const { data, error } = await supabaseAdmin
    .from<z.infer<typeof featureSchema>>('features')
    .select('*')
    .eq('org_id', orgId)
    .order('key');
  if (error) {
    throw error;
  }
  return data;
}
