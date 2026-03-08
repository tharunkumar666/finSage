import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
      toast({ title: 'Email sent', description: 'Check your email for a reset link.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-display font-bold">FinSage</span>
          </Link>
          <div className="max-w-md">
            <h2 className="text-4xl font-display font-bold mb-4 leading-tight">Reset Your Password</h2>
            <p className="text-primary-foreground/70 text-lg">We'll send you a link to reset your password and get back to managing your finances.</p>
          </div>
          <p className="text-sm text-primary-foreground/50">© {new Date().getFullYear()} FinSage</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/auth/login" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to login</span>
            </Link>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground">Forgot password?</h1>
            <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link.</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <p className="text-foreground font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/auth/login" className="text-primary hover:underline text-sm font-medium">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl bg-background border-border" />
              </div>
              <Button type="submit" className="w-full h-11 gradient-bg text-primary-foreground rounded-xl font-medium" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link to="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
