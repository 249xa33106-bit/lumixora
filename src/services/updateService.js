import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { supabase } from '../config/supabase';

// Current local code version of the app
export const CURRENT_VERSION = '1.1.6';

/**
 * Compare two semver version strings.
 * Returns true if latest is greater than current.
 */
export function isVersionOutdated(current, latest) {
  if (!current || !latest) return false;
  const parse = (v) => v.split('.').map(Number);
  const cArr = parse(current);
  const lArr = parse(latest);
  
  for (let i = 0; i < Math.max(cArr.length, lArr.length); i++) {
    const cVal = cArr[i] || 0;
    const lVal = lArr[i] || 0;
    if (lVal > cVal) return true;
    if (cVal > lVal) return false;
  }
  return false;
}

/**
 * Fetch the latest release information from Firestore or Supabase.
 */
export async function checkAppUpdate() {
  const defaultApkUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co/storage/v1/object/public/academic_resources/app/Lumixora.apk';
  
  // 1. Try Firebase Firestore
  try {
    const docRef = doc(db, 'app_config', 'version_control');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Firestore Update Data fetched:", data);
      return {
        latestVersion: data.latest_version || CURRENT_VERSION,
        apkUrl: data.apk_url || defaultApkUrl,
        mandatory: data.mandatory || false
      };
    }
  } catch (error) {
    console.warn("Firestore check failed, trying Supabase:", error);
  }

  // 2. Try Supabase fallback
  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'latest_version')
      .single();
      
    if (!error && data) {
      console.log("Supabase Update Data fetched:", data);
      return {
        latestVersion: data.value || CURRENT_VERSION,
        apkUrl: defaultApkUrl,
        mandatory: false
      };
    }
  } catch (error) {
    console.warn("Supabase check failed:", error);
  }

  // 3. Fail-safe local fallback
  return {
    latestVersion: CURRENT_VERSION,
    apkUrl: defaultApkUrl,
    mandatory: false
  };
}
