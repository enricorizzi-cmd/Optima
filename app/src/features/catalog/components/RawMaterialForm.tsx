import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import type { RawMaterialPayload, Supplier } from '../supabaseApi';

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

export type RawMaterialFormValues = z.infer<typeof rawMaterialSchema>;

interface RawMaterialFormProps {
  defaultValues?: Partial<RawMaterialPayload>;
  suppliers: Supplier[];
  loading?: boolean;
  onSubmit: (values: RawMaterialPayload) => void;
}

export function RawMaterialForm({ defaultValues, suppliers, loading, onSubmit }: RawMaterialFormProps) {
  const form = useForm<RawMaterialFormValues>({
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

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome" error={form.formState.errors.name?.message}>
          <Input placeholder="Granulato ABS" {...form.register('name')} disabled={loading} />
        </Field>
        <Field label="Codice" error={form.formState.errors.code?.message}>
          <Input placeholder="RM-ABS" {...form.register('code')} disabled={loading} />
        </Field>
        <Field label="Classe" error={form.formState.errors.class?.message}>
          <Input placeholder="Polimeri" {...form.register('class')} disabled={loading} />
        </Field>
        <Field label="Gruppo" error={form.formState.errors.group?.message}>
          <Input placeholder="Plastica" {...form.register('group')} disabled={loading} />
        </Field>
        <Field label="Tipo" error={form.formState.errors.type?.message}>
          <Input placeholder="Granulo" {...form.register('type')} disabled={loading} />
        </Field>
        <Field label="Unita di misura" error={form.formState.errors.unit_of_measure?.message}>
          <Input placeholder="kg" {...form.register('unit_of_measure')} disabled={loading} />
        </Field>
        <Field label="Ultimo prezzo d'acquisto" error={form.formState.errors.last_purchase_price?.message}>
          <Input type="number" step="0.01" min="0" {...form.register('last_purchase_price')} disabled={loading} />
        </Field>
        <Field label="Fornitore predefinito">
          <Select {...form.register('default_supplier_id')} disabled={loading}>
            <option value="">Nessuno</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Distributori (separa con virgola)">
        <Textarea rows={2} placeholder="Distributore A, Distributore B" {...form.register('distributors')} disabled={loading} />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={loading || form.formState.isSubmitting}>
          {loading || form.formState.isSubmitting ? 'Salvataggio...' : 'Salva'}
        </Button>
      </div>
    </form>
  );
}

function getDefaultValues(defaultValues?: Partial<RawMaterialPayload>): RawMaterialFormValues {
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

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-white/70">
      <span className="text-xs uppercase tracking-wide text-white/40">{label}</span>
      {children}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
