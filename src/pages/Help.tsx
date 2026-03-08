import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const helpItems = [
  {
    question: 'How do I add investments to my portfolio?',
    answer: 'Go to the Investments page and click "Add Investment". Enter the stock symbol (e.g., RELIANCE, TCS, INFY), and the system will automatically validate it and fetch the current price. Fill in the number of shares, purchase price, and date, then click "Add Investment".'
  },
  {
    question: 'How do I use the AI Advisor?',
    answer: 'Navigate to the Dashboard and use the AI Advisor chat panel. Type your financial question — for example, "Should I invest in mutual funds?" or "How should I allocate ₹50,000?" The AI will provide personalized advice based on your portfolio and risk profile.'
  },
  {
    question: 'How do I manage my debts?',
    answer: 'Go to the Debt Advisor page to add and track your debts. Enter details like the amount, interest rate, and minimum payment. The AI will suggest optimal repayment strategies like the avalanche or snowball methods.'
  },
  {
    question: 'How do I change my account settings?',
    answer: 'Visit the Settings page from the navigation menu. You can update your profile information, change your password, set your preferred currency (INR is default), manage notification preferences, and view login sessions.'
  },
  {
    question: 'What are Premium features?',
    answer: 'Premium plans (starting at ₹199/month) unlock advanced AI investment advice, detailed portfolio analytics, priority support, exclusive market insights, and advanced financial calculators. Payment integration is coming soon.'
  },
  {
    question: 'Is my financial data secure?',
    answer: 'Yes. We use bank-level encryption, secure authentication via Supabase, and Row-Level Security to ensure only you can access your data. We never store your banking credentials.'
  },
  {
    question: 'How are stock prices fetched?',
    answer: 'We use Yahoo Finance APIs to fetch real-time stock prices. Indian stocks are automatically resolved with .NS (NSE) or .BO (BSE) suffixes. You can enter symbols like RELIANCE, TCS, INFY, HDFCBANK, etc.'
  },
];

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Help Center</h1>
        <p className="text-muted-foreground mb-8">Find answers to frequently asked questions about FinSage.</p>

        <Accordion type="single" collapsible className="space-y-2">
          {helpItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-foreground font-medium text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <Footer />
    </div>
  );
};

export default Help;
