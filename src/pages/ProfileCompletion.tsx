import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Calendar, Users, CreditCard, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ProfileCompletion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    currency: '',
  });
  
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });
  
  const [bankAccount, setBankAccount] = useState({
    bankName: '',
    accountType: '',
    accountNumberLastFour: ''
  });
  
  const [completionSteps, setCompletionSteps] = useState({
    basicInfo: false,
    emergencyContact: false,
    bankAccount: false
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      // Load profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setProfileData({
          name: profile.name || '',
          phone: '', // Profile table doesn't have phone field
          dateOfBirth: '', // Profile table doesn't have date_of_birth field
          country: profile.country || '',
          currency: profile.currency || 'USD'
        });
        setCompletionSteps(prev => ({ 
          ...prev, 
          basicInfo: !!(profile.name && profile.country) 
        }));
      }

      // Check emergency contacts
      const { data: emergencyContacts } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (emergencyContacts && emergencyContacts.length > 0) {
        setCompletionSteps(prev => ({ ...prev, emergencyContact: true }));
      }

      // Check bank accounts
      const { data: bankAccounts } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (bankAccounts && bankAccounts.length > 0) {
        setCompletionSteps(prev => ({ ...prev, bankAccount: true }));
      }

      // Log profile completion page view
      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'profile_completion_viewed',
        p_description: 'User viewed profile completion page',
        p_category: 'profile'
      });

    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const saveBasicInfo = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: profileData.name,
          country: profileData.country,
          currency: profileData.currency
        });

      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'profile_basic_info_updated',
        p_description: 'Basic profile information updated',
        p_category: 'profile',
        p_metadata: { country: profileData.country, currency: profileData.currency }
      });

      setCompletionSteps(prev => ({ ...prev, basicInfo: true }));
      setCurrentStep(2);
      
      toast({
        title: "Profile Updated",
        description: "Your basic information has been saved.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile information.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const saveEmergencyContact = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name: emergencyContact.name,
          relationship: emergencyContact.relationship,
          phone: emergencyContact.phone,
          email: emergencyContact.email,
          is_primary: true
        });

      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'emergency_contact_added',
        p_description: 'Emergency contact added',
        p_category: 'profile',
        p_metadata: { relationship: emergencyContact.relationship }
      });

      setCompletionSteps(prev => ({ ...prev, emergencyContact: true }));
      setCurrentStep(3);
      
      toast({
        title: "Emergency Contact Added",
        description: "Your emergency contact has been saved.",
      });
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      toast({
        title: "Error",
        description: "Failed to save emergency contact.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const saveBankAccount = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await supabase
        .from('bank_accounts')
        .insert({
          user_id: user.id,
          bank_name: bankAccount.bankName,
          account_type: bankAccount.accountType,
          account_number_last_four: bankAccount.accountNumberLastFour,
          is_primary: true
        });

      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'bank_account_connected',
        p_description: 'Bank account connected',
        p_category: 'account',
        p_metadata: { bank_name: bankAccount.bankName, account_type: bankAccount.accountType }
      });

      setCompletionSteps(prev => ({ ...prev, bankAccount: true }));
      
      toast({
        title: "Bank Account Connected",
        description: "Your bank account has been connected.",
      });
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast({
        title: "Error",
        description: "Failed to connect bank account.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const completionPercentage = Object.values(completionSteps).filter(Boolean).length * 33.33;
  const allStepsCompleted = Object.values(completionSteps).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Finish setting up your account to get the most out of FinSage
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="h-5 w-5 text-blue-600" />
              Completion Progress
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Complete these steps to set up your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Progress</span>
                <span className="text-gray-900 dark:text-white font-medium">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant={completionSteps.basicInfo ? "default" : "secondary"}>
                  {completionSteps.basicInfo && <Check className="h-3 w-3 mr-1" />}
                  Basic Information
                </Badge>
                <Badge variant={completionSteps.emergencyContact ? "default" : "secondary"}>
                  {completionSteps.emergencyContact && <Check className="h-3 w-3 mr-1" />}
                  Emergency Contact
                </Badge>
                <Badge variant={completionSteps.bankAccount ? "default" : "secondary"}>
                  {completionSteps.bankAccount && <Check className="h-3 w-3 mr-1" />}
                  Bank Account
                </Badge>
              </div>
              
              {allStepsCompleted && (
                <div className="pt-4 border-t dark:border-gray-600">
                  <Button onClick={() => navigate('/dashboard')} className="bg-green-600 hover:bg-green-700">
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {/* Step Navigation */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-4">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    currentStep === step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <User className="h-5 w-5 text-blue-600" />
                  Basic Information
                  {completionSteps.basicInfo && <Check className="h-4 w-4 text-green-600" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dob" className="text-gray-700 dark:text-gray-300">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">Country</Label>
                    <Select value={profileData.country} onValueChange={(value) => setProfileData({...profileData, country: value})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">Preferred Currency</Label>
                  <Select value={profileData.currency} onValueChange={(value) => setProfileData({...profileData, currency: value})}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                      <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={saveBasicInfo} 
                  disabled={loading || !profileData.name || !profileData.country}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Saving..." : "Save & Continue"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Emergency Contact */}
          {currentStep === 2 && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Users className="h-5 w-5 text-blue-600" />
                  Emergency Contact
                  {completionSteps.emergencyContact && <Check className="h-4 w-4 text-green-600" />}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Add someone to contact in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!completionSteps.emergencyContact ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergency-name" className="text-gray-700 dark:text-gray-300">Contact Name</Label>
                        <Input
                          id="emergency-name"
                          value={emergencyContact.name}
                          onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="relationship" className="text-gray-700 dark:text-gray-300">Relationship</Label>
                        <Select value={emergencyContact.relationship} onValueChange={(value) => setEmergencyContact({...emergencyContact, relationship: value})}>
                          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem value="Spouse">Spouse</SelectItem>
                            <SelectItem value="Parent">Parent</SelectItem>
                            <SelectItem value="Sibling">Sibling</SelectItem>
                            <SelectItem value="Child">Child</SelectItem>
                            <SelectItem value="Friend">Friend</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergency-phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                        <Input
                          id="emergency-phone"
                          type="tel"
                          value={emergencyContact.phone}
                          onChange={(e) => setEmergencyContact({...emergencyContact, phone: e.target.value})}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency-email" className="text-gray-700 dark:text-gray-300">Email (Optional)</Label>
                        <Input
                          id="emergency-email"
                          type="email"
                          value={emergencyContact.email}
                          onChange={(e) => setEmergencyContact({...emergencyContact, email: e.target.value})}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={saveEmergencyContact} 
                        disabled={loading || !emergencyContact.name || !emergencyContact.relationship || !emergencyContact.phone}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? "Saving..." : "Save & Continue"}
                      </Button>
                      <Button variant="outline" onClick={() => setCurrentStep(3)}>
                        Skip for Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-green-600 font-medium flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Emergency contact added successfully
                    <Button onClick={() => setCurrentStep(3)} className="ml-4">
                      Continue
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Bank Account */}
          {currentStep === 3 && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Connect Bank Account
                  {completionSteps.bankAccount && <Check className="h-4 w-4 text-green-600" />}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Connect your bank account for better financial tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!completionSteps.bankAccount ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bank-name" className="text-gray-700 dark:text-gray-300">Bank Name</Label>
                        <Input
                          id="bank-name"
                          value={bankAccount.bankName}
                          onChange={(e) => setBankAccount({...bankAccount, bankName: e.target.value})}
                          placeholder="e.g., Chase, Bank of America"
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-type" className="text-gray-700 dark:text-gray-300">Account Type</Label>
                        <Select value={bankAccount.accountType} onValueChange={(value) => setBankAccount({...bankAccount, accountType: value})}>
                          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem value="checking">Checking</SelectItem>
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="credit">Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="account-last-four" className="text-gray-700 dark:text-gray-300">Last 4 Digits of Account Number</Label>
                      <Input
                        id="account-last-four"
                        value={bankAccount.accountNumberLastFour}
                        onChange={(e) => setBankAccount({...bankAccount, accountNumberLastFour: e.target.value.slice(0, 4)})}
                        placeholder="1234"
                        maxLength={4}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={saveBankAccount} 
                        disabled={loading || !bankAccount.bankName || !bankAccount.accountType || bankAccount.accountNumberLastFour.length !== 4}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? "Connecting..." : "Connect Account"}
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/dashboard')}>
                        Skip for Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-green-600 font-medium flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Bank account connected successfully
                    <Button onClick={() => navigate('/dashboard')} className="ml-4">
                      Go to Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileCompletion;
