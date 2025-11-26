
import React, { useState } from 'react';
import { Phone, ChevronDown, Check } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
];

const ExperienceSection: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium text-slate-900 tracking-tight mb-4">
            Experience our Voice AI
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            See how natural and responsive our agents are. Pick a language and give it a try.
          </p>
        </div>

        {/* The Phone Interface */}
        <div className="relative group">
          {/* Outer glow/shadow for depth */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-[3.2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          {/* Phone Bezel */}
          <div className="relative w-[340px] h-[600px] bg-slate-950 rounded-[3rem] p-3 shadow-2xl ring-1 ring-slate-900/5">
            
            {/* Screen Area */}
            <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative flex flex-col items-center">
              
              {/* Dynamic Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900"></div>
              
              {/* Animated Orb/Glow in background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] animate-pulse"></div>

              {/* Dot Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-20" 
                style={{
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              ></div>

              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-16 px-6">
                
                {/* Caller Info */}
                <div className="text-center space-y-2 mt-8">
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-900/50">
                     <span className="text-2xl font-bold text-white">S</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-wide">SuperBlue AI</h3>
                  <p className="text-blue-200/80 text-sm font-medium tracking-wider uppercase animate-pulse">Incoming Call...</p>
                </div>

                {/* Call Action */}
                <div className="relative mt-auto mb-12">
                  {/* Ripple Effects */}
                  <div className="absolute inset-0 bg-white/10 rounded-full animate-ping delay-75"></div>
                  <div className="absolute inset-0 bg-white/5 rounded-full animate-ping delay-300"></div>
                  
                  {/* Main Button */}
                  <button 
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-300 cursor-pointer z-20 group"
                  >
                    <Phone className={`w-8 h-8 text-slate-900 fill-current transition-transform duration-300 ${isHovering ? 'rotate-12' : ''}`} />
                  </button>
                </div>

                {/* Instructions & Language Selector */}
                <div className="text-center w-full space-y-6 mb-4">
                  <p className="text-white/60 text-sm font-medium">Click to talk to the bot</p>
                  
                  {/* Custom Dropdown */}
                  <div className="relative inline-block text-left w-full max-w-[140px]">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="inline-flex w-full justify-between items-center px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md rounded-xl text-sm font-medium text-white transition-all duration-200"
                    >
                      {selectedLang.label}
                      <ChevronDown className={`ml-2 -mr-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 w-full origin-bottom rounded-xl bg-slate-800/90 backdrop-blur-xl ring-1 ring-white/10 focus:outline-none shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="py-1">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setSelectedLang(lang);
                                setIsDropdownOpen(false);
                              }}
                              className="group flex w-full items-center justify-between px-4 py-3 text-sm text-left text-gray-200 hover:bg-white/10 transition-colors"
                            >
                              {lang.label}
                              {selectedLang.code === lang.code && (
                                <Check className="h-3 w-3 text-blue-400" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
