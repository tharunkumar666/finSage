import { supabase } from '@/integrations/supabase/client';
import type { AIAdvisorRequest, AIAdvisorResponse, StockInsightsRequest, StockInsightsResponse } from '@/types';

export async function getAIAdvice(request: AIAdvisorRequest): Promise<AIAdvisorResponse> {
  const { data, error } = await supabase.functions.invoke('ai-advisor', { body: request });

  if (error) throw new Error(error.message);
  return data as AIAdvisorResponse;
}

export async function getStockInsights(request: StockInsightsRequest): Promise<StockInsightsResponse> {
  const { data, error } = await supabase.functions.invoke('stock-insights', { body: request });

  if (error) throw new Error(error.message);
  return data as StockInsightsResponse;
}

export async function getFinancialData(symbol: string, period?: string, interval?: string) {
  const { data, error } = await supabase.functions.invoke('financial-data', {
    body: { symbol, period, interval },
  });

  if (error) throw new Error(error.message);
  return data;
}
