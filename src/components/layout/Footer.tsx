
import { Link } from 'react-router-dom';
import { TrendingUp, Twitter, Linkedin, Github, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Risk Assessment', href: '/quiz' },
      { name: 'Investments', href: '/investments' },
      { name: 'Calculators', href: '/calculators' },
      { name: 'Debt Advisor', href: '/debt' },
      { name: 'Goals', href: '/goals' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Features', href: '/features' },
      { name: 'Contact', href: '/contact' },
      { name: 'Premium', href: '/premium' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Help Center', href: '/help' },
    ],
  };

  return (
    <footer role="contentinfo" className="relative overflow-hidden border-t border-border">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/[0.02] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2.5 mb-4 group">
              <div className="gradient-bg p-2 rounded-xl transition-transform duration-300 group-hover:scale-105">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                Fin<span className="gradient-text">Sage</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Empowering Indian students with AI-powered financial advice, 
              investment strategies, and smart debt management tools.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={Icon === Twitter ? 'Twitter' : Icon === Linkedin ? 'LinkedIn' : 'GitHub'}
                  className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} FinSage. Built for Indian students, with ❤️
          </p>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <span className="text-xs font-semibold gradient-text">AI + Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
