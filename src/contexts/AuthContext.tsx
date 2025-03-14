
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';

// Mock data for demonstration
const mockUsers = [
  { id: '1', email: 'manager@example.com', name: 'Admin Manager', role: 'manager' as UserRole },
  { id: '2', email: 'tenant1@example.com', name: 'John Doe', role: 'tenant' as UserRole, apartment_id: '1' },
  { id: '3', email: 'tenant2@example.com', name: 'Jane Smith', role: 'tenant' as UserRole, apartment_id: '2' },
];

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
    const storedUser = localStorage.getItem('apartmentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we're not checking passwords
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      setUser(foundUser);
      localStorage.setItem('apartmentUser', JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error) {
      toast.error('Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Mock signup functionality
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        role,
      };
      
      // In a real app, we would save this to the database
      setUser(newUser);
      localStorage.setItem('apartmentUser', JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('apartmentUser');
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
