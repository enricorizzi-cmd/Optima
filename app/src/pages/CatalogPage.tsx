import { useMemo, useState } from 'react';
import {
  useClients,
  useSuppliers,
  useRawMaterials,
  useFinishedProducts,
  useWarehouses,
  useOperators,
  useCreateClient,
  useUpdateClient,
  useCreateRawMaterial,
  useUpdateRawMaterial,
} from '../features/catalog/supabaseApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, Tbody, Td, Th, Thead, Tr } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useToast } from '../components/ui/use-toast';
import { ClientForm } from '../features/catalog/components/ClientForm';
import { RawMaterialForm } from '../features/catalog/components/RawMaterialForm';

const tabs = [
  { key: 'clients', label: 'Clienti' },
  { key: 'suppliers', label: 'Fornitori' },
  { key: 'raw', label: 'Materie prime' },
  { key: 'finished', label: 'Prodotti finiti' },
  { key: 'warehouses', label: 'Magazzini' },
  { key: 'operators', label: 'Operatori' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export function CatalogPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('clients');
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [rawMaterialDialogOpen, setRawMaterialDialogOpen] = useState(false);
  const [editingRawMaterialId, setEditingRawMaterialId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: clients } = useClients();
  const { data: suppliers } = useSuppliers();
  const { data: rawMaterials } = useRawMaterials();
  const { data: finishedProducts } = useFinishedProducts();
  const { data: warehouses } = useWarehouses();
  const { data: operators } = useOperators();

  const createClient = useCreateClient({
    onSuccess: () => {
      toast({ title: 'Cliente salvato', description: 'Cliente creato correttamente', variant: 'success' });
      setClientDialogOpen(false);
      setEditingClientId(null);
    },
    onError: (error) => {
      toast({ title: 'Impossibile salvare il cliente', description: error.message, variant: 'destructive' });
    },
  });

  const updateClient = useUpdateClient({
    onSuccess: () => {
      toast({ title: 'Cliente aggiornato', description: 'Dati anagrafici aggiornati', variant: 'success' });
      setClientDialogOpen(false);
      setEditingClientId(null);
    },
    onError: (error) => {
      toast({ title: 'Aggiornamento non riuscito', description: error.message, variant: 'destructive' });
    },
  });

  const createRawMaterial = useCreateRawMaterial({
    onSuccess: () => {
      toast({ title: 'Materia prima salvata', description: 'Catalogo aggiornato', variant: 'success' });
      setRawMaterialDialogOpen(false);
      setEditingRawMaterialId(null);
    },
    onError: (error) => {
      toast({ title: 'Errore su materia prima', description: error.message, variant: 'destructive' });
    },
  });

  const updateRawMaterial = useUpdateRawMaterial({
    onSuccess: () => {
      toast({ title: 'Materia prima aggiornata', description: 'Dati salvati con successo', variant: 'success' });
      setRawMaterialDialogOpen(false);
      setEditingRawMaterialId(null);
    },
    onError: (error) => {
      toast({ title: 'Aggiornamento non riuscito', description: error.message, variant: 'destructive' });
    },
  });

  const editingClient = useMemo(() => clients?.find((client) => client.id === editingClientId) ?? null, [clients, editingClientId]);
  const editingRawMaterial = useMemo(
    () => rawMaterials?.find((material) => material.id === editingRawMaterialId) ?? null,
    [rawMaterials, editingRawMaterialId]
  );

  const isClientSaving = createClient.isPending || updateClient.isPending;
  const isRawMaterialSaving = createRawMaterial.isPending || updateRawMaterial.isPending;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Anagrafiche principali</CardTitle>
          <CardDescription>Gestisci clienti, fornitori e risorse di produzione con un unico data hub.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-md'
                    : 'border-gray-400 bg-gray-50 text-gray-800 hover:bg-gray-100 hover:border-gray-500 hover:text-gray-900 shadow-sm'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {activeTab === 'clients' && (
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Clienti</CardTitle>
              <CardDescription>Stato commerciale e agenti assegnati.</CardDescription>
            </div>
            <Dialog
              open={clientDialogOpen}
              onOpenChange={(open) => {
                setClientDialogOpen(open);
                if (!open) {
                  setEditingClientId(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setEditingClientId(null)}>Nuovo cliente</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingClient ? 'Modifica cliente' : 'Nuovo cliente'}</DialogTitle>
                </DialogHeader>
                <ClientForm
                  defaultValues={editingClient ?? undefined}
                  loading={isClientSaving}
                  onSubmit={(values) => {
                    if (editingClient) {
                      updateClient.mutate({ id: editingClient.id, payload: values });
                    } else {
                      createClient.mutate(values);
                    }
                  }}
                />
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-4 w-full"
                    disabled={isClientSaving}
                  >
                    Annulla
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <Tr>
                  <Th>Codice</Th>
                  <Th>Ragione sociale</Th>
                  <Th>Agente</Th>
                  <Th>Tipologia</Th>
                  <Th>Categoria</Th>
                  <Th>Contatti</Th>
                  <Th>Azioni</Th>
                </Tr>
              </Thead>
              <Tbody>
                {clients?.map((client) => (
                  <Tr key={client.id}>
                    <Td>{client.code}</Td>
                    <Td>{client.name}</Td>
                    <Td>{client.agent ?? '-'}</Td>
                    <Td>
                      <Badge variant="outline">{client.type}</Badge>
                    </Td>
                    <Td>{client.category}</Td>
                    <Td>
                      <div className="flex flex-col text-xs text-gray-500">
                        {client.email}
                        {client.phone}
                      </div>
                    </Td>
                    <Td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingClientId(client.id);
                          setClientDialogOpen(true);
                        }}
                      >
                        Modifica
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {clients && clients.length === 0 && <p className="mt-4 text-sm text-white/50">Nessun cliente registrato.</p>}
          </CardContent>
        </Card>
      )}

      {activeTab === 'suppliers' && (
        <Card>
          <CardHeader>
            <CardTitle>Fornitori</CardTitle>
            <CardDescription>Ultimi accordi e condizioni di pagamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <Tr>
                  <Th>Codice</Th>
                  <Th>Nome</Th>
                  <Th>Pagamento</Th>
                  <Th>Categoria</Th>
                  <Th>Contatti</Th>
                </Tr>
              </Thead>
              <Tbody>
                {suppliers?.map((supplier) => (
                  <Tr key={supplier.id}>
                    <Td>{supplier.code}</Td>
                    <Td>{supplier.name}</Td>
                    <Td>{supplier.payment_terms ?? '-'}</Td>
                    <Td>{supplier.category}</Td>
                    <Td>
                      <div className="flex flex-col text-xs text-gray-500">
                        {supplier.email}
                        {supplier.phone}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {suppliers && suppliers.length === 0 && <p className="mt-4 text-sm text-white/50">Nessun fornitore registrato.</p>}
          </CardContent>
        </Card>
      )}

      {activeTab === 'raw' && (
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Materie prime</CardTitle>
              <CardDescription>Classi, gruppi e ultimo prezzo di acquisto.</CardDescription>
            </div>
            <Dialog
              open={rawMaterialDialogOpen}
              onOpenChange={(open) => {
                setRawMaterialDialogOpen(open);
                if (!open) {
                  setEditingRawMaterialId(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setEditingRawMaterialId(null)}>Nuova materia prima</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingRawMaterial ? 'Modifica materia prima' : 'Nuova materia prima'}</DialogTitle>
                </DialogHeader>
                <RawMaterialForm
                  defaultValues={editingRawMaterial ?? undefined}
                  suppliers={suppliers ?? []}
                  loading={isRawMaterialSaving}
                  onSubmit={(values) => {
                    if (editingRawMaterial) {
                      updateRawMaterial.mutate({ id: editingRawMaterial.id, payload: values });
                    } else {
                      createRawMaterial.mutate(values);
                    }
                  }}
                />
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-4 w-full"
                    disabled={isRawMaterialSaving}
                  >
                    Annulla
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <Tr>
                  <Th>Codice</Th>
                  <Th>Descrizione</Th>
                  <Th>Classe</Th>
                  <Th>Gruppo</Th>
                  <Th>UM</Th>
                  <Th>Ultimo prezzo</Th>
                  <Th>Azioni</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rawMaterials?.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.code}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.class}</Td>
                    <Td>{item.group}</Td>
                    <Td>{item.unit_of_measure}</Td>
                    <Td>{item.last_purchase_price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</Td>
                    <Td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingRawMaterialId(item.id);
                          setRawMaterialDialogOpen(true);
                        }}
                      >
                        Modifica
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {rawMaterials && rawMaterials.length === 0 && (
              <p className="mt-4 text-sm text-white/50">Carica le tue materie prime per iniziare la programmazione.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'finished' && (
        <Card>
          <CardHeader>
            <CardTitle>Prodotti finiti</CardTitle>
            <CardDescription>Classificazione per linea produttiva e unita di misura.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <Tr>
                  <Th>Codice</Th>
                  <Th>Nome</Th>
                  <Th>Classe</Th>
                  <Th>Gruppo</Th>
                  <Th>Tipo</Th>
                  <Th>UM</Th>
                </Tr>
              </Thead>
              <Tbody>
                {finishedProducts?.map((product) => (
                  <Tr key={product.id}>
                    <Td>{product.code}</Td>
                    <Td>{product.name}</Td>
                    <Td>{product.class}</Td>
                    <Td>{product.group}</Td>
                    <Td>{product.type}</Td>
                    <Td>{product.unit_of_measure}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {finishedProducts && finishedProducts.length === 0 && <p className="mt-4 text-sm text-white/50">Nessun prodotto finito registrato.</p>}
          </CardContent>
        </Card>
      )}

      {activeTab === 'warehouses' && (
        <Card>
          <CardHeader>
            <CardTitle>Magazzini</CardTitle>
            <CardDescription>Sedi e linee di riferimento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <Tr>
                  <Th>Codice</Th>
                  <Th>Nome</Th>
                  <Th>Sede</Th>
                  <Th>Linea</Th>
                </Tr>
              </Thead>
              <Tbody>
                {warehouses?.map((warehouse) => (
                  <Tr key={warehouse.id}>
                    <Td>{warehouse.code}</Td>
                    <Td>{warehouse.name}</Td>
                    <Td>{warehouse.site}</Td>
                    <Td>{warehouse.line}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {warehouses && warehouses.length === 0 && <p className="mt-4 text-sm text-white/50">Definisci almeno un magazzino di riferimento.</p>}
          </CardContent>
        </Card>
      )}

      {activeTab === 'operators' && (
        <Card>
          <CardHeader>
            <CardTitle>Operatori</CardTitle>
            <CardDescription>Responsabili di linea e contatti rapidi.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Email</Th>
                  <Th>Telefono</Th>
                  <Th>Magazzino</Th>
                </Tr>
              </Thead>
              <Tbody>
                {operators?.map((operator) => (
                  <Tr key={operator.id}>
                    <Td>
                      {operator.first_name} {operator.last_name}
                    </Td>
                    <Td>{operator.email}</Td>
                    <Td>{operator.phone ?? '-'}</Td>
                    <Td>{operator.warehouse_id}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {operators && operators.length === 0 && (
              <p className="mt-4 text-sm text-white/50">Assegna gli operatori alle linee per monitorare l'avanzamento.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
