
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const questions = [
  {
    id: 1,
    question: "What is your current age?",
    options: [
      { value: "1", text: "18-22 years", score: 4 },
      { value: "2", text: "23-27 years", score: 3 },
      { value: "3", text: "28-35 years", score: 2 },
      { value: "4", text: "Above 35 years", score: 1 }
    ]
  },
  {
    id: 2,
    question: "What is your investment experience?",
    options: [
      { value: "1", text: "Complete beginner", score: 1 },
      { value: "2", text: "Some knowledge through courses/reading", score: 2 },
      { value: "3", text: "Have invested in mutual funds/stocks before", score: 3 },
      { value: "4", text: "Experienced investor with diverse portfolio", score: 4 }
    ]
  },
  {
    id: 3,
    question: "How would you react if your investment lost 20% in a month?",
    options: [
      { value: "1", text: "Panic and sell immediately", score: 1 },
      { value: "2", text: "Feel worried but hold", score: 2 },
      { value: "3", text: "Stay calm and review strategy", score: 3 },
      { value: "4", text: "See it as a buying opportunity", score: 4 }
    ]
  },
  {
    id: 4,
    question: "What is your primary investment goal?",
    options: [
      { value: "1", text: "Preserve capital with minimal risk", score: 1 },
      { value: "2", text: "Steady growth with moderate risk", score: 2 },
      { value: "3", text: "Good returns with some volatility", score: 3 },
      { value: "4", text: "Maximum growth, comfortable with high risk", score: 4 }
    ]
  },
  {
    id: 5,
    question: "How much of your monthly income can you invest?",
    options: [
      { value: "1", text: "Less than 10%", score: 1 },
      { value: "2", text: "10-20%", score: 2 },
      { value: "3", text: "20-30%", score: 3 },
      { value: "4", text: "More than 30%", score: 4 }
    ]
  },
  {
    id: 6,
    question: "When do you need to access your investments?",
    options: [
      { value: "1", text: "Within 1 year", score: 1 },
      { value: "2", text: "1-3 years", score: 2 },
      { value: "3", text: "3-5 years", score: 3 },
      { value: "4", text: "More than 5 years", score: 4 }
    ]
  },
  {
    id: 7,
    question: "How do you feel about market volatility?",
    options: [
      { value: "1", text: "Very uncomfortable, prefer stability", score: 1 },
      { value: "2", text: "Somewhat uncomfortable", score: 2 },
      { value: "3", text: "Neutral, understand it's part of investing", score: 3 },
      { value: "4", text: "Comfortable, see it as opportunity", score: 4 }
    ]
  },
  {
    id: 8,
    question: "What type of returns do you expect annually?",
    options: [
      { value: "1", text: "5-7% (bank FD level)", score: 1 },
      { value: "2", text: "8-12% (moderate growth)", score: 2 },
      { value: "3", text: "12-18% (good growth)", score: 3 },
      { value: "4", text: "18%+ (high growth)", score: 4 }
    ]
  },
  {
    id: 9,
    question: "Do you have an emergency fund covering 6 months of expenses?",
    options: [
      { value: "1", text: "No emergency fund", score: 1 },
      { value: "2", text: "1-3 months covered", score: 2 },
      { value: "3", text: "3-6 months covered", score: 3 },
      { value: "4", text: "6+ months covered", score: 4 }
    ]
  },
  {
    id: 10,
    question: "How do you prefer to monitor your investments?",
    options: [
      { value: "1", text: "Daily tracking, frequent adjustments", score: 2 },
      { value: "2", text: "Weekly check-ins", score: 3 },
      { value: "3", text: "Monthly reviews", score: 4 },
      { value: "4", text: "Quarterly or annual reviews", score: 4 }
    ]
  }
];

const RiskQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [riskProfile, setRiskProfile] = useState<{level: string, score: number} | null>(null);
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateRiskProfile();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateRiskProfile = () => {
    let totalScore = 0;
    
    Object.entries(answers).forEach(([questionIndex, answerValue]) => {
      const question = questions[parseInt(questionIndex)];
      const selectedOption = question.options.find(opt => opt.value === answerValue);
      if (selectedOption) {
        totalScore += selectedOption.score;
      }
    });

    let level = '';
    if (totalScore <= 15) {
      level = 'Conservative';
    } else if (totalScore <= 25) {
      level = 'Moderate';
    } else if (totalScore <= 35) {
      level = 'Aggressive';
    } else {
      level = 'Very Aggressive';
    }

    setRiskProfile({ level, score: totalScore });
    setIsComplete(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isComplete && riskProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-2xl">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Risk Assessment Complete!
            </CardTitle>
            <CardDescription className="text-lg">
              Your personalized investment profile is ready
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Risk Profile: {riskProfile.level}
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                Score: {riskProfile.score}/40
              </p>
              
              <div className="text-left space-y-2">
                {riskProfile.level === 'Conservative' && (
                  <>
                    <p className="text-gray-700">
                      • Prefer stable, low-risk investments
                    </p>
                    <p className="text-gray-700">
                      • Focus on capital preservation
                    </p>
                    <p className="text-gray-700">
                      • Recommended: Bonds, CDs, high-yield savings
                    </p>
                  </>
                )}
                {riskProfile.level === 'Moderate' && (
                  <>
                    <p className="text-gray-700">
                      • Balanced approach to risk and returns
                    </p>
                    <p className="text-gray-700">
                      • Comfortable with some market fluctuations
                    </p>
                    <p className="text-gray-700">
                      • Recommended: Index funds, balanced ETFs
                    </p>
                  </>
                )}
                {riskProfile.level === 'Aggressive' && (
                  <>
                    <p className="text-gray-700">
                      • Seeking higher returns, comfortable with volatility
                    </p>
                    <p className="text-gray-700">
                      • Long-term investment horizon
                    </p>
                    <p className="text-gray-700">
                      • Recommended: Growth stocks, international funds
                    </p>
                  </>
                )}
                {riskProfile.level === 'Very Aggressive' && (
                  <>
                    <p className="text-gray-700">
                      • Maximum growth potential focus
                    </p>
                    <p className="text-gray-700">
                      • High risk tolerance
                    </p>
                    <p className="text-gray-700">
                      • Recommended: Individual stocks, crypto, growth funds
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/investments')}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
              >
                View Investment Recommendations
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="w-full text-lg py-3"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl font-bold">
              Risk Assessment Quiz
            </CardTitle>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <RadioGroup 
              value={answers[currentQuestion] || ''} 
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex-1 text-base cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-6">
            <Button 
              onClick={prevQuestion}
              variant="outline"
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button 
              onClick={nextQuestion}
              disabled={!answers[currentQuestion]}
              className="bg-green-600 hover:bg-green-700"
            >
              {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskQuiz;
