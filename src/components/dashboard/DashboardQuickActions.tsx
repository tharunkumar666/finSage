import { Link } from 'react-router-dom';
import { PlusCircle, Target, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const }
  }),
};

const DashboardQuickActions = () => {
  const actions = [
    { icon: PlusCircle, label: 'Add Investment', href: '/investments', variant: 'default' as const },
    { icon: Target, label: 'Set Goal', href: '/goals', variant: 'outline' as const },
    { icon: AlertCircle, label: 'Manage Debt', href: '/debt', variant: 'outline' as const },
    { icon: TrendingUp, label: 'View Reports', href: '/reports', variant: 'outline' as const },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
      <Card className="rounded-2xl border-border mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-display font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {actions.map(({ icon: Icon, label, href, variant }, i) => (
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
  );
};

export default DashboardQuickActions;
