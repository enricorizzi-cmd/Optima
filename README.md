# Optima Production Suite

Optima Production Suite e una web app PWA per gestire anagrafiche, ordini clienti, pianificazione produzione, avanzamento e consegne in ambienti multi-tenant. L'architettura e full TypeScript (React + Vite sul frontend, Fastify sul backend) con Supabase Postgres per dati/Auth e render-ready deploy.

## Struttura repository

```
.
- app/                # Frontend React + Vite (Tailwind, shadcn-style UI, React Query)
- backend/            # API Fastify + Supabase service layer
- supabase/           # Migrazioni, RLS e seed Postgres
- docs/adr/           # Decisioni architetturali
- PROJECT_INSTRUCTIONS.md
- ... config vari (eslint, prettier, nvm, ecc.)
```

## Prerequisiti

- Node.js 20 (vedi `.nvmrc`)
- npm >= 9 (workspaces) oppure pnpm (opzionale con modifiche)
- Supabase CLI (per applicare migrazioni) oppure accesso SQL alla istanza
- VAPID key pair (`web-push generate-vapid-keys`) per notifiche push

## Setup rapido

Per avviare l'app in locale segui questi passi (una volta sola dove indicato):

### 1. Installa prerequisiti
- Node 20 (vedi `.nvmrc`)
- npm ≥ 9
- Supabase CLI se vuoi applicare le migrazioni localmente
- Coppia di chiavi VAPID (`web-push generate-vapid-keys`)

### 2. Installa dipendenze
```bash
# Dentro c:\Optima esegui npm install per installare tutte le dipendenze dei workspace
npm install
```

### 3. Configura variabili d'ambiente
I file `.env` sono già presenti con le chiavi reali configurate. Se necessario, modifica i valori in:
- `backend/.env` (SUPABASE_URL, SUPABASE_SERVICE_ROLE, SUPABASE_ANON_KEY, chiavi VAPID)
- `app/.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_BACKEND_URL, VITE_VAPID_PUBLIC_KEY)

### 4. Database (se usi un Supabase locale/di prova)
```bash
# Applica migrazioni e seed
supabase db push --file supabase/migrations/0001_init.sql
supabase db query -f supabase/policies.sql
supabase db query -f supabase/seed.sql
```

> **Backup & restore**: pianifica `pg_dump` giornalieri della base dati e conserva copie su storage esterno. Verifica mensilmente il ripristino su ambiente di staging prima di aggiornare la produzione.

### 5. Avvia l'applicazione

**Opzione A: Sviluppo locale**
```bash
# Avvia il backend (porta 4000)
npm run dev -w backend

# In un altro terminale, avvia il frontend (porta 5173)
npm run dev -w app
```

**Opzione B: Docker**
```bash
# Test del backend con Docker (richiede Docker installato)
docker-compose up backend

# Oppure build manuale
cd backend
docker build -t optima-backend .
docker run -p 4000:4000 \
  -e NODE_ENV=production \
  -e SUPABASE_URL=https://tvpymdbfqmtvlbvxqxwg.supabase.co \
  -e SUPABASE_SERVICE_ROLE=$your_service_role_key \
  -e SUPABASE_ANON_KEY=$your_service_role_key \
  optima-backend
```

L'interfaccia sarà disponibile su `http://localhost:5173`. Effettua il login con un utente creato su Supabase e assicurati che i metadati includano `org_id` e `role` coerenti con le RLS.

### 6. Verifica (opzionale)
Se vuoi verificare che tutto giri bene, puoi lanciare:
```bash
npm run lint
```

### Comandi principali

| Descrizione             | Comando                                         |
|-------------------------|--------------------------------------------------|
| Lint globale            | `npm run lint`                                  |
| Test frontend (Vitest)  | `npm run test -w app`                           |
| Test backend (Vitest)   | `npm run test -w backend`                       |
| Build completa          | `npm run build`                                 |

## Funzionalita disponibili (alpha)

- Gestione anagrafiche da catalogo con moduli dedicati per clienti e materie prime (crea/aggiorna, validazione).
- Creazione ordini clienti dalla dashboard ordini con linee prodotto multiple, priorita e note.
- Aggiornamento stato ordini, schedulazioni, consegne e feedback in tempo reale tramite toast PWA.

## Supabase & sicurezza

