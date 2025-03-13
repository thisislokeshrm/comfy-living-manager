
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const getInitialSession = async () => {
      setIsLoading(true);
      
      // Check for an active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get user profile data
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user data:', error);
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(userData as User);
        }
      }
      
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get user profile data
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!error) {
          setUser(userData as User);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        throw signInError;
      }
      
      // User data is fetched in the auth state change listener
      toast.success(`Welcome back!`);
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Register the user with Supabase Auth
      const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError || !authUser) {
        throw signUpError || new Error('Failed to create account');
      }
      
      // Create user profile in the users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email,
          name,
          role,
        });
      
      if (profileError) {
        // Clean up the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authUser.id);
        throw profileError;
      }
      
      // Set the user context
      const newUser: User = {
        id: authUser.id,
        email,
        name,
        role,
      };
      
      setUser(newUser);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.info('You have been signed out');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
