import supabaseClient from '../lib/supabaseClient';

export const authService = {
  // Sign up a new user
  signUp: async ({ email, password, name, role = 'staff', location = 'Other' }) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          location,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabaseClient.auth.onAuthStateChange(callback);
  },

  // Reset password
  resetPassword: async (email) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  // Update password
  updatePassword: async (newPassword) => {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};
