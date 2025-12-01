
import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

import SuperblueLogo from './ui/logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 relative z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 pr-8">
            <div className="flex items-center gap-2">
              <SuperblueLogo className="w-8 h-8" />
              <span className="text-xl font-bold font-heading tracking-tight text-white">
                SuperBlue
              </span>
            </div>
            <p className="mt-6 text-slate-400 text-sm leading-relaxed">
              Building the next generation of voice AI agents that sound human and scale infinitely.
            </p>
          </div>

          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} SuperBlue AI
            </p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
