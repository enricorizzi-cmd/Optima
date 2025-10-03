import { useCallback, useState } from 'react';
import { env } from '../lib/env';
import { useApi } from './useApi';
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    
    // Usa un approccio più sicuro per la decodifica base64
    const binaryString = atob(base64);
    const bytes = binaryString.split('').map(char => char.charCodeAt(0));
    return new Uint8Array(bytes);
}
export function usePushNotifications() {
    const { request } = useApi();
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const subscribe = useCallback(async () => {
        if (!('serviceWorker' in navigator)) {
            setError('Service worker non supportato');
            return;
        }
        if (!env.vapidPublicKey) {
            setError('Chiave VAPID non configurata');
            return;
        }
        setStatus('pending');
        setError(null);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('Per attivare le notifiche è necessario il consenso.');
            }
            const registration = await navigator.serviceWorker.ready;
            
            // Debug: verifica che il push manager sia disponibile
            if (!registration.pushManager) {
                throw new Error('Push Manager not available in service worker');
            }
            
            // Annulla le sottoscrizioni esistenti prima di crearne una nuova (se supportato)
            // Questo risolve il problema delle chiavi VAPID obsolete nella cache del browser
            if ('getSubscriptions' in registration.pushManager) {
                try {
                    const existingSubscriptions = await registration.pushManager.getSubscriptions();
                    for (const oldSubscription of existingSubscriptions) {
                        await oldSubscription.unsubscribe();
                    }
                } catch (error) {
                    // Se getSubscriptions fallisce, continuiamo comunque
                    console.warn('Could not clear existing subscriptions:', error);
                }
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(env.vapidPublicKey),
            });
            const response = await request('/api/push/subscribe', {
                method: 'POST',
                body: JSON.stringify({ subscription }),
            });
            setSubscriptionId(response.id);
            setStatus('subscribed');
        }
        catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Errore durante la sottoscrizione');
        }
    }, [request]);
    const sendTest = useCallback(async () => {
        if (!subscriptionId)
            return;
        await request('/api/push/test', {
            method: 'POST',
            body: JSON.stringify({ subscription_id: subscriptionId }),
        });
    }, [request, subscriptionId]);
    return {
        status,
        error,
        subscribe,
        sendTest,
    };
}
