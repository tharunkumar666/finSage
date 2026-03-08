import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/EmptyState';
import { motion } from 'framer-motion';
import type { FinancialGoal } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
  }),
};

interface DashboardGoalsProps {
  goals: FinancialGoal[];
}

const DashboardGoals = ({ goals }: DashboardGoalsProps) => {
  return (
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
            <EmptyState
              icon={Target}
              title="No goals set yet"
              description="Define your financial goals and track your progress."
              actionLabel="Set a Goal"
              actionHref="/goals"
            />
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
  );
};

export default DashboardGoals;
