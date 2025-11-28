import React from 'react';


const Hero: React.FC = () => {
  return (
    <section className="relative w-full pt-18 md:pt-48 md:pb-24 overflow-hidden flex flex-col items-center justify-center min-h-[70vh] md:min-h-[80vh] bg-white">

      {/* 
        Aesthetic Gradient Background 
        Strategy: Use a massive Conic Gradient that rotates. 
        This creates the "going around" effect in a predictable, circular way.
      */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        {/* The Rotating Aura */}
        {/* The Rotating Aura - Desktop */}
        <div
          className="hidden md:block w-[300vw] h-[300vw] opacity-40 blur-[150px] animate-[spin_8s_linear_infinite]"
          style={{
            background: `conic-gradient(
              from 0deg at 50% 50%,
              #FFFFFF 0deg,
              #E0F2FE 60deg,
              #3B82F6 120deg,
              #E0F2FE 180deg,
              #FFFFFF 240deg,
              #60A5FA 300deg,
              #FFFFFF 360deg
            )`
          }}
        />

        {/* The Rotating Aura - Mobile (Optimized) */}
        <div
          className="md:hidden w-[240vw] h-[240vw] opacity-50 blur-[80px] animate-[spin_8s_linear_infinite]"
          style={{
            background: `conic-gradient(
              from 0deg at 50% 50%,
              #DBEAFE 0deg,
              #3B82F6 120deg,
              #DBEAFE 180deg,
              #60A5FA 300deg,
              #DBEAFE 360deg
            )`
          }}
        />

        {/* Central White Glow to improve text readability and softness */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/60 md:to-white/90"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">

        {/* Main Heading matching the 'Wonderful' layout */}
        <h1 className="text-[2rem] md:text-[4rem] lg:text-[4rem] font-semibold tracking-tight text-slate-800 leading-[1.3] mb-16">
          Your business-ready Voice AI
          that outperforms humans
        </h1>



        {/* Buttons */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <button className="px-6 py-4 bg-slate-950 text-white rounded-full text-sm md:text-lg font-medium hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-[90%] md:w-auto">
            Join Waitlist
          </button>

          <a href="#experience" className="px-6 py-4 bg-white text-slate-900 border border-slate-900 rounded-full text-sm md:text-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 w-[90%] md:w-auto">
            See it in action
          </a>
        </div>
      </div>

      {/* Fade at bottom to blend with any potential following content */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;