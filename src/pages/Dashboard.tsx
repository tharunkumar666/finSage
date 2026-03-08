import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Target, AlertCircle, PlusCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InvestmentRow {
  id: string;
  name: string;
  symbol: string;
  shares: number;
  current_price: number;
  purchase_price: number | null;
  purchase_date: string | null;
  created_at: string | null;
}

interface DebtRow {
  id: string;
  name: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number | null;
  type: string;
}

interface GoalRow {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number | null;
  category: string | null;
}

interface ActivityRow {
  id: string;
  action: string;
  description: string;
  category: string;
  created_at: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<InvestmentRow[]>([]);
  const [debts, setDebts] = useState<DebtRow[]>([]);
  const [goals, setGoals] = useState<GoalRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [investmentsRes, debtsRes, goalsRes, activitiesRes] = await Promise.all([
        supabase.from('investments').select('*').order('created_at', { ascending: false }),
        supabase.from('debts').select('*').order('created_at', { ascending: false }),
        supabase.from('financial_goals').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_history').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      if (investmentsRes.data) setInvestments(investmentsRes.data);
      if (debtsRes.data) setDebts(debtsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Computed values from real data
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.current_price), 0);
  const totalPurchaseValue = investments.reduce((sum, inv) => sum + (inv.shares * (inv.purchase_price || inv.current_price)), 0);
  const overallGainLoss = totalPurchaseValue > 0 ? ((totalInvestmentValue - totalPurchaseValue) / totalPurchaseValue) * 100 : 0;
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const avgDebtRate = debts.length > 0 ? debts.reduce((sum, d) => sum + d.interest_rate, 0) / debts.length : 0;

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Investor';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your financial journey
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalInvestmentValue.toLocaleString('en-IN')}</div>
              <p className={`text-xs ${overallGainLoss >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {overallGainLoss >= 0 ? '+' : ''}{overallGainLoss.toFixed(1)}% overall returns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holdings</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investments.length}</div>
              <p className="text-xs text-muted-foreground">
                Active investments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">
                Financial goals set
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalDebt.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-destructive">
                {debts.length > 0 ? `Avg rate: ${avgDebtRate.toFixed(1)}%` : 'No debts recorded'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio and Goals */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio</CardTitle>
              <CardDescription>Your current holdings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {investments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-3">No investments yet</p>
                  <Link to="/investments">
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Your First Investment
                    </Button>
                  </Link>
                </div>
              ) : (
                investments.slice(0, 5).map((inv) => {
                  const value = inv.shares * inv.current_price;
                  const percentage = totalInvestmentValue > 0 ? (value / totalInvestmentValue) * 100 : 0;
                  const gainLoss = inv.purchase_price 
                    ? ((inv.current_price - inv.purchase_price) / inv.purchase_price) * 100 
                    : 0;
                  return (
                    <div key={inv.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{inv.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({inv.symbol})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">₹{value.toLocaleString('en-IN')}</span>
                          <span className={`text-xs ml-2 ${gainLoss >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })
              )}
              {investments.length > 5 && (
                <Link to="/investments" className="block text-center">
                  <Button variant="link" size="sm">View all {investments.length} investments</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Financial Goals</CardTitle>
                  <CardDescription>Track your progress</CardDescription>
                </div>
                <Link to="/goals">
                  <Button variant="outline" size="sm">Manage Goals</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-3">No goals set yet</p>
                  <Link to="/goals">
                    <Button size="sm">
                      <Target className="h-4 w-4 mr-2" />
                      Set Your First Goal
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {goals.slice(0, 4).map((goal) => {
                    const current = goal.current_amount || 0;
                    const progress = goal.target_amount > 0 ? (current / goal.target_amount) * 100 : 0;
                    return (
                      <div key={goal.id}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-sm">{goal.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            ₹{current.toLocaleString('en-IN')} / ₹{goal.target_amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <Progress value={Math.min(progress, 100)} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% complete</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/investments">
                <Button className="h-20 w-full flex flex-col space-y-2">
                  <PlusCircle className="h-6 w-6" />
                  <span>Add Investment</span>
                </Button>
              </Link>
              
              <Link to="/goals">
                <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                  <Target className="h-6 w-6" />
                  <span>Set Goal</span>
                </Button>
              </Link>
              
              <Link to="/debt">
                <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                  <AlertCircle className="h-6 w-6" />
                  <span>Manage Debt</span>
                </Button>
              </Link>
              
              <Link to="/reports">
                <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity and Debt Overview */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.created_at ? new Date(activity.created_at).toLocaleDateString('en-IN') : ''}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {activity.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debt Overview</CardTitle>
              <CardDescription>Track your debt repayment</CardDescription>
            </CardHeader>
            <CardContent>
              {debts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-3">No debts recorded 🎉</p>
                  <Link to="/debt">
                    <Button variant="outline" size="sm">Add Debt to Track</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {debts.map((debt) => (
                    <div key={debt.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{debt.name}</h4>
                        <span className="text-sm text-muted-foreground">{debt.interest_rate}% APR</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">₹{debt.balance.toLocaleString('en-IN')}</span>
                        {debt.minimum_payment && (
                          <span className="text-sm text-primary">
                            ₹{debt.minimum_payment.toLocaleString('en-IN')}/month
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
