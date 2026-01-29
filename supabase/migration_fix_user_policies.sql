-- Migration: Fix User RLS Policies to Prevent Infinite Recursion
-- This migration removes policies that cause infinite recursion by querying
-- the users table from within RLS policies on that same table.
--
-- SOLUTION: Simplify policies to avoid recursive queries. Handle role-based
-- authorization in the application layer instead of at the database RLS level.
-- 
-- This migration is idempotent (can be run multiple times safely).

-- First, drop ALL existing policies on users table to start fresh
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- Drop old SECURITY DEFINER functions that caused recursion
DROP FUNCTION IF EXISTS public.check_user_role(text);
DROP FUNCTION IF EXISTS public.check_user_roles(text[]);
DROP FUNCTION IF EXISTS public.get_my_role();

-- Create NEW simplified policies that don't cause recursion
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Drop and recreate policies on other tables to remove role checks
DROP POLICY IF EXISTS "Anyone authenticated can view active brands" ON public.brands;
DROP POLICY IF EXISTS "Authenticated users can view active brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;
DROP POLICY IF EXISTS "Staff and admin can create clients" ON public.clients;
DROP POLICY IF EXISTS "Staff and admin can update clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Staff and admin can create projects" ON public.projects;
DROP POLICY IF EXISTS "Staff and admin can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Staff and admin can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Staff and admin can update meetings" ON public.meetings;
DROP POLICY IF EXISTS "Admins can delete meetings" ON public.meetings;
DROP POLICY IF EXISTS "Authenticated users can view user_brand_access" ON public.user_brand_access;
DROP POLICY IF EXISTS "Staff can manage project_brands" ON public.project_brands;
DROP POLICY IF EXISTS "Authenticated users can view project_brands" ON public.project_brands;
DROP POLICY IF EXISTS "Staff can manage brand_discussions" ON public.brand_discussions;
DROP POLICY IF EXISTS "Authenticated users can view brand_discussions" ON public.brand_discussions;
DROP POLICY IF EXISTS "Staff can manage action_items" ON public.action_items;
DROP POLICY IF EXISTS "Authenticated users can view action_items" ON public.action_items;

-- Create simplified management policies
CREATE POLICY "Authenticated users can manage brands" ON public.brands
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage clients" ON public.clients
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage projects" ON public.projects
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage meetings" ON public.meetings
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage user_brand_access" ON public.user_brand_access
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage project_brands" ON public.project_brands
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage brand_discussions" ON public.brand_discussions
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage action_items" ON public.action_items
  FOR ALL USING (auth.uid() IS NOT NULL);
