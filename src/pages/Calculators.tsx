
import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Calculators = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // SIP Calculator State
  const [sipInputs, setSipInputs] = useState({
    amount: '1000',
    rate: '12',
    years: '10'
  });

  // Step-up SIP Calculator State
  const [stepUpInputs, setStepUpInputs] = useState({
    amount: '1000',
    rate: '12',
    years: '10',
    stepUpRate: '10'
  });

  // Debt Calculator State
  const [debtInputs, setDebtInputs] = useState({
    principal: '10000',
    rate: '18',
    payment: '500'
  });

  const calculateSIP = () => {
    const P = parseFloat(sipInputs.amount);
    const r = parseFloat(sipInputs.rate) / 100 / 12;
    const n = parseFloat(sipInputs.years) * 12;
    
    if (r === 0) return P * n;
    
    const maturityAmount = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    return maturityAmount;
  };

  const calculateStepUpSIP = () => {
    const P = parseFloat(stepUpInputs.amount);
    const r = parseFloat(stepUpInputs.rate) / 100 / 12;
    const years = parseFloat(stepUpInputs.years);
    const stepUp = parseFloat(stepUpInputs.stepUpRate) / 100;
    
    let maturityAmount = 0;
    let currentSIP = P;
    
    for (let year = 1; year <= years; year++) {
      const n = 12; // months in a year
      if (r === 0) {
        maturityAmount += currentSIP * n;
      } else {
        maturityAmount += currentSIP * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      }
      currentSIP = currentSIP * (1 + stepUp);
    }
    
    return maturityAmount;
  };

  const calculateDebtPayoff = () => {
    const principal = parseFloat(debtInputs.principal);
    const monthlyRate = parseFloat(debtInputs.rate) / 100 / 12;
    const payment = parseFloat(debtInputs.payment);
    
    if (monthlyRate === 0) {
      return Math.ceil(principal / payment);
    }
    
    const months = -Math.log(1 - (principal * monthlyRate) / payment) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  };

  const sipMaturity = calculateSIP();
  const sipInvested = parseFloat(sipInputs.amount) * parseFloat(sipInputs.years) * 12;
  const sipGains = sipMaturity - sipInvested;

  const stepUpMaturity = calculateStepUpSIP();
  const regularSIPMaturity = calculateSIP();
  const stepUpBenefit = stepUpMaturity - regularSIPMaturity;

  const debtMonths = calculateDebtPayoff();
  const debtYears = Math.floor(debtMonths / 12);
  const remainingMonths = debtMonths % 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Calculators
          </h1>
          <p className="text-gray-600">
            Plan your investments and debt repayment with our interactive tools
          </p>
        </div>

        <Tabs defaultValue="sip" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
            <TabsTrigger value="stepup">Step-up SIP</TabsTrigger>
            <TabsTrigger value="debt">Debt Payoff</TabsTrigger>
          </TabsList>

          {/* SIP Calculator */}
          <TabsContent value="sip" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    SIP Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate your systematic investment plan returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sip-amount">Monthly Investment (₹)</Label>
                    <Input
                      id="sip-amount"
                      type="number"
                      value={sipInputs.amount}
                      onChange={(e) => setSipInputs({...sipInputs, amount: e.target.value})}
                      placeholder="1000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sip-rate">Expected Annual Return (%)</Label>
                    <Input
                      id="sip-rate"
                      type="number"
                      step="0.1"
                      value={sipInputs.rate}
                      onChange={(e) => setSipInputs({...sipInputs, rate: e.target.value})}
                      placeholder="12"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sip-years">Investment Period (Years)</Label>
                    <Input
                      id="sip-years"
                      type="number"
                      value={sipInputs.years}
                      onChange={(e) => setSipInputs({...sipInputs, years: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Total Invested</p>
                      <p className="text-xl font-bold text-blue-800">
                        ₹{sipInvested.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Total Gains</p>
                      <p className="text-xl font-bold text-green-800">
                        ₹{sipGains.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Maturity Amount</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{sipMaturity.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Investment</span>
                      <span>₹{sipInputs.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Investment Period</span>
                      <span>{sipInputs.years} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expected Return</span>
                      <span>{sipInputs.rate}% p.a.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Step-up SIP Calculator */}
          <TabsContent value="stepup" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Step-up SIP Calculator
                  </CardTitle>
                  <CardDescription>
                    See how increasing your SIP annually boosts returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="stepup-amount">Initial Monthly Investment (₹)</Label>
                    <Input
                      id="stepup-amount"
                      type="number"
                      value={stepUpInputs.amount}
                      onChange={(e) => setStepUpInputs({...stepUpInputs, amount: e.target.value})}
                      placeholder="1000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stepup-rate">Expected Annual Return (%)</Label>
                    <Input
                      id="stepup-rate"
                      type="number"
                      step="0.1"
                      value={stepUpInputs.rate}
                      onChange={(e) => setStepUpInputs({...stepUpInputs, rate: e.target.value})}
                      placeholder="12"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stepup-years">Investment Period (Years)</Label>
                    <Input
                      id="stepup-years"
                      type="number"
                      value={stepUpInputs.years}
                      onChange={(e) => setStepUpInputs({...stepUpInputs, years: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stepup-increment">Annual Step-up (%)</Label>
                    <Input
                      id="stepup-increment"
                      type="number"
                      step="0.1"
                      value={stepUpInputs.stepUpRate}
                      onChange={(e) => setStepUpInputs({...stepUpInputs, stepUpRate: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step-up vs Regular SIP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Regular SIP</p>
                      <p className="text-lg font-bold text-blue-800">
                        ₹{regularSIPMaturity.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Step-up SIP</p>
                      <p className="text-lg font-bold text-green-800">
                        ₹{stepUpMaturity.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Additional Benefit</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{stepUpBenefit.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Initial Monthly SIP</span>
                      <span>₹{stepUpInputs.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Annual Step-up</span>
                      <span>{stepUpInputs.stepUpRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Investment Period</span>
                      <span>{stepUpInputs.years} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expected Return</span>
                      <span>{stepUpInputs.rate}% p.a.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Debt Payoff Calculator */}
          <TabsContent value="debt" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-red-600" />
                    Debt Payoff Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate how long it will take to pay off your debt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="debt-principal">Total Debt Amount (₹)</Label>
                    <Input
                      id="debt-principal"
                      type="number"
                      value={debtInputs.principal}
                      onChange={(e) => setDebtInputs({...debtInputs, principal: e.target.value})}
                      placeholder="10000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="debt-rate">Annual Interest Rate (%)</Label>
                    <Input
                      id="debt-rate"
                      type="number"
                      step="0.1"
                      value={debtInputs.rate}
                      onChange={(e) => setDebtInputs({...debtInputs, rate: e.target.value})}
                      placeholder="18"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="debt-payment">Monthly Payment (₹)</Label>
                    <Input
                      id="debt-payment"
                      type="number"
                      value={debtInputs.payment}
                      onChange={(e) => setDebtInputs({...debtInputs, payment: e.target.value})}
                      placeholder="500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payoff Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Time to Pay Off</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {debtYears > 0 && `${debtYears} years `}
                      {remainingMonths} months
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Total Interest</p>
                      <p className="text-lg font-bold text-red-800">
                        ₹{((parseFloat(debtInputs.payment) * debtMonths) - parseFloat(debtInputs.principal)).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Total Payments</p>
                      <p className="text-lg font-bold text-blue-800">
                        ₹{(parseFloat(debtInputs.payment) * debtMonths).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Principal Amount</span>
                      <span>₹{parseFloat(debtInputs.principal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Interest Rate</span>
                      <span>{debtInputs.rate}% p.a.</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Payment</span>
                      <span>₹{debtInputs.payment}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Months</span>
                      <span>{debtMonths} months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Calculators;
