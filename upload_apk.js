import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadApk() {
  const apkPath = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  console.log("Looking for APK at:", apkPath);
  
  if (!fs.existsSync(apkPath)) {
    console.error("APK file not found! Make sure the build succeeded.");
    process.exit(1);
  }
  
  console.log("Reading APK file...");
  const fileBuffer = fs.readFileSync(apkPath);
  
  console.log("Uploading to Supabase (academic_resources/app/Lumixora.apk)...");
  const { data, error } = await supabase.storage
    .from('academic_resources')
    .upload('app/Lumixora.apk', fileBuffer, {
      contentType: 'application/vnd.android.package-archive',
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) {
    console.error("Upload Error:", error.message);
    process.exit(1);
  } else {
    console.log("Upload Success! APK is now live at the update URL.");
    console.log("Details:", data);
  }
}

uploadApk();
