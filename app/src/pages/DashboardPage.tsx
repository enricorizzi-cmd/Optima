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

const orderStatusLabels: Record<string, string> = {
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
      raw:
        inventory?.filter((item) => item.item_type === 'raw_material').reduce((acc, item) => acc + item.quantity, 0) ??
        0,
      finished:
        inventory?.filter((item) => item.item_type === 'finished_product').reduce((acc, item) => acc + item.quantity, 0) ??
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
    return <LoadingScreen message="Carichiamo i tuoi dati di produzione..." />;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Notifiche produzione</CardDescription>
            <CardTitle className="text-3xl font-display text-primary">Push</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            <p>Ricevi aggiornamenti in tempo reale su avanzamento e consegne.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={push.subscribe}
                disabled={push.status === 'pending' || push.status === 'subscribed'}
              >
                {push.status === 'subscribed' ? 'Notifiche attive' : 'Attiva notifiche'}
              </Button>
              {push.status === 'subscribed' && (
                <Button variant="ghost" size="sm" onClick={push.sendTest}>
                  Invia notifica di test
                </Button>
              )}
              {push.error && <span className="text-xs text-danger">{push.error}</span>}
            </div>
            <p className="mt-3 text-xs text-white/40">
              Su iOS/iPadOS aggiungi l’app alla schermata Home (>=16.4) per abilitare le push.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Ordini attivi</CardDescription>
            <CardTitle className="text-3xl font-display text-primary">{summary.totalOrders}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            <p>Monitora tutte le commesse clienti e il loro stato di avanzamento.</p>
            <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
              <Link to="/app/orders">Vai agli ordini</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Catalogo materie prime</CardDescription>
            <CardTitle className="text-3xl font-display text-primary">{summary.rawMaterials}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            <p>Ultimo aggiornamento scorte: {new Date().toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Disponibilità magazzino</CardDescription>
            <CardTitle className="text-3xl font-display text-primary">
              {Math.round(summary.inventoryTotals.finished + summary.inventoryTotals.raw)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            <div className="flex flex-col gap-1">
              <span>• Prodotti finiti: {Math.round(summary.inventoryTotals.finished)}</span>
              <span>• Materie prime: {Math.round(summary.inventoryTotals.raw)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pipeline ordini</CardTitle>
            <CardDescription>Numero di ordini per stato operativo</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.byStatus}>
                <XAxis dataKey="label" stroke="#9ca3af" tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                <YAxis stroke="#9ca3af" axisLine={{ stroke: '#1f2937' }} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.05)',
                    color: '#f9fafb',
                  }}
                />
                <Bar dataKey="value" fill="#00e5ff" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attività recenti</CardTitle>
            <CardDescription>Ultimi movimenti registrati</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {orders?.slice(0, 4).map((order) => (
                <div key={order.id} className="rounded-2xl border border-white/5 bg-white/5 p-3">
                  <div className="flex items-center justify-between text-sm font-medium text-white">
                    <span>{order.code}</span>
                    <Badge variant={order.status === 'fulfilled' ? 'success' : 'outline'}>
                      {orderStatusLabels[order.status] ?? order.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-white/60">
                    Consegna prevista {new Date(order.due_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {orders && orders.length === 0 && (
                <p className="text-sm text-white/50">Ancora nessun ordine registrato oggi.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
