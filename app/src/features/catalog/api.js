import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
export const catalogKeys = {
    all: ['catalog'],
    clients: () => [...catalogKeys.all, 'clients'],
    suppliers: () => [...catalogKeys.all, 'suppliers'],
    rawMaterials: () => [...catalogKeys.all, 'raw-materials'],
    finishedProducts: () => [...catalogKeys.all, 'finished-products'],
    warehouses: () => [...catalogKeys.all, 'warehouses'],
    operators: () => [...catalogKeys.all, 'operators'],
    inventory: (type) => [...catalogKeys.all, 'inventory', type ?? 'all'],
};
export function useClients() {
    const { request } = useApi();
    return useQuery({
        queryKey: catalogKeys.clients(),
        queryFn: () => request('/api/catalog/clients'),
        select: (response) => response.data || [],
    });
}
export function useSuppliers() {
    const { request } = useApi();
    return useQuery({
        queryKey: catalogKeys.suppliers(),
        queryFn: () => request('/api/catalog/suppliers'),
        select: (response) => response.data || [],
    });
}
export function useRawMaterials() {
    const { request } = useApi();
    return useQuery({
        queryKey: catalogKeys.rawMaterials(),
        queryFn: () => request('/api/catalog/raw-materials'),
        select: (response) => response.data || [],
    });
}
export function useFinishedProducts() {
    const { request } = useApi();
    return useQuery({
        queryKey: catalogKeys.finishedProducts(),
        queryFn: () => request('/api/catalog/finished-products'),
        select: (response) => response.data || [],
    });
}
export function useWarehouses() {
    const { request } = useApi();
    return useQuery({
        queryKey: catalogKeys.warehouses(),
        queryFn: () => request('/api/catalog/warehouses'),
        select: (response) => response.data || [],
    });
}
export function useOperators() {
    const { request } = useApi();
    return useQuery({
        queryKey: catalogKeys.operators(),
        queryFn: () => request('/api/catalog/operators'),
        select: (response) => response.data || [],
    });
}
export function useInventory(type) {
    const { request } = useApi();
    return useQuery({
        queryKey: catalogKeys.inventory(type),
        queryFn: () => request(`/api/catalog/inventory${type ? `?type=${type}` : ''}`),
    });
}
export function useCreateClient(options) {
    const { request } = useApi();
    const queryClient = useQueryClient();
    const { onSuccess, onError, onSettled, ...rest } = options ?? {};
    return useMutation({
        mutationFn: (payload) => request('/api/catalog/clients', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: catalogKeys.clients() });
            onSuccess?.(data, variables, context);
        },
        onError,
        onSettled,
        ...rest,
    });
}
export function useUpdateClient(options) {
    const { request } = useApi();
    const queryClient = useQueryClient();
    const { onSuccess, onError, onSettled, ...rest } = options ?? {};
    return useMutation({
        mutationFn: ({ id, payload }) => request(`/api/catalog/clients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: catalogKeys.clients() });
            onSuccess?.(data, variables, context);
        },
        onError,
        onSettled,
        ...rest,
    });
}
export function useDeleteClient(options) {
    const { request } = useApi();
    const queryClient = useQueryClient();
    const { onSuccess, onError, onSettled, ...rest } = options ?? {};
    return useMutation({
        mutationFn: (id) => request(`/api/catalog/clients/${id}`, {
            method: 'DELETE',
        }),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: catalogKeys.clients() });
            onSuccess?.(data, variables, context);
        },
        onError,
        onSettled,
        ...rest,
    });
}
export function useCreateRawMaterial(options) {
    const { request } = useApi();
    const queryClient = useQueryClient();
    const { onSuccess, onError, onSettled, ...rest } = options ?? {};
    return useMutation({
        mutationFn: (payload) => request('/api/catalog/raw-materials', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: catalogKeys.rawMaterials() });
            onSuccess?.(data, variables, context);
        },
        onError,
        onSettled,
        ...rest,
    });
}
export function useUpdateRawMaterial(options) {
    const { request } = useApi();
    const queryClient = useQueryClient();
    const { onSuccess, onError, onSettled, ...rest } = options ?? {};
    return useMutation({
        mutationFn: ({ id, payload }) => request(`/api/catalog/raw-materials/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: catalogKeys.rawMaterials() });
            onSuccess?.(data, variables, context);
        },
        onError,
        onSettled,
        ...rest,
    });
}
export function useDeleteRawMaterial(options) {
    const { request } = useApi();
    const queryClient = useQueryClient();
    const { onSuccess, onError, onSettled, ...rest } = options ?? {};
    return useMutation({
        mutationFn: (id) => request(`/api/catalog/raw-materials/${id}`, {
            method: 'DELETE',
        }),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: catalogKeys.rawMaterials() });
            onSuccess?.(data, variables, context);
        },
        onError,
        onSettled,
        ...rest,
    });
}
