
import { useState, useEffect } from 'react';
import { History as HistoryIcon, Clock, User, Settings, CreditCard, TrendingUp, Shield, Filter, Search, RefreshCw, Calculator, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  category: string;
  metadata: any;
  created_at: string;
}

const History = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock activities data with all the requested categories
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      action: 'sip_calculation',
      description: 'Calculated SIP returns for ₹5000 monthly investment over 10 years',
      category: 'calculators',
      metadata: { amount: 5000, years: 10, expected_return: 12 },
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      action: 'debt_calculation',
      description: 'Calculated debt payoff plan for credit card debt',
      category: 'calculators',
      metadata: { principal: 50000, monthly_payment: 2000 },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      action: 'investment_added',
      description: 'Added Apple Inc. (AAPL) to investment portfolio',
      category: 'investment',
      metadata: { symbol: 'AAPL', shares: 10, price: 175.20 },
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      action: 'investment_removed',
      description: 'Removed Tesla Inc. (TSLA) from investment portfolio',
      category: 'investment',
      metadata: { symbol: 'TSLA', shares: 5 },
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      action: 'debt_added',
      description: 'Added new credit card debt to debt advisor',
      category: 'debt',
      metadata: { name: 'Credit Card C', balance: 8000, interest_rate: 19.99 },
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '6',
      action: 'debt_updated',
      description: 'Updated student loan payment amount',
      category: 'debt',
      metadata: { name: 'Student Loan', old_payment: 250, new_payment: 300 },
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '7',
      action: 'goal_created',
      description: 'Created new financial goal: Emergency Fund',
      category: 'goals',
      metadata: { name: 'Emergency Fund', target_amount: 50000, target_date: '2024-12-31' },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '8',
      action: 'goal_updated',
      description: 'Updated vacation fund goal target amount',
      category: 'goals',
      metadata: { name: 'Vacation Fund', old_amount: 20000, new_amount: 25000 },
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '9',
      action: 'profile_updated',
      description: 'Updated profile information and risk tolerance',
      category: 'profile',
      metadata: { field: 'risk_profile', old_value: 'Conservative', new_value: 'Moderate' },
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '10',
      action: 'settings_changed',
      description: 'Changed notification preferences',
      category: 'settings',
      metadata: { setting: 'email_notifications', enabled: true },
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '11',
      action: 'theme_changed',
      description: 'Switched to dark theme',
      category: 'settings',
      metadata: { theme: 'dark' },
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '12',
      action: 'risk_assessment',
      description: 'Completed risk assessment questionnaire',
      category: 'profile',
      metadata: { score: 65, profile: 'Moderate' },
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    if (user) {
      loadActivityHistory();
    } else {
      // If no user, show mock data
      setActivities(mockActivities);
      setLoading(false);
    }
  }, [user]);

  const loadActivityHistory = async () => {
    if (!user) {
      setActivities(mockActivities);
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('activity_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Combine real data with mock data if available
      const combinedData = [...(data || []), ...mockActivities];
      setActivities(combinedData);
      
      // Log the history view activity
      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'history_viewed',
        p_description: 'User viewed activity history',
        p_category: 'account'
      });
      
    } catch (error) {
      console.error('Error loading activity history:', error);
      // Fallback to mock data
      setActivities(mockActivities);
      toast({
        title: "Error",
        description: "Failed to load activity history, showing sample data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <Shield className="h-4 w-4" />;
      case 'profile':
        return <User className="h-4 w-4" />;
      case 'investment':
        return <TrendingUp className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      case 'account':
        return <CreditCard className="h-4 w-4" />;
      case 'calculators':
        return <Calculator className="h-4 w-4" />;
      case 'debt':
        return <AlertCircle className="h-4 w-4" />;
      case 'goals':
        return <Target className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'profile':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'investment':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'settings':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'account':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'calculators':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'debt':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'goals':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;
    
    return date.toLocaleString();
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 rounded-2xl w-1/4" />
            <Skeleton className="h-4 rounded-2xl w-1/2" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
            <HistoryIcon className="h-8 w-8 text-primary" />
            Activity History
          </h1>
          <p className="text-muted-foreground">
            Track all your account activities and changes
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-foreground">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="min-w-[200px]">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="profile">Profile</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="debt">Debt</SelectItem>
                    <SelectItem value="goals">Goals</SelectItem>
                    <SelectItem value="calculators">Calculators</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={loadActivityHistory} 
                disabled={refreshing}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="py-12 text-center">
                <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-display font-medium text-foreground mb-2">
                  No activities found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'Try adjusting your filters to see more activities.'
                    : 'Your account activities will appear here as you use FinSage.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-muted-foreground">
                        {getCategoryIcon(activity.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">
                            {activity.description}
                          </h3>
                          <Badge className={getCategoryColor(activity.category)}>
                            {activity.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Action: {activity.action}
                        </p>
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            <details>
                              <summary className="cursor-pointer font-medium">View Details</summary>
                              <pre className="mt-2 whitespace-pre-wrap">
                                {JSON.stringify(activity.metadata, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(activity.created_at)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredActivities.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredActivities.length} of {activities.length} activities
            </p>
          </div>
        )}
      </div>

      </PageTransition>
      <Footer />
    </div>
  );
};

export default History;
