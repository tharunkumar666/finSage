
import { useState } from 'react';
import { TrendingUp, DollarSign, Target, AlertCircle, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Mock data - will be replaced with real data from backend
  const mockData = {
    totalInvestments: 15420,
    monthlyReturns: 8.5,
    riskProfile: 'Moderate',
    portfolioAllocation: {
      stocks: 45,
      bonds: 25,
      crypto: 15,
      cash: 15
    },
    recentTransactions: [
      { type: 'Investment', amount: 500, asset: 'S&P 500 ETF', date: '2024-01-15' },
      { type: 'Investment', amount: 250, asset: 'Bitcoin', date: '2024-01-10' },
      { type: 'Withdrawal', amount: -100, asset: 'Cash', date: '2024-01-05' }
    ],
    debts: [
      { name: 'Student Loan', amount: 25000, rate: 6.8, payment: 280 },
      { name: 'Credit Card', amount: 1200, rate: 18.9, payment: 50 }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Student! 👋
          </h1>
          <p className="text-gray-600">
            Here's an overview of your financial journey
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockData.totalInvestments.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                +{mockData.monthlyReturns}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Profile</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.riskProfile}</div>
              <p className="text-xs text-blue-600">
                Balanced growth approach
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Returns</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{mockData.monthlyReturns}%</div>
              <p className="text-xs text-green-600">
                Above market average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockData.debts.reduce((total, debt) => total + debt.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-red-600">
                Avg rate: {((mockData.debts.reduce((total, debt) => total + debt.rate, 0) / mockData.debts.length)).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Allocation */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Your current investment distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stocks</span>
                  <span className="text-sm text-gray-600">{mockData.portfolioAllocation.stocks}%</span>
                </div>
                <Progress value={mockData.portfolioAllocation.stocks} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Bonds</span>
                  <span className="text-sm text-gray-600">{mockData.portfolioAllocation.bonds}%</span>
                </div>
                <Progress value={mockData.portfolioAllocation.bonds} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Crypto</span>
                  <span className="text-sm text-gray-600">{mockData.portfolioAllocation.crypto}%</span>
                </div>
                <Progress value={mockData.portfolioAllocation.crypto} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cash</span>
                  <span className="text-sm text-gray-600">{mockData.portfolioAllocation.cash}%</span>
                </div>
                <Progress value={mockData.portfolioAllocation.cash} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{transaction.asset}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                    <div className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col space-y-2">
                <PlusCircle className="h-6 w-6" />
                <span>Add Investment</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Target className="h-6 w-6" />
                <span>Set Goal</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <AlertCircle className="h-6 w-6" />
                <span>Manage Debt</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debt Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Debt Overview</CardTitle>
            <CardDescription>Track your debt repayment progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.debts.map((debt, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{debt.name}</h4>
                    <span className="text-sm text-gray-500">{debt.rate}% APR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${debt.amount.toLocaleString()}</span>
                    <span className="text-sm text-green-600">
                      ${debt.payment}/month
                    </span>
                  </div>
                  <Progress value={(debt.payment / debt.amount) * 100} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
