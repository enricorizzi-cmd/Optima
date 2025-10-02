import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export interface BaseEntity {
  id: string;
  org_id: string;
  name: string;
  code: string;
  agent?: string;
  type: string;
  category: string;
  email?: string;
  phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Client extends BaseEntity {
  vat_number?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface Supplier extends Client {
  payment_terms?: string;
  shipping_notes?: string;
}

export interface RawMaterial {
  id: string;
  org_id: string;
  name: string;
  code: string;
  class: string;
  group: string;
  type: string;
  unit_of_measure: string;
  last_purchase_price: number;
  distributors: string[];
  default_supplier_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinishedProduct {
  id: string;
  org_id: string;
  name: string;
  code: string;
  class: string;
  group: string;
  type: string;
  unit_of_measure: string;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: string;
  org_id: string;
  code: string;
  name: string;
  site: string;
  line: string;
  created_at: string;
  updated_at: string;
}

export interface Operator {
  id: string;
  org_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  warehouse_id: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  org_id: string;
  item_id: string;
  item_type: 'raw_material' | 'finished_product';
  warehouse_id: string;
  quantity: number;
  unit_of_measure: string;
  updated_at: string;
}

export interface ClientPayload {
  name: string;
  code: string;
  agent?: string;
  type: string;
  category: string;
  email?: string;
  phone?: string;
  notes?: string;
  vat_number?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface RawMaterialPayload {
  name: string;
  code: string;
  class: string;
  group: string;
  type: string;
  unit_of_measure: string;
  last_purchase_price: number;
  distributors: string[];
  default_supplier_id?: string | null;
}

export const catalogKeys = {
  all: ['catalog'] as const,
  clients: () => [...catalogKeys.all, 'clients'] as const,
  suppliers: () => [...catalogKeys.all, 'suppliers'] as const,
  rawMaterials: () => [...catalogKeys.all, 'raw-materials'] as const,
  finishedProducts: () => [...catalogKeys.all, 'finished-products'] as const,
  warehouses: () => [...catalogKeys.all, 'warehouses'] as const,
  operators: () => [...catalogKeys.all, 'operators'] as const,
  inventory: (type?: InventoryItem['item_type']) => [...catalogKeys.all, 'inventory', type ?? 'all'] as const,
};

// Helper function to get current user's org_id
function useOrgId() {
  const supabase = useSupabaseClient();
  return async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('user_id', user.id)
      .single();
    
    if (!profile) throw new Error('User profile not found');
    
    return profile.org_id;
  };
}

export function useClients() {
  const supabase = useSupabaseClient();
  const getOrgId = useOrgId();
  
  return useQuery({
    queryKey: catalogKeys.clients(),
    queryFn: async () => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('org_id', orgId);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useSuppliers() {
  const supabase = useSupabaseClient();
  const getOrgId = useOrgId();
  
  return useQuery({
    queryKey: catalogKeys.suppliers(),
    queryFn: async () => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('org_id', orgId);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useRawMaterials() {
  const supabase = useSupabaseClient();
  const getOrgId = useOrgId();
  
  return useQuery({
    queryKey: catalogKeys.rawMaterials(),
    queryFn: async () => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('raw_materials')
        .select('*')
        .eq('org_id', orgId);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useFinishedProducts() {
  const supabase = useSupabaseClient();
  const getOrgId = useOrgId();
  
  return useQuery({
    queryKey: catalogKeys.finishedProducts(),
    queryFn: async () => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('finished_products')
        .select('*')
        .eq('org_id', orgId);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useWarehouses() {
  const supabase = useSupabaseClient();
  const getOrgId = useOrgId();
  
  return useQuery({
    queryKey: catalogKeys.warehouses(),
    queryFn: async () => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('org_id', orgId);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useOperators() {
  const supabase = useSupabaseClient();
  const getOrgId = useOrgId();
  
  return useQuery({
    queryKey: catalogKeys.operators(),
    queryFn: async () => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('operators')
        .select('*')
        .eq('org_id', orgId);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useInventory(type?: InventoryItem['item_type']) {
  const supabase = useSupabaseClient();
  const getOrgId = useOrgId();
  
  return useQuery({
    queryKey: catalogKeys.inventory(type),
    queryFn: async () => {
      const orgId = await getOrgId();
      let query = supabase
        .from('inventory')
        .select('*')
        .eq('org_id', orgId);
      
      if (type) {
        query = query.eq('item_type', type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateClient(options?: UseMutationOptions<Client, Error, ClientPayload>) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const getOrgId = useOrgId();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<Client, Error, ClientPayload>({
    mutationFn: async (payload) => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...payload, org_id: orgId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.clients() });
      onSuccess?.(data, variables, context, meta);
    },
    onError,
    onSettled,
    ...rest,
  });
}

export function useUpdateClient(
  options?: UseMutationOptions<Client, Error, { id: string; payload: Partial<ClientPayload> }>
) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const getOrgId = useOrgId();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<Client, Error, { id: string; payload: Partial<ClientPayload> }>({
    mutationFn: async ({ id, payload }) => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', id)
        .eq('org_id', orgId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.clients() });
      onSuccess?.(data, variables, context, meta);
    },
    onError,
    onSettled,
    ...rest,
  });
}

export function useDeleteClient(options?: UseMutationOptions<void, Error, string>) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const getOrgId = useOrgId();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const orgId = await getOrgId();
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('org_id', orgId);
      
      if (error) throw error;
    },
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.clients() });
      onSuccess?.(data, variables, context, meta);
    },
    onError,
    onSettled,
    ...rest,
  });
}

export function useCreateRawMaterial(options?: UseMutationOptions<RawMaterial, Error, RawMaterialPayload>) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const getOrgId = useOrgId();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<RawMaterial, Error, RawMaterialPayload>({
    mutationFn: async (payload) => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('raw_materials')
        .insert([{ ...payload, org_id: orgId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.rawMaterials() });
      onSuccess?.(data, variables, context, meta);
    },
    onError,
    onSettled,
    ...rest,
  });
}

export function useUpdateRawMaterial(
  options?: UseMutationOptions<RawMaterial, Error, { id: string; payload: Partial<RawMaterialPayload> }>
) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const getOrgId = useOrgId();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<RawMaterial, Error, { id: string; payload: Partial<RawMaterialPayload> }>({
    mutationFn: async ({ id, payload }) => {
      const orgId = await getOrgId();
      const { data, error } = await supabase
        .from('raw_materials')
        .update(payload)
        .eq('id', id)
        .eq('org_id', orgId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.rawMaterials() });
      onSuccess?.(data, variables, context, meta);
    },
    onError,
    onSettled,
    ...rest,
  });
}

export function useDeleteRawMaterial(options?: UseMutationOptions<void, Error, string>) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const getOrgId = useOrgId();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const orgId = await getOrgId();
      const { error } = await supabase
        .from('raw_materials')
        .delete()
        .eq('id', id)
        .eq('org_id', orgId);
      
      if (error) throw error;
    },
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.rawMaterials() });
      onSuccess?.(data, variables, context, meta);
    },
    onError,
    onSettled,
    ...rest,
  });
}