- Tutte le tabelle business espongono `org_id` e RLS basate sulle funzioni `current_org_id()`/`current_org_role()`.
- Ruoli supportati: `owner`, `admin`, `editor`, `viewer`. Solo `owner/admin/editor` possono scrivere sui dati core.
- `push_subscriptions` limita l'accesso al proprietario della subscription.
- `customer_orders_view` aggrega le righe ordine rispettando le policy sottostanti.

Per nuove tabelle: aggiungi migrazione, abilita RLS, aggiorna `supabase/policies.sql` e prevedi seed se necessari.

## PWA & notifiche

- `app/public/manifest.webmanifest` definisce palette, start URL (`/?utm_source=pwa`) e icone maskable 192/512.
- `app/public/sw.js` implementa cache-first sugli asset statici e network-first sulle API con fallback `offline.html`.
- Registrazione push: dalla dashboard attiva le notifiche (richiede VAPID public key nel frontend). Backend gestisce `POST /api/push/subscribe` e `POST /api/push/test` via `web-push`.
- iOS/iPadOS 16.4+: ricorda agli utenti di aggiungere l'app alla Home per ricevere push (messaggio presente nella dashboard).

## Stato Deploy su Render

✅ **Frontend**: DEPLOYATO E LIVE 
   - URL: https://optima-production-frontend.onrender.com
   - Status: Live e funzionante

✅ **Database Postgres**: ATTIVO
   - ID: `dpg-d3f75j95pdvs73cjc3a0-a`  
   - Regione: Frankfurt
   - Status: Available

🟡 **Backend**: DA COMPLETARE
   - Richiede configurazione manuale tramite dashboard Render
   - Usa Dockerfile incluso in `backend/Dockerfile`

### Completare il Backend su Render

1. **Vai su**: https://dashboard.render.com/web/new
2. **Configurazione**:
   - Repository: `https://github.com/enricorizzi-cmd/Optima.git`
   - Branch: `main`
   - Environment: Docker
   - Dockerfile Path: `backend/Dockerfile`
   - Region: Frankfurt
   - Plan: Starter (richiede carta di credito)

3. **Variabili d'Ambiente Richieste**:
```
NODE_ENV=production
PORT=4000
SUPABASE_URL=https://tvpymdbfqmtvlbvxqxwg.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cHltZGJmcW10dmxidnlxeHdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMwMzgzMCwiZXhwIjoyMDYyODc5ODMwfQ.amW7yZX8YjF4CQHYzK5FhX5gvN8HnDKlRqLZnGvNpQs
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cHltZGJmcW10dmxidnlxeHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDM4MzAsImV4cCI6MjA2Mjg3OTgzMH0.tO_VmjF4hS_jz3E-wTkQl-R-qZxQZj7mGfS-OVQw8Ac
CORS_ORIGIN=https://optima-production-frontend.onrender.com
```

4. **Health Check**: `/health` (configurare nel dashboard)
5. **Auto-Deploy**: Abilita dal branch `main`

CI suggerita:
- Install -> lint -> test (frontend/backend) -> build.
- Genera e carica sourcemap su Sentry in step separato.
- Blocca merge se mancano migrazioni o lint/test falliscono.

## Test & qualita

- **Unit test**: Vitest per frontend/backend (`npm run test -w app|backend`).
- **E2E**: predisposto Playwright (`npm run test:e2e -w app`) - definire scenari core (es. creazione ordine -> programmazione -> avanzamento -> consegna) prima del go-live.
- **Lighthouse**: mira >= 90 su Performance/Best/A11y/SEO. Usa `npm run build -w app` + `npm run preview -w app` e audita con Chrome DevTools.

## Note operative

- Usa branch `codex/<feature>` e Conventional Commits (`feat:`, `fix:`...).
- Nessun secret nel client o nel repo. Variabili sensibili solo via ENV/Render dashboard.
- Per nuovi moduli documenta brevi ADR (`docs/adr/*`) e aggiorna CHANGELOG seguendo SemVer.
- Aggiorna `PROJECT_INSTRUCTIONS.md` se nascono nuovi standard trasversali.

## Checklist rapida prima di rilasciare

- [ ] Migrazioni applicate + backup programmati + restore testato.
- [ ] Lint/Test/Build verdi (Frontend & Backend).
- [ ] Manifest PWA e service worker aggiornati; push test OK.
- [ ] RLS/policies riviste per ogni tabella modificata.
- [ ] Documentazione env & deploy aggiornate.
- [ ] Nessun secret o dato sensibile nel diff.
