import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, TrendingUp, Loader2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvestmentSuggestion {
  category: string;
  allocation: number;
  options: Array<{
    name: string;
    type: string;
    expectedReturn: string;
    risk: string;
  }>;
}

const InvestmentJourney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<InvestmentSuggestion[]>([]);
  const [isExisting, setIsExisting] = useState(false);
  const [riskProfile, setRiskProfile] = useState('Moderate');
  const [selectedInvestments, setSelectedInvestments] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    checkExistingInvestments();
    loadUserProfile();
  }, []);

  const checkExistingInvestments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('investments')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) throw error;
      setIsExisting(data && data.length > 0);
    } catch (error) {
      console.error('Error checking investments:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('risk_profile')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data?.risk_profile && data.risk_profile !== 'Not Assessed') {
        setRiskProfile(data.risk_profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const generateSuggestions = () => {
    if (!amount || !frequency) {
      toast({
        title: "Missing Information",
        description: "Please enter investment amount and frequency",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Generate suggestions based on risk profile
    let investmentPlan: InvestmentSuggestion[] = [];

    if (riskProfile === 'Conservative') {
      investmentPlan = [
        {
          category: 'Debt Mutual Funds',
          allocation: 40,
          options: [
            { name: 'HDFC Short Term Debt Fund', type: 'Mutual Fund', expectedReturn: '7-8%', risk: 'Low' },
            { name: 'ICICI Prudential Bond Fund', type: 'Mutual Fund', expectedReturn: '7-9%', risk: 'Low' },
          ]
        },
        {
          category: 'Fixed Deposits',
          allocation: 30,
          options: [
            { name: 'SBI Fixed Deposit', type: 'Fixed Deposit', expectedReturn: '6.5-7%', risk: 'Very Low' },
            { name: 'HDFC Bank FD', type: 'Fixed Deposit', expectedReturn: '6.5-7%', risk: 'Very Low' },
          ]
        },
        {
          category: 'Equity (Large Cap)',
          allocation: 20,
          options: [
            { name: 'Nifty 50 Index Fund', type: 'Index Fund', expectedReturn: '10-12%', risk: 'Medium' },
            { name: 'HDFC Top 100 Fund', type: 'Mutual Fund', expectedReturn: '10-12%', risk: 'Medium' },
          ]
        },
        {
          category: 'Gold ETF',
          allocation: 10,
          options: [
            { name: 'SBI Gold ETF', type: 'ETF', expectedReturn: '8-10%', risk: 'Low' },
            { name: 'Nippon India Gold ETF', type: 'ETF', expectedReturn: '8-10%', risk: 'Low' },
          ]
        }
      ];
    } else if (riskProfile === 'Moderate') {
      investmentPlan = [
        {
          category: 'Equity (Large & Mid Cap)',
          allocation: 40,
          options: [
            { name: 'HDFC Balanced Advantage Fund', type: 'Mutual Fund', expectedReturn: '12-15%', risk: 'Medium' },
            { name: 'SBI Equity Hybrid Fund', type: 'Mutual Fund', expectedReturn: '12-14%', risk: 'Medium' },
          ]
        },
        {
          category: 'Index Funds',
          allocation: 25,
          options: [
            { name: 'Nifty 50 Index Fund', type: 'Index Fund', expectedReturn: '10-12%', risk: 'Medium' },
            { name: 'Nifty Next 50 Index Fund', type: 'Index Fund', expectedReturn: '12-14%', risk: 'Medium' },
          ]
        },
        {
          category: 'Debt Funds',
          allocation: 20,
          options: [
            { name: 'ICICI Corporate Bond Fund', type: 'Mutual Fund', expectedReturn: '7-9%', risk: 'Low' },
            { name: 'Axis Banking & PSU Debt Fund', type: 'Mutual Fund', expectedReturn: '7-8%', risk: 'Low' },
          ]
        },
        {
          category: 'Gold & Crypto',
          allocation: 15,
          options: [
            { name: 'Gold ETF', type: 'ETF', expectedReturn: '8-10%', risk: 'Low' },
            { name: 'Bitcoin (Small allocation)', type: 'Crypto', expectedReturn: '15-25%', risk: 'High' },
          ]
        }
      ];
    } else { // Aggressive
      investmentPlan = [
        {
          category: 'Equity (Mid & Small Cap)',
          allocation: 50,
          options: [
            { name: 'Axis Midcap Fund', type: 'Mutual Fund', expectedReturn: '15-18%', risk: 'High' },
            { name: 'SBI Small Cap Fund', type: 'Mutual Fund', expectedReturn: '16-20%', risk: 'Very High' },
            { name: 'Kotak Emerging Equity Fund', type: 'Mutual Fund', expectedReturn: '15-18%', risk: 'High' },
          ]
        },
        {
          category: 'High Growth Stocks',
          allocation: 25,
          options: [
            { name: 'Technology Stocks', type: 'Stocks', expectedReturn: '15-25%', risk: 'High' },
            { name: 'Emerging Sectors', type: 'Stocks', expectedReturn: '18-30%', risk: 'Very High' },
          ]
        },
        {
          category: 'Cryptocurrency',
          allocation: 15,
          options: [
            { name: 'Bitcoin', type: 'Crypto', expectedReturn: '20-40%', risk: 'Very High' },
            { name: 'Ethereum', type: 'Crypto', expectedReturn: '18-35%', risk: 'Very High' },
          ]
        },
        {
          category: 'Index Funds',
          allocation: 10,
          options: [
            { name: 'Nifty Next 50', type: 'Index Fund', expectedReturn: '12-14%', risk: 'Medium' },
            { name: 'Nifty Midcap 150', type: 'Index Fund', expectedReturn: '14-16%', risk: 'High' },
          ]
        }
      ];
    }

    setSuggestions(investmentPlan);
    setIsLoading(false);
  };

  const toggleInvestmentSelection = (investmentKey: string) => {
    setSelectedInvestments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(investmentKey)) {
        newSet.delete(investmentKey);
      } else {
        newSet.add(investmentKey);
      }
      return newSet;
    });
  };

  const handleProceed = async () => {
    if (selectedInvestments.size === 0) {
      toast({
        title: "No Investments Selected",
        description: "Please select at least one investment option to proceed",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const investmentsToCreate = [];
      
      suggestions.forEach((suggestion) => {
        suggestion.options.forEach((option) => {
          const key = `${suggestion.category}-${option.name}`;
          if (selectedInvestments.has(key)) {
            const allocation = ((investmentAmount * suggestion.allocation) / 100) / suggestion.options.length;
            investmentsToCreate.push({
              user_id: user.id,
              name: option.name,
              symbol: option.name.substring(0, 10).toUpperCase().replace(/\s/g, ''),
              shares: 1,
              current_price: allocation,
              purchase_price: allocation,
              purchase_date: new Date().toISOString().split('T')[0]
            });
          }
        });
      });

      const { error } = await supabase
        .from('investments')
        .insert(investmentsToCreate);

      if (error) throw error;

      toast({
        title: "Investment Plan Created!",
        description: `Successfully added ${investmentsToCreate.length} investments to your portfolio`,
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Error saving investments:', error);
      toast({
        title: "Error",
        description: "Failed to save your investments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const investmentAmount = parseFloat(amount) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-xl">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isExisting ? 'Improve Your Investment' : 'Start Your Investment Journey'}
          </h1>
          <p className="text-muted-foreground">
            Based on your {riskProfile} risk profile, we've created a personalized investment plan
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>Enter your investment preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Investment Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="onetime">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={generateSuggestions} 
                className="w-full mt-6"
                disabled={isLoading || !amount || !frequency}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  'Generate Investment Plan'
                )}
              </Button>
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your Personalized Investment Allocation</CardTitle>
                  <CardDescription>
                    Recommended distribution for your ₹{investmentAmount.toLocaleString()} {frequency} investment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-foreground">{suggestion.category}</h3>
                          <span className="text-sm font-medium text-primary">
                            {suggestion.allocation}% (₹{((investmentAmount * suggestion.allocation) / 100).toLocaleString()})
                          </span>
                        </div>
                        <Progress value={suggestion.allocation} className="h-2" />
                        
                        <div className="grid md:grid-cols-2 gap-3 mt-3">
                          {suggestion.options.map((option, optIndex) => {
                            const investmentKey = `${suggestion.category}-${option.name}`;
                            const isSelected = selectedInvestments.has(investmentKey);
                            
                            return (
                              <Card 
                                key={optIndex} 
                                className={`bg-muted/50 cursor-pointer transition-all ${
                                  isSelected ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => toggleInvestmentSelection(investmentKey)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-sm">{option.name}</h4>
                                    <Checkbox 
                                      checked={isSelected}
                                      onCheckedChange={() => toggleInvestmentSelection(investmentKey)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{option.type}</span>
                                    <span className="text-green-600">{option.expectedReturn}</span>
                                  </div>
                                  <div className="mt-1 text-xs">
                                    <span className={`font-medium ${
                                      option.risk === 'Low' || option.risk === 'Very Low' ? 'text-green-600' :
                                      option.risk === 'Medium' ? 'text-yellow-600' :
                                      'text-red-600'
                                    }`}>
                                      Risk: {option.risk}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {selectedInvestments.size} Investment{selectedInvestments.size !== 1 ? 's' : ''} Selected
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Click on investment cards to select or deselect them
                      </p>
                    </div>
                    <Button 
                      onClick={handleProceed} 
                      size="lg"
                      disabled={selectedInvestments.size === 0 || isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Save & Proceed
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default InvestmentJourney;
