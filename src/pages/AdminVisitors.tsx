import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Globe, Monitor, Smartphone, Tablet, MapPin, Clock, Eye, Users, Activity, LogOut, ShieldAlert, ArrowUpDown } from 'lucide-react';

interface Visitor {
  id: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  operating_system: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  referrer: string;
  page_url: string;
  visited_at: string;
  session_id: string;
  is_mobile: boolean;
  country: string;
  city: string;
}

interface VisitorStats {
  totalVisitors: number;
  uniqueIPs: number;
  mobileUsers: number;
  desktopUsers: number;
}

const AdminVisitors = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<VisitorStats>({
    totalVisitors: 0,
    uniqueIPs: 0,
    mobileUsers: 0,
    desktopUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sortBy, setSortBy] = useState<string>('visited_at-desc');
  const [timeFrame, setTimeFrame] = useState<string>('all');

  useEffect(() => {
    checkAuthAndRole();
  }, [navigate]);

  const checkAuthAndRole = async () => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Check if user has admin role
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error || !roleData) {
        setIsAdmin(false);
        setCheckingAuth(false);
        return;
      }

      setIsAdmin(true);
      fetchVisitors();
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/admin/login');
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchVisitors();
    }
  }, [sortBy, timeFrame]);

  const fetchVisitors = async () => {
    try {
      const [field, direction] = sortBy.split('-');
      let query = supabase
        .from('visitors')
        .select('*');

      // Apply time frame filter
      if (timeFrame !== 'all') {
        const now = new Date();
        let startDate: Date;

        switch (timeFrame) {
          case '24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '3m':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case '6m':
            startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
          case '1y':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }

        query = query.gte('visited_at', startDate.toISOString());
      }

      const { data, error } = await query
        .order(field, { ascending: direction === 'asc' })
        .limit(100);

      if (error) throw error;

      setVisitors(data || []);
      
      // Calculate stats
      const uniqueIPs = new Set(data?.map(v => v.ip_address)).size;
      const mobileUsers = data?.filter(v => v.is_mobile).length || 0;
      const desktopUsers = (data?.length || 0) - mobileUsers;

      setStats({
        totalVisitors: data?.length || 0,
        uniqueIPs,
        mobileUsers,
        desktopUsers
      });
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {checkingAuth ? 'Verifying access...' : 'Loading visitor data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have admin privileges to access visitor analytics.
            </p>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="text-center space-y-2 flex-1">
            <h1 className="text-4xl font-bold text-foreground">Visitor Analytics</h1>
            <p className="text-muted-foreground">Track and analyze your website visitors</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/admin/articles')} variant="outline" size="sm">
              Articles
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueIPs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mobile Users</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mobileUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalVisitors > 0 ? Math.round((stats.mobileUsers / stats.totalVisitors) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desktop Users</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.desktopUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalVisitors > 0 ? Math.round((stats.desktopUsers / stats.totalVisitors) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Visitors
              </CardTitle>
              <div className="flex items-center gap-3">
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="3m">Last 3 Months</SelectItem>
                    <SelectItem value="6m">Last 6 Months</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visited_at-desc">Date (Newest)</SelectItem>
                      <SelectItem value="visited_at-asc">Date (Oldest)</SelectItem>
                      <SelectItem value="ip_address-asc">IP Address (A-Z)</SelectItem>
                      <SelectItem value="ip_address-desc">IP Address (Z-A)</SelectItem>
                      <SelectItem value="device_type-asc">Device Type (A-Z)</SelectItem>
                      <SelectItem value="device_type-desc">Device Type (Z-A)</SelectItem>
                      <SelectItem value="browser-asc">Browser (A-Z)</SelectItem>
                      <SelectItem value="browser-desc">Browser (Z-A)</SelectItem>
                      <SelectItem value="country-asc">Country (A-Z)</SelectItem>
                      <SelectItem value="country-desc">Country (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitors.map((visitor) => (
                <div key={visitor.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(visitor.device_type)}
                      <Badge variant="secondary">{visitor.device_type}</Badge>
                      <Badge variant="outline">{visitor.browser}</Badge>
                      <Badge variant="outline">{visitor.operating_system}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(visitor.visited_at)}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">IP:</span>
                      <span>{visitor.ip_address}</span>
                    </div>

                    {(visitor.country || visitor.city) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span>{[visitor.city, visitor.country].filter(Boolean).join(', ')}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Resolution:</span>
                      <span>{visitor.screen_resolution}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Timezone:</span>
                      <span>{visitor.timezone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Language:</span>
                      <span>{visitor.language}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Referrer:</span>
                      <span className="truncate max-w-32">{visitor.referrer}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Session ID:</span> {visitor.session_id}
                  </div>
                </div>
              ))}

              {visitors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No visitors logged yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVisitors;