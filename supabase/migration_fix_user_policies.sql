-- Migration: Fix User RLS Policies to Allow Profile Creation
-- This migration adds the missing INSERT and UPDATE policies for users table
-- to allow authenticated users to create and update their own profiles
-- while preventing privilege escalation

-- Drop existing policies to make migration idempotent
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- Create new policies
CREATE POLICY "Users can create their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
    AND is_active = (SELECT is_active FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
