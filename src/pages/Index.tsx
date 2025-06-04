
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Calculator, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-2xl">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
            Fin<span className="text-green-600">Sage</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Your AI-powered financial advisor designed specifically for students. 
            Take control of your finances, investments, and debt with personalized guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                Start Risk Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/auth/login">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Everything you need to build wealth
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Risk Assessment</h3>
                <p className="text-gray-600">
                  Take our comprehensive quiz to understand your risk tolerance and get personalized investment strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">AI Investment Advisor</h3>
                <p className="text-gray-600">
                  Get AI-powered recommendations for stocks, bonds, crypto, and cash based on your profile and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Calculator className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Financial Calculators</h3>
                <p className="text-gray-600">
                  SIP calculators, debt repayment tools, and step-up investment planners to optimize your finances.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Debt Management</h3>
                <p className="text-gray-600">
                  Snowball and avalanche strategies to pay off student loans and credit cards efficiently.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Portfolio Tracking</h3>
                <p className="text-gray-600">
                  Monitor your investments, track performance, and adjust your strategy as you grow.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">★</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Premium Features</h3>
                <p className="text-gray-600">
                  Advanced analytics, priority support, and exclusive investment insights for serious investors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
