import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useOrders, useCreateSchedule } from '../features/orders/api';
import { useOperators, useWarehouses } from '../features/catalog/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, Tbody, Td, Th, Thead, Tr } from '../components/ui/table';
export function ProductionSchedulesPage() {
    const { data: orders } = useOrders();
    const { data: operators } = useOperators();
    const { data: warehouses } = useWarehouses();
    const createSchedule = useCreateSchedule();
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [selectedLineId, setSelectedLineId] = useState('');
    const [productionLine, setProductionLine] = useState('Linea A');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [operatorId, setOperatorId] = useState('');
    const [warehouseId, setWarehouseId] = useState('');
    const orderLines = useMemo(() => {
        const order = orders?.find((item) => item.id === selectedOrderId);
        return order?.lines ?? [];
    }, [selectedOrderId, orders]);
    return (_jsxs("div", { className: "grid gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Programmazione produzione" }), _jsx(CardDescription, { children: "Pianifica lotti a partire dagli ordini confermati e assegna risorse chiave." })] }), _jsx(CardContent, { children: _jsxs("form", { className: "grid gap-4 md:grid-cols-2", onSubmit: (event) => {
                                event.preventDefault();
                                if (!selectedOrderId || !selectedLineId || !startDate || !endDate)
                                    return;
                                const selectedLine = orderLines.find((line) => line.id === selectedLineId);
                                if (!selectedLine)
                                    return;
                                createSchedule.mutate({
                                    order_id: selectedOrderId,
                                    order_line_id: selectedLineId,
                                    planned_quantity: selectedLine.quantity,
                                    production_line: productionLine,
                                    scheduled_start: startDate,
                                    scheduled_end: endDate,
                                    operator_id: operatorId || null,
                                    warehouse_id: warehouseId || null,
                                });
                            }, children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Ordine cliente" }), _jsxs(Select, { value: selectedOrderId, onChange: (event) => setSelectedOrderId(event.target.value), children: [_jsx("option", { value: "", disabled: true, children: "Seleziona ordine" }), orders?.map((order) => (_jsxs("option", { value: order.id, children: [order.code, " \u00B7 ", new Date(order.due_date).toLocaleDateString()] }, order.id)))] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Riga ordine" }), _jsxs(Select, { value: selectedLineId, onChange: (event) => setSelectedLineId(event.target.value), children: [_jsx("option", { value: "", disabled: true, children: "Seleziona riga" }), orderLines.map((line) => (_jsxs("option", { value: line.id, children: [line.product_id, " \u00B7 ", line.quantity, " ", line.unit_of_measure] }, line.id)))] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Linea produttiva" }), _jsx(Input, { value: productionLine, onChange: (event) => setProductionLine(event.target.value) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Magazzino" }), _jsxs(Select, { value: warehouseId, onChange: (event) => setWarehouseId(event.target.value), children: [_jsx("option", { value: "", children: "Non assegnato" }), warehouses?.map((warehouse) => (_jsx("option", { value: warehouse.id, children: warehouse.name }, warehouse.id)))] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Data inizio" }), _jsx(Input, { type: "datetime-local", value: startDate, onChange: (event) => setStartDate(event.target.value) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Data fine" }), _jsx(Input, { type: "datetime-local", value: endDate, onChange: (event) => setEndDate(event.target.value) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Operatore" }), _jsxs(Select, { value: operatorId, onChange: (event) => setOperatorId(event.target.value), children: [_jsx("option", { value: "", children: "Non assegnato" }), operators?.map((operator) => (_jsxs("option", { value: operator.id, children: [operator.first_name, " ", operator.last_name] }, operator.id)))] })] }), _jsx(Button, { type: "submit", disabled: createSchedule.isPending, className: "md:col-span-2", children: createSchedule.isPending ? 'Pianificazione in corso...' : 'Crea schedulazione' }), createSchedule.isSuccess && (_jsx("p", { className: "md:col-span-2 text-sm text-success", children: "Schedulazione creata!" }))] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Ordini in attesa di pianificazione" }), _jsx(CardDescription, { children: "Filtra rapidamente gli ordini confermati da mettere in produzione." })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Ordine" }), _jsx(Th, { children: "Cliente" }), _jsx(Th, { children: "Consegna" }), _jsx(Th, { children: "Righe" })] }) }), _jsx(Tbody, { children: orders
                                        ?.filter((order) => order.status === 'confirmed')
                                        .map((order) => (_jsxs(Tr, { children: [_jsx(Td, { children: order.code }), _jsx(Td, { children: order.client_id }), _jsx(Td, { children: new Date(order.due_date).toLocaleDateString() }), _jsx(Td, { children: order.lines?.length ?? 0 })] }, order.id))) })] }) })] })] }));
}
