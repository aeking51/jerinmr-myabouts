import { useState, useEffect } from 'react';
import { Sun, Moon, Eye, Type, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

type Theme = 'dark' | 'light' | 'eye-comfort';

export function ArticleToolbar() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('articleTheme');
    return (saved as Theme) || 'dark';
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('articleFontSize');
    return saved ? parseInt(saved) : 100;
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('articleTheme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--article-font-scale', `${fontSize}%`);
    localStorage.setItem('articleFontSize', fontSize.toString());
  }, [fontSize]);

  const handleThemeToggle = () => {
    setTheme(current => 
      current === 'dark' ? 'light' : 
      current === 'light' ? 'eye-comfort' : 
      'dark'
    );
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <Button
        onClick={handleThemeToggle}
        variant="outline"
        size="sm"
        className="font-mono text-xs sm:text-sm border-terminal-green/50 hover:bg-terminal-green/10 px-2 sm:px-3"
        title={theme === 'dark' ? 'Switch to light mode' : theme === 'light' ? 'Switch to eye comfort mode' : 'Switch to dark mode'}
      >
        {theme === 'light' ? (
          <Sun className="w-4 h-4" />
        ) : theme === 'eye-comfort' ? (
          <Eye className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>

      {/* Accessibility Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs sm:text-sm border-terminal-green/50 hover:bg-terminal-green/10 px-2 sm:px-3"
            title="Accessibility options"
          >
            <Type className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-card border-border">
          <DropdownMenuLabel className="font-mono text-xs text-terminal-green">
            Text Size ({fontSize}%)
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex items-center justify-between px-2 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={decreaseFontSize}
              disabled={fontSize <= 80}
              className="h-8 w-8 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFontSize}
              className="font-mono text-xs h-8 px-2"
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={increaseFontSize}
              disabled={fontSize >= 150}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
