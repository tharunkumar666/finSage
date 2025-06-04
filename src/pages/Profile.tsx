
import { useState } from 'react';
import { User, Camera, ChevronRight, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: '2023-12-01',
    profilePhoto: null,
    isPremium: false,
    riskScore: 28,
    riskLevel: 'Moderate',
    completionPercentage: 75,
    investmentSummary: {
      totalInvested: 15420,
      monthlyReturns: 8.5,
      portfolioGrowth: 12.4
    },
    debtSummary: {
      totalDebt: 38200,
      avgInterestRate: 7.8
    }
  };

  const completedActions = {
    riskQuiz: true,
    addedInvestments: true,
    addedDebts: true,
    usedCalculators: true,
    setUpPreferences: false,
    connectedBank: false,
    addedGoals: false,
    completedProfile: false
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Column */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                      {userData.profilePhoto ? (
                        <img 
                          src={userData.profilePhoto} 
                          alt="Profile" 
                          className="rounded-full w-24 h-24 object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-gray-600">{userData.email}</p>
                  
                  <div className="mt-2">
                    {userData.isPremium ? (
                      <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        Free Plan
                      </Badge>
                    )}
                  </div>
                  
                  <div className="w-full mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span className="font-medium">{userData.completionPercentage}%</span>
                    </div>
                    <Progress value={userData.completionPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(userData.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Risk Profile</p>
                  <p className="font-medium">{userData.riskLevel} ({userData.riskScore}/40)</p>
                </div>
                
                <Button className="w-full">
                  Edit Information
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Investment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Invested</span>
                      <span className="font-bold">${userData.investmentSummary.totalInvested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Returns</span>
                      <span className="font-medium text-green-600">+{userData.investmentSummary.monthlyReturns}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Portfolio Growth</span>
                      <span className="font-medium text-green-600">+{userData.investmentSummary.portfolioGrowth}% YTD</span>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      View All Investments
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Debt Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Debt</span>
                      <span className="font-bold">${userData.debtSummary.totalDebt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg Interest Rate</span>
                      <span className="font-medium text-red-600">{userData.debtSummary.avgInterestRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Debt-to-Income</span>
                      <span className="font-medium text-orange-600">34%</span>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      View Debt Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Completion */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>
                  Complete these actions to get the most out of FinSage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center p-2 rounded-lg bg-gray-50">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${completedActions.riskQuiz ? 'bg-green-600' : 'bg-gray-300'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={completedActions.riskQuiz ? 'text-gray-800' : 'text-gray-600'}>Complete risk assessment quiz</span>
                    {!completedActions.riskQuiz && <Button variant="ghost" size="sm" className="ml-auto">Do Now</Button>}
                  </li>
                  
                  <li className="flex items-center p-2 rounded-lg bg-gray-50">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${completedActions.addedInvestments ? 'bg-green-600' : 'bg-gray-300'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={completedActions.addedInvestments ? 'text-gray-800' : 'text-gray-600'}>Add your first investment</span>
                    {!completedActions.addedInvestments && <Button variant="ghost" size="sm" className="ml-auto">Do Now</Button>}
                  </li>
                  
                  <li className="flex items-center p-2 rounded-lg bg-gray-50">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${completedActions.addedDebts ? 'bg-green-600' : 'bg-gray-300'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={completedActions.addedDebts ? 'text-gray-800' : 'text-gray-600'}>Track your debts</span>
                    {!completedActions.addedDebts && <Button variant="ghost" size="sm" className="ml-auto">Do Now</Button>}
                  </li>
                  
                  <li className="flex items-center p-2 rounded-lg bg-gray-50">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${completedActions.usedCalculators ? 'bg-green-600' : 'bg-gray-300'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={completedActions.usedCalculators ? 'text-gray-800' : 'text-gray-600'}>Use financial calculators</span>
                    {!completedActions.usedCalculators && <Button variant="ghost" size="sm" className="ml-auto">Do Now</Button>}
                  </li>
                  
                  <li className="flex items-center p-2 rounded-lg bg-gray-50">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${completedActions.setUpPreferences ? 'bg-green-600' : 'bg-gray-300'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={completedActions.setUpPreferences ? 'text-gray-800' : 'text-gray-600'}>Set up your preferences</span>
                    {!completedActions.setUpPreferences && <Button variant="ghost" size="sm" className="ml-auto">Do Now</Button>}
                  </li>
                  
                  <li className="flex items-center p-2 rounded-lg bg-gray-50">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${completedActions.completedProfile ? 'bg-green-600' : 'bg-gray-300'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={completedActions.completedProfile ? 'text-gray-800' : 'text-gray-600'}>Complete your profile</span>
                    {!completedActions.completedProfile && <Button variant="ghost" size="sm" className="ml-auto">Do Now</Button>}
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium Upgrade */}
            {!userData.isPremium && (
              <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Upgrade to Premium
                  </CardTitle>
                  <CardDescription>
                    Get access to advanced features and personalized insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="mr-2 text-green-600">✓</div>
                        <span className="text-sm">AI-powered investment advice</span>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-2 text-green-600">✓</div>
                        <span className="text-sm">Advanced investment analytics</span>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-2 text-green-600">✓</div>
                        <span className="text-sm">Priority customer support</span>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-2 text-green-600">✓</div>
                        <span className="text-sm">Ad-free experience</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Upgrade Now - $9.99/month
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
