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
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [operatorId, setOperatorId] = useState<string>('');
  const [warehouseId, setWarehouseId] = useState<string>('');

  const orderLines = useMemo(() => {
    const order = orders?.find((item) => item.id === selectedOrderId);
    return order?.lines ?? [];
  }, [selectedOrderId, orders]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Programmazione produzione</CardTitle>
          <CardDescription>Pianifica lotti a partire dagli ordini confermati e assegna risorse chiave.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!selectedOrderId || !selectedLineId || !startDate || !endDate) return;
              const selectedLine = orderLines.find((line) => line.id === selectedLineId);
              if (!selectedLine) return;
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
            }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Ordine cliente</label>
              <Select value={selectedOrderId} onChange={(event) => setSelectedOrderId(event.target.value)}>
                <option value="" disabled>
                  Seleziona ordine
                </option>
                {orders?.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.code} · {new Date(order.due_date).toLocaleDateString()}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Riga ordine</label>
              <Select value={selectedLineId} onChange={(event) => setSelectedLineId(event.target.value)}>
                <option value="" disabled>
                  Seleziona riga
                </option>
                {orderLines.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.product_id} · {line.quantity} {line.unit_of_measure}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Linea produttiva</label>
              <Input value={productionLine} onChange={(event) => setProductionLine(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Magazzino</label>
              <Select value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)}>
                <option value="">Non assegnato</option>
                {warehouses?.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Data inizio</label>
              <Input type="datetime-local" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Data fine</label>
              <Input type="datetime-local" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Operatore</label>
              <Select value={operatorId} onChange={(event) => setOperatorId(event.target.value)}>
                <option value="">Non assegnato</option>
                {operators?.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.first_name} {operator.last_name}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" disabled={createSchedule.isPending} className="md:col-span-2">
              {createSchedule.isPending ? 'Pianificazione in corso...' : 'Crea schedulazione'}
            </Button>
            {createSchedule.isSuccess && (
              <p className="md:col-span-2 text-sm text-success">Schedulazione creata!</p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ordini in attesa di pianificazione</CardTitle>
          <CardDescription>Filtra rapidamente gli ordini confermati da mettere in produzione.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Ordine</Th>
                <Th>Cliente</Th>
                <Th>Consegna</Th>
                <Th>Righe</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders
                ?.filter((order) => order.status === 'confirmed')
                .map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.code}</Td>
                    <Td>{order.client_id}</Td>
                    <Td>{new Date(order.due_date).toLocaleDateString()}</Td>
                    <Td>{order.lines?.length ?? 0}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
