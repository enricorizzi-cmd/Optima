import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
const rawMaterialSchema = z.object({
    name: z.string().min(1, 'Campo obbligatorio'),
    code: z.string().min(1, 'Campo obbligatorio'),
    class: z.string().min(1, 'Campo obbligatorio'),
    group: z.string().min(1, 'Campo obbligatorio'),
    type: z.string().min(1, 'Campo obbligatorio'),
    unit_of_measure: z.string().min(1, 'Campo obbligatorio'),
    last_purchase_price: z.coerce.number({ invalid_type_error: 'Inserisci un numero' }).min(0, 'Valore non valido'),
    distributors: z.string().optional(),
    default_supplier_id: z.string().optional(),
});
export function RawMaterialForm({ defaultValues, suppliers, loading, onSubmit }) {
    const form = useForm({
        resolver: zodResolver(rawMaterialSchema),
        defaultValues: getDefaultValues(defaultValues),
    });
    useEffect(() => {
        form.reset(getDefaultValues(defaultValues));
    }, [defaultValues, form]);
    const handleSubmit = form.handleSubmit((values) => {
        const distributorsArray = values.distributors
            ? values.distributors.split(',').map((entry) => entry.trim()).filter(Boolean)
            : [];
        onSubmit({
            name: values.name,
            code: values.code,
            class: values.class,
            group: values.group,
            type: values.type,
            unit_of_measure: values.unit_of_measure,
            last_purchase_price: values.last_purchase_price,
            distributors: distributorsArray,
            default_supplier_id: values.default_supplier_id ? values.default_supplier_id : undefined,
        });
    });
    return (_jsxs("form", { className: "flex flex-col gap-4", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(Field, { label: "Nome", error: form.formState.errors.name?.message, children: _jsx(Input, { placeholder: "Granulato ABS", ...form.register('name'), disabled: loading }) }), _jsx(Field, { label: "Codice", error: form.formState.errors.code?.message, children: _jsx(Input, { placeholder: "RM-ABS", ...form.register('code'), disabled: loading }) }), _jsx(Field, { label: "Classe", error: form.formState.errors.class?.message, children: _jsx(Input, { placeholder: "Polimeri", ...form.register('class'), disabled: loading }) }), _jsx(Field, { label: "Gruppo", error: form.formState.errors.group?.message, children: _jsx(Input, { placeholder: "Plastica", ...form.register('group'), disabled: loading }) }), _jsx(Field, { label: "Tipo", error: form.formState.errors.type?.message, children: _jsx(Input, { placeholder: "Granulo", ...form.register('type'), disabled: loading }) }), _jsx(Field, { label: "Unita di misura", error: form.formState.errors.unit_of_measure?.message, children: _jsx(Input, { placeholder: "kg", ...form.register('unit_of_measure'), disabled: loading }) }), _jsx(Field, { label: "Ultimo prezzo d'acquisto", error: form.formState.errors.last_purchase_price?.message, children: _jsx(Input, { type: "number", step: "0.01", min: "0", ...form.register('last_purchase_price'), disabled: loading }) }), _jsx(Field, { label: "Fornitore predefinito", children: _jsxs(Select, { ...form.register('default_supplier_id'), disabled: loading, children: [_jsx("option", { value: "", children: "Nessuno" }), suppliers.map((supplier) => (_jsx("option", { value: supplier.id, children: supplier.name }, supplier.id)))] }) })] }), _jsx(Field, { label: "Distributori (separa con virgola)", children: _jsx(Textarea, { rows: 2, placeholder: "Distributore A, Distributore B", ...form.register('distributors'), disabled: loading }) }), _jsx("div", { className: "flex justify-end gap-3 pt-2", children: _jsx(Button, { type: "submit", disabled: loading || form.formState.isSubmitting, children: loading || form.formState.isSubmitting ? 'Salvataggio...' : 'Salva' }) })] }));
}
function getDefaultValues(defaultValues) {
    return {
        name: defaultValues?.name ?? '',
        code: defaultValues?.code ?? '',
        class: defaultValues?.class ?? '',
        group: defaultValues?.group ?? '',
        type: defaultValues?.type ?? '',
        unit_of_measure: defaultValues?.unit_of_measure ?? '',
        last_purchase_price: defaultValues?.last_purchase_price ?? 0,
        distributors: defaultValues?.distributors?.join(', ') ?? '',
        default_supplier_id: defaultValues?.default_supplier_id ?? '',
    };
}
function Field({ label, error, children }) {
    return (_jsxs("label", { className: "flex flex-col gap-1 text-sm text-gray-700", children: [_jsx("span", { className: "text-xs uppercase tracking-wide text-gray-500", children: label }), children, error && _jsx("span", { className: "text-xs text-danger", children: error })] }));
}
