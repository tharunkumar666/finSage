import { DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { InvestmentWithMetrics } from '@/types';

interface InvestmentOverviewProps {
  investments: InvestmentWithMetrics[];
}

const InvestmentOverview = ({ investments }: InvestmentOverviewProps) => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);
  const totalGainLoss = investments.reduce((sum, inv) => sum + inv.gainLoss, 0);
  const todayChangePercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

  return (
    <>
      {/* Portfolio Value Card */}
      <div className="grid md:grid-cols-1 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{totalValue.toLocaleString()}
                </p>
                <p className={`text-sm ${todayChangePercent >= 0 ? 'text-green-600' : 'text-red-500 dark:text-red-400'}`}>
                  {todayChangePercent >= 0 ? '+' : ''}₹{totalGainLoss.toLocaleString()}
                  ({todayChangePercent >= 0 ? '+' : ''}{todayChangePercent.toFixed(2)}%)
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Analysis Tab Content (exported separately for use in tabs) */}
    </>
  );
};

export const PortfolioAnalysis = ({ investments }: InvestmentOverviewProps) => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);
  const totalGainLoss = investments.reduce((sum, inv) => sum + inv.gainLoss, 0);
  const todayChangePercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <PieChart className="h-5 w-5 text-purple-600" />
            Portfolio Breakdown
          </CardTitle>
          <CardDescription className="text-muted-foreground">Your holdings by value</CardDescription>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <div className="space-y-4">
              {investments.map((inv) => {
                const pct = totalValue > 0 ? (inv.totalValue / totalValue) * 100 : 0;
                return (
                  <div key={inv.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">{inv.symbol}</span>
                      <span className="text-sm text-muted-foreground">
                        {pct.toFixed(1)}% (₹{inv.totalValue.toLocaleString()})
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Add investments to see your portfolio breakdown</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Performance Summary
          </CardTitle>
          <CardDescription className="text-muted-foreground">Based on your actual holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-300">Total Gain/Loss</p>
                <p className={`text-xl font-bold ${totalGainLoss >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {totalGainLoss >= 0 ? '+' : ''}₹{totalGainLoss.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-300">Return %</p>
                <p className={`text-xl font-bold ${todayChangePercent >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
                  {todayChangePercent >= 0 ? '+' : ''}{todayChangePercent.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-300">Holdings</p>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{investments.length}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                <p className="text-sm text-orange-600 dark:text-orange-300">Portfolio Value</p>
                <p className="text-xl font-bold text-orange-700 dark:text-orange-300">₹{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentOverview;
