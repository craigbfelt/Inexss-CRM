-- Verification Script for Signup RLS Fix
-- Run this in Supabase SQL Editor to verify the fix is properly applied

-- =====================================================
-- 1. Check if the trigger function exists
-- =====================================================
SELECT 
  proname as function_name,
  prosecdef as is_security_definer,
  provolatile as volatility
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Expected: 1 row with is_security_definer = true

-- =====================================================
-- 2. Check if the trigger is created
-- =====================================================
SELECT 
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Expected: 1 row showing the trigger on auth.users, AFTER INSERT

-- =====================================================
-- 3. Verify RLS is enabled on users table
-- =====================================================
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';

-- Expected: rowsecurity = true

-- =====================================================
-- 4. Check RLS policies on users table
-- =====================================================
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- Expected policies:
-- - "Users can view their own data" (SELECT)
-- - "Users can create their own profile" (INSERT) 
-- - "Users can update their own profile" (UPDATE)

-- =====================================================
-- 5. Test the trigger function (optional, careful!)
-- =====================================================
-- WARNING: This will create a test user in your database
-- Only run if you want to actually test the trigger

-- Step 1: Check current users count
-- SELECT COUNT(*) FROM public.users;

-- Step 2: Create a test auth user (this will trigger the function)
-- Note: Use Supabase Dashboard > Authentication > Users > Add User instead
-- or use the app's signup page to test end-to-end

-- Step 3: Verify the profile was created
-- SELECT * FROM public.users WHERE email = 'test@example.com';

-- =====================================================
-- 6. Check for any conflicting or old triggers
-- =====================================================
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgrelid IN ('auth.users'::regclass, 'public.users'::regclass)
  AND tgname NOT LIKE 'pg_%'  -- Exclude system triggers
ORDER BY table_name, trigger_name;

-- Expected: Should see 'on_auth_user_created' on auth.users

-- =====================================================
-- 7. Verify permissions
-- =====================================================
SELECT 
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'users'
  AND grantee = 'authenticated'
ORDER BY privilege_type;

-- Expected: authenticated role should have necessary permissions

-- =====================================================
-- SUMMARY CHECK - Run this for a quick overview
-- =====================================================
DO $$
DECLARE
  v_function_exists BOOLEAN;
  v_trigger_exists BOOLEAN;
  v_rls_enabled BOOLEAN;
  v_policy_count INT;
BEGIN
  -- Check function
  SELECT EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user' AND prosecdef = true)
  INTO v_function_exists;
  
  -- Check trigger
  SELECT EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created')
  INTO v_trigger_exists;
  
  -- Check RLS
  SELECT rowsecurity FROM pg_tables WHERE tablename = 'users' AND schemaname = 'public'
  INTO v_rls_enabled;
  
  -- Check policies
  SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public'
  INTO v_policy_count;
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'SIGNUP RLS FIX VERIFICATION';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Function exists (with SECURITY DEFINER): %', v_function_exists;
  RAISE NOTICE 'Trigger exists: %', v_trigger_exists;
  RAISE NOTICE 'RLS enabled on users table: %', v_rls_enabled;
  RAISE NOTICE 'Number of policies on users table: %', v_policy_count;
  RAISE NOTICE '==========================================';
  
  IF v_function_exists AND v_trigger_exists AND v_rls_enabled AND v_policy_count >= 3 THEN
    RAISE NOTICE 'Status: ✅ ALL CHECKS PASSED';
    RAISE NOTICE 'The signup RLS fix is properly installed.';
  ELSE
    RAISE NOTICE 'Status: ⚠️ SOME CHECKS FAILED';
    IF NOT v_function_exists THEN
      RAISE NOTICE '- Function handle_new_user is missing or not SECURITY DEFINER';
    END IF;
    IF NOT v_trigger_exists THEN
      RAISE NOTICE '- Trigger on_auth_user_created is missing';
    END IF;
    IF NOT v_rls_enabled THEN
      RAISE NOTICE '- RLS is not enabled on users table';
    END IF;
    IF v_policy_count < 3 THEN
      RAISE NOTICE '- Expected at least 3 policies, found %', v_policy_count;
    END IF;
    RAISE NOTICE 'Please run the migration: supabase/migration_fix_signup_rls.sql';
  END IF;
  RAISE NOTICE '==========================================';
END $$;
