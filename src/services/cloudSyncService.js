import { supabase } from '../config/supabase';

/**
 * Cloud Sync Service — Stores ALL user progress in Supabase `user_progress` table.
 * localStorage is used ONLY as a fast read cache; Supabase is the source of truth.
 * On login, all progress is pulled from cloud → cached locally.
 * On save, data is written to BOTH cloud + local cache simultaneously.
 */

class CloudSyncService {
  constructor() {
    this._cache = {};        // In-memory cache: { 'email:key': value }
    this._writeQueue = [];   // Batched writes
    this._flushTimer = null;
    this._initialized = false;
  }

  /**
   * Load ALL progress for a user from Supabase into memory + localStorage cache.
   * Call this once on login / app mount.
   */
  async loadAll(userEmail) {
    if (!userEmail) return;
    const email = userEmail.toLowerCase().trim();

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('data_key, data_value')
        .eq('user_email', email);

      if (error) {
        console.warn('[CloudSync] loadAll error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        data.forEach(row => {
          const cacheKey = `${email}:${row.data_key}`;
          this._cache[cacheKey] = row.data_value;
          // Also populate localStorage as fast-read cache
          try {
            localStorage.setItem(`lx_${row.data_key}`, JSON.stringify(row.data_value));
          } catch (e) { /* localStorage full, ignore */ }
        });
      }
      this._initialized = true;
      console.log(`[CloudSync] Loaded ${data?.length || 0} keys for ${email}`);
    } catch (err) {
      console.warn('[CloudSync] loadAll exception:', err);
    }
  }

  /**
   * Get a value. Reads from memory cache first, then localStorage fallback.
   * Returns parsed value or null.
   */
  get(userEmail, key) {
    if (!userEmail) {
      // Fallback: try localStorage directly
      try {
        const raw = localStorage.getItem(`lx_${key}`) || localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    }

    const email = userEmail.toLowerCase().trim();
    const cacheKey = `${email}:${key}`;

    // 1. Memory cache (fastest)
    if (cacheKey in this._cache) {
      return this._cache[cacheKey];
    }

    // 2. localStorage cache (fast fallback)
    try {
      const raw = localStorage.getItem(`lx_${key}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        this._cache[cacheKey] = parsed;
        return parsed;
      }
    } catch { /* ignore */ }

    // 3. Legacy localStorage key (migration)
    try {
      const legacyRaw = localStorage.getItem(key);
      if (legacyRaw) {
        const parsed = JSON.parse(legacyRaw);
        this._cache[cacheKey] = parsed;
        // Migrate: save to cloud
        this.set(userEmail, key, parsed);
        return parsed;
      }
    } catch { /* ignore */ }

    return null;
  }

  /**
   * Save a value to Supabase cloud + localStorage cache.
   * Cloud write is fire-and-forget (batched for performance).
   */
  set(userEmail, key, value) {
    if (!userEmail || !key) return;

    const email = userEmail.toLowerCase().trim();
    const cacheKey = `${email}:${key}`;

    // 1. Update memory cache immediately
    this._cache[cacheKey] = value;

    // 2. Update localStorage cache (instant reads next time)
    try {
      localStorage.setItem(`lx_${key}`, JSON.stringify(value));
    } catch (e) { /* localStorage full, cloud is fine */ }

    // 3. Queue cloud write (debounced batch)
    this._writeQueue.push({ email, key, value });
    this._scheduleFlush();
  }

  /**
   * Remove a key from cloud + cache.
   */
  remove(userEmail, key) {
    if (!userEmail || !key) return;

    const email = userEmail.toLowerCase().trim();
    const cacheKey = `${email}:${key}`;

    delete this._cache[cacheKey];
    try { localStorage.removeItem(`lx_${key}`); } catch {}

    supabase
      .from('user_progress')
      .delete()
      .eq('user_email', email)
      .eq('data_key', key)
      .then(() => {})
      .catch(() => {});
  }

  /**
   * Save immediately (no debounce) — for critical data.
   */
  async setImmediate(userEmail, key, value) {
    if (!userEmail || !key) return;

    const email = userEmail.toLowerCase().trim();
    const cacheKey = `${email}:${key}`;

    this._cache[cacheKey] = value;
    try { localStorage.setItem(`lx_${key}`, JSON.stringify(value)); } catch {}

    try {
      await supabase.from('user_progress').upsert({
        user_email: email,
        data_key: key,
        data_value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_email,data_key' });
    } catch (err) {
      console.warn('[CloudSync] setImmediate error:', err);
    }
  }

  /**
   * Get a value asynchronously — fetches from Supabase if not cached.
   */
  async getAsync(userEmail, key) {
    // Try cache first
    const cached = this.get(userEmail, key);
    if (cached !== null) return cached;

    if (!userEmail) return null;
    const email = userEmail.toLowerCase().trim();

    try {
      const { data } = await supabase
        .from('user_progress')
        .select('data_value')
        .eq('user_email', email)
        .eq('data_key', key)
        .maybeSingle();

      if (data?.data_value !== undefined && data?.data_value !== null) {
        this._cache[`${email}:${key}`] = data.data_value;
        try { localStorage.setItem(`lx_${key}`, JSON.stringify(data.data_value)); } catch {}
        return data.data_value;
      }
    } catch (err) {
      console.warn('[CloudSync] getAsync error:', err);
    }

    return null;
  }

  // Internal: Debounced batch flush to Supabase
  _scheduleFlush() {
    if (this._flushTimer) clearTimeout(this._flushTimer);
    this._flushTimer = setTimeout(() => this._flush(), 500);
  }

  async _flush() {
    if (this._writeQueue.length === 0) return;

    // Deduplicate: keep latest write per email+key
    const latest = {};
    while (this._writeQueue.length > 0) {
      const item = this._writeQueue.shift();
      latest[`${item.email}:${item.key}`] = item;
    }

    const rows = Object.values(latest).map(item => ({
      user_email: item.email,
      data_key: item.key,
      data_value: item.value,
      updated_at: new Date().toISOString()
    }));

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert(rows, { onConflict: 'user_email,data_key' });

      if (error) {
        console.warn('[CloudSync] batch flush error:', error.message);
      }
    } catch (err) {
      console.warn('[CloudSync] flush exception:', err);
    }
  }

  /**
   * Migrate all existing localStorage data for a user to cloud.
   * Call once on first login after this update.
   */
  async migrateFromLocalStorage(userEmail) {
    if (!userEmail) return;
    const email = userEmail.toLowerCase().trim();

    const keysToMigrate = [
      'lumixora_timetable', 'lumixora_student_alarms', 'lumixora_watched_videos',
      'lumixora_bookmarked_subjects', 'lumixora_bookmarked_hackathons',
      'lumixora_daily_missions', 'lumixora_chaoslab_history',
      'lumixora_chaoslab_custom_missions', 'lumixora_projectverse_profile',
      'lumixora_projectverse_active_proj', 'lumixora_projectverse_tasks',
      'lumixora_projectverse_evidence', 'lumixora_prove_skills',
      'lumixora_roadmap_overrides', 'lumixora_edupulse_rules',
      'lumixora_edupulse_actions', 'lumixora_custom_tests',
      'lumixora_notifications', 'lumixora_exam_cheers',
      'boloclass_saved_lessons', 'boloclass_active_lesson_id',
      'boloclass_quiz_answers', 'boloclass_submitted_quizzes',
      'lumixora_candidate_photo', 'lumixora_roll_number',
      'lumixora_student_roll', 'lumixora_codeforces_user',
      'lumixora_hackerrank_user', 'lumixora_leetcode_user',
      'lumixora_github_user', 'lumixora_linkedin_user',
      'lumixora_portfolio_global_user', 'lumixora_custom_syllabus_videos_v11',
      'lumixora_custom_aptitude', 'lumixora_custom_alumni'
    ];

    // Also migrate user-specific keys with UID suffix
    const user = (() => { try { return JSON.parse(localStorage.getItem('lumixora_user')); } catch { return null; } })();
    const uid = user?.uid || user?.id || '';
    if (uid) {
      keysToMigrate.push(
        `lumixora_roadmap_progress_${uid}`,
        `lumixora_roadmap_subprogress_${uid}`,
        `lumixora_roadmap_videos_${uid}`,
        `lumixora_submissions_${uid}`,
        `lumixora_solved_${uid}`,
        `lumixora_lessons_${uid}`
      );
    }

    const rows = [];
    for (const key of keysToMigrate) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const value = JSON.parse(raw);
          rows.push({
            user_email: email,
            data_key: key,
            data_value: value,
            updated_at: new Date().toISOString()
          });
          this._cache[`${email}:${key}`] = value;
        }
      } catch { /* skip unparseable */ }
    }

    if (rows.length > 0) {
      try {
        await supabase
          .from('user_progress')
          .upsert(rows, { onConflict: 'user_email,data_key' });
        console.log(`[CloudSync] Migrated ${rows.length} keys from localStorage to cloud`);
      } catch (err) {
        console.warn('[CloudSync] migration error:', err);
      }
    }
  }
}

// Singleton instance
export const cloudSync = new CloudSyncService();
