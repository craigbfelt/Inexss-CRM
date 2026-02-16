import supabaseClient from '../lib/supabaseClient';

export const userService = {
  // Get user profile from public.users table
  getUserProfile: async (userId) => {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabaseClient
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update last login timestamp
  updateLastLogin: async (userId) => {
    const { error } = await supabaseClient
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get users by role
  getUsersByRole: async (role) => {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('role', role)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get users by location
  getUsersByLocation: async (location) => {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('location', location)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
