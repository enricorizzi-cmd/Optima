# SOLUZIONE: Problema API Key per Creazione Entità

## 🔍 PROBLEMA IDENTIFICATO

Il problema che impedisce la creazione di clienti, fornitori, materie prime ecc. NON è un problema di API key, ma un **problema di Row Level Security (RLS)** e **JWT Claims** in Supabase.

### Root Cause
1. **Le politiche RLS** in Supabase contano su `current_org_id()` e `current_org_role()`
2. **Queste funzioni** leggono da `request.jwt.claims.org_id` e `request.jwt.claims.role`
3. **Ma il token JWT** non contiene questi claims automaticamente
4. **Il risultato**: L'utente si può autenticare (login funziona) ma non può fare operazioni CRUD

### Evidenza Tecnica
- ✅ Login funziona (autenticazione base OK)
- ❌ Creazione/modifica entità fallisce (problema RLS)
- 🔍 Backend usa `supabaseAdmin` ma frontend non riesce ad accedere ai dati

## 🛠️ SOLUZIONE COMPLETA

### 1. Applicare la Migration SQL (PRIMO - CRITICO)

Eseguire questa migration nel database Supabase:

```bash
# File: supabase/migrations/0005_fix_jwt_claims.sql
# Questo file crea trigger e funzioni per sincronizzare i metadata utente
```

**Per applicare:**
1. Andare nel dashboard Supabase → SQL Editor
2. Copiare e incollare tutto il contenuto di `supabase/migrations/0005_fix_jwt_claims.sql`
3. Eseguire il comando

### 2. Correggere i Metadata Utente Esistenti

Eseguire questo script SQL per correggere tutti gli utenti esistenti:

```bash
# File: fix_user_metadata.sql
# Questo script aggiorna auth.users con i metadata corretti
```

### 3. Aggiornare il Backend (opzionale ma raccomandato)

Il file `backend/src/middleware/auth.ts` è già stato aggiornato per:
- Sincronizzare automaticamente profili utente
- Gestire meglio gli utenti senza profilo
- Risolvere organizzazioni da tabella `profiles`

### 4. Verificare la Configurazione

Eseguire lo script di test:

```powershell
# File: test_api_connection.ps1
# Testa la connettività e verifica se tutto funziona
```

## 🧪 TEST DELLA SOLUZIONE

### Prima della correzione:
1. ✅ Login funziona
2. ❌ Creato di clienti → errore "problema api key" 
3. ❌ Creato di fornitori → errore "problema api key"
4. ❌ Creato di materie prime → errore "problema api key"

### Dopo la correzione:
1. ✅ Login continua a funzionare
2. ✅ Creazione clienti dovrebbe funzionare
3. ✅ Creazione fornitori dovrebbe funzionare  
4. ✅ Creazione materie prime dovrebbe funzionare

## 📋 CHECKLIST DI IMPLEMENTAZIONE

### Passi Obbligatori:
- [ ] Eseguire migration `0005_fix_jwt_claims.sql`
- [ ] Eseguire script `fix_user_metadata.sql`
- [ ] Testare creazione di un cliente nell'app

### Passi Opzionali:
- [ ] Verificare connettività con `test_api_connection.ps1`
- [ ] Controllare logs del backend per eventuali errori
- [ ] Verificare tabella `profiles` per vedere se gli utenti hanno profili

## 🚨 IMPORTANTE

**NON** è un problema di:
- ❌ API Key Supabase (quella è corretta)
- ❌ Configurazione frontend (quella è corretta)
- ❌ Collegamento database (quello funziona)
- ❌ Schema tabelle (questo è allineato)

**È un problema di:**
- ✅ Row Level Security che non trova i claims JWT
- ✅ Metadata utente non sincronizzati

## 🔧 DETTAGLI TECNICI

### File Creati/Modificati:
1. `supabase/migrations/0005_fix_jwt_claims.sql` - NUOVO
2. `fix_user_metadata.sql` - NUOVO  
3. `test_api_connection.ps1` - NUOVO
4. `backend/src/middleware/auth.ts` - MODIFICATO

### Funzioni SQL Aggiunte:
- `get_user_context()` - Risolve org_id e role da tabella profiles
- `current_org_id()` - Aggiornata per usare profiles invece di JWT claims
- `current_org_role()` - Aggiornata per usare profiles invece di JWT claims
- `handle_user_profile_sync()` - Trigger per sincronizzare metadata

### Trigger SQL:
- `handle_profile_user_sync` - Mantiene auth.users sincronizzata con profiles

Questa soluzione è **backwards compatible** e risolverà il problema senza breaking changes.
