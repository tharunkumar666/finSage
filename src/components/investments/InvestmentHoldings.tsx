import { TrendingUp, Trash2, Edit2, MoreVertical } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { InvestmentWithMetrics } from '@/types';

interface InvestmentHoldingsProps {
  investments: InvestmentWithMetrics[];
  isLoading: boolean;
  onEdit: (investment: InvestmentWithMetrics) => void;
  onDelete: (id: string) => void;
}

const InvestmentHoldings = ({ investments, isLoading, onEdit, onDelete }: InvestmentHoldingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Your Investments
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your current investment portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="border rounded-lg p-4 border-border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{investment.name}</h3>
                    <p className="text-sm text-muted-foreground">{investment.symbol}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">₹{investment.totalValue.toLocaleString()}</p>
                      <p className={`text-sm ${investment.gainLoss >= 0 ? 'text-green-600' : 'text-red-500 dark:text-red-400'}`}>
                        {investment.gainLoss >= 0 ? '+' : ''}₹{investment.gainLoss} ({investment.gainLossPercent >= 0 ? '+' : ''}{investment.gainLossPercent}%)
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" aria-label={`Options for ${investment.name}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit(investment)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(investment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Shares</p>
                    <p className="font-semibold text-foreground">{investment.shares}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price per Share</p>
                    <p className="font-semibold text-foreground">₹{investment.current_price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-semibold text-foreground">₹{investment.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}

            {investments.length === 0 && (
              <EmptyState
                icon={TrendingUp}
                title="No investments yet"
                description="Add your first investment to get started!"
                actionLabel="Add Investment"
                actionHref="/investments"
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentHoldings;
