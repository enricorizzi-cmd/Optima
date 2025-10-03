// Test script per verificare la configurazione VAPID
import webpush from 'web-push';

console.log('🔍 Test configurazione VAPID...\n');

// Simula le chiavi generate
const publicKey = 'BCT_O3sEqSD8H6xz6dZ277hGyoBCtKZBjygunKBlONmDCCexfIKY334L-6VzHRflP3DTudJg4PwkdLTbg3uRI50';
const privateKey = 'czCEntSa0YQStkus2mGBp7-dxU14Dzt6_a2fkxLDZSY';

try {
  // Configura webpush
  webpush.setVapidDetails('mailto:enrico@example.com', publicKey, privateKey);
  console.log('✅ Configurazione VAPID webpush riuscita');
  
  // Test di formattazione della chiave pubblica per il browser
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64, 'base64');
    return new Uint8Array(buffer);
  }
  
  const convertedKey = urlBase64ToUint8Array(publicKey);
  console.log('✅ Conversione chiave pubblica riuscita, lunghezza:', convertedKey.length);
  console.log('✅ Primi byte della chiave convertita:', Array.from(convertedKey.slice(0, 5)).join(', '));
  
  console.log('\n📋 Riepilogo configurazione:');
  console.log('- Chiave pubblica VAPID:', publicKey);
  console.log('- Chiave privata VAPID:', privateKey.substring(0, 10) + '...');
  console.log('- Lunghezza chiave convertita:', convertedKey.length, 'bytes');
  console.log('- Tutti i test superati! ✅');
  
} catch (error) {
  console.error('❌ Errore nel test VAPID:', error.message);
  process.exit(1);
}
