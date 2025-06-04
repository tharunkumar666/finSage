
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const RiskQuiz = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('');

  const questions = [
    {
      id: 1,
      question: "What is your age group?",
      options: [
        { text: "Under 25", score: 4 },
        { text: "25-35", score: 3 },
        { text: "36-50", score: 2 },
        { text: "Over 50", score: 1 }
      ]
    },
    {
      id: 2,
      question: "What is your investment experience?",
      options: [
        { text: "Complete beginner", score: 1 },
        { text: "Some experience", score: 2 },
        { text: "Moderate experience", score: 3 },
        { text: "Highly experienced", score: 4 }
      ]
    },
    {
      id: 3,
      question: "How long do you plan to invest?",
      options: [
        { text: "Less than 1 year", score: 1 },
        { text: "1-3 years", score: 2 },
        { text: "3-10 years", score: 3 },
        { text: "More than 10 years", score: 4 }
      ]
    },
    {
      id: 4,
      question: "How would you react to a 20% drop in your portfolio value?",
      options: [
        { text: "Sell everything immediately", score: 1 },
        { text: "Sell some investments", score: 2 },
        { text: "Hold and wait", score: 3 },
        { text: "Buy more at lower prices", score: 4 }
      ]
    },
    {
      id: 5,
      question: "What is your primary investment goal?",
      options: [
        { text: "Capital preservation", score: 1 },
        { text: "Steady income", score: 2 },
        { text: "Moderate growth", score: 3 },
        { text: "Maximum growth", score: 4 }
      ]
    },
    {
      id: 6,
      question: "What percentage of your income can you invest?",
      options: [
        { text: "Less than 5%", score: 1 },
        { text: "5-10%", score: 2 },
        { text: "10-20%", score: 3 },
        { text: "More than 20%", score: 4 }
      ]
    },
    {
      id: 7,
      question: "How important is liquidity (easy access to your money)?",
      options: [
        { text: "Very important", score: 1 },
        { text: "Somewhat important", score: 2 },
        { text: "Not very important", score: 3 },
        { text: "Not important at all", score: 4 }
      ]
    },
    {
      id: 8,
      question: "What is your knowledge of financial markets?",
      options: [
        { text: "Very limited", score: 1 },
        { text: "Basic understanding", score: 2 },
        { text: "Good understanding", score: 3 },
        { text: "Expert level", score: 4 }
      ]
    },
    {
      id: 9,
      question: "How do you typically make financial decisions?",
      options: [
        { text: "Very cautiously", score: 1 },
        { text: "After careful research", score: 2 },
        { text: "With moderate research", score: 3 },
        { text: "Quickly and confidently", score: 4 }
      ]
    },
    {
      id: 10,
      question: "What would you prefer in terms of returns?",
      options: [
        { text: "Low returns, low risk", score: 1 },
        { text: "Moderate returns, moderate risk", score: 2 },
        { text: "Good returns, some risk", score: 3 },
        { text: "High returns, high risk", score: 4 }
      ]
    }
  ];

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    // Auto-forward to next question after 500ms delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResult(newAnswers);
      }
    }, 500);
  };

  const calculateResult = (finalAnswers: number[]) => {
    const totalScore = finalAnswers.reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    
    let level = '';
    if (percentage <= 30) level = 'Conservative';
    else if (percentage <= 60) level = 'Moderate';
    else level = 'Aggressive';
    
    setRiskScore(totalScore);
    setRiskLevel(level);
    setIsCompleted(true);
  };

  const handleStartOver = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setRiskScore(0);
    setRiskLevel('');
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">Assessment Complete!</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-2">Your Risk Profile</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">{riskLevel}</div>
                <div className="text-gray-600">Score: {riskScore}/40</div>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={handleContinue} className="bg-green-600 hover:bg-green-700">
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleStartOver}>
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Assessment</h1>
          <p className="text-gray-600">Help us understand your investment preferences</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-green-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              {questions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default RiskQuiz;
