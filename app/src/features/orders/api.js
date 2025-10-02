import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
export const orderKeys = {
    all: ['orders'],
};
export function useOrders() {
    const { request } = useApi();
    return useQuery({
        queryKey: orderKeys.all,
        queryFn: () => request('/api/orders'),
    });
}
export function useCreateOrder() {
    const { request } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}
export function useUpdateOrderStatus() {
    const { request } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => request(`/api/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}
export const scheduleKeys = {
    all: ['production', 'schedules'],
};
export function useSchedules() {
    const { request } = useApi();
    return useQuery({
        queryKey: scheduleKeys.all,
        queryFn: () => request('/api/production/schedules'),
    });
}
export function useCreateSchedule() {
    const { request } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => request('/api/production/schedules', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}
export const deliveryKeys = {
    all: ['deliveries'],
};
export function useDeliveries() {
    const { request } = useApi();
    return useQuery({
        queryKey: deliveryKeys.all,
        queryFn: () => request('/api/deliveries'),
    });
}
export function useUpdateDeliveryStatus() {
    const { request } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => request(`/api/deliveries/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
        },
    });
}
export const progressKeys = {
    all: ['production', 'progress'],
};
export function useCreateProgress() {
    const { request } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => request('/api/production/progress', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}
