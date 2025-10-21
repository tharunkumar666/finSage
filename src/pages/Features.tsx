import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Shield, Calculator, Target, Users, PlusCircle,
  BarChart3, PieChart, DollarSign, AlertCircle, Brain, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Risk Assessment Quiz",
      description: "Take our comprehensive quiz to understand your risk tolerance and get personalized investment strategies tailored to your profile.",
      features: ["15-minute assessment", "Behavioral analysis", "Risk scoring", "Personalized recommendations"],
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/quiz"
    },
    {
      icon: Brain,
      title: "AI Investment Advisor",
      description: "Get AI-powered recommendations for stocks, bonds, crypto, and cash based on your profile, goals, and market conditions.",
      features: ["Real-time market analysis", "Portfolio optimization", "Risk-adjusted returns", "Diversification strategies"],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/investments"
    },
    {
      icon: Calculator,
      title: "Financial Calculators",
      description: "SIP calculators, debt repayment tools, and step-up investment planners to optimize your financial decisions.",
      features: ["SIP calculator", "Step-up SIP planner", "Debt payoff calculator", "Compound interest calculator"],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/calculators"
    },
    {
      icon: AlertCircle,
      title: "Debt Management",
      description: "Snowball and avalanche strategies to pay off student loans and credit cards efficiently with smart prioritization.",
      features: ["Debt snowball method", "Debt avalanche strategy", "Payment optimization", "Interest savings tracker"],
      color: "text-red-600",
      bgColor: "bg-red-50",
      link: "/debt"
    },
    {
      icon: PieChart,
      title: "Portfolio Tracking",
      description: "Monitor your investments, track performance, and adjust your strategy as you grow your wealth over time.",
      features: ["Real-time tracking", "Performance analytics", "Asset allocation", "Rebalancing alerts"],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/dashboard"
    },
    {
      icon: Target,
      title: "Goal Setting & Tracking",
      description: "Set financial goals and track your progress with visual indicators and milestone celebrations.",
      features: ["Custom goal creation", "Progress tracking", "Milestone alerts", "Achievement rewards"],
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      link: "/goals"
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Comprehensive financial reports with insights, trends, and recommendations for better decision making.",
      features: ["Portfolio analysis", "Performance reports", "Tax optimization", "Trend analysis"],
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      link: "/reports"
    },
    {
      icon: Zap,
      title: "Premium Features",
      description: "Advanced analytics, priority support, and exclusive investment insights for serious investors.",
      features: ["Advanced AI insights", "Priority support", "Exclusive research", "Custom strategies"],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/premium",
      premium: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Your <span className="text-green-600">Financial Success</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover all the tools and features that make FinSage the ultimate financial companion for students. 
            From AI-powered advice to comprehensive tracking, we've got everything you need.
          </p>
          <Link to="/quiz">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow relative">
              {feature.premium && (
                <Badge className="absolute top-4 right-4 bg-purple-600">Premium</Badge>
              )}
              <CardHeader>
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={feature.link}>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How FinSage Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Take Risk Assessment</h3>
              <p className="text-gray-600">
                Complete our 15-minute quiz to understand your risk tolerance and financial goals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get AI Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized investment and debt management strategies powered by AI.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track & Optimize</h3>
              <p className="text-gray-600">
                Monitor your progress and continuously optimize your financial strategy.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Trusted by Students Worldwide
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
                <p className="text-gray-600">Active Users</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">₹50M+</div>
                <p className="text-gray-600">Managed Assets</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">15%</div>
                <p className="text-gray-600">Avg Return Boost</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                <p className="text-gray-600">User Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who are already building wealth with FinSage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Free Today
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Features;
