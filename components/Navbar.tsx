import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-white/70 to-white/5 backdrop-blur-lg shadow-sm py-2"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            SuperBlue
          </span>
        </div>

        {/* Desktop Links - Centered */}
        <div className="hidden md:flex items-center space-x-10 text-[16px] text-slate-600 font-normal">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#use-cases" className="hover:text-slate-900 transition-colors">Use Cases</a>
          <a href="#" className="hover:text-slate-900 transition-colors">About</a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="px-6 py-2.5 rounded-full border border-slate-900 text-slate-900 text-[15px] font-medium hover:border-slate-900 transition-colors duration-300">
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-slate-200/60 p-6 md:hidden flex flex-col space-y-4 shadow-lg h-screen">
          <a href="#features" className="text-xl font-medium text-slate-800">Features</a>
          <a href="#use-cases" className="text-xl font-medium text-slate-800">Use Cases</a>
          <a href="#" className="text-xl font-medium text-slate-800">Careers</a>
          <a href="#" className="text-xl font-medium text-slate-800">About</a>
          <div className="pt-4">
            <button className="w-full py-4 rounded-full bg-slate-900 text-white font-medium text-lg">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;