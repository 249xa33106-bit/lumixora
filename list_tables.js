import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log("Checking Supabase tables...");
  
  // Try to query common tables to see what exists
  const tables = ['users', 'notes', 'tasks', 'doubts', 'hub_subjects', 'hub_materials', 'app_config', 'settings'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table '${table}': NOT FOUND or ERROR (${error.message})`);
    } else {
      console.log(`Table '${table}': EXISTS (found ${data.length} rows preview)`);
    }
  }
}

listTables();
