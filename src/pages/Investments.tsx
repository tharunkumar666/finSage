
import { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Plus, Trash2, Edit2, MoreVertical, Sparkles, RefreshCw } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { useInvestments, useCreateInvestment, useUpdateInvestment, useDeleteInvestment } from '@/hooks/useInvestments';
import type { InvestmentWithMetrics, StockInsightsResponse } from '@/types';

const investmentSchema = z.object({
  name: z.string().trim().min(1, 'Investment name is required').max(100, 'Name must be less than 100 characters'),
  symbol: z.string().trim().min(1, 'Symbol is required').max(10, 'Symbol must be less than 10 characters'),
  shares: z.number().positive('Shares must be greater than 0'),
  currentPrice: z.number().positive('Price must be greater than 0'),
  purchasePrice: z.number().positive('Purchase price must be greater than 0').optional(),
  purchaseDate: z.string().optional()
});

const Investments = () => {
  const { toast } = useToast();
  const [selectedRiskProfile] = useState('Moderate');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentWithMetrics | null>(null);
  const [stockInsights, setStockInsights] = useState<StockInsightsResponse | null>(null);
  const [isValidatingStock, setIsValidatingStock] = useState(false);
  const [isFetchingInsights, setIsFetchingInsights] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const { data: rawInvestments, isLoading } = useInvestments();
  const createMutation = useCreateInvestment();
  const updateMutation = useUpdateInvestment();
  const deleteMutation = useDeleteInvestment();

  const [newInvestment, setNewInvestment] = useState({
    name: '',
    symbol: '',
    shares: 0,
    currentPrice: 0,
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  // Compute metrics from raw data
  const userInvestments: InvestmentWithMetrics[] = (rawInvestments ?? []).map(inv => {
    const totalValue = Number(inv.shares) * Number(inv.current_price);
    const purchaseValue = inv.purchase_price ? Number(inv.shares) * Number(inv.purchase_price) : totalValue;
    const gainLoss = totalValue - purchaseValue;
    const gainLossPercent = purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;
    return { ...inv, totalValue, gainLoss, gainLossPercent };
  });

  // Calculate portfolio data from actual investments
  const calculatePortfolioData = () => {
    const totalValue = userInvestments.reduce((sum, inv) => sum + inv.totalValue, 0);
    const totalGainLoss = userInvestments.reduce((sum, inv) => sum + inv.gainLoss, 0);
    const todayChangePercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

    return {
      totalValue,
      todayChange: totalGainLoss,
      todayChangePercent,
    };
  };

  const portfolioData = calculatePortfolioData();

  const fetchRecommendations = async () => {
    setIsLoadingRecommendations(true);
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
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: 'Based on my current portfolio, suggest personalized investment recommendations for the Indian market. Include specific fund names, risk levels, expected returns, and reasoning.',
            context: {
              investments: userInvestments.map(inv => ({ name: inv.name, symbol: inv.symbol, value: inv.totalValue })),
              riskProfile: selectedRiskProfile,
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
      setIsLoadingRecommendations(false);
    }
  };

  const validateAndFetchStockData = async (symbol: string) => {
    if (!symbol || symbol.length < 2) {
      setStockInsights(null);
      return;
    }

    setIsValidatingStock(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to validate stocks',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-insights`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbol: symbol.toUpperCase(), action: 'price' }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Invalid Stock',
          description: errorData.error || 'Stock symbol not found',
          variant: 'destructive'
        });
        setStockInsights(null);
        return;
      }

      const data = await response.json();
      setStockInsights(data);
      
      setNewInvestment(prev => ({
        ...prev,
        name: data.name,
        currentPrice: data.currentPrice,
        purchasePrice: data.currentPrice
      }));

      toast({
        title: 'Stock Validated',
        description: `${data.name} - Current Price: ₹${data.currentPrice.toLocaleString()}`,
      });
    } catch (error) {
      console.error('Error validating stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to validate stock',
        variant: 'destructive'
      });
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
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            symbol: symbol.toUpperCase(), 
            action: 'all',
            userBudget: newInvestment.shares * newInvestment.currentPrice
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch insights');

      const data = await response.json();
      setStockInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch AI insights',
        variant: 'destructive'
      });
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
      setIsAddDialogOpen(false);
      toast({
        title: 'Investment added',
        description: 'Your investment has been successfully added to your portfolio.'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Invalid input',
          description: error.issues[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add investment',
          variant: 'destructive'
        });
      }
    }
  };

  const updateInvestmentHandler = async () => {
    if (!editingInvestment) return;

    try {
      const validatedData = investmentSchema.parse({
        name: editingInvestment.name,
        symbol: editingInvestment.symbol,
        shares: editingInvestment.shares,
        currentPrice: editingInvestment.current_price,
        purchasePrice: editingInvestment.purchase_price ?? undefined,
        purchaseDate: editingInvestment.purchase_date ?? undefined
      });

      await updateMutation.mutateAsync({
        id: editingInvestment.id,
        name: validatedData.name,
        symbol: validatedData.symbol,
        shares: validatedData.shares,
        current_price: validatedData.currentPrice,
        purchase_price: validatedData.purchasePrice,
        purchase_date: validatedData.purchaseDate,
      });

      setIsEditDialogOpen(false);
      setEditingInvestment(null);
      toast({
        title: 'Investment updated',
        description: 'Your investment has been successfully updated.'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Invalid input',
          description: error.issues[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update investment',
          variant: 'destructive'
        });
      }
    }
  };

  const removeInvestment = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: 'Investment removed',
        description: 'Your investment has been successfully removed.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove investment',
        variant: 'destructive'
      });
    }
  };

  const openEditDialog = (investment: InvestmentWithMetrics) => {
    setEditingInvestment(investment);
    setIsEditDialogOpen(true);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageTransition>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              Investment Portfolio
            </h1>
            <p className="text-muted-foreground">Manage and track your investments</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Investment</DialogTitle>
                <DialogDescription>
                  Enter the details of your new investment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Investment Name</Label>
                  <Input
                    id="name"
                    value={newInvestment.name}
                    onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                    placeholder="e.g., Reliance Industries"
                  />
                </div>
                <div>
                  <Label htmlFor="symbol">Symbol</Label>
                  <div className="flex gap-2">
                    <Input
                      id="symbol"
                      value={newInvestment.symbol}
                      onChange={(e) => setNewInvestment({...newInvestment, symbol: e.target.value.toUpperCase()})}
                      onBlur={(e) => validateAndFetchStockData(e.target.value)}
                      placeholder="e.g., RELIANCE.NS, TCS.NS"
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => validateAndFetchStockData(newInvestment.symbol)}
                      disabled={isValidatingStock || !newInvestment.symbol}
                    >
                      {isValidatingStock ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add .NS for NSE stocks (e.g., RELIANCE.NS, TCS.NS, INFY.NS)
                  </p>
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
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-auto p-0 mt-2 text-green-700 dark:text-green-300"
                          onClick={() => fetchStockInsights(newInvestment.symbol)}
                          disabled={isFetchingInsights}
                        >
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
                            <div className="text-green-700 dark:text-green-300">
                              ✓ You can afford {stockInsights.affordableShares} shares
                            </div>
                          ) : (
                            <div className="text-red-700 dark:text-red-300">
                              ✗ Insufficient funds for this investment
                            </div>
                          )}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="shares">Number of Shares</Label>
                  <Input
                    id="shares"
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={newInvestment.shares || ''}
                    onChange={(e) => setNewInvestment({...newInvestment, shares: parseFloat(e.target.value) || 0})}
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Current Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={newInvestment.currentPrice || ''}
                    onChange={(e) => setNewInvestment({...newInvestment, currentPrice: parseFloat(e.target.value) || 0})}
                    placeholder="e.g., 2845.50"
                  />
                </div>
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={newInvestment.purchasePrice || ''}
                    onChange={(e) => setNewInvestment({...newInvestment, purchasePrice: parseFloat(e.target.value) || 0})}
                    placeholder="e.g., 2600.00"
                  />
                </div>
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={newInvestment.purchaseDate}
                    onChange={(e) => setNewInvestment({...newInvestment, purchaseDate: e.target.value})}
                  />
                </div>
                <Button onClick={addInvestment} className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Adding...' : 'Add Investment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Investment</DialogTitle>
                <DialogDescription>
                  Update the details of your investment.
                </DialogDescription>
              </DialogHeader>
              {editingInvestment && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Investment Name</Label>
                    <Input
                      id="edit-name"
                      value={editingInvestment.name}
                      onChange={(e) => setEditingInvestment({...editingInvestment, name: e.target.value})}
                      placeholder="e.g., Reliance Industries"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-symbol">Symbol</Label>
                    <Input
                      id="edit-symbol"
                      value={editingInvestment.symbol}
                      onChange={(e) => setEditingInvestment({...editingInvestment, symbol: e.target.value.toUpperCase()})}
                      placeholder="e.g., RELIANCE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-shares">Number of Shares</Label>
                    <Input
                      id="edit-shares"
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={editingInvestment.shares || ''}
                      onChange={(e) => setEditingInvestment({...editingInvestment, shares: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Current Price (₹)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={editingInvestment.current_price || ''}
                      onChange={(e) => setEditingInvestment({...editingInvestment, current_price: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 2845.50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-purchasePrice">Purchase Price (₹)</Label>
                    <Input
                      id="edit-purchasePrice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={editingInvestment.purchase_price || ''}
                      onChange={(e) => setEditingInvestment({...editingInvestment, purchase_price: parseFloat(e.target.value) || 0})}
                      placeholder="e.g., 2600.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-purchaseDate">Purchase Date</Label>
                    <Input
                      id="edit-purchaseDate"
                      type="date"
                      value={editingInvestment.purchase_date || ''}
                      onChange={(e) => setEditingInvestment({...editingInvestment, purchase_date: e.target.value})}
                    />
                  </div>
                  <Button onClick={updateInvestmentHandler} className="w-full" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Updating...' : 'Update Investment'}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Portfolio</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{portfolioData.totalValue.toLocaleString()}
                  </p>
                  <p className={`text-sm ${portfolioData.todayChangePercent >= 0 ? 'text-green-600' : 'text-red-500 dark:text-red-400'}`}>
                    {portfolioData.todayChangePercent >= 0 ? '+' : ''}₹{portfolioData.todayChange.toLocaleString()}
                    ({portfolioData.todayChangePercent >= 0 ? '+' : ''}{portfolioData.todayChangePercent.toFixed(2)}%)
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="holdings">My Holdings</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="holdings" className="space-y-6">
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
                    {userInvestments.map((investment) => (
                    <div key={investment.id} className="border rounded-lg p-4 dark:border-gray-700">
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
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => openEditDialog(investment)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => removeInvestment(investment.id)}
                                className="text-red-600"
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
                    
                    {userInvestments.length === 0 && (
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
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
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
                {!recommendations && !isLoadingRecommendations && (
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Click to get personalized AI recommendations</p>
                    <Button onClick={fetchRecommendations} className="bg-primary hover:bg-primary/90">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Recommendations
                    </Button>
                  </div>
                )}
                {isLoadingRecommendations && (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-spin" />
                    <p className="text-muted-foreground">Analyzing your portfolio and generating recommendations...</p>
                  </div>
                )}
                {recommendations && !isLoadingRecommendations && (
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
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
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
                  {userInvestments.length > 0 ? (
                    <div className="space-y-4">
                      {userInvestments.map((inv) => {
                        const pct = portfolioData.totalValue > 0 ? (inv.totalValue / portfolioData.totalValue) * 100 : 0;
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
                        <p className={`text-xl font-bold ${portfolioData.todayChange >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                          {portfolioData.todayChange >= 0 ? '+' : ''}₹{portfolioData.todayChange.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-300">Return %</p>
                        <p className={`text-xl font-bold ${portfolioData.todayChangePercent >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
                          {portfolioData.todayChangePercent >= 0 ? '+' : ''}{portfolioData.todayChangePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                        <p className="text-sm text-purple-600 dark:text-purple-300">Holdings</p>
                        <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{userInvestments.length}</p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                        <p className="text-sm text-orange-600 dark:text-orange-300">Portfolio Value</p>
                        <p className="text-xl font-bold text-orange-700 dark:text-orange-300">₹{portfolioData.totalValue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Recent Transactions</CardTitle>
                <CardDescription className="text-muted-foreground">Your latest investment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Transaction history coming soon</p>
                  <p className="text-sm text-muted-foreground mt-1">We're working on tracking your buy/sell activity automatically.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Investments;
