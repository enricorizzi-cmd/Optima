import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
const clientSchema = z.object({
    name: z.string().min(1, 'Campo obbligatorio'),
    code: z.string().min(1, 'Campo obbligatorio'),
    agent: z.string().optional(),
    type: z.string().min(1, 'Campo obbligatorio'),
    category: z.string().min(1, 'Campo obbligatorio'),
    email: z.string().email('Email non valida').optional().or(z.literal('')),
    phone: z.string().optional(),
    notes: z.string().optional(),
    vat_number: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
});
export function ClientForm({ defaultValues, loading, onSubmit }) {
    const form = useForm({
        resolver: zodResolver(clientSchema),
        defaultValues: getDefaultValues(defaultValues),
    });
    useEffect(() => {
        form.reset(getDefaultValues(defaultValues));
    }, [defaultValues, form]);
    const handleSubmit = form.handleSubmit((values) => {
        const payload = {
            ...values,
            email: values.email || undefined,
            agent: values.agent || undefined,
            phone: values.phone || undefined,
            notes: values.notes || undefined,
            vat_number: values.vat_number || undefined,
            address: values.address || undefined,
            city: values.city || undefined,
            country: values.country || undefined,
        };
        onSubmit(payload);
    });
    return (_jsxs("form", { className: "flex flex-col gap-4", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(Field, { label: "Ragione sociale", error: form.formState.errors.name?.message, children: _jsx(Input, { placeholder: "Es. Azienda Gamma", ...form.register('name'), disabled: loading }) }), _jsx(Field, { label: "Codice", error: form.formState.errors.code?.message, children: _jsx(Input, { placeholder: "Es. CLI-001", ...form.register('code'), disabled: loading }) }), _jsx(Field, { label: "Agente di riferimento", children: _jsx(Input, { placeholder: "Es. Agente Nord", ...form.register('agent'), disabled: loading }) }), _jsx(Field, { label: "Tipologia", error: form.formState.errors.type?.message, children: _jsx(Input, { placeholder: "Industry/Retail", ...form.register('type'), disabled: loading }) }), _jsx(Field, { label: "Categoria", error: form.formState.errors.category?.message, children: _jsx(Input, { placeholder: "Premium/Standard", ...form.register('category'), disabled: loading }) }), _jsx(Field, { label: "Email", error: form.formState.errors.email?.message, children: _jsx(Input, { type: "email", placeholder: "contatto@azienda.it", ...form.register('email'), disabled: loading }) }), _jsx(Field, { label: "Telefono", children: _jsx(Input, { placeholder: "+39 ...", ...form.register('phone'), disabled: loading }) }), _jsx(Field, { label: "Partita IVA", children: _jsx(Input, { placeholder: "IT12345678901", ...form.register('vat_number'), disabled: loading }) }), _jsx(Field, { label: "Indirizzo", children: _jsx(Input, { placeholder: "Via esempio 123", ...form.register('address'), disabled: loading }) }), _jsx(Field, { label: "Citta", children: _jsx(Input, { placeholder: "Milano", ...form.register('city'), disabled: loading }) }), _jsx(Field, { label: "Paese", children: _jsx(Input, { placeholder: "Italia", ...form.register('country'), disabled: loading }) })] }), _jsx(Field, { label: "Note", children: _jsx(Textarea, { rows: 3, placeholder: "Informazioni aggiuntive", ...form.register('notes'), disabled: loading }) }), _jsx("div", { className: "flex justify-end gap-3 pt-2", children: _jsx(Button, { type: "submit", disabled: loading || form.formState.isSubmitting, children: loading || form.formState.isSubmitting ? 'Salvataggio...' : 'Salva' }) })] }));
}
function getDefaultValues(defaultValues) {
    return {
        name: defaultValues?.name ?? '',
        code: defaultValues?.code ?? '',
        agent: defaultValues?.agent ?? '',
        type: defaultValues?.type ?? '',
        category: defaultValues?.category ?? '',
        email: defaultValues?.email ?? '',
        phone: defaultValues?.phone ?? '',
        notes: defaultValues?.notes ?? '',
        vat_number: defaultValues?.vat_number ?? '',
        address: defaultValues?.address ?? '',
        city: defaultValues?.city ?? '',
        country: defaultValues?.country ?? '',
    };
}
function Field({ label, error, children }) {
    return (_jsxs("label", { className: "flex flex-col gap-1 text-sm text-white/70", children: [_jsx("span", { className: "text-xs uppercase tracking-wide text-white/40", children: label }), children, error && _jsx("span", { className: "text-xs text-danger", children: error })] }));
}
