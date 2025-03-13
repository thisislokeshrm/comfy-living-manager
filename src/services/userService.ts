
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const fetchUsers = async (isManager: boolean) => {
  // Only managers can fetch all users
  if (!isManager) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  return data as User[];
};

export const createUser = async (user: Omit<User, 'id'>) => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: 'temporary-password', // This should be changed by the user later
      email_confirm: true,
    });
    
    if (authError || !authData.user) throw authError || new Error('Failed to create user');
    
    // Add to users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        apartment_id: user.apartment_id,
      });
    
    if (profileError) throw profileError;
    
    toast.success('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user');
    throw error;
  }
};

export const getUserById = (users: User[], id: string) => {
  return users.find(user => user.id === id);
};
