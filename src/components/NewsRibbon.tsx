import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Newspaper, Calendar, Share2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export function NewsRibbon() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async (article: Article, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = `${window.location.origin}/articles/${article.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: url,
        });
      } catch (err) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

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
    // Strip HTML tags for preview
    const stripped = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '...';
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
        
        <div className="relative overflow-hidden -mx-1">
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-thin touch-pan-x">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="flex-shrink-0 w-60 sm:w-72 border-terminal-green/30 hover:border-terminal-green transition-all cursor-pointer snap-start hover:shadow-lg active:scale-[0.98]"
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <CardTitle className="font-mono text-terminal-green text-xs sm:text-sm line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="font-mono text-[10px] sm:text-xs flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 p-3 sm:p-4 pt-0">
                  <p className="font-mono text-[10px] sm:text-xs text-muted-foreground line-clamp-2 sm:line-clamp-3">
                    {getPreview(article.content, 80)}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-mono text-[10px] sm:text-xs mt-2 w-full hover:bg-terminal-green/10 h-7 sm:h-8"
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
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col bg-card/95 backdrop-blur-sm border-terminal-green/50 p-3 sm:p-6">
          <DialogHeader className="border-b border-terminal-green/30 pb-3 sm:pb-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-1 h-full bg-terminal-green rounded-full hidden sm:block" />
              <div className="flex-1">
                <DialogTitle className="font-mono text-lg sm:text-xl md:text-2xl text-terminal-green leading-tight mb-2 sm:mb-3">
                  {selectedArticle?.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Article content view
                </DialogDescription>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {selectedArticle && new Date(selectedArticle.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-terminal-green/50" />
                  <span>
                    {selectedArticle && selectedArticle.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length} words
                  </span>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-terminal-green/50" />
                  <span className="hidden sm:inline">
                    ~{selectedArticle && Math.ceil(selectedArticle.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length / 200)} min read
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 sm:py-6 scroll-smooth -mx-1 px-1">
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-sm max-w-none text-foreground prose-p:text-sm prose-headings:text-base sm:prose-headings:text-lg"
                dangerouslySetInnerHTML={{ __html: selectedArticle?.content || '' }}
              />
            </div>
          </div>
          
          <div className="border-t border-terminal-green/30 pt-3 sm:pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
              ID: {selectedArticle?.id.slice(0, 8)}
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => selectedArticle && handleShare(selectedArticle)}
                className="font-mono text-xs border-terminal-green/50 hover:bg-terminal-green/10 hover:border-terminal-green flex-1 sm:flex-none"
              >
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Share2 className="w-3 h-3 mr-1" />}
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedArticle(null)}
                className="font-mono text-xs border-terminal-green/50 hover:bg-terminal-green/10 hover:border-terminal-green flex-1 sm:flex-none"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
