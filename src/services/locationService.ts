
import { Location } from '@/types';
import { supabase } from '@/lib/supabase';

export const fetchLocations = async () => {
  const { data, error } = await supabase
    .from('locations')
    .select('*');
  
  if (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
  
  // Transform the data to match our Location interface
  const transformedLocations = data.map(loc => ({
    ...loc,
    coordinates: { x: loc.coordinates_x, y: loc.coordinates_y }
  })) as unknown as Location[];
  
  return transformedLocations;
};
