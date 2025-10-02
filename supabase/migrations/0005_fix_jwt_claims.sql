-- Fix JWT Claims Issue
-- This migration fixes the issue where RLS policies can't access org_id and role
-- because they're not properly set in the JWT claims

-- Create a function to update user metadata with org_id and role from profiles
CREATE OR REPLACE FUNCTION public.handle_user_profile_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Update user metadata when profile is created or updated
  UPDATE auth.users 
  SET 
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'org_id', NEW.org_id::text,
      'role', NEW.role,
      'full_name', NEW.full_name
    )
  WHERE auth.users.id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to sync profile changes to user metadata
DROP TRIGGER IF EXISTS handle_profile_user_sync ON profiles;
CREATE TRIGGER handle_profile_user_sync
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_profile_sync();

-- Function to get current user's org_id and role from profiles table
-- (since the current function might not work with JWT claims)
CREATE OR REPLACE FUNCTION public.get_user_context()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_context jsonb;
BEGIN
  -- Get user's org_id and role from profiles table using current user
  SELECT jsonb_build_object(
    'org_id', p.org_id::text,
    'role', p.role
  )
  INTO user_context
  FROM profiles p
  WHERE p.user_id = auth.uid();
  
  RETURN COALESCE(user_context, '{}'::jsonb);
END;
$$;

-- Update the current helper functions to use profiles instead of JWT claims
CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS uuid AS $$
  SELECT (get_user_context() ->> 'org_id')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.current_org_role()
RETURNS text AS $$
  SELECT get_user_context() ->> 'role';
$$ LANGUAGE sql STABLE;

-- Force update existing users' metadata (run this once for existing users)
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN 
    SELECT p.user_id, p.org_id, p.role, p.full_name
    FROM profiles p
  LOOP
    -- Update the user's metadata
    UPDATE auth.users 
    SET 
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'org_id', rec.org_id::text,
        'role', rec.role,
        'full_name', rec.full_name
      )
    WHERE auth.users.id = rec.user_id;
  END LOOP;
END $$;
