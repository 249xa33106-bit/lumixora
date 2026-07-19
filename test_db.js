import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching users from PostgreSQL...");
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log(`Success! Found ${data.length} users in the database.`);
    console.log(`Success! Found ${data.length} users in the database.`);
    if (data.length > 0) {
      console.log("Full sample user object:", JSON.stringify(data[0], null, 2));
    }
  }
}

test();
