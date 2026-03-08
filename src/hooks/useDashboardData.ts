import { useInvestments } from './useInvestments';
import { useDebts } from './useDebts';
import { useGoals } from './useGoals';
import { useActivities } from './useActivities';
import type { DashboardData } from '@/types';

export function useDashboardData() {
  const investments = useInvestments();
  const debts = useDebts();
  const goals = useGoals();
  const activities = useActivities(10);

  const isLoading = investments.isLoading || debts.isLoading || goals.isLoading || activities.isLoading;
  const error = investments.error || debts.error || goals.error || activities.error;

  const data: DashboardData | undefined =
    !isLoading && !error
      ? {
          investments: investments.data ?? [],
          debts: debts.data ?? [],
          goals: goals.data ?? [],
          activities: activities.data ?? [],
        }
      : undefined;

  return { data, isLoading, error };
}
