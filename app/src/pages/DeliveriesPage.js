import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDeliveries, useUpdateDeliveryStatus } from '../features/orders/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, Tbody, Td, Th, Thead, Tr } from '../components/ui/table';
import { Select } from '../components/ui/select';
const deliveryStatuses = [
    { value: 'pending', label: 'In attesa' },
    { value: 'prepared', label: 'Preparato' },
    { value: 'shipped', label: 'Spedito' },
    { value: 'delivered', label: 'Consegnato' },
];
export function DeliveriesPage() {
    const deliveriesQuery = useDeliveries();
    const updateStatus = useUpdateDeliveryStatus();
    useEffect(() => {
        if (!deliveriesQuery.isFetched && !deliveriesQuery.isFetching && deliveriesQuery.refetch) {
            deliveriesQuery.refetch();
        }
    }, [deliveriesQuery]);
    return (_jsxs("div", { className: "grid gap-6", children: [_jsx(Card, { children: _jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Consegne" }), _jsx(CardDescription, { children: "Controlla lo stato delle spedizioni e aggiorna le notifiche clienti." })] }) }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Tracking spedizioni" }), _jsx(CardDescription, { children: "Gestisci il passaggio da stock a consegna finale." })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Ordine" }), _jsx(Th, { children: "Schedulazione" }), _jsx(Th, { children: "Magazzino" }), _jsx(Th, { children: "Stato" }), _jsx(Th, { children: "Tracking" })] }) }), _jsx(Tbody, { children: deliveriesQuery.data?.map((delivery) => (_jsxs(Tr, { children: [_jsx(Td, { children: delivery.order_id }), _jsx(Td, { children: delivery.schedule_id }), _jsx(Td, { children: delivery.warehouse_id }), _jsx(Td, { children: _jsx(Select, { value: delivery.status, onChange: (event) => updateStatus.mutate({ id: delivery.id, status: event.target.value }), children: deliveryStatuses.map((status) => (_jsx("option", { value: status.value, children: status.label }, status.value))) }) }), _jsx(Td, { children: delivery.tracking_number ?? '-' })] }, delivery.id))) })] }), deliveriesQuery.data && deliveriesQuery.data.length === 0 && (_jsx("p", { className: "mt-4 text-sm text-white/60", children: "Nessuna consegna ancora programmata." }))] })] })] }));
}
