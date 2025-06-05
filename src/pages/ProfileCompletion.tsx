
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Calendar, Users, CreditCard, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ProfileCompletion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setProfileData({
          name: profile.name || '',
          phone: '',
          dateOfBirth: '',
          country: profile.country || '',
          currency: profile.currency || 'USD'
        });
        setCompletionSteps(prev => ({ ...prev, basicInfo: !!profile.name }));
      }

      const { data: emergencyContacts } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (emergencyContacts && emergencyContacts.length > 0) {
        setCompletionSteps(prev => ({ ...prev, emergencyContact: true }));
      }

      const { data: bankAccounts } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (bankAccounts && bankAccounts.length > 0) {
        setCompletionSteps(prev => ({ ...prev, bankAccount: true }));
      }
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
        p_action: 'profile_update',
        p_description: 'Basic profile information updated',
        p_category: 'profile'
      });

      setCompletionSteps(prev => ({ ...prev, basicInfo: true }));
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
        p_category: 'profile'
      });

      setCompletionSteps(prev => ({ ...prev, emergencyContact: true }));
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
        p_category: 'account'
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

        <div className="grid gap-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Completion Progress
              </CardTitle>
              <CardDescription>
                Complete these steps to set up your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
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
                <div className="mt-4">
                  <Button onClick={() => navigate('/dashboard')} className="bg-green-600 hover:bg-green-700">
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Basic Information
                {completionSteps.basicInfo && <Check className="h-4 w-4 text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={profileData.country} onValueChange={(value) => setProfileData({...profileData, country: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
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
                <div>
                  <Label htmlFor="currency">Preferred Currency</Label>
                  <Select value={profileData.currency} onValueChange={(value) => setProfileData({...profileData, currency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                      <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={saveBasicInfo} 
                disabled={loading || !profileData.name}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Saving..." : "Save Basic Information"}
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Emergency Contact
                {completionSteps.emergencyContact && <Check className="h-4 w-4 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Add someone to contact in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!completionSteps.emergencyContact ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergency-name">Contact Name</Label>
                      <Input
                        id="emergency-name"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select value={emergencyContact.relationship} onValueChange={(value) => setEmergencyContact({...emergencyContact, relationship: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Label htmlFor="emergency-phone">Phone Number</Label>
                      <Input
                        id="emergency-phone"
                        type="tel"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({...emergencyContact, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency-email">Email (Optional)</Label>
                      <Input
                        id="emergency-email"
                        type="email"
                        value={emergencyContact.email}
                        onChange={(e) => setEmergencyContact({...emergencyContact, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={saveEmergencyContact} 
                    disabled={loading || !emergencyContact.name || !emergencyContact.relationship || !emergencyContact.phone}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "Saving..." : "Add Emergency Contact"}
                  </Button>
                </>
              ) : (
                <div className="text-green-600 font-medium">
                  ✓ Emergency contact added successfully
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Connect Bank Account
                {completionSteps.bankAccount && <Check className="h-4 w-4 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Connect your bank account for better financial tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!completionSteps.bankAccount ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={bankAccount.bankName}
                        onChange={(e) => setBankAccount({...bankAccount, bankName: e.target.value})}
                        placeholder="e.g., Chase, Bank of America"
                      />
                    </div>
                    <div>
                      <Label htmlFor="account-type">Account Type</Label>
                      <Select value={bankAccount.accountType} onValueChange={(value) => setBankAccount({...bankAccount, accountType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="credit">Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="account-last-four">Last 4 Digits of Account Number</Label>
                    <Input
                      id="account-last-four"
                      value={bankAccount.accountNumberLastFour}
                      onChange={(e) => setBankAccount({...bankAccount, accountNumberLastFour: e.target.value.slice(0, 4)})}
                      placeholder="1234"
                      maxLength={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={saveBankAccount} 
                    disabled={loading || !bankAccount.bankName || !bankAccount.accountType || bankAccount.accountNumberLastFour.length !== 4}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "Connecting..." : "Connect Bank Account"}
                  </Button>
                </>
              ) : (
                <div className="text-green-600 font-medium">
                  ✓ Bank account connected successfully
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileCompletion;
