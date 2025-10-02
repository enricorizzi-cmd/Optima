import { useSessionContext } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { env } from '../lib/env';
export function useApi() {
    const { session } = useSessionContext();
    const token = session?.access_token;
    const request = useCallback(async (path, init = {}) => {
        if (!token) {
            throw new Error('Missing session token');
        }
        const headers = new Headers(init.headers ?? {});
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', `Bearer ${token}`);
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        try {
            const response = await fetch(`${env.backendUrl}${path}`, {
                ...init,
                headers,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message ?? 'Errore della API');
            }
            if (response.status === 204) {
                return undefined;
            }
            if (response.headers.get('content-type')?.includes('application/json')) {
                return (await response.json());
            }
            return undefined;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }
            throw error;
        }
    }, [token]);
    return { request };
}
