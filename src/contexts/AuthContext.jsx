import { createContext, useContext, useEffect, useState } from 'react';
import { authService, userService } from '../services';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user profile from public.users table
  const fetchUserProfile = async (userId) => {
    try {
      const profile = await userService.getUserProfile(userId);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (credentials) => {
    const { user: newUser } = await authService.signUp(credentials);
    if (newUser) {
      await fetchUserProfile(newUser.id);
    }
    return newUser;
  };

  const signIn = async (credentials) => {
    const { user: signedInUser } = await authService.signIn(credentials);
    if (signedInUser) {
      await userService.updateLastLogin(signedInUser.id);
      await fetchUserProfile(signedInUser.id);
    }
    return signedInUser;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setUserProfile(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
