import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface SIPData {
  monthlyAmount: number;
  rate: number;
  years: number;
}

interface StepUpSIPData {
  initialAmount: number;
  stepUpRate: number;
  rate: number;
  years: number;
}

interface DebtData {
  principal: number;
  rate: number;
  monthlyPayment: number;
}

interface SIPResult {
  futureValue: number;
  totalInvested: number;
  returns: number;
}

interface StepUpSIPResult {
  futureValue: number;
  totalInvested: number;
  returns: number;
}

interface DebtResult {
  years: number;
  months: number;
  totalPayment: number;
  totalInterest: number;
}

const Calculators = () => {
  const [activeCalculator, setActiveCalculator] = useState<'sip' | 'stepup' | 'debt'>('sip');
  const [sipData, setSipData] = useState<SIPData>({ monthlyAmount: 5000, rate: 12, years: 5 });
  const [stepUpData, setStepUpData] = useState<StepUpSIPData>({ initialAmount: 5000, stepUpRate: 10, rate: 12, years: 5 });
  const [debtData, setDebtData] = useState<DebtData>({ principal: 100000, rate: 15, monthlyPayment: 5000 });
  const [sipResult, setSipResult] = useState<SIPResult>({ futureValue: 0, totalInvested: 0, returns: 0 });
  const [stepUpResult, setStepUpResult] = useState<StepUpSIPResult>({ futureValue: 0, totalInvested: 0, returns: 0 });
  const [debtResult, setDebtResult] = useState<DebtResult>({ years: 0, months: 0, totalPayment: 0, totalInterest: 0 });
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    if (calculated) {
      if (activeCalculator === 'sip') {
        calculateSIP();
      } else if (activeCalculator === 'stepup') {
        calculateStepUpSIP();
      } else if (activeCalculator === 'debt') {
        calculateDebtPayoff();
      }
    }
  }, [activeCalculator]);

  const calculateSIP = () => {
    const monthlyRate = sipData.rate / 12 / 100;
    const months = sipData.years * 12;
    const futureValue = sipData.monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    const totalInvested = sipData.monthlyAmount * months;
    const returns = futureValue - totalInvested;

    setSipResult({
      futureValue: parseFloat(futureValue.toFixed(0)),
      totalInvested: parseFloat(totalInvested.toFixed(0)),
      returns: parseFloat(returns.toFixed(0)),
    });
  };

  const calculateStepUpSIP = () => {
    let futureValue = 0;
    let totalInvested = 0;
    let monthlyInvestment = stepUpData.initialAmount;
    const monthlyRate = stepUpData.rate / 12 / 100;

    for (let year = 1; year <= stepUpData.years; year++) {
      for (let month = 1; month <= 12; month++) {
        futureValue += monthlyInvestment;
        totalInvested += monthlyInvestment;
        futureValue *= (1 + monthlyRate);
      }
      monthlyInvestment *= (1 + stepUpData.stepUpRate / 100);
    }

    const returns = futureValue - totalInvested;

    setStepUpResult({
      futureValue: parseFloat(futureValue.toFixed(0)),
      totalInvested: parseFloat(totalInvested.toFixed(0)),
      returns: parseFloat(returns.toFixed(0)),
    });
  };

  const calculateDebtPayoff = () => {
    const monthlyRate = debtData.rate / 12 / 100;
    let balance = debtData.principal;
    let months = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    while (balance > 0) {
      const interest = balance * monthlyRate;
      const principalPayment = debtData.monthlyPayment - interest;

      if (principalPayment > balance) {
        totalInterest += interest;
        totalPayment += balance + interest;
        balance = 0;
      } else {
        balance -= principalPayment;
        totalInterest += interest;
        totalPayment += debtData.monthlyPayment;
      }

      months++;

      if (months > 1200) {
        break;
      }
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    setDebtResult({
      years,
      months: remainingMonths,
      totalPayment: parseFloat(totalPayment.toFixed(0)),
      totalInterest: parseFloat(totalInterest.toFixed(0)),
    });
  };

  const handleCalculate = () => {
    setCalculated(true);
    if (activeCalculator === 'sip') {
      calculateSIP();
    } else if (activeCalculator === 'stepup') {
      calculateStepUpSIP();
    } else {
      calculateDebtPayoff();
    }
  };

  const generateSIPChartData = () => {
    const chartData = [];
    let invested = 0;
    let value = 0;
    const monthlyRate = sipData.rate / 12 / 100;

    for (let year = 1; year <= sipData.years; year++) {
      for (let month = 1; month <= 12; month++) {
        invested += sipData.monthlyAmount;
        value += sipData.monthlyAmount;
        value *= (1 + monthlyRate);
      }
      chartData.push({
        year: year,
        invested: parseFloat(invested.toFixed(0)),
        value: parseFloat(value.toFixed(0)),
      });
    }
    return chartData;
  };

  const generateDebtChartData = () => {
    const chartData = [];
    let balance = debtData.principal;
    let totalPaid = 0;
    const monthlyRate = debtData.rate / 12 / 100;
    let year = 0;

    while (balance > 0 && year <= 30) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      for (let month = 0; month < 12 && balance > 0; month++) {
        const interest = balance * monthlyRate;
        const principalPayment = debtData.monthlyPayment - interest;

        if (principalPayment > balance) {
          totalPaid += balance + interest;
          yearlyInterest += interest;
          balance = 0;
        } else {
          balance -= principalPayment;
          totalPaid += debtData.monthlyPayment;
          yearlyInterest += interest;
          yearlyPrincipal += principalPayment;
        }
      }
      chartData.push({
        year: ++year,
        balance: parseFloat(balance.toFixed(0)),
        totalPaid: parseFloat(totalPaid.toFixed(0)),
      });
    }
    return chartData;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Financial Calculators</h1>
          <p className="text-muted-foreground">Plan your investments and debt repayment strategies</p>
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
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-foreground">
                <Calculator className="h-5 w-5 text-primary" />
                {activeCalculator === 'sip' && 'SIP Calculator'}
                {activeCalculator === 'stepup' && 'Step-up SIP Calculator'}
                {activeCalculator === 'debt' && 'Debt Payoff Calculator'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {activeCalculator === 'sip' && 'Calculate returns from systematic investment plans'}
                {activeCalculator === 'stepup' && 'Plan increasing SIP amounts over time'}
                {activeCalculator === 'debt' && 'Calculate time to pay off your debts'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCalculator === 'sip' && (
                <>
                  <div>
                    <Label htmlFor="sipAmount" className="text-foreground">Monthly Investment (₹)</Label>
                    <Input
                      id="sipAmount"
                      type="number"
                      value={sipData.monthlyAmount}
                      onChange={(e) => setSipData({...sipData, monthlyAmount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sipRate" className="text-foreground">Expected Annual Return (%)</Label>
                    <Input
                      id="sipRate"
                      type="number"
                      value={sipData.rate}
                      onChange={(e) => setSipData({...sipData, rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sipYears" className="text-foreground">Investment Period (Years)</Label>
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
                    <Label htmlFor="initialAmount" className="text-foreground">Initial Monthly Amount (₹)</Label>
                    <Input
                      id="initialAmount"
                      type="number"
                      value={stepUpData.initialAmount}
                      onChange={(e) => setStepUpData({...stepUpData, initialAmount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stepUpRate" className="text-foreground">Annual Step-up Rate (%)</Label>
                    <Input
                      id="stepUpRate"
                      type="number"
                      value={stepUpData.stepUpRate}
                      onChange={(e) => setStepUpData({...stepUpData, stepUpRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedReturn" className="text-foreground">Expected Annual Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      value={stepUpData.rate}
                      onChange={(e) => setStepUpData({...stepUpData, rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="investmentYears" className="text-foreground">Investment Period (Years)</Label>
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
                    <Label htmlFor="principal" className="text-foreground">Outstanding Amount (₹)</Label>
                    <Input
                      id="principal"
                      type="number"
                      value={debtData.principal}
                      onChange={(e) => setDebtData({...debtData, principal: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate" className="text-foreground">Interest Rate (% per annum)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      value={debtData.rate}
                      onChange={(e) => setDebtData({...debtData, rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyPayment" className="text-foreground">Monthly Payment (₹)</Label>
                    <Input
                      id="monthlyPayment"
                      type="number"
                      value={debtData.monthlyPayment}
                      onChange={(e) => setDebtData({...debtData, monthlyPayment: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </>
              )}
              
              <Button onClick={handleCalculate} className="w-full mt-4 gradient-bg text-primary-foreground">
                Calculate
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="font-display text-foreground">Results</CardTitle>
              <CardDescription className="text-muted-foreground">Your calculation results</CardDescription>
            </CardHeader>
            <CardContent>
              {activeCalculator === 'sip' && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Maturity Amount</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-300">₹{sipResult.futureValue.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-300">Total Invested</p>
                      <p className="font-semibold text-foreground">₹{sipResult.totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                      <p className="text-sm text-purple-600 dark:text-purple-300">Total Returns</p>
                      <p className="font-semibold text-foreground">₹{sipResult.returns.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeCalculator === 'stepup' && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Maturity Amount</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-300">₹{stepUpResult.futureValue.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-300">Total Invested</p>
                      <p className="font-semibold text-foreground">₹{stepUpResult.totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                      <p className="text-sm text-purple-600 dark:text-purple-300">Total Returns</p>
                      <p className="font-semibold text-foreground">₹{stepUpResult.returns.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeCalculator === 'debt' && (
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">Payoff Time</h3>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-300">{debtResult.years} years</p>
                    <p className="text-sm text-red-600 dark:text-red-300">({debtResult.months} months)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                      <p className="text-sm text-orange-600 dark:text-orange-300">Total Payment</p>
                      <p className="font-semibold text-foreground">₹{debtResult.totalPayment.toLocaleString()}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg">
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">Total Interest</p>
                      <p className="font-semibold text-foreground">₹{debtResult.totalInterest.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        {calculated && (
          <Card className="mt-8 rounded-2xl">
            <CardHeader>
              <CardTitle className="font-display text-foreground">
                {activeCalculator === 'sip' && 'SIP Growth Projection'}
                {activeCalculator === 'stepup' && 'Step-up SIP Growth Projection'}
                {activeCalculator === 'debt' && 'Debt Payoff Timeline'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Visual representation of your calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {(activeCalculator === 'sip' || activeCalculator === 'stepup') ? (
                    <LineChart data={generateSIPChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="invested" stroke="#8884d8" name="Invested" />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Total Value" />
                    </LineChart>
                  ) : (
                    <BarChart data={generateDebtChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="balance" fill="#ef4444" name="Remaining Balance" />
                      <Bar dataKey="totalPaid" fill="#3b82f6" name="Total Paid" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Calculators;
