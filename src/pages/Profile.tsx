
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
import PageTransition from '@/components/PageTransition';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  country: z.string().min(1, "Country is required"),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"]),
  risk_profile: z.enum(["Conservative", "Moderate", "Aggressive", "Not Assessed"]),
  avatar_url: z.string().url().optional().or(z.literal(''))
});

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
      // Validate input data
      const validationResult = profileSchema.safeParse(profileData);
      
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(e => e.message).join(', ');
        toast({
          title: "Validation Error",
          description: errors,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: validationResult.data.name,
          email: validationResult.data.email,
          country: validationResult.data.country,
          currency: validationResult.data.currency,
          risk_profile: validationResult.data.risk_profile,
          avatar_url: validationResult.data.avatar_url || ''
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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <PageTransition>
      <main id="main-content" role="main" className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Update your profile photo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar_url} alt={profileData.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">
                  {profileData.name || 'Your Name'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profileData.email}
                </p>
              </div>
              <Button variant="outline">
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={profileData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Preferred Currency</Label>
                    <Select value={profileData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="risk_profile">Risk Profile</Label>
                  <Select value={profileData.risk_profile} onValueChange={(value) => handleInputChange('risk_profile', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conservative">Conservative</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Aggressive">Aggressive</SelectItem>
                      <SelectItem value="Not Assessed">Not Assessed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Take our <a href="/quiz" className="text-primary hover:underline">risk assessment quiz</a> for a personalized recommendation
                  </p>
                </div>

                <Button 
                  onClick={updateProfile} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>
                  Your FinSage journey at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {user ? Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Active</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {profileData.risk_profile !== 'Not Assessed' ? '1' : '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Risk Assessments</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">Free</div>
                    <div className="text-sm text-muted-foreground">Current Plan</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      </PageTransition>
      <Footer />
    </div>
  );
};

export default Profile;
