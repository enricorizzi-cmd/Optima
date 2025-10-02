import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useClients, useFinishedProducts } from '../features/catalog/api';
import { useCreateOrder, useOrders, useUpdateOrderStatus, useDeliveries, useUpdateDeliveryStatus, } from '../features/orders/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, Tbody, Td, Th, Thead, Tr } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useToast } from '../components/ui/use-toast';
const priorities = [
    { label: 'Bassa', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' },
];
const orderFormSchema = z.object({
    client_id: z.string().min(1, 'Seleziona un cliente'),
    code: z.string().min(1, 'Campo obbligatorio'),
    order_date: z.string().min(1, 'Campo obbligatorio'),
    due_date: z.string().min(1, 'Campo obbligatorio'),
    priority: z.enum(['low', 'medium', 'high']),
    notes: z.string().optional(),
    lines: z
        .array(z.object({
        product_id: z.string().min(1, 'Seleziona un prodotto'),
        quantity: z.coerce.number({ invalid_type_error: 'Inserisci una quantita' }).min(0.01, 'Quantita non valida'),
        unit_price: z.coerce.number({ invalid_type_error: 'Inserisci un prezzo' }).min(0, 'Prezzo non valido'),
        unit_of_measure: z.string().min(1, 'Campo obbligatorio'),
    }))
        .min(1, 'Aggiungi almeno una riga ordine'),
});
const statusOptions = [
    { value: 'draft', label: 'Bozza' },
    { value: 'confirmed', label: 'Confermato' },
    { value: 'in_production', label: 'In produzione' },
    { value: 'fulfilled', label: 'Evaso' },
    { value: 'cancelled', label: 'Annullato' },
];
export function OrdersPage() {
    const { data: orders } = useOrders();
    const { data: clients } = useClients();
    const { data: finishedProducts } = useFinishedProducts();
    const deliveriesQuery = useDeliveries();
    const updateStatus = useUpdateOrderStatus();
    const updateDeliveryStatus = useUpdateDeliveryStatus();
    const createOrder = useCreateOrder();
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            client_id: '',
            code: '',
            order_date: new Date().toISOString().slice(0, 10),
            due_date: new Date().toISOString().slice(0, 10),
            priority: 'medium',
            notes: '',
            lines: [
                {
                    product_id: '',
                    quantity: 1,
                    unit_price: 0,
                    unit_of_measure: '',
                },
            ],
        },
    });
    const linesArray = useFieldArray({ control: form.control, name: 'lines' });
    const handleAddLine = () => {
        linesArray.append({ product_id: '', quantity: 1, unit_price: 0, unit_of_measure: '' });
    };
    const handleCreateOrder = form.handleSubmit((values) => {
        createOrder.mutate(values, {
            onSuccess: () => {
                toast({ title: 'Ordine creato', description: 'Ordine cliente registrato', variant: 'success' });
                setOrderDialogOpen(false);
                form.reset();
            },
            onError: (error) => {
                toast({ title: 'Errore creazione ordine', description: error.message, variant: 'destructive' });
            },
        });
    });
    const groupedOrders = useMemo(() => {
        return orders?.reduce((acc, order) => {
            acc[order.status] = acc[order.status] ? [...acc[order.status], order] : [order];
            return acc;
        }, {}) ?? {};
    }, [orders]);
    return (_jsxs("div", { className: "grid gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "Ordini clienti" }), _jsx(CardDescription, { children: "Pianifica e monitora ogni commessa dal ricevimento alla consegna." })] }), _jsxs(Dialog, { open: orderDialogOpen, onOpenChange: (open) => { setOrderDialogOpen(open); if (!open)
                                    form.reset(); }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Nuovo ordine" }) }), _jsxs(DialogContent, { className: "max-w-4xl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Crea ordine cliente" }) }), _jsxs("form", { className: "flex flex-col gap-5", onSubmit: handleCreateOrder, children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(Field, { label: "Cliente", error: form.formState.errors.client_id?.message, children: _jsxs(Select, { ...form.register('client_id'), disabled: createOrder.isPending, children: [_jsx("option", { value: "", children: "Seleziona cliente" }), clients?.map((client) => (_jsx("option", { value: client.id, children: client.name }, client.id)))] }) }), _jsx(Field, { label: "Codice ordine", error: form.formState.errors.code?.message, children: _jsx(Input, { placeholder: "ORD-2025-001", ...form.register('code'), disabled: createOrder.isPending }) }), _jsx(Field, { label: "Data ordine", error: form.formState.errors.order_date?.message, children: _jsx(Input, { type: "date", ...form.register('order_date'), disabled: createOrder.isPending }) }), _jsx(Field, { label: "Data consegna prevista", error: form.formState.errors.due_date?.message, children: _jsx(Input, { type: "date", ...form.register('due_date'), disabled: createOrder.isPending }) }), _jsx(Field, { label: "Priorita", children: _jsx(Select, { ...form.register('priority'), disabled: createOrder.isPending, children: priorities.map((priority) => (_jsx("option", { value: priority.value, children: priority.label }, priority.value))) }) })] }), _jsx(Field, { label: "Note", children: _jsx(Textarea, { rows: 3, placeholder: "Indicazioni operative", ...form.register('notes'), disabled: createOrder.isPending }) }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-display text-lg text-white", children: "Righe ordine" }), _jsx(Button, { type: "button", variant: "secondary", size: "sm", onClick: handleAddLine, disabled: createOrder.isPending, children: "Aggiungi riga" })] }), form.formState.errors.lines?.message && (_jsx("p", { className: "text-sm text-danger", children: form.formState.errors.lines.message })), _jsx("div", { className: "grid gap-4", children: linesArray.fields.map((field, index) => {
                                                                    const lineErrors = form.formState.errors.lines?.[index];
                                                                    return (_jsx("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: _jsxs("div", { className: "grid gap-3 md:grid-cols-5", children: [_jsxs("label", { className: "flex flex-col text-sm text-white/70", children: [_jsx("span", { className: "text-xs uppercase tracking-wide text-white/40", children: "Prodotto" }), _jsxs(Select, { value: form.watch(`lines.${index}.product_id`), onChange: (event) => {
                                                                                                const productId = event.target.value;
                                                                                                form.setValue(`lines.${index}.product_id`, productId, { shouldValidate: true });
                                                                                                const product = finishedProducts?.find((item) => item.id === productId);
                                                                                                if (product) {
                                                                                                    form.setValue(`lines.${index}.unit_of_measure`, product.unit_of_measure);
                                                                                                }
                                                                                            }, disabled: createOrder.isPending, children: [_jsx("option", { value: "", children: "Seleziona" }), finishedProducts?.map((product) => (_jsx("option", { value: product.id, children: product.name }, product.id)))] }), lineErrors?.product_id?.message && (_jsx("span", { className: "text-xs text-danger", children: lineErrors.product_id.message }))] }), _jsx(Field, { label: "Quantita", error: lineErrors?.quantity?.message, children: _jsx(Input, { type: "number", step: "0.01", min: "0", ...form.register(`lines.${index}.quantity`, { valueAsNumber: true }), disabled: createOrder.isPending }) }), _jsx(Field, { label: "Prezzo unitario", error: lineErrors?.unit_price?.message, children: _jsx(Input, { type: "number", step: "0.01", min: "0", ...form.register(`lines.${index}.unit_price`, { valueAsNumber: true }), disabled: createOrder.isPending }) }), _jsx(Field, { label: "Unita", error: lineErrors?.unit_of_measure?.message, children: _jsx(Input, { placeholder: "pz/kg", ...form.register(`lines.${index}.unit_of_measure`), disabled: createOrder.isPending }) }), _jsx("div", { className: "flex items-end justify-end", children: _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => linesArray.remove(index), disabled: createOrder.isPending || linesArray.fields.length === 1, children: "Rimuovi" }) })] }) }, field.id));
                                                                }) })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", disabled: createOrder.isPending, children: "Annulla" }) }), _jsx(Button, { type: "submit", disabled: createOrder.isPending, children: createOrder.isPending ? 'Salvataggio...' : 'Crea ordine' })] })] })] })] })] }), _jsxs(CardContent, { className: "grid gap-4 md:grid-cols-2", children: [_jsx("div", { children: _jsx("p", { className: "text-sm text-white/60", children: "Da qui aggiorni lo stato di un ordine per coordinare acquisti, produzione e logistica." }) }), _jsxs("form", { className: "flex flex-col gap-3", onSubmit: (event) => {
                                    event.preventDefault();
                                    const formData = new FormData(event.currentTarget);
                                    const orderId = formData.get('orderId')?.toString();
                                    const status = formData.get('status')?.toString();
                                    if (orderId && status) {
                                        updateStatus.mutate({ id: orderId, status: status });
                                    }
                                }, children: [_jsxs(Select, { name: "orderId", children: [_jsx("option", { value: "", children: "Seleziona un ordine" }), orders?.map((order) => (_jsxs("option", { value: order.id, children: [order.code, " - consegna ", new Date(order.due_date).toLocaleDateString()] }, order.id)))] }), _jsx(Select, { name: "status", defaultValue: "confirmed", children: statusOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) }), _jsx(Button, { type: "submit", disabled: updateStatus.isPending, children: "Aggiorna stato" }), updateStatus.isSuccess && _jsx("p", { className: "text-xs text-success", children: "Stato aggiornato con successo." })] })] })] }), Object.entries(groupedOrders).map(([status, entries]) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: status === 'fulfilled' ? 'success' : status === 'cancelled' ? 'danger' : 'default', children: statusOptions.find((option) => option.value === status)?.label ?? status }), _jsxs("span", { className: "text-base font-normal text-white/70", children: [entries.length, " ordini"] })] }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Codice" }), _jsx(Th, { children: "Cliente" }), _jsx(Th, { children: "Consegna" }), _jsx(Th, { children: "Priorita" }), _jsx(Th, { children: "Righe prodotto" })] }) }), _jsx(Tbody, { children: entries.map((order) => (_jsxs(Tr, { children: [_jsx(Td, { children: order.code }), _jsx(Td, { children: order.client_id }), _jsx(Td, { children: new Date(order.due_date).toLocaleDateString() }), _jsx(Td, { children: _jsx(Badge, { variant: order.priority === 'high' ? 'danger' : order.priority === 'medium' ? 'warning' : 'outline', children: order.priority }) }), _jsx(Td, { children: order.lines?.length ?? 0 })] }, order.id))) })] }) })] }, status))), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Tracking consegne" }), _jsx(CardDescription, { children: "Gestisci il passaggio da stock a consegna finale." })] }), _jsxs(CardContent, { children: [_jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Ordine" }), _jsx(Th, { children: "Schedulazione" }), _jsx(Th, { children: "Magazzino" }), _jsx(Th, { children: "Stato" }), _jsx(Th, { children: "Tracking" })] }) }), _jsx(Tbody, { children: deliveriesQuery.data?.map((delivery) => (_jsxs(Tr, { children: [_jsx(Td, { children: delivery.order_id }), _jsx(Td, { children: delivery.schedule_id }), _jsx(Td, { children: delivery.warehouse_id }), _jsx(Td, { children: _jsxs(Select, { value: delivery.status, onChange: (event) => updateDeliveryStatus.mutate({ id: delivery.id, status: event.target.value }), children: [_jsx("option", { value: "pending", children: "In attesa" }), _jsx("option", { value: "prepared", children: "Preparato" }), _jsx("option", { value: "shipped", children: "Spedito" }), _jsx("option", { value: "delivered", children: "Consegnato" })] }) }), _jsx(Td, { children: delivery.tracking_number ?? '-' })] }, delivery.id))) })] }), deliveriesQuery.data && deliveriesQuery.data.length === 0 && (_jsx("p", { className: "mt-4 text-sm text-white/60", children: "Nessuna consegna ancora programmata." }))] })] })] }));
}
function Field({ label, error, children }) {
    return (_jsxs("label", { className: "flex flex-col gap-1 text-sm text-white/70", children: [_jsx("span", { className: "text-xs uppercase tracking-wide text-white/40", children: label }), children, error && _jsx("span", { className: "text-xs text-danger", children: error })] }));
}
