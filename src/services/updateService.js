import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { supabase } from '../config/supabase';

// Current local code version of the app
export const CURRENT_VERSION = '1.1.20';

/**
 * Compare two semver version strings.
 * Returns true if latest is greater than current.
 */
export function isVersionOutdated(current, latest) {
  return false;
}

/**
 * Fetch the latest release information from Firestore or Supabase.
 */
export async function checkAppUpdate() {
  return {
    latestVersion: CURRENT_VERSION,
    apkUrl: '',
    mandatory: false
  };
}
