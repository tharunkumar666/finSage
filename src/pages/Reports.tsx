
import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [selectedReport, setSelectedReport] = useState('portfolio');

  // Mock data for reports
  const portfolioPerformance = {
    totalReturn: 8.5,
    monthlyReturns: [2.1, -0.5, 3.2, 1.8, 0.9, 2.4],
    months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    bestPerformer: { name: 'Tech ETF', return: 15.2 },
    worstPerformer: { name: 'Bond Fund', return: -2.1 }
  };

  const assetAllocation = {
    stocks: 45,
    bonds: 25,
    crypto: 15,
    cash: 15
  };

  const riskMetrics = {
    portfolioRisk: 6.5,
    expectedReturn: 12.3,
    maxDrawdown: -8.2,
    sharpeRatio: 1.45
  };

  const debtAnalysis = {
    totalDebt: 26200,
    monthlyPayments: 530,
    averageRate: 8.9,
    payoffTime: 4.2,
    interestSavings: 2340
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <PageTransition>
      <main id="main-content" role="main" className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              Financial Reports
            </h1>
            <p className="text-muted-foreground">Comprehensive analysis of your financial performance</p>
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="ALL">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { key: 'portfolio', label: 'Portfolio Performance', icon: TrendingUp },
            { key: 'allocation', label: 'Asset Allocation', icon: PieChart },
            { key: 'risk', label: 'Risk Analysis', icon: BarChart3 },
            { key: 'debt', label: 'Debt Analysis', icon: Calendar }
          ].map((report) => (
            <Button
              key={report.key}
              onClick={() => setSelectedReport(report.key)}
              variant={selectedReport === report.key ? 'default' : 'outline'}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <report.icon className="h-4 w-4" />
              {report.label}
            </Button>
          ))}
        </div>

        {/* Portfolio Performance Report */}
        {selectedReport === 'portfolio' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance Summary</CardTitle>
                <CardDescription>Overall performance metrics for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm text-green-600 mb-1">Total Return</h3>
                    <p className="text-2xl font-bold text-green-700">+{portfolioPerformance.totalReturn}%</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm text-blue-600 mb-1">Best Month</h3>
                    <p className="text-2xl font-bold text-blue-700">+3.2%</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Best Performer</h4>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span>{portfolioPerformance.bestPerformer.name}</span>
                      <span className="font-bold text-green-600">+{portfolioPerformance.bestPerformer.return}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Worst Performer</h4>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span>{portfolioPerformance.worstPerformer.name}</span>
                      <span className="font-bold text-red-600">{portfolioPerformance.worstPerformer.return}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns Chart</CardTitle>
                <CardDescription>Month-by-month performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioPerformance.months.map((month, index) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-12">{month}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                portfolioPerformance.monthlyReturns[index] >= 0 ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.abs(portfolioPerformance.monthlyReturns[index]) * 20}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium w-16 text-right ${
                        portfolioPerformance.monthlyReturns[index] >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {portfolioPerformance.monthlyReturns[index] >= 0 ? '+' : ''}{portfolioPerformance.monthlyReturns[index]}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Asset Allocation Report */}
        {selectedReport === 'allocation' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Current Asset Allocation</CardTitle>
                <CardDescription>Distribution of your investment portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(assetAllocation).map(([asset, percentage]) => (
                    <div key={asset} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{asset}</span>
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allocation Analysis</CardTitle>
                <CardDescription>How your allocation compares to recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Diversification Score</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="flex-1 h-2" />
                      <span className="text-sm font-medium">75/100</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">Good diversification across asset classes</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Recommendations</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Consider reducing crypto allocation to 10%</li>
                      <li>• Increase international exposure</li>
                      <li>• Add REITs for better diversification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Risk Analysis Report */}
        {selectedReport === 'risk' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
                <CardDescription>Key risk indicators for your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm text-purple-600 mb-1">Portfolio Risk</h3>
                    <p className="text-2xl font-bold text-purple-700">{riskMetrics.portfolioRisk}/10</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm text-green-600 mb-1">Expected Return</h3>
                    <p className="text-2xl font-bold text-green-700">{riskMetrics.expectedReturn}%</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm text-red-600 mb-1">Max Drawdown</h3>
                    <p className="text-2xl font-bold text-red-700">{riskMetrics.maxDrawdown}%</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm text-blue-600 mb-1">Sharpe Ratio</h3>
                    <p className="text-2xl font-bold text-blue-700">{riskMetrics.sharpeRatio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Analysis of your risk profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Risk Level: Moderate</h4>
                    <p className="text-sm text-green-700">
                      Your portfolio risk level aligns well with a moderate risk tolerance. 
                      The current allocation provides a good balance between growth potential and stability.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Volatility Analysis</h4>
                    <p className="text-sm text-blue-700">
                      Expected monthly volatility is around 4-6%, which is typical for a diversified portfolio 
                      with your risk profile.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Debt Analysis Report */}
        {selectedReport === 'debt' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Debt Summary</CardTitle>
                <CardDescription>Overview of your current debt situation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm text-red-600 mb-1">Total Debt</h3>
                    <p className="text-2xl font-bold text-red-700">₹{debtAnalysis.totalDebt.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm text-orange-600 mb-1">Monthly Payments</h3>
                    <p className="text-2xl font-bold text-orange-700">₹{debtAnalysis.monthlyPayments}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm text-yellow-600 mb-1">Avg Interest Rate</h3>
                    <p className="text-2xl font-bold text-yellow-700">{debtAnalysis.averageRate}%</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm text-blue-600 mb-1">Payoff Time</h3>
                    <p className="text-2xl font-bold text-blue-700">{debtAnalysis.payoffTime} years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Debt Optimization</CardTitle>
                <CardDescription>Strategies to reduce your debt burden</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Potential Savings</h4>
                    <p className="text-lg font-bold text-green-700">₹{debtAnalysis.interestSavings.toLocaleString()}</p>
                    <p className="text-sm text-green-700">
                      By following the debt avalanche method, you could save this much in interest payments.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Focus on high-interest debt first</li>
                      <li>• Consider debt consolidation options</li>
                      <li>• Increase monthly payments by ₹100</li>
                      <li>• Use windfalls for debt reduction</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      </PageTransition>
      <Footer />
    </div>
  );
};

export default Reports;
