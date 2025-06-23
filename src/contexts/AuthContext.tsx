import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setIsLoading(false);
          return;
        }

        if (session?.user && mounted) {
          await fetchUserProfile(session.user.id);
        } else if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Add timeout to prevent infinite loading - increased to 10 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );

      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (error) {
        if (error.code === 'PGRST116') {
          // User profile doesn't exist, this might be a new user
          console.log('User profile not found, might be a new user');
        } else {
          throw error;
        }
      }

      if (data) {
        setUser({
          id: data.id,
          username: data.username,
          discordId: data.discord_id,
          role: data.role,
          ownedPlayerId: data.owned_player_id,
          createdAt: new Date(data.created_at),
        });
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      // Don't keep loading forever if there's an error
      if (error.message !== 'Profile fetch timeout') {
        // For other errors, we might still want to keep the user logged in
        // but without profile data
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        setIsLoading(false);
        return { success: false, error: 'Username is already taken' };
      }

      // Sign up the user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (error) throw error;

      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      
      // Provide more specific error messages
      if (error.message?.includes('already registered')) {
        return { success: false, error: 'An account with this email already exists' };
      } else if (error.message?.includes('Password')) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      } else if (error.message?.includes('Email')) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      return { success: false, error: error.message || 'Failed to create account' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid email or password' };
      } else if (error.message?.includes('Email not confirmed')) {
        return { success: false, error: 'Please check your email and confirm your account' };
      }
      
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signUp,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}