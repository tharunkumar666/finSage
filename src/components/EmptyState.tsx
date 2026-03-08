import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h4 className="font-display font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref}>
          <Button size="sm" className="gradient-bg text-primary-foreground rounded-xl text-xs">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
