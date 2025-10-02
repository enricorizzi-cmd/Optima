import { z } from 'zod';

export const orderStatusSchema = z.enum(['draft', 'confirmed', 'in_production', 'fulfilled', 'cancelled']);
export const productionStatusSchema = z.enum(['planned', 'in_progress', 'completed', 'stocked']);
export const deliveryStatusSchema = z.enum(['pending', 'prepared', 'shipped', 'delivered']);

const timestampFields = {
  created_at: z.string(),
  updated_at: z.string(),
};

export const customerOrderSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  client_id: z.string(),
  code: z.string().min(1),
  order_date: z.string(),
  due_date: z.string(),
  status: orderStatusSchema,
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  notes: z.string().nullable().optional(),
  ...timestampFields,
});

export const customerOrderInsertSchema = z.object({
  org_id: z.string(),
  client_id: z.string(),
  code: z.string().min(1),
  order_date: z.string(),
  due_date: z.string(),
  status: orderStatusSchema.default('confirmed'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  notes: z.string().nullable().optional(),
});

export const orderLineSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  product_id: z.string(),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  unit_of_measure: z.string(),
  ...timestampFields,
});

export const orderLineInsertSchema = z.object({
  product_id: z.string(),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  unit_of_measure: z.string(),
});

export const productionScheduleSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  order_id: z.string(),
  order_line_id: z.string(),
  planned_quantity: z.number().positive(),
  production_line: z.string().min(1),
  scheduled_start: z.string(),
  scheduled_end: z.string(),
  status: productionStatusSchema,
  operator_id: z.string().nullable(),
  warehouse_id: z.string().nullable(),
  ...timestampFields,
});

export const productionScheduleInsertSchema = z.object({
  org_id: z.string(),
  order_id: z.string(),
  order_line_id: z.string(),
  planned_quantity: z.number().positive(),
  production_line: z.string().min(1),
  scheduled_start: z.string(),
  scheduled_end: z.string(),
  status: productionStatusSchema.default('planned'),
  operator_id: z.string().nullable().optional(),
  warehouse_id: z.string().nullable().optional(),
});

export const productionProgressSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  schedule_id: z.string(),
  status: productionStatusSchema,
  quantity_completed: z.number().nonnegative(),
  notes: z.string().nullable().optional(),
  recorded_by: z.string(),
  recorded_at: z.string(),
  ...timestampFields,
});

export const productionProgressInsertSchema = z.object({
  org_id: z.string(),
  schedule_id: z.string(),
  status: productionStatusSchema,
  quantity_completed: z.number().nonnegative(),
  notes: z.string().nullable().optional(),
  recorded_by: z.string(),
  recorded_at: z.string(),
});

export const deliverySchema = z.object({
  id: z.string(),
  org_id: z.string(),
  order_id: z.string(),
  schedule_id: z.string(),
  warehouse_id: z.string(),
  status: deliveryStatusSchema,
  delivery_date: z.string().nullable(),
  transporter: z.string().nullable().optional(),
  tracking_number: z.string().nullable().optional(),
  ...timestampFields,
});

export const deliveryInsertSchema = z.object({
  org_id: z.string(),
  order_id: z.string(),
  schedule_id: z.string(),
  warehouse_id: z.string(),
  status: deliveryStatusSchema.default('pending'),
  delivery_date: z.string().nullable().optional(),
  transporter: z.string().nullable().optional(),
  tracking_number: z.string().nullable().optional(),
});



