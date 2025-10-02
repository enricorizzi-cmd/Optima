import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useClients, useFinishedProducts } from '../features/catalog/api';
import {
  useCreateOrder,
  useOrders,
  useUpdateOrderStatus,
  useDeliveries,
  useUpdateDeliveryStatus,
} from '../features/orders/api';
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
] as const;

const orderFormSchema = z.object({
  client_id: z.string().min(1, 'Seleziona un cliente'),
  code: z.string().min(1, 'Campo obbligatorio'),
  order_date: z.string().min(1, 'Campo obbligatorio'),
  due_date: z.string().min(1, 'Campo obbligatorio'),
  priority: z.enum(['low', 'medium', 'high']),
  notes: z.string().optional(),
  lines: z
    .array(
      z.object({
        product_id: z.string().min(1, 'Seleziona un prodotto'),
        quantity: z.coerce.number({ invalid_type_error: 'Inserisci una quantita' }).min(0.01, 'Quantita non valida'),
        unit_price: z.coerce.number({ invalid_type_error: 'Inserisci un prezzo' }).min(0, 'Prezzo non valido'),
        unit_of_measure: z.string().min(1, 'Campo obbligatorio'),
      })
    )
    .min(1, 'Aggiungi almeno una riga ordine'),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

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

  const form = useForm<OrderFormValues>({
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
    return orders?.reduce<Record<string, typeof orders>>((acc, order) => {
      acc[order.status] = acc[order.status] ? [...acc[order.status]!, order] : [order];
      return acc;
    }, {}) ?? {};
  }, [orders]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Ordini clienti</CardTitle>
            <CardDescription>Pianifica e monitora ogni commessa dal ricevimento alla consegna.</CardDescription>
          </div>
          <Dialog open={orderDialogOpen} onOpenChange={(open) => { setOrderDialogOpen(open); if (!open) form.reset(); }}>
            <DialogTrigger asChild>
              <Button>Nuovo ordine</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Crea ordine cliente</DialogTitle>
              </DialogHeader>
              <form className="flex flex-col gap-5" onSubmit={handleCreateOrder}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Cliente" error={form.formState.errors.client_id?.message}>
                    <Select {...form.register('client_id')} disabled={createOrder.isPending}>
                      <option value="">Seleziona cliente</option>
                      {clients?.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Codice ordine" error={form.formState.errors.code?.message}>
                    <Input placeholder="ORD-2025-001" {...form.register('code')} disabled={createOrder.isPending} />
                  </Field>
                  <Field label="Data ordine" error={form.formState.errors.order_date?.message}>
                    <Input type="date" {...form.register('order_date')} disabled={createOrder.isPending} />
                  </Field>
                  <Field label="Data consegna prevista" error={form.formState.errors.due_date?.message}>
                    <Input type="date" {...form.register('due_date')} disabled={createOrder.isPending} />
                  </Field>
                  <Field label="Priorita">
                    <Select {...form.register('priority')} disabled={createOrder.isPending}>
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Note">
                  <Textarea rows={3} placeholder="Indicazioni operative" {...form.register('notes')} disabled={createOrder.isPending} />
                </Field>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-white">Righe ordine</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddLine} disabled={createOrder.isPending}>
                      Aggiungi riga
                    </Button>
                  </div>
                  {form.formState.errors.lines?.message && (
                    <p className="text-sm text-danger">{form.formState.errors.lines.message}</p>
                  )}
                  <div className="grid gap-4">
                    {linesArray.fields.map((field, index) => {
                      const lineErrors = form.formState.errors.lines?.[index];
                      return (
                        <div key={field.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                          <div className="grid gap-3 md:grid-cols-5">
                            <label className="flex flex-col text-sm text-gray-700">
                              <span className="text-xs uppercase tracking-wide text-gray-500">Prodotto</span>
                              <Select
                                value={form.watch(`lines.${index}.product_id`)}
                                onChange={(event) => {
                                  const productId = event.target.value;
                                  form.setValue(`lines.${index}.product_id`, productId, { shouldValidate: true });
                                  const product = finishedProducts?.find((item) => item.id === productId);
                                  if (product) {
                                    form.setValue(`lines.${index}.unit_of_measure`, product.unit_of_measure);
                                  }
                                }}
                                disabled={createOrder.isPending}
                              >
                                <option value="">Seleziona</option>
                                {finishedProducts?.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name}
                                  </option>
                                ))}
                              </Select>
                              {lineErrors?.product_id?.message && (
                                <span className="text-xs text-danger">{lineErrors.product_id.message}</span>
                              )}
                            </label>
                            <Field label="Quantita" error={lineErrors?.quantity?.message}>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.register(`lines.${index}.quantity`, { valueAsNumber: true })}
                                disabled={createOrder.isPending}
                              />
                            </Field>
                            <Field label="Prezzo unitario" error={lineErrors?.unit_price?.message}>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.register(`lines.${index}.unit_price`, { valueAsNumber: true })}
                                disabled={createOrder.isPending}
                              />
                            </Field>
                            <Field label="Unita" error={lineErrors?.unit_of_measure?.message}>
                              <Input
                                placeholder="pz/kg"
                                {...form.register(`lines.${index}.unit_of_measure`)}
                                disabled={createOrder.isPending}
                              />
                            </Field>
                            <div className="flex items-end justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => linesArray.remove(index)}
                                disabled={createOrder.isPending || linesArray.fields.length === 1}
                              >
                                Rimuovi
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost" disabled={createOrder.isPending}>
                      Annulla
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={createOrder.isPending}>
                    {createOrder.isPending ? 'Salvataggio...' : 'Crea ordine'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Da qui aggiorni lo stato di un ordine per coordinare acquisti, produzione e logistica.</p>
          </div>
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const orderId = formData.get('orderId')?.toString();
              const status = formData.get('status')?.toString();
              if (orderId && status) {
                updateStatus.mutate({ id: orderId, status: status as any });
              }
            }}
          >
            <Select name="orderId">
              <option value="">Seleziona un ordine</option>
              {orders?.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.code} - consegna {new Date(order.due_date).toLocaleDateString()}
                </option>
              ))}
            </Select>
            <Select name="status" defaultValue="confirmed">
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Button type="submit" disabled={updateStatus.isPending}>
              Aggiorna stato
            </Button>
            {updateStatus.isSuccess && <p className="text-xs text-success">Stato aggiornato con successo.</p>}
          </form>
        </CardContent>
      </Card>

      {Object.entries(groupedOrders).map(([status, entries]) => (
        <Card key={status}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Badge variant={status === 'fulfilled' ? 'success' : status === 'cancelled' ? 'danger' : 'default'}>
                {statusOptions.find((option) => option.value === status)?.label ?? status}
              </Badge>
              <span className="text-base font-normal text-gray-700">{entries.length} ordini</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <Tr>
                  <Th>Codice</Th>
                  <Th>Cliente</Th>
                  <Th>Consegna</Th>
                  <Th>Priorita</Th>
                  <Th>Righe prodotto</Th>
                </Tr>
              </Thead>
              <Tbody>
                {entries.map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.code}</Td>
                    <Td>{order.client_id}</Td>
                    <Td>{new Date(order.due_date).toLocaleDateString()}</Td>
                    <Td>
                      <Badge variant={order.priority === 'high' ? 'danger' : order.priority === 'medium' ? 'warning' : 'outline'}>
                        {order.priority}
                      </Badge>
                    </Td>
                    <Td>{order.lines?.length ?? 0}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Tracking consegne</CardTitle>
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
                        updateDeliveryStatus.mutate({ id: delivery.id, status: event.target.value as any })
                      }
                    >
                      <option value="pending">In attesa</option>
                      <option value="prepared">Preparato</option>
                      <option value="shipped">Spedito</option>
                      <option value="delivered">Consegnato</option>
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

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      {children}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}


