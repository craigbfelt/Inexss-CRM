-- Verification Script for RLS Infinite Recursion Fix
-- Run this in your Supabase SQL Editor to verify the fix is applied correctly

-- =====================================
-- CHECK 1: Verify Policies on Users Table
-- =====================================
-- Should show exactly 3 policies (no admin policies)

SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- ✅ Expected Result: 3 rows
-- - "Users can view their own data" (SELECT)
-- - "Users can create their own profile" (INSERT)
-- - "Users can update their own profile" (UPDATE)

-- ❌ Should NOT see:
-- - "Admins can view all users"
-- - "Admins can update users"


-- =====================================
-- CHECK 2: Verify Old Functions Are Removed
-- =====================================
-- Should return NO rows (old functions should be deleted)

SELECT 
  proname as function_name,
  prosecdef as security_definer
FROM pg_proc 
WHERE proname IN ('check_user_role', 'check_user_roles');

-- ✅ Expected Result: 0 rows (functions removed)
-- ❌ If you see rows, run:
-- DROP FUNCTION IF EXISTS public.check_user_role(text);
-- DROP FUNCTION IF EXISTS public.check_user_roles(text[]);


-- =====================================
-- CHECK 3: Verify New Helper Function Exists
-- =====================================
-- Should show the get_my_role function

SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proargtypes as argument_types
FROM pg_proc 
WHERE proname = 'get_my_role';

-- ✅ Expected Result: 1 row
-- - function_name: get_my_role
-- - security_definer: true


-- =====================================
-- CHECK 4: Verify Policies on Other Tables
-- =====================================
-- All other tables should have simple "authenticated users" policies

SELECT 
  tablename,
  COUNT(*) as policy_count,
  array_agg(policyname ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('brands', 'clients', 'projects', 'meetings')
GROUP BY tablename
ORDER BY tablename;

-- ✅ Expected Result: Each table should have 2-3 simple policies
-- All should check "auth.uid() IS NOT NULL" (no role-based checks)


-- =====================================
-- CHECK 5: Test Creating a User Profile
-- =====================================
-- This simulates what happens during signup
-- NOTE: Replace the UUID and email with a test value

-- First, check current authenticated user
SELECT auth.uid() as my_user_id;

-- If you're logged in, try to query your own record
-- This should work without infinite recursion
SELECT id, email, name, role 
FROM public.users 
WHERE id = auth.uid();

-- ✅ Expected Result: Your user record (no infinite recursion error)


-- =====================================
-- CHECK 6: Verify RLS is Enabled
-- =====================================
-- All tables should have RLS enabled

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'brands', 'clients', 'projects', 'meetings',
                     'user_brand_access', 'project_brands', 'brand_discussions', 'action_items')
ORDER BY tablename;

-- ✅ Expected Result: All tables should have rls_enabled = true


-- =====================================
-- SUMMARY
-- =====================================
-- If all checks pass:
-- ✅ The infinite recursion fix is correctly applied
-- ✅ Users can sign up and login without errors
-- ✅ Role-based authorization should be handled in the application layer

-- If any check fails:
-- ❌ Re-run the migration: supabase/migration_fix_user_policies.sql
-- ❌ Check the troubleshooting section in RLS_FIX_GUIDE.md
