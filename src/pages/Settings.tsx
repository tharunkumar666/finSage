
import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Globe, Bell, Shield, Check, User, Trash2, Smartphone, Monitor, AlertTriangle, Moon, Sun } from 'lucide-react';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';

interface UserProfile {
  user_id?: string;
  name?: string;
  currency?: string;
  country?: string;
}

interface UserPreferences {
  user_id?: string;
  dashboard_show_investment?: boolean;
  dashboard_show_debt?: boolean;
  dashboard_show_news?: boolean;
  dashboard_show_calculator?: boolean;
  privacy_allow_data_collection?: boolean;
  privacy_allow_marketing?: boolean;
  privacy_show_activity_history?: boolean;
}

interface NotificationPreferences {
  user_id?: string;
  market_updates?: boolean;
  investment_changes?: boolean;
  debt_reminders?: boolean;
  newsletters?: boolean;
  email_frequency?: string;
  push_frequency?: string;
}

interface LoginSession {
  id: string;
  is_current?: boolean;
  device_info?: string;
  ip_address?: string;
  location?: string;
  last_active: string;
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [notifications, setNotifications] = useState<NotificationPreferences>({});
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { data: userData } = useQuery({
    queryKey: ['settings-data', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const [profileRes, prefsRes, notifsRes, sessionsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('user_preferences').select('*').eq('user_id', user.id).single(),
        supabase.from('notification_preferences').select('*').eq('user_id', user.id).single(),
        supabase.from('login_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      return {
        profile: profileRes.data as UserProfile | null,
        preferences: prefsRes.data as UserPreferences | null,
        notifications: notifsRes.data as NotificationPreferences | null,
        sessions: (sessionsRes.data ?? []) as LoginSession[],
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (userData) {
      if (userData.profile) setProfile(userData.profile);
      if (userData.preferences) setPreferences(userData.preferences);
      if (userData.notifications) setNotifications(userData.notifications);
      setLoginSessions(userData.sessions);
    }
  }, [userData]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.id]: e.target.value
    });
  };

  const submitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordSchema = z.object({
      newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
      confirmPassword: z.string()
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    });

