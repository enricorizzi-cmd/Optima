import { z } from 'zod';

const anagraphicFields = {
  name: z.string().min(1),
  code: z.string().min(1),
  agent: z.string().min(1).optional(),
  type: z.string().min(1),
  category: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
  notes: z.string().max(500).optional(),
};

const timestampFields = {
  created_at: z.string(),
  updated_at: z.string(),
};

export const clientSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  ...anagraphicFields,
  vat_number: z.string().min(5).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  ...timestampFields,
});

export const clientInsertSchema = z.object({
  org_id: z.string(),
  ...anagraphicFields,
  vat_number: z.string().min(5).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const supplierSchema = clientSchema.extend({
  payment_terms: z.string().optional(),
  shipping_notes: z.string().optional(),
});

export const supplierInsertSchema = z.object({
  org_id: z.string(),
  ...anagraphicFields,
  vat_number: z.string().min(5).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  payment_terms: z.string().optional(),
  shipping_notes: z.string().optional(),
});

export const rawMaterialSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  name: z.string().min(1),
  code: z.string().min(1),
  class: z.string().min(1),
  group: z.string().min(1),
  type: z.string().min(1),
  unit_of_measure: z.string().min(1),
  last_purchase_price: z.number().nonnegative(),
  distributors: z.array(z.string()),
  default_supplier_id: z.string().nullable(),
  ...timestampFields,
});

export const rawMaterialInsertSchema = z.object({
  org_id: z.string(),
  name: z.string().min(1),
  code: z.string().min(1),
  class: z.string().min(1),
  group: z.string().min(1),
  type: z.string().min(1),
  unit_of_measure: z.string().min(1),
  last_purchase_price: z.number().nonnegative(),
  distributors: z.array(z.string()).default([]),
  default_supplier_id: z.string().nullable().optional(),
});

export const finishedProductSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  name: z.string().min(1),
  code: z.string().min(1),
  class: z.string().min(1),
  group: z.string().min(1),
  type: z.string().min(1),
  unit_of_measure: z.string().min(1),
  ...timestampFields,
});

export const finishedProductInsertSchema = z.object({
  org_id: z.string(),
  name: z.string().min(1),
  code: z.string().min(1),
  class: z.string().min(1),
  group: z.string().min(1),
  type: z.string().min(1),
  unit_of_measure: z.string().min(1),
});

export const warehouseSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  code: z.string().min(1),
  name: z.string().min(1),
  site: z.string().min(1),
  line: z.string().min(1),
  ...timestampFields,
});

export const warehouseInsertSchema = z.object({
  org_id: z.string(),
  code: z.string().min(1),
  name: z.string().min(1),
  site: z.string().min(1),
  line: z.string().min(1),
});

export const operatorSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  warehouse_id: z.string().min(1),
  ...timestampFields,
});

export const operatorInsertSchema = z.object({
  org_id: z.string(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  warehouse_id: z.string().min(1),
});

export const inventoryItemSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  item_id: z.string(),
  item_type: z.enum(['raw_material', 'finished_product']),
  warehouse_id: z.string(),
  quantity: z.number(),
  unit_of_measure: z.string(),
  ...timestampFields,
});

export const inventoryUpsertSchema = z.object({
  org_id: z.string(),
  item_id: z.string(),
  item_type: z.enum(['raw_material', 'finished_product']),
  warehouse_id: z.string(),
  quantity: z.number(),
  unit_of_measure: z.string(),
});
