import { useState } from 'react';
import { Users, Target, Shield, TrendingUp, Award, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-founder",
      description: "Former investment banker with 10+ years experience in student financial planning",
      image: "/placeholder.svg"
    },
    {
      name: "Mike Chen",
      role: "CTO & Co-founder", 
      description: "AI expert and fintech veteran focused on democratizing financial advice",
      image: "/placeholder.svg"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Chief Financial Advisor",
      description: "Certified Financial Planner specializing in student debt and investment strategies",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            About <span className="gradient-text">FinSage</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering students with AI-driven financial guidance to build wealth, 
            manage debt, and secure their financial future.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-display">
              <Target className="h-6 w-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              FinSage was created to bridge the financial literacy gap among students. 
              We believe that every student deserves access to personalized, professional-grade 
              financial advice without the high costs traditionally associated with financial advisors. 
              Our AI-powered platform makes sophisticated investment strategies and debt management 
              accessible to everyone, regardless of their financial background or current assets.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="rounded-2xl">
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="font-display">Trustworthy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We prioritize security and transparency in all our recommendations, 
                ensuring your financial data is protected and our advice is unbiased.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="font-display">Data-Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI analyzes market trends, risk factors, and personal profiles 
                to provide evidence-based financial recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <Heart className="h-10 w-10 text-destructive mb-4" />
              <CardTitle className="font-display">Student-Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every feature is designed with students in mind, addressing unique 
                challenges like limited income and student debt.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-center text-foreground mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center rounded-2xl">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="mb-12 rounded-2xl">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground">Students Helped</p>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-2">₹50M+</div>
                <p className="text-muted-foreground">Debt Optimized</p>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-2">15%</div>
                <p className="text-muted-foreground">Avg. Return Improvement</p>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">User Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students who are already building wealth with FinSage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quiz" className="gradient-bg text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium inline-block">
              Start Your Journey
            </a>
            <a href="/contact" className="border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg text-lg font-medium inline-block">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
