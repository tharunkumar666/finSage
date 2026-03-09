import { useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useCreateInvestment } from '@/hooks/useInvestments';
import type { StockInsightsResponse } from '@/types';

const investmentSchema = z.object({
  name: z.string().trim().min(1, 'Investment name is required').max(100, 'Name must be less than 100 characters'),
  symbol: z.string().trim().min(1, 'Symbol is required').max(10, 'Symbol must be less than 10 characters'),
  shares: z.number().positive('Shares must be greater than 0'),
  currentPrice: z.number().positive('Price must be greater than 0'),
  purchasePrice: z.number().positive('Purchase price must be greater than 0').optional(),
  purchaseDate: z.string().optional()
});

interface AddInvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddInvestmentDialog = ({ open, onOpenChange, onSuccess }: AddInvestmentDialogProps) => {
  const { toast } = useToast();
  const createMutation = useCreateInvestment();
  const [stockInsights, setStockInsights] = useState<StockInsightsResponse | null>(null);
  const [isValidatingStock, setIsValidatingStock] = useState(false);
  const [isFetchingInsights, setIsFetchingInsights] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    symbol: '',
    shares: 0,
    currentPrice: 0,
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const validateAndFetchStockData = async (symbol: string) => {
    if (!symbol || symbol.length < 2) {
      setStockInsights(null);
      return;
    }
    setIsValidatingStock(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: 'Authentication required', description: 'Please log in to validate stocks', variant: 'destructive' });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-insights`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: symbol.toUpperCase(), action: 'price' }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast({ title: 'Invalid Stock', description: errorData.error || 'Stock symbol not found', variant: 'destructive' });
        setStockInsights(null);
        return;
      }
      const data = await response.json();
      setStockInsights(data);
      setNewInvestment(prev => ({ ...prev, name: data.name, currentPrice: data.currentPrice, purchasePrice: data.currentPrice }));
      toast({ title: 'Stock Validated', description: `${data.name} - Current Price: ₹${data.currentPrice.toLocaleString()}` });
    } catch (error) {
      console.error('Error validating stock:', error);
      toast({ title: 'Error', description: 'Failed to validate stock', variant: 'destructive' });
      setStockInsights(null);
    } finally {
      setIsValidatingStock(false);
    }
  };

  const fetchStockInsights = async (symbol: string) => {
    setIsFetchingInsights(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-insights`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: symbol.toUpperCase(), action: 'all', userBudget: newInvestment.shares * newInvestment.currentPrice }),
        }
      );
      if (!response.ok) throw new Error('Failed to fetch insights');
      const data = await response.json();
      setStockInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast({ title: 'Error', description: 'Failed to fetch AI insights', variant: 'destructive' });
    } finally {
      setIsFetchingInsights(false);
    }
  };

  const addInvestment = async () => {
    try {
      const validatedData = investmentSchema.parse(newInvestment);
      await createMutation.mutateAsync({
        name: validatedData.name,
        symbol: validatedData.symbol,
        shares: validatedData.shares,
        current_price: validatedData.currentPrice,
        purchase_price: validatedData.purchasePrice || validatedData.currentPrice,
        purchase_date: validatedData.purchaseDate || new Date().toISOString().split('T')[0],
      });
      setNewInvestment({ name: '', symbol: '', shares: 0, currentPrice: 0, purchasePrice: 0, purchaseDate: new Date().toISOString().split('T')[0] });
      setStockInsights(null);
      onOpenChange(false);
      onSuccess();
      toast({ title: 'Investment added', description: 'Your investment has been successfully added to your portfolio.' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: 'Invalid input', description: error.issues[0].message, variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: 'Failed to add investment', variant: 'destructive' });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
          <DialogDescription>Enter the details of your new investment.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Investment Name</Label>
            <Input id="name" value={newInvestment.name} onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })} placeholder="e.g., Reliance Industries" />
          </div>
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <div className="flex gap-2">
              <Input id="symbol" value={newInvestment.symbol} onChange={(e) => setNewInvestment({ ...newInvestment, symbol: e.target.value.toUpperCase() })} onBlur={(e) => validateAndFetchStockData(e.target.value)} placeholder="e.g., RELIANCE.NS, TCS.NS" className="flex-1" />
              <Button type="button" variant="outline" size="icon" onClick={() => validateAndFetchStockData(newInvestment.symbol)} disabled={isValidatingStock || !newInvestment.symbol}>
                <RefreshCw className={`h-4 w-4 ${isValidatingStock ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Add .NS for NSE or .BO for BSE stocks (e.g., RELIANCE.NS, TCS.BO, INFY.NS)</p>
          </div>

          {stockInsights && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <Sparkles className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm">
                <div className="font-semibold text-green-900 dark:text-green-100">{stockInsights.name}</div>
                <div className="text-green-700 dark:text-green-300 mt-1">
                  Current: ₹{stockInsights.currentPrice.toLocaleString()}
                  <span className={stockInsights.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {' '}({stockInsights.priceChange >= 0 ? '+' : ''}{stockInsights.priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
                {stockInsights.insights && (
                  <Button type="button" variant="link" size="sm" className="h-auto p-0 mt-2 text-green-700 dark:text-green-300" onClick={() => fetchStockInsights(newInvestment.symbol)} disabled={isFetchingInsights}>
                    {isFetchingInsights ? 'Loading...' : 'View AI Insights'}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {stockInsights?.insights && (
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-wrap">
                <div className="font-semibold mb-2">AI Investment Insights:</div>
                {stockInsights.insights}
                {stockInsights.canInvest !== undefined && (
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    {stockInsights.canInvest ? (
                      <div className="text-green-700 dark:text-green-300">✓ You can afford {stockInsights.affordableShares} shares</div>
                    ) : (
                      <div className="text-red-700 dark:text-red-300">✗ Insufficient funds for this investment</div>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="shares">Number of Shares</Label>
            <Input id="shares" type="number" min="0.001" step="0.001" value={newInvestment.shares || ''} onChange={(e) => setNewInvestment({ ...newInvestment, shares: parseFloat(e.target.value) || 0 })} placeholder="e.g., 10" />
          </div>
          <div>
            <Label htmlFor="price">Current Price (₹)</Label>
            <Input id="price" type="number" min="0.01" step="0.01" value={newInvestment.currentPrice || ''} onChange={(e) => setNewInvestment({ ...newInvestment, currentPrice: parseFloat(e.target.value) || 0 })} placeholder="e.g., 2845.50" />
          </div>
          <div>
            <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
            <Input id="purchasePrice" type="number" min="0.01" step="0.01" value={newInvestment.purchasePrice || ''} onChange={(e) => setNewInvestment({ ...newInvestment, purchasePrice: parseFloat(e.target.value) || 0 })} placeholder="e.g., 2600.00" />
          </div>
          <div>
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input id="purchaseDate" type="date" value={newInvestment.purchaseDate} onChange={(e) => setNewInvestment({ ...newInvestment, purchaseDate: e.target.value })} />
          </div>
          <Button onClick={addInvestment} className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Adding...' : 'Add Investment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentDialog;
