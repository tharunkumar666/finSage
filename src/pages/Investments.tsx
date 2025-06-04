
import { useState } from 'react';
import { TrendingUp, Filter, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Investments = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('stocks');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock investment data
  const investments = {
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
        recommendation: 'Strong Buy'
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
        recommendation: 'Buy'
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
        recommendation: 'Hold'
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
        recommendation: 'Buy'
      },
      {
        id: 2,
        name: 'Corporate Bond ETF',
        symbol: 'LQD',
        price: 108.75,
        yield: 5.1,
        rating: 'A',
        risk: 'Low',
        recommendation: 'Buy'
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
        recommendation: 'Hold'
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
        recommendation: 'Buy'
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
        recommendation: 'Buy'
      },
      {
        id: 2,
        name: 'Money Market Fund',
        symbol: 'MMF',
        rate: 4.8,
        risk: 'Very Low',
        fdic: 'Yes',
        recommendation: 'Buy'
      }
    ]
  };

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
          <Button variant="outline" className="flex items-center gap-2">
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

          {/* Stocks Tab */}
          <TabsContent value="stocks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Stock Investments</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
            </div>
            
            <div className="grid gap-6">
              {investments.stocks.map((stock) => (
                <Card key={stock.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{stock.name}</h3>
                        <p className="text-gray-600">{stock.symbol} • {stock.sector}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${stock.price}</p>
                        <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}${stock.change} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge className={getRiskBadgeColor(stock.risk)}>
                          {stock.risk} Risk
                        </Badge>
                        <Badge className={`text-white ${getRecommendationColor(stock.recommendation)}`}>
                          {stock.recommendation}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bonds Tab */}
          <TabsContent value="bonds" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Bond Investments</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
            </div>
            
            <div className="grid gap-6">
              {investments.bonds.map((bond) => (
                <Card key={bond.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{bond.name}</h3>
                        <p className="text-gray-600">{bond.symbol} • Rating: {bond.rating}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{bond.yield}%</p>
                        <p className="text-sm text-gray-600">Yield</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge className={getRiskBadgeColor(bond.risk)}>
                          {bond.risk} Risk
                        </Badge>
                        <Badge className={`text-white ${getRecommendationColor(bond.recommendation)}`}>
                          {bond.recommendation}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Crypto Tab */}
          <TabsContent value="crypto" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Cryptocurrency</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
            </div>
            
            <div className="grid gap-6">
              {investments.crypto.map((crypto) => (
                <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{crypto.name}</h3>
                        <p className="text-gray-600">{crypto.symbol} • Market Cap: ${crypto.marketCap}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${crypto.price.toLocaleString()}</p>
                        <p className={`text-sm ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {crypto.change >= 0 ? '+' : ''}${crypto.change} ({crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent}%)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge className={getRiskBadgeColor(crypto.risk)}>
                          {crypto.risk} Risk
                        </Badge>
                        <Badge className={`text-white ${getRecommendationColor(crypto.recommendation)}`}>
                          {crypto.recommendation}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cash Tab */}
          <TabsContent value="cash" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Cash & Equivalents</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
            </div>
            
            <div className="grid gap-6">
              {investments.cash.map((cash) => (
                <Card key={cash.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{cash.name}</h3>
                        <p className="text-gray-600">{cash.symbol} • FDIC Insured: {cash.fdic}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{cash.rate}%</p>
                        <p className="text-sm text-gray-600">APY</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge className={getRiskBadgeColor(cash.risk)}>
                          {cash.risk} Risk
                        </Badge>
                        <Badge className={`text-white ${getRecommendationColor(cash.recommendation)}`}>
                          {cash.recommendation}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
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

      <Footer />
    </div>
  );
};

export default Investments;
