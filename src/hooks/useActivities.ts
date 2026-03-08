import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ActivityLog } from '@/types';

async function fetchActivities(limit: number): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data as ActivityLog[];
}

export function useActivities(limit = 5) {
  return useQuery({
    queryKey: ['activities', limit],
    queryFn: () => fetchActivities(limit),
    staleTime: 5 * 60 * 1000,
  });
}
