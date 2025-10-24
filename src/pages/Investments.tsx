
import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Plus, Trash2, Edit2, MoreVertical } from 'lucide-react';
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
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';

const investmentSchema = z.object({
  name: z.string().trim().min(1, 'Investment name is required').max(100, 'Name must be less than 100 characters'),
  symbol: z.string().trim().min(1, 'Symbol is required').max(10, 'Symbol must be less than 10 characters'),
  shares: z.number().positive('Shares must be greater than 0'),
  currentPrice: z.number().positive('Price must be greater than 0'),
  purchasePrice: z.number().positive('Purchase price must be greater than 0').optional(),
  purchaseDate: z.string().optional()
});

interface Investment {
  id: string;
  name: string;
  symbol: string;
  shares: number;
  current_price: number;
  purchase_price?: number;
  purchase_date?: string;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

const Investments = () => {
  const { toast } = useToast();
  const [selectedRiskProfile] = useState('Moderate');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const [newInvestment, setNewInvestment] = useState({
    name: '',
    symbol: '',
    shares: 0,
    currentPrice: 0,
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInvestments: Investment[] = (data || []).map(inv => {
        const totalValue = Number(inv.shares) * Number(inv.current_price);
        const purchaseValue = inv.purchase_price ? Number(inv.shares) * Number(inv.purchase_price) : totalValue;
        const gainLoss = totalValue - purchaseValue;
        const gainLossPercent = purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;

        return {
          id: inv.id,
          name: inv.name,
          symbol: inv.symbol,
          shares: Number(inv.shares),
          current_price: Number(inv.current_price),
          purchase_price: inv.purchase_price ? Number(inv.purchase_price) : undefined,
          purchase_date: inv.purchase_date,
          totalValue,
          gainLoss,
          gainLossPercent
        };
      });

      setUserInvestments(formattedInvestments);
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load investments',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate portfolio data from actual investments
  const calculatePortfolioData = () => {
    const totalValue = userInvestments.reduce((sum, inv) => sum + inv.totalValue, 0);
    const totalGainLoss = userInvestments.reduce((sum, inv) => sum + inv.gainLoss, 0);
    const todayChangePercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

    return {
      totalValue,
      todayChange: totalGainLoss,
      todayChangePercent,
      allocation: {
        stocks: { value: totalValue * 0.45, percentage: 45, change: 2.1 },
        bonds: { value: totalValue * 0.25, percentage: 25, change: 0.5 },
        crypto: { value: totalValue * 0.15, percentage: 15, change: -1.2 },
        cash: { value: totalValue * 0.15, percentage: 15, change: 0.0 }
      }
    };
  };

  const portfolioData = calculatePortfolioData();

  const recommendedInvestments = [
    {
      name: 'Nifty 50 Index Fund',
      type: 'Index Fund',
      risk: 'Moderate',
      expectedReturn: '10-12%',
      description: 'Diversified exposure to top 50 Indian companies',
      allocation: 30,
      reason: 'Matches your moderate risk profile with strong historical returns'
    },
    {
      name: 'HDFC Corporate Bond Fund',
      type: 'Debt Mutual Fund',
      risk: 'Low',
      expectedReturn: '7-9%',
      description: 'Investment in high-quality corporate bonds',
      allocation: 25,
      reason: 'Provides stability and consistent income to balance your portfolio'
    },
    {
      name: 'ICICI Prudential Bluechip Fund',
      type: 'Mutual Fund',
      risk: 'Moderate',
      expectedReturn: '12-15%',
      description: 'Large cap equity mutual fund with proven track record',
      allocation: 15,
      reason: 'Strong performance in large cap segment with lower volatility'
    },
    {
      name: 'Bitcoin (BTC)',
      type: 'Cryptocurrency',
      risk: 'High',
      expectedReturn: '15-25%',
      description: 'Leading cryptocurrency with high volatility',
      allocation: 10,
      reason: 'Small allocation for portfolio diversification and growth potential'
    }
  ];

  const recentTransactions = [
    { date: '2024-01-15', type: 'Buy', asset: 'RELIANCE', amount: 28455, shares: 10, price: 2845.50 },
    { date: '2024-01-10', type: 'Buy', asset: 'BTC', amount: 50000, shares: 0.012, price: 4166666 },
    { date: '2024-01-05', type: 'Sell', asset: 'INFY', amount: -22140, shares: -15, price: 1476 },
    { date: '2024-01-01', type: 'Dividend', asset: 'TCS', amount: 750, shares: 0, price: 0 }
  ];

  const addInvestment = async () => {
    try {
      const validatedData = investmentSchema.parse(newInvestment);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to add investments',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('investments')
        .insert({
          user_id: user.id,
          name: validatedData.name,
          symbol: validatedData.symbol,
          shares: validatedData.shares,
          current_price: validatedData.currentPrice,
          purchase_price: validatedData.purchasePrice || validatedData.currentPrice,
          purchase_date: validatedData.purchaseDate || new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      await fetchInvestments();
      setNewInvestment({ name: '', symbol: '', shares: 0, currentPrice: 0, purchasePrice: 0, purchaseDate: new Date().toISOString().split('T')[0] });
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

  const updateInvestment = async () => {
    if (!editingInvestment) return;

    try {
      const validatedData = investmentSchema.parse({
        name: editingInvestment.name,
        symbol: editingInvestment.symbol,
        shares: editingInvestment.shares,
        currentPrice: editingInvestment.current_price,
        purchasePrice: editingInvestment.purchase_price,
        purchaseDate: editingInvestment.purchase_date
      });

      const { error } = await supabase
        .from('investments')
        .update({
          name: validatedData.name,
          symbol: validatedData.symbol,
          shares: validatedData.shares,
          current_price: validatedData.currentPrice,
          purchase_price: validatedData.purchasePrice,
          purchase_date: validatedData.purchaseDate
        })
        .eq('id', editingInvestment.id);

      if (error) throw error;

      await fetchInvestments();
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
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchInvestments();
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

  const openEditDialog = (investment: Investment) => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-zinc-900 dark:to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              Investment Portfolio
            </h1>
            <p className="text-muted-foreground">Manage and track your investments</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
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
                  <Input
                    id="symbol"
                    value={newInvestment.symbol}
                    onChange={(e) => setNewInvestment({...newInvestment, symbol: e.target.value.toUpperCase()})}
                    placeholder="e.g., RELIANCE"
                  />
                </div>
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
                <Button onClick={addInvestment} className="w-full">
                  Add Investment
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
                  <Button onClick={updateInvestment} className="w-full">
                    Update Investment
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Portfolio</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{portfolioData.totalValue.toLocaleString()}
                  </p>
                  <p className={`text-sm ${portfolioData.todayChangePercent >= 0 ? 'text-green-600' : 'text-red-500 dark:text-red-400'}`}>
                    {portfolioData.todayChangePercent >= 0 ? '+' : ''}₹{portfolioData.todayChange}
                    ({portfolioData.todayChangePercent >= 0 ? '+' : ''}{portfolioData.todayChangePercent}%)
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {Object.entries(portfolioData.allocation).map(([key, data]) => (
            <Card key={key}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                    <p className="text-xl font-bold text-foreground">
                      ₹{data.value.toLocaleString()}
                    </p>
                    <p className={`text-xs ${data.change >= 0 ? 'text-green-600' : 'text-red-500 dark:text-red-400'}`}>
                      {data.change >= 0 ? '+' : ''}{data.change}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">{data.percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading investments...</p>
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
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No investments yet. Add your first investment to get started!</p>
                      </div>
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
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  AI Investment Recommendations
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Based on your {selectedRiskProfile} risk profile and current market conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendedInvestments.map((investment, index) => (
                    <Card key={index} className="border border-blue-200 dark:border-blue-900">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-foreground">{investment.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{investment.type}</p>
                          </div>
                          <Badge className={getRiskColor(investment.risk)}>
                            {investment.risk} Risk
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">{investment.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Expected Return</p>
                              <p className="font-semibold text-foreground">{investment.expectedReturn}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Suggested Allocation</p>
                              <p className="font-semibold text-foreground">{investment.allocation}%</p>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              <strong>Why we recommend this:</strong> {investment.reason}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                              Invest Now
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    Asset Allocation
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Current portfolio distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(portfolioData.allocation).map(([key, data]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize text-muted-foreground">{key}</span>
                          <span className="text-sm text-muted-foreground">
                            {data.percentage}% (₹{data.value.toLocaleString()})
                          </span>
                        </div>
                        <Progress value={data.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Key portfolio statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-300">Total Return</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-300">+8.5%</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-300">Annual Return</p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-300">+12.3%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
                        <p className="text-sm text-purple-600 dark:text-purple-300">Risk Score</p>
                        <p className="text-xl font-bold text-purple-700 dark:text-purple-300">6.5/10</p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg">
                        <p className="text-sm text-orange-600 dark:text-orange-300">Diversification</p>
                        <p className="text-xl font-bold text-orange-700 dark:text-orange-300">Good</p>
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
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.type === 'Buy' ? 'bg-green-500' : 
                          transaction.type === 'Sell' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-foreground">{transaction.asset}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.amount > 0 ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.shares !== 0 && `${transaction.shares} shares`}
                        </p>
                      </div>
                    </div>
                  ))}
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
