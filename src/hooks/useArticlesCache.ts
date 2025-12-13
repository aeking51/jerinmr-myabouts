import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

interface CacheData {
  articles: Article[];
  timestamp: number;
}

const CACHE_KEY = 'cached_articles';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useArticlesCache(limit?: number) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isCached, setIsCached] = useState(false);

  // Load from cache
  const loadFromCache = useCallback((): Article[] => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CacheData = JSON.parse(cached);
        const isValid = Date.now() - data.timestamp < CACHE_DURATION;
        if (isValid && data.articles.length > 0) {
          return data.articles;
        }
      }
    } catch (e) {
      console.error('Error loading from cache:', e);
    }
    return [];
  }, []);

  // Save to cache
  const saveToCache = useCallback((articles: Article[]) => {
    try {
      const cacheData: CacheData = {
        articles,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (e) {
      console.error('Error saving to cache:', e);
    }
  }, []);

  // Fetch articles from Supabase
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        setArticles(data);
        setIsCached(false);
        // Only save full articles list to cache (not limited)
        if (!limit) {
          saveToCache(data);
        } else {
          // For limited queries, still update cache if we don't have cached data
          const cached = loadFromCache();
          if (cached.length === 0) {
            saveToCache(data);
          }
        }
      } else {
        // No data from server, try cache
        const cached = loadFromCache();
        if (cached.length > 0) {
          setArticles(limit ? cached.slice(0, limit) : cached);
          setIsCached(true);
        }
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      // On error, try to load from cache
      const cached = loadFromCache();
      if (cached.length > 0) {
        setArticles(limit ? cached.slice(0, limit) : cached);
        setIsCached(true);
      }
    } finally {
      setLoading(false);
    }
  }, [limit, loadFromCache, saveToCache]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      fetchArticles(); // Refresh when back online
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      // Load from cache when going offline
      const cached = loadFromCache();
      if (cached.length > 0) {
        setArticles(limit ? cached.slice(0, limit) : cached);
        setIsCached(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchArticles, loadFromCache, limit]);

  // Initial fetch
  useEffect(() => {
    // First try to load from cache for instant display
    const cached = loadFromCache();
    if (cached.length > 0) {
      setArticles(limit ? cached.slice(0, limit) : cached);
      setIsCached(true);
    }

    // Then fetch fresh data if online
    if (navigator.onLine) {
      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [fetchArticles, loadFromCache, limit]);

  return {
    articles,
    loading,
    isOffline,
    isCached,
    refetch: fetchArticles
  };
}
