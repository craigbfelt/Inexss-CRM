-- Inexss CRM - Supabase Database Schema
-- This schema migrates the MongoDB models to PostgreSQL for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
-- Note: Supabase Auth handles core authentication
-- This table extends the auth.users table with app-specific fields

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'brand_representative', 'contractor', 'supplier')),
  location TEXT DEFAULT 'Other' CHECK (location IN ('JHB', 'Cape Town', 'Durban', 'Other')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BRANDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER BRAND ACCESS (Many-to-Many relationship)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_brand_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, brand_id)
);

-- =====================================================
-- CLIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  type TEXT DEFAULT 'Architect' CHECK (type IN ('Architect', 'Developer', 'Contractor', 'Other')),
  email TEXT,
  phone TEXT,
  address_street TEXT,
  address_city TEXT,
  address_province TEXT,
  address_postal_code TEXT,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_number TEXT,
  description TEXT,
  location_street TEXT,
  location_city TEXT,
  location_province TEXT,
  status TEXT DEFAULT 'Lead' CHECK (status IN ('Lead', 'Quoted', 'In Progress', 'Completed', 'On Hold', 'Cancelled')),
  start_date TIMESTAMP WITH TIME ZONE,
  expected_completion_date TIMESTAMP WITH TIME ZONE,
  estimated_value NUMERIC(12, 2),
  notes TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROJECT BRANDS (Many-to-Many relationship)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.project_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, brand_id)
);

-- =====================================================
-- MEETINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  attendees TEXT[], -- Array of attendee names
  summary TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BRAND DISCUSSIONS (related to meetings)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.brand_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT false,
  notes TEXT,
  estimated_value NUMERIC(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACTION ITEMS (related to meetings)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES public.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_brands_name ON public.brands(name);
CREATE INDEX IF NOT EXISTS idx_brands_is_active ON public.brands(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_type ON public.clients(type);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON public.meetings(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_date ON public.meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_brand_discussions_meeting_id ON public.brand_discussions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_brand_discussions_brand_id ON public.brand_discussions(brand_id);
CREATE INDEX IF NOT EXISTS idx_action_items_meeting_id ON public.action_items(meeting_id);
CREATE INDEX IF NOT EXISTS idx_action_items_assigned_to ON public.action_items(assigned_to);

-- =====================================================
-- TRIGGERS for updated_at timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON public.action_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_brand_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Brands table policies
CREATE POLICY "Anyone authenticated can view active brands" ON public.brands
  FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage brands" ON public.brands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Clients table policies
CREATE POLICY "Authenticated users can view clients" ON public.clients
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff and admin can create clients" ON public.clients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff and admin can update clients" ON public.clients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can delete clients" ON public.clients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Projects table policies  
CREATE POLICY "Authenticated users can view projects" ON public.projects
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff and admin can create projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff and admin can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Meetings table policies
CREATE POLICY "Authenticated users can view meetings" ON public.meetings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff and admin can create meetings" ON public.meetings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'brand_representative')
    )
  );

CREATE POLICY "Staff and admin can update meetings" ON public.meetings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'brand_representative')
    )
  );

CREATE POLICY "Admins can delete meetings" ON public.meetings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Related tables policies (simplified for now)
CREATE POLICY "Authenticated users can view user_brand_access" ON public.user_brand_access
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view project_brands" ON public.project_brands
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view brand_discussions" ON public.brand_discussions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view action_items" ON public.action_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow staff to manage related data
CREATE POLICY "Staff can manage project_brands" ON public.project_brands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff can manage brand_discussions" ON public.brand_discussions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'brand_representative')
    )
  );

CREATE POLICY "Staff can manage action_items" ON public.action_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'staff', 'brand_representative')
    )
  );
