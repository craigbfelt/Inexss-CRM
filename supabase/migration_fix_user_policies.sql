-- Migration: Fix User RLS Policies to Allow Profile Creation
-- This migration adds the missing INSERT and UPDATE policies for users table
-- to allow authenticated users to create and update their own profiles

-- Drop existing policies that we're replacing
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- Create new policies
CREATE POLICY "Users can create their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );
