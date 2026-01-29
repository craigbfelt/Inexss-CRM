-- Migration: Fix Signup Row-Level Security Policy Issue
-- 
-- PROBLEM: Users get "new row violates row-level security policy" when signing up
-- because the INSERT policy requires auth.uid() = id, but the profile creation
-- happens in a context where this might not be satisfied.
--
-- SOLUTION: Create a database trigger that automatically creates user profiles
-- when a new auth.users record is created. The trigger function uses SECURITY DEFINER
-- to bypass RLS policies, ensuring profile creation succeeds.
--
-- This migration is idempotent (safe to run multiple times).

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a function to handle new user creation
-- SECURITY DEFINER allows this function to bypass RLS policies
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert a new user profile into public.users
  -- Use INSERT ... ON CONFLICT to handle race conditions
  INSERT INTO public.users (id, email, name, role, location, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff'),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Other'),
    true
  )
  ON CONFLICT (id) DO NOTHING;  -- Don't update if already exists
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions to the authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;

-- Verify the trigger was created
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE NOTICE 'Trigger "on_auth_user_created" created successfully';
  ELSE
    RAISE EXCEPTION 'Failed to create trigger "on_auth_user_created"';
  END IF;
END $$;
