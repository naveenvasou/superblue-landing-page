import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SuperblueLogo from './ui/logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-white/70 to-white/5 backdrop-blur-lg shadow-sm py-2"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <SuperblueLogo className="w-8 h-8" />
            <span className="text-2xl font-bold font-heading tracking-tight text-slate-900">
              SuperBlue
            </span>
          </div>

          {/* Desktop Links - Centered */}
          <div className="hidden md:flex items-center space-x-10 text-[16px] text-slate-600 font-normal">
            <button onClick={() => handleNavigation('#features')} className="hover:text-slate-900 transition-colors">Features</button>
            <button onClick={() => handleNavigation('#use-cases')} className="hover:text-slate-900 transition-colors">Use Cases</button>

          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate('/waitlist')}
              className="px-6 py-2.5 rounded-full border border-slate-900 text-slate-900 text-[15px] font-medium hover:border-slate-900 transition-colors duration-300"
            >
              Join Waitlist
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-800 p-2">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>


      </nav>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[58px] left-0 right-0 bg-white/70 backdrop-blur-lg border-b border-slate-200/60 p-6 md:hidden flex flex-col space-y-4 shadow-lg h-screen z-40">
          <button onClick={() => handleNavigation('#features')} className="text-xl font-medium text-slate-800 text-left">Features</button>
          <button onClick={() => handleNavigation('#use-cases')} className="text-xl font-medium text-slate-800 text-left">Use Cases</button>
          <div className="pt-4">
            <button
              onClick={() => {
                navigate('/waitlist');
                setMobileMenuOpen(false);
              }}
              className="w-full py-4 rounded-full bg-slate-900 text-white font-medium text-lg"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;