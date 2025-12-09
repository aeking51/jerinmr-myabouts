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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="font-mono text-sm border-terminal-green/50 hover:bg-terminal-green/10"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>

        <article className="space-y-6">
          <header className="border-b border-terminal-green/30 pb-6">
            <h1 className="font-mono text-3xl md:text-4xl text-terminal-green leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="w-1 h-1 rounded-full bg-terminal-green/50" />
              <span>{wordCount} words</span>
              <span className="w-1 h-1 rounded-full bg-terminal-green/50" />
              <span>~{Math.ceil(wordCount / 200)} min read</span>
            </div>
          </header>

          <div 
            className="prose prose-sm md:prose-base max-w-none text-foreground prose-headings:text-terminal-green prose-a:text-terminal-green"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <footer className="mt-12 pt-6 border-t border-border">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </footer>
      </div>
    </div>
  );
}
