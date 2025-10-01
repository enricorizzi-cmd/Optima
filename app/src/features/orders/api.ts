import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';

type OrderStatus = 'draft' | 'confirmed' | 'in_production' | 'fulfilled' | 'cancelled';
type ProductionStatus = 'planned' | 'in_progress' | 'completed' | 'stocked';
type DeliveryStatus = 'pending' | 'prepared' | 'shipped' | 'delivered';

export interface OrderLine {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  unit_of_measure: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerOrder {
  id: string;
  org_id: string;
  client_id: string;
  code: string;
  order_date: string;
  due_date: string;
  status: OrderStatus;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  created_at: string;
  updated_at: string;
  lines?: OrderLine[];
}

export interface ProductionSchedule {
  id: string;
  org_id: string;
  order_id: string;
  order_line_id: string;
  planned_quantity: number;
  production_line: string;
  scheduled_start: string;
  scheduled_end: string;
  status: ProductionStatus;
  operator_id?: string | null;
  warehouse_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionProgress {
  id: string;
  org_id: string;
  schedule_id: string;
  status: ProductionStatus;
  quantity_completed: number;
  notes?: string;
  recorded_by: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface Delivery {
  id: string;
  org_id: string;
  order_id: string;
  schedule_id: string;
  warehouse_id: string;
  status: DeliveryStatus;
  delivery_date?: string | null;
  transporter?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderLinePayload {
  product_id: string;
  quantity: number;
  unit_price: number;
  unit_of_measure: string;
}

export interface CreateOrderPayload {
  client_id: string;
  code: string;
  order_date: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  lines: CreateOrderLinePayload[];
}

export const orderKeys = {
  all: ['orders'] as const,
};

export function useOrders() {
  const { request } = useApi();
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: () => request<CustomerOrder[]>('/api/orders'),
  });
}

export function useCreateOrder() {
  const { request } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      request<CustomerOrder>('/api/orders', {
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
    mutationFn: ({ id, status }: { id: string; status: OrderStatus | ProductionStatus | 'fulfilled' | 'cancelled' }) =>
      request<CustomerOrder>(`/api/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export const scheduleKeys = {
  all: ['production', 'schedules'] as const,
};

export function useSchedules() {
  const { request } = useApi();
  return useQuery({
    queryKey: scheduleKeys.all,
    queryFn: () => request<ProductionSchedule[]>('/api/production/schedules'),
  });
}

export function useCreateSchedule() {
  const { request } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<ProductionSchedule>) =>
      request<ProductionSchedule>('/api/production/schedules', {
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
  all: ['deliveries'] as const,
};

export function useDeliveries() {
  const { request } = useApi();
  return useQuery({
    queryKey: deliveryKeys.all,
    queryFn: () => request<Delivery[]>('/api/deliveries'),
  });
}

export function useUpdateDeliveryStatus() {
  const { request } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DeliveryStatus }) =>
      request<Delivery>(`/api/deliveries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
    },
  });
}

export const progressKeys = {
  all: ['production', 'progress'] as const,
};

export function useCreateProgress() {
  const { request } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<ProductionProgress>) =>
      request<ProductionProgress>('/api/production/progress', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
