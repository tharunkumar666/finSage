
import { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Investments = () => {
  const [selectedRiskProfile] = useState('Moderate');

  // Mock investment data
  const portfolioData = {
    totalValue: 15420,
    todayChange: 125.50,
    todayChangePercent: 0.82,
    allocation: {
      stocks: { value: 6939, percentage: 45, change: 2.1 },
      bonds: { value: 3855, percentage: 25, change: 0.5 },
      crypto: { value: 2313, percentage: 15, change: -1.2 },
      cash: { value: 2313, percentage: 15, change: 0.0 }
    }
  };

  const recommendedInvestments = [
    {
      name: 'S&P 500 ETF (SPY)',
      type: 'ETF',
      risk: 'Moderate',
      expectedReturn: '10-12%',
      description: 'Diversified exposure to top 500 US companies',
      allocation: 30,
      reason: 'Matches your moderate risk profile with strong historical returns'
    },
    {
      name: 'Total Bond Market ETF (BND)',
      type: 'Bond ETF',
      risk: 'Low',
      expectedReturn: '3-5%',
      description: 'Broad exposure to US investment-grade bonds',
      allocation: 25,
      reason: 'Provides stability and income to balance your portfolio'
    },
    {
      name: 'International ETF (VTI)',
      type: 'ETF',
      risk: 'Moderate',
      expectedReturn: '8-10%',
      description: 'Exposure to international developed markets',
      allocation: 15,
      reason: 'Diversification across global markets reduces risk'
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
    { date: '2024-01-15', type: 'Buy', asset: 'SPY', amount: 500, shares: 1.2, price: 415.50 },
    { date: '2024-01-10', type: 'Buy', asset: 'BTC', amount: 250, shares: 0.006, price: 42500 },
    { date: '2024-01-05', type: 'Sell', asset: 'AAPL', amount: -300, shares: -1.8, price: 185.20 },
    { date: '2024-01-01', type: 'Dividend', asset: 'VTI', amount: 45, shares: 0, price: 0 }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Portfolio</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${portfolioData.totalValue.toLocaleString()}
                  </p>
                  <p className={`text-sm ${portfolioData.todayChangePercent >= 0 ? 'text-green-600' : 'text-red-500 dark:text-red-400'}`}>
                    {portfolioData.todayChangePercent >= 0 ? '+' : ''}${portfolioData.todayChange} 
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
                      ${data.value.toLocaleString()}
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

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>

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
                            {data.percentage}% (${data.value.toLocaleString()})
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
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
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

