import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNotes() {
  console.log("Fetching notes from Supabase...");
  const { data, error } = await supabase.from('notes').select('*');
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log(`Success! Found ${data.length} notes in the database.`);
    data.forEach((note, idx) => {
      console.log(`[Note ${idx+1}] ID: ${note.id}, Title: ${note.title}, CreatedAt: ${note.created_at || note.last_edited}`);
      try {
        const extra = JSON.parse(note.content || '{}');
        console.log(`  Type: ${note.type || extra.type}, Subject: ${extra.subject}, Category: ${extra.category}`);
      } catch (e) {
        console.log(`  Failed to parse content JSON: ${note.content}`);
      }
    });
  }
}

checkNotes();
