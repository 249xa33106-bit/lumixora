import { lazy } from 'react';

/**
 * Universal resilient lazy loader that handles deployment chunk hash mismatches.
 * If a new build is deployed to Cloudflare Pages, older browser sessions trying to
 * dynamically load an outdated chunk hash will automatically reload to fetch the latest assets.
 */
export function lazyWithRetry(componentImport) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      if (typeof window !== 'undefined') {
        const errorMsg = (error?.message || error?.toString() || '').toLowerCase();
        const isChunkMismatch =
          error?.name === 'ChunkLoadError' ||
          errorMsg.includes('failed to fetch dynamically imported module') ||
          errorMsg.includes('loading chunk') ||
          errorMsg.includes('dynamically imported module');

        if (isChunkMismatch) {
          const reloadKey = 'lumixora_chunk_reload_lock';
          const lastReload = sessionStorage.getItem(reloadKey);
          const now = Date.now();
          // Allow auto-reload if not reloaded within the last 15 seconds
          if (!lastReload || (now - parseInt(lastReload, 10)) > 15000) {
            sessionStorage.setItem(reloadKey, now.toString());
            console.warn('[Deployment Sync] Outdated chunk detected. Auto-reloading latest version...');
            window.location.reload();
            return new Promise(() => {}); // pause until page reloads
          }
        }
      }
      throw error;
    }
  });
}

export default lazyWithRetry;
