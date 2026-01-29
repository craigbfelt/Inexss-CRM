-- Migration: Fix User RLS Policies to Allow Profile Creation
-- This migration adds the missing INSERT and UPDATE policies for users table
-- to allow authenticated users to create and update their own profiles
-- while preventing privilege escalation
-- Also fixes infinite recursion by using SECURITY DEFINER functions

-- Create security definer functions to check user roles without triggering RLS
CREATE OR REPLACE FUNCTION public.check_user_role(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.check_user_role(text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.check_user_role(text) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.check_user_roles(required_roles text[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = ANY(required_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.check_user_roles(text[]) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.check_user_roles(text[]) FROM PUBLIC;

-- Drop existing policies to make migration idempotent
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Recreate the "Admins can view all users" policy with the function to avoid recursion
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.check_user_role('admin'));

-- Create new policies
CREATE POLICY "Users can create their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = OLD.role
    AND is_active = OLD.is_active
  );

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (public.check_user_role('admin'));
