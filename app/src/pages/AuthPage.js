import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
export function AuthPage() {
    const { session, supabaseClient } = useSessionContext();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({
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
            }
            else {
                const { error: signUpError } = await supabaseClient.auth.signUp({
                    email: values.email,
                    password: values.password,
                    options: {
                        data: {
                            org_id: '00000000-0000-0000-0000-000000000001', // Default organization UUID
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
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Si è verificato un errore';
            setError(message);
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 text-gray-900", children: _jsxs(Card, { className: "w-full max-w-xl", children: [_jsxs(CardHeader, { children: [_jsx(Badge, { variant: "default", children: "Optima Production Suite" }), _jsx(CardTitle, { className: "text-2xl", children: mode === 'login' ? 'Accedi alla tua organizzazione' : 'Crea un account' }), _jsx(CardDescription, { className: "text-gray-600", children: mode === 'login'
                                ? 'Gestisci ordini, produzione e consegne con un’unica dashboard PWA.'
                                : 'Registra il tuo account. Assicurati di avere l’ID organizzazione fornito dall’amministratore.' })] }), _jsxs(CardContent, { children: [_jsxs("form", { className: "flex flex-col gap-4", onSubmit: onSubmit, children: [mode === 'register' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-xs uppercase tracking-wide text-gray-600", htmlFor: "fullName", children: "Nome completo" }), _jsx(Input, { id: "fullName", placeholder: "Es. Mario Rossi", ...register('fullName') })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-xs uppercase tracking-wide text-gray-600", htmlFor: "role", children: "Ruolo" }), _jsxs(Select, { id: "role", ...register('role'), children: [_jsx("option", { value: "owner", children: "Owner" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "editor", children: "Editor" }), _jsx("option", { value: "viewer", children: "Viewer" })] })] })] })), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-xs uppercase tracking-wide text-gray-600", htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "tuo.nome@azienda.it", ...register('email', { required: 'Campo obbligatorio' }) }), errors.email && _jsx("p", { className: "mt-1 text-xs text-danger", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-xs uppercase tracking-wide text-gray-600", htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register('password', { required: 'Campo obbligatorio', minLength: 8 }) }), errors.password && (_jsx("p", { className: "mt-1 text-xs text-danger", children: "La password deve contenere almeno 8 caratteri" }))] }), error && _jsx("div", { className: "rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger", children: error }), _jsx(Button, { type: "submit", disabled: loading, className: "mt-2", children: loading ? 'Attendere...' : mode === 'login' ? 'Accedi' : 'Registrati' })] }), _jsx("div", { className: "mt-6 text-center text-sm text-gray-600", children: mode === 'login' ? (_jsx("button", { className: "text-primary hover:text-primary/80", onClick: () => setMode('register'), children: "Non hai un account? Registrati" })) : (_jsx("button", { className: "text-primary hover:text-primary/80", onClick: () => setMode('login'), children: "Hai gi\u00E0 un account? Accedi" })) })] })] }) }));
}
