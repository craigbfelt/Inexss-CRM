import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, signIn, signOut, signUp, getUserProfile, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      setConfigError('Missing Supabase configuration. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY environment variables.');
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
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
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
              onConflict: 'id',
              ignoreDuplicates: false
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

  const register = async (userData) => {
    try {
      // Sign up the user - this will create profile in both auth.users and public.users
      await signUp(userData.email, userData.password, {
        name: userData.name,
        location: userData.location
      });
      
      return {
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create account'
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
    <AuthContext.Provider value={{ user, loading, session, login, register, logout, configError }}>
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
