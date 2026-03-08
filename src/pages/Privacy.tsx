import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Information Collection</h2>
            <p className="text-muted-foreground">We collect information you provide directly, including your name, email address, financial data (investments, debts, goals), and risk profile preferences. We also collect usage data such as pages visited and features used.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Data Usage</h2>
            <p className="text-muted-foreground">Your data is used to provide personalized financial insights, AI-powered investment recommendations, portfolio tracking, and debt management advice. We do not sell your personal data to third parties.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Data Storage</h2>
            <p className="text-muted-foreground">All data is stored securely using industry-standard encryption. Your financial information is protected with bank-level security measures. Data is stored on servers with strict access controls.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p className="text-muted-foreground">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Supabase</strong> — Authentication, database, and backend infrastructure</li>
              <li><strong className="text-foreground">Google Gemini AI</strong> — AI-powered financial advice and stock insights</li>
              <li><strong className="text-foreground">Yahoo Finance</strong> — Real-time stock price data and market information</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. User Rights</h2>
            <p className="text-muted-foreground">You have the right to access, update, or delete your personal data at any time through your account settings. You can export your data or request complete account deletion. We will respond to all data requests within 30 days.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
            <p className="text-muted-foreground">For privacy-related questions or concerns, please reach out through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
