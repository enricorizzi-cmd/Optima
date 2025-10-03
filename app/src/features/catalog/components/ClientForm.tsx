import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import type { ClientPayload } from '../supabaseApi';

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

export type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  defaultValues?: Partial<ClientPayload>;
  loading?: boolean;
  onSubmit: (values: ClientPayload) => void;
}

export function ClientForm({ defaultValues, loading, onSubmit }: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: getDefaultValues(defaultValues),
  });

  useEffect(() => {
    form.reset(getDefaultValues(defaultValues));
  }, [defaultValues, form]);

  const handleSubmit = form.handleSubmit((values) => {
    const payload: ClientPayload = {
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

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Field label="Ragione sociale" required error={form.formState.errors.name?.message}>
          <Input placeholder="Es. Azienda Gamma" {...form.register('name')} disabled={loading} />
        </Field>
        <Field label="Codice" required error={form.formState.errors.code?.message}>
          <Input placeholder="Es. CLI-001" {...form.register('code')} disabled={loading} />
        </Field>
        <Field label="Agente di riferimento">
          <Input placeholder="Es. Agente Nord" {...form.register('agent')} disabled={loading} />
        </Field>
        <Field label="Tipologia" required error={form.formState.errors.type?.message}>
          <Input placeholder="Industry/Retail" {...form.register('type')} disabled={loading} />
        </Field>
        <Field label="Categoria" required error={form.formState.errors.category?.message}>
          <Input placeholder="Premium/Standard" {...form.register('category')} disabled={loading} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="contatto@azienda.it" {...form.register('email')} disabled={loading} />
        </Field>
        <Field label="Telefono">
          <Input placeholder="+39 ..." {...form.register('phone')} disabled={loading} />
        </Field>
        <Field label="Partita IVA">
          <Input placeholder="IT12345678901" {...form.register('vat_number')} disabled={loading} />
        </Field>
        <Field label="Indirizzo">
          <Input placeholder="Via esempio 123" {...form.register('address')} disabled={loading} />
        </Field>
        <Field label="Citta">
          <Input placeholder="Milano" {...form.register('city')} disabled={loading} />
        </Field>
        <Field label="Paese">
          <Input placeholder="Italia" {...form.register('country')} disabled={loading} />
        </Field>
      </div>
      <Field label="Note">
        <Textarea rows={3} placeholder="Informazioni aggiuntive" {...form.register('notes')} disabled={loading} />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={loading || form.formState.isSubmitting}>
          {loading || form.formState.isSubmitting ? 'Salvataggio...' : 'Salva'}
        </Button>
      </div>
    </form>
  );
}

function getDefaultValues(defaultValues?: Partial<ClientPayload>): ClientFormValues {
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

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required = false, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </label>
  );
}

