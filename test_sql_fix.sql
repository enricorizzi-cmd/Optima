-- Test per verificare se i fix sono stati applicati correttamente
-- Eseguire questo nel SQL Editor di Supabase

-- 1. Verificare che le funzioni esistano
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('current_org_id', 'current_org_role', 'get_user_context');

-- 2. Testare la funzione current_org_id con un utente
SELECT 
  auth.uid() as current_user_id,
  public.current_org_id() as resolved_org_id,
  public.current_org_role() as resolved_role;

-- 3. Verificare che il profilo utente esista e sia corretto
SELECT 
  p.user_id,
  p.org_id, 
  p.role,
  p.full_name
FROM profiles p
WHERE p.user_id = auth.uid();

-- 4. Verificare metadata auth.users
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data
FROM auth.users u 
WHERE u.id = auth.uid();
