import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseAnonKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
