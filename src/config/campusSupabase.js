import { createClient } from '@supabase/supabase-js';

/**
 * Dedicated Supabase Client for campus.lumixora.in (Lumixora Campus)
 * 
 * To connect your new isolated Supabase project:
 * Option A: Add to your .env file:
 *   VITE_CAMPUS_SUPABASE_URL=https://your-new-project-ref.supabase.co
 *   VITE_CAMPUS_SUPABASE_ANON_KEY=your-new-anon-key
 * 
 * Option B: Paste your project URL and Anon key in the fallback fields below.
 */

const CAMPUS_PROJECT_URL = 
  import.meta.env.VITE_CAMPUS_SUPABASE_URL || 
  ''; // Paste new Project URL here if not using .env

const CAMPUS_ANON_KEY = 
  import.meta.env.VITE_CAMPUS_SUPABASE_ANON_KEY || 
  ''; // Paste new Project Anon Key here if not using .env

// Create client if credentials exist, otherwise provide safe fallback client
export const campusSupabase = (CAMPUS_PROJECT_URL && CAMPUS_ANON_KEY)
  ? createClient(CAMPUS_PROJECT_URL, CAMPUS_ANON_KEY, {
      auth: {
        persistSession: true,
        storageKey: 'lumixora_campus_auth_session',
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export const isCampusDbConfigured = Boolean(CAMPUS_PROJECT_URL && CAMPUS_ANON_KEY);
