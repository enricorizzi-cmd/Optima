# ADR 001: Architettura di riferimento

## Contesto
L'applicazione deve gestire anagrafiche, ordini clienti, pianificazione, avanzamento produzione e consegne in un contesto multi-tenant con autenticazione Supabase. Requisiti non funzionali prioritari: PWA installabile con offline di base, notifiche push, performance elevate, sicurezza by default, stack low-cost (Render + Supabase).

## Decisione
Adottiamo un'architettura a tre livelli:
- **Frontend React/Vite** (TypeScript strict) con Tailwind, shadcn/ui e React Query per fetch/cache, Zustand opzionale per stato locale complesso. Il frontend comunica con Supabase Auth e backend REST, integra manifest e service worker custom per caching ibrido.
- **Backend Fastify** (TypeScript) che espone API REST sicure per tutte le entità (clienti, fornitori, materie prime, prodotti finiti, magazzini, operatori, giacenze, ordini, schedulazioni, avanzamento, consegne). Usa Supabase Service Role per query, Zod per validazione, Helmet/CORS/Rate limiting e log strutturati.
- **Supabase Postgres** con schema multi-tenant (campo `org_id` ovunque, owner opzionale), RLS attiva e policies per ruoli (`owner`, `admin`, `editor`, `viewer`). Migrazioni versionate e seed di base per ambienti di sviluppo.

## Conseguenze
- Possiamo distribuire frontend e backend come servizi separati su Render, con healthcheck dedicati.
- La complessità di orchestrare Supabase Auth richiede gestione dei token lato backend (verifica JWT) e lato frontend (sessione persistente con React Query + hooks personalizzati).
- Il service worker deve distinguere tra asset statici (cache-first) e API (network-first con fallback offline).
- Le nuove feature devono aggiungere migrazioni, policies e aggiornare la checklist PWA.
