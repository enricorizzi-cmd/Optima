import webpush from 'web-push';

// Genera nuove chiavi VAPID
const vapidKeys = webpush.generateVAPIDKeys();

console.log('🔑 Nuove chiavi VAPID generate:');
console.log('');
console.log('VAPID_PUBLIC (per il backend):');
console.log(vapidKeys.publicKey);
console.log('');
console.log('VAPID_PRIVATE (per il backend):');
console.log(vapidKeys.privateKey);
console.log('');
console.log('VITE_VAPID_PUBLIC_KEY (per il frontend):');
console.log(vapidKeys.publicKey);
console.log('');
console.log('⚠️  Importante:');
console.log('1. Aggiorna il file app/src/lib/env.ts con la nuova chiave pubblica');
console.log('2. Configura VAPID_PUBLIC e VAPID_PRIVATE come variabili d\'ambiente nel backend');
console.log('3. Non condividere mai la chiave privata!');
