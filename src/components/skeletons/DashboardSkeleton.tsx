import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 rounded-2xl mb-2" />
        <Skeleton className="h-4 w-48 rounded-2xl" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Two list cards */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>

      {/* Quick actions */}
      <Skeleton className="h-28 rounded-2xl mb-8" />

      {/* Bottom cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
