// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tdmpxkwxydvtdrzgooty.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbXB4a3d4eWR2dGRyemdvb3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NTE2NTksImV4cCI6MjA1NzQyNzY1OX0.iiJb8Voi21bzim3Cu4nHZlkrGtjZ0oRl57NYUTV1mFk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);