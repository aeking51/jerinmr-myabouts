import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Calendar, Share2, Check, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useArticlesCache } from '@/hooks/useArticlesCache';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export function NewsRibbon() {
  const navigate = useNavigate();
  const { articles, isCached, isOffline } = useArticlesCache(10);
  const [copied, setCopied] = useState(false);

  const handleShare = async (article: Article, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = `${window.location.origin}/article/${article.slug}`;
    
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

  const getPreview = (content: string, maxLength = 100) => {
    const stripped = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '...';
  };

  const handleArticleClick = (article: Article) => {
    navigate(`/article/${article.slug}`);
  };

  if (articles.length === 0) return null;

  return (
    <div className="w-full mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Newspaper className="w-4 h-4 text-terminal-green" />
        <span className="font-mono text-sm font-bold text-terminal-green">LATEST ARTICLES</span>
        {isCached && (
          <span className="flex items-center gap-1 text-terminal-amber font-mono text-xs">
            <CloudOff className="w-3 h-3" />
            {isOffline ? 'Offline' : 'Cached'}
          </span>
        )}
        <div className="flex-1 h-px bg-terminal-green/30" />
      </div>
      
      <div className="relative overflow-hidden -mx-1">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-thin touch-pan-x">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="flex-shrink-0 w-60 sm:w-72 border-terminal-green/30 hover:border-terminal-green transition-all cursor-pointer snap-start hover:shadow-lg active:scale-[0.98]"
              onClick={() => handleArticleClick(article)}
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
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-mono text-[10px] sm:text-xs flex-1 hover:bg-terminal-green/10 h-7 sm:h-8"
                  >
                    Read more →
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-mono text-[10px] sm:text-xs hover:bg-terminal-green/10 h-7 sm:h-8 px-2"
                    onClick={(e) => handleShare(article, e)}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}