/**
 * techNewsService.js
 * Real-time fetcher for live developer news, hacker news, and curated hiring radar
 */

import { INITIAL_TECH_JOBS, INITIAL_TECH_NEWS, SALARY_HIKES_RADAR, TRENDING_TECH_STACKS } from '../data/techPulseData';

const BOOKMARK_STORAGE_KEY = 'lumixora_tech_pulse_bookmarks';

export function getSavedBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveBookmarkItem(item) {
  try {
    const existing = getSavedBookmarks();
    const alreadySaved = existing.some(b => b.id === item.id);
    let updated;
    if (alreadySaved) {
      updated = existing.filter(b => b.id !== item.id);
    } else {
      updated = [item, ...existing];
    }
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export async function fetchLiveTechFeed() {
  const liveItems = [];

  // 1. Fetch latest developer news from Dev.to public API
  try {
    const devToResponse = await fetch('https://dev.to/api/articles?tag=technology&per_page=16', {
      headers: { 'Accept': 'application/json' }
    });
    if (devToResponse.ok) {
      const articles = await devToResponse.json();
      articles.forEach(art => {
        if (art && art.title) {
          liveItems.push({
            id: `devto_${art.id}`,
            category: 'Developer Web & AI',
            title: art.title,
            snippet: art.description || 'Click to read full in-depth discussion and code samples on Dev.to.',
            source: 'Dev.to Community',
            sourceUrl: art.url,
            readTime: `${art.reading_time_minutes || 4} min read`,
            publishedAt: 'Live Feed',
            impactLevel: 'HIGH',
            tags: Array.isArray(art.tag_list) ? art.tag_list.slice(0, 4) : ['Tech', 'Coding'],
            coverImage: art.cover_image || null,
            reactionsCount: art.public_reactions_count || 12,
            isLiveStream: true
          });
        }
      });
    }
  } catch (err) {
    console.warn('Dev.to live feed notice:', err);
  }

  // 2. Fetch top Hacker News item
  try {
    const hnIdsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?limitToFirst=12&orderBy="$key"');
    if (hnIdsRes.ok) {
      const topIds = await hnIdsRes.json();
      const firstIds = Array.isArray(topIds) ? topIds.slice(0, 10) : [];
      
      const storyPromises = firstIds.map(id => 
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()).catch(() => null)
      );

      const stories = await Promise.allSettled(storyPromises);
      stories.forEach(res => {
        if (res.status === 'fulfilled' && res.value && res.value.title) {
          const s = res.value;
          liveItems.push({
            id: `hn_${s.id}`,
            category: 'Hacker News Top Trend',
            title: s.title,
            snippet: `Discussion with ${s.score || 100}+ points on Hacker News. Read the original article and developer viewpoints.`,
            source: 'Hacker News (Y Combinator)',
            sourceUrl: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
            readTime: '3 min read',
            publishedAt: 'Trending Now',
            impactLevel: (s.score || 0) > 200 ? 'CRITICAL' : 'HIGH',
            tags: ['HackerNews', 'Tech', 'YCombinator'],
            score: s.score || 0,
            isLiveStream: true
          });
        }
      });
    }
  } catch (hnErr) {
    console.warn('Hacker News live feed notice:', hnErr);
  }

  // Merge live items with curated initial tech news
  const mergedNews = [...liveItems, ...INITIAL_TECH_NEWS];
  return mergedNews;
}
