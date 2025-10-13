import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Newspaper } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  created_at: string;
}

export function NewsRibbon() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className="w-full bg-terminal-green/10 border-y border-terminal-green/30 py-2 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 bg-terminal-green/20 border-r border-terminal-green/30 shrink-0">
          <Newspaper className="w-4 h-4 text-terminal-green" />
          <span className="font-mono text-xs font-bold text-terminal-green">LATEST ARTICLES</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll flex gap-8 whitespace-nowrap">
            {[...articles, ...articles].map((article, index) => (
              <span
                key={`${article.id}-${index}`}
                className="font-mono text-sm text-foreground inline-flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse" />
                {article.title}
                <span className="text-muted-foreground text-xs">
                  ({new Date(article.created_at).toLocaleDateString()})
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
