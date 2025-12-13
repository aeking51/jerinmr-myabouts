import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const wasOfflineRef = useRef(false);

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
  const fetchArticles = useCallback(async (showToast = false) => {
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
        
        // Show toast when reconnected and refreshed
        if (showToast) {
          toast.success('Back online!', {
            description: 'Articles have been refreshed with the latest content.',
            duration: 4000,
          });
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
      // Only show toast if we were actually offline before
      const shouldShowToast = wasOfflineRef.current;
      wasOfflineRef.current = false;
      fetchArticles(shouldShowToast);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      wasOfflineRef.current = true;
      
      toast.warning('You are offline', {
        description: 'Showing cached articles. Some features may be limited.',
        duration: 4000,
      });
      
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
      fetchArticles(false);
    } else {
      wasOfflineRef.current = true;
      setLoading(false);
    }
  }, [fetchArticles, loadFromCache, limit]);

  return {
    articles,
    loading,
    isOffline,
    isCached,
    refetch: () => fetchArticles(false)
  };
}
