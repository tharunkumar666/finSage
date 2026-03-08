import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/EmptyState';
import { motion } from 'framer-motion';
import type { ActivityLog } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
  }),
};

interface DashboardActivityProps {
  activities: ActivityLog[];
}

const DashboardActivity = ({ activities }: DashboardActivityProps) => {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-display font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <EmptyState icon={Activity} title="No recent activity" description="Your actions will appear here as you use FinSage." />
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
  );
};

export default DashboardActivity;
