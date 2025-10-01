import { useInventory } from '../features/catalog/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, Tbody, Td, Th, Thead, Tr } from '../components/ui/table';
import { useState } from 'react';

export function InventoryPage() {
  const [filter, setFilter] = useState<'all' | 'raw_material' | 'finished_product'>('all');
  const { data: inventory } = useInventory(filter === 'all' ? undefined : filter);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Giacenze</CardTitle>
          <CardDescription>Visualizza lo stato dei magazzini tra materie prime e prodotti finiti.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {['all', 'raw_material', 'finished_product'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`rounded-2xl border px-4 py-2 text-sm transition-colors ${
                  filter === type
                    ? 'border-primary bg-primary/20 text-primary shadow-neon'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'Tutto' : type === 'raw_material' ? 'Materie prime' : 'Prodotti finiti'}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dettaglio giacenze</CardTitle>
          <CardDescription>Dati aggiornati per magazzino e tipologia articolo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Item</Th>
                <Th>Tipologia</Th>
                <Th>Magazzino</Th>
                <Th>Quantità</Th>
                <Th>UM</Th>
                <Th>Aggiornato</Th>
              </Tr>
            </Thead>
            <Tbody>
              {inventory?.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.item_id}</Td>
                  <Td>{item.item_type === 'raw_material' ? 'Materia prima' : 'Prodotto finito'}</Td>
                  <Td>{item.warehouse_id}</Td>
                  <Td>{item.quantity.toLocaleString('it-IT')}</Td>
                  <Td>{item.unit_of_measure}</Td>
                  <Td>{new Date(item.updated_at).toLocaleString('it-IT')}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {inventory && inventory.length === 0 && (
            <p className="mt-4 text-sm text-white/60">Nessuna giacenza caricata per il filtro selezionato.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
