import { supabaseAdmin } from '../lib/supabase';
import {
  customerOrderInsertSchema,
  customerOrderSchema,
  productionScheduleInsertSchema,
  productionProgressInsertSchema,
  deliveryInsertSchema,
  orderLineInsertSchema,
  orderLineSchema,
  productionStatusSchema,
  deliveryStatusSchema,
} from '../schemas/production';
import { z } from 'zod';

const orderWithLinesSchema = customerOrderInsertSchema.extend({
  lines: z.array(orderLineInsertSchema).min(1),
});

const orderLineFromViewSchema = orderLineSchema.extend({
  order_id: z.string().optional(),
});

const orderWithLinesResultSchema = customerOrderSchema.extend({
  lines: z.array(orderLineFromViewSchema).optional().nullable(),
});

const orderResultListSchema = z.array(orderWithLinesResultSchema);

type OrderWithNormalizedLines = z.infer<typeof customerOrderSchema> & {
  lines: z.infer<typeof orderLineSchema>[];
};

function normalizeOrders(data: unknown): OrderWithNormalizedLines[] {
  const parsed = orderResultListSchema.parse(data ?? []);
  return parsed.map((order) => {
    const lines = (order.lines ?? []).map((line) => ({
      ...line,
      order_id: line.order_id ?? order.id,
    })) as z.infer<typeof orderLineSchema>[];

    return {
      ...order,
      lines,
    } satisfies OrderWithNormalizedLines;
  });
}

function isMissingOrdersViewError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  if (error instanceof Error && error.message.includes('customer_orders_view')) {
    return true;
  }

  const record = error as Record<string, unknown>;
  const candidates = [record.message, record.details, record.hint].filter(
    (value) => typeof value === 'string'
  ) as string[];

  return candidates.some((value) => value.includes('customer_orders_view'));
}

async function fetchOrdersFromBaseTable(orgId: string): Promise<OrderWithNormalizedLines[]> {
  const { data, error } = await supabaseAdmin
    .from('customer_orders')
    .select(
      `
      id,
      org_id,
      client_id,
      code,
      order_date,
      due_date,
      status,
      priority,
      notes,
      created_at,
      updated_at,
      lines:customer_order_lines (
        id,
        order_id,
        product_id,
        quantity,
        unit_price,
        unit_of_measure,
        created_at,
        updated_at
      )
    `
    )
    .eq('org_id', orgId)
    .order('order_date', { ascending: false });

  if (error) handleError(error);
  return normalizeOrders(data);
}

function handleError(error: unknown): never {
  throw error instanceof Error ? error : new Error('Unknown Supabase error');
}

export async function listOrders(orgId: string): Promise<OrderWithNormalizedLines[]> {
  const { data, error } = await supabaseAdmin
    .from('customer_orders_view')
    .select('*')
    .eq('org_id', orgId)
    .order('order_date', { ascending: false });

  if (!error) {
    return normalizeOrders(data);
  }

  if (isMissingOrdersViewError(error)) {
    return fetchOrdersFromBaseTable(orgId);
  }

  handleError(error);
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
