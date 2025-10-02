-- Fix Existing User Metadata
-- This script ensures all existing users have proper metadata set

-- First, update auth.users metadata for all users with profiles
UPDATE auth.users 
SET 
  raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object(
    'org_id', p.org_id::text,
    'role', p.role,
    'full_name', p.full_name
  )
FROM profiles p
WHERE auth.users.id = p.user_id;

-- Create any missing profiles for users without them
INSERT INTO profiles (user_id, org_id, role, full_name)
SELECT 
  u.id,
  '00000000-0000-0000-0000-000000000001'::uuid as org_id,
  COALESCE(
    (u.raw_user_meta_data ->> 'role')::text, 
    'viewer'
  ) as role,
  COALESCE(
    (u.raw_user_meta_data ->> 'full_name')::text,
    u.email,
    'User'
  ) as full_name
FROM auth.users u
LEFT JOIN profiles p ON p.user_id = u.id
WHERE p.id IS NULL;

-- Update metadata again for newly created profiles
UPDATE auth.users 
SET 
  raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object(
    'org_id', p.org_id::text,
    'role', p.role,
    'full_name', p.full_name
  )
FROM profiles p
WHERE auth.users.id = p.user_id;

-- Verify results
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data,
  p.org_id,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON p.user_id = u.id
ORDER BY u.created_at;
