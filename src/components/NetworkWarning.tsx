import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function NetworkWarning() {
  const [isOffline, setIsOffline] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Check network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check Supabase service availability
  useEffect(() => {
    const checkService = async () => {
      if (isOffline) return;
      
      try {
        const { error } = await supabase.from('articles').select('id').limit(1);
        setServiceUnavailable(!!error);
      } catch {
        setServiceUnavailable(true);
      }
    };

    checkService();
    const interval = setInterval(checkService, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isOffline]);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      const { error } = await supabase.from('articles').select('id').limit(1);
      setServiceUnavailable(!!error);
      if (!error) setIsOffline(false);
    } catch {
      setServiceUnavailable(true);
    }
    setIsChecking(false);
  };

  if (!isOffline && !serviceUnavailable) return null;

  return (
    <div className="animate-slide-down">
      <div className="bg-destructive/10 border border-destructive/30 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <WifiOff className="w-5 h-5 text-destructive animate-pulse-warning" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-ping" />
          </div>
          <div className="font-mono text-sm">
            <span className="text-destructive font-medium">
              {isOffline ? 'No Internet Connection' : 'Service Temporarily Unavailable'}
            </span>
            <span className="text-muted-foreground ml-2 hidden sm:inline">
              {isOffline 
                ? '— Please check your network connection' 
                : '— Some features may not work properly'}
            </span>
          </div>
        </div>
        <button
          onClick={handleRetry}
          disabled={isChecking}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-destructive/20 hover:bg-destructive/30 text-destructive rounded border border-destructive/30 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          Retry
        </button>
      </div>
    </div>
  );
}
