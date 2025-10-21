import { useState } from 'react';
import { Check, Star, Zap, TrendingUp, Shield, Headphones } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
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
      price: billingCycle === 'monthly' ? 19.99 : 199.99,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Unlock advanced features and AI-powered insights to supercharge your financial journey
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="ml-2 bg-green-100 text-green-800">Save 17%</Badge>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-green-500 border-2' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.current 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : plan.popular 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is my data secure?</h4>
                <p className="text-gray-600 text-sm">Absolutely. We use bank-level encryption and never store your financial login credentials. Your data is protected with the highest security standards.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Do you offer student discounts?</h4>
                <p className="text-gray-600 text-sm">Yes! We offer 50% off all premium plans for verified students. Contact support with your student ID for verification.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through Stripe.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Premium;
