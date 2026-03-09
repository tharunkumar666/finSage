
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please check your passwords.", variant: "destructive" });
      return;
    }
    if (!acceptTerms) {
      toast({ title: "Terms Required", description: "Please accept the terms to continue.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, { name });
    if (!error) navigate('/profile-completion');
    setLoading(false);
  };

  if (user) return null;

  const benefits = [
    'AI-powered investment insights',
    'Real-time NSE/BSE stock tracking',
    'Personalized debt management',
    'Free SIP & financial calculators',
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-display font-bold">FinSage</span>
          </Link>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
              Build Your Financial Future
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-primary-foreground/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} FinSage
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <main id="main-content" role="main" className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="gradient-bg p-2 rounded-xl">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                Fin<span className="gradient-text">Sage</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground text-sm">Start your journey to financial freedom</p>
          </div>

          <div className="space-y-5">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <Input id="name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required aria-required="true" autoComplete="name" className="h-11 rounded-xl bg-background border-border" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-sm font-medium text-foreground">Email</Label>
                <Input id="reg-email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required aria-required="true" autoComplete="email" className="h-11 rounded-xl bg-background border-border" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Input id="reg-password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-required="true" autoComplete="new-password" className="h-11 rounded-xl bg-background border-border pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required aria-required="true" autoComplete="new-password" className="h-11 rounded-xl bg-background border-border pr-10" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked === true)} className="mt-0.5" aria-required="true" />
                <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                  I accept the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </Label>
              </div>
              
              <Button type="submit" className="w-full h-11 gradient-bg text-primary-foreground rounded-xl font-medium shadow-md hover:shadow-lg transition-all" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
