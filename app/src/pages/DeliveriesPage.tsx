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

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Consegne</CardTitle>
          <CardDescription>Controlla lo stato delle spedizioni e aggiorna le notifiche clienti.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking spedizioni</CardTitle>
          <CardDescription>Gestisci il passaggio da stock a consegna finale.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Ordine</Th>
                <Th>Schedulazione</Th>
                <Th>Magazzino</Th>
                <Th>Stato</Th>
                <Th>Tracking</Th>
              </Tr>
            </Thead>
            <Tbody>
              {deliveriesQuery.data?.map((delivery) => (
                <Tr key={delivery.id}>
                  <Td>{delivery.order_id}</Td>
                  <Td>{delivery.schedule_id}</Td>
                  <Td>{delivery.warehouse_id}</Td>
                  <Td>
                    <Select
                      value={delivery.status}
                      onChange={(event) =>
                        updateStatus.mutate({ id: delivery.id, status: event.target.value as any })
                      }
                    >
                      {deliveryStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Select>
                  </Td>
                  <Td>{delivery.tracking_number ?? '-'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {deliveriesQuery.data && deliveriesQuery.data.length === 0 && (
            <p className="mt-4 text-sm text-gray-600">Nessuna consegna ancora programmata.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
