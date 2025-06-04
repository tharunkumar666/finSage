
import { Link } from 'react-router-dom';
import { TrendingUp, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                Fin<span className="text-green-400">Sage</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering students with AI-powered financial advice, investment strategies, 
              and debt management tools to build a secure financial future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/quiz" className="text-gray-400 hover:text-white transition-colors">
                  Risk Assessment
                </Link>
              </li>
              <li>
                <Link to="/investments" className="text-gray-400 hover:text-white transition-colors">
                  Investments
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="text-gray-400 hover:text-white transition-colors">
                  Calculators
                </Link>
              </li>
              <li>
                <Link to="/debt" className="text-gray-400 hover:text-white transition-colors">
                  Debt Advisor
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FinSage. All rights reserved. Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
