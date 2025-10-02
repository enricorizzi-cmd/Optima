import { useCallback, useState } from 'react';
import { env } from '../lib/env';
import { useApi } from './useApi';
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i += 1) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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
