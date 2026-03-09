
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Calculator, Target, BarChart3, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  }),
};

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Understand your risk tolerance with our AI quiz and get personalized strategies.',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: TrendingUp,
      title: 'AI Investment Advisor',
      description: 'Gemini-powered recommendations for NSE/BSE stocks, mutual funds, and more.',
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      icon: Calculator,
      title: 'Financial Calculators',
      description: 'SIP calculator, debt repayment tools, and step-up planners for smart planning.',
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set financial goals, track progress, and stay motivated on your journey.',
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      icon: BarChart3,
      title: 'Portfolio Analytics',
      description: 'Real-time stock validation, price tracking, and detailed portfolio insights.',
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      icon: Zap,
      title: 'Debt Management',
      description: 'Snowball & avalanche strategies to eliminate student loans and credit card debt.',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  const stats = [
    { value: '₹0', label: 'Free to Start' },
    { value: 'AI', label: 'Gemini Powered' },
    { value: 'NSE/BSE', label: 'Indian Markets' },
    { value: '24/7', label: 'Always Available' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/[0.04] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-info/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                AI-Powered Finance for Students
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 text-balance leading-[1.1]"
            >
              Your Money,{' '}
              <span className="gradient-text">
                Made Smarter
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              FinSage helps Indian students invest wisely, manage debt, and build wealth 
              with AI-driven insights tailored to the Indian market.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="gradient-bg text-primary-foreground rounded-xl px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth/register">
                    <Button size="lg" className="gradient-bg text-primary-foreground rounded-xl px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all">
                      Start Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 text-base border-border hover:bg-muted">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-card border border-border">
                <div className="text-2xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-primary tracking-wider uppercase mb-3">
              Comprehensive Platform
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Everything to Build Wealth
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mx-auto">
              From risk assessment to portfolio tracking, all the tools you need in one place.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={index}
              >
                <Card className="hover-lift border-border bg-card h-full rounded-2xl overflow-hidden group">
                  <CardContent className="p-7">
                    <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mt-12"
          >
            <Link to="/features">
              <Button variant="outline" size="lg" className="rounded-xl group">
                Explore All Features
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="gradient-bg rounded-3xl p-12 lg:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative">
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-4">
                Start Your Financial Journey Today
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                Join thousands of Indian students who are building wealth smartly with FinSage's AI-powered tools.
              </motion.p>
              <motion.div variants={fadeUp} custom={2}>
                <Link to={user ? '/dashboard' : '/auth/register'}>
                  <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-xl px-8 h-12 text-base font-semibold shadow-lg">
                    {user ? 'Go to Dashboard' : 'Create Free Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
