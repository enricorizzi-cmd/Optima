import { supabaseAdmin } from '../lib/supabase';
import {
  customerOrderInsertSchema,
  productionScheduleInsertSchema,
  productionProgressInsertSchema,
  deliveryInsertSchema,
  orderLineInsertSchema,
  productionStatusSchema,
  deliveryStatusSchema,
} from '../schemas/production';
import { z } from 'zod';

const orderWithLinesSchema = customerOrderInsertSchema.extend({
  lines: z.array(orderLineInsertSchema).min(1),
});

function handleError(error: unknown): never {
  throw error instanceof Error ? error : new Error('Unknown Supabase error');
}

export async function listOrders(orgId: string) {
  const { data, error } = await supabaseAdmin
    .from('customer_orders_view')
    .select('*')
    .eq('org_id', orgId)
    .order('order_date', { ascending: false });
  if (error) handleError(error);
  return data;
}

export async function createCustomerOrder(payload: unknown) {
  const parsed = orderWithLinesSchema.parse(payload);
  const { lines, ...order } = parsed;

  const { data: orderData, error: orderError } = await supabaseAdmin
    .from('customer_orders')
    .insert(order)
    .select()
    .single();

  if (orderError) handleError(orderError);

  const linesToInsert = lines.map((line) => ({ ...line, order_id: orderData.id }));
  const { error: lineError } = await supabaseAdmin.from('customer_order_lines').insert(linesToInsert);
  if (lineError) handleError(lineError);

  return orderData;
}

export async function updateOrderStatus(orderId: string, orgId: string, status: unknown) {
  const parsedStatus = productionStatusSchema.or(z.literal('fulfilled')).or(z.literal('cancelled')).parse(status);
  const { data, error } = await supabaseAdmin
    .from('customer_orders')
    .update({ status: parsedStatus })
    .eq('id', orderId)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error);
  return data;
}

export async function scheduleProduction(payload: unknown) {
  const parsed = productionScheduleInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin.from('production_schedules').insert(parsed).select().single();
  if (error) handleError(error);
  return data;
}

export async function updateScheduleStatus(id: string, orgId: string, status: unknown) {
  const parsedStatus = productionStatusSchema.parse(status);
  const { data, error } = await supabaseAdmin
    .from('production_schedules')
    .update({ status: parsedStatus })
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error);
  return data;
}

export async function recordProductionProgress(payload: unknown) {
  const parsed = productionProgressInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin
    .from('production_progress_logs')
    .insert(parsed)
    .select()
    .single();
  if (error) handleError(error);
  return data;
}

export async function recordDelivery(payload: unknown) {
  const parsed = deliveryInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin.from('deliveries').insert(parsed).select().single();
  if (error) handleError(error);
  return data;
}

export async function updateDeliveryStatus(id: string, orgId: string, status: unknown) {
  const parsedStatus = deliveryStatusSchema.parse(status);
  const { data, error } = await supabaseAdmin
    .from('deliveries')
    .update({ status: parsedStatus })
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error);
  return data;
}

export async function listSchedules(orgId: string) {
  const { data, error } = await supabaseAdmin
    .from('production_schedules')
    .select('*')
    .eq('org_id', orgId)
    .order('scheduled_start');
  if (error) handleError(error);
  return data;
}

export async function listDeliveries(orgId: string) {
  const { data, error } = await supabaseAdmin
    .from('deliveries')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
  if (error) handleError(error);
  return data;
}
