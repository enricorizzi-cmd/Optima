import { supabaseAdmin } from '../lib/supabase';
import { clientInsertSchema, rawMaterialInsertSchema, finishedProductInsertSchema, supplierInsertSchema, warehouseInsertSchema, operatorInsertSchema, inventoryUpsertSchema } from '../schemas/catalog';

function handleError(error: unknown, context: string): never {
  if (error instanceof Error) {
    console.error(`Database error in ${context}:`, error.message);
    throw new Error(`Database error in ${context}: ${error.message}`);
  }
  console.error(`Unknown error in ${context}:`, error);
  throw new Error(`Unknown error in ${context}`);
}

export async function listByOrg<T>(table: string, orgId: string, page = 1, limit = 50) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error, count } = await supabaseAdmin
    .from<T>(table)
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .range(from, to)
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error(`Unknown error in listByOrg(${table}):`, error);
    handleError(error, `listByOrg(${table})`);
  }
  
  return {
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

export async function insertClient(payload: unknown) {
  const parsed = clientInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin.from('clients').insert(parsed).select().single();
  if (error) handleError(error, 'insertClient');
  return data;
}

export async function updateClient(id: string, orgId: string, payload: unknown) {
  const parsed = clientInsertSchema.partial().parse(payload);
  const { data, error } = await supabaseAdmin
    .from('clients')
    .update(parsed)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function deleteById(table: string, id: string, orgId: string) {
  const { error } = await supabaseAdmin.from(table).delete().eq('id', id).eq('org_id', orgId);
  if (error) handleError(error, 'deleteById');
}

export async function insertSupplier(payload: unknown) {
  const parsed = supplierInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin.from('suppliers').insert(parsed).select().single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function updateSupplier(id: string, orgId: string, payload: unknown) {
  const parsed = supplierInsertSchema.partial().parse(payload);
  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .update(parsed)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function insertRawMaterial(payload: unknown) {
  const parsed = rawMaterialInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin.from('raw_materials').insert(parsed).select().single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function updateRawMaterial(id: string, orgId: string, payload: unknown) {
  const parsed = rawMaterialInsertSchema.partial().parse(payload);
  const { data, error } = await supabaseAdmin
    .from('raw_materials')
    .update(parsed)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function insertFinishedProduct(payload: unknown) {
  const parsed = finishedProductInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin.from('finished_products').insert(parsed).select().single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function updateFinishedProduct(id: string, orgId: string, payload: unknown) {
  const parsed = finishedProductInsertSchema.partial().parse(payload);
  const { data, error } = await supabaseAdmin
    .from('finished_products')
    .update(parsed)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function insertWarehouse(payload: unknown) {
  const parsed = warehouseInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin.from('warehouses').insert(parsed).select().single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function updateWarehouse(id: string, orgId: string, payload: unknown) {
  const parsed = warehouseInsertSchema.partial().parse(payload);
  const { data, error } = await supabaseAdmin
    .from('warehouses')
    .update(parsed)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function insertOperator(payload: unknown) {
  const parsed = operatorInsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin.from('operators').insert(parsed).select().single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function updateOperator(id: string, orgId: string, payload: unknown) {
  const parsed = operatorInsertSchema.partial().parse(payload);
  const { data, error } = await supabaseAdmin
    .from('operators')
    .update(parsed)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}

export async function upsertInventory(payload: unknown) {
  const parsed = inventoryUpsertSchema.parse(payload);
  const { data, error } = await supabaseAdmin
    .from('inventory_items')
    .upsert(parsed, { onConflict: 'org_id,item_id,item_type,warehouse_id' })
    .select()
    .single();
  if (error) handleError(error, 'upsertInventory');
  return data;
}
