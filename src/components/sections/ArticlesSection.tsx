import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TerminalPrompt } from '../TerminalPrompt';
import { Calendar, Type, Search, X, Share2, Check, CloudOff } from 'lucide-react';
import { toast } from 'sonner';
import { useArticlesCache } from '@/hooks/useArticlesCache';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

export function ArticlesSection() {
  const navigate = useNavigate();
  const { articles, loading, isCached, isOffline } = useArticlesCache();
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
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

  const getFilteredArticles = () => {
    if (!searchQuery.trim()) return articles;
    
    const query = searchQuery.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    );
  };

  const getSortedArticles = () => {
    const filtered = getFilteredArticles();
    const sorted = [...filtered];
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
    const stripped = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '...';
  };

  const handleArticleClick = (article: Article) => {
    navigate(`/article/${article.slug}`);
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
          output={isOffline ? "Offline - No cached articles available." : "No published articles found."}
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
      
      {/* Offline/Cached indicator */}
      {isCached && (
        <div className="flex items-center gap-2 px-3 py-2 bg-terminal-amber/10 border border-terminal-amber/30 rounded-md animate-fade-in">
          <CloudOff className="w-4 h-4 text-terminal-amber" />
          <span className="font-mono text-xs text-terminal-amber">
            {isOffline ? 'Offline Mode' : 'Showing cached content'} — Last synced recently
          </span>
        </div>
      )}
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 font-mono text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 items-center justify-between border border-border rounded p-2 bg-muted/50">
        <span className="font-mono text-xs text-muted-foreground">
          {searchQuery ? `Found ${sortedArticles.length} matching article${sortedArticles.length !== 1 ? 's' : ''}` : 'Sort by:'}
        </span>
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
      
      {sortedArticles.length === 0 ? (
        <div className="text-center py-8">
          <p className="font-mono text-sm text-muted-foreground">
            No articles found matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedArticles.map((article) => (
          <Card 
            key={article.id} 
            className="border-terminal-green/30 hover:border-terminal-green transition-colors cursor-pointer"
            onClick={() => handleArticleClick(article)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="font-mono text-terminal-green text-base">{article.title}</CardTitle>
                <div className="flex gap-1 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-mono text-xs h-7 px-2"
                    onClick={(e) => handleShare(article, e)}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="font-mono text-xs">
                    view →
                  </Button>
                </div>
              </div>
              <CardDescription className="font-mono text-xs">
                {new Date(article.created_at).toLocaleDateString()} • {article.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length} words
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
      )}
    </div>
  );
}