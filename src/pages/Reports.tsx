
import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Reports = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [timeFrame, setTimeFrame] = useState('1M');

  const portfolioData = {
    totalValue: 15420,
    totalGain: 1842,
    gainPercentage: 13.6,
    monthlyChange: 8.5,
    yearlyChange: 24.8
  };

  const assetAllocation = [
    { name: 'Stocks', value: 45, amount: 6939, color: 'bg-blue-500' },
    { name: 'Bonds', value: 25, amount: 3855, color: 'bg-green-500' },
    { name: 'Crypto', value: 15, amount: 2313, color: 'bg-orange-500' },
    { name: 'Cash', value: 15, amount: 2313, color: 'bg-gray-500' }
  ];

  const topPerformers = [
    { name: 'S&P 500 ETF', return: '+18.2%', value: '$2,500', trend: 'up' },
    { name: 'Bitcoin', return: '+45.7%', value: '$1,200', trend: 'up' },
    { name: 'Tech Growth Fund', return: '+22.1%', value: '$1,800', trend: 'up' }
  ];

  const bottomPerformers = [
    { name: 'Bond Fund A', return: '-2.1%', value: '$800', trend: 'down' },
    { name: 'REITs Fund', return: '-5.3%', value: '$600', trend: 'down' },
    { name: 'Energy Sector', return: '-8.7%', value: '$400', trend: 'down' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portfolio Reports
          </h1>
          <p className="text-gray-600">
            Comprehensive analysis of your investment performance
          </p>
        </div>

        {/* Time Frame Selector */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
              <Button
                key={period}
                variant={timeFrame === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFrame(period)}
                className={timeFrame === period ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {period}
              </Button>
            ))}
          </div>
          
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                +${portfolioData.totalGain.toLocaleString()} ({portfolioData.gainPercentage}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{portfolioData.monthlyChange}%</div>
              <p className="text-xs text-green-600">Above market average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yearly Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{portfolioData.yearlyChange}%</div>
              <p className="text-xs text-blue-600">Strong performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <PieChart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Moderate</div>
              <p className="text-xs text-orange-600">Well balanced</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Your best performing investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.value}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-600 font-medium mr-2">{item.return}</span>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Underperformers</CardTitle>
                  <CardDescription>Investments that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bottomPerformers.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.value}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-red-600 font-medium mr-2">{item.return}</span>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Asset Allocation Tab */}
          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Asset Allocation</CardTitle>
                <CardDescription>How your portfolio is distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {assetAllocation.map((asset, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{asset.name}</span>
                        <div className="text-right">
                          <span className="font-bold">{asset.value}%</span>
                          <p className="text-sm text-gray-500">${asset.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={asset.value} className="flex-1" />
                        <div className={`w-4 h-4 rounded ${asset.color}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Return</span>
                      <span className="font-bold text-green-600">+{portfolioData.gainPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annualized Return</span>
                      <span className="font-bold">+12.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sharpe Ratio</span>
                      <span className="font-bold">1.24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Drawdown</span>
                      <span className="font-bold text-red-600">-8.3%</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Beta</span>
                      <span className="font-bold">0.87</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alpha</span>
                      <span className="font-bold text-green-600">+2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility</span>
                      <span className="font-bold">14.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>R-Squared</span>
                      <span className="font-bold">0.78</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>Insights and recommendations for your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">✓ Strengths</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Well-diversified across asset classes</li>
                      <li>• Strong performance relative to market</li>
                      <li>• Good risk-adjusted returns</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">⚠ Areas for Improvement</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Consider reducing exposure to underperforming bonds</li>
                      <li>• Increase international diversification</li>
                      <li>• Review sector concentration in technology</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">📈 Recommendations</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Add emerging market exposure (5-10%)</li>
                      <li>• Consider REIT allocation for income</li>
                      <li>• Rebalance quarterly to maintain target allocation</li>
                    </ul>
                  </div>
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

export default Reports;
