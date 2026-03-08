import { useState } from 'react';
import { Check, Star, Zap, TrendingUp, Shield, Headphones } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';

const Premium = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const features = [
    {
      icon: TrendingUp,
      title: 'AI-Powered Investment Advice',
      description: 'Get personalized investment recommendations based on advanced AI analysis'
    },
    {
      icon: Shield,
      title: 'Advanced Portfolio Analytics',
      description: 'Deep insights into your portfolio performance with detailed charts and metrics'
    },
    {
      icon: Headphones,
      title: 'Priority Customer Support',
      description: '24/7 premium support with faster response times'
    },
    {
      icon: Star,
      title: 'Exclusive Market Insights',
      description: 'Access to premium market research and investment opportunities'
    },
    {
      icon: Zap,
      title: 'Advanced Calculators',
      description: 'Sophisticated financial planning tools and calculators'
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'Forever',
      features: [
        'Basic risk assessment',
        'Simple investment tracking',
        'Basic debt management',
        'Standard calculators',
        'Email support'
      ],
      current: true
    },
    {
      name: 'Premium',
      price: billingCycle === 'monthly' ? 199 : 1999,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      features: [
        'Everything in Free',
        'AI-powered investment advice',
        'Advanced portfolio analytics',
        'Priority support',
        'Exclusive market insights',
        'Advanced calculators',
        'No ads',
        'Export data'
      ],
      popular: true
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? 499 : 4999,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      features: [
        'Everything in Premium',
        'Custom investment strategies',
        'Real-time alerts',
        'Tax optimization tools',
        'Dedicated account manager',
        'API access',
        'White-label solutions'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <PageTransition>
      <main id="main-content" role="main" className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unlock advanced features and AI-powered insights to supercharge your financial journey
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-primary-foreground transition ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="ml-2" variant="secondary">Save 17%</Badge>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary border-2' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.current 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  disabled={plan.current || !plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Coming Soon'}
                </Button>
                {!plan.current && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Stripe payment integration launching soon
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h4>
                <p className="text-muted-foreground text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Is my data secure?</h4>
                <p className="text-muted-foreground text-sm">Absolutely. We use bank-level encryption and never store your financial login credentials. Your data is protected with the highest security standards.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Do you offer student discounts?</h4>
                <p className="text-muted-foreground text-sm">Yes! We offer 50% off all premium plans for verified students. Contact support with your student ID for verification.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h4>
                <p className="text-muted-foreground text-sm">We accept all major credit cards, UPI, and net banking. All payments are processed securely through Stripe.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      </PageTransition>
      <Footer />
    </div>
  );
};

export default Premium;
