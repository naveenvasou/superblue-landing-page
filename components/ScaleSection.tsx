
import React from 'react';

const stats = [
  {
    value: '<500 ms',
    label: 'Average Response Time',
    description: 'Sub-second latency ensures conversations flow naturally without awkward pauses.',
  },
  {
    value: '99.9%',
    label: 'Uptime SLA',
    description: 'Enterprise-grade reliability built on distributed, redundant infrastructure.',
  },
  {
    value: '10x',
    label: 'More Productive',
    description: 'One agent handles thousands of concurrent calls, scaling instantly with demand.',
  }
];

const ScaleSection: React.FC = () => {
  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden text-white" aria-labelledby="scale-heading">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Glowing Orb Top Left */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] opacity-50" />
        {/* Glowing Orb Bottom Right */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50" />

        {/* Subtle Grid Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 id="scale-heading" className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Real-World Scale</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our infrastructure handles peak traffic effortlessly, ensuring your voice agent is always available and always fast.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex-1 w-full text-center relative group">

              {/* Left Divider (Desktop Only) */}
              <div className="hidden md:block absolute left-[-1rem] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

              {/* Right Divider (Desktop Only) - Last Item Only */}
              {index === stats.length - 1 && (
                <div className="hidden md:block absolute right-[-1rem] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
              )}

              <div className="px-4">
                {/* Large Value */}
                <div className="text-5xl md:text-6xl lg:text-7xl font-semibold font-heading tracking-tighter text-white mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  {stat.value}
                </div>

                {/* Label */}
                <h3 className="text-xl font-medium text-blue-200 mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ScaleSection;
