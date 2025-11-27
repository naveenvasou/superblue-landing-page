import React from 'react';


const Hero: React.FC = () => {
  return (
    <section className="relative w-full pt-24 pb-8 md:pt-48 md:pb-24 overflow-hidden flex flex-col items-center justify-center min-h-[75vh] md:min-h-[90vh] bg-white">

      {/* 
        Aesthetic Gradient Background 
        Strategy: Use a massive Conic Gradient that rotates. 
        This creates the "going around" effect in a predictable, circular way.
      */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        {/* The Rotating Aura */}
        <div
          className="w-[150vw] h-[150vw] md:w-[120vw] md:h-[120vw] opacity-70 md:opacity-40 blur-[60px] md:blur-[120px] animate-spin-slow"
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

        {/* Central White Glow to improve text readability and softness */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/60 md:to-white/90"></div>
      </div>

      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">

        {/* Main Heading matching the 'Wonderful' layout */}
        <h1 className="text-[3rem] md:text-[4rem] lg:text-[5rem] font-normal tracking-tight text-slate-900 leading-[1.1] mb-12">
          Voice AI That Talk Like Humans  <br />
          And Scale Like Machines.
        </h1>



        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-4 bg-slate-950 text-white rounded-full text-lg font-medium hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Join Waitlist
          </button>

          <a href="#experience" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full text-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
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