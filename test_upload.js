import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log("Testing upload to academic_resources...");
  const dummyContent = "This is a test file.";
  const { data, error } = await supabase.storage
    .from('academic_resources')
    .upload('test2.txt', dummyContent, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error("Upload Error:", error.message);
  } else {
    console.log("Upload Success:", data);
  }
}

testUpload();
