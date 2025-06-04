
import { useState } from 'react';
import { Plus, TrendingDown, Calculator, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const DebtAdvisor = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [debts, setDebts] = useState([
    {
      id: 1,
      name: 'Student Loan',
      balance: 25000,
      rate: 6.8,
      minPayment: 280,
      type: 'Student Loan'
    },
    {
      id: 2,
      name: 'Credit Card',
      balance: 3500,
      rate: 18.9,
      minPayment: 105,
      type: 'Credit Card'
    },
    {
      id: 3,
      name: 'Car Loan',
      balance: 12000,
      rate: 5.2,
      minPayment: 350,
      type: 'Auto Loan'
    }
  ]);

  const [strategy, setStrategy] = useState('avalanche');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: '',
    balance: '',
    rate: '',
    minPayment: '',
    type: 'Credit Card'
  });

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
  const weightedAvgRate = debts.reduce((sum, debt) => sum + (debt.rate * debt.balance), 0) / totalDebt;

  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'avalanche') {
      return b.rate - a.rate; // Highest rate first
    } else {
      return a.balance - b.balance; // Smallest balance first
    }
  });

  const handleAddDebt = () => {
    if (newDebt.name && newDebt.balance && newDebt.rate && newDebt.minPayment) {
      const debt = {
        id: Date.now(),
        name: newDebt.name,
        balance: parseFloat(newDebt.balance),
        rate: parseFloat(newDebt.rate),
        minPayment: parseFloat(newDebt.minPayment),
        type: newDebt.type
      };
      setDebts([...debts, debt]);
      setNewDebt({ name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card' });
      setShowAddForm(false);
    }
  };

  const calculatePayoffTime = (balance: number, rate: number, payment: number) => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return Math.ceil(balance / payment);
    const months = -Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Debt Advisor
          </h1>
          <p className="text-gray-600">
            Manage and optimize your debt repayment strategy
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDebt.toLocaleString()}</div>
              <p className="text-xs text-gray-600">
                Across {debts.length} accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
              <Calculator className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMinPayment.toLocaleString()}</div>
              <p className="text-xs text-gray-600">
                Minimum required
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weightedAvgRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-600">
                Weighted average
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Debts</h2>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Debt
              </Button>
            </div>

            {/* Add Debt Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Debt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="debt-name">Debt Name</Label>
                      <Input
                        id="debt-name"
                        value={newDebt.name}
                        onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
                        placeholder="e.g., Chase Credit Card"
                      />
                    </div>
                    <div>
                      <Label htmlFor="debt-type">Type</Label>
                      <Select value={newDebt.type} onValueChange={(value) => setNewDebt({...newDebt, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Student Loan">Student Loan</SelectItem>
                          <SelectItem value="Auto Loan">Auto Loan</SelectItem>
                          <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="balance">Balance</Label>
                      <Input
                        id="balance"
                        type="number"
                        value={newDebt.balance}
                        onChange={(e) => setNewDebt({...newDebt, balance: e.target.value})}
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rate">Interest Rate (%)</Label>
                      <Input
                        id="rate"
                        type="number"
                        step="0.1"
                        value={newDebt.rate}
                        onChange={(e) => setNewDebt({...newDebt, rate: e.target.value})}
                        placeholder="6.8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment">Min Payment</Label>
                      <Input
                        id="payment"
                        type="number"
                        value={newDebt.minPayment}
                        onChange={(e) => setNewDebt({...newDebt, minPayment: e.target.value})}
                        placeholder="280"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddDebt} className="bg-green-600 hover:bg-green-700">
                      Add Debt
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Debts List */}
            <div className="space-y-4">
              {debts.map((debt) => (
                <Card key={debt.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{debt.name}</h3>
                        <p className="text-gray-600">{debt.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${debt.balance.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{debt.rate}% APR</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Monthly Payment: ${debt.minPayment}</span>
                        <span>Payoff Time: {calculatePayoffTime(debt.balance, debt.rate, debt.minPayment)} months</span>
                      </div>
                      <Progress value={(debt.minPayment / debt.balance) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Debt Repayment Strategy</CardTitle>
                <CardDescription>
                  Choose the strategy that works best for your situation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${strategy === 'avalanche' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                       onClick={() => setStrategy('avalanche')}>
                    <h3 className="text-lg font-semibold mb-2">Debt Avalanche</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Pay minimums on all debts, then put extra money toward the highest interest rate debt first.
                    </p>
                    <div className="text-sm font-medium text-green-600">
                      ✓ Saves more money on interest
                    </div>
                  </div>
                  
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${strategy === 'snowball' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                       onClick={() => setStrategy('snowball')}>
                    <h3 className="text-lg font-semibold mb-2">Debt Snowball</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Pay minimums on all debts, then put extra money toward the smallest balance first.
                    </p>
                    <div className="text-sm font-medium text-blue-600">
                      ✓ Provides psychological wins
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Recommended Payoff Order ({strategy === 'avalanche' ? 'Avalanche' : 'Snowball'})
                  </h3>
                  <div className="space-y-3">
                    {sortedDebts.map((debt, index) => (
                      <div key={debt.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{debt.name}</h4>
                          <p className="text-sm text-gray-600">
                            ${debt.balance.toLocaleString()} at {debt.rate}% APR
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${debt.minPayment}/month</p>
                          <p className="text-xs text-gray-600">min payment</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Debt Payoff Calculator</CardTitle>
                <CardDescription>
                  See how extra payments can accelerate your debt freedom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-16 w-16 mx-auto mb-4" />
                  <p>Interactive debt payoff calculator coming soon!</p>
                  <p className="text-sm">Calculate payoff times with extra payments</p>
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

export default DebtAdvisor;
