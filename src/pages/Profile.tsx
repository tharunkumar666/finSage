
import { useState } from 'react';
import { User, Edit, Camera, TrendingUp, AlertCircle, Settings, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/placeholder.svg');
  
  const [userInfo, setUserInfo] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    riskProfile: 'Moderate',
    memberSince: '2024-01-01',
    isPremium: false
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  // Mock data for portfolio summary
  const portfolioSummary = {
    totalInvestments: 15420,
    monthlyReturns: 8.5,
    totalGains: 2420,
    totalDebt: 26200,
    monthlyDebtPayment: 385,
    investments: [
      { name: 'S&P 500 ETF', amount: 8500, allocation: 55 },
      { name: 'Bond Index Fund', amount: 3850, allocation: 25 },
      { name: 'Bitcoin', amount: 2070, allocation: 13 },
      { name: 'Cash Savings', amount: 1000, allocation: 7 }
    ],
    debts: [
      { name: 'Student Loan', balance: 25000, rate: 6.8, payment: 280 },
      { name: 'Credit Card', balance: 1200, rate: 18.9, payment: 105 }
    ]
  };

  const profileCompletion = 85;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been successfully updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setUserInfo({ ...editedInfo });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account Deletion",
        description: "Your account deletion request has been processed.",
        variant: "destructive"
      });
      // In a real app, this would handle account deletion
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and view your financial summary
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Profile Information
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback>{userInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                  </div>
                </div>

                {/* Profile Details */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editedInfo.name}
                        onChange={(e) => setEditedInfo({...editedInfo, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedInfo.email}
                        onChange={(e) => setEditedInfo({...editedInfo, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedInfo.phone}
                        onChange={(e) => setEditedInfo({...editedInfo, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editedInfo.location}
                        onChange={(e) => setEditedInfo({...editedInfo, location: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setIsEditing(false);
                        setEditedInfo({ ...userInfo });
                      }}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{userInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{userInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{userInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{userInfo.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Risk Profile</p>
                      <Badge className="bg-blue-100 text-blue-800">{userInfo.riskProfile}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-medium">{new Date(userInfo.memberSince).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-3" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-600">
                      ✓ Basic information completed
                    </div>
                    <div className="flex items-center text-green-600">
                      ✓ Risk assessment completed
                    </div>
                    <div className="flex items-center text-green-600">
                      ✓ First investment made
                    </div>
                    <div className="flex items-center text-gray-500">
                      • Add emergency contact
                    </div>
                    <div className="flex items-center text-gray-500">
                      • Connect bank account
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                </Link>
                
                <Link to="/premium">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Summary */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
                <TabsTrigger value="debts">Debts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Investment Portfolio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${portfolioSummary.totalInvestments.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        +${portfolioSummary.totalGains} ({portfolioSummary.monthlyReturns}%) this month
                      </p>
                      <Link to="/investments">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          View Investment Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Debt Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        ${portfolioSummary.totalDebt.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        ${portfolioSummary.monthlyDebtPayment}/month minimum payment
                      </p>
                      <Link to="/debt">
                        <Button variant="outline" className="w-full">
                          Manage Debt Strategy
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">Investment Added</p>
                          <p className="text-sm text-gray-600">S&P 500 ETF - $500</p>
                        </div>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Risk Assessment</p>
                          <p className="text-sm text-gray-600">Completed profile update</p>
                        </div>
                        <span className="text-xs text-gray-500">1 week ago</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium">Debt Strategy</p>
                          <p className="text-sm text-gray-600">Updated to Avalanche method</p>
                        </div>
                        <span className="text-xs text-gray-500">2 weeks ago</span>
                      </div>
                    </div>
                    
                    <Link to="/history">
                      <Button variant="outline" className="w-full mt-4">
                        View All Activity
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Breakdown</CardTitle>
                    <CardDescription>
                      Your current portfolio allocation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioSummary.investments.map((investment, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{investment.name}</span>
                            <span className="text-sm text-gray-600">
                              ${investment.amount.toLocaleString()} ({investment.allocation}%)
                            </span>
                          </div>
                          <Progress value={investment.allocation} className="h-2" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Portfolio Value</span>
                        <span>${portfolioSummary.totalInvestments.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="debts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Debt Breakdown</CardTitle>
                    <CardDescription>
                      Your current debt obligations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioSummary.debts.map((debt, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{debt.name}</h4>
                            <span className="text-sm text-gray-500">{debt.rate}% APR</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold">${debt.balance.toLocaleString()}</span>
                            <span className="text-sm text-green-600">
                              ${debt.payment}/month
                            </span>
                          </div>
                          <Progress value={(debt.payment / debt.balance) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Debt</span>
                        <span>${portfolioSummary.totalDebt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>Monthly Payment</span>
                        <span>${portfolioSummary.monthlyDebtPayment}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
