import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Github, Linkedin, Mail, FileText, Globe, Twitter, Youtube, Instagram, Folder, BookOpen, Code, Link } from 'lucide-react';

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  display_order: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  link: Link,
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  file: FileText,
  globe: Globe,
  twitter: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  folder: Folder,
  book: BookOpen,
  code: Code,
};

export function QuickLinksColumn() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('quick_links')
        .select('id, title, url, icon, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching quick links:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-terminal-green/30 p-3 bg-card/30 animate-pulse">
        <div className="h-4 bg-muted rounded w-24 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="border border-terminal-green/30 p-3 bg-card/30">
      <div className="text-terminal-green font-mono text-sm font-bold mb-3 flex items-center gap-2">
        <ExternalLink className="w-4 h-4" />
        Quick Links
      </div>
      <div className="space-y-2">
        {links.map((link) => {
          const IconComponent = iconMap[link.icon] || Link;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-terminal-cyan hover:text-terminal-green transition-colors text-sm font-mono group"
            >
              <IconComponent className="w-3 h-3 flex-shrink-0" />
              <span className="group-hover:underline">{link.title}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
