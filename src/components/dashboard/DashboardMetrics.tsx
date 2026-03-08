import { ArrowUpRight, ArrowDownRight, Wallet, BarChart3, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { Investment, Debt, FinancialGoal } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
  }),
};

interface DashboardMetricsProps {
  investments: Investment[];
  debts: Debt[];
  goals: FinancialGoal[];
}

const DashboardMetrics = ({ investments, debts, goals }: DashboardMetricsProps) => {
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.current_price), 0);
  const totalPurchaseValue = investments.reduce((sum, inv) => sum + (inv.shares * (inv.purchase_price || inv.current_price)), 0);
  const overallGainLoss = totalPurchaseValue > 0 ? ((totalInvestmentValue - totalPurchaseValue) / totalPurchaseValue) * 100 : 0;
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const avgDebtRate = debts.length > 0 ? debts.reduce((sum, d) => sum + d.interest_rate, 0) / debts.length : 0;

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
  );
};

export default DashboardMetrics;
