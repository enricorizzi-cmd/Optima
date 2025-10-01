import webpush from 'web-push';
import { supabaseAdmin } from '../lib/supabase';
import { getEnv } from '../lib/env';
import { pushSubscriptionSchema } from '../schemas/push';

let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) return;
  
  const env = getEnv();
  if (env.VAPID_PUBLIC && env.VAPID_PRIVATE) {
    webpush.setVapidDetails('mailto:support@example.com', env.VAPID_PUBLIC, env.VAPID_PRIVATE);
    vapidConfigured = true;
  }
}

export async function saveSubscription(orgId: string, userId: string, payload: unknown) {
  ensureVapidConfigured();
  const subscription = pushSubscriptionSchema.parse(payload);

  const { data, error } = await supabaseAdmin
    .from('push_subscriptions')
    .upsert(
      {
        org_id: orgId,
        user_id: userId,
        endpoint: subscription.endpoint,
        subscription,
      },
      { onConflict: 'org_id,user_id,endpoint' }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function sendTestNotification(subscriptionId: string, orgId: string, payload: { title: string; body: string }) {
  ensureVapidConfigured();
  
  const env = getEnv();
  if (!env.VAPID_PUBLIC || !env.VAPID_PRIVATE) {
    throw new Error('Missing VAPID keys, cannot send push notification');
  }

  const { data, error } = await supabaseAdmin
    .from('push_subscriptions')
    .select('subscription')
    .eq('id', subscriptionId)
    .eq('org_id', orgId)
    .single();

  if (error) {
    throw error;
  }

  await webpush.sendNotification(
    data.subscription as webpush.PushSubscription,
    JSON.stringify({
      title: payload.title,
      body: payload.body,
      timestamp: Date.now(),
    })
  );
}
