
import { useState } from 'react';
import { Calculator, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState('sip');
  const [sipData, setSipData] = useState({
    monthlyAmount: 1000,
    rate: 12,
    years: 10
  });

  const [stepUpData, setStepUpData] = useState({
    initialAmount: 1000,
    stepUpRate: 10,
    rate: 12,
    years: 10
  });

  const [debtData, setDebtData] = useState({
    principal: 50000,
    rate: 6.5,
    monthlyPayment: 500
  });

  const calculateSIP = () => {
    const monthlyRate = sipData.rate / 100 / 12;
    const months = sipData.years * 12;
    const futureValue = sipData.monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = sipData.monthlyAmount * months;
    const returns = futureValue - totalInvested;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvested,
      returns: Math.round(returns)
    };
  };

  const calculateStepUpSIP = () => {
    let futureValue = 0;
    let totalInvested = 0;
    let currentAmount = stepUpData.initialAmount;
    const monthlyRate = stepUpData.rate / 100 / 12;
    
    for (let year = 1; year <= stepUpData.years; year++) {
      const months = 12;
      const yearlyFV = currentAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
      futureValue += yearlyFV * ((1 + monthlyRate) ** ((stepUpData.years - year) * 12));
      totalInvested += currentAmount * 12;
      currentAmount = currentAmount * (1 + stepUpData.stepUpRate / 100);
    }
    
    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      returns: Math.round(futureValue - totalInvested)
    };
  };

  const calculateDebtPayoff = () => {
    const monthlyRate = debtData.rate / 100 / 12;
    const months = Math.log(1 + (debtData.principal * monthlyRate) / debtData.monthlyPayment) / Math.log(1 + monthlyRate);
    const totalPayment = debtData.monthlyPayment * months;
    const totalInterest = totalPayment - debtData.principal;
    
    return {
      months: Math.round(months),
      years: Math.round(months / 12 * 10) / 10,
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  };

  const sipResult = calculateSIP();
  const stepUpResult = calculateStepUpSIP();
  const debtResult = calculateDebtPayoff();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Calculators</h1>
          <p className="text-gray-600">Plan your investments and debt repayment strategies</p>
        </div>

        {/* Calculator Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveCalculator('sip')}
            variant={activeCalculator === 'sip' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <PiggyBank className="h-4 w-4" />
            SIP Calculator
          </Button>
          
          <Button
            onClick={() => setActiveCalculator('stepup')}
            variant={activeCalculator === 'stepup' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Step-up SIP
          </Button>
          
          <Button
            onClick={() => setActiveCalculator('debt')}
            variant={activeCalculator === 'debt' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Debt Payoff
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                {activeCalculator === 'sip' && 'SIP Calculator'}
                {activeCalculator === 'stepup' && 'Step-up SIP Calculator'}
                {activeCalculator === 'debt' && 'Debt Payoff Calculator'}
              </CardTitle>
              <CardDescription>
                {activeCalculator === 'sip' && 'Calculate returns from systematic investment plans'}
                {activeCalculator === 'stepup' && 'Plan increasing SIP amounts over time'}
                {activeCalculator === 'debt' && 'Calculate time to pay off your debts'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCalculator === 'sip' && (
                <>
                  <div>
                    <Label htmlFor="sipAmount">Monthly Investment (₹)</Label>
                    <Input
                      id="sipAmount"
                      type="number"
                      value={sipData.monthlyAmount}
                      onChange={(e) => setSipData({...sipData, monthlyAmount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sipRate">Expected Annual Return (%)</Label>
                    <Input
                      id="sipRate"
                      type="number"
                      value={sipData.rate}
                      onChange={(e) => setSipData({...sipData, rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sipYears">Investment Period (Years)</Label>
                    <Input
                      id="sipYears"
                      type="number"
                      value={sipData.years}
                      onChange={(e) => setSipData({...sipData, years: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </>
              )}

              {activeCalculator === 'stepup' && (
                <>
                  <div>
                    <Label htmlFor="initialAmount">Initial Monthly Amount (₹)</Label>
                    <Input
                      id="initialAmount"
                      type="number"
                      value={stepUpData.initialAmount}
                      onChange={(e) => setStepUpData({...stepUpData, initialAmount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stepUpRate">Annual Step-up Rate (%)</Label>
                    <Input
                      id="stepUpRate"
                      type="number"
                      value={stepUpData.stepUpRate}
                      onChange={(e) => setStepUpData({...stepUpData, stepUpRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      value={stepUpData.rate}
                      onChange={(e) => setStepUpData({...stepUpData, rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="investmentYears">Investment Period (Years)</Label>
                    <Input
                      id="investmentYears"
                      type="number"
                      value={stepUpData.years}
                      onChange={(e) => setStepUpData({...stepUpData, years: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </>
              )}

              {activeCalculator === 'debt' && (
                <>
                  <div>
                    <Label htmlFor="principal">Outstanding Amount (₹)</Label>
                    <Input
                      id="principal"
                      type="number"
                      value={debtData.principal}
                      onChange={(e) => setDebtData({...debtData, principal: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      value={debtData.rate}
                      onChange={(e) => setDebtData({...debtData, rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyPayment">Monthly Payment (₹)</Label>
                    <Input
                      id="monthlyPayment"
                      type="number"
                      value={debtData.monthlyPayment}
                      onChange={(e) => setDebtData({...debtData, monthlyPayment: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Your calculation results</CardDescription>
            </CardHeader>
            <CardContent>
              {activeCalculator === 'sip' && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Maturity Amount</h3>
                    <p className="text-2xl font-bold text-green-600">₹{sipResult.futureValue.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600">Total Invested</p>
                      <p className="font-semibold">₹{sipResult.totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-600">Total Returns</p>
                      <p className="font-semibold">₹{sipResult.returns.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeCalculator === 'stepup' && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Maturity Amount</h3>
                    <p className="text-2xl font-bold text-green-600">₹{stepUpResult.futureValue.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600">Total Invested</p>
                      <p className="font-semibold">₹{stepUpResult.totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-600">Total Returns</p>
                      <p className="font-semibold">₹{stepUpResult.returns.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeCalculator === 'debt' && (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Payoff Time</h3>
                    <p className="text-2xl font-bold text-red-600">{debtResult.years} years</p>
                    <p className="text-sm text-red-600">({debtResult.months} months)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-600">Total Payment</p>
                      <p className="font-semibold">₹{debtResult.totalPayment.toLocaleString()}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-600">Total Interest</p>
                      <p className="font-semibold">₹{debtResult.totalInterest.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Calculators;
