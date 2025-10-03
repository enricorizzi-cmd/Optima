# 🚀 GUIDA DEPLOYMENT E CONFIGURAZIONE OPTIMA

## ⚠️ PROBLEMI CRITICI RISOLTI

### 1. **DUPLICAZIONE URL API** - Il più critico!

**Problema:** L'app chiamava `/api/api/catalog/clients` invece di `/api/catalog/clients`

**Causa:** Build system usa **file .js** non .ts!

**File da controllare SEMPRE:**
```bash
app/src/lib/env.js  ← QUESTO viene usato in produzione!
app/src/lib/env.ts  ← Questo per development locale
```

**Configurazione corretta:**

```javascript
// ✅ CORRETTO per produzione
export const env = {
  backendUrl: 'https://optima-212r.onrender.com', // SENZA /api alla fine!
}

// ❌ SBAGLIATO
export const env = {
  backendUrl: 'https://optima-212r.onrender.com/api', // DUPLICA /api!
}
```

**Endpoint usano già il prefisso `/api`:**
- `/api/catalog/clients`
- `/api/catalog/suppliers` 
- `/api/catalog/raw-materials`

---

### 2. **JWT CLAIMS PROBLEM** - Row Level Security

**Problema:** Utenti non potevano creare elementi (clienti, fornitori, ecc.)

**Causa:** RLS policies non trovavano `org_id` e `role` nei JWT claims

**Soluzione critica applicata:**

```sql
-- File: supabase/migrations/0005_fix_jwt_claims.sql
-- Questo file DEVE essere applicato nel SQL Editor di Supabase
```

**Funzioni SQL aggiornate:**
- `current_org_id()` - ora legge da tabella `profiles`  
- `current_org_role()` - ora legge da tabella `profiles`
- `get_user_context()` - nuova funzione helper

---

## 🔧 CHECKLIST DEPLOYMENT

### **Prima di ogni deploy:**

1. ✅ **Verifica entrambi i file env:**
   ```bash
   app/src/lib/env.js  # Produzione - backendUrl senza /api
   app/src/lib/env.ts  # Development - backendUrl con /api per proxy locale
   ```

2. ✅ **Applica fix SQL se nuovo utente:**
   - Supabase Dashboard → SQL Editor
   - Eseguire i fix dei metadata utente

3. ✅ **Test endpoint dopo deploy:**
   ```bash
   curl -I https://optima-212r.onrender.com/api/health
   ```

### **Durante il deploy:**

1. ✅ **Osservare Render logs** per errori TypeScript
2. ✅ **Hard refresh browser** dopo deploy completato
3. ✅ **Logout/login** per nuovi JWT token

### **Debugging problemi:**

1. ✅ **F12 → Console:** Cercare errori 404 = problema URL API
2. ✅ **F12 → Network:** Identificare problemi RLS (403/401)
3. ✅ **Supabase SQL Editor:** Testare funzioni `current_org_id()`

---

## 🏗️ ARCHITETTURA MULTI-TENANT

**Configurazione attuale:** Single-tenant (una sola organizzazione)

**Assunzioni:**
- Tutti gli utenti appartengono a `org_id: '00000000-0000-0000-0000-000000000001'`
- Registrazione hardcoded con questa organizazione
- RLS policies garantiscono isolamento (futuro-proof)

**Flusso utenti:**
1. Registrazione → `profiles` con org_id default
2. Trigger SQL → `auth.users` metadata sincronizzati  
3. RLS policies → accesso solo ai dati della propria org
4. App → tutte le operazioni filtrano per `current_org_id()`

---

## 🔐 RUOLI E PERMESSI

| Ruolo | Creare | Modificare | Eliminare | Gestire Utenti |
|-------|--------|------------|-----------|----------------|
| **Owner** | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ❌ |
| **Editor** | ✅ | ✅ | ❌ | ❌ |
| **Viewer** | ❌ | ❌ | ❌ | ❌ |

**Implementazione:** Politiche RLS in `supabase/policies.sql`

---

## 🚨 ERRORI COMUNI

### **Errore 404 - "Failed to load resource"**
**Soluzione:** Controllare duplicazione `/api` negli URL

### **Errore API Key**  
**Soluzione:** Problema JWT claims, applicare fix SQL

### **Errore 403 Unauthorized**
**Soluzione:** 
1. Logout/login per refresh token
2. Verificare che utente abbia profilo in `profiles` 
3. Controllare che metadata `auth.users` siano sincronizzati

---

## 📁 FILE CRITICI DA NON MODIFICARE DISATTENTAMENTE

```
backend/src/middleware/auth.ts     # Gestione authentication
app/src/lib/env.js                 # URL produzione (NO /api!)
app/src/lib/env.ts                 # URL development (HA /api per proxy)
supabase/migrations/0005_fix_jwt_claims.sql  # Fix RLS
supabase/policies.sql              # Row Level Security
app/src/features/catalog/api.ts    # Endpoint API paths
```

---

## 🧪 TEST AFTER DEPLOYMENT

```bash
# 1. Test health endpoint
curl https://optima-212r.onrender.com/api/health

# 2. Test catalog endpoints (dovrebbero dare 401 senza auth, non 404)
curl https://optima-212r.onrender.com/api/catalog/clients

# 3. Nel browser: F12 → Console per errori JavaScript
# 4. Nel browser: F12 → Network per errori HTTP
```

---

## 💡 LEZIONI IMPARATE

1. **Build system usa file .js non .ts** per configurazione produzione
2. **RLS policies contano su JWT claims** che vanno sincronizzati manualmente  
3. **URL duplicazione** è il problema #1 di deployment
4. **Logout/login è obbligatorio** dopo fix SQL per applicare nuovi JWT
5. **Render caching** può essere aggressivo - commit forzoso utile

**QUESTO È LO STATO STABLE DEL PROGETTO!** ✅

---

Ultimo aggiornamento: {{ date }}
Fix applicati: API URL duplication + JWT Claims synchronization
Status: FUNZIONANTE ✅
