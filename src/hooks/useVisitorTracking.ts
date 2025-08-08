import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VisitorData {
  ip_address?: string;
  user_agent: string;
  device_type: string;
  browser: string;
  operating_system: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  referrer: string;
  page_url: string;
  session_id: string;
  is_mobile: boolean;
  country?: string;
  city?: string;
}

const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const detectDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
    return 'Mobile';
  } else if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
    return 'Tablet';
  }
  return 'Desktop';
};

const detectBrowser = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('chrome')) return 'Chrome';
  if (userAgent.includes('firefox')) return 'Firefox';
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'Safari';
  if (userAgent.includes('edge')) return 'Edge';
  if (userAgent.includes('opera')) return 'Opera';
  return 'Unknown';
};

const detectOS = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('windows')) return 'Windows';
  if (userAgent.includes('mac')) return 'macOS';
  if (userAgent.includes('linux')) return 'Linux';
  if (userAgent.includes('android')) return 'Android';
  if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) return 'iOS';
  return 'Unknown';
};

const getLocationData = async (): Promise<{ country?: string; city?: string; ip?: string }> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      country: data.country_name,
      city: data.city,
      ip: data.ip
    };
  } catch {
    return {};
  }
};

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const locationData = await getLocationData();
        
        const visitorData: VisitorData = {
          ip_address: locationData.ip,
          user_agent: navigator.userAgent,
          device_type: detectDeviceType(),
          browser: detectBrowser(),
          operating_system: detectOS(),
          screen_resolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          referrer: document.referrer || 'Direct',
          page_url: window.location.href,
          session_id: sessionStorage.getItem('visitor_session_id') || generateSessionId(),
          is_mobile: /Mobi|Android/i.test(navigator.userAgent),
          country: locationData.country,
          city: locationData.city
        };

        // Store session ID for subsequent page visits
        if (!sessionStorage.getItem('visitor_session_id')) {
          sessionStorage.setItem('visitor_session_id', visitorData.session_id);
        }

        const { error } = await supabase
          .from('visitors')
          .insert(visitorData);

        if (error) {
          console.error('Error tracking visitor:', error);
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    // Track visitor on mount
    trackVisitor();
  }, []);
};