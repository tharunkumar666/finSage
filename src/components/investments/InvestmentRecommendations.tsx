import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { InvestmentWithMetrics } from '@/types';

interface InvestmentRecommendationsProps {
  investments: InvestmentWithMetrics[];
  riskProfile?: string;
}

const InvestmentRecommendations = ({ investments, riskProfile = 'Moderate' }: InvestmentRecommendationsProps) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: 'Authentication required', description: 'Please log in', variant: 'destructive' });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-advisor`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'Based on my current portfolio, suggest personalized investment recommendations for the Indian market. Include specific fund names, risk levels, expected returns, and reasoning.',
            context: {
              investments: investments.map(inv => ({ name: inv.name, symbol: inv.symbol, value: inv.totalValue })),
              riskProfile,
            },
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data.advice);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({ title: 'Error', description: 'Failed to fetch AI recommendations', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI Investment Recommendations
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Get personalized recommendations based on your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!recommendations && !isLoading && (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Click to get personalized AI recommendations</p>
            <Button onClick={fetchRecommendations} className="bg-primary hover:bg-primary/90">
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Recommendations
            </Button>
          </div>
        )}
        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Analyzing your portfolio and generating recommendations...</p>
          </div>
        )}
        {recommendations && !isLoading && (
          <div className="space-y-4">
            <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap text-foreground">
              {recommendations}
            </div>
            <Button variant="outline" onClick={fetchRecommendations} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentRecommendations;
