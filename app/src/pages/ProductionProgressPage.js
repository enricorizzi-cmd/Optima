import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [quantity, setQuantity] = useState(0);
    const [notes, setNotes] = useState('');
    const [operatorId, setOperatorId] = useState('');
    return (_jsx("div", { className: "grid gap-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Avanzamento produzione" }), _jsx(CardDescription, { children: "Registra gli stati chiave del ciclo produttivo per avere tracciabilit\u00E0 end-to-end." })] }), _jsx(CardContent, { children: _jsxs("form", { className: "grid gap-4 md:grid-cols-2", onSubmit: (event) => {
                            event.preventDefault();
                            if (!scheduleId)
                                return;
                            createProgress.mutate({
                                schedule_id: scheduleId,
                                status: status,
                                quantity_completed: quantity,
                                notes,
                                recorded_by: operatorId || 'system',
                                recorded_at: new Date().toISOString(),
                            });
                        }, children: [_jsxs("div", { className: "flex flex-col gap-2 md:col-span-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "ID schedulazione" }), _jsx(Input, { placeholder: "Inserisci l'ID della schedulazione", value: scheduleId, onChange: (event) => setScheduleId(event.target.value) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Stato" }), _jsx(Select, { value: status, onChange: (event) => setStatus(event.target.value), children: statuses.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Quantit\u00E0 completata" }), _jsx(Input, { type: "number", min: 0, value: quantity, onChange: (event) => setQuantity(Number(event.target.value)) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Operatore" }), _jsxs(Select, { value: operatorId, onChange: (event) => setOperatorId(event.target.value), children: [_jsx("option", { value: "", children: "Sistema" }), operators?.map((operator) => (_jsxs("option", { value: operator.id, children: [operator.first_name, " ", operator.last_name] }, operator.id)))] })] }), _jsxs("div", { className: "flex flex-col gap-2 md:col-span-2", children: [_jsx("label", { className: "text-xs uppercase tracking-wide text-white/60", children: "Note" }), _jsx(Input, { value: notes, onChange: (event) => setNotes(event.target.value), placeholder: "Annotazioni sul turno" })] }), _jsx(Button, { type: "submit", disabled: createProgress.isPending, className: "md:col-span-2", children: createProgress.isPending ? 'Registrazione...' : 'Registra avanzamento' }), createProgress.isSuccess && _jsx("p", { className: "md:col-span-2 text-sm text-success", children: "Aggiornamento registrato." })] }) })] }) }));
}
