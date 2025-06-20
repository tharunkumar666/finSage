
import { useState } from 'react';
import { AlertCircle, TrendingDown, Calculator, Target, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const DebtAdvisor = () => {
  const [strategy, setStrategy] = useState('snowball');
  const [editingDebt, setEditingDebt] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [debts, setDebts] = useState([
    {
      id: 1,
      name: 'Credit Card A',
      balance: 5000,
      minPayment: 150,
      interestRate: 18.99,
      type: 'credit_card'
    },
    {
      id: 2,
      name: 'Student Loan',
      balance: 25000,
      minPayment: 280,
      interestRate: 6.8,
      type: 'student_loan'
    },
    {
      id: 3,
      name: 'Credit Card B',
      balance: 3200,
      minPayment: 100,
      interestRate: 21.99,
      type: 'credit_card'
    }
  ]);

  const [extraPayment, setExtraPayment] = useState(200);
  const [newDebt, setNewDebt] = useState({
    name: '',
    balance: 0,
    minPayment: 0,
    interestRate: 0,
    type: 'credit_card'
  });

  const addDebt = () => {
    if (newDebt.name && newDebt.balance > 0) {
      setDebts([...debts, { ...newDebt, id: Date.now() }]);
      setNewDebt({ name: '', balance: 0, minPayment: 0, interestRate: 0, type: 'credit_card' });
    }
  };

  const removeDebt = (id: number) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const editDebt = (debt) => {
    setEditingDebt(debt);
    setIsEditDialogOpen(true);
  };

  const updateDebt = () => {
    if (editingDebt) {
      setDebts(debts.map(debt => debt.id === editingDebt.id ? editingDebt : debt));
      setEditingDebt(null);
      setIsEditDialogOpen(false);
    }
  };

  const calculatePayoffPlan = () => {
    const sortedDebts = [...debts].sort((a, b) => {
      if (strategy === 'snowball') {
        return a.balance - b.balance; // Smallest balance first
      } else {
        return b.interestRate - a.interestRate; // Highest interest rate first
      }
    });

    let totalMonthsToPayoff = 0;
    let totalInterest = 0;
    let remainingDebts = [...sortedDebts];
    let currentExtraPayment = extraPayment;

    const payoffPlan = remainingDebts.map((debt, index) => {
      const monthlyPayment = debt.minPayment + (index === 0 ? currentExtraPayment : 0);
      const monthsToPayoff = Math.ceil(Math.log(1 + (debt.balance * (debt.interestRate / 100 / 12)) / monthlyPayment) / Math.log(1 + debt.interestRate / 100 / 12));
      const totalPayment = monthlyPayment * monthsToPayoff;
      const interestPaid = totalPayment - debt.balance;

      totalMonthsToPayoff = Math.max(totalMonthsToPayoff, monthsToPayoff);
      totalInterest += interestPaid;

      // Add this debt's minimum payment to extra payment for next debt
      if (index < remainingDebts.length - 1) {
        currentExtraPayment += debt.minPayment;
      }

      return {
        ...debt,
        monthsToPayoff,
        totalPayment: Math.round(totalPayment),
        interestPaid: Math.round(interestPaid),
        monthlyPayment: Math.round(monthlyPayment)
      };
    });

    return {
      payoffPlan,
      totalMonthsToPayoff,
      totalYearsToPayoff: Math.round(totalMonthsToPayoff / 12 * 10) / 10,
      totalInterest: Math.round(totalInterest),
      totalDebt: debts.reduce((sum, debt) => sum + debt.balance, 0)
    };
  };

  const results = calculatePayoffPlan();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-zinc-900 dark:to-slate-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <AlertCircle className="h-8 w-8 text-red-600" />
            Debt Advisor
          </h1>
          <p className="text-muted-foreground">Create a strategic plan to eliminate your debt faster</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Strategy Selection */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Payoff Strategy</CardTitle>
                <CardDescription className="text-muted-foreground">Choose your debt elimination approach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <button
                      onClick={() => setStrategy('snowball')}
                      className={`w-full p-4 rounded-lg border-2 transition-colors ${
                        strategy === 'snowball' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold mb-2 text-foreground">Debt Snowball</h3>
                      <p className="text-sm text-muted-foreground">Pay off smallest debts first for quick wins</p>
                    </button>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => setStrategy('avalanche')}
                      className={`w-full p-4 rounded-lg border-2 transition-colors ${
                        strategy === 'avalanche' 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                      }`}
                    >
                      <h3 className="font-semibold mb-2 text-foreground">Debt Avalanche</h3>
                      <p className="text-sm text-muted-foreground">Pay off highest interest debts first to save money</p>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Extra Payment</CardTitle>
                <CardDescription className="text-muted-foreground">Additional amount you can pay monthly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="extraPayment" className="text-foreground">Extra Monthly Payment ($)</Label>
                  <Input
                    id="extraPayment"
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(parseInt(e.target.value) || 0)}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Add New Debt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Add New Debt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="debtName" className="text-foreground">Debt Name</Label>
                  <Input
                    id="debtName"
                    value={newDebt.name}
                    onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
                    placeholder="e.g., Credit Card"
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="balance" className="text-foreground">Balance ($)</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={newDebt.balance || ''}
                    onChange={(e) => setNewDebt({...newDebt, balance: parseInt(e.target.value) || 0})}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="minPayment" className="text-foreground">Minimum Payment ($)</Label>
                  <Input
                    id="minPayment"
                    type="number"
                    value={newDebt.minPayment || ''}
                    onChange={(e) => setNewDebt({...newDebt, minPayment: parseInt(e.target.value) || 0})}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="interestRate" className="text-foreground">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={newDebt.interestRate || ''}
                    onChange={(e) => setNewDebt({...newDebt, interestRate: parseFloat(e.target.value) || 0})}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="debtType" className="text-foreground">Debt Type</Label>
                  <Select value={newDebt.type} onValueChange={(value) => setNewDebt({...newDebt, type: value})}>
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="student_loan">Student Loan</SelectItem>
                      <SelectItem value="personal_loan">Personal Loan</SelectItem>
                      <SelectItem value="auto_loan">Auto Loan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={addDebt} className="w-full">Add Debt</Button>
              </CardContent>
            </Card>
          </div>

          {/* Debt List and Results */}
          <div className="lg:col-span-2">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Debt</p>
                      <p className="text-2xl font-bold text-red-600">${results.totalDebt.toLocaleString()}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Payoff Time</p>
                      <p className="text-2xl font-bold text-blue-600">{results.totalYearsToPayoff} years</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Interest</p>
                      <p className="text-2xl font-bold text-orange-600">${results.totalInterest.toLocaleString()}</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payoff Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Your Debt Payoff Plan</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Using the {strategy === 'snowball' ? 'Debt Snowball' : 'Debt Avalanche'} method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.payoffPlan.map((debt, index) => (
                    <div key={debt.id} className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{debt.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Order: #{index + 1} • {debt.interestRate}% APR
                          </p>
                        </div>
                        <div className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => editDebt(debt)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => removeDebt(debt.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Balance</p>
                          <p className="font-semibold text-foreground">${debt.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Monthly Payment</p>
                          <p className="font-semibold text-foreground">${debt.monthlyPayment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payoff Time</p>
                          <p className="font-semibold text-foreground">{debt.monthsToPayoff} months</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Interest Paid</p>
                          <p className="font-semibold text-foreground">${debt.interestPaid.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress 
                          value={100 - (debt.balance / (debt.balance + debt.interestPaid)) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Debt Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Debt</DialogTitle>
              <DialogDescription>
                Update the details of your debt.
              </DialogDescription>
            </DialogHeader>
            {editingDebt && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editName" className="text-foreground">Debt Name</Label>
                  <Input
                    id="editName"
                    value={editingDebt.name}
                    onChange={(e) => setEditingDebt({...editingDebt, name: e.target.value})}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="editBalance" className="text-foreground">Balance ($)</Label>
                  <Input
                    id="editBalance"
                    type="number"
                    value={editingDebt.balance}
                    onChange={(e) => setEditingDebt({...editingDebt, balance: parseInt(e.target.value) || 0})}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="editMinPayment" className="text-foreground">Minimum Payment ($)</Label>
                  <Input
                    id="editMinPayment"
                    type="number"
                    value={editingDebt.minPayment}
                    onChange={(e) => setEditingDebt({...editingDebt, minPayment: parseInt(e.target.value) || 0})}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="editInterestRate" className="text-foreground">Interest Rate (%)</Label>
                  <Input
                    id="editInterestRate"
                    type="number"
                    step="0.1"
                    value={editingDebt.interestRate}
                    onChange={(e) => setEditingDebt({...editingDebt, interestRate: parseFloat(e.target.value) || 0})}
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <Button onClick={updateDebt} className="w-full">
                  Update Debt
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
};

export default DebtAdvisor;