    const validationResult = passwordSchema.safeParse({
      newPassword: passwordFormData.newPassword,
      confirmPassword: passwordFormData.confirmPassword
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(e => e.message).join(', ');
      toast({
        title: "Validation Error",
        description: errors,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordFormData.newPassword
      });

      if (error) throw error;

      await supabase.rpc('log_activity', {
        p_user_id: user?.id,
        p_action: 'password_changed',
        p_description: 'User changed their password',
        p_category: 'authentication'
      });

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile
        });

      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'profile_updated',
        p_description: 'Profile information updated',
        p_category: 'profile'
      });

      queryClient.invalidateQueries({ queryKey: ['settings-data'] });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const savePreferences = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences
        });

      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'preferences_updated',
        p_description: 'User preferences updated',
        p_category: 'settings'
      });

      queryClient.invalidateQueries({ queryKey: ['settings-data'] });

      toast({
        title: "Success",
        description: "Preferences saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const saveNotificationPreferences = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...notifications
        });

      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'notification_preferences_updated',
        p_description: 'Notification preferences updated',
        p_category: 'settings'
      });

      queryClient.invalidateQueries({ queryKey: ['settings-data'] });

      toast({
        title: "Success",
        description: "Notification preferences saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      await supabase.rpc('log_activity', {
        p_user_id: user.id,
        p_action: 'account_deletion_requested',
        p_description: 'User requested account deletion',
        p_category: 'account'
      });

      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. You will receive an email with further instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request account deletion",
        variant: "destructive"
      });
    }
  };

  const logoutAllOtherDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: 'others' });
      
      await supabase.rpc('log_activity', {
        p_user_id: user?.id,
        p_action: 'logout_all_devices',
        p_description: 'User logged out from all other devices',
        p_category: 'authentication'
      });

      toast({
        title: "Success",
        description: "Logged out from all other devices",
      });
      
      queryClient.invalidateQueries({ queryKey: ['settings-data'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout from other devices",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-blue-600" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Update your basic account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profile.name || ''} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                  </div>
                </div>
                
                <Button onClick={saveProfile} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Set your preferred currency and formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={profile.currency || 'USD'} 
                      onValueChange={(value) => setProfile({...profile, currency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                        <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                        <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                        <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={profile.country || 'United States'} 
                      onValueChange={(value) => setProfile({...profile, country: value})}
                    >
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
                </div>
                
                <Button onClick={saveProfile} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Account
                </CardTitle>
                <CardDescription>
                  Permanently delete your account and all your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteAccount} className="bg-red-600 hover:bg-red-700">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-600" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitPasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordFormData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordFormData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading || !passwordFormData.newPassword || passwordFormData.newPassword !== passwordFormData.confirmPassword}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Two-Factor Authentication
                  </CardTitle>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Two-factor authentication will be available soon. We'll notify you when it's ready.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => toast({ title: 'Noted!', description: "We'll notify you when 2FA is available." })}>
                  <Bell className="h-4 w-4 mr-2" />
                  Notify Me
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  Login Sessions
                </CardTitle>
                <CardDescription>
                  Manage your active sessions and devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'}, {navigator.platform}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Active now
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Current
                      </Badge>
                    </div>
                  </div>
                  
                  {loginSessions.filter(session => !session.is_current).map((session) => (
                    <div key={session.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{session.device_info || 'Unknown Device'}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            IP: {session.ip_address || 'Unknown'}, Location: {session.location || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Last active: {new Date(session.last_active).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" onClick={logoutAllOtherDevices}>
                    Log Out From All Other Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Settings */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === 'light' ? <Sun className="h-5 w-5 text-blue-600" /> : <Moon className="h-5 w-5 text-blue-600" />}
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-4 flex items-center justify-center bg-white cursor-pointer transition-all ${theme === 'light' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="text-center">
                      <div className="h-20 w-full bg-white border rounded mb-2"></div>
                      <p className="font-medium">Light Mode</p>
                    </div>
                  </div>
                  <div 
                    className={`border rounded-lg p-4 flex items-center justify-center bg-gray-800 cursor-pointer transition-all ${theme === 'dark' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="text-center">
                      <div className="h-20 w-full bg-gray-900 border border-gray-700 rounded mb-2"></div>
                      <p className="font-medium text-white">Dark Mode</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Preferences</CardTitle>
                <CardDescription>
                  Customize what you see on your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-investment-section">Show Investment Section</Label>
                    <Switch 
                      id="show-investment-section" 
                      checked={preferences.dashboard_show_investment ?? true}
                      onCheckedChange={(checked) => setPreferences({...preferences, dashboard_show_investment: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-debt-section">Show Debt Section</Label>
                    <Switch 
                      id="show-debt-section" 
                      checked={preferences.dashboard_show_debt ?? true}
                      onCheckedChange={(checked) => setPreferences({...preferences, dashboard_show_debt: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-news-section">Show Financial News</Label>
                    <Switch 
                      id="show-news-section" 
                      checked={preferences.dashboard_show_news ?? true}
                      onCheckedChange={(checked) => setPreferences({...preferences, dashboard_show_news: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-calculator-section">Show Quick Calculators</Label>
                    <Switch 
                      id="show-calculator-section" 
                      checked={preferences.dashboard_show_calculator ?? true}
                      onCheckedChange={(checked) => setPreferences({...preferences, dashboard_show_calculator: checked})}
                    />
                  </div>
                </div>
                
                <Button onClick={savePreferences} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage how your data is used and shared
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-data-collection">
                      Allow data collection for personalization
                    </Label>
                    <Switch 
                      id="allow-data-collection" 
                      checked={preferences.privacy_allow_data_collection ?? true}
                      onCheckedChange={(checked) => setPreferences({...preferences, privacy_allow_data_collection: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-marketing">
                      Receive marketing communications
                    </Label>
                    <Switch 
                      id="allow-marketing" 
                      checked={preferences.privacy_allow_marketing ?? false}
                      onCheckedChange={(checked) => setPreferences({...preferences, privacy_allow_marketing: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-activity-history">
                      Show activity history
                    </Label>
                    <Switch 
                      id="show-activity-history" 
                      checked={preferences.privacy_show_activity_history ?? true}
                      onCheckedChange={(checked) => setPreferences({...preferences, privacy_show_activity_history: checked})}
                    />
                  </div>
                </div>
                
                <Button onClick={savePreferences} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Investment Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="market-updates">
                          Market updates and news
                        </Label>
                        <Switch 
                          id="market-updates" 
                          checked={notifications.market_updates ?? true}
                          onCheckedChange={(checked) => setNotifications({...notifications, market_updates: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="investment-changes">
                          Investment value changes (±5%)
                        </Label>
                        <Switch 
                          id="investment-changes" 
                          checked={notifications.investment_changes ?? true}
                          onCheckedChange={(checked) => setNotifications({...notifications, investment_changes: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Debt Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="debt-reminders">
                          Payment reminders
                        </Label>
                        <Switch 
                          id="debt-reminders" 
                          checked={notifications.debt_reminders ?? true}
                          onCheckedChange={(checked) => setNotifications({...notifications, debt_reminders: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">General Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newsletters">
                          Educational newsletters
                        </Label>
                        <Switch 
                          id="newsletters" 
                          checked={notifications.newsletters ?? false}
                          onCheckedChange={(checked) => setNotifications({...notifications, newsletters: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={saveNotificationPreferences} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Saving..." : "Save Notification Settings"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Delivery Methods</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Notifications</Label>
                    <Select 
                      value={notifications.email_frequency || 'important'} 
                      onValueChange={(value) => setNotifications({...notifications, email_frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select email frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All notifications</SelectItem>
                        <SelectItem value="important">Important only</SelectItem>
                        <SelectItem value="digest">Daily digest</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Push Notifications</Label>
                    <Select 
                      value={notifications.push_frequency || 'all'} 
                      onValueChange={(value) => setNotifications({...notifications, push_frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select push notification frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All notifications</SelectItem>
                        <SelectItem value="important">Important only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={saveNotificationPreferences} disabled={loading} className="bg-green-600 hover:bg-green-700">
                    {loading ? "Saving..." : "Save Delivery Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      </PageTransition>
      <Footer />
    </div>
  );
};

export default Settings;
