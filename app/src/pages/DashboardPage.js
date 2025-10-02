import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useOrders } from '../features/orders/api';
import { useInventory, useFinishedProducts, useRawMaterials } from '../features/catalog/api';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { LoadingScreen } from './LoadingScreen';
const orderStatusLabels = {
    draft: 'Bozza',
    confirmed: 'Confermato',
    in_production: 'In produzione',
    fulfilled: 'Evaso',
    cancelled: 'Annullato',
};
export function DashboardPage() {
    const { data: orders, isLoading: ordersLoading } = useOrders();
    const { data: rawMaterials, isLoading: rawLoading } = useRawMaterials();
    const { data: finishedProducts, isLoading: finishedLoading } = useFinishedProducts();
    const { data: inventory, isLoading: inventoryLoading } = useInventory();
    const push = usePushNotifications();
    const loading = ordersLoading || rawLoading || finishedLoading || inventoryLoading;
    const summary = useMemo(() => {
        const totalOrders = orders?.length ?? 0;
        const byStatus = Object.entries(orderStatusLabels).map(([status, label]) => ({
            status,
            label,
            value: orders?.filter((order) => order.status === status).length ?? 0,
        }));
        const inventoryTotals = {
            raw: inventory?.filter((item) => item.item_type === 'raw_material').reduce((acc, item) => acc + item.quantity, 0) ??
                0,
            finished: inventory?.filter((item) => item.item_type === 'finished_product').reduce((acc, item) => acc + item.quantity, 0) ??
                0,
        };
        return {
            totalOrders,
            byStatus,
            inventoryTotals,
            rawMaterials: rawMaterials?.length ?? 0,
            finishedProducts: finishedProducts?.length ?? 0,
        };
    }, [orders, rawMaterials, finishedProducts, inventory]);
    if (loading) {
        return _jsx(LoadingScreen, { message: "Carichiamo i tuoi dati di produzione..." });
    }
    return (_jsxs("div", { className: "grid gap-6", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardDescription, { children: "Notifiche produzione" }), _jsx(CardTitle, { className: "text-3xl font-display text-primary", children: "Push" })] }), _jsxs(CardContent, { className: "text-sm text-white/70", children: [_jsx("p", { children: "Ricevi aggiornamenti in tempo reale su avanzamento e consegne." }), _jsxs("div", { className: "mt-4 flex flex-col gap-2", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: push.subscribe, disabled: push.status === 'pending' || push.status === 'subscribed', children: push.status === 'subscribed' ? 'Notifiche attive' : 'Attiva notifiche' }), push.status === 'subscribed' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: push.sendTest, children: "Invia notifica di test" })), push.error && _jsx("span", { className: "text-xs text-danger", children: push.error })] }), _jsx("p", { className: "mt-3 text-xs text-white/40", children: "Su iOS/iPadOS aggiungi l'app alla schermata Home (>=16.4) per abilitare le push." })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardDescription, { children: "Ordini attivi" }), _jsx(CardTitle, { className: "text-3xl font-display text-primary", children: summary.totalOrders })] }), _jsxs(CardContent, { className: "text-sm text-white/70", children: [_jsx("p", { children: "Monitora tutte le commesse clienti e il loro stato di avanzamento." }), _jsx(Button, { asChild: true, variant: "secondary", size: "sm", className: "mt-4 w-full", children: _jsx(Link, { to: "/app/orders", children: "Vai agli ordini" }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardDescription, { children: "Catalogo materie prime" }), _jsx(CardTitle, { className: "text-3xl font-display text-primary", children: summary.rawMaterials })] }), _jsx(CardContent, { className: "text-sm text-white/70", children: _jsxs("p", { children: ["Ultimo aggiornamento scorte: ", new Date().toLocaleDateString()] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardDescription, { children: "Disponibilit\u00E0 magazzino" }), _jsx(CardTitle, { className: "text-3xl font-display text-primary", children: Math.round(summary.inventoryTotals.finished + summary.inventoryTotals.raw) })] }), _jsx(CardContent, { className: "text-sm text-white/70", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("span", { children: ["\u2022 Prodotti finiti: ", Math.round(summary.inventoryTotals.finished)] }), _jsxs("span", { children: ["\u2022 Materie prime: ", Math.round(summary.inventoryTotals.raw)] })] }) })] })] }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [_jsxs(Card, { className: "lg:col-span-2", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Pipeline ordini" }), _jsx(CardDescription, { children: "Numero di ordini per stato operativo" })] }), _jsx(CardContent, { className: "h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: summary.byStatus, children: [_jsx(XAxis, { dataKey: "label", stroke: "#9ca3af", tickLine: false, axisLine: { stroke: '#1f2937' } }), _jsx(YAxis, { stroke: "#9ca3af", axisLine: { stroke: '#1f2937' }, tickLine: false, allowDecimals: false }), _jsx(Tooltip, { contentStyle: {
                                                    backgroundColor: '#111827',
                                                    borderRadius: 16,
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    color: '#f9fafb',
                                                } }), _jsx(Bar, { dataKey: "value", fill: "#00e5ff", radius: [12, 12, 0, 0] })] }) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Attivit\u00E0 recenti" }), _jsx(CardDescription, { children: "Ultimi movimenti registrati" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "flex flex-col gap-4", children: [orders?.slice(0, 4).map((order) => (_jsxs("div", { className: "rounded-2xl border border-white/5 bg-white/5 p-3", children: [_jsxs("div", { className: "flex items-center justify-between text-sm font-medium text-white", children: [_jsx("span", { children: order.code }), _jsx(Badge, { variant: order.status === 'fulfilled' ? 'success' : 'outline', children: orderStatusLabels[order.status] ?? order.status })] }), _jsxs("p", { className: "mt-1 text-xs text-white/60", children: ["Consegna prevista ", new Date(order.due_date).toLocaleDateString()] })] }, order.id))), orders && orders.length === 0 && (_jsx("p", { className: "text-sm text-white/50", children: "Ancora nessun ordine registrato oggi." }))] }) })] })] })] }));
}
