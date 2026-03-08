import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">By accessing or using FinSage, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p className="text-muted-foreground">FinSage is an AI-powered financial management platform designed for Indian students and young professionals. It provides investment tracking, debt management tools, financial calculators, and AI-generated insights.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p className="text-muted-foreground">You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration and keep your account details up to date.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree not to misuse the service, attempt to gain unauthorized access, or use automated tools to scrape or overload the platform. Any abusive behaviour may result in account suspension.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Disclaimers</h2>
            <p className="text-muted-foreground"><strong className="text-foreground">FinSage does not provide real financial advice.</strong> All AI-generated recommendations are for informational and educational purposes only. They should not be considered as professional financial, investment, or tax advice. Always consult a SEBI-registered financial advisor before making investment decisions.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">FinSage and its creators shall not be liable for any financial losses, damages, or adverse outcomes resulting from the use of this platform or reliance on its AI-generated insights. Use the service at your own risk.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
