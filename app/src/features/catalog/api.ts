import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// Helper function to get organization ID
function useOrgId() {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['orgId'],
    async queryFn() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('org_id')
        .eq('user_id', user.id)
        .single();
        
      if (!profile) throw new Error('User profile not found');
      return profile.org_id;
    },
  });
}

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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export function useClients() {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: catalogKeys.clients(),
    queryFn: async () => {
      // Get user and org_id directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('org_id')
        .eq('user_id', user.id)
        .single();
        
      if (!profile) throw new Error('User profile not found');
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('org_id', profile.org_id);
        
      if (error) throw error;
      return data || [];
    },
  });
}

export function useSuppliers() {
  const { request } = useApi();
  return useQuery({
    queryKey: catalogKeys.suppliers(),
    queryFn: () => request<PaginatedResponse<Supplier>>('/api/catalog/suppliers'),
    select: (response) => response.data || [],
  });
}

export function useRawMaterials() {
  const { request } = useApi();
  return useQuery({
    queryKey: catalogKeys.rawMaterials(),
    queryFn: () => request<PaginatedResponse<RawMaterial>>('/api/catalog/raw-materials'),
    select: (response) => response.data || [],
  });
}

export function useFinishedProducts() {
  const { request } = useApi();
  return useQuery({
    queryKey: catalogKeys.finishedProducts(),
    queryFn: () => request<PaginatedResponse<FinishedProduct>>('/api/catalog/finished-products'),
    select: (response) => response.data || [],
  });
}

export function useWarehouses() {
  const { request } = useApi();
  return useQuery({
    queryKey: catalogKeys.warehouses(),
    queryFn: () => request<PaginatedResponse<Warehouse>>('/api/catalog/warehouses'),
    select: (response) => response.data || [],
  });
}

export function useOperators() {
  const { request } = useApi();
  return useQuery({
    queryKey: catalogKeys.operators(),
    queryFn: () => request<PaginatedResponse<Operator>>('/api/catalog/operators'),
    select: (response) => response.data || [],
  });
}

export function useInventory(type?: InventoryItem['item_type']) {
  const { request } = useApi();
  return useQuery({
    queryKey: catalogKeys.inventory(type),
    queryFn: () => request<InventoryItem[]>(`/api/catalog/inventory${type ? `?type=${type}` : ''}`),
  });
}

export function useCreateClient(options?: UseMutationOptions<Client, Error, ClientPayload>) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<Client, Error, ClientPayload>({
    mutationFn: async (payload) => {
      // Get user and org_id directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('org_id')
        .eq('user_id', user.id)
        .single();
        
      if (!profile) throw new Error('User profile not found');

      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...payload, org_id: profile.org_id }])
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
  const { request } = useApi();
  const queryClient = useQueryClient();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<Client, Error, { id: string; payload: Partial<ClientPayload> }>({
    mutationFn: ({ id, payload }) =>
      request<Client>(`/api/catalog/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
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
  const { request } = useApi();
  const queryClient = useQueryClient();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      request(`/api/catalog/clients/${id}`, {
        method: 'DELETE',
      }),
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
  const { request } = useApi();
  const queryClient = useQueryClient();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<RawMaterial, Error, RawMaterialPayload>({
    mutationFn: (payload) =>
      request<RawMaterial>('/api/catalog/raw-materials', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
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
  const { request } = useApi();
  const queryClient = useQueryClient();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<RawMaterial, Error, { id: string; payload: Partial<RawMaterialPayload> }>({
    mutationFn: ({ id, payload }) =>
      request<RawMaterial>(`/api/catalog/raw-materials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
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
  const { request } = useApi();
  const queryClient = useQueryClient();
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      request(`/api/catalog/raw-materials/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.rawMaterials() });
      onSuccess?.(data, variables, context, meta);
    },
    onError,
    onSettled,
    ...rest,
  });
}
