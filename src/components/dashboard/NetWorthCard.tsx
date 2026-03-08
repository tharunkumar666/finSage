import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Investment, Debt } from '@/types';

interface NetWorthCardProps {
  investments: Investment[];
  debts: Debt[];
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) =>
    `₹${Math.round(v).toLocaleString('en-IN')}`
  );

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [value, motionValue]);

  return <motion.span>{display}</motion.span>;
};

const NetWorthCard = ({ investments, debts }: NetWorthCardProps) => {
  const totalPortfolio = investments.reduce(
    (sum, inv) => sum + Number(inv.shares) * Number(inv.current_price),
    0
  );
  const totalDebt = debts.reduce((sum, d) => sum + Number(d.balance), 0);
  const netWorth = totalPortfolio - totalDebt;
  const isPositive = netWorth >= 0;

  return (
    <Card className="rounded-2xl border-border mb-8 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Net Worth</p>
            <p
              className={`text-3xl sm:text-4xl font-display font-bold ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              <AnimatedNumber value={netWorth} />
            </p>
            <div className="flex gap-6 mt-3 text-sm text-muted-foreground">
              <span>Assets: ₹{totalPortfolio.toLocaleString('en-IN')}</span>
              <span>Debts: ₹{totalDebt.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-primary/10 p-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
