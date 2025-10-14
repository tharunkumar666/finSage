
import { useState } from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Info, DollarSign, Calendar, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Investment {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
  risk: string;
  sector?: string;
  recommendation: string;
  yield?: number;
  rating?: string;
  marketCap?: string;
  rate?: number;
  fdic?: string;
}

interface InvestmentDetailsProps {
  investment: Investment | null;
  isOpen: boolean;
  onClose: () => void;
}

const InvestmentDetails = ({ investment, isOpen, onClose }: InvestmentDetailsProps) => {
  if (!investment) return null;

  const getRiskColor = (risk: string) => {
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

  const mockPerformanceData = [
    { period: '1W', return: 2.4 },
    { period: '1M', return: -1.2 },
    { period: '3M', return: 8.7 },
    { period: '6M', return: 15.3 },
    { period: '1Y', return: 22.1 },
    { period: 'YTD', return: 18.5 }
  ];

  const mockNews = [
    {
      title: `${investment.name} reports strong Q4 earnings`,
      date: '2024-01-15',
      summary: 'Company exceeds analyst expectations with 15% revenue growth year-over-year.'
    },
    {
      title: 'Market analysts upgrade rating',
      date: '2024-01-12',
      summary: 'Multiple analysts upgrade price target citing strong fundamentals and market position.'
    },
    {
      title: 'New product launch announcement',
      date: '2024-01-10',
      summary: 'Company announces innovative product line expected to drive future growth.'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{investment.name}</h2>
              <p className="text-gray-600">{investment.symbol}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                ₹{typeof investment.price === 'number' ? investment.price.toFixed(2) : investment.price}
              </div>
              {investment.change !== undefined && (
                <div className={`text-sm ${investment.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {investment.change >= 0 ? '+' : ''}₹{investment.change} ({investment.changePercent >= 0 ? '+' : ''}{investment.changePercent}%)
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Key Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level</span>
                    <Badge className={getRiskColor(investment.risk)}>
                      {investment.risk}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recommendation</span>
                    <Badge className={`text-white ${getRecommendationColor(investment.recommendation)}`}>
                      {investment.recommendation}
                    </Badge>
                  </div>
                  
                  {investment.sector && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sector</span>
                      <span className="font-medium">{investment.sector}</span>
                    </div>
                  )}
                  
                  {investment.yield && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yield</span>
                      <span className="font-medium">{investment.yield}%</span>
                    </div>
                  )}
                  
                  {investment.rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium">{investment.rating}</span>
                    </div>
                  )}
                  
                  {investment.marketCap && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Cap</span>
                      <span className="font-medium">₹{investment.marketCap}</span>
                    </div>
                  )}
                  
                  {investment.rate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate</span>
                      <span className="font-medium">{investment.rate}% APY</span>
                    </div>
                  )}
                  
                  {investment.fdic && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">FDIC Insured</span>
                      <span className="font-medium">{investment.fdic}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Investment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {investment.name} is a {investment.risk.toLowerCase()} risk investment 
                    {investment.sector && ` in the ${investment.sector.toLowerCase()} sector`}.
                    Our AI analysis suggests this investment is a {investment.recommendation.toLowerCase()} 
                    based on current market conditions and your risk profile.
                  </p>
                  
                  {investment.recommendation === 'Strong Buy' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        <strong>Strong Buy:</strong> This investment shows exceptional potential 
                        and aligns well with your investment goals and risk tolerance.
                      </p>
                    </div>
                  )}
                  
                  {investment.recommendation === 'Buy' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <strong>Buy:</strong> This investment presents good opportunities 
                        and fits your portfolio diversification strategy.
                      </p>
                    </div>
                  )}
                  
                  {investment.recommendation === 'Hold' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        <strong>Hold:</strong> Current market conditions suggest maintaining 
                        existing positions while monitoring for better entry points.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Historical Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {mockPerformanceData.map((period) => (
                    <div key={period.period} className="text-center">
                      <div className="text-sm text-gray-600 mb-1">{period.period}</div>
                      <div className={`text-lg font-bold ${period.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {period.return >= 0 ? '+' : ''}{period.return}%
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Performance Insights</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Strong long-term performance with 22.1% annual returns</li>
                    <li>• Slight short-term volatility but positive YTD performance</li>
                    <li>• Outperforming market benchmarks in 6-month and 1-year periods</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">Strong financial fundamentals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">Consistent revenue growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">Market leadership position</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">Innovation and R&D investment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm">Market volatility exposure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm">Regulatory changes impact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm">Competition from new entrants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm">Economic downturn sensitivity</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-900 leading-relaxed">
                    Based on your moderate risk profile and investment goals, {investment.name} 
                    represents a suitable addition to your portfolio. The investment aligns with 
                    your diversification strategy and offers good potential for long-term growth. 
                    Consider allocating 5-10% of your portfolio to this investment, and monitor 
                    market conditions for optimal entry timing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div className="space-y-4">
              {mockNews.map((news, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{news.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {news.date}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{news.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <DollarSign className="mr-2 h-4 w-4" />
            Add to Portfolio
          </Button>
          <Button variant="outline" className="flex-1">
            <Target className="mr-2 h-4 w-4" />
            Set Price Alert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDetails;
