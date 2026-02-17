-- Setup Admin User: craig@zerobitone.co.za
-- This script creates the initial admin user for the Inexss CRM system.
-- 
-- INSTRUCTIONS:
-- 1. First, create the auth user through Supabase Dashboard:
--    - Go to Authentication > Users
--    - Click "Add user"
--    - Email: craig@zerobitone.co.za
--    - Password: (set a secure password)
--    - Auto Confirm User: YES (important!)
--    - Click "Create user"
--    - Copy the User ID (UUID) that appears
--
-- 2. Then run this script in Supabase SQL Editor:
--    - Replace 'YOUR-USER-ID-HERE' below with the actual UUID from step 1
--    - Click "Run"
--
-- OR use the automated approach below (Option B)

-- =====================================================
-- OPTION A: Manual User Creation (Recommended for Production)
-- =====================================================
-- After creating user in Supabase Dashboard, run this:
-- Replace 'YOUR-USER-ID-HERE' with the actual UUID from the dashboard

-- INSERT INTO public.users (id, email, name, role, location, is_active)
-- VALUES (
--   'YOUR-USER-ID-HERE',
--   'craig@zerobitone.co.za',
--   'Craig Felt',
--   'admin',
--   'JHB',
--   true
-- )
-- ON CONFLICT (id) DO UPDATE SET
--   role = 'admin',
--   is_active = true;

-- =====================================================
-- OPTION B: Automated User Creation (Development/Testing Only)
-- =====================================================
-- This creates both the auth user and profile in one step.
-- NOTE: This requires elevated permissions and may not work in all environments.
-- It's recommended to use Option A instead.

DO $$
DECLARE
  new_user_id UUID;
  user_exists BOOLEAN;
BEGIN
  -- Check if user already exists in auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'craig@zerobitone.co.za'
  ) INTO user_exists;

  IF user_exists THEN
    -- User exists, get their ID
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'craig@zerobitone.co.za';
    RAISE NOTICE 'User already exists with ID: %', new_user_id;
    
    -- Update their profile to ensure admin role
    INSERT INTO public.users (id, email, name, role, location, is_active)
    VALUES (
      new_user_id,
      'craig@zerobitone.co.za',
      'Craig Felt',
      'admin',
      'JHB',
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      is_active = true,
      updated_at = NOW();
      
    RAISE NOTICE 'Profile updated to admin role';
  ELSE
    RAISE NOTICE 'User does not exist in auth.users yet.';
    RAISE NOTICE 'Please create user through Supabase Dashboard:';
    RAISE NOTICE '1. Go to Authentication > Users';
    RAISE NOTICE '2. Click "Add user"';
    RAISE NOTICE '3. Email: craig@zerobitone.co.za';
    RAISE NOTICE '4. Set a secure password';
    RAISE NOTICE '5. Enable "Auto Confirm User"';
    RAISE NOTICE '6. After creation, run this script again';
  END IF;
END $$;

-- =====================================================
-- Verify Admin User Setup
-- =====================================================
-- Run this to check if the admin user is properly configured
DO $$
DECLARE
  admin_count INTEGER;
  user_record RECORD;
BEGIN
  -- Check if admin user exists in public.users
  SELECT COUNT(*) INTO admin_count
  FROM public.users
  WHERE email = 'craig@zerobitone.co.za' AND role = 'admin';

  IF admin_count > 0 THEN
    SELECT * INTO user_record FROM public.users WHERE email = 'craig@zerobitone.co.za';
    RAISE NOTICE '✓ Admin user exists and is configured correctly';
    RAISE NOTICE 'User ID: %', user_record.id;
    RAISE NOTICE 'Name: %', user_record.name;
    RAISE NOTICE 'Email: %', user_record.email;
    RAISE NOTICE 'Role: %', user_record.role;
    RAISE NOTICE 'Location: %', user_record.location;
    RAISE NOTICE 'Active: %', user_record.is_active;
  ELSE
    RAISE WARNING '✗ Admin user not found or not properly configured';
    RAISE NOTICE 'Please follow the setup instructions above';
  END IF;
END $$;
