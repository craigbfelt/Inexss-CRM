'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, signIn, signOut, getUserProfile, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      setConfigError('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Failed to get session:', error);
      setConfigError('Failed to connect to authentication service. Please check your configuration.');
      setLoading(false);
    });

    // Listen for auth changes - only if configured
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const profile = await getUserProfile(userId);
      setUser(profile);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      
      // Only auto-create profile if the error is due to missing profile (no rows returned)
      // PostgREST returns PGRST116 for no rows, but we check for common patterns
      const isMissingProfile = 
        error.message?.includes('No rows') || 
        error.code === 'PGRST116' ||
        error.details?.includes('0 rows');
      
      if (!isMissingProfile) {
        // If it's a different error (network, permissions, etc), don't try to auto-create
        setUser(null);
        setLoading(false);
        return;
      }
      
      // If profile doesn't exist in public.users, try to get auth user info
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          // Auto-create profile for users who exist in auth.users but not in public.users
          console.log('Creating missing user profile for:', authUser.email);
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .upsert([{
              id: authUser.id,
              email: authUser.email,
              name: authUser.user_metadata?.name || authUser.email.split('@')[0],
              role: 'staff',
              location: authUser.user_metadata?.location || 'Other',
              is_active: true
            }], {
              onConflict: 'id'
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Failed to create user profile:', createError);
            setUser(null);
          } else {
            setUser(newProfile);
          }
        } else {
          setUser(null);
        }
      } catch (autoCreateError) {
        console.error('Failed to auto-create profile:', autoCreateError);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { user: authUser } = await signIn(email, password);
      
      // Update last login
      if (authUser) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', authUser.id);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, session, login, logout, configError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
