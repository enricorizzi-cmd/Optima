import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface AuthFormValues {
  email: string;
  password: string;
  orgId: string;
  fullName?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
}

export function AuthPage() {
  const { session, supabaseClient } = useSessionContext();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    defaultValues: { role: 'viewer' },
  });

  useEffect(() => {
    if (session) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [session, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const { error: signInError } = await supabaseClient.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (signInError) {
          throw signInError;
        }
      } else {
        const { error: signUpError } = await supabaseClient.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              org_id: values.orgId,
              full_name: values.fullName,
              role: values.role,
            },
          },
        });
        if (signUpError) {
          throw signUpError;
        }
      }
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Si è verificato un errore';
      setError(message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] px-4 py-10 text-white">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <Badge variant="default">Optima Production Suite</Badge>
          <CardTitle className="text-2xl">
            {mode === 'login' ? 'Accedi alla tua organizzazione' : 'Crea un account'}
          </CardTitle>
          <CardDescription className="text-white/70">
            {mode === 'login'
              ? 'Gestisci ordini, produzione e consegne con un’unica dashboard PWA.'
              : 'Registra il tuo account. Assicurati di avere l’ID organizzazione fornito dall’amministratore.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {mode === 'register' && (
              <>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wide text-white/60" htmlFor="fullName">
                    Nome completo
                  </label>
                  <Input id="fullName" placeholder="Es. Mario Rossi" {...register('fullName')} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wide text-white/60" htmlFor="orgId">
                    ID organizzazione
                  </label>
                  <Input
                    id="orgId"
                    placeholder="ORG-12345"
                    {...register('orgId', { required: 'Campo obbligatorio' })}
                  />
                  {errors.orgId && <p className="mt-1 text-xs text-danger">{errors.orgId.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wide text-white/60" htmlFor="role">
                    Ruolo
                  </label>
                  <Select id="role" {...register('role')}>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </Select>
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wide text-white/60" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tuo.nome@azienda.it"
                {...register('email', { required: 'Campo obbligatorio' })}
              />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wide text-white/60" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Campo obbligatorio', minLength: 8 })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-danger">La password deve contenere almeno 8 caratteri</p>
              )}
            </div>

            {error && <div className="rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}

            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? 'Attendere...' : mode === 'login' ? 'Accedi' : 'Registrati'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white/70">
            {mode === 'login' ? (
              <button className="text-primary hover:text-primary/80" onClick={() => setMode('register')}>
                Non hai un account? Registrati
              </button>
            ) : (
              <button className="text-primary hover:text-primary/80" onClick={() => setMode('login')}>
                Hai già un account? Accedi
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
