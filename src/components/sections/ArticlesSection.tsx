import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TerminalPrompt } from '../TerminalPrompt';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <TerminalPrompt command="ls articles/" output="" showCursor={false} />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="space-y-4">
        <TerminalPrompt
          command="ls articles/"
          output="No published articles found."
          showCursor={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TerminalPrompt
        command="ls articles/"
        output={`Found ${articles.length} article${articles.length !== 1 ? 's' : ''}`}
        showCursor={false}
      />
      
      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="border-terminal-green/30 hover:border-terminal-green transition-colors">
            <CardHeader>
              <CardTitle className="font-mono text-terminal-green">{article.title}</CardTitle>
              <CardDescription className="font-mono text-xs">
                Published: {new Date(article.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                {article.content}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}