import { useState } from 'react';
import { useCreateProgress } from '../features/orders/api';
import { useOperators } from '../features/catalog/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';

const statuses = [
  { value: 'planned', label: 'Programmato' },
  { value: 'in_progress', label: 'In corso' },
  { value: 'completed', label: 'Completato' },
  { value: 'stocked', label: 'In stock' },
];

export function ProductionProgressPage() {
  const createProgress = useCreateProgress();
  const { data: operators } = useOperators();
  const [scheduleId, setScheduleId] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [quantity, setQuantity] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [operatorId, setOperatorId] = useState('');

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Avanzamento produzione</CardTitle>
          <CardDescription>Registra gli stati chiave del ciclo produttivo per avere tracciabilità end-to-end.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!scheduleId) return;
              createProgress.mutate({
                schedule_id: scheduleId,
                status: status as any,
                quantity_completed: quantity,
                notes,
                recorded_by: operatorId || 'system',
                recorded_at: new Date().toISOString(),
              });
            }}
          >
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs uppercase tracking-wide text-gray-500">ID schedulazione</label>
              <Input
                placeholder="Inserisci l'ID della schedulazione"
                value={scheduleId}
                onChange={(event) => setScheduleId(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-gray-500">Stato</label>
              <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                {statuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-gray-500">Quantità completata</label>
              <Input
                type="number"
                min={0}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-gray-500">Operatore</label>
              <Select value={operatorId} onChange={(event) => setOperatorId(event.target.value)}>
                <option value="">Sistema</option>
                {operators?.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.first_name} {operator.last_name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs uppercase tracking-wide text-gray-500">Note</label>
              <Input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Annotazioni sul turno" />
            </div>
            <Button type="submit" disabled={createProgress.isPending} className="md:col-span-2">
              {createProgress.isPending ? 'Registrazione...' : 'Registra avanzamento'}
            </Button>
            {createProgress.isSuccess && <p className="md:col-span-2 text-sm text-success">Aggiornamento registrato.</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
