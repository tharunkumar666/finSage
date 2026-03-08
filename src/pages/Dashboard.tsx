import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import PageTransition from '@/components/PageTransition';
import NetWorthCard from '@/components/dashboard/NetWorthCard';
import PortfolioChart from '@/components/dashboard/PortfolioChart';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardPortfolio from '@/components/dashboard/DashboardPortfolio';
import DashboardGoals from '@/components/dashboard/DashboardGoals';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import DashboardActivity from '@/components/dashboard/DashboardActivity';
import DashboardDebtOverview from '@/components/dashboard/DashboardDebtOverview';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useDashboardData();

  const investments = data?.investments ?? [];
  const debts = data?.debts ?? [];
  const goals = data?.goals ?? [];
  const activities = data?.activities ?? [];
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Investor';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Card className="rounded-2xl border-border max-w-md w-full">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
              <h2 className="text-lg font-display font-semibold text-foreground mb-2">Failed to load dashboard data</h2>
              <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
              <Button
                onClick={() => queryClient.invalidateQueries()}
                className="gradient-bg text-primary-foreground rounded-xl"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <NetWorthCard investments={investments} debts={debts} />

          <DashboardMetrics investments={investments} debts={debts} goals={goals} />

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <DashboardPortfolio investments={investments} />
            <DashboardGoals goals={goals} />
          </div>

          <div className="mb-8">
            <PortfolioChart investments={investments} />
          </div>

          <DashboardQuickActions />

          <div className="grid lg:grid-cols-2 gap-6">
            <DashboardActivity activities={activities} />
            <DashboardDebtOverview debts={debts} />
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Dashboard;
