import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TerminalPrompt } from '../TerminalPrompt';
import { ArrowUpDown, Calendar, Type } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

export function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

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

  const getSortedArticles = () => {
    const sorted = [...articles];
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  const getPreview = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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

  const sortedArticles = getSortedArticles();

  return (
    <div className="space-y-4">
      <TerminalPrompt
        command="ls articles/"
        output={`Found ${articles.length} article${articles.length !== 1 ? 's' : ''}`}
        showCursor={false}
      />
      
      <div className="flex flex-wrap gap-2 items-center justify-between border border-border rounded p-2 bg-muted/50">
        <span className="font-mono text-xs text-muted-foreground">Sort by:</span>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortBy.startsWith('date') ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
            className="font-mono text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Date {sortBy === 'date-desc' ? '↓' : sortBy === 'date-asc' ? '↑' : ''}
          </Button>
          <Button
            variant={sortBy.startsWith('title') ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy(sortBy === 'title-asc' ? 'title-desc' : 'title-asc')}
            className="font-mono text-xs"
          >
            <Type className="w-3 h-3 mr-1" />
            Title {sortBy === 'title-asc' ? '↑' : sortBy === 'title-desc' ? '↓' : ''}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-3">
        {sortedArticles.map((article) => (
          <Card 
            key={article.id} 
            className="border-terminal-green/30 hover:border-terminal-green transition-colors cursor-pointer"
            onClick={() => setSelectedArticle(article)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="font-mono text-terminal-green text-base">{article.title}</CardTitle>
                <Button variant="ghost" size="sm" className="font-mono text-xs shrink-0">
                  view →
                </Button>
              </div>
              <CardDescription className="font-mono text-xs">
                {new Date(article.created_at).toLocaleDateString()} • {article.content.split(/\s+/).length} words
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-mono text-sm text-muted-foreground line-clamp-2">
                {getPreview(article.content)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono text-terminal-green">{selectedArticle?.title}</DialogTitle>
            <p className="font-mono text-xs text-muted-foreground">
              Published: {selectedArticle && new Date(selectedArticle.created_at).toLocaleDateString()} • 
              {selectedArticle && ` ${selectedArticle.content.split(/\s+/).length} words`}
            </p>
          </DialogHeader>
          <div className="mt-4">
            <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
              {selectedArticle?.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}