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
          <button
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 rounded-md"
            onClick={() => navigate('/')}
            aria-label="SuperBlue AI - Home"
          >
            <SuperblueLogo className="w-8 h-8" aria-hidden="true" />
            <span className="text-2xl font-bold font-heading tracking-tight text-slate-900">
              SuperBlue
            </span>
          </button>

          {/* Desktop Links - Centered */}
          <nav className="hidden md:flex items-center space-x-10 text-[16px] text-slate-600 font-normal">
            <button onClick={() => handleNavigation('#features')} className="hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 rounded px-2 py-1">Features</button>
            <button onClick={() => handleNavigation('#use-cases')} className="hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 rounded px-2 py-1">Use Cases</button>

          </nav>

          {/* CTA Button */}
           <div className="hidden md:block">
             <button
               onClick={() => navigate('/waitlist')}
               className="px-6 py-2.5 rounded-full border border-slate-900 text-slate-900 text-[15px] font-medium hover:border-slate-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
               aria-label="Join the SuperBlue AI waitlist"
             >
               Join Waitlist
             </button>
           </div>

           {/* Mobile Menu Toggle */}
           <div className="md:hidden">
             <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="text-slate-800 p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 rounded"
               aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
               aria-expanded={mobileMenuOpen}
               aria-controls="mobile-menu"
             >
               {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
             </button>
           </div>
        </div>


      </nav>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-menu"
          className="fixed top-[58px] left-0 right-0 bg-white/70 backdrop-blur-lg border-b border-slate-200/60 p-6 md:hidden flex flex-col space-y-4 shadow-lg h-screen z-40"
        >
          <button
            onClick={() => handleNavigation('#features')}
            className="text-xl font-medium text-slate-800 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 rounded px-2 py-1"
          >
            Features
          </button>
          <button
            onClick={() => handleNavigation('#use-cases')}
            className="text-xl font-medium text-slate-800 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 rounded px-2 py-1"
          >
            Use Cases
          </button>
          <div className="pt-4">
            <button
              onClick={() => {
                navigate('/waitlist');
                setMobileMenuOpen(false);
              }}
              className="w-full py-4 rounded-full bg-slate-900 text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              aria-label="Join the waitlist for SuperBlue AI"
            >
              Join Waitlist
            </button>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;