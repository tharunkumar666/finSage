import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Target, AlertCircle, PlusCircle, Loader2, ArrowUpRight, ArrowDownRight, BarChart3, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
  }),
};

const Dashboard = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<InvestmentRow[]>([]);
  const [debts, setDebts] = useState<DebtRow[]>([]);
  const [goals, setGoals] = useState<GoalRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
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
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Portfolio Value',
      value: `₹${totalInvestmentValue.toLocaleString('en-IN')}`,
      change: `${overallGainLoss >= 0 ? '+' : ''}${overallGainLoss.toFixed(1)}%`,
      isPositive: overallGainLoss >= 0,
      icon: Wallet,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Active Holdings',
      value: investments.length.toString(),
      change: 'investments',
      isPositive: true,
      icon: BarChart3,
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
    },
    {
      title: 'Goals Set',
      value: goals.length.toString(),
      change: 'financial goals',
      isPositive: true,
      icon: Target,
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      title: 'Total Debt',
      value: `₹${totalDebt.toLocaleString('en-IN')}`,
      change: debts.length > 0 ? `${avgDebtRate.toFixed(1)}% avg rate` : 'Debt free!',
      isPositive: totalDebt === 0,
      icon: AlertCircle,
      iconBg: totalDebt > 0 ? 'bg-destructive/10' : 'bg-primary/10',
      iconColor: totalDebt > 0 ? 'text-destructive' : 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-muted-foreground text-sm">Here's your financial overview</p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, i) => (
            <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
              <Card className="hover-lift rounded-2xl border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${metric.iconBg} flex items-center justify-center`}>
                      <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                    </div>
                    <div className={`flex items-center space-x-1 text-xs font-medium ${metric.isPositive ? 'text-primary' : 'text-destructive'}`}>
                      {metric.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold text-foreground">{metric.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{metric.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Portfolio & Goals */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <Card className="rounded-2xl border-border h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-display font-semibold">Investment Portfolio</CardTitle>
                    <CardDescription className="text-xs">Your current holdings</CardDescription>
                  </div>
                  <Link to="/investments">
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 rounded-lg">
                      View all
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {investments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">No investments yet</p>
                    <Link to="/investments">
                      <Button size="sm" className="gradient-bg text-primary-foreground rounded-xl text-xs">
                        <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                        Add Investment
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {investments.slice(0, 5).map((inv) => {
                      const value = inv.shares * inv.current_price;
                      const percentage = totalInvestmentValue > 0 ? (value / totalInvestmentValue) * 100 : 0;
                      const gainLoss = inv.purchase_price ? ((inv.current_price - inv.purchase_price) / inv.purchase_price) * 100 : 0;
                      return (
                        <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-display font-bold text-primary">{inv.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{inv.name}</p>
                              <p className="text-xs text-muted-foreground">{inv.shares} shares</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">₹{value.toLocaleString('en-IN')}</p>
                            <p className={`text-xs font-medium ${gainLoss >= 0 ? 'text-primary' : 'text-destructive'}`}>
                              {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <Card className="rounded-2xl border-border h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-display font-semibold">Financial Goals</CardTitle>
                    <CardDescription className="text-xs">Track your progress</CardDescription>
                  </div>
                  <Link to="/goals">
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 rounded-lg">
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {goals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">No goals set yet</p>
                    <Link to="/goals">
                      <Button size="sm" className="gradient-bg text-primary-foreground rounded-xl text-xs">
                        <Target className="h-3.5 w-3.5 mr-1.5" />
                        Set a Goal
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {goals.slice(0, 4).map((goal) => {
                      const current = goal.current_amount || 0;
                      const progress = goal.target_amount > 0 ? (current / goal.target_amount) * 100 : 0;
                      return (
                        <div key={goal.id}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-foreground">{goal.name}</h4>
                              {goal.category && (
                                <Badge variant="secondary" className="text-[10px] rounded-md px-1.5 py-0">
                                  {goal.category}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2 rounded-full" />
                          <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-muted-foreground">₹{current.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-muted-foreground">₹{goal.target_amount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
          <Card className="rounded-2xl border-border mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-display font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: PlusCircle, label: 'Add Investment', href: '/investments', variant: 'default' as const },
                  { icon: Target, label: 'Set Goal', href: '/goals', variant: 'outline' as const },
                  { icon: AlertCircle, label: 'Manage Debt', href: '/debt', variant: 'outline' as const },
                  { icon: TrendingUp, label: 'View Reports', href: '/reports', variant: 'outline' as const },
                ].map(({ icon: Icon, label, href, variant }, i) => (
                  <Link key={i} to={href}>
                    <Button variant={variant === 'default' ? 'default' : 'outline'} className={`h-16 w-full flex flex-col space-y-1.5 rounded-xl text-xs ${variant === 'default' ? 'gradient-bg text-primary-foreground' : ''}`}>
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity & Debt */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
            <Card className="rounded-2xl border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-display font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No recent activity</p>
                ) : (
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.created_at ? new Date(activity.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] rounded-md">{activity.category}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}>
            <Card className="rounded-2xl border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-display font-semibold">Debt Overview</CardTitle>
                  <Link to="/debt">
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 rounded-lg">Manage</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {debts.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No debts recorded 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {debts.map((debt) => (
                      <div key={debt.id} className="p-3 rounded-xl border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium text-foreground">{debt.name}</h4>
                          <Badge variant="secondary" className="text-[10px] rounded-md">{debt.interest_rate}%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base font-display font-bold text-foreground">₹{debt.balance.toLocaleString('en-IN')}</span>
                          {debt.minimum_payment && (
                            <span className="text-xs text-muted-foreground">₹{debt.minimum_payment.toLocaleString('en-IN')}/mo</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
