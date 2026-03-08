import { Link } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/EmptyState';
import { motion } from 'framer-motion';
import type { Debt } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
  }),
};

interface DashboardDebtOverviewProps {
  debts: Debt[];
}

const DashboardDebtOverview = ({ debts }: DashboardDebtOverviewProps) => {
  return (
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
            <EmptyState icon={PartyPopper} title="Debt free!" description="You have no debts recorded. Keep it up! 🎉" />
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
  );
};

export default DashboardDebtOverview;
