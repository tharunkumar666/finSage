import { useState } from 'react';
import { TrendingUp, Filter, Search, Plus, Edit3, Trash2, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InvestmentDetails from '@/components/InvestmentDetails';
import InvestmentFilter from '@/components/InvestmentFilter';

const Investments = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('stocks');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newInvestment, setNewInvestment] = useState({
    name: '',
    symbol: '',
    price: '',
    amount: '',
    risk: 'Medium',
    category: selectedCategory
  });

  // Mock investment data with user's portfolio
  const [investments, setInvestments] = useState({
    stocks: [
      {
        id: 1,
        name: 'Apple Inc.',
        symbol: 'AAPL',
        price: 185.45,
        change: +2.34,
        changePercent: +1.28,
        risk: 'Medium',
        sector: 'Technology',
        recommendation: 'Strong Buy',
        owned: true,
        amount: 500
      },
      {
        id: 2,
        name: 'Microsoft Corp.',
        symbol: 'MSFT',
        price: 378.90,
        change: +5.67,
        changePercent: +1.52,
        risk: 'Medium',
        sector: 'Technology',
        recommendation: 'Buy',
        owned: true,
        amount: 250
      },
      {
        id: 3,
        name: 'NVIDIA Corp.',
        symbol: 'NVDA',
        price: 875.30,
        change: -12.45,
        changePercent: -1.40,
        risk: 'High',
        sector: 'Technology',
        recommendation: 'Hold',
        owned: false,
        amount: 0
      }
    ],
    bonds: [
      {
        id: 1,
        name: 'US Treasury Bond 10Y',
        symbol: 'US10Y',
        price: 4.25,
        yield: 4.25,
        rating: 'AAA',
        risk: 'Low',
        recommendation: 'Buy',
        owned: true,
        amount: 1000
      },
      {
        id: 2,
        name: 'Corporate Bond ETF',
        symbol: 'LQD',
        price: 108.75,
        yield: 5.1,
        rating: 'A',
        risk: 'Low',
        recommendation: 'Buy',
        owned: false,
        amount: 0
      }
    ],
    crypto: [
      {
        id: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 65420.50,
        change: +1245.30,
        changePercent: +1.94,
        risk: 'Very High',
        marketCap: '1.28T',
        recommendation: 'Hold',
        owned: true,
        amount: 100
      },
      {
        id: 2,
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3420.75,
        change: +89.45,
        changePercent: +2.68,
        risk: 'Very High',
        marketCap: '411B',
        recommendation: 'Buy',
        owned: false,
        amount: 0
      }
    ],
    cash: [
      {
        id: 1,
        name: 'High Yield Savings',
        symbol: 'HYSA',
        rate: 4.5,
        risk: 'Very Low',
        fdic: 'Yes',
        recommendation: 'Buy',
        owned: true,
        amount: 5000
      },
      {
        id: 2,
        name: 'Money Market Fund',
        symbol: 'MMF',
        rate: 4.8,
        risk: 'Very Low',
        fdic: 'Yes',
        recommendation: 'Buy',
        owned: false,
        amount: 0
      }
    ]
  });

  const addInvestment = () => {
    const investment = {
      id: Date.now(),
      name: newInvestment.name,
      symbol: newInvestment.symbol,
      price: parseFloat(newInvestment.price),
      amount: parseFloat(newInvestment.amount),
      risk: newInvestment.risk,
      recommendation: 'Hold',
      owned: true,
      change: 0,
      changePercent: 0
    };

    setInvestments(prev => ({
      ...prev,
      [selectedCategory]: [...prev[selectedCategory], investment]
    }));

    setNewInvestment({ name: '', symbol: '', price: '', amount: '', risk: 'Medium', category: selectedCategory });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Investment Added!",
      description: `${investment.name} has been added to your portfolio.`,
    });
  };

  const updateInvestment = () => {
    if (!editingInvestment) return;

    const updatedInvestments = investments[selectedCategory].map(inv => 
      inv.id === editingInvestment.id 
        ? { ...editingInvestment, price: parseFloat(editingInvestment.price), amount: parseFloat(editingInvestment.amount) }
        : inv
    );

    setInvestments(prev => ({
      ...prev,
      [selectedCategory]: updatedInvestments
    }));

    setEditingInvestment(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Investment Updated!",
      description: "Your investment has been successfully updated.",
    });
  };

  const deleteInvestment = (id: number) => {
    setInvestments(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].filter(inv => inv.id !== id)
    }));
    
    toast({
      title: "Investment Removed",
      description: "Investment has been removed from your portfolio.",
    });
  };

  const viewDetails = (investment: any) => {
    setSelectedInvestment(investment);
    setIsDetailsOpen(true);
  };

  const applyFilters = (filters: any) => {
    console.log('Applying filters:', filters);
    toast({
      title: "Filters Applied",
      description: "Investment list has been filtered based on your criteria.",
    });
  };

  const clearFilters = () => {
    console.log('Clearing filters');
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
  };

  const filteredInvestments = investments[selectedCategory].filter(investment =>
    investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investment.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Very Low': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Strong Buy': return 'bg-green-500';
      case 'Buy': return 'bg-blue-500';
      case 'Hold': return 'bg-yellow-500';
      case 'Sell': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Dashboard
          </h1>
          <p className="text-gray-600">
            Explore and manage your investment portfolio
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search investments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Investment Categories Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="cash">Cash</TabsTrigger>
          </TabsList>

          {/* Content for each tab */}
          {Object.keys(investments).map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold capitalize">{category} Investments</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Investment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Investment</DialogTitle>
                      <DialogDescription>
                        Add a new {category.slice(0, -1)} to your portfolio.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Investment Name</Label>
                        <Input
                          id="name"
                          value={newInvestment.name}
                          onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                          placeholder="e.g., Apple Inc."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                          id="symbol"
                          value={newInvestment.symbol}
                          onChange={(e) => setNewInvestment({...newInvestment, symbol: e.target.value})}
                          placeholder="e.g., AAPL"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price per Share ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newInvestment.price}
                            onChange={(e) => setNewInvestment({...newInvestment, price: e.target.value})}
                            placeholder="185.45"
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Investment Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={newInvestment.amount}
                            onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                            placeholder="1000"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="risk">Risk Level</Label>
                        <Select value={newInvestment.risk} onValueChange={(value) => setNewInvestment({...newInvestment, risk: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Very Low">Very Low</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Very High">Very High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button onClick={addInvestment} className="w-full" disabled={!newInvestment.name || !newInvestment.symbol || !newInvestment.price}>
                        Add Investment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid gap-6">
                {filteredInvestments.map((investment) => (
                  <Card key={investment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{investment.name}</h3>
                            {investment.owned && (
                              <Badge className="bg-green-100 text-green-800">Owned</Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{investment.symbol}{investment.sector && ` • ${investment.sector}`}</p>
                          {investment.amount && (
                            <p className="text-sm text-gray-500">Investment: ${investment.amount}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${investment.price}</p>
                          {investment.change !== undefined && (
                            <p className={`text-sm ${investment.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {investment.change >= 0 ? '+' : ''}${investment.change} ({investment.changePercent >= 0 ? '+' : ''}{investment.changePercent}%)
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Badge className={getRiskBadgeColor(investment.risk)}>
                            {investment.risk} Risk
                          </Badge>
                          <Badge className={`text-white ${getRecommendationColor(investment.recommendation)}`}>
                            {investment.recommendation}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewDetails(investment)}
                          >
                            View Details
                          </Button>
                          
                          {investment.owned && (
                            <>
                              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditingInvestment({...investment, price: investment.price.toString(), amount: investment.amount?.toString() || '0'})}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Investment</DialogTitle>
                                    <DialogDescription>
                                      Update your investment details.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {editingInvestment && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Investment Name</Label>
                                        <Input
                                          value={editingInvestment.name}
                                          onChange={(e) => setEditingInvestment({...editingInvestment, name: e.target.value})}
                                        />
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Price per Share ($)</Label>
                                          <Input
                                            type="number"
                                            value={editingInvestment.price}
                                            onChange={(e) => setEditingInvestment({...editingInvestment, price: e.target.value})}
                                          />
                                        </div>
                                        <div>
                                          <Label>Investment Amount ($)</Label>
                                          <Input
                                            type="number"
                                            value={editingInvestment.amount}
                                            onChange={(e) => setEditingInvestment({...editingInvestment, amount: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      
                                      <Button onClick={updateInvestment} className="w-full">
                                        Update Investment
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => deleteInvestment(investment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* AI Recommendations Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              AI-Powered Recommendations
            </CardTitle>
            <CardDescription>
              Personalized investment suggestions based on your risk profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Conservative Pick</h4>
                <p className="text-sm text-green-700 mb-2">
                  High Yield Savings Account - 4.5% APY
                </p>
                <p className="text-xs text-green-600">
                  Perfect for emergency fund building
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Moderate Pick</h4>
                <p className="text-sm text-blue-700 mb-2">
                  S&P 500 Index Fund - Diversified Growth
                </p>
                <p className="text-xs text-blue-600">
                  Long-term wealth building strategy
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Growth Pick</h4>
                <p className="text-sm text-orange-700 mb-2">
                  Technology ETF - High Growth Potential
                </p>
                <p className="text-xs text-orange-600">
                  Higher risk, higher reward opportunity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <InvestmentDetails 
        investment={selectedInvestment}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <InvestmentFilter
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      <Footer />
    </div>
  );
};

export default Investments;
