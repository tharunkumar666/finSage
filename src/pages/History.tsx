
import { useState } from 'react';
import { Calendar, Filter, TrendingUp, DollarSign, Target, AlertCircle, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const History = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('30');

  // Enhanced history data with calculator results
  const historyData = [
    {
      id: 1,
      type: 'calculation',
      action: 'SIP Calculator',
      description: 'Calculated SIP for $1,000/month, 12% return, 10 years - Maturity: $230,039',
      amount: null,
      date: '2024-01-16',
      icon: Calculator,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'investment',
      action: 'Investment Added',
      description: 'Added $500 to S&P 500 ETF',
      amount: 500,
      date: '2024-01-15',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'calculation',
      action: 'Debt Payoff Calculator',
      description: 'Calculated payoff for $10,000 debt at 18% - 24 months to payoff',
      amount: null,
      date: '2024-01-12',
      icon: Calculator,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 4,
      type: 'quiz',
      action: 'Risk Assessment',
      description: 'Completed risk profiling quiz - Result: Moderate',
      amount: null,
      date: '2024-01-10',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 5,
      type: 'debt',
      action: 'Debt Updated',
      description: 'Updated student loan payment strategy to Avalanche method',
      amount: null,
      date: '2024-01-08',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 6,
      type: 'calculation',
      action: 'Step-up SIP Calculator',
      description: 'Calculated step-up SIP with 10% annual increase - Additional benefit: $45,230',
      amount: null,
      date: '2024-01-07',
      icon: Calculator,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 7,
      type: 'investment',
      action: 'Investment Added',
      description: 'Added $250 to Bitcoin',
      amount: 250,
      date: '2024-01-05',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 8,
      type: 'premium',
      action: 'Premium Upgrade',
      description: 'Upgraded to Premium plan for advanced analytics',
      amount: 19.99,
      date: '2024-01-01',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 9,
      type: 'investment',
      action: 'Investment Withdrawal',
      description: 'Withdrew $100 from cash reserves',
      amount: -100,
      date: '2023-12-28',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 10,
      type: 'debt',
      action: 'Debt Added',
      description: 'Added new credit card debt - $1,200 at 18.9% APR',
      amount: null,
      date: '2023-12-20',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const filteredHistory = historyData.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  }).filter(item => {
    const itemDate = new Date(item.date);
    const now = new Date();
    const daysAgo = parseInt(filterDate);
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    return itemDate >= cutoffDate;
  });

  const getActionBadge = (type) => {
    switch (type) {
      case 'investment':
        return <Badge className="bg-green-100 text-green-800">Investment</Badge>;
      case 'debt':
        return <Badge className="bg-red-100 text-red-800">Debt</Badge>;
      case 'quiz':
        return <Badge className="bg-blue-100 text-blue-800">Assessment</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'calculation':
        return <Badge className="bg-orange-100 text-orange-800">Calculator</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Activity History
          </h1>
          <p className="text-gray-600">
            Track all your financial activities and decisions
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Activity Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="investment">Investments</SelectItem>
                    <SelectItem value="debt">Debt Management</SelectItem>
                    <SelectItem value="calculation">Calculations</SelectItem>
                    <SelectItem value="quiz">Risk Assessments</SelectItem>
                    <SelectItem value="premium">Premium Features</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Time Period</label>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                    <SelectItem value="999999">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {historyData.filter(item => item.type === 'investment').length}
                </div>
                <p className="text-sm text-gray-600">Investment Actions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {historyData.filter(item => item.type === 'calculation').length}
                </div>
                <p className="text-sm text-gray-600">Calculations Made</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {historyData.filter(item => item.type === 'debt').length}
                </div>
                <p className="text-sm text-gray-600">Debt Activities</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <Calendar className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No activities found</p>
                <p className="text-sm">Try changing your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex">
                    <div className={`mr-4 ${item.bgColor} p-2 rounded-full`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.action}</h3>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(item.date)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      
                      <div className="flex justify-between mt-3">
                        <div>
                          {getActionBadge(item.type)}
                        </div>
                        
                        <div className="text-sm">
                          {item.amount !== null && (
                            <span className={item.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {item.amount >= 0 ? '+' : ''}${Math.abs(item.amount)}
                            </span>
                          )}
                          <span className="text-gray-500 ml-2">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredHistory.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;
