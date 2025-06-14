
import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Shield, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    country: '',
    currency: 'USD',
    risk_profile: 'Not Assessed',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfileData({
          name: data.name || '',
          email: data.email || user.email || '',
          country: data.country || '',
          currency: data.currency || 'USD',
          risk_profile: data.risk_profile || 'Not Assessed',
          avatar_url: data.avatar_url || ''
        });
      } else {
        // Create initial profile
        setProfileData({
          name: user.user_metadata?.name || '',
          email: user.email || '',
          country: '',
          currency: 'USD',
          risk_profile: 'Not Assessed',
          avatar_url: user.user_metadata?.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: profileData.name,
          email: profileData.email,
          country: profileData.country,
          currency: profileData.currency,
          risk_profile: profileData.risk_profile,
          avatar_url: profileData.avatar_url
        });

      if (error) throw error;

      // Log the profile update activity
      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'profile_updated',
        p_description: 'User updated their profile information',
        p_category: 'profile'
      });

      toast({
        title: "Success!",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Profile Picture</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Update your profile photo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar_url} alt={profileData.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-2xl">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 dark:bg-gray-700 dark:border-gray-600"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {profileData.name || 'Your Name'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profileData.email}
                </p>
              </div>
              <Button variant="outline" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">Country</Label>
                    <Select value={profileData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">Preferred Currency</Label>
                    <Select value={profileData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="risk_profile" className="text-gray-700 dark:text-gray-300">Risk Profile</Label>
                  <Select value={profileData.risk_profile} onValueChange={(value) => handleInputChange('risk_profile', value)}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="Conservative">Conservative</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Aggressive">Aggressive</SelectItem>
                      <SelectItem value="Not Assessed">Not Assessed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Take our <a href="/quiz" className="text-blue-600 hover:underline">risk assessment quiz</a> for a personalized recommendation
                  </p>
                </div>

                <Button 
                  onClick={updateProfile} 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Account Statistics</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Your FinSage journey at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                      {user ? Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-400">Days Active</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {profileData.risk_profile !== 'Not Assessed' ? '1' : '0'}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Risk Assessments</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">Free</div>
                    <div className="text-sm text-purple-700 dark:text-purple-400">Current Plan</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
