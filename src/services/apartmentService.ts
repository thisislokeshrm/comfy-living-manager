
import { Apartment } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const fetchApartments = async () => {
  const { data, error } = await supabase
    .from('apartments')
    .select('*');
  
  if (error) {
    console.error('Error fetching apartments:', error);
    throw error;
  }
  
  return data as Apartment[];
};

export const getApartmentById = (apartments: Apartment[], id: string) => {
  return apartments.find(apt => apt.id === id);
};

export const getApartmentsByStatus = (apartments: Apartment[], status: 'empty' | 'booked') => {
  return apartments.filter(apt => apt.status === status);
};
