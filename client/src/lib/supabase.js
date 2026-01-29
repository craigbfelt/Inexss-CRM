import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if environment variables are configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create a single supabase client for interacting with your database
// Use placeholder values if not configured to prevent import-time errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile (extended data from public.users table)
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Helper function to sign in
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Helper function to sign up
export const signUp = async (email, password, userData) => {
  // First create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData // metadata
    }
  });
  
  if (authError) throw authError;
  
  // Then create user profile in public.users table using upsert to handle race conditions
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .upsert([{
        id: authData.user.id,
        email: email,
        name: userData.name,
        role: userData.role || 'staff',
        location: userData.location || 'Other',
        is_active: true
      }], {
        onConflict: 'id',
        ignoreDuplicates: true  // Don't overwrite existing profiles, only create new ones
      });
    
    if (profileError) throw profileError;
  }
  
  return authData;
};

export default supabase;
