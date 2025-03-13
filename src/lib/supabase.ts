
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
