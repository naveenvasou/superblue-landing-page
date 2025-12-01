
import React, { useState } from 'react';
import PilotDialog from './PilotDialog';

const CTASection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <section className="relative w-full py-32 md:py-48 bg-gradient-to-b from-white via-blue-50/30 to-indigo-100/40 overflow-hidden flex flex-col items-center justify-center">

      {/* Content Container */}
      <div className="relative z-20 max-w-3xl mx-auto px-2 text-center">
        <h2 className="px-6 md:px-2 text-3xl md:text-5xl font-medium text-slate-900 mb-14 leading-[1.2] md:leading-[1.5] tracking-tight ">
          Transform your customer interactions <br className="hidden md:block" />
          with SuperBlue AI agents
        </h2>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="group relative inline-flex items-center justify-center px-10 py-4 bg-slate-950 text-white rounded-full text-lg font-medium overflow-hidden transition-all duration-300 hover:bg-slate-900 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-900/20"
        >
          <span className="relative z-10">Start a pilot</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <PilotDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>

      {/* Watermark Background */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none flex justify-center translate-y-[10%] select-none z-10">
        <span
          className="font-heading italic font-bold text-[22vw] leading-none tracking-tighter text-white opacity-80 mix-blend-overlay"
          style={{
            textShadow: '0 0 80px rgba(255,255,255,0.8)'
          }}
        >
          SuperBlue
        </span>
      </div>

      {/* Subtle bottom fade to ensure page ends cleanly if desired, though watermark is the feature */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-100/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default CTASection;
