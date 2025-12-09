import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          url: url,
        });
      } catch (err) {
        // User cancelled or error - fall back to copy
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-mono text-2xl text-terminal-green">Article not found</h1>
          <p className="font-mono text-sm text-muted-foreground">
            The article you're looking for doesn't exist or has been unpublished.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const wordCount = article.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="font-mono text-xs sm:text-sm px-2 sm:px-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Back</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="font-mono text-xs sm:text-sm border-terminal-green/50 hover:bg-terminal-green/10 px-2 sm:px-4"
          >
            {copied ? (
              <Check className="w-4 h-4 sm:mr-2" />
            ) : (
              <Share2 className="w-4 h-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </Button>
        </div>

        <article className="space-y-4 sm:space-y-6">
          <header className="border-b border-terminal-green/30 pb-4 sm:pb-6">
            <h1 className="font-mono text-xl sm:text-2xl md:text-4xl text-terminal-green leading-tight mb-3 sm:mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-mono text-muted-foreground">
              <span className="flex items-center gap-1 sm:gap-1.5">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {new Date(article.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <span className="w-1 h-1 rounded-full bg-terminal-green/50" />
              <span>{wordCount} words</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-terminal-green/50" />
              <span className="hidden sm:inline">~{Math.ceil(wordCount / 200)} min read</span>
            </div>
          </header>

          <div 
            className="prose prose-sm max-w-none text-foreground prose-headings:text-terminal-green prose-a:text-terminal-green prose-p:text-sm sm:prose-p:text-base prose-headings:text-base sm:prose-headings:text-lg md:prose-headings:text-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <footer className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-border">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="font-mono text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            Back to Home
          </Button>
        </footer>
      </div>
    </div>
  );
}
