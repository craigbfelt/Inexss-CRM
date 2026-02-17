-- Quick Verification Script for Inexss CRM Setup
-- Run this script in Supabase SQL Editor to verify your setup is correct

-- =====================================================
-- 1. Check Database Schema
-- =====================================================
DO $$
DECLARE
  table_count INTEGER;
  expected_tables TEXT[] := ARRAY['users', 'brands', 'user_brand_access', 'clients', 'projects', 'project_brands', 'meetings', 'brand_discussions', 'action_items'];
  missing_tables TEXT[] := '{}';
  tbl TEXT;
BEGIN
  RAISE NOTICE '=== DATABASE SCHEMA CHECK ===';
  
  -- Count tables
  SELECT COUNT(*) INTO table_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name = ANY(expected_tables);
  
  -- Check for missing tables
  FOREACH tbl IN ARRAY expected_tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = tbl
    ) THEN
      missing_tables := array_append(missing_tables, tbl);
    END IF;
  END LOOP;
  
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE WARNING 'Missing tables: %', array_to_string(missing_tables, ', ');
    RAISE NOTICE 'Action: Run schema.sql to create missing tables';
  ELSE
    RAISE NOTICE '✓ All required tables exist (%/% tables)', table_count, array_length(expected_tables, 1);
  END IF;
END $$;

-- =====================================================
-- 2. Check RLS Status
-- =====================================================
DO $$
DECLARE
  rls_disabled_tables TEXT[] := '{}';
  tbl TEXT;
  expected_tables TEXT[] := ARRAY['users', 'brands', 'user_brand_access', 'clients', 'projects', 'project_brands', 'meetings', 'brand_discussions', 'action_items'];
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== ROW LEVEL SECURITY CHECK ===';
  
  -- Check each table for RLS
  FOREACH tbl IN ARRAY expected_tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename = tbl 
        AND rowsecurity = true
    ) THEN
      rls_disabled_tables := array_append(rls_disabled_tables, tbl);
    END IF;
  END LOOP;
  
  IF array_length(rls_disabled_tables, 1) > 0 THEN
    RAISE WARNING 'RLS not enabled on: %', array_to_string(rls_disabled_tables, ', ');
    RAISE NOTICE 'Action: Enable RLS on these tables or re-run schema.sql';
  ELSE
    RAISE NOTICE '✓ RLS enabled on all tables';
  END IF;
END $$;

-- =====================================================
-- 3. Check Trigger for Auto User Creation
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== AUTHENTICATION TRIGGER CHECK ===';
  
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE NOTICE '✓ Auto user creation trigger exists';
  ELSE
    RAISE WARNING 'Auto user creation trigger NOT found';
    RAISE NOTICE 'Action: Run migration_fix_signup_rls.sql';
  END IF;
END $$;

-- =====================================================
-- 4. Check RLS Policies
-- =====================================================
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== RLS POLICIES CHECK ===';
  
  -- Count policies on users table
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'users';
  
  IF policy_count > 0 THEN
    RAISE NOTICE '✓ Found % policies on users table', policy_count;
  ELSE
    RAISE WARNING 'No RLS policies found on users table';
    RAISE NOTICE 'Action: Run schema.sql or migration_fix_user_policies.sql';
  END IF;
  
  -- Check for problematic policies that might cause recursion
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' 
      AND tablename = 'users'
      AND policyname LIKE '%admin%'
  ) THEN
    RAISE WARNING 'Found admin-related policy - may cause recursion';
    RAISE NOTICE 'Action: Run migration_fix_user_policies.sql to fix';
  END IF;
END $$;

-- =====================================================
-- 5. Check Admin User
-- =====================================================
DO $$
DECLARE
  auth_user_exists BOOLEAN;
  profile_exists BOOLEAN;
  user_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== ADMIN USER CHECK ===';
  
  -- Check auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'craig@zerobitone.co.za'
  ) INTO auth_user_exists;
  
  -- Check public.users
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'craig@zerobitone.co.za'
  ) INTO profile_exists;
  
  IF auth_user_exists AND profile_exists THEN
    SELECT * INTO user_record FROM public.users WHERE email = 'craig@zerobitone.co.za';
    
    RAISE NOTICE '✓ Admin user exists in both auth.users and public.users';
    RAISE NOTICE '  - User ID: %', user_record.id;
    RAISE NOTICE '  - Name: %', user_record.name;
    RAISE NOTICE '  - Email: %', user_record.email;
    RAISE NOTICE '  - Role: %', user_record.role;
    RAISE NOTICE '  - Active: %', user_record.is_active;
    
    IF user_record.role != 'admin' THEN
      RAISE WARNING 'User role is not "admin"!';
      RAISE NOTICE 'Action: Run setup_admin_user.sql to fix';
    END IF;
  ELSIF auth_user_exists AND NOT profile_exists THEN
    RAISE WARNING 'User exists in auth.users but not in public.users';
    RAISE NOTICE 'Action: Run setup_admin_user.sql to create profile';
  ELSIF NOT auth_user_exists THEN
    RAISE WARNING 'Admin user does NOT exist';
    RAISE NOTICE 'Action: Create user in Supabase Dashboard then run setup_admin_user.sql';
    RAISE NOTICE 'Steps:';
    RAISE NOTICE '  1. Go to Authentication > Users';
    RAISE NOTICE '  2. Click "Add user"';
    RAISE NOTICE '  3. Email: craig@zerobitone.co.za';
    RAISE NOTICE '  4. Set a secure password';
    RAISE NOTICE '  5. Enable "Auto Confirm User"';
    RAISE NOTICE '  6. Run setup_admin_user.sql';
  END IF;
END $$;

-- =====================================================
-- 6. Check Email Confirmation Status
-- =====================================================
DO $$
DECLARE
  user_confirmed BOOLEAN;
  user_id UUID;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== EMAIL CONFIRMATION CHECK ===';
  
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'craig@zerobitone.co.za') THEN
    SELECT id, email_confirmed_at IS NOT NULL INTO user_id, user_confirmed
    FROM auth.users 
    WHERE email = 'craig@zerobitone.co.za';
    
    IF user_confirmed THEN
      RAISE NOTICE '✓ Admin user email is confirmed';
    ELSE
      RAISE WARNING 'Admin user email NOT confirmed!';
      RAISE NOTICE 'Action: In Supabase Dashboard > Authentication > Users';
      RAISE NOTICE '  1. Click on craig@zerobitone.co.za';
      RAISE NOTICE '  2. Click "Confirm email"';
      RAISE NOTICE 'OR disable email confirmation in Auth settings for development';
    END IF;
  END IF;
END $$;

-- =====================================================
-- 7. Summary and Next Steps
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== VERIFICATION COMPLETE ===';
  RAISE NOTICE '';
  RAISE NOTICE 'If all checks passed:';
  RAISE NOTICE '  1. Set up .env file with Supabase credentials';
  RAISE NOTICE '  2. Run: npm install';
  RAISE NOTICE '  3. Run: npm run dev';
  RAISE NOTICE '  4. Test login at http://localhost:3000/login';
  RAISE NOTICE '';
  RAISE NOTICE 'If any checks failed, follow the actions listed above.';
  RAISE NOTICE 'See SETUP_GUIDE.md for detailed instructions.';
END $$;
