import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { motion } from 'framer-motion';
import type { Investment } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
  }),
};

interface DashboardPortfolioProps {
  investments: Investment[];
}

const DashboardPortfolio = ({ investments }: DashboardPortfolioProps) => {
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.current_price), 0);

  return (
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
            <EmptyState
              icon={TrendingUp}
              title="No investments yet"
              description="Start building your portfolio by adding your first investment."
              actionLabel="Add Investment"
              actionHref="/investments"
            />
          ) : (
            <div className="space-y-3">
              {investments.slice(0, 5).map((inv) => {
                const value = inv.shares * inv.current_price;
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
  );
};

export default DashboardPortfolio;
