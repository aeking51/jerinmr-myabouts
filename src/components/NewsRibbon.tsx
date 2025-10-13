import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Newspaper, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export function NewsRibbon() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const getPreview = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (articles.length === 0) return null;

  return (
    <>
      <div className="w-full mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-terminal-green" />
          <span className="font-mono text-sm font-bold text-terminal-green">LATEST ARTICLES</span>
          <div className="flex-1 h-px bg-terminal-green/30" />
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="flex-shrink-0 w-72 border-terminal-green/30 hover:border-terminal-green transition-all cursor-pointer snap-start hover:shadow-lg"
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="font-mono text-terminal-green text-sm line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-mono text-xs text-muted-foreground line-clamp-3">
                    {getPreview(article.content)}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-mono text-xs mt-2 w-full hover:bg-terminal-green/10"
                  >
                    Read more →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col bg-card/95 backdrop-blur-sm border-terminal-green/50">
          <DialogHeader className="border-b border-terminal-green/30 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-1 h-full bg-terminal-green rounded-full" />
              <div className="flex-1">
                <DialogTitle className="font-mono text-2xl text-terminal-green leading-tight mb-3">
                  {selectedArticle?.title}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedArticle && new Date(selectedArticle.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-terminal-green/50" />
                  <span>
                    {selectedArticle && selectedArticle.content.split(/\s+/).length} words
                  </span>
                  <span className="w-1 h-1 rounded-full bg-terminal-green/50" />
                  <span>
                    ~{selectedArticle && Math.ceil(selectedArticle.content.split(/\s+/).length / 200)} min read
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-1 py-6 scroll-smooth">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground bg-muted/30 p-6 rounded-lg border border-border">
                  {selectedArticle?.content}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="border-t border-terminal-green/30 pt-4 flex justify-between items-center">
            <span className="text-xs font-mono text-muted-foreground">
              Article ID: {selectedArticle?.id.slice(0, 8)}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setSelectedArticle(null)}
              className="font-mono text-xs border-terminal-green/50 hover:bg-terminal-green/10 hover:border-terminal-green"
            >
              Close [Esc]
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
