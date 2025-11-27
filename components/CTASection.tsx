
import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="relative w-full py-32 md:py-48 bg-gradient-to-b from-white via-blue-50/30 to-indigo-100/40 overflow-hidden flex flex-col items-center justify-center">

      {/* Content Container */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight">
          Transform your customer interactions <br className="hidden md:block" />
          with SuperBlue AI agents
        </h2>

        <button className="group relative inline-flex items-center justify-center px-10 py-4 bg-slate-950 text-white rounded-full text-lg font-medium overflow-hidden transition-all duration-300 hover:bg-slate-900 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-900/20">
          <span className="relative z-10">Get started</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Watermark Background */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none flex justify-center translate-y-[25%] select-none z-10">
        <span
          className="font-serif italic font-bold text-[22vw] leading-none tracking-tighter text-white opacity-80 mix-blend-overlay"
          style={{
            textShadow: '0 0 80px rgba(255,255,255,0.8)'
          }}
        >
          SuperBlue
        </span>
      </div>

      {/* Subtle bottom fade to ensure page ends cleanly if desired, though watermark is the feature */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-50/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default CTASection;
